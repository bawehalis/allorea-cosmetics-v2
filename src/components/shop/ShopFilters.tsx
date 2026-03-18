'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const PRICE_RANGES = [
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 – $60', min: 30, max: 60 },
  { label: '$60 – $100', min: 60, max: 100 },
  { label: 'Over $100', min: 100, max: 9999 },
]

const CONCERNS = ['Yaşlanma Karşıtı', 'Aydınlatıcı', 'Nemlendirici', 'Hassas Cilt', 'Akne', 'Leke Karşıtı']

interface FilterState {
  category: string
  priceMin: number
  priceMax: number
  concerns: string[]
}

interface ShopFiltrelerProps {
  onClose?: () => void
}

export default function ShopFiltreler({ onClose }: ShopFiltrelerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [openSections, setOpenSections] = useState<string[]>(['category', 'price', 'concern'])

  const toggle = (section: string) => setOpenSections(prev =>
    prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
  )

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
    onClose?.()
  }

  const clearAll = () => {
    router.push('/shop')
    onClose?.()
  }

  const activeCategory = searchParams.get('category') || ''
  const hasFiltreler = searchParams.toString().length > 0

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <h3 className="font-body text-sm font-semibold tracking-wider uppercase">Filtreler</h3>
        </div>
        {hasFiltreler && (
          <button onClick={clearAll} className="font-body text-xs text-nude-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
            <X size={12} /> Temizle
          </button>
        )}
      </div>

      {/* Category */}
      <div className="border-t border-nude-100">
        <button
          onClick={() => toggle('category')}
          className="flex items-center justify-between w-full py-4 font-body text-sm font-medium text-charcoal"
        >
          Category
          <ChevronDown size={15} className={cn('transition-transform', openSections.includes('category') && 'rotate-180')} />
        </button>
        {openSections.includes('category') && (
          <div className="pb-4 space-y-2">
            <button
              onClick={() => updateFilter('category', '')}
              className={cn('block w-full text-left font-body text-sm py-1.5 px-2 transition-colors rounded',
                !activeCategory ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}
            >
              Tüm Ürünler
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.slug)}
                className={cn('block w-full text-left font-body text-sm py-1.5 px-2 transition-colors rounded',
                  activeCategory === cat.slug ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border-t border-nude-100">
        <button
          onClick={() => toggle('price')}
          className="flex items-center justify-between w-full py-4 font-body text-sm font-medium text-charcoal"
        >
          Fiyat Aralığı
          <ChevronDown size={15} className={cn('transition-transform', openSections.includes('price') && 'rotate-180')} />
        </button>
        {openSections.includes('price') && (
          <div className="pb-4 space-y-2">
            {PRICE_RANGES.map(range => {
              const isActive = searchParams.get('minPrice') === String(range.min)
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (isActive) { params.delete('minPrice'); params.delete('maxPrice') }
                    else { params.set('minPrice', String(range.min)); params.set('maxPrice', String(range.max)) }
                    router.push(`/shop?${params.toString()}`)
                  }}
                  className={cn('block w-full text-left font-body text-sm py-1.5 px-2 transition-colors rounded',
                    isActive ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Cilt Sorunu */}
      <div className="border-t border-nude-100">
        <button
          onClick={() => toggle('concern')}
          className="flex items-center justify-between w-full py-4 font-body text-sm font-medium text-charcoal"
        >
          Cilt Sorunu
          <ChevronDown size={15} className={cn('transition-transform', openSections.includes('concern') && 'rotate-180')} />
        </button>
        {openSections.includes('concern') && (
          <div className="pb-4 space-y-2">
            {CONCERNS.map(concern => {
              const slug = concern.toLowerCase().replace(/\s+/g, '-')
              const isActive = searchParams.get('concern') === slug
              return (
                <button
                  key={concern}
                  onClick={() => updateFilter('concern', isActive ? '' : slug)}
                  className={cn('block w-full text-left font-body text-sm py-1.5 px-2 transition-colors rounded',
                    isActive ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}
                >
                  {concern}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Puan */}
      <div className="border-t border-b border-nude-100">
        <button
          onClick={() => toggle('rating')}
          className="flex items-center justify-between w-full py-4 font-body text-sm font-medium text-charcoal"
        >
          Puan
          <ChevronDown size={15} className={cn('transition-transform', openSections.includes('rating') && 'rotate-180')} />
        </button>
        {openSections.includes('rating') && (
          <div className="pb-4 space-y-2">
            {[4, 3, 2].map(r => (
              <button key={r} onClick={() => updateFilter('rating', String(r))}
                className={cn('flex items-center gap-2 w-full text-left font-body text-sm py-1.5 px-2 transition-colors rounded',
                  searchParams.get('rating') === String(r) ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
                {'★'.repeat(r)}{'☆'.repeat(5-r)} & up
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
