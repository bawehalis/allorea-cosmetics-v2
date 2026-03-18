// src/app/admin/inventory/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { AlertTriangle, RefreshCw, Save, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [edits, setEdits] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [threshold, setThreshold] = useState('10')

  const fetch_ = () => {
    setLoading(true)
    fetch(`/api/inventory?threshold=${threshold}`)
      .then(r => r.json()).then(j => setProducts(j.data?.products || [])).finally(() => setLoading(false))
  }
  useEffect(() => { fetch_() }, [threshold])

  const handleSave = async () => {
    if (Object.keys(edits).length === 0) return
    setSaving(true)
    try {
      await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: Object.entries(edits).map(([productId, stock]) => ({ productId, stock })) }),
      })
      setEdits({})
      fetch_()
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Showing products with stock ≤ {threshold} units
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Alert threshold:</label>
            <select value={threshold} onChange={e => setThreshold(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
              {['5','10','20','50'].map(v => <option key={v} value={v}>{v} units</option>)}
            </select>
          </div>
          <button onClick={fetch_} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RefreshCw size={16} className={loading ? 'animate-spin text-brand-500' : 'text-gray-500'} />
          </button>
          {Object.keys(edits).length > 0 && (
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 disabled:opacity-60">
              <Save size={15} /> {saving ? 'Saving...' : `Save ${Object.keys(edits).length} changes`}
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Out of Stock', count: products.filter(p => p.stock === 0).length, color: 'text-red-600 bg-red-50' },
          { label: 'Low Stock (1–5)', count: products.filter(p => p.stock > 0 && p.stock <= 5).length, color: 'text-amber-600 bg-amber-50' },
          { label: `Under ${threshold} units`, count: products.length, color: 'text-brand-600 bg-brand-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-3', color)}>
              <AlertTriangle size={18} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">SKU</th>
              <th className="text-center px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Current Stock</th>
              <th className="text-center px-4 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th className="text-center px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">Update Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>{[...Array(5)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">All products have sufficient stock</p>
                </td>
              </tr>
            ) : products.map((product: any) => {
              const editedStock = edits[product.id] ?? product.stock
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-400">Alert at: {product.lowStockAt} units</p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-500 hidden md:table-cell">{product.sku}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('text-lg font-bold', product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-gray-900')}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full',
                      product.stock === 0 ? 'bg-red-100 text-red-700' :
                      product.stock <= 5 ? 'bg-amber-100 text-amber-700' :
                      'bg-orange-100 text-orange-700')}>
                      {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Critical' : 'Low Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editedStock}
                        onChange={e => setEdits(prev => ({ ...prev, [product.id]: parseInt(e.target.value) || 0 }))}
                        className={cn('w-20 text-center px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400',
                          edits[product.id] !== undefined ? 'border-brand-400 bg-brand-50' : 'border-gray-200')}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
