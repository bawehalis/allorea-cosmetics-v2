import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/mock-data'

export default function CategoryGrid() {
  return (
    <section className="page-section bg-pearl">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="section-subtitle">Keşfet</p>
          <h2 className="section-title">Kategoriye Göre Alışveriş</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden bg-nude-100 aspect-square mb-3">
                <Image
                  src={cat.image || ''}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 17vw"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-300 flex items-center justify-center">
                  <span className="font-body text-xs tracking-[0.2em] uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-charcoal/60 px-3 py-1.5">
                    Şimdi Al
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-center text-charcoal group-hover:text-brand-600 transition-colors font-medium tracking-wide">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
