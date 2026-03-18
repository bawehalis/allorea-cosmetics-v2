// src/app/api/admin/reviews/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// Fake in-memory reviews store (production'da Prisma/DB kullanılır)
let REVIEWS = [
  { id:'r1', productName:'Allorea Radiance Serum', name:'Elif K.', rating:5, title:'İnanılmaz sonuç!',
    body:'3 haftada belirgin fark gördüm.', date:'2025-01-12', isVerified:true, isFeatured:true },
  { id:'r2', productName:'Allorea Radiance Serum', name:'Selin A.', rating:5, title:'Saçım büyüdü!',
    body:'Doğum sonrası saç dökülmem çok fazlaydı.', date:'2025-01-08', isVerified:true, isFeatured:false },
]

function adminError(err: unknown) {
  const status = err instanceof AuthError ? err.statusCode : 401
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
}

export async function GET() {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  return successResponse(REVIEWS)
}

export async function POST(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const body = await request.json()
  const review = {
    ...body,
    id: `r${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  }
  REVIEWS = [review, ...REVIEWS]
  return successResponse(review, 201)
}

export async function DELETE(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return errorResponse('id required', 400)
  REVIEWS = REVIEWS.filter(r => r.id !== id)
  return successResponse({ message: 'Deleted' })
}

export async function PATCH(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const { id, ...updates } = await request.json()
  REVIEWS = REVIEWS.map(r => r.id === id ? { ...r, ...updates } : r)
  return successResponse(REVIEWS.find(r => r.id === id))
}
