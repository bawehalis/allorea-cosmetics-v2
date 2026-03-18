// src/app/api/admin/content/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

let CONTENT = {
  heroTitle:     'Saç Dökülmesini\nDurdurun.',
  heroSubtitle:  '30 günde görünür fark veya paranızı geri alın.',
  heroCta:       'Hemen Sipariş Ver',
  heroImageUrl:  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  beforeUrl:     'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
  afterUrl:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  beforeLabel:   'Önce',
  afterLabel:    'Sonra',
  seoTitle:      'Allorea Cosmetics — Saç Bakımında Bilimsel Güç',
  seoDescription:'30 günde görünür fark veya paranız iade.',
}

function adminError(err: unknown) {
  const status = err instanceof AuthError ? err.statusCode : 401
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
}

export async function GET() {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  return successResponse(CONTENT)
}

export async function PUT(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const body = await request.json()
  CONTENT = { ...CONTENT, ...body }
  return successResponse(CONTENT)
}
