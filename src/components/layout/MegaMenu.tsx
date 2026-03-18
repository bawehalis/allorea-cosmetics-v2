// src/components/layout/MegaMenu.tsx
import Link from 'next/link'
import Image from 'next/image'

interface MegaMenuProps {
  isOpen: boolean
}

const CATEGORIES = [
  { name: 'Skincare', slug: 'skincare', sub: ['Moisturisers', 'Serums', 'Eye Creams', 'Toners', 'Cleansers', 'Masks'] },
  { name: 'Makeup', slug: 'makeup', sub: ['Foundation', 'Lip Colour', 'Eye Makeup', 'Blush & Bronzer', 'Setting Powder'] },
  { name: 'Body Care', slug: 'body-care', sub: ['Body Oils', 'Body Lotions', 'Scrubs', 'Bath Soaks', 'Hand Care'] },
  { name: 'Fragrance', slug: 'fragrance', sub: ['Eau de Parfum', 'Eau de Toilette', 'Body Sprays', 'Candles'] },
]

export default function MegaMenu({ isOpen }: MegaMenuProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t-2 border-brand-500 z-40">
      <div className="container-main py-10">
        <div className="grid grid-cols-5 gap-8">
          {/* Category links */}
          <div className="col-span-3 grid grid-cols-4 gap-6">
            {CATEGORIES.map(cat => (
              <div key={cat.slug}>
                <Link href={`/shop?category=${cat.slug}`}
                  className="font-body text-xs font-semibold tracking-[0.15em] uppercase text-charcoal hover:text-brand-600 transition-colors block mb-3">
                  {cat.name}
                </Link>
                <ul className="space-y-2">
                  {cat.sub.map(sub => (
                    <li key={sub}>
                      <Link href={`/shop?category=${cat.slug}&sub=${sub.toLowerCase().replace(' ', '-')}`}
                        className="font-body text-sm text-nude-600 hover:text-brand-600 transition-colors">
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured promo */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-nude-100 mb-3">
                <Image src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" alt="New Arrivals"
                  fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-body text-xs text-white bg-brand-600 px-2 py-0.5">New Arrivals</span>
                </div>
              </div>
              <Link href="/shop?sort=newest" className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors">
                Shop New →
              </Link>
            </div>
            <div className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-nude-100 mb-3">
                <Image src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80" alt="Best Sellers"
                  fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-body text-xs text-white bg-charcoal px-2 py-0.5">Best Sellers</span>
                </div>
              </div>
              <Link href="/shop?sort=bestseller" className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors">
                Shop Bestsellers →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
