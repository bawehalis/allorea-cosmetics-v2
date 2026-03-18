// src/app/api/categories/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { categorySchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse, slugify } from '@/lib/api-helpers'

export async function GET() {
  const categories = await db.category.findMany({
    include: {
      children: true,
      _count:   { select: { products: { where: { isActive: true } } } },
    },
    orderBy: { name: 'asc' },
  })
  return successResponse(categories)
}

export async function POST(request: NextRequest) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
  }
  const { data, error } = await parseBody(request, categorySchema)
  if (error) return error

  const slug = data.slug ?? slugify(data.name)
  const existing = await db.category.findUnique({ where: { slug } })
  if (existing) return errorResponse('A category with this slug already exists', 409)

  const category = await db.category.create({ data: { ...data, slug } })
  return successResponse(category, 201)
}
