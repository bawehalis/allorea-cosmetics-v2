'use client'
// src/components/ui/CheckoutSuccessContent.tsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Loader2 } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderItem { id: string; name: string; price: number; quantity: number }
interface Order {
  id: string; orderNumber: string; email: string; total: number
  status: string; createdAt: string; items: OrderItem[]
}

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId      = searchParams.get('orderId')

  const [order, setOrder]     = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!orderId) { setLoading(false); return }

    fetch(`/api/orders/${orderId}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(j => setOrder(j.data))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false))
  }, [orderId])

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">

        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="font-display text-5xl font-light text-charcoal mb-3">Thank You!</h1>
        <p className="font-body text-nude-500 mb-8 leading-relaxed">
          Your order has been confirmed and is being prepared with care.
          We'll send you an email when it ships.
        </p>

        {loading ? (
          <div className="flex justify-center my-8">
            <Loader2 size={28} className="animate-spin text-nude-400" />
          </div>
        ) : order ? (
          <div className="bg-white border border-nude-100 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-nude-100">
              <div>
                <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-display text-2xl font-light text-charcoal">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">Total</p>
                <p className="font-body font-semibold text-charcoal text-lg">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items?.slice(0, 4).map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-body text-nude-700">
                    {item.name}
                    <span className="text-nude-400 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="font-body font-medium text-charcoal">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              {(order.items?.length ?? 0) > 4 && (
                <p className="font-body text-xs text-nude-400">
                  +{order.items.length - 4} more item{order.items.length - 4 !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <p className="font-body text-sm text-nude-500 pt-4 border-t border-nude-100">
              Confirmation sent to{' '}
              <span className="font-medium text-charcoal">{order.email}</span>
            </p>
          </div>
        ) : fetchError ? (
          <p className="font-body text-sm text-nude-500 mb-8">
            Your order was placed successfully. Check your email for confirmation details.
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary gap-2">
            Continue Shopping <ArrowRight size={16} />
          </Link>
          {order && (
            <Link href={`/track?order=${order.orderNumber}`} className="btn-outline gap-2">
              <Package size={16} /> Track Order
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
