// src/app/api/categories/[id]/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { categorySchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const category = await db.category.findFirst({
    where:   { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      children: true,
      products: { where: { isActive: true }, include: { images: { take: 1, orderBy: { position: 'asc' } } } },
    },
  })
  if (!category) return errorResponse('Category not found', 404)
  return successResponse(category)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
  }
  const { data, error } = await parseBody(request, categorySchema.partial())
  if (error) return error
  const category = await db.category.update({ where: { id: params.id }, data })
  return successResponse(category)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
  }
  const count = await db.product.count({ where: { categoryId: params.id, isActive: true } })
  if (count > 0) return errorResponse('Cannot delete a category that has active products', 400)
  await db.category.delete({ where: { id: params.id } })
  return successResponse({ message: 'Category deleted' })
}
