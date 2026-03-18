// src/app/api/customers/[id]/route.ts
// DÜZELTİLDİ: passwordHash alanı hiçbir zaman API yanıtında dönmüyor.
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try { await requireAdmin() } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unauthorized',
      err instanceof AuthError ? err.statusCode : 401
    )
  }

  const customer = await db.user.findUnique({
    where: { id: params.id },
    select: {
      // passwordHash alanı KASITLI OLARAK DIŞARIDA BIRAKILDI
      id:        true,
      email:     true,
      name:      true,
      role:      true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        select: {
          id:          true,
          orderNumber: true,
          status:      true,
          total:       true,
          createdAt:   true,
          items: {
            select: { name: true, quantity: true, price: true },
          },
        },
      },
      addresses: {
        select: {
          id:         true,
          firstName:  true,
          lastName:   true,
          address1:   true,
          city:       true,
          country:    true,
          isDefault:  true,
          // phone kasıtlı olarak dahil — admin görebilir
          phone:      true,
        },
      },
      reviews: {
        select: {
          id:        true,
          rating:    true,
          body:      true,
          createdAt: true,
          product:   { select: { name: true } },
        },
      },
    },
  })

  if (!customer) return errorResponse('Customer not found', 404)
  return successResponse(customer)
}
