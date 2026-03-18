// src/app/api/checkout/session/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { checkoutSchema } from '@/lib/validation'
import {
  parseBody, successResponse, errorResponse, generateOrderNumber,
} from '@/lib/api-helpers'
import { checkoutRateLimit } from '@/lib/rate-limit'
import {
  createCheckoutSession, calculateShipping, calculateTax, type ShippingMethod,
} from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const limited = await checkoutRateLimit(request)
  if (limited) return limited

  const { data, error } = await parseBody(request, checkoutSchema)
  if (error) return error

  // ── 1. Ürün ve stok doğrulama ─────────────────────────
  const productIds = data.items.map(i => i.productId)
  const products   = await db.product.findMany({
    where:   { id: { in: productIds }, isActive: true },
    include: { images: { take: 1, orderBy: { position: 'asc' } } },
  })

  if (products.length !== data.items.length) {
    return errorResponse('Bir veya daha fazla ürün mevcut değil', 400)
  }

  type OrderItem = { productId: string; name: string; price: number; quantity: number; image?: string }
  const orderItems: OrderItem[] = []

  for (const item of data.items) {
    const product = products.find(p => p.id === item.productId)!
    if (product.stock < item.quantity) {
      return errorResponse(
        `"${product.name}" için yetersiz stok. Mevcut: ${product.stock}`, 400
      )
    }
    orderItems.push({
      productId: item.productId,
      name:      product.name,
      price:     product.price,
      quantity:  item.quantity,
      image:     product.images[0]?.url,
    })
  }

  // ── 2. Toplam hesaplama (coupon KALDIRILDI) ───────────
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)

  const shippingMethod = data.shippingMethod as ShippingMethod
  const shippingCost   = calculateShipping(subtotal, shippingMethod)
  const tax            = calculateTax(subtotal, data.country)
  const total          = subtotal + shippingCost + tax

  const session = await getSession()
  const userId  = session?.id ?? undefined

  let order: Awaited<ReturnType<typeof db.order.create>>
  let address: Awaited<ReturnType<typeof db.address.create>>

  // ── 3. TRANSACTION ───────────────────────────────────
  try {
    const result = await db.$transaction(async (tx) => {

      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where:  { id: item.productId },
          select: { stock: true, name: true },
        })
        if (!product || product.stock < item.quantity) {
          throw new Error(
            `"${product?.name ?? item.name}" için yetersiz stok (eşzamanlı istek).`
          )
        }
      }

      const newAddress = await tx.address.create({
        data: {
          firstName:  data.firstName,
          lastName:   data.lastName,
          address1:   data.address1,
          address2:   data.address2,
          city:       data.city,
          state:      data.state,
          postalCode: data.postalCode,
          country:    data.country,
          phone:      data.phone,
          userId,
        },
      })

      const newOrder = await tx.order.create({
        data: {
          orderNumber:   generateOrderNumber(),
          email:         data.email,
          status:        'PENDING',
          paymentStatus: 'UNPAID',
          subtotal:      subtotal,
          shipping:      shippingCost,
          tax:           tax,
          discount:      0,
          total:         total,
          addressId:     newAddress.id,
          userId,
          items: {
            create: orderItems.map(item => ({
              productId: item.productId,
              name:      item.name,
              price:     item.price,
              quantity:  item.quantity,
              image:     item.image,
            })),
          },
        },
      })

      await Promise.all(
        orderItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } },
          })
        )
      )

      return { order: newOrder, address: newAddress }
    })

    order   = result.order
    address = result.address
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Sipariş oluşturulamadı',
      400
    )
  }

  // ── 4. Stripe ────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    const stripeSession = await createCheckoutSession({
      items:          orderItems,
      email:          data.email,
      orderId:        order.id,
      shippingAmount: shippingCost,
      taxAmount:      tax,
      successUrl: `${appUrl}/checkout/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:  `${appUrl}/checkout`,
    })

    return successResponse({
      orderId:         order.id,
      orderNumber:     order.orderNumber,
      stripeSessionId: stripeSession.id,
      stripeUrl:       stripeSession.url,
      total:           order.total,
    })
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    return errorResponse('Ödeme sistemi hatası', 503)
  }
}
