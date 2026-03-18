// src/app/api/products/[id]/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { productUpdateSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse, slugify } from '@/lib/api-helpers'
import type { Prisma } from '@prisma/client'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const product = await db.product.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
      isActive: true,
    },
    include: {
      category: true,
      images:   { orderBy: { position: 'asc' } },
      variants: true,
      tags:     true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      _count: { select: { reviews: true } },
    },
  })

  if (!product) return errorResponse('Product not found', 404)

  const averageRating =
    product.reviews.length > 0
      ? Math.round(
          (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length) * 10
        ) / 10
      : null

  return successResponse({
    ...product,
    averageRating,
    reviewCount: product._count.reviews,
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await requireAdmin()
  } catch (err) {
    const status = err instanceof AuthError ? err.statusCode : 401
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
  }

  const { data, error } = await parseBody(request, productUpdateSchema)
  if (error) return error

  const existing = await db.product.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Product not found', 404)

  const { images, tags, ...rest } = data

  // Build update payload — only include fields that were provided
  const updateData: Prisma.ProductUpdateInput = { ...rest }

  if (data.name && !data.slug) {
    updateData.slug = slugify(data.name)
  }

  if (images) {
    // Replace all images atomically
    updateData.images = {
      deleteMany: {},
      create: images,
    }
  }

  if (tags) {
    updateData.tags = {
      deleteMany: {},
      create: tags.map((tag) => ({ tag })),
    }
  }

  const product = await db.product.update({
    where: { id: params.id },
    data:  updateData,
    include: {
      category: true,
      images:   { orderBy: { position: 'asc' } },
      tags:     true,
    },
  })

  return successResponse(product)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await requireAdmin()
  } catch (err) {
    const status = err instanceof AuthError ? err.statusCode : 401
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
  }

  const existing = await db.product.findUnique({
    where: { id: params.id },
    select: { id: true },
  })
  if (!existing) return errorResponse('Product not found', 404)

  // Soft delete — preserves order history
  await db.product.update({
    where: { id: params.id },
    data:  { isActive: false },
  })

  return successResponse({ message: 'Product deactivated successfully' })
}
