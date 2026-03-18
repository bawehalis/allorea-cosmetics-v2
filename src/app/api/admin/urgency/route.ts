// src/app/api/admin/urgency/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

let URGENCY = {
  buyers24hEnabled: true,  buyers24hCount: 128,
  stockWarningEnabled: true, stockWarningThreshold: 20,
  viewersEnabled: true,  viewersCount: 23,
  customText: '', customTextEnabled: false,
}

function adminError(err: unknown) {
  const status = err instanceof AuthError ? err.statusCode : 401
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
}

export async function GET() {
  // Public — ürün sayfası okur
  return successResponse(URGENCY)
}

export async function PUT(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const body = await request.json()
  URGENCY = { ...URGENCY, ...body }
  return successResponse(URGENCY)
}
