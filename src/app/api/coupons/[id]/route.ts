// src/app/api/coupons/[id]/route.ts
// DÜZELTİLDİ: GET endpoint eklendi (admin panel coupon detayı için gerekli)
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { couponSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'

type Params = { params: { id: string } }

function adminError(err: unknown) {
  return errorResponse(
    err instanceof Error ? err.message : 'Unauthorized',
    err instanceof AuthError ? err.statusCode : 401
  )
}

export async function GET(_: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const coupon = await db.coupon.findUnique({
    where:   { id: params.id },
    include: { _count: { select: { orders: true } } },
  })
  if (!coupon) return errorResponse('Coupon not found', 404)
  return successResponse(coupon)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const existing = await db.coupon.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Coupon not found', 404)

  const { data, error } = await parseBody(request, couponSchema.partial())
  if (error) return error

  const coupon = await db.coupon.update({
    where: { id: params.id },
    data:  { ...data, ...(data.expiresAt ? { expiresAt: new Date(data.expiresAt) } : {}) },
  })
  return successResponse(coupon)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const existing = await db.coupon.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Coupon not found', 404)

  // Soft delete — kullanılmış kuponların sipariş geçmişini korur
  await db.coupon.update({ where: { id: params.id }, data: { isActive: false } })
  return successResponse({ message: 'Coupon deactivated' })
}
