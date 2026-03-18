// src/app/api/checkout/validate-coupon/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { strictRateLimit } from '@/lib/rate-limit'

const schema = z.object({
  code:     z.string().min(1).max(50).trim().transform(v => v.toUpperCase()),
  subtotal: z.number().positive(),
})

export async function POST(request: NextRequest) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  const { data, error } = await parseBody(request, schema)
  if (error) return error

  const coupon = await db.coupon.findFirst({
    where: {
      code:     data.code,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
  })

  if (!coupon) return errorResponse('Invalid or expired coupon code', 404)

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return errorResponse('This coupon has reached its usage limit', 400)
  }

  if (coupon.minPurchase && data.subtotal < coupon.minPurchase) {
    return errorResponse(
      `Minimum purchase of $${coupon.minPurchase.toFixed(2)} required`,
      400
    )
  }

  const discount =
    coupon.type === 'PERCENTAGE'
      ? Math.round((data.subtotal * coupon.value) / 100 * 100) / 100
      : Math.min(coupon.value, data.subtotal)

  return successResponse({
    valid:   true,
    code:    coupon.code,
    type:    coupon.type,
    value:   coupon.value,
    discount,
    message: coupon.type === 'PERCENTAGE'
      ? `${coupon.value}% discount applied`
      : `$${coupon.value.toFixed(2)} discount applied`,
  })
}
