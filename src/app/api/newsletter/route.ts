import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { newsletterSchema } from '@/lib/validation'
import { parseBody, successResponse, errorResponse } from '@/lib/api-helpers'
import { strictRateLimit } from '@/lib/rate-limit'
import { createHmac, timingSafeEqual } from 'crypto'

// ❌ export kaldırıldı
function generateUnsubToken(email: string): string {
  const secret = process.env.JWT_SECRET ?? 'allorea-dev-secret-CHANGE-IN-PRODUCTION-min32chars'
  return createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
}

function verifyUnsubToken(email: string, token: string): boolean {
  try {
    const expected = Buffer.from(generateUnsubToken(email))
    const provided = Buffer.from(token)
    if (expected.length !== provided.length) return false
    return timingSafeEqual(expected, provided)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  const { data, error } = await parseBody(request, newsletterSchema)
  if (error) return error

  const existing = await db.newsletterSubscriber.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    if (!existing.isActive) {
      await db.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { isActive: true, name: data.name ?? existing.name },
      })
      return successResponse({ message: 'Welcome back! You have been resubscribed.' })
    }
    return successResponse({ message: 'You are already subscribed.' })
  }

  await db.newsletterSubscriber.create({ data })
  return successResponse({ message: 'Successfully subscribed!' }, 201)
}

export async function DELETE(request: NextRequest) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  const { searchParams } = request.nextUrl
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  if (!email) return errorResponse('email parameter is required', 400)

  if (!token || !verifyUnsubToken(email, token)) {
    return errorResponse('Invalid or missing unsubscribe token', 403)
  }

  await db.newsletterSubscriber.updateMany({
    where: { email: email.toLowerCase() },
    data: { isActive: false },
  })

  return successResponse({ message: 'Unsubscribed successfully.' })
}
