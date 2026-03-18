// src/app/admin/customers/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Eye, Users, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Customer {
  id: string; email: string; name?: string; createdAt: string
  orderCount?: number; totalSpent?: number
}

export default function AdminCustomersPage() {
  const [customers,   setCustomers]   = useState<Customer[]>([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search,      setSearch]      = useState('')
  const limit = 20

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page:String(page), limit:String(limit) })
      if (search) params.set('search', search)
      const res  = await fetch(`/api/customers?${params}`)
      const json = await res.json()
      setCustomers(json.data || [])
      setTotal(json.pagination?.total || 0)
    } catch {} finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} kayıtlı müşteri</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }}
          className="relative max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="İsim veya e-posta ara..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Müşteri</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">E-posta</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden sm:table-cell">Sipariş</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Harcama</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Kayıt</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_,i) => (
                  <tr key={i}>{[...Array(6)].map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>
                  ))}</tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                  <Users size={32} className="mx-auto mb-2 opacity-30"/>
                  <p>Müşteri bulunamadı</p>
                </td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-black text-sm shrink-0">
                        {(c.name || c.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                          {c.name || 'İsimsiz Müşteri'}
                        </p>
                        <p className="text-xs text-gray-400 md:hidden">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{c.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                    <span className="text-sm font-semibold text-gray-700">{c.orderCount || 0}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                    <span className="text-sm font-black text-gray-900">
                      {c.totalSpent ? `${c.totalSpent.toLocaleString('tr-TR')}₺` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 group-hover:border-brand-300 group-hover:text-brand-600">
                      <Eye size={12}/> Detay
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">{((page-1)*limit)+1}–{Math.min(page*limit,total)} / {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p=>p-1)} disabled={page===1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft size={15}/>
              </button>
              <span className="text-sm text-gray-600 px-2">{page} / {totalPages}</span>
              <button onClick={() => setPage(p=>p+1)} disabled={page>=totalPages}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
