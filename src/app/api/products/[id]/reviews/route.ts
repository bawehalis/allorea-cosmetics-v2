// src/app/api/products/[id]/reviews/route.ts
// BUG 1 FIX: All session.userId → session.id
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import {
  parseBody,
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
} from '@/lib/api-helpers'
import { strictRateLimit } from '@/lib/rate-limit'

type Params = { params: { id: string } }

export async function GET(request: NextRequest, { params }: Params) {
  const { page, limit, skip } = getPaginationParams(request)

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where:   { productId: params.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { user: { select: { name: true } } },
    }),
    db.review.count({ where: { productId: params.id } }),
  ])

  return paginatedResponse(
    reviews.map((r) => ({
      id:         r.id,
      rating:     r.rating,
      title:      r.title,
      body:       r.body,
      isVerified: r.isVerified,
      createdAt:  r.createdAt,
      userName:   r.user?.name ?? 'Anonymous',
    })),
    total,
    page,
    limit
  )
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title:  z.string().max(200).optional(),
  body:   z.string().min(10).max(2000),
})

export async function POST(request: NextRequest, { params }: Params) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  const session = await getSession()
  if (!session) return errorResponse('You must be signed in to leave a review', 401)

  const { data, error } = await parseBody(request, reviewSchema)
  if (error) return error

  const product = await db.product.findUnique({
    where:  { id: params.id, isActive: true },
    select: { id: true },
  })
  if (!product) return errorResponse('Product not found', 404)

  // BUG 1 FIX: session.id (not session.userId)
  const existing = await db.review.findFirst({
    where: { productId: params.id, userId: session.id },
  })
  if (existing) return errorResponse('You have already reviewed this product', 409)

  // BUG 1 FIX: session.id (not session.userId)
  const purchased = await db.orderItem.findFirst({
    where: {
      productId: params.id,
      order: { userId: session.id, status: 'DELIVERED' },
    },
  })

  const review = await db.review.create({
    data: {
      productId:  params.id,
      userId:     session.id,  // BUG 1 FIX
      rating:     data.rating,
      title:      data.title,
      body:       data.body,
      isVerified: !!purchased,
    },
    include: { user: { select: { name: true } } },
  })

  return successResponse(
    {
      id:         review.id,
      rating:     review.rating,
      title:      review.title,
      body:       review.body,
      isVerified: review.isVerified,
      createdAt:  review.createdAt,
      userName:   review.user?.name ?? 'Anonymous',
    },
    201
  )
}
