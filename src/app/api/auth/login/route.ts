// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { signToken, setAuthCookie, verifyPassword } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { authRateLimit } from '@/lib/rate-limit'

// Bcrypt cost-12 hash of a random string — used to ensure constant-time
// comparison even when the user email doesn't exist (prevents timing attacks).
const DUMMY_HASH = '$2b$12$LCxQhJqJb5sQjCE/3lLrwutNm5qSF7UIQN9.ELFnG6jl1p7V8qHdS'

export async function POST(request: NextRequest) {
  const limited = await authRateLimit(request)
  if (limited) return limited

  const { data, error } = await parseBody(request, loginSchema)
  if (error) return error

  const user = await db.user.findUnique({
    where: { email: data.email },
    select: { id: true, email: true, name: true, role: true, passwordHash: true },
  })

  // Always run bcrypt — prevents user-enumeration via response timing.
  // If user doesn't exist, compare against a dummy hash (result discarded).
  const hashToCheck = user?.passwordHash ?? DUMMY_HASH
  const passwordOk  = await verifyPassword(data.password, hashToCheck)

  // Reject if user not found OR password wrong OR account has no password (OAuth-only)
  if (!user || !user.passwordHash || !passwordOk) {
    return errorResponse('Invalid email or password', 401)
  }

  // Sign token with canonical `id` field (not `userId`)
  const token = await signToken({ id: user.id, email: user.email, role: user.role })
  setAuthCookie(token)

  return successResponse({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
}
