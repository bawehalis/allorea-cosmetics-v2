'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=85',
    badge: 'Yeni Koleksiyon',
    title: 'Cildinizin\nİhtiyaç Duyduğu\nBakım',
    subtitle: 'Allorea\'nın özel formülleriyle hazırlanmış lüks cilt bakım serileri',
    cta: { label: 'Koleksiyonu Keşfet', href: '/shop?category=skincare' },
    align: 'left' as const,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1600&q=85',
    badge: 'En Çok Satanlar',
    title: 'Saç Bakımında\nLüksü\nDeneyimleyin',
    subtitle: 'İpek gibi, sağlıklı saçlar için profesyonel bakım formülleri',
    cta: { label: 'Saç Bakımı', href: '/shop?category=hair-care' },
    align: 'right' as const,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=1600&q=85',
    badge: 'Özel Seçim',
    title: 'Sizi Anlatan\nBir Koku',
    subtitle: 'Nadir çiçek özlerinden ilham alan, benzersiz parfüm kompozisyonları',
    cta: { label: 'Parfümleri Gör', href: '/shop?category=fragrance' },
    align: 'center' as const,
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused]   = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [paused])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  const s = SLIDES[current]

  return (
    <section
      className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-nude-800"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide images */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            i === current ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title.replace('\n', ' ')}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className={cn(
        'absolute inset-0',
        s.align === 'right'
          ? 'bg-gradient-to-l from-charcoal/75 via-charcoal/30 to-transparent'
          : s.align === 'center'
          ? 'bg-charcoal/55'
          : 'bg-gradient-to-r from-charcoal/75 via-charcoal/30 to-transparent'
      )} />

      {/* İçerik */}
      <div className="relative h-full container-main flex items-center">
        <div className={cn(
          'max-w-xl',
          s.align === 'right' && 'ml-auto',
          s.align === 'center' && 'mx-auto text-center'
        )}>
          <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-brand-300 mb-4">
            {s.badge}
          </span>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-none mb-6 whitespace-pre-line">
            {s.title}
          </h1>
          <p className="font-body text-base text-white/75 mb-8 leading-relaxed max-w-sm">
            {s.subtitle}
          </p>
          <div className={cn('flex items-center gap-5', s.align === 'center' && 'justify-center')}>
            <Link href={s.cta.href} className="btn-brand gap-2">
              {s.cta.label} <ArrowRight size={16} />
            </Link>
            <Link href="/shop" className="font-body text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4">
              Tümünü Gör
            </Link>
          </div>
        </div>
      </div>

      {/* Ok tuşları */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/35 transition-colors">
        <ChevronLeft size={22} />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/35 transition-colors">
        <ChevronRight size={22} />
      </button>

      {/* Nokta göstergesi */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'transition-all duration-300',
              i === current ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  )
}
