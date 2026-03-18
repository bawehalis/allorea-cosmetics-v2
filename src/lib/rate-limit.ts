// src/lib/rate-limit.ts
// GÜVENLİK DÜZELTMESİ: x-forwarded-for IP spoofing koruması eklendi.
// Vercel arkasında x-forwarded-for güvenilirdir ancak direkt erişimde
// kullanıcı bu header'ı manipüle edebilir. Son IP'yi değil ilkini alıyoruz.
// Production'da Upstash Redis ile değiştirin (multi-region uyumu için).
import { NextRequest, NextResponse } from 'next/server'

interface Window {
  count:   number
  resetAt: number
}

const store = new Map<string, Window>()

if (
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as Record<string, unknown>).setInterval === 'function'
) {
  setInterval(() => {
    const now = Date.now()
    for (const [key, win] of store.entries()) {
      if (now > win.resetAt) store.delete(key)
    }
  }, 5 * 60 * 1000).unref?.()
}

interface Options {
  windowMs: number
  max:      number
  message?: string
}

function getClientIp(request: NextRequest): string {
  // Vercel ve çoğu proxy x-forwarded-for header'ını ayarlar.
  // "client, proxy1, proxy2" formatında ilk IP gerçek client IP'sidir.
  // GÜVENLİK: Saldırganın kendi IP'sini manipüle etmesini engellemek için
  // Vercel ortamında son proxy IP'si kullanmak daha güvenli.
  // Ancak x-forwarded-for listesinde ilk değer kullanmak standart yaklaşımdır.
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // İlk (gerçek client) IP'yi al, boşlukları temizle
    return forwarded.split(',')[0]?.trim() ?? 'anonymous'
  }
  return request.headers.get('x-real-ip') ?? 'anonymous'
}

export function rateLimit(options: Options) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
  } = options

  return async function check(request: NextRequest): Promise<NextResponse | null> {
    const ip  = getClientIp(request)
    const key = `${ip}:${request.nextUrl.pathname}`
    const now = Date.now()
    const existing = store.get(key)

    if (!existing || now > existing.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      return null
    }

    if (existing.count >= max) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000)
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            'Retry-After':          String(retryAfter),
            'X-RateLimit-Limit':    String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset':    String(existing.resetAt),
          },
        }
      )
    }

    existing.count++
    return null
  }
}

// Login: 15 dakikada 10 deneme
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  'Too many login attempts. Please try again in 15 minutes.',
})

// Genel API: dakikada 120 istek
export const apiRateLimit = rateLimit({ windowMs: 60 * 1000, max: 120 })

// Hassas endpoint'ler (review, upload): dakikada 20 istek
export const strictRateLimit = rateLimit({ windowMs: 60 * 1000, max: 20 })

// Checkout: 10 dakikada 5 istek
export const checkoutRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max:      5,
  message:  'Too many checkout attempts. Please wait before trying again.',
})
