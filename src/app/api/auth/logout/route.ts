// src/app/api/auth/logout/route.ts
import { clearAuthCookie } from '@/lib/auth'
import { successResponse } from '@/lib/api-helpers'

export async function POST() {
  clearAuthCookie()
  return successResponse({ message: 'Logged out successfully' })
}
