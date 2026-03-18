// src/app/api/inventory/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { getLowStockProducts, bulkUpdateStock } from '@/lib/inventory'
import { apiRateLimit } from '@/lib/rate-limit'
import { inventoryUpdateSchema } from '@/lib/validation'

function adminError(err: unknown) {
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', err instanceof AuthError ? err.statusCode : 401)
}

export async function GET(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }

  const thresholdParam = request.nextUrl.searchParams.get('threshold')
  const threshold = thresholdParam ? Math.max(0, parseInt(thresholdParam, 10)) : 10

  const products = await getLowStockProducts(threshold)
  return successResponse({ products, count: products.length, threshold })
}

export async function PATCH(request: NextRequest) {
  const limited = await apiRateLimit(request)
  if (limited) return limited

  try { await requireAdmin() } catch (err) { return adminError(err) }

  const { data, error } = await parseBody(request, inventoryUpdateSchema)
  if (error) return error

  await bulkUpdateStock(data.updates)
  return successResponse({ message: `Updated stock for ${data.updates.length} product(s)` })
}
