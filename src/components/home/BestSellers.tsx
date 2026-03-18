'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { PRODUCTS } from '@/lib/mock-data'
import Link from 'next/link'

export default function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller)

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="page-section bg-nude-50">
      <div className="container-main">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-subtitle">Topluluk Favorileri</p>
            <h2 className="section-title">En Çok Satanlar</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="w-10 h-10 border border-nude-300 flex items-center justify-center hover:bg-charcoal hover:border-charcoal hover:text-white transition-all" aria-label="Scroll left">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 border border-nude-300 flex items-center justify-center hover:bg-charcoal hover:border-charcoal hover:text-white transition-all" aria-label="Scroll right">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {bestSellers.map(p => (
            <div key={p.id} className="shrink-0 w-[240px] sm:w-[260px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop?sort=bestseller" className="btn-outline">View All En Çok Satanlar</Link>
        </div>
      </div>
    </section>
  )
}
