// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign, ShoppingCart, Users, Package,
  TrendingUp, TrendingDown, ArrowRight, RefreshCw,
  Star, Zap, Image as ImageIcon, Layers
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

const QUICK_ACTIONS = [
  { href:'/admin/products/new', label:'Yeni Ürün',     icon:Package,   color:'bg-blue-500' },
  { href:'/admin/reviews',      label:'Yorumlar',       icon:Star,      color:'bg-amber-500' },
  { href:'/admin/content',      label:'İçerik Düzenle', icon:ImageIcon, color:'bg-purple-500' },
  { href:'/admin/urgency',      label:'FOMO Ayarları',  icon:Zap,       color:'bg-red-500' },
  { href:'/admin/bundles',      label:'Paket Yönetimi', icon:Layers,    color:'bg-green-500' },
  { href:'/admin/orders',       label:'Siparişler',     icon:ShoppingCart, color:'bg-indigo-500' },
]

export default function AdminDashboardPage() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)
    fetch('/api/analytics?range=30')
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const StatCard = ({ title, value, growth, icon: Icon, color }: {
    title: string; value: string; growth?: number; icon: any; color: string
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900">{loading ? '—' : value}</p>
      {growth !== undefined && !loading && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-semibold ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {growth >= 0 ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
          {growth >= 0 ? '+' : ''}{growth}% geçen aya göre
        </div>
      )}
    </div>
  )

  const summary = data?.summary

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Son 30 günlük özet</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm border border-gray-200 bg-white px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Toplam Ciro"     icon={DollarSign}   color="bg-green-500"
          value={summary ? `${(summary.totalRevenue).toLocaleString('tr-TR')}₺` : '—'}
          growth={summary?.revenueGrowth} />
        <StatCard title="Sipariş Sayısı"  icon={ShoppingCart} color="bg-blue-500"
          value={summary ? summary.totalOrders.toLocaleString('tr-TR') : '—'}
          growth={summary?.ordersGrowth} />
        <StatCard title="Müşteri Sayısı"  icon={Users}        color="bg-purple-500"
          value={summary ? summary.totalCustomers.toLocaleString('tr-TR') : '—'} />
        <StatCard title="Aktif Ürün"      icon={Package}      color="bg-amber-500"
          value={summary ? summary.totalProducts.toLocaleString('tr-TR') : '—'} />
      </div>

      {/* Hızlı işlemler */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className="bg-white rounded-2xl border border-gray-200 p-4 text-center hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2.5 group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-xs font-bold text-gray-700 leading-tight">{label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Son siparişler */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Son Siparişler</h2>
            <Link href="/admin/orders" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(4)].map((_,i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
              ))
            ) : data?.recentOrders?.slice(0,5).map((o: any) => (
              <Link key={o.id} href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-gray-400">{o.email} · {formatDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">{o.total?.toLocaleString('tr-TR')}₺</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    o.status === 'SHIPPED'   ? 'bg-indigo-100 text-indigo-700' :
                    o.status === 'PROCESSING'? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </Link>
            ))}
            {!loading && !data?.recentOrders?.length && (
              <p className="text-center py-10 text-sm text-gray-400">Henüz sipariş yok</p>
            )}
          </div>
        </div>

        {/* Düşük stok */}
        <div className="bg-white rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Düşük Stok Uyarısı</h2>
            <Link href="/admin/inventory" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Stok Yönetimi <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(3)].map((_,i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-40" />
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
              ))
            ) : data?.lowStockProducts?.slice(0,5).map((p: any) => (
              <Link key={p.id} href={`/admin/products/${p.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-600">{p.name}</p>
                  <p className="text-xs text-gray-400">SKU: {p.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width:`${Math.min(100,(p.stock/20)*100)}%` }} />
                  </div>
                  <span className="text-xs font-black text-red-600">{p.stock} adet</span>
                </div>
              </Link>
            ))}
            {!loading && !data?.lowStockProducts?.length && (
              <p className="text-center py-10 text-sm text-gray-400">Stok sorunu yok ✓</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
