// src/app/api/products/route.ts
// BUG 7 FIX: 'bestseller' sort no longer references the non-existent 'reviewCount' DB column.
//   Replaced with { isBestSeller: 'desc', createdAt: 'desc' }.
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { productSchema } from '@/lib/validation'
import {
  parseBody,
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  slugify,
} from '@/lib/api-helpers'
import { apiRateLimit } from '@/lib/rate-limit'
import type { Prisma } from '@prisma/client'

// BUG 7 FIX: Only use real database columns in orderBy
const SORT_MAP: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  'price-asc':  { price: 'asc' },
  'price-desc': { price: 'desc' },
  'newest':     { createdAt: 'desc' },
  'oldest':     { createdAt: 'asc' },
  'name':       { name: 'asc' },
  // isBestSeller is an actual boolean column — valid for sorting
  'bestseller': { isBestSeller: 'desc' },
  'featured':   { isFeatured: 'desc' },
}

export async function GET(request: NextRequest) {
  const limited = await apiRateLimit(request)
  if (limited) return limited

  const { searchParams } = request.nextUrl
  const { page, limit, skip } = getPaginationParams(request)

  // Build type-safe where clause
  const where: Prisma.ProductWhereInput = { isActive: true }

  const category = searchParams.get('category')
  if (category) where.category = { slug: category }

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: search, mode: 'insensitive' } } } },
    ]
  }

  if (searchParams.get('featured') === 'true')    where.isFeatured   = true
  if (searchParams.get('bestseller') === 'true')  where.isBestSeller = true
  if (searchParams.get('new') === 'true')         where.isNew        = true
  if (searchParams.get('sale') === 'true')        where.comparePrice = { not: null }

  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
    }
  }

  const sort = searchParams.get('sort') ?? 'newest'
  const orderBy = SORT_MAP[sort] ?? SORT_MAP['newest']

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images:   { orderBy: { position: 'asc' } },
        reviews:  { select: { rating: true } },
        _count:   { select: { reviews: true } },
      },
    }),
    db.product.count({ where }),
  ])

  const enriched = products.map((p) => ({
    ...p,
    averageRating:
      p.reviews.length > 0
        ? Math.round(
            (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length) * 10
          ) / 10
        : null,
    reviewCount: p._count.reviews,
    reviews: undefined,
    _count:   undefined,
  }))

  return paginatedResponse(enriched, total, page, limit)
}

export async function POST(request: NextRequest) {
  const limited = await apiRateLimit(request)
  if (limited) return limited

  try {
    await requireAdmin()
  } catch (err) {
    const status = err instanceof AuthError ? err.statusCode : 401
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
  }

  const { data, error } = await parseBody(request, productSchema)
  if (error) return error

  const slug = data.slug ?? slugify(data.name)

  const existing = await db.product.findFirst({
    where: { OR: [{ slug }, { sku: data.sku }] },
    select: { id: true, slug: true, sku: true },
  })
  if (existing) {
    return errorResponse('A product with this slug or SKU already exists', 409)
  }

  const { images, tags, ...productData } = data

  const product = await db.product.create({
    data: {
      ...productData,
      slug,
      images: { create: images },
      tags:   tags ? { create: tags.map((tag) => ({ tag })) } : undefined,
    },
    include: {
      category: true,
      images:   { orderBy: { position: 'asc' } },
      tags:     true,
    },
  })

  return successResponse(product, 201)
}
