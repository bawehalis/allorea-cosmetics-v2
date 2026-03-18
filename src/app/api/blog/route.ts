import { NextRequest } from 'next/server'

export async function GET() {
  return new Response(JSON.stringify({ message: 'Blog disabled' }), {
    status: 200,
  })
}
