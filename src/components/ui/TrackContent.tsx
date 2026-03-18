// src/components/ui/TrackContent.tsx
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Truck, CheckCircle, Clock, AlertCircle, Package } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

const STATUS_STEPS = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const

const STATUS_STYLES: Record<string, string> = {
  PENDING:    'bg-yellow-100 text-yellow-700',
  CONFIRMED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED:    'bg-indigo-100 text-indigo-700',
  DELIVERED:  'bg-green-100 text-green-700',
  CANCELLED:  'bg-red-100 text-red-700',
  REFUNDED:   'bg-gray-100 text-gray-600',
}

export default function TrackContent() {
  const searchParams = useSearchParams()
  const [query, setQuery]     = useState(searchParams.get('order') ?? '')
  const [order, setOrder]     = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  // Auto-search if order param is present in URL
  useEffect(() => {
    const orderParam = searchParams.get('order')
    if (orderParam) handleSearch(undefined, orderParam)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault()
    const q = override ?? query.trim()
    if (!q) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(q)}`)
      if (res.status === 404) throw new Error('Order not found. Please check the number and try again.')
      if (!res.ok) throw new Error('Could not retrieve order. Please try again.')
      const json = await res.json()
      setOrder(json.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : -1

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <h1 className="font-display text-4xl font-light text-charcoal">Track Your Order</h1>
          <p className="font-body text-sm text-nude-500 mt-1">Enter your order number to see real-time updates.</p>
        </div>
      </div>

      <div className="container-main py-10 max-w-2xl">
        {/* Search */}
        <div className="bg-white border border-nude-100 p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. ALR-ABC123-XYZ"
              className="flex-1 input-field font-mono"
            />
            <button type="submit" disabled={loading} className="btn-primary px-6 gap-2">
              <Search size={16} />
              {loading ? 'Searching…' : 'Takip'}
            </button>
          </form>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-600">
              <AlertCircle size={15} className="shrink-0" />
              <p className="font-body text-sm">{error}</p>
            </div>
          )}
        </div>

        {order && (
          <div className="bg-white border border-nude-100 p-6 space-y-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-nude-100">
              <div>
                <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">Order Number</p>
                <p className="font-mono font-semibold text-charcoal text-xl">{order.orderNumber}</p>
                <p className="font-body text-sm text-nude-500 mt-1">Placed {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">Total</p>
                <p className="font-body font-semibold text-charcoal">{formatPrice(order.total)}</p>
                <span className={cn(
                  'inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full',
                  STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'
                )}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
              <div>
                <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-5">Shipment Progress</p>
                <div className="relative flex items-center justify-between">
                  {/* Track line background */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-nude-100 z-0">
                    <div
                      className="h-full bg-brand-500 transition-all duration-700"
                      style={{
                        width: currentStep >= 0
                          ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>

                  {STATUS_STEPS.map((step, idx) => {
                    const done   = currentStep >= idx
                    const active = currentStep === idx
                    const icons: Record<string, typeof Package> = {
                      CONFIRMED: CheckCircle, PROCESSING: Package,
                      SHIPPED: Truck, DELIVERED: CheckCircle,
                    }
                    const Icon = icons[step] ?? Clock
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 z-10 flex-1">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                          done   ? 'bg-brand-600 text-white' : 'bg-nude-100 text-nude-400',
                          active && 'ring-4 ring-brand-100 scale-110'
                        )}>
                          <Icon size={15} />
                        </div>
                        <p className={cn(
                          'font-body text-[10px] text-center uppercase tracking-wider leading-tight',
                          done ? 'text-brand-700 font-semibold' : 'text-nude-400'
                        )}>
                          {step.charAt(0) + step.slice(1).toLowerCase()}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {(order.status === 'CANCELLED' || order.status === 'REFUNDED') && (
              <div className={cn(
                'flex items-center gap-3 p-4 rounded-lg',
                order.status === 'CANCELLED' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
              )}>
                <AlertCircle size={18} className={order.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'} />
                <p className="font-body text-sm">
                  {order.status === 'CANCELLED'
                    ? 'This order has been cancelled.'
                    : 'A refund has been issued for this order.'}
                </p>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-3">Items in This Order</p>
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="font-body text-charcoal">
                      {item.name}
                      <span className="text-nude-400 ml-1">×{item.quantity}</span>
                    </span>
                    <span className="font-body font-medium text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 border-t border-nude-100">
              <Link href="/account/orders" className="font-body text-sm text-brand-600 hover:text-brand-700 transition-colors">
                View all your orders →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
