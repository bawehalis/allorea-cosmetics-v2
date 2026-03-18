// src/lib/stripe.ts
import Stripe from 'stripe'

// Production'da Stripe key yoksa başlangıçta crash et
if (!process.env.STRIPE_SECRET_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FATAL: STRIPE_SECRET_KEY environment variable is not set. ' +
      'Payments cannot function without it.'
    )
  } else {
    console.warn('[stripe] STRIPE_SECRET_KEY is not set — payments will fail in dev')
  }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-04-10',
  typescript: true,
  appInfo: { name: 'Allorea Cosmetics', version: '1.0.0' },
})

export const SHIPPING_RATES = {
  standard:  { label: 'Standard Shipping (5–7 days)', price: 7.99 },
  express:   { label: 'Express Shipping (2–3 days)',  price: 18.99 },
  overnight: { label: 'Overnight Shipping',           price: 34.99 },
} as const

export type ShippingMethod = keyof typeof SHIPPING_RATES

export function calculateShipping(subtotal: number, method: ShippingMethod): number {
  if (subtotal >= 75 && method === 'standard') return 0
  return SHIPPING_RATES[method].price
}

const TAX_RATES: Record<string, number> = {
  'United States': 0.08,
  'United Kingdom': 0.20,
  'Canada': 0.13,
  'Australia': 0.10,
  'France': 0.20,
  'Germany': 0.19,
  'Spain': 0.21,
  'Italy': 0.22,
  'Japan': 0.10,
}

export function calculateTax(subtotal: number, country: string): number {
  const rate = TAX_RATES[country] ?? 0.08
  return Math.round(subtotal * rate * 100) / 100
}

interface CheckoutSessionParams {
  items: Array<{ name: string; price: number; quantity: number; image?: string }>
  email: string
  orderId: string
  shippingAmount: number
  taxAmount: number
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        ...(item.image ? { images: [item.image] } : {}),
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    customer_email: params.email,
    shipping_options: [{
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: Math.round(params.shippingAmount * 100),
          currency: 'usd',
        },
        display_name: 'Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 5 },
          maximum: { unit: 'business_day', value: 7 },
        },
      },
    }],
    metadata: { orderId: params.orderId },
    success_url: params.successUrl,
    cancel_url:  params.cancelUrl,
    payment_intent_data: { metadata: { orderId: params.orderId } },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  })
}

export function constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
