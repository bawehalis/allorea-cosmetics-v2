// src/app/api/admin/bundles/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

let BUNDLES = [
  { id:'b1', productSlug:'allorea-sac-yogunlastirici-serum', label:'1 Adet', quantity:1, price:349, comparePrice:499, discountPercent:0, isMostPopular:false, savings:0 },
  { id:'b2', productSlug:'allorea-sac-yogunlastirici-serum', label:'3 Adet', quantity:3, price:799, comparePrice:1497, discountPercent:47, isMostPopular:true, savings:698 },
  { id:'b3', productSlug:'allorea-sac-yogunlastirici-serum', label:'5 Adet', quantity:5, price:1199, comparePrice:2495, discountPercent:52, isMostPopular:false, savings:1296 },
]

function adminError(err: unknown) {
  const status = err instanceof AuthError ? err.statusCode : 401
  return errorResponse(err instanceof Error ? err.message : 'Unauthorized', status)
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const result = slug ? BUNDLES.filter(b => b.productSlug === slug) : BUNDLES
  return successResponse(result)
}

export async function POST(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const body = await request.json()
  const bundle = { ...body, id: `b${Date.now()}` }
  BUNDLES = [...BUNDLES, bundle]
  return successResponse(bundle, 201)
}

export async function PUT(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const body = await request.json()
  // Slug için tüm bundle'ları güncelle
  const { productSlug, bundles: newBundles } = body
  BUNDLES = [...BUNDLES.filter(b => b.productSlug !== productSlug), ...newBundles]
  return successResponse({ updated: newBundles.length })
}

export async function DELETE(request: NextRequest) {
  try { await requireAdmin() } catch (err) { return adminError(err) }
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return errorResponse('id required', 400)
  BUNDLES = BUNDLES.filter(b => b.id !== id)
  return successResponse({ message: 'Deleted' })
}
