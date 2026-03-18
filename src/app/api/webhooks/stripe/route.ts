// src/app/api/webhooks/stripe/route.ts
// GÜVENLİK DÜZELTMESİ: Idempotency koruması eklendi.
// checkout.session.completed: PENDING durumundaki siparişleri günceller,
// zaten CONFIRMED veya sonraki durumda olanları atlar — çift işlem engeli.
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { constructWebhookEvent } from '@/lib/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body      = await request.arrayBuffer()
  const payload   = Buffer.from(body)
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(payload, signature)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        if (!orderId) {
          console.error('[stripe-webhook] checkout.session.completed: orderId yok')
          break
        }

        // Idempotency: önce mevcut durumu kontrol et
        const existing = await db.order.findUnique({
          where:  { id: orderId },
          select: { status: true, paymentStatus: true },
        })

        if (!existing) {
          console.error(`[stripe-webhook] Sipariş bulunamadı: ${orderId}`)
          break
        }

        // Zaten ödendi ise tekrar işleme — çift ödeme kaydını engelle
        if (existing.paymentStatus === 'PAID') {
          console.warn(`[stripe-webhook] Sipariş zaten ödendi, atlanıyor: ${orderId}`)
          break
        }

        await db.order.update({
          where: { id: orderId },
          data: {
            status:          'CONFIRMED',
            paymentStatus:   'PAID',
            stripePaymentId: session.payment_intent as string,
            paymentMethod:   'card',
          },
        })
        console.log(`[stripe-webhook] ✅ Sipariş onaylandı: ${orderId}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const intent  = event.data.object as Stripe.PaymentIntent
        const orderId = intent.metadata?.orderId
        if (!orderId) break

        const order = await db.order.findUnique({
          where:   { id: orderId },
          include: { items: true },
        })
        if (!order) break

        // Yalnızca PENDING siparişleri iptal et — sonraki durumları koruma
        if (order.status === 'PENDING') {
          await db.order.update({
            where: { id: orderId },
            data:  { status: 'CANCELLED', paymentStatus: 'FAILED' },
          })
          await Promise.all(
            order.items.map(item =>
              db.product.update({
                where: { id: item.productId },
                data:  { stock: { increment: item.quantity } },
              })
            )
          )
          console.log(`[stripe-webhook] ❌ Ödeme başarısız, stok geri eklendi: ${orderId}`)
        }
        break
      }

      case 'charge.refunded': {
        const charge          = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent as string | null
        if (!paymentIntentId) break

        const isFullRefund = charge.amount_refunded === charge.amount
        await db.order.updateMany({
          where: { stripePaymentId: paymentIntentId },
          data: {
            status:        'REFUNDED',
            paymentStatus: isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
          },
        })
        console.log(`[stripe-webhook] 💰 İade işlendi: ${paymentIntentId}`)
        break
      }

      default:
        console.log(`[stripe-webhook] İşlenmemiş event: ${event.type}`)
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    console.error('[stripe-webhook] Handler hatası:', message, { eventType: event.type })
    // 200 döndür — Stripe 5xx'te tekrar dener ve çift işleme neden olabilir
    return NextResponse.json({ received: true, warning: 'Handler hatası loglandı' })
  }

  return NextResponse.json({ received: true })
}
