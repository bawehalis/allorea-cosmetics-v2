// src/app/admin/products/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Filter, Edit2, Trash2, Eye, AlertTriangle, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'

interface Product {
  id: string; name: string; slug: string; sku: string; price: number
  comparePrice?: number; stock: number; isActive: boolean; isFeatured: boolean
  category: { name: string }; images: Array<{ url: string; alt?: string }>
  _count?: { reviews: number }; createdAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('newest')
  const [category, setCategory] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const limit = 15

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page), limit: String(limit),
        sort, ...(search && { search }), ...(category && { category }),
      })
      // Admin sees all products including inactive
      const res = await fetch(`/api/products?${params}&admin=true`)
      const json = await res.json()
      setProducts(json.data || [])
      setTotal(json.pagination?.total || 0)
    } catch { } finally { setLoading(false) }
  }, [page, search, sort, category])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } finally { setDeleting(null) }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total products</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </form>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
            <option value="newest">Newest First</option>
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
            <option value="">All Categories</option>
            <option value="skincare">Skincare</option>
            <option value="makeup">Makeup</option>
            <option value="body-care">Body Care</option>
            <option value="fragrance">Fragrance</option>
            <option value="hair-care">Hair Care</option>
            <option value="serums">Serums</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">SKU</th>
                <th className="text-right px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Price</th>
                <th className="text-center px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No products found</p>
                    <Link href="/admin/products/new" className="text-brand-600 text-sm mt-1 inline-block">Add your first product</Link>
                  </td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                        {product.images[0] ? (
                          <Image src={product.images[0].url} alt={product.name} width={48} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                        {product.isFeatured && (
                          <span className="inline-block text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full mt-0.5">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{product.category?.name}</td>
                  <td className="px-4 py-4 text-gray-500 font-mono text-xs hidden lg:table-cell">{product.sku}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                    {product.comparePrice && (
                      <span className="block text-xs text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn(
                      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
                      product.stock === 0 ? 'bg-red-100 text-red-700'
                        : product.stock <= 5 ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                    )}>
                      {product.stock <= 5 && product.stock > 0 && <AlertTriangle size={11} />}
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full',
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/product/${product.slug}`} target="_blank"
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="View on store">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/admin/products/${product.id}`}
                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const p = i + 1
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                      page === p ? 'bg-brand-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700')}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Need this import at top
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
}
