// src/app/api/admin/newsletter-subscribers/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
  }

  const { page, limit, skip } = getPaginationParams(request)
  const activeOnly = request.nextUrl.searchParams.get('active') !== 'false'

  const where = activeOnly ? { isActive: true } : {}
  const [subscribers, total] = await Promise.all([
    db.newsletterSubscriber.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    db.newsletterSubscriber.count({ where }),
  ])

  return paginatedResponse(subscribers, total, page, limit)
}
