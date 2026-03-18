// src/app/api/upload/route.ts
// GÜVENLİK DÜZELTMESİ: Content-Type spoof koruması eklendi.
// file.type sadece tarayıcının bildirdiği MIME tipini verir — kolayca sahte yapılabilir.
// Magic bytes (dosyanın ilk baytları) kontrol edilerek gerçek dosya tipi doğrulanır.
import { NextRequest } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-helpers'
import { strictRateLimit } from '@/lib/rate-limit'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

// Desteklenen formatların magic byte imzaları
const MAGIC_BYTES: Record<string, { bytes: number[]; offset?: number }[]> = {
  'image/jpeg': [{ bytes: [0xFF, 0xD8, 0xFF] }],
  'image/png':  [{ bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
  'image/webp': [{ bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }], // RIFF header
  'image/avif': [{ bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }], // ftyp box
}

async function detectMimeType(buffer: ArrayBuffer): Promise<string | null> {
  const bytes = new Uint8Array(buffer.slice(0, 16))

  for (const [mimeType, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sig of signatures) {
      const offset = sig.offset ?? 0
      const match  = sig.bytes.every((byte, i) => bytes[offset + i] === byte)
      if (match) return mimeType
    }
  }
  return null
}

export async function POST(request: NextRequest) {
  const limited = await strictRateLimit(request)
  if (limited) return limited

  try { await requireAdmin() } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unauthorized',
      err instanceof AuthError ? err.statusCode : 401
    )
  }

  const formData = await request.formData()
  const file     = formData.get('file') as File | null

  if (!file) return errorResponse('Dosya sağlanmadı', 400)

  // Boyut kontrolü
  if (file.size > MAX_SIZE_BYTES) {
    return errorResponse('Dosya boyutu 5 MB limitini aşıyor', 400)
  }

  // Content-Type spoofing koruması: magic bytes ile gerçek tipi doğrula
  const buffer        = await file.arrayBuffer()
  const detectedMime  = await detectMimeType(buffer)

  if (!detectedMime) {
    return errorResponse(
      'Geçersiz dosya formatı. Yalnızca JPEG, PNG, WebP ve AVIF desteklenmektedir.', 400
    )
  }

  // Bildirilen tip ile gerçek tip uyuşmuyor mu?
  if (file.type !== detectedMime) {
    return errorResponse(
      `Dosya tipi uyumsuzluğu. Bildirilen: ${file.type}, Gerçek: ${detectedMime}`, 400
    )
  }

  // ── Production: Cloudinary ────────────────────────────────────────────
  // const { v2: cloudinary } = await import('cloudinary')
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  //   api_key:    process.env.CLOUDINARY_API_KEY!,
  //   api_secret: process.env.CLOUDINARY_API_SECRET!,
  // })
  // const result = await new Promise<{ secure_url: string; public_id: string }>(
  //   (resolve, reject) => {
  //     cloudinary.uploader.upload_stream(
  //       { folder: 'allorea-products', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
  //       (err, res) => err ? reject(err) : resolve(res!)
  //     ).end(Buffer.from(buffer))
  //   }
  // )
  // return successResponse({ url: result.secure_url, publicId: result.public_id })
  // ─────────────────────────────────────────────────────────────────────

  return successResponse({
    url:     'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    message: 'Dev placeholder — üretimde CLOUDINARY_* env değişkenlerini tanımlayın',
  })
}
