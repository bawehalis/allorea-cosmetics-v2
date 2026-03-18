// src/app/admin/coupons/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{type:'success'|'error';msg:string}|null>(null)
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minPurchase: '', maxUses: '', expiresAt: '', isActive: true })

  const fetchCoupons = () => {
    setLoading(true)
    fetch('/api/coupons').then(r => r.json()).then(j => setCoupons(j.data || [])).finally(() => setLoading(false))
  }
  useEffect(() => { fetchCoupons() }, [])

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minPurchase: form.minPurchase ? Number(form.minPurchase) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        }),
      })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error) }
      showToast('success', 'Coupon created!')
      setShowForm(false)
      setForm({ code:'', type:'PERCENTAGE', value:'', minPurchase:'', maxUses:'', expiresAt:'', isActive:true })
      fetchCoupons()
    } catch (e: any) { showToast('error', e.message) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this coupon?')) return
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
    fetchCoupons()
  }

  return (
    <div className="space-y-5">
      {toast && (
        <div className={cn('fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium',
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800')}>
          {toast.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>} {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">New Coupon</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value.toUpperCase()}))}
                placeholder="SAVE20" required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Type *</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Value *</label>
              <input type="number" value={form.value} onChange={e => setForm(p => ({...p, value: e.target.value}))}
                placeholder={form.type === 'PERCENTAGE' ? '10' : '5.00'} required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Min Purchase ($)</label>
              <input type="number" value={form.minPurchase} onChange={e => setForm(p => ({...p, minPurchase: e.target.value}))}
                placeholder="50.00"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Max Uses</label>
              <input type="number" value={form.maxUses} onChange={e => setForm(p => ({...p, maxUses: e.target.value}))}
                placeholder="100"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Expires At</label>
              <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(p => ({...p, expiresAt: e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div className="col-span-2 md:col-span-3 flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
                Create Coupon
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Code','Type','Value','Min Purchase','Uses','Expires','Status',''].map(h => (
                <th key={h} className="text-left px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>)}</tr>)
            ) : coupons.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No coupons yet</td></tr>
            ) : coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-mono font-bold text-gray-900">{coupon.code}</td>
                <td className="px-4 py-4 text-gray-600">{coupon.type}</td>
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}
                </td>
                <td className="px-4 py-4 text-gray-600">{coupon.minPurchase ? `$${coupon.minPurchase}` : '—'}</td>
                <td className="px-4 py-4 text-gray-600">{coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</td>
                <td className="px-4 py-4 text-gray-600">{coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}</td>
                <td className="px-4 py-4">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full',
                    coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => handleDelete(coupon.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
