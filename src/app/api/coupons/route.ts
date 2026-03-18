// src/app/api/coupons/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { couponSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'

function adminError(err: unknown) {
  const status = err instanceof AuthError ? err.statusCode : 401
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
}

export async function GET(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  })
  return successResponse(coupons)
}

export async function POST(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const { data, error } = await parseBody(request, couponSchema)
  if (error) return error

  const existing = await db.coupon.findUnique({ where: { code: data.code } })
  if (existing) return errorResponse('Coupon code already exists', 409)

  const coupon = await db.coupon.create({
    data: { ...data, expiresAt: data.expiresAt ? new Date(data.expiresAt) : null },
  })
  return successResponse(coupon, 201)
}
