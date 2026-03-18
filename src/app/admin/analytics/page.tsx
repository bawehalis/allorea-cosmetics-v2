// src/app/admin/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Package, RefreshCw, BarChart3, Calendar,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [data,    setData]    = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range,   setRange]   = useState('30')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?range=${range}`)
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [range])

  const maxRevenue = data?.dailyRevenue
    ? Math.max(...data.dailyRevenue.map((d: any) => d.revenue), 1)
    : 1

  const StatCard = ({ title, value, growth, icon: Icon, color, sub }: {
    title: string; value: string|number; growth?: number
    icon: any; color: string; sub?: string
  }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900">{loading ? '—' : value}</p>
      {sub && !loading && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      {growth !== undefined && !loading && (
        <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-semibold',
          growth >= 0 ? 'text-green-600' : 'text-red-500')}>
          {growth >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
          {growth >= 0 ? '+' : ''}{growth}% geçen aya göre
        </div>
      )}
    </div>
  )

  const s = data?.summary

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analitik</h1>
          <p className="text-sm text-gray-500 mt-0.5">Satış ve müşteri istatistikleri</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {[
              { val:'7',  label:'7 Gün' },
              { val:'30', label:'30 Gün' },
              { val:'90', label:'90 Gün' },
            ].map(r => (
              <button key={r.val} onClick={() => setRange(r.val)}
                className={cn('px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                  range === r.val ? 'bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-900')}>
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={() => setRange(range)} className="p-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : 'text-gray-500'} />
          </button>
        </div>
      </div>

      {/* Metrik kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Toplam Ciro"      icon={DollarSign}   color="bg-emerald-500"
          value={s ? `${s.totalRevenue.toLocaleString('tr-TR')}₺` : '—'}
          growth={s?.revenueGrowth}
          sub={s ? `Ort. ${s.averageOrderValue.toLocaleString('tr-TR')}₺/sipariş` : ''} />
        <StatCard title="Sipariş Sayısı"   icon={ShoppingCart} color="bg-blue-500"
          value={s ? s.totalOrders.toLocaleString('tr-TR') : '—'}
          growth={s?.ordersGrowth} />
        <StatCard title="Yeni Müşteri"     icon={Users}        color="bg-purple-500"
          value={s ? s.newCustomers.toLocaleString('tr-TR') : '—'}
          sub={s ? `Toplam ${s.totalCustomers.toLocaleString('tr-TR')} müşteri` : ''} />
        <StatCard title="Aktif Ürün"       icon={Package}      color="bg-amber-500"
          value={s ? s.totalProducts.toLocaleString('tr-TR') : '—'} />
      </div>

      {/* Günlük gelir grafiği */}
      {data?.dailyRevenue && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 text-sm mb-5 flex items-center gap-2">
            <BarChart3 size={16} className="text-brand-600"/>
            Günlük Gelir ({range} gün)
          </h2>
          <div className="flex items-end gap-1 h-32">
            {data.dailyRevenue.map((d: any, i: number) => {
              const pct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
              const isToday = i === data.dailyRevenue.length - 1
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative" title={`${d.date}: ${d.revenue.toLocaleString('tr-TR')}₺`}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {d.revenue.toLocaleString('tr-TR')}₺
                  </div>
                  <div
                    className={cn('w-full rounded-t-lg transition-all duration-500',
                      isToday ? 'bg-brand-600' : 'bg-brand-200 hover:bg-brand-400')}
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
            <span>{data.dailyRevenue[0]?.date?.slice(5)}</span>
            <span>{data.dailyRevenue[Math.floor(data.dailyRevenue.length/2)]?.date?.slice(5)}</span>
            <span>{data.dailyRevenue[data.dailyRevenue.length-1]?.date?.slice(5)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* En çok satan ürünler */}
        {data?.topProducts && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">En Çok Satan Ürünler</h2>
            <div className="space-y-3">
              {data.topProducts.map((p: any, i: number) => (
                <div key={p.productId || i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-black text-xs shrink-0">
                    {i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div className="bg-brand-600 h-1.5 rounded-full"
                        style={{ width:`${Math.min(100, ((p._sum?.quantity||0)/Math.max(...data.topProducts.map((x:any)=>x._sum?.quantity||0),1))*100)}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-gray-900">{p._sum?.quantity || 0} adet</p>
                    <p className="text-xs text-gray-400">{p._count?.orderId || 0} sipariş</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sipariş durum dağılımı */}
        {data?.ordersByStatus && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-4">Sipariş Durumu Dağılımı</h2>
            <div className="space-y-2.5">
              {data.ordersByStatus.map((s: any) => {
                const total = data.ordersByStatus.reduce((acc: number, x: any) => acc + x._count.id, 0)
                const pct   = total > 0 ? Math.round((s._count.id / total) * 100) : 0
                const colors: Record<string,string> = {
                  DELIVERED:'bg-green-500', SHIPPED:'bg-indigo-500',
                  PROCESSING:'bg-purple-500', PENDING:'bg-yellow-500',
                  CANCELLED:'bg-red-500', REFUNDED:'bg-gray-400', CONFIRMED:'bg-blue-500',
                }
                const TR: Record<string,string> = {
                  DELIVERED:'Teslim', SHIPPED:'Kargoda', PROCESSING:'Hazırlanıyor',
                  PENDING:'Beklemede', CANCELLED:'İptal', REFUNDED:'İade', CONFIRMED:'Onaylandı',
                }
                return (
                  <div key={s.status} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-600 w-24 shrink-0">
                      {TR[s.status] || s.status}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-700', colors[s.status] || 'bg-gray-400')}
                        style={{ width:`${pct}%` }} />
                    </div>
                    <span className="text-xs font-black text-gray-700 w-8 text-right shrink-0">
                      {s._count.id}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Düşük stok */}
      {data?.lowStockProducts?.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-5">
          <h2 className="font-bold text-amber-700 text-sm mb-4 flex items-center gap-2">
            ⚠️ Düşük Stok Uyarısı ({data.lowStockProducts.length} ürün)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.lowStockProducts.map((p: any) => (
              <div key={p.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-lg font-black text-red-600 mt-0.5">{p.stock} adet</p>
                <p className="text-[10px] text-gray-400">{p.sku}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
