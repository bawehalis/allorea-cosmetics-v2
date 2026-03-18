import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star } from 'lucide-react'
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

export default function FeaturedProducts() {
  const featured = FEATURED_PRODUCTS.slice(0, 4)
  return (
    <section className="py-12 bg-white">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="section-subtitle">Size Özel Seçim</p>
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
          </div>
          <Link href="/shop?featured=true"
            className="flex items-center gap-2 font-body text-sm text-nude-600 hover:text-brand-600 transition-colors group">
            Tümünü Gör <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {featured.map(p => {
            const disc = p.comparePrice > p.price
              ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
              : 0
            return (
              <Link key={p.id} href={`/product/${p.slug}`}
                className="group bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                <div className="relative aspect-square overflow-hidden bg-nude-50">
                  <Image src={p.image} alt={p.name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 50vw, 25vw" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
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
