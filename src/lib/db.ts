// src/lib/db.ts
// Prisma singleton for Next.js serverless environments.
//
// In development, Next.js hot-reload creates new module instances on each reload
// which would create multiple PrismaClient connections and exhaust the pool.
// Using globalThis prevents this by reusing the same instance across reloads.
//
// In production (Vercel), each serverless function instance gets one PrismaClient
// and globalThis caching is not needed (but harmless).
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  })
}

export const db: PrismaClient =
  globalThis.__prisma ?? createPrismaClient()

// Cache in development only — prevents connection pool exhaustion on hot-reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

export default db
