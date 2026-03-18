import { errorResponse } from '@/lib/api-helpers'

export async function POST() {
  return errorResponse('Coupon system disabled', 400)
}
