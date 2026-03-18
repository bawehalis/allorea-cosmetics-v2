// src/app/admin/customers/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight, Eye, Mail } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Customer {
  id: string; email: string; name?: string; createdAt: string
  orderCount: number; totalSpent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const limit = 20

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set('search', search)
      const res = await fetch(`/api/customers?${params}`)
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
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} registered customers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1) }} className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Customer</th>
              <th className="text-center px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Orders</th>
              <th className="text-right px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Total Spent</th>
              <th className="text-right px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
              <th className="text-right px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>{[...Array(5)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
              ))
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-400">No customers found</td></tr>
            ) : customers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm shrink-0">
                      {(customer.name || customer.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name || 'Guest'}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center hidden md:table-cell">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {customer.orderCount} orders
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-gray-900 hidden md:table-cell">
                  {formatPrice(customer.totalSpent)}
                </td>
                <td className="px-4 py-4 text-right text-sm text-gray-500 hidden lg:table-cell">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`mailto:${customer.email}`}
                      className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                      <Mail size={15} />
                    </a>
                    <Link href={`/admin/customers/${customer.id}`}
                      className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={15} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Showing {((page-1)*limit)+1}–{Math.min(page*limit, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => p-1)} disabled={page===1} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={16}/></button>
              <span className="text-sm text-gray-600 px-2">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page>=totalPages} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
