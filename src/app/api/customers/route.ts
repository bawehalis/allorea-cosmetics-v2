// src/app/api/customers/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
  }

  const { page, limit, skip } = getPaginationParams(request)
  const search = request.nextUrl.searchParams.get('search')

  const where = search
    ? { OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name:  { contains: search, mode: 'insensitive' as const } },
      ]}
    : {}

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where:   { ...where, role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, email: true, name: true, role: true, createdAt: true,
        _count:  { select: { orders: true } },
        orders:  { select: { total: true }, take: 100 },
      },
    }),
    db.user.count({ where: { ...where, role: 'CUSTOMER' } }),
  ])

  const enriched = customers.map((c) => ({
    id:         c.id,
    email:      c.email,
    name:       c.name,
    role:       c.role,
    createdAt:  c.createdAt,
    orderCount: c._count.orders,
    totalSpent: Math.round(c.orders.reduce((s, o) => s + o.total, 0) * 100) / 100,
  }))

  return paginatedResponse(enriched, total, page, limit)
}
