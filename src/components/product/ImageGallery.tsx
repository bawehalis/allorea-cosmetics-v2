'use client'
// src/components/product/ImageGallery.tsx
'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { ZoomIn, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductImage } from '@/types'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current || !zoom) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const prev = () => setSelected(s => (s - 1 + images.length) % images.length)
  const next = () => setSelected(s => (s + 1) % images.length)

  if (!images.length) return null

  return (
    <>
      <div className="flex gap-4">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2.5 w-[72px] shrink-0">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setSelected(i)}
                className={cn('relative w-[72px] h-[86px] overflow-hidden border-2 transition-all duration-150',
                  selected === i ? 'border-charcoal' : 'border-transparent hover:border-nude-300')}>
                <Image src={img.url} alt={img.alt || `${productName} ${i + 1}`}
                  fill className="object-cover" sizes="72px" />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1">
          <div ref={imgRef}
            className={cn('relative aspect-square overflow-hidden bg-nude-50 cursor-zoom-in select-none',
              zoom && 'cursor-crosshair')}
            onClick={() => setLightbox(true)}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}>
            <Image
              src={images[selected]?.url || ''}
              alt={images[selected]?.alt || productName}
              fill priority
              className={cn('object-cover transition-transform duration-300', zoom && 'scale-150')}
              style={zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <button onClick={e => { e.stopPropagation(); setLightbox(true) }}
              className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
              <ZoomIn size={16} />
            </button>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev() }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={e => { e.stopPropagation(); next() }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Mobile dots */}
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
              {images.map((_, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={cn('rounded-full transition-all duration-200',
                    i === selected ? 'w-5 h-1.5 bg-charcoal' : 'w-1.5 h-1.5 bg-nude-300')} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-charcoal/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white hover:text-nude-300 transition-colors z-10">
            <X size={24} />
          </button>
          <div className="relative w-full max-w-3xl aspect-square" onClick={e => e.stopPropagation()}>
            <Image src={images[selected]?.url || ''} alt={productName} fill className="object-contain" sizes="90vw" />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 flex items-center justify-center text-white hover:text-nude-300 transition-colors">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 flex items-center justify-center text-white hover:text-nude-300 transition-colors">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-4 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setSelected(i) }}
                className={cn('rounded-full transition-all', i === selected ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40')} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
