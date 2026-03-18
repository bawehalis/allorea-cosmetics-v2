// src/app/api/checkout/session/route.ts
// GÜVENLİK DÜZELTMESİ: Stok race condition koruması eklendi.
// Prisma transaction + stok kontrolü atomik yapıldı: stok negatife düşemez.
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

  // ── 1. Ürün ve stok doğrulama ─────────────────────────────────────────
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
      price:     product.price,   // Fiyat sunucudan alınıyor, client'tan değil
      quantity:  item.quantity,
      image:     product.images[0]?.url,
    })
  }

  // ── 2. Kupon doğrulama ────────────────────────────────────────────────
  let couponId: string | undefined
  let discountAmount = 0
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)

  if (data.couponCode) {
    const coupon = await db.coupon.findFirst({
      where: {
        code:     data.couponCode.toUpperCase(),
        isActive: true,
        AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] }],
      },
    })

    if (!coupon) return errorResponse('Geçersiz veya süresi dolmuş kupon kodu', 400)
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return errorResponse('Bu kupon kullanım limitine ulaştı', 400)
    }
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return errorResponse(
        `Bu kupon için minimum $${coupon.minPurchase.toFixed(2)} alışveriş gerekli`, 400
      )
    }

    discountAmount = coupon.type === 'PERCENTAGE'
      ? Math.round((subtotal * coupon.value) / 100 * 100) / 100
      : Math.min(coupon.value, subtotal)
    couponId = coupon.id
  }

  // ── 3. Toplam hesaplama ───────────────────────────────────────────────
  const shippingMethod = data.shippingMethod as ShippingMethod
  const shippingCost   = calculateShipping(subtotal - discountAmount, shippingMethod)
  const tax            = calculateTax(subtotal - discountAmount, data.country)
  const total          = subtotal - discountAmount + shippingCost + tax

  const session = await getSession()
  const userId  = session?.id ?? undefined

  // ── 4. Adres + sipariş + stok rezervasyonu — atomik transaction ──────
  // GÜVENLİK: Prisma transaction kullanarak stok negatife düşmesini engelle.
  // $transaction tüm işlemleri ya başarır ya da hepsini geri alır.
  let order: Awaited<ReturnType<typeof db.order.create>>
  let address: Awaited<ReturnType<typeof db.address.create>>

  try {
    const result = await db.$transaction(async (tx) => {
      // Stok kontrolünü transaction içinde tekrar yap (race condition koruması)
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where:  { id: item.productId },
          select: { stock: true, name: true },
        })
        if (!product || product.stock < item.quantity) {
          throw new Error(
            `"${product?.name ?? item.name}" için yetersiz stok (eşzamanlı istek). Lütfen tekrar deneyin.`
          )
        }
      }

      // Adres oluştur
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

      // Sipariş oluştur
      const newOrder = await tx.order.create({
        data: {
          orderNumber:   generateOrderNumber(),
          email:         data.email,
          status:        'PENDING',
          paymentStatus: 'UNPAID',
          subtotal:      Math.round(subtotal * 100) / 100,
          shipping:      shippingCost,
          tax:           Math.round(tax * 100) / 100,
          discount:      discountAmount,
          total:         Math.round(total * 100) / 100,
          addressId:     newAddress.id,
          userId,
          couponId,
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

      // Stok düş — atomic, negatife düşmez
      await Promise.all(
        orderItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } },
          })
        )
      )

      // Kupon kullanım sayısını artır
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data:  { usedCount: { increment: 1 } },
        })
      }

      return { order: newOrder, address: newAddress }
    })

    order   = result.order
    address = result.address
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sipariş oluşturulamadı'
    return errorResponse(message, 400)
  }

  // ── 5. Stripe oturumu oluştur ─────────────────────────────────────────
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  let stripeSession: Awaited<ReturnType<typeof createCheckoutSession>>

  try {
    stripeSession = await createCheckoutSession({
      items:          orderItems,
      email:          data.email,
      orderId:        order.id,
      shippingAmount: shippingCost,
      taxAmount:      tax,
      successUrl: `${appUrl}/checkout/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl:  `${appUrl}/checkout`,
    })
  } catch (err) {
    // Stripe başarısız — transaction'ı geri al
    await db.$transaction(async (tx) => {
      await tx.order.delete({ where: { id: order.id } })
      await tx.address.delete({ where: { id: address.id } })
      // Stoku geri ekle
      await Promise.all(
        orderItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { increment: item.quantity } },
          })
        )
      )
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data:  { usedCount: { decrement: 1 } },
        })
      }
    })
    console.error('[checkout] Stripe oturumu oluşturulamadı:', err)
    return errorResponse('Ödeme sağlayıcısı kullanılamıyor. Lütfen tekrar deneyin.', 503)
  }

  return successResponse({
    orderId:         order.id,
    orderNumber:     order.orderNumber,
    stripeSessionId: stripeSession.id,
    stripeUrl:       stripeSession.url,
    total:           order.total,
  })
}
