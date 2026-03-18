// src/components/shop/ShopContent.tsx
// FIX: Moved from app/shop/page.tsx so useSearchParams is inside a Suspense boundary.
'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import Pagination from '@/components/shop/Pagination'
import { PRODUCTS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'bestseller', label: 'En Çok Satan' },
  { value: 'price-asc',  label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'name',       label: 'İsim A–Z' },
]

const ITEMS_PER_PAGE = 12

export default function ShopContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [layout, setLayout]           = useState<'grid' | 'list'>('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const category = searchParams.get('category') ?? ''
  const sort     = searchParams.get('sort')     ?? 'newest'
  const search   = searchParams.get('search')   ?? ''
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? 9999)
  const page     = Math.max(1, Number(searchParams.get('page') ?? 1))

  const filtered = useMemo(() => {
    let result = [...PRODUCTS]
    if (category) result = result.filter(p => p.category.slug === category)
    if (search)   result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    if (minPrice > 0)    result = result.filter(p => p.price >= minPrice)
    if (maxPrice < 9999) result = result.filter(p => p.price <= maxPrice)
    if (searchParams.get('featured') === 'true') result = result.filter(p => p.isFeatured)
    if (searchParams.get('sale')     === 'true') result = result.filter(p => p.comparePrice && p.comparePrice > p.price)

    switch (sort) {
      case 'bestseller': result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    return result
  }, [category, sort, search, minPrice, maxPrice, searchParams])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged      = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pageTitle = category
    ? PRODUCTS.find(p => p.category.slug === category)?.category.name ?? 'Shop'
    : search ? `Arama: "${search}"` : 'All Products'

  return (
    <div className="bg-pearl min-h-screen">
      {/* Page Header */}
      <div className="bg-nude-100 py-12 border-b border-nude-200">
        <div className="container-main">
          <nav className="font-body text-xs text-nude-400 mb-3">
            <a href="/" className="hover:text-charcoal">Home</a>
            {' / '}
            <span className="text-charcoal">Shop</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-light text-charcoal">{pageTitle}</h1>
          <p className="font-body text-sm text-nude-500 mt-2">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container-main py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <button onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 font-body text-sm border border-nude-200 px-4 py-2.5 hover:border-charcoal transition-colors">
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <span className="font-body text-xs text-nude-500 hidden sm:block">Sırala:</span>
            <select value={sort} onChange={e => updateSort(e.target.value)}
              className="input-field py-2 text-xs pr-8 w-48 bg-white">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="hidden sm:flex items-center border border-nude-200">
              <button onClick={() => setLayout('grid')}
                className={cn('p-2.5 transition-colors', layout === 'grid' ? 'bg-charcoal text-white' : 'hover:bg-nude-50')}>
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setLayout('list')}
                className={cn('p-2.5 transition-colors', layout === 'list' ? 'bg-charcoal text-white' : 'hover:bg-nude-50')}>
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-56 shrink-0">
            <ShopFilters />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {paged.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-3xl font-light text-charcoal mb-3">Ürün bulunamadı</p>
                <p className="font-body text-nude-500 mb-6">Filtrelerinizi ya da arama teriminizi değiştirmeyi deneyin.</p>
                <a href="/shop" className="btn-outline">Filtreleri Temizle</a>
              </div>
            ) : layout === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {paged.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {paged.map(p => <ProductCard key={p.id} product={p} layout="list" />)}
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 bg-charcoal/40 z-40"
            onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body font-semibold text-charcoal">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
            </div>
            <ShopFilters onClose={() => setMobileFiltersOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
