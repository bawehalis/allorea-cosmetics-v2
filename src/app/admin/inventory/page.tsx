// src/app/admin/inventory/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, RefreshCw, Save, CheckCircle, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InventoryItem {
  id: string; name: string; sku: string; stock: number
  lowStockAt: number; category: { name: string }
}

export default function AdminInventoryPage() {
  const [items,     setItems]     = useState<InventoryItem[]>([])
  const [loading,   setLoading]   = useState(true)
  const [threshold, setThreshold] = useState(10)
  const [updates,   setUpdates]   = useState<Record<string,number>>({})
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/inventory?threshold=${threshold}`)
      const json = await res.json()
      setItems(json.data?.products || [])
    } catch {} finally { setLoading(false) }
  }, [threshold])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleSave = async () => {
    const payload = Object.entries(updates).map(([productId, stock]) => ({ productId, stock }))
    if (!payload.length) return
    setSaving(true)
    try {
      await fetch('/api/inventory', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ updates: payload }),
      })
      setSaved(true)
      setUpdates({})
      fetchItems()
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stok Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Düşük stoklu ürünleri izle ve güncelle</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems}
            className="p-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50">
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : 'text-gray-500'}/>
          </button>
          {Object.keys(updates).length > 0 && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 disabled:opacity-60 transition-colors">
              {saved ? <><CheckCircle size={15}/> Kaydedildi</> : saving ? 'Kaydediliyor...' : <><Save size={15}/> Kaydet ({Object.keys(updates).length})</>}
            </button>
          )}
        </div>
      </div>

      {/* Eşik ayarı */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
        <AlertTriangle size={16} className="text-amber-500 shrink-0"/>
        <span className="text-sm font-semibold text-gray-700">Uyarı eşiği:</span>
        <select value={threshold} onChange={e => setThreshold(+e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
          {[5,10,15,20,50].map(n => <option key={n} value={n}>{n} adet ve altı</option>)}
        </select>
        <span className="text-xs text-gray-400">— Bu eşiğin altındaki ürünler listede gösterilir</span>
      </div>

      {/* Stok tablosu */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ürün</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Kategori</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Mevcut Stok</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Stok Bar</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Güncelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_,i) => (
                  <tr key={i}>{[...Array(5)].map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>
                  ))}</tr>
                ))
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                  <CheckCircle size={32} className="mx-auto mb-2 text-green-500"/>
                  <p className="font-semibold text-green-600">Tüm ürünler yeterli stokta ✓</p>
                </td></tr>
              ) : items.map(item => {
                const currentStock = updates[item.id] ?? item.stock
                const stockPct     = Math.min(100, (currentStock / (item.lowStockAt * 2)) * 100)
                const isEdited     = updates[item.id] !== undefined
                return (
                  <tr key={item.id} className={cn('hover:bg-gray-50 transition-colors', isEdited && 'bg-blue-50/50')}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{item.sku}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{item.category?.name}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn(
                        'text-sm font-black px-3 py-1.5 rounded-xl',
                        currentStock === 0    ? 'bg-red-100 text-red-700' :
                        currentStock <= 5     ? 'bg-red-100 text-red-600' :
                        currentStock <= 10    ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      )}>
                        {currentStock === 0 ? 'Tükendi' : `${currentStock} adet`}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all',
                            stockPct < 25 ? 'bg-red-500' : stockPct < 50 ? 'bg-amber-500' : 'bg-green-500')}
                            style={{ width:`${stockPct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">{Math.round(stockPct)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        min={0}
                        value={updates[item.id] ?? item.stock}
                        onChange={e => setUpdates(p => ({ ...p, [item.id]: Math.max(0, +e.target.value) }))}
                        className={cn(
                          'w-24 text-center px-2 py-2 border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-400',
                          isEdited ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200'
                        )}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
