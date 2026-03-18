// src/app/admin/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, MapPin, CreditCard, User, CheckCircle, AlertCircle } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@/lib/utils'

const STATUS_OPTIONS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']
const STATUS_STYLES: Record<string,string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700', SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
}

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [toast, setToast] = useState<{type:'success'|'error';msg:string}|null>(null)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(j => { setOrder(j.data); setNewStatus(j.data?.status || '') })
      .finally(() => setLoading(false))
  }, [params.id])

  const updateStatus = async () => {
    if (!newStatus || newStatus === order.status) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setOrder(json.data)
      setToast({ type: 'success', msg: 'Order status updated successfully' })
    } catch (e: any) {
      setToast({ type: 'error', msg: e.message })
    } finally {
      setUpdating(false)
      setTimeout(() => setToast(null), 3500)
    }
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  )
  if (!order) return <div className="text-center py-16 text-gray-400">Order not found</div>

  return (
    <div className="max-w-5xl space-y-5">
      {toast && (
        <div className={cn('fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium',
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800')}>
          {toast.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 font-mono">{order.orderNumber}</h1>
              <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[order.status])}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">Placed {formatDate(order.createdAt)}</p>
          </div>
        </div>
        {/* Update status */}
        <div className="flex items-center gap-2 shrink-0">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={updateStatus} disabled={updating || newStatus === order.status}
            className="px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors">
            {updating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Package size={16} className="text-gray-500" />
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={56} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl space-y-2">
              {[
                { label: 'Subtotal', value: formatPrice(order.subtotal) },
                { label: 'Shipping', value: order.shipping === 0 ? 'FREE' : formatPrice(order.shipping) },
                { label: 'Tax', value: formatPrice(order.tax) },
                ...(order.discount > 0 ? [{ label: 'Discount', value: `-${formatPrice(order.discount)}` }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm text-gray-600">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={15} className="text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Customer</h3>
            </div>
            <p className="text-sm text-gray-900">{order.user?.name || 'Guest'}</p>
            <p className="text-sm text-gray-500">{order.email}</p>
            {order.user?.id && (
              <Link href={`/admin/customers/${order.user.id}`}
                className="text-xs text-brand-600 hover:text-brand-700 mt-2 inline-block">
                View Customer →
              </Link>
            )}
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900 text-sm">Shipping Address</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-0.5">
                <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.address1}</p>
                {order.address.address2 && <p>{order.address.address2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
                {order.address.phone && <p className="text-gray-500">{order.address.phone}</p>}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Payment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-700 uppercase">{order.paymentMethod}</span>
                </div>
              )}
              {order.stripePaymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Reference</span>
                  <span className="font-mono text-xs text-gray-600 truncate max-w-[120px]">{order.stripePaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
