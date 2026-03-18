// src/app/api/blog/route.ts
// AÇIK 2 DÜZELTİLDİ: ?admin=true parametresiyle anonim yetki yükseltmesi engellendi.
// Taslak yazıları görmek için requireAdmin() kontrolü zorunlu.

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError, getSession } from '@/lib/auth'
import { blogPostSchema } from '@/lib/validation'
import {
  parseBody,
  successResponse,
  errorResponse,
  paginatedResponse,
  getPaginationParams,
  slugify,
} from '@/lib/api-helpers'

function adminError(err: unknown) {
  return errorResponse(
    err instanceof Error ? err.message : 'Unauthorized',
    err instanceof AuthError ? err.statusCode : 401
  )
}

export async function GET(request: NextRequest) {
  const { page, limit, skip } = getPaginationParams(request)
  const adminParam = request.nextUrl.searchParams.get('admin')

  // AÇIK 2 DÜZELTİLDİ: admin=true parametresi artık requireAdmin() ile korunuyor.
  // Anonim kullanıcılar bu parametreyi gönderemez.
  if (adminParam === 'true') {
    try {
      await requireAdmin()
    } catch (err) {
      return adminError(err)
    }
    // Admin: tüm yazılar (taslak dahil)
    const [posts, total] = await Promise.all([
      db.blogPost.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      db.blogPost.count(),
    ])
    return paginatedResponse(posts, total, page, limit)
  }

  // Public: sadece yayınlanmış yazılar
  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where:   { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    db.blogPost.count({ where: { isPublished: true } }),
  ])
  return paginatedResponse(posts, total, page, limit)
}

export async function POST(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const { data, error } = await parseBody(request, blogPostSchema)
  if (error) return error

  const slug = data.slug ?? slugify(data.title)
  const existing = await db.blogPost.findUnique({ where: { slug } })
  if (existing) return errorResponse('A post with this slug already exists', 409)

  const post = await db.blogPost.create({
    data: {
      ...data,
      slug,
      publishedAt: data.isPublished
        ? (data.publishedAt ? new Date(data.publishedAt) : new Date())
        : null,
    },
  })
  return successResponse(post, 201)
}
