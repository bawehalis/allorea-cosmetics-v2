// src/app/account/orders/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ArrowRight, ChevronRight } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
}

const STATUS_TR: Record<string, string> = {
  PENDING:'Beklemede', CONFIRMED:'Onaylandı', PROCESSING:'Hazırlanıyor',
  SHIPPED:'Kargoda', DELIVERED:'Teslim Edildi', CANCELLED:'İptal Edildi', REFUNDED:'İade Edildi',
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders?limit=20')
      .then(r => {
        if (r.status === 401) { router.push('/login?redirect=/account/orders'); return null }
        return r.json()
      })
      .then(j => j && setOrders(j.data || []))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <nav className="font-body text-xs text-nude-400 mb-2">
            <Link href="/" className="hover:text-charcoal">Home</Link> /{' '}
            <Link href="/account" className="hover:text-charcoal">Account</Link> / Orders
          </nav>
          <h1 className="font-display text-4xl font-light text-charcoal">Siparişlerim</h1>
        </div>
      </div>
      <div className="container-main py-10 max-w-3xl">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white border border-nude-100 animate-pulse rounded" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-nude-300 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-light text-charcoal mb-3">Henüz sipariş yok</h2>
            <p className="font-body text-nude-500 mb-8">Sipariş verdiğinizde burada görünecek.</p>
            <Link href="/shop" className="btn-primary gap-2">Alışverişe Başla <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link key={order.id} href={`/track?order=${order.orderNumber}`}
                className="block bg-white border border-nude-100 p-6 hover:border-nude-300 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-mono font-semibold text-charcoal">{order.orderNumber}</p>
                      <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600')}>
                        {STATUS_TR[order.status] || order.status}
                      </span>
                    </div>
                    <p className="font-body text-sm text-nude-500">{formatDate(order.createdAt)}</p>
                    <p className="font-body text-xs text-nude-400 mt-1">
                      {order.items?.map((i: any) => i.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-body font-semibold text-charcoal">{order.total?.toLocaleString("tr-TR")}₺</p>
                    <ChevronRight size={18} className="text-nude-300 group-hover:text-brand-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
