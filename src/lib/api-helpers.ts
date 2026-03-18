// src/lib/api-helpers.ts
// GÜVENLİK DÜZELTMESİ: CORS wildcard (*) kaldırıldı.
// withCors() yalnızca NEXT_PUBLIC_APP_URL ile tanımlı origin'e izin verir.
// Tanımsızsa wildcard yerine güvenli hata mesajı döner.
import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status })
}

export function errorResponse(message: string, status = 400, details?: unknown): NextResponse {
  return NextResponse.json({ error: message, details }, { status })
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  })
}

export async function parseBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const json = await request.json()
    const data = schema.parse(json)
    return { data, error: null }
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: err.errors.map(e => ({
              field:   e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 422 }
        ),
      }
    }
    return { data: null, error: errorResponse('Invalid JSON body', 400) }
  }
}

export function getPaginationParams(
  request: NextRequest
): { page: number; limit: number; skip: number } {
  const { searchParams } = request.nextUrl
  const page  = Math.max(1, parseInt(searchParams.get('page')  || '1',  10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
  return { page, limit, skip: (page - 1) * limit }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSKU(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase()
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${random}`
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random    = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `ALR-${timestamp}-${random}`
}

export function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, c =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#x27;' }[c] ?? c)
  )
}

// GÜVENLİK: CORS — yalnızca tanımlı uygulama URL'sine izin ver, wildcard (*) kullanma
function getAllowedOrigin(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    // Tanımsızsa en kısıtlayıcı seçenek: hiçbir harici origin'e izin verme
    console.warn('[cors] NEXT_PUBLIC_APP_URL tanımlı değil, CORS devre dışı')
    return 'null'
  }
  return appUrl
}

export const corsHeaders = {
  'Access-Control-Allow-Origin':  getAllowedOrigin(),
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age':       '86400',
}

export function withCors(response: NextResponse): NextResponse {
  Object.entries(corsHeaders).forEach(([key, value]) =>
    response.headers.set(key, value)
  )
  return response
}
