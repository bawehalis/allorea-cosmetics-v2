// src/app/api/wishlist/route.ts
// BUG 1 FIX: All session.userId → session.id
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'

const schema = z.object({ productId: z.string().cuid() })

export async function GET() {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const items = await db.wishlistItem.findMany({
    where:   { userId: session.id },  // BUG 1 FIX
    include: {
      product: {
        include: {
          images:   { take: 1, orderBy: { position: 'asc' } },
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return successResponse(items)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const { data, error } = await parseBody(request, schema)
  if (error) return error

  const product = await db.product.findUnique({
    where:  { id: data.productId, isActive: true },
    select: { id: true },
  })
  if (!product) return errorResponse('Product not found', 404)

  // Toggle: if already wishlisted, remove; otherwise add
  const existing = await db.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: session.id, productId: data.productId },  // BUG 1 FIX
    },
  })

  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } })
    return successResponse({ wishlisted: false, message: 'Removed from wishlist' })
  }

  await db.wishlistItem.create({
    data: { userId: session.id, productId: data.productId },  // BUG 1 FIX
  })
  return successResponse({ wishlisted: true, message: 'Added to wishlist' }, 201)
}

export async function DELETE(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) return errorResponse('productId is required', 400)

  await db.wishlistItem.deleteMany({
    where: { userId: session.id, productId },  // BUG 1 FIX
  })

  return successResponse({ message: 'Removed from wishlist' })
}
