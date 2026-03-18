// src/app/api/blog/[id]/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { blogPostSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse, slugify } from '@/lib/api-helpers'

type Params = { params: { id: string } }

function adminError(err: unknown) {
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
}

export async function GET(_: NextRequest, { params }: Params) {
  const post = await db.blogPost.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], isPublished: true },
  })
  if (!post) return errorResponse('Post not found', 404)
  return successResponse(post)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const { data, error } = await parseBody(request, blogPostSchema.partial())
  if (error) return error

  const existing = await db.blogPost.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Post not found', 404)

  const updateData = {
    ...data,
    ...(data.isPublished && !existing.publishedAt
      ? { publishedAt: new Date() }
      : {}),
  }

  const post = await db.blogPost.update({ where: { id: params.id }, data: updateData })
  return successResponse(post)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const existing = await db.blogPost.findUnique({ where: { id: params.id } })
  if (!existing) return errorResponse('Post not found', 404)
  await db.blogPost.delete({ where: { id: params.id } })
  return successResponse({ message: 'Post deleted' })
}
