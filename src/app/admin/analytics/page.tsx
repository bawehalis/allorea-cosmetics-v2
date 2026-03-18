// src/app/admin/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, RefreshCw } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics?range=${range}`)
      .then(r => r.json()).then(j => setData(j.data)).finally(() => setLoading(false))
  }, [range])

  const maxRevenue = data?.dailyRevenue ? Math.max(...data.dailyRevenue.map((d: any) => d.revenue), 1) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Store performance overview</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={range} onChange={e => setRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"/>)}
        </div>
      ) : data ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Revenue', value: formatPrice(data.summary.totalRevenue), change: data.summary.revenueGrowth, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { title: `Orders (${range}d)`, value: data.summary.totalOrders, change: data.summary.ordersGrowth, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Customers', value: data.summary.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { title: 'Avg Order', value: formatPrice(data.summary.averageOrderValue), icon: Package, color: 'text-brand-600', bg: 'bg-brand-50' },
            ].map(({ title, value, change, icon: Icon, color, bg }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', bg)}>
                    <Icon size={22} className={color} />
                  </div>
                  {change !== undefined && (
                    <div className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                      change >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                      {change >= 0 ? <TrendingUp size={11}/> : <TrendingDown size={11}/>} {Math.abs(change)}%
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Daily Revenue — Last {range} Days</h2>
            <div className="flex items-end gap-1.5 h-48">
              {data.dailyRevenue.map((d: any) => (
                <div key={d.date} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                    {d.date}: {formatPrice(d.revenue)}
                  </div>
                  <div
                    className="w-full bg-brand-500 hover:bg-brand-600 transition-colors rounded-t-sm"
                    style={{ height: `${Math.max(2, (d.revenue / maxRevenue) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Orders by status */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Orders by Status</h2>
              <div className="space-y-3">
                {data.ordersByStatus.map((row: any) => {
                  const total = data.ordersByStatus.reduce((s: number, o: any) => s + o._count.id, 0)
                  const pct = total > 0 ? (row._count.id / total) * 100 : 0
                  return (
                    <div key={row.status}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-700 font-medium">{row.status}</span>
                        <span className="text-gray-500">{row._count.id} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top products */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Top Selling Products</h2>
              <div className="space-y-3">
                {data.topProducts.map((p: any, i: number) => (
                  <div key={p.productId} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-sm text-gray-800 truncate">{p.name}</p>
                    <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                      {p._sum?.quantity || 0} sold
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock */}
            {data.lowStockProducts?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h2 className="text-base font-semibold text-amber-900 mb-4 flex items-center gap-2">
                  ⚠️ Low Stock Alert ({data.lowStockProducts.length})
                </h2>
                <div className="space-y-2">
                  {data.lowStockProducts.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between bg-white/60 rounded-lg px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-amber-900">{p.name}</p>
                        <p className="text-xs text-amber-600 font-mono">{p.sku}</p>
                      </div>
                      <span className={cn('text-sm font-bold', p.stock === 0 ? 'text-red-600' : 'text-amber-700')}>
                        {p.stock === 0 ? 'OUT' : `${p.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
