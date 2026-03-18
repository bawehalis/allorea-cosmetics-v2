// src/app/api/auth/me/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession, AuthError } from '@/lib/auth'
import { successResponse, errorResponse, parseBody } from '@/lib/api-helpers'

export async function GET() {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const user = await db.user.findUnique({
    where:  { id: session.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  })

  if (!user) return errorResponse('User not found', 404)
  return successResponse({ user })
}

const updateSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
})

export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session) return errorResponse('Unauthorized', 401)

  const { data, error } = await parseBody(request, updateSchema)
  if (error) return error

  const user = await db.user.update({
    where:  { id: session.id },
    data:   { ...(data.name !== undefined ? { name: data.name } : {}) },
    select: { id: true, email: true, name: true, role: true },
  })

  return successResponse({ user })
}
