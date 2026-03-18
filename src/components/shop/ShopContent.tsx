// src/components/shop/ShopContent.tsx
'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'
import ShopFilters from '@/components/shop/ShopFilters'
import Pagination from '@/components/shop/Pagination'
import { ALL_PRODUCTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

const SORT_OPTIONS = [
  { value:'newest',     label:'En Yeni' },
  { value:'bestseller', label:'En Çok Satan' },
  { value:'price-asc',  label:'Fiyat: Düşükten Yükseğe' },
  { value:'price-desc', label:'Fiyat: Yüksekten Düşüğe' },
  { value:'name',       label:'İsim A–Z' },
]

const ITEMS_PER_PAGE = 12

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200'} />
      ))}
    </div>
  )
}

export default function ShopContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const { addItem, openCart } = useCartStore()
  const [layout,            setLayout]            = useState<'grid'|'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const category = searchParams.get('category') ?? ''
  const sort     = searchParams.get('sort')     ?? 'newest'
  const search   = searchParams.get('search')   ?? ''
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? 9999)
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))

  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS]
    if (category) result = result.filter(p => p.categorySlug === category)
    if (search)   result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    if (minPrice > 0)    result = result.filter(p => p.price >= minPrice)
    if (maxPrice < 9999) result = result.filter(p => p.price <= maxPrice)
    if (searchParams.get('featured') === 'true') result = result.filter(p => p.isBestSeller)
    if (searchParams.get('sale')     === 'true') result = result.filter(p => p.comparePrice > p.price)

    switch (sort) {
      case 'bestseller': result.sort((a,b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break
      case 'price-asc':  result.sort((a,b) => a.price - b.price); break
      case 'price-desc': result.sort((a,b) => b.price - a.price); break
      case 'name':       result.sort((a,b) => a.name.localeCompare(b.name, 'tr')); break
      default: break
    }
    return result
  }, [category, sort, search, minPrice, maxPrice, searchParams])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged      = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE)

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`/shop?${params.toString()}`)
    window.scrollTo({ top:0, behavior:'smooth' })
  }

  const pageTitle = category
    ? ALL_PRODUCTS.find(p => p.categorySlug === category)?.categorySlug?.replace(/-/g,' ') ?? 'Ürünler'
    : search ? `Arama: "${search}"` : 'Tüm Ürünler'

  const handleQuickAdd = (e: React.MouseEvent, p: typeof ALL_PRODUCTS[0]) => {
    e.preventDefault()
    e.stopPropagation()
    const baseBundle = p.bundles[0]
    addItem({
      productId: p.id,
      name:      p.name,
      slug:      p.slug,
      price:     baseBundle.price,
      quantity:  1,
      image:     p.images[0]?.url || '',
      stock:     p.stock,
      variant:   baseBundle.label,
    })
    toast.success(`${p.name} sepete eklendi!`, { icon:'🛍️', duration:2500 })
    setTimeout(() => openCart(), 400)
  }

  return (
    <div className="bg-pearl min-h-screen">
      {/* Başlık */}
      <div className="bg-nude-100 py-10 border-b border-nude-200">
        <div className="container-main">
          <nav className="font-body text-xs text-nude-400 mb-2">
            <Link href="/" className="hover:text-charcoal">Ana Sayfa</Link>
            {' / '}<span className="text-charcoal capitalize">Mağaza</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-light text-charcoal capitalize">{pageTitle}</h1>
          <p className="font-body text-sm text-nude-500 mt-1">
            {filtered.length} ürün
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 font-body text-sm border border-nude-200 bg-white px-4 py-2.5 rounded-xl hover:border-charcoal transition-colors">
            <SlidersHorizontal size={15} /> Filtreler
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="font-body text-xs text-nude-500 hidden sm:block">Sırala:</span>
            <select value={sort} onChange={e => updateSort(e.target.value)}
              className="input-field py-2 text-xs pr-8 w-52 bg-white rounded-xl">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="hidden sm:flex items-center border border-nude-200 rounded-xl overflow-hidden">
              <button onClick={() => setLayout('grid')}
                className={cn('p-2.5 transition-colors', layout==='grid' ? 'bg-charcoal text-white' : 'hover:bg-nude-50')}>
                <LayoutGrid size={15}/>
              </button>
              <button onClick={() => setLayout('list')}
                className={cn('p-2.5 transition-colors', layout==='list' ? 'bg-charcoal text-white' : 'hover:bg-nude-50')}>
                <List size={15}/>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop filtreler */}
          <div className="hidden lg:block w-52 shrink-0">
            <ShopFilters />
          </div>

          {/* Ürün grid */}
          <div className="flex-1 min-w-0">
            {paged.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl font-light text-charcoal mb-3">Ürün bulunamadı</p>
                <p className="font-body text-nude-500 mb-6">Filtrelerinizi değiştirmeyi deneyin.</p>
                <Link href="/shop" className="btn-outline rounded-xl">Filtreleri Temizle</Link>
              </div>
            ) : layout === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paged.map(p => {
                  const avg = p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length
                  const disc = p.comparePrice > p.price ? Math.round(((p.comparePrice-p.price)/p.comparePrice)*100) : 0
                  return (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="group bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                      <div className="relative aspect-square overflow-hidden bg-nude-50">
                        <Image src={p.images[0]?.url||''} alt={p.name} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"/>
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
                        {/* Hızlı ekle */}
                        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button onClick={e => handleQuickAdd(e, p)}
                            className="w-full bg-charcoal text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-brand-700 transition-colors">
                            Sepete Ekle
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <StarRow rating={avg}/>
                          <span className="text-[10px] text-nude-400">({p.reviews.length})</span>
                        </div>
                        <p className="font-bold text-sm text-charcoal leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-600 transition-colors">
                          {p.name}
                        </p>
                        <div className="flex items-baseline gap-2">
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
            ) : (
              /* Liste görünümü */
              <div className="space-y-3">
                {paged.map(p => {
                  const avg  = p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length
                  const disc = p.comparePrice > p.price ? Math.round(((p.comparePrice-p.price)/p.comparePrice)*100) : 0
                  return (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="group flex gap-4 bg-white rounded-2xl border border-nude-100 p-4 hover:shadow-md hover:scale-[1.005] transition-all duration-200">
                      <div className="relative w-24 h-24 shrink-0 bg-nude-50 rounded-xl overflow-hidden">
                        <Image src={p.images[0]?.url||''} alt={p.name} fill className="object-cover" sizes="96px"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <StarRow rating={avg}/>
                          <span className="text-[10px] text-nude-400">({p.reviews.length})</span>
                        </div>
                        <p className="font-bold text-sm text-charcoal group-hover:text-brand-600 transition-colors">{p.name}</p>
                        <p className="text-xs text-nude-500 mt-1 line-clamp-2">{p.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-black text-base text-charcoal">{p.price.toLocaleString('tr-TR')}₺</span>
                          {p.comparePrice > p.price && (
                            <>
                              <span className="text-sm text-nude-400 line-through">{p.comparePrice.toLocaleString('tr-TR')}₺</span>
                              <span className="text-[10px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded-full">-%{disc}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <button onClick={e => handleQuickAdd(e, p)}
                          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-black hover:bg-brand-700 transition-colors">
                          <ShoppingBag size={15}/> Ekle
                        </button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </div>

      {/* Mobil filtre çekmece */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-40" onClick={() => setMobileFiltersOpen(false)}/>
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body font-bold text-charcoal">Filtreler</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20}/></button>
            </div>
            <ShopFilters onClose={() => setMobileFiltersOpen(false)}/>
          </div>
        </>
      )}
    </div>
  )
}
