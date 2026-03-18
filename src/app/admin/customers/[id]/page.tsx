// src/app/admin/customers/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Package, Mail, Phone, Calendar } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

const STATUS_STYLES: Record<string,string> = {
  PENDING:'bg-yellow-100 text-yellow-700',
  CONFIRMED:'bg-blue-100 text-blue-700',
  PROCESSING:'bg-purple-100 text-purple-700',
  SHIPPED:'bg-indigo-100 text-indigo-700',
  DELIVERED:'bg-green-100 text-green-700',
  CANCELLED:'bg-red-100 text-red-700',
}
const STATUS_TR: Record<string,string> = {
  PENDING:'Beklemede', CONFIRMED:'Onaylandı', PROCESSING:'Hazırlanıyor',
  SHIPPED:'Kargoda', DELIVERED:'Teslim', CANCELLED:'İptal',
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<any>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetch(`/api/customers/${params.id}`)
      .then(r => r.json())
      .then(j => setCustomer(j.data))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48"/>
      <div className="h-64 bg-gray-100 rounded-2xl"/>
    </div>
  )
  if (!customer) return (
    <div className="text-center py-16 text-gray-400">Müşteri bulunamadı</div>
  )

  const totalSpent = customer.orders?.reduce((s: number, o: any) => s + o.total, 0) || 0
  const avgOrder   = customer.orders?.length ? totalSpent / customer.orders.length : 0

  return (
    <div className="max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={18}/>
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-black text-lg shrink-0">
            {(customer.name || customer.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{customer.name || 'İsimsiz Müşteri'}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-3">
              <span className="flex items-center gap-1"><Mail size={12}/>{customer.email}</span>
              <span className="flex items-center gap-1"><Calendar size={12}/>{formatDate(customer.createdAt)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Toplam Sipariş',  value: customer.orders?.length || 0,   suffix:'' },
          { label:'Toplam Harcama',  value: totalSpent.toLocaleString('tr-TR'), suffix:'₺' },
          { label:'Ortalama Sipariş',value: Math.round(avgOrder).toLocaleString('tr-TR'), suffix:'₺' },
          { label:'Yorumlar',        value: customer.reviews?.length || 0,  suffix:'' },
        ].map(({ label, value, suffix }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{value}{suffix}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sipariş geçmişi */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <ShoppingCart size={15} className="text-gray-500"/>
            <h2 className="font-bold text-gray-900 text-sm">Sipariş Geçmişi</h2>
          </div>
          {!customer.orders?.length ? (
            <p className="text-center py-10 text-gray-400 text-sm">Henüz sipariş yok</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {customer.orders.map((o: any) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div>
                    <p className="font-mono font-semibold text-sm text-gray-900 group-hover:text-brand-600">
                      {o.orderNumber}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                      {o.paymentMethod && (
                        <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium uppercase">
                          {o.paymentMethod === 'cod' ? 'Kapıda' : o.paymentMethod === 'whatsapp' ? 'WA' : 'Kart'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full',
                      STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-600')}>
                      {STATUS_TR[o.status] || o.status}
                    </span>
                    <span className="font-black text-gray-900 text-sm">
                      {o.total.toLocaleString('tr-TR')}₺
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sağ: müşteri bilgileri */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Müşteri Bilgileri</h3>
            <div className="space-y-3 text-sm">
              {customer.addresses?.[0] && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Adres</p>
                  <div className="text-gray-700 space-y-0.5">
                    <p>{customer.addresses[0].address1}</p>
                    <p>{customer.addresses[0].city}, {customer.addresses[0].country}</p>
                    {customer.addresses[0].phone && (
                      <a href={`tel:${customer.addresses[0].phone}`}
                        className="flex items-center gap-1 text-brand-600 hover:underline">
                        <Phone size={11}/> {customer.addresses[0].phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Rol</p>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  {customer.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}
                </span>
              </div>
            </div>
          </div>

          {/* Son yorumlar */}
          {customer.reviews?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Yorumları</h3>
              <div className="space-y-3">
                {customer.reviews.slice(0, 3).map((r: any) => (
                  <div key={r.id} className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={s <= r.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-xs line-clamp-2">{r.body}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{formatDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
