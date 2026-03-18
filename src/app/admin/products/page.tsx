// src/app/admin/products/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus, Search, Edit2, Trash2, Eye, AlertTriangle,
  ChevronLeft, ChevronRight, RefreshCw, Package, Star,
  ToggleLeft, ToggleRight,
} from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Product {
  id: string; name: string; slug: string; sku: string
  price: number; comparePrice?: number; stock: number
  isActive: boolean; isFeatured: boolean; isBestSeller: boolean
  category: { name: string }
  images: Array<{ url: string; alt?: string }>
  _count?: { reviews: number }; createdAt: string
}

export default function AdminProductsPage() {
  const [products,    setProducts]    = useState<Product[]>([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort,        setSort]        = useState('newest')
  const [deleting,    setDeleting]    = useState<string|null>(null)
  const limit = 15

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page:String(page), limit:String(limit), sort })
      if (search) params.set('search', search)
      const res  = await fetch(`/api/products?${params}&admin=true`)
      const json = await res.json()
      setProducts(json.data || [])
      setTotal(json.pagination?.total || 0)
    } catch {} finally { setLoading(false) }
  }, [page, search, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü silmek istediğinizden emin misiniz?`)) return
    setDeleting(id)
    try {
      await fetch(`/api/products/${id}`, { method:'DELETE' })
      fetchProducts()
    } finally { setDeleting(null) }
  }

  const totalPages = Math.ceil(total / limit)

  const discountPct = (price: number, compare?: number) =>
    compare && compare > price ? Math.round(((compare-price)/compare)*100) : 0

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} ürün</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchProducts}
            className="p-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : 'text-gray-500'} />
          </button>
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
            <Plus size={16} /> Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }}
            className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Ürün adı veya SKU ara..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </form>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="price-asc">Fiyat: Düşük → Yüksek</option>
            <option value="price-desc">Fiyat: Yüksek → Düşük</option>
            <option value="bestseller">En Çok Satan</option>
            <option value="name">İsim A-Z</option>
          </select>
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ürün</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Kategori</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Fiyat</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Stok</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Durum</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Yorum</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_,i) => (
                  <tr key={i}>{[...Array(7)].map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>
                  ))}</tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30"/>
                  <p>Ürün bulunamadı</p>
                </td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  {/* Ürün */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-nude-50 rounded-xl overflow-hidden shrink-0">
                        {p.images?.[0]?.url
                          ? <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="48px"/>
                          : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package size={18}/></div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate max-w-[200px] group-hover:text-brand-600 transition-colors">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-mono">{p.sku}</span>
                          {p.isBestSeller && (
                            <span className="text-[9px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded-full">
                              ⭐ ÇOK SATAN
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{p.category?.name}</span>
                  </td>

                  {/* Fiyat */}
                  <td className="px-4 py-3.5 text-right">
                    <div>
                      <span className="font-black text-gray-900">{p.price.toLocaleString('tr-TR')}₺</span>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString('tr-TR')}₺</span>
                          <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1 rounded">%{discountPct(p.price, p.comparePrice)}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Stok */}
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full',
                      p.stock === 0    ? 'bg-red-100 text-red-700' :
                      p.stock <= 10    ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {p.stock === 0 ? 'Tükendi' : `${p.stock} adet`}
                    </span>
                  </td>

                  {/* Durum */}
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                      p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    )}>
                      {p.isActive ? <ToggleRight size={12}/> : <ToggleLeft size={12}/>}
                      {p.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>

                  {/* Yorum */}
                  <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                    <span className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Star size={12} className="text-amber-400 fill-amber-400"/>
                      {p._count?.reviews || 0}
                    </span>
                  </td>

                  {/* İşlemler */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/product/${p.slug}`} target="_blank"
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-brand-600" title="Ürünü görüntüle">
                        <Eye size={15}/>
                      </Link>
                      <Link href={`/admin/products/${p.id}`}
                        className="p-2 rounded-xl hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600" title="Düzenle">
                        <Edit2 size={15}/>
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-40" title="Sil">
                        {deleting === p.id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"/>
                          : <Trash2 size={15}/>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              {((page-1)*limit)+1}–{Math.min(page*limit,total)} / {total} ürün
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p=>p-1)} disabled={page===1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronLeft size={15}/>
              </button>
              <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p=>p+1)} disabled={page>=totalPages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
