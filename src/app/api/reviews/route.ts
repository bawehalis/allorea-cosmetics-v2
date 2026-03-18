// src/app/api/reviews/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { strictRateLimit } from '@/lib/rate-limit'

const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  const session = await getSession()
  if (!session) return errorResponse('You must be signed in to leave a review', 401)

  const { data, error } = await parseBody(request, reviewSchema)
  if (error) return error

  const product = await db.product.findUnique({
    where: { id: data.productId, isActive: true },
  })
  if (!product) return errorResponse('Product not found', 404)

  // BUG 1 FIX: use session.id (not session.userId)
  const existing = await db.review.findFirst({
    where: { productId: data.productId, userId: session.id },
  })
  if (existing) return errorResponse('You have already reviewed this product', 409)

  const purchased = await db.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: { userId: session.id, status: 'DELIVERED' },
    },
  })

  const review = await db.review.create({
    data: {
      productId: data.productId,
      userId: session.id,
      rating: data.rating,
      title: data.title,
      body: data.body,
      isVerified: !!purchased,
    },
    include: { user: { select: { name: true } } },
  })

  return successResponse(review, 201)
}
