// src/app/api/orders/[id]/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession, requireAdmin, AuthError } from '@/lib/auth'
import { orderStatusSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN'
  // Non-admins can only see their own orders
  const ownerFilter = isAdmin ? {} : { userId: session.id }

  const order = await db.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
      ...ownerFilter,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: { take: 1, orderBy: { position: 'asc' } },
            },
          },
        },
      },
      address: true,
      coupon:  true,
      user:    { select: { id: true, email: true, name: true } },
    },
  })

  if (!order) return errorResponse('Order not found', 404)
  return successResponse(order)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  // BUG 11 FIX: catch AuthError specifically to preserve 401 vs 403
  try {
    await requireAdmin()
  } catch (err) {
    const status = err instanceof AuthError ? err.statusCode : 401
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
  }

  const { data, error } = await parseBody(request, orderStatusSchema)
  if (error) return error

  const existing = await db.order.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Order not found', 404)

  const updated = await db.order.update({
    where: { id: params.id },
    data: {
      status: data.status,
      ...(data.status === 'CONFIRMED' ? { paymentStatus: 'PAID' }     : {}),
      ...(data.status === 'REFUNDED'  ? { paymentStatus: 'REFUNDED' } : {}),
    },
    include: { items: true, address: true },
  })

  return successResponse(updated)
}
