// src/app/admin/bundles/page.tsx
// Ürün paket/variant yönetimi
'use client'
import { useState } from 'react'
import { Plus, Trash2, Save, CheckCircle, Flame, Package } from 'lucide-react'

interface Bundle {
  id: string
  productName: string
  label: string
  quantity: number
  price: number
  comparePrice?: number
  discountPercent: number
  isMostPopular: boolean
  savings?: number
}

// Örnek başlangıç verisi
const INIT_BUNDLES: Bundle[] = [
  { id:'b1', productName:'Allorea Saç Yoğunlaştırıcı Serum', label:'1 Adet', quantity:1, price:349, comparePrice:499, discountPercent:0, isMostPopular:false },
  { id:'b2', productName:'Allorea Saç Yoğunlaştırıcı Serum', label:'3 Adet', quantity:3, price:799, comparePrice:1497, discountPercent:47, isMostPopular:true, savings:698 },
  { id:'b3', productName:'Allorea Saç Yoğunlaştırıcı Serum', label:'5 Adet', quantity:5, price:1199, comparePrice:2495, discountPercent:52, isMostPopular:false, savings:1296 },
]

const EMPTY: Omit<Bundle, 'id'> = {
  productName:'', label:'', quantity:1, price:0, comparePrice:undefined,
  discountPercent:0, isMostPopular:false, savings:undefined
}

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>(INIT_BUNDLES)
  const [adding,  setAdding]  = useState(false)
  const [form,    setForm]    = useState<Omit<Bundle,'id'>>(EMPTY)
  const [saved,   setSaved]   = useState(false)

  const upd = (k: keyof typeof form, v: any) => setForm(p => ({ ...p, [k]: v }))

  // Otomatik indirim hesapla
  const calcDiscount = (price: number, cp?: number) =>
    cp && cp > price ? Math.round(((cp - price) / cp) * 100) : 0
  const calcSavings  = (price: number, cp?: number, qty = 1) =>
    cp && cp > price ? (cp - price) * qty : 0

  const handleAdd = () => {
    if (!form.label || !form.price) return
    const b: Bundle = {
      ...form,
      id: `b${Date.now()}`,
      discountPercent: calcDiscount(form.price, form.comparePrice),
      savings: calcSavings(form.price, form.comparePrice, form.quantity),
    }
    setBundles(p => [...p, b])
    setForm(EMPTY)
    setAdding(false)
  }

  const handleDelete = (id: string) => {
    setBundles(p => p.filter(b => b.id !== id))
  }

  const togglePopular = (id: string) => {
    setBundles(p => p.map(b => ({ ...b, isMostPopular: b.id === id ? !b.isMostPopular : false })))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Ürünlere göre grupla
  const grouped = bundles.reduce((acc, b) => {
    const k = b.productName || 'Genel'
    if (!acc[k]) acc[k] = []
    acc[k].push(b)
    return acc
  }, {} as Record<string, Bundle[]>)

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Paket / Varyant Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ürün sayfasındaki "1 Adet / 3 Adet / 5 Adet" paket seçeneklerini buradan yönet
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <Plus size={15} /> Paket Ekle
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
            {saved ? <><CheckCircle size={16} /> Kaydedildi</> : <><Save size={16} /> Kaydet</>}
          </button>
        </div>
      </div>

      {/* Yeni paket formu */}
      {adding && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-5">Yeni Paket</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Ürün Adı</label>
              <input value={form.productName} onChange={e => upd('productName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="Allorea Saç Yoğunlaştırıcı Serum" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Paket Etiketi</label>
              <input value={form.label} onChange={e => upd('label', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="3 Adet" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Adet</label>
              <input type="number" min={1} value={form.quantity} onChange={e => upd('quantity', +e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Fiyat (₺)</label>
              <input type="number" min={0} step={0.01} value={form.price || ''}
                onChange={e => upd('price', +e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="799" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Eski Fiyat (₺)</label>
              <input type="number" min={0} step={0.01} value={form.comparePrice || ''}
                onChange={e => upd('comparePrice', e.target.value ? +e.target.value : undefined)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="1497" />
            </div>
          </div>

          {form.price > 0 && form.comparePrice && form.comparePrice > form.price && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-bold">
                %{calcDiscount(form.price, form.comparePrice)} indirim
              </span>
              <span className="text-xs text-green-600">
                {calcSavings(form.price, form.comparePrice, form.quantity).toLocaleString('tr-TR')}₺ tasarruf
              </span>
            </div>
          )}

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.isMostPopular} onChange={e => upd('isMostPopular', e.target.checked)}
              className="w-4 h-4 accent-brand-600" />
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              <Flame size={14} className="text-brand-600" /> "EN ÇOK SATAN" olarak işaretle
            </span>
          </label>

          <div className="flex gap-3 mt-5">
            <button onClick={() => { setAdding(false); setForm(EMPTY) }}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">İptal</button>
            <button onClick={handleAdd}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700">
              Paketi Ekle
            </button>
          </div>
        </div>
      )}

      {/* Gruplu paket listesi */}
      {Object.entries(grouped).map(([productName, items]) => (
        <div key={productName} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Package size={15} className="text-brand-600" />
            <h2 className="font-bold text-sm text-gray-900">{productName}</h2>
            <span className="text-xs text-gray-400">· {items.length} paket</span>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map(b => (
              <div key={b.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Paket kart önizleme */}
                  <div className={`relative w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-black shrink-0 ${
                    b.isMostPopular ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600'
                  }`}>
                    {b.quantity}x
                    {b.isMostPopular && (
                      <Flame size={10} className="absolute -top-1.5 -right-1.5 text-brand-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-gray-900">{b.label}</span>
                      {b.isMostPopular && (
                        <span className="text-[10px] font-black bg-brand-600 text-white px-2 py-0.5 rounded-full">EN ÇOK SATAN</span>
                      )}
                      {b.discountPercent > 0 && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">%{b.discountPercent} İNDİRİM</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-black text-charcoal">{b.price.toLocaleString('tr-TR')}₺</span>
                      {b.comparePrice && (
                        <span className="text-xs text-gray-400 line-through">{b.comparePrice.toLocaleString('tr-TR')}₺</span>
                      )}
                      {b.savings && b.savings > 0 && (
                        <span className="text-xs text-green-600 font-semibold">{b.savings.toLocaleString('tr-TR')}₺ tasarruf</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePopular(b.id)}
                    className={`p-2 rounded-xl transition-colors text-xs font-semibold ${
                      b.isMostPopular
                        ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    <Flame size={14} />
                  </button>
                  <button onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {bundles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Package size={36} className="mx-auto mb-2 text-gray-300" />
          <p className="text-gray-500">Henüz paket yok. Yukarıdan ekleyin.</p>
        </div>
      )}
    </div>
  )
}
