import ProductCard from '@/components/shop/ProductCard'
import { PRODUCTS } from '@/lib/mock-data'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter(p => p.isFeatured).slice(0, 4)
  return (
    <section className="page-section bg-white">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="section-subtitle">Size Özel Seçim</p>
            <h2 className="section-title">Öne Çıkan Ürünler</h2>
          </div>
          <Link href="/shop?featured=true" className="flex items-center gap-2 font-body text-sm text-nude-600 hover:text-brand-600 transition-colors group">
            Tümünü Gör <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
