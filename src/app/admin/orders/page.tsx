// src/app/admin/orders/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Download, Eye, RefreshCw } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Order {
  id: string; orderNumber: string; email: string; status: string
  paymentStatus: string; paymentMethod?: string; total: number
  createdAt: string; items: Array<{ name: string; quantity: number }>
}

const STATUS_STYLES: Record<string,string> = {
  PENDING:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED:  'bg-blue-100 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-100 text-purple-700 border-purple-200',
  SHIPPED:    'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED:  'bg-green-100 text-green-700 border-green-200',
  CANCELLED:  'bg-red-100 text-red-700 border-red-200',
  REFUNDED:   'bg-gray-100 text-gray-600 border-gray-200',
}

const STATUS_TR: Record<string,string> = {
  PENDING:'Beklemede', CONFIRMED:'Onaylandı', PROCESSING:'Hazırlanıyor',
  SHIPPED:'Kargoda', DELIVERED:'Teslim Edildi', CANCELLED:'İptal', REFUNDED:'İade',
}

const PAY_STYLES: Record<string,string> = {
  PAID:'bg-green-100 text-green-700', UNPAID:'bg-red-100 text-red-600',
  FAILED:'bg-red-100 text-red-700', REFUNDED:'bg-gray-100 text-gray-600',
}

const PAY_TR: Record<string,string> = {
  PAID:'Ödendi', UNPAID:'Ödenmedi', FAILED:'Başarısız', REFUNDED:'İade Edildi',
}

const METHOD_LABELS: Record<string,string> = {
  card:'Kart', cod:'Kapıda Ödeme', whatsapp:'WhatsApp', stripe:'Stripe',
}

export default function AdminOrdersPage() {
  const [orders,      setOrders]      = useState<Order[]>([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search,      setSearch]      = useState('')
  const [statusFilter,setStatusFilter]= useState('')
  const limit = 20

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search)       params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      const res  = await fetch(`/api/orders?${params}`)
      const json = await res.json()
      setOrders(json.data || [])
      setTotal(json.pagination?.total || 0)
    } catch {} finally { setLoading(false) }
  }, [page, search, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const totalPages = Math.ceil(total / limit)

  const statuses = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString('tr-TR')} toplam sipariş</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchOrders}
            className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 bg-white text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={14} /> CSV İndir
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }}
            className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Sipariş no veya e-posta ara..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </form>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
            <option value="">Tüm Durumlar</option>
            {statuses.map(s => <option key={s} value={s}>{STATUS_TR[s] || s}</option>)}
          </select>
        </div>
      </div>

      {/* Durum tab'ları */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[{ label:'Tümü', value:'' }, ...statuses.map(s => ({ label: STATUS_TR[s]||s, value: s }))].map(({ label, value }) => (
          <button key={value} onClick={() => { setStatusFilter(value); setPage(1) }}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap border transition-all',
              statusFilter === value
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            )}>
            {label}
          </button>
        ))}
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Sipariş</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Müşteri</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Ürünler</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Ödeme Tipi</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Durum</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Ödeme</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Tutar</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_,i) => (
                  <tr key={i}>{[...Array(8)].map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">
                  <p className="font-medium">Sipariş bulunamadı</p>
                </td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4">
                    <p className="font-mono font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-700 truncate max-w-[160px]">{order.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    {order.paymentMethod && (
                      <span className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full',
                        order.paymentMethod === 'cod'      ? 'bg-amber-100 text-amber-700' :
                        order.paymentMethod === 'whatsapp' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      )}>
                        {METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border',
                      STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600')}>
                      {STATUS_TR[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                      PAY_STYLES[order.paymentStatus] || 'bg-gray-100 text-gray-600')}>
                      {PAY_TR[order.paymentStatus] || order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-black text-gray-900">{order.total?.toLocaleString('tr-TR')}₺</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 group-hover:border-brand-300 group-hover:text-brand-600">
                      <Eye size={12} /> Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {((page-1)*limit)+1}–{Math.min(page*limit,total)} / {total.toLocaleString('tr-TR')} sipariş
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p=>p-1)} disabled={page===1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p=>p+1)} disabled={page>=totalPages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
