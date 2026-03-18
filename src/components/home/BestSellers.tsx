'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { FEATURED_PRODUCTS } from '@/lib/mock-data'

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={11}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200'} />
      ))}
    </div>
  )
}

export default function BestSellers() {
  const scrollRef  = useRef<HTMLDivElement>(null)
  const bestSellers = FEATURED_PRODUCTS

  const scroll = (dir: 'left'|'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior:'smooth' })
  }

  return (
    <section className="py-12 bg-nude-50">
      <div className="container-main">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-subtitle">Topluluk Favorileri</p>
            <h2 className="section-title">En Çok Satanlar</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')}
              className="w-10 h-10 border border-nude-300 rounded-xl flex items-center justify-center hover:bg-charcoal hover:border-charcoal hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')}
              className="w-10 h-10 border border-nude-300 rounded-xl flex items-center justify-center hover:bg-charcoal hover:border-charcoal hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {bestSellers.map(p => {
            const disc = p.comparePrice > p.price
              ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
              : 0
            return (
              <Link key={p.id} href={`/product/${p.slug}`}
                className="group shrink-0 w-[220px] sm:w-[240px] bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="relative aspect-square overflow-hidden bg-nude-50">
                  <Image src={p.image} alt={p.name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="240px" />
                  {disc > 0 && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      -%{disc}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <StarRow rating={p.rating} />
                    <span className="text-[10px] text-nude-400">({p.reviewCount})</span>
                  </div>
                  <p className="font-bold text-sm text-charcoal leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-black text-base text-charcoal">{p.price.toLocaleString('tr-TR')}₺</span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-nude-400 line-through">{p.comparePrice.toLocaleString('tr-TR')}₺</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
