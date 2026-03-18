// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export type Role = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'

export interface Session {
  id:    string
  email: string
  role:  Role
  iat?:  number
  exp?:  number
}

// AÇIK 5 DÜZELTİLDİ: JWT_SECRET set edilmemişse üretimde crash yerine açık uyarı ver.
// Geliştirme ortamında fallback kabul edilebilir, production'da MUTLAKA set edilmeli.
const rawSecret = process.env.JWT_SECRET

if (!rawSecret) {
  if (process.env.NODE_ENV === 'production') {
    // Production'da secret yoksa uygulama BAŞLAMAMALI
    throw new Error(
      'FATAL: JWT_SECRET environment variable is not set. ' +
      'Set a strong random secret (min 32 chars) before deploying.'
    )
  } else {
    console.warn(
      '[auth] WARNING: JWT_SECRET is not set. ' +
      'Using insecure fallback for development only. ' +
      'NEVER deploy without setting JWT_SECRET.'
    )
  }
}

const JWT_SECRET = new TextEncoder().encode(
  rawSecret ?? 'allorea-dev-secret-CHANGE-IN-PRODUCTION-min32chars'
)

const COOKIE_NAME    = 'allorea_auth'
const TOKEN_EXPIRY   = '7d'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function signToken(
  payload: Omit<Session, 'iat' | 'exp'>
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (
      typeof payload.id    === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role  === 'string'
    ) {
      return payload as unknown as Session
    }
    return null
  } catch {
    return null
  }
}

export function setAuthCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
}

export function clearAuthCookie(): void {
  cookies().delete(COOKIE_NAME)
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  if (!session) throw new AuthError('Unauthorized', 401)
  return session
}

export async function requireAdmin(): Promise<Session> {
  const session = await getSession()
  if (!session) throw new AuthError('Unauthorized', 401)
  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    throw new AuthError('Forbidden: admin access required', 403)
  }
  return session
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = 'AuthError'
  }
}
