// src/app/api/orders/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams
} from '@/lib/api-helpers'
import { apiRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const limited = await apiRateLimit(request)
  if (limited) return limited

  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const { page, limit, skip } = getPaginationParams(request)
  const { searchParams } = request.nextUrl

  const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN'

  const baseWhere = isAdmin ? {} : { userId: session.id }
  const where: Record<string, unknown> = { ...baseWhere }

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search && isAdmin) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: {
                  take: 1,
                  orderBy: { position: 'asc' },
                },
              },
            },
          },
        },
        address: true,
      },
    }),
    db.order.count({ where }),
  ])

  return paginatedResponse(orders, total, page, limit)
}
