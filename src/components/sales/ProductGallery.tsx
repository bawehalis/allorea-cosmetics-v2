'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/lib/mock-data'

interface Props {
  images:      ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!images.length) return null

  const prev = () => setActive(i => (i - 1 + images.length) % images.length)
  const next = () => setActive(i => (i + 1) % images.length)

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Ana görsel */}
        <div
          className="relative aspect-square overflow-hidden rounded-2xl bg-nude-50 group cursor-zoom-in"
          onClick={() => setZoomed(true)}
        >
          <Image
            src={images[active].url}
            alt={images[active].alt || productName}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:1024px) 100vw, 50vw"
          />

          {/* Nav okları */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Zoom ikon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white/90 rounded-full p-1.5 shadow">
              <ZoomIn size={14} className="text-charcoal" />
            </div>
          </div>

          {/* Nokta göstergesi */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === active ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail sırası */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={cn(
                  'relative shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all',
                  i === active
                    ? 'border-brand-600 shadow-sm'
                    : 'border-transparent hover:border-nude-300'
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            onClick={() => setZoomed(false)}
          >
            <X size={20} />
          </button>
          <div
            className="relative w-full max-w-2xl aspect-square"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={images[active].alt || productName}
              fill
              className="object-contain"
              sizes="(max-width:800px) 100vw, 800px"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
