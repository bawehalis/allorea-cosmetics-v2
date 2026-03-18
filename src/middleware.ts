// src/middleware.ts
// AÇIK 1 DÜZELTİLDİ: Admin koruması yeniden aktif edildi.
// verifyToken her /admin isteğinde çalışır, geçersiz/eksik token varsa /login'e yönlendirir.

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const ADMIN_PATHS = ['/admin']

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/newsletter',
  '/api/webhooks',
  '/api/products',
  '/api/categories',
  '/api/blog',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Güvenlik başlıkları — tüm yanıtlara eklenir
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Public path'ler — auth kontrolü yok
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return response
  }

  // ── Admin route koruması ─────────────────────────────────────────────────
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get('allorea_auth')?.value

    // Token yok → login'e yönlendir
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Token geçersiz veya süresi dolmuş → login'e yönlendir, cookie sil
    const payload = await verifyToken(token)
    if (!payload) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const redirectResponse = NextResponse.redirect(loginUrl)
      redirectResponse.cookies.delete('allorea_auth')
      return redirectResponse
    }

    // Rol yetersiz → ana sayfaya gönder
    if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Geçerli admin — downstream kullanım için header'a yaz
    response.headers.set('X-User-Id',   payload.id)
    response.headers.set('X-User-Role', payload.role)
    return response
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|og-image.jpg).*)',
  ],
}
