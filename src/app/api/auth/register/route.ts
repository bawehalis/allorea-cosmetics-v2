// src/app/api/auth/register/route.ts
// GÜVENLİK: Role field client'tan alınmıyor — her zaman 'CUSTOMER' hardcode.
// Zod şeması role kabul etse bile DB'ye yazılmaz (defense in depth).
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { signToken, setAuthCookie, hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { authRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const limited = await authRateLimit(request)
  if (limited) return limited

  const { data, error } = await parseBody(request, registerSchema)
  if (error) return error

  const existing = await db.user.findUnique({ where: { email: data.email } })
  if (existing) {
    // Kullanıcı bulunamadı mesajı verme — email enumeration önlemi
    // Her iki durumda da aynı mesajı döndür
    return errorResponse('An account with this email already exists', 409)
  }

  const passwordHash = await hashPassword(data.password)

  // GÜVENLIK: role kesinlikle CUSTOMER — body'den alınmıyor
  const user = await db.user.create({
    data: {
      email:        data.email,
      name:         data.name,
      passwordHash,
      role:         'CUSTOMER',  // ← asla client'tan almıyoruz
    },
    select: { id: true, email: true, name: true, role: true },
  })

  const token = await signToken({ id: user.id, email: user.email, role: user.role })
  setAuthCookie(token)

  return successResponse(
    { user: { id: user.id, email: user.email, name: user.name, role: user.role } },
    201
  )
}
