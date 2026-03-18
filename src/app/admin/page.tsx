// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign, ShoppingCart, Users, Package,
  TrendingUp, AlertTriangle, ArrowRight, RefreshCw
} from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import { formatPrice, formatDate } from '@/lib/utils'

interface AnalyticsData {
  summary: {
    totalRevenue: number; totalOrders: number; totalCustomers: number
    totalProducts: number; newCustomers: number; revenueGrowth: number
    ordersGrowth: number; averageOrderValue: number
  }
  recentOrders: Array<{
    id: string; orderNumber: string; email: string
    total: number; status: string; createdAt: string
    items: Array<{ name: string; quantity: number }>
  }>
  topProducts: Array<{ productId: string; name: string; _sum: { quantity: number } }>
  ordersByStatus: Array<{ status: string; _count: { id: number } }>
  dailyRevenue: Array<{ date: string; revenue: number }>
  lowStockProducts: Array<{ id: string; name: string; stock: number; sku: string }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?range=${range}`)
      const json = await res.json()
      setData(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [range])

  const maxRevenue = data?.dailyRevenue
    ? Math.max(...data.dailyRevenue.map(d => d.revenue), 1)
    : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button onClick={fetchData} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin text-brand-500' : 'text-gray-500'} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-32 animate-pulse">
              <div className="w-11 h-11 bg-gray-100 rounded-xl mb-4" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-7 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={formatPrice(data.summary.totalRevenue)}
              change={data.summary.revenueGrowth}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBg="bg-green-50"
            />
            <StatCard
              title={`Orders (${range}d)`}
              value={data.summary.totalOrders}
              change={data.summary.ordersGrowth}
              icon={ShoppingCart}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Total Customers"
              value={data.summary.totalCustomers}
              change={data.summary.newCustomers}
              icon={Users}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              title="Active Products"
              value={data.summary.totalProducts}
              icon={Package}
              iconColor="text-brand-600"
              iconBg="bg-brand-50"
            />
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Order Value', value: formatPrice(data.summary.averageOrderValue) },
              { label: 'New Customers', value: `+${data.summary.newCustomers}` },
              { label: 'Revenue Growth', value: `${data.summary.revenueGrowth > 0 ? '+' : ''}${data.summary.revenueGrowth}%` },
              { label: 'Orders Growth', value: `${data.summary.ordersGrowth > 0 ? '+' : ''}${data.summary.ordersGrowth}%` },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900">Revenue Over Time</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <TrendingUp size={14} className="text-green-500" />
                  <span>{data.summary.revenueGrowth > 0 ? '+' : ''}{data.summary.revenueGrowth}% vs prev period</span>
                </div>
              </div>
              <div className="flex items-end gap-1 h-40">
                {data.dailyRevenue.slice(-30).map((d, i) => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full bg-brand-500 rounded-sm hover:bg-brand-600 transition-colors cursor-pointer"
                      style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 140)}px` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatPrice(d.revenue)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>{data.dailyRevenue[0]?.date}</span>
                <span>{data.dailyRevenue[data.dailyRevenue.length - 1]?.date}</span>
              </div>
            </div>

            {/* Orders by Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Orders by Status</h2>
              <div className="space-y-3">
                {data.ordersByStatus.map(({ status, _count }) => {
                  const total = data.ordersByStatus.reduce((s, o) => s + o._count.id, 0)
                  const pct = total > 0 ? (_count.id / total) * 100 : 0
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
                          {status}
                        </span>
                        <span className="text-sm font-medium text-gray-700">{_count.id}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {data.recentOrders.slice(0, 6).map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500 truncate">{order.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Top Products */}
              <div className="bg-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-base font-semibold text-gray-900">Top Products</h2>
                  <Link href="/admin/products" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {data.topProducts.slice(0, 5).map((p, i) => (
                    <div key={p.productId} className="flex items-center gap-3 px-6 py-3">
                      <span className="w-5 text-xs text-gray-400 font-medium">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{p.name}</p>
                      </div>
                      <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                        {p._sum.quantity} sold
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alert */}
              {data.lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-amber-200">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <h2 className="text-base font-semibold text-amber-800">Low Stock Alert</h2>
                  </div>
                  <div className="divide-y divide-amber-100">
                    {data.lowStockProducts.slice(0, 5).map(p => (
                      <Link key={p.id} href={`/admin/products/${p.id}`}
                        className="flex items-center justify-between px-6 py-3 hover:bg-amber-100 transition-colors">
                        <p className="text-sm text-amber-800 truncate flex-1">{p.name}</p>
                        <span className="text-xs font-bold text-amber-700 ml-2">{p.stock} left</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
