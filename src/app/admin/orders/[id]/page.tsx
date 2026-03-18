// src/app/admin/orders/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, Package, MapPin, CreditCard, User,
  CheckCircle, AlertCircle, Truck, Phone, MessageCircle,
  Clock, ChevronRight,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value:'PENDING',    label:'Beklemede' },
  { value:'CONFIRMED',  label:'Onaylandı' },
  { value:'PROCESSING', label:'Hazırlanıyor' },
  { value:'SHIPPED',    label:'Kargoda' },
  { value:'DELIVERED',  label:'Teslim Edildi' },
  { value:'CANCELLED',  label:'İptal Edildi' },
  { value:'REFUNDED',   label:'İade Edildi' },
]

const STATUS_STYLES: Record<string,string> = {
  PENDING:'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED:'bg-blue-100 text-blue-700 border-blue-200',
  PROCESSING:'bg-purple-100 text-purple-700 border-purple-200',
  SHIPPED:'bg-indigo-100 text-indigo-700 border-indigo-200',
  DELIVERED:'bg-green-100 text-green-700 border-green-200',
  CANCELLED:'bg-red-100 text-red-700 border-red-200',
  REFUNDED:'bg-gray-100 text-gray-600 border-gray-200',
}

const PAY_METHOD_INFO: Record<string, { label: string; icon: any; color: string }> = {
  card:      { label:'Kredi/Banka Kartı', icon:CreditCard,    color:'text-blue-600 bg-blue-50' },
  cod:       { label:'Kapıda Ödeme',      icon:Truck,         color:'text-amber-600 bg-amber-50' },
  whatsapp:  { label:'WhatsApp Sipariş',  icon:MessageCircle, color:'text-green-600 bg-green-50' },
  stripe:    { label:'Stripe',            icon:CreditCard,    color:'text-violet-600 bg-violet-50' },
}

// Sipariş akış adımları
const FLOW_STEPS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED']

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order,     setOrder]     = useState<any>(null)
  const [loading,   setLoading]   = useState(true)
  const [updating,  setUpdating]  = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [toast,     setToast]     = useState<{type:'success'|'error';msg:string}|null>(null)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(j => { setOrder(j.data); setNewStatus(j.data?.status || '') })
      .finally(() => setLoading(false))
  }, [params.id])

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const updateStatus = async () => {
    if (!newStatus || newStatus === order.status) return
    setUpdating(true)
    try {
      const res  = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setOrder(json.data)
      showToast('success', 'Sipariş durumu güncellendi')
    } catch (e: any) {
      showToast('error', e.message)
    } finally { setUpdating(false) }
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_,i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl" />)}
      </div>
    </div>
  )
  if (!order) return (
    <div className="text-center py-16 text-gray-400">
      <Package size={40} className="mx-auto mb-2 opacity-30" />
      <p>Sipariş bulunamadı</p>
    </div>
  )

  const payInfo = PAY_METHOD_INFO[order.paymentMethod] || PAY_METHOD_INFO.card
  const PayIcon = payInfo.icon
  const activeStep = FLOW_STEPS.indexOf(order.status)

  return (
    <div className="max-w-5xl space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold',
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        )}>
          {toast.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black font-mono text-gray-900">{order.orderNumber}</h1>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border',
                STATUS_STYLES[order.status])}>
                {STATUS_OPTIONS.find(s=>s.value===order.status)?.label || order.status}
              </span>
              {order.paymentMethod && (
                <span className={cn('flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full', payInfo.color)}>
                  <PayIcon size={11} />
                  {payInfo.label}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
              <Clock size={12} /> {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Durum güncelle */}
        <div className="flex items-center gap-2">
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={updateStatus}
            disabled={updating || newStatus === order.status}
            className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
            {updating ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </div>

      {/* Akış göstergesi */}
      {!['CANCELLED','REFUNDED'].includes(order.status) && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Sipariş Akışı</p>
          <div className="flex items-center gap-0">
            {FLOW_STEPS.map((step, i) => {
              const done    = i <= activeStep
              const current = i === activeStep
              const label   = STATUS_OPTIONS.find(s=>s.value===step)?.label || step
              return (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all',
                      done
                        ? current
                          ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100'
                          : 'bg-brand-600 border-brand-600 text-white'
                        : 'bg-white border-gray-200 text-gray-400'
                    )}>
                      {done && !current ? <CheckCircle size={14}/> : i+1}
                    </div>
                    <span className={cn('text-[10px] font-semibold mt-1 text-center leading-tight max-w-[60px]',
                      done ? 'text-brand-600' : 'text-gray-400')}>
                      {label}
                    </span>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className={cn('flex-1 h-0.5 mb-4 mx-1', i < activeStep ? 'bg-brand-600' : 'bg-gray-200')} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ürünler + özet */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Package size={16} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">Sipariş Kalemleri</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {item.image
                      ? <Image src={item.image} alt={item.name} width={56} height={64} className="w-full h-full object-cover"/>
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">IMG</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    {item.bundleLabel && (
                      <span className="inline-block text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold mt-0.5">
                        {item.bundleLabel}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.quantity} adet × {item.price.toLocaleString('tr-TR')}₺
                    </p>
                  </div>
                  <p className="font-black text-gray-900 shrink-0">
                    {(item.price * item.quantity).toLocaleString('tr-TR')}₺
                  </p>
                </div>
              ))}
            </div>

            {/* Fiyat özeti */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl space-y-2">
              {[
                { label:'Ara Toplam', value:`${order.subtotal?.toLocaleString('tr-TR')}₺` },
                { label:'Kargo',      value: order.shipping === 0 ? 'ÜCRETSİZ' : `${order.shipping?.toLocaleString('tr-TR')}₺` },
                { label:'KDV',        value:`${order.tax?.toLocaleString('tr-TR')}₺` },
                ...(order.discount>0 ? [{ label:'İndirim', value:`-${order.discount?.toLocaleString('tr-TR')}₺` }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm text-gray-600">
                  <span>{label}</span>
                  <span className={value.startsWith('-') ? 'text-green-600 font-semibold' : ''}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Toplam</span>
                <span>{order.total?.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ sidebar */}
        <div className="space-y-4">
          {/* Müşteri */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={15} className="text-gray-500" />
              <h3 className="font-bold text-gray-900 text-sm">Müşteri</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-black text-sm shrink-0">
                {(order.user?.name || order.email || 'M').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{order.user?.name || 'Misafir'}</p>
                <p className="text-xs text-gray-500">{order.email}</p>
              </div>
            </div>
            {order.user?.id && (
              <Link href={`/admin/customers/${order.user.id}`}
                className="flex items-center gap-1 text-xs text-brand-600 hover:underline">
                Müşteri Detayları <ChevronRight size={11}/>
              </Link>
            )}
          </div>

          {/* Teslimat Adresi */}
          {order.address && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-gray-500" />
                <h3 className="font-bold text-gray-900 text-sm">Teslimat Adresi</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{order.address.firstName} {order.address.lastName}</p>
                <p>{order.address.address1}</p>
                {order.address.address2 && <p>{order.address.address2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
                {order.address.phone && (
                  <a href={`tel:${order.address.phone}`}
                    className="flex items-center gap-1 text-brand-600 hover:underline mt-1">
                    <Phone size={12}/> {order.address.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Ödeme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-gray-500" />
              <h3 className="font-bold text-gray-900 text-sm">Ödeme Bilgileri</h3>
            </div>
            <div className="space-y-2.5">
              {order.paymentMethod && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Yöntem</span>
                  <span className={cn('flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', payInfo.color)}>
                    <PayIcon size={11}/>
                    {payInfo.label}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Durum</span>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                  order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                  {order.paymentStatus === 'PAID' ? 'Ödendi' : order.paymentStatus === 'UNPAID' ? 'Bekleniyor' : order.paymentStatus}
                </span>
              </div>
              {order.stripePaymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Referans</span>
                  <span className="font-mono text-xs text-gray-600 truncate max-w-[120px]">
                    {order.stripePaymentId}
                  </span>
                </div>
              )}
              {order.paymentMethod === 'cod' && order.paymentStatus === 'UNPAID' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                  <p className="text-xs font-semibold text-amber-800">⚠️ Kapıda ödeme bekleniyor</p>
                  <p className="text-[10px] text-amber-700 mt-0.5">Teslimatta tahsil edilecek</p>
                </div>
              )}
            </div>
          </div>

          {/* Notlar */}
          {order.notes && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Sipariş Notu</h3>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
