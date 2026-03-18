// src/hooks/useProducts.ts
'use client'
import { useState, useEffect, useRef } from 'react'
import type { Product, ShopFilters } from '@/types'

interface ProductsResult {
  products:   Product[]
  total:      number
  loading:    boolean
  page:       number
  totalPages: number
  setPage:    (p: number) => void
}

export function useProducts(filters: ShopFilters = {}): ProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(filters.page ?? 1)

  // Stable refs for filter values to avoid stale closure / infinite-loop issues
  const limit    = filters.limit    ?? 16
  const category = filters.category ?? ''
  const sort     = filters.sort     ?? ''
  const search   = filters.search   ?? ''
  const minPrice = filters.minPrice ?? 0
  const maxPrice = filters.maxPrice ?? 0

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams()
    params.set('page',  String(page))
    params.set('limit', String(limit))
    if (category) params.set('category', category)
    if (sort)     params.set('sort',     sort)
    if (search)   params.set('search',   search)
    if (minPrice) params.set('minPrice', String(minPrice))
    if (maxPrice) params.set('maxPrice', String(maxPrice))

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return
        setProducts(json.data      ?? [])
        setTotal(json.pagination?.total ?? 0)
      })
      .catch(err => {
        if (!cancelled) console.error('[useProducts]', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, limit, category, sort, search, minPrice, maxPrice])

  return {
    products,
    total,
    loading,
    page,
    totalPages: Math.ceil(total / limit),
    setPage,
  }
}
