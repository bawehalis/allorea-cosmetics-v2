// src/app/admin/coupons/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check, Tag, RefreshCw } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Coupon {
  id: string; code: string; type: 'PERCENTAGE'|'FIXED'; value: number
  minPurchase?: number; maxUses?: number; usedCount: number
  expiresAt?: string; isActive: boolean; createdAt: string
  _count?: { orders: number }
}

export default function AdminCouponsPage() {
  const [coupons,  setCoupons]  = useState<Coupon[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showAdd,  setShowAdd]  = useState(false)
  const [copied,   setCopied]   = useState<string|null>(null)
  const [form, setForm] = useState({
    code:'', type:'PERCENTAGE' as 'PERCENTAGE'|'FIXED', value:10,
    minPurchase:'', maxUses:'', expiresAt:'',
  })

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/coupons')
      const json = await res.json()
      setCoupons(json.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleAdd = async () => {
    if (!form.code || !form.value) return
    const payload = {
      code:        form.code.toUpperCase(),
      type:        form.type,
      value:       +form.value,
      minPurchase: form.minPurchase ? +form.minPurchase : undefined,
      maxUses:     form.maxUses     ? +form.maxUses     : undefined,
      expiresAt:   form.expiresAt   || undefined,
    }
    const res = await fetch('/api/coupons', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) { setShowAdd(false); fetchCoupons(); setForm({ code:'', type:'PERCENTAGE', value:10, minPurchase:'', maxUses:'', expiresAt:'' }) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/coupons/${id}`, { method:'DELETE' })
    fetchCoupons()
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const code  = Array.from({ length:8 }, () => chars[Math.floor(Math.random()*chars.length)]).join('')
    setForm(p => ({ ...p, code }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kuponlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.length} kupon</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCoupons}
            className="p-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50">
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : 'text-gray-500'} />
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
            <Plus size={16}/> Kupon Ekle
          </button>
        </div>
      </div>

      {/* Yeni kupon formu */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Yeni Kupon Oluştur</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Kupon Kodu</label>
              <div className="flex gap-2">
                <input value={form.code} onChange={e => setForm(p=>({...p,code:e.target.value.toUpperCase()}))}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-400"
                  placeholder="ALLOREA20" />
                <button onClick={generateCode} type="button"
                  className="px-3 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Oluştur
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Tür</label>
              <div className="flex gap-2">
                {[{ val:'PERCENTAGE', label:'% İndirim' }, { val:'FIXED', label:'₺ İndirim' }].map(t => (
                  <button key={t.val} onClick={() => setForm(p=>({...p,type:t.val as any}))}
                    className={cn('flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all',
                      form.type === t.val ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600')}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                İndirim Değeri {form.type === 'PERCENTAGE' ? '(%)' : '(₺)'}
              </label>
              <input type="number" min={1} value={form.value} onChange={e => setForm(p=>({...p,value:+e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder={form.type === 'PERCENTAGE' ? '20' : '50'} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Min. Sepet Tutarı (₺)</label>
              <input type="number" min={0} value={form.minPurchase} onChange={e => setForm(p=>({...p,minPurchase:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="100 (opsiyonel)" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Maks. Kullanım</label>
              <input type="number" min={1} value={form.maxUses} onChange={e => setForm(p=>({...p,maxUses:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="100 (opsiyonel)" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">Son Kullanma Tarihi</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm(p=>({...p,expiresAt:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
              İptal
            </button>
            <button onClick={handleAdd}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
              Kuponu Oluştur
            </button>
          </div>
        </div>
      )}

      {/* Kupon listesi */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Kod</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İndirim</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Koşullar</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Kullanım</th>
                <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Durum</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(4)].map((_,i) => (
                  <tr key={i}>{[...Array(6)].map((_,j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>
                  ))}</tr>
                ))
              ) : coupons.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-400">
                  <Tag size={32} className="mx-auto mb-2 opacity-30"/>
                  <p>Henüz kupon yok</p>
                </td></tr>
              ) : coupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-gray-900 text-sm">{c.code}</span>
                      <button onClick={() => copyCode(c.code)}
                        className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-brand-600">
                        {copied === c.code ? <Check size={13} className="text-green-600"/> : <Copy size={13}/>}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-black text-lg text-brand-600">
                      {c.type === 'PERCENTAGE' ? `%${c.value}` : `${c.value}₺`}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="text-xs text-gray-500 space-y-0.5">
                      {c.minPurchase && <p>Min: {c.minPurchase.toLocaleString('tr-TR')}₺</p>}
                      {c.expiresAt   && <p>Son: {formatDate(c.expiresAt)}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div>
                      <span className="text-sm font-black text-gray-900">{c.usedCount}</span>
                      {c.maxUses && (
                        <>
                          <span className="text-xs text-gray-400"> / {c.maxUses}</span>
                          <div className="w-16 bg-gray-100 rounded-full h-1 mx-auto mt-1">
                            <div className="bg-brand-600 h-1 rounded-full" style={{ width:`${Math.min(100,(c.usedCount/c.maxUses)*100)}%` }} />
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                      c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {c.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => handleDelete(c.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
                      <Trash2 size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
