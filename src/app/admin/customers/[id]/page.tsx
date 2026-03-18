// src/app/admin/customers/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Package, ShoppingCart } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

const STATUS_STYLES: Record<string,string> = {
  PENDING:'bg-yellow-100 text-yellow-700', CONFIRMED:'bg-blue-100 text-blue-700',
  DELIVERED:'bg-green-100 text-green-700', CANCELLED:'bg-red-100 text-red-700',
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/customers/${params.id}`)
      .then(r => r.json()).then(j => setCustomer(j.data)).finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-200 rounded w-48"/><div className="h-64 bg-gray-100 rounded-xl"/></div>
  if (!customer) return <div className="text-center py-16 text-gray-400">Customer not found</div>

  const totalSpent = customer.orders?.reduce((s: number, o: any) => s + o.total, 0) || 0

  return (
    <div className="max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{customer.name || 'Guest Customer'}</h1>
          <p className="text-sm text-gray-500">{customer.email} · Member since {formatDate(customer.createdAt)}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Orders', value: customer.orders?.length || 0 },
          { label: 'Total Spent', value: formatPrice(totalSpent) },
          { label: 'Reviews', value: customer.reviews?.length || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <ShoppingCart size={15} className="text-gray-500"/>
          <h2 className="font-semibold text-gray-900">Order History</h2>
        </div>
        {!customer.orders?.length ? (
          <p className="text-center py-10 text-gray-400 text-sm">No orders yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {customer.orders.map((order: any) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-mono font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.items?.length} items · {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600')}>
                  {order.status}
                </span>
                <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
