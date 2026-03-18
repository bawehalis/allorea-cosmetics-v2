'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { slug:'skincare',  name:'Cilt Bakımı' },
  { slug:'makeup',    name:'Makyaj' },
  { slug:'body-care', name:'Vücut Bakımı' },
  { slug:'fragrance', name:'Parfüm' },
  { slug:'hair-care', name:'Saç Bakımı' },
  { slug:'serums',    name:'Serumlar' },
]

const PRICE_RANGES = [
  { label:'200₺ altı',     min:0,   max:200  },
  { label:'200₺ – 400₺',  min:200, max:400  },
  { label:'400₺ – 600₺',  min:400, max:600  },
  { label:'600₺ üzeri',   min:600, max:9999 },
]

const CONCERNS = [
  'Yaşlanma Karşıtı','Aydınlatıcı','Nemlendirici',
  'Hassas Cilt','Akne','Leke Karşıtı',
]

interface Props { onClose?: () => void }

export default function ShopFilters({ onClose }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState<string[]>(['category','price'])

  const toggle = (s: string) => setOpen(p =>
    p.includes(s) ? p.filter(x => x !== s) : [...p, s]
  )

  const updateFilter = (k: string, v: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (v) params.set(k, v); else params.delete(k)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
    onClose?.()
  }

  const clearAll = () => { router.push('/shop'); onClose?.() }

  const activeCat = searchParams.get('category') || ''
  const hasFilters = searchParams.toString().length > 0

  const Section = ({ id, title, children }: { id:string; title:string; children: React.ReactNode }) => (
    <div className="border-t border-nude-100">
      <button onClick={() => toggle(id)}
        className="flex items-center justify-between w-full py-3.5 font-body text-sm font-semibold text-charcoal">
        {title}
        <ChevronDown size={14} className={cn('text-nude-400 transition-transform', open.includes(id) && 'rotate-180')}/>
      </button>
      {open.includes(id) && <div className="pb-4">{children}</div>}
    </div>
  )

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15}/>
          <h3 className="font-body text-sm font-bold uppercase tracking-wider">Filtreler</h3>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="font-body text-xs text-nude-500 hover:text-brand-600 flex items-center gap-1 transition-colors">
            <X size={11}/> Temizle
          </button>
        )}
      </div>

      {/* Kategori */}
      <Section id="category" title="Kategori">
        <div className="space-y-1.5">
          <button onClick={() => updateFilter('category','')}
            className={cn('block w-full text-left font-body text-sm py-1.5 px-2 rounded-lg transition-colors',
              !activeCat ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
            Tüm Ürünler
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.slug} onClick={() => updateFilter('category', cat.slug)}
              className={cn('block w-full text-left font-body text-sm py-1.5 px-2 rounded-lg transition-colors',
                activeCat === cat.slug ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
              {cat.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Fiyat */}
      <Section id="price" title="Fiyat Aralığı">
        <div className="space-y-1.5">
          {PRICE_RANGES.map(r => {
            const isActive = searchParams.get('minPrice') === String(r.min)
            return (
              <button key={r.label} onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                if (isActive) { params.delete('minPrice'); params.delete('maxPrice') }
                else { params.set('minPrice', String(r.min)); params.set('maxPrice', String(r.max)) }
                router.push(`/shop?${params.toString()}`)
              }}
                className={cn('block w-full text-left font-body text-sm py-1.5 px-2 rounded-lg transition-colors',
                  isActive ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
                {r.label}
              </button>
            )
          })}
        </div>
      </Section>

      {/* Cilt sorunu */}
      <Section id="concern" title="Cilt Sorunu">
        <div className="space-y-1.5">
          {CONCERNS.map(c => {
            const slug     = c.toLowerCase().replace(/\s+/g,'-')
            const isActive = searchParams.get('concern') === slug
            return (
              <button key={c} onClick={() => updateFilter('concern', isActive ? '' : slug)}
                className={cn('block w-full text-left font-body text-sm py-1.5 px-2 rounded-lg transition-colors',
                  isActive ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
                {c}
              </button>
            )
          })}
        </div>
      </Section>

      {/* Puan */}
      <Section id="rating" title="Minimum Puan">
        <div className="space-y-1.5 border-b border-nude-100 pb-2">
          {[5,4,3].map(r => (
            <button key={r} onClick={() => updateFilter('rating', String(r))}
              className={cn('flex items-center gap-2 w-full text-left font-body text-sm py-1.5 px-2 rounded-lg transition-colors',
                searchParams.get('rating') === String(r) ? 'bg-charcoal text-white' : 'text-nude-700 hover:text-brand-600')}>
              {'★'.repeat(r)}{'☆'.repeat(5-r)} & üstü
            </button>
          ))}
        </div>
      </Section>
    </aside>
  )
}
