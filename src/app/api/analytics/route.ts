// src/app/api/analytics/route.ts
// BUG 3 FIX: Removed db.product.fields.lowStockAt — use numeric literal 5 (schema default)
// BUG 11 FIX: AuthError caught specifically so 401 vs 403 is preserved
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
  } catch (err) {
    const status = err instanceof AuthError ? err.statusCode : 401
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
  }

  const { searchParams } = request.nextUrl
  const range = searchParams.get('range') ?? '30'
  const days = Math.min(Math.max(parseInt(range, 10), 1), 365) // clamp 1–365
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const prevSince = new Date(since.getTime() - days * 24 * 60 * 60 * 1000)

  // LOW_STOCK_THRESHOLD matches the Prisma schema default for lowStockAt
  const LOW_STOCK_THRESHOLD = 10

  const [
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    topProducts,
    ordersByStatus,
    revenueByDay,
    newCustomers,
    lowStockProducts,
    prevRevenue,
    prevOrders,
  ] = await Promise.all([
    db.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum:  { total: true },
    }),
    db.order.count({ where: { createdAt: { gte: since } } }),
    db.user.count({ where: { role: 'CUSTOMER' } }),
    db.product.count({ where: { isActive: true } }),

    db.order.findMany({
      where:   { createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take:    10,
      select: {
        id: true, orderNumber: true, email: true, total: true,
        status: true, createdAt: true,
        items: { select: { name: true, quantity: true } },
      },
    }),

    db.orderItem.groupBy({
      by:      ['productId', 'name'],
      _sum:    { quantity: true },
      _count:  { orderId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take:    5,
    }),

    db.order.groupBy({
      by:    ['status'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
    }),

    db.order.findMany({
      where:   { createdAt: { gte: since }, paymentStatus: 'PAID' },
      select:  { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    }),

    db.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: since } } }),

    // BUG 3 FIX: Use numeric threshold — db.product.fields is not valid Prisma
    db.product.findMany({
      where:   { isActive: true, stock: { lte: LOW_STOCK_THRESHOLD } },
      select:  { id: true, name: true, stock: true, lowStockAt: true, sku: true },
      orderBy: { stock: 'asc' },
      take:    10,
    }),

    // Previous period for growth comparison
    db.order.aggregate({
      where: { paymentStatus: 'PAID', createdAt: { gte: prevSince, lt: since } },
      _sum:  { total: true },
    }),
    db.order.count({ where: { createdAt: { gte: prevSince, lt: since } } }),
  ])

  // Build daily revenue map
  const revenueMap: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(d.getDate() + i)
    revenueMap[d.toISOString().split('T')[0]] = 0
  }
  for (const order of revenueByDay) {
    const day = order.createdAt.toISOString().split('T')[0]
    if (day in revenueMap) revenueMap[day] += order.total
  }

  const currentRevenue  = totalRevenue._sum.total ?? 0
  const previousRevenue = prevRevenue._sum.total   ?? 0

  const pct = (current: number, previous: number) =>
    previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : 0

  return successResponse({
    summary: {
      totalRevenue:     Math.round(currentRevenue * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      newCustomers,
      revenueGrowth:    pct(currentRevenue, previousRevenue),
      ordersGrowth:     pct(totalOrders, prevOrders),
      averageOrderValue: totalOrders > 0 ? Math.round((currentRevenue / totalOrders) * 100) / 100 : 0,
    },
    recentOrders,
    topProducts,
    ordersByStatus,
    dailyRevenue:   Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue })),
    lowStockProducts,
  })
}
