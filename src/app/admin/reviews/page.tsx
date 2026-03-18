// src/app/admin/reviews/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { Star, Plus, Trash2, CheckCircle, XCircle, Search, Eye, EyeOff } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface Review {
  id: string
  productId?: string
  productName?: string
  name: string
  rating: number
  title: string
  body: string
  date: string
  isVerified: boolean
  isFeatured: boolean
  beforeImage?: string
  afterImage?: string
}

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
      ))}
    </div>
  )
}

// Fake reviews veritabanı (admin panelinde yönetilebilir)
const FAKE_REVIEWS: Review[] = [
  { id:'r1', productName:'Allorea Radiance Serum', name:'Elif K.', rating:5, title:'İnanılmaz sonuç!',
    body:'3 haftada belirgin fark gördüm. Gerçekten işe yarıyor.', date:'2025-01-12',
    isVerified:true, isFeatured:true },
  { id:'r2', productName:'Allorea Radiance Serum', name:'Selin A.', rating:5, title:'Saçım büyüdü!',
    body:'Doğum sonrası saç dökülmem çok fazlaydı. 2 ay sonra yeni tüyler çıktı.',
    date:'2025-01-08', isVerified:true, isFeatured:false },
  { id:'r3', productName:'Gece Onarım Kremi', name:'Merve T.', rating:4, title:'Pişman olmayacaksınız',
    body:'Annem de kullanmaya başladı. İkimiz de memnunuz.', date:'2025-01-02',
    isVerified:true, isFeatured:false },
  { id:'r4', productName:'Allorea Radiance Serum', name:'Zeynep B.', rating:4, title:'Etkili ama sabır gerek',
    body:'İlk ay sonuç göremedim. 6. haftadan sonra farklılık başladı.', date:'2024-12-28',
    isVerified:true, isFeatured:true },
  { id:'r5', productName:'Kadife Gül Dudak Bakımı', name:'Ayşe M.', rating:5, title:'Harika ürün',
    body:'Hem anneme hem kendime aldım. Çok memnunuz.', date:'2024-12-20',
    isVerified:false, isFeatured:false },
]

export default function AdminReviewsPage() {
  const [reviews, setReviews]   = useState<Review[]>(FAKE_REVIEWS)
  const [search,  setSearch]    = useState('')
  const [showAdd, setShowAdd]   = useState(false)
  const [newReview, setNewReview] = useState({
    name:'', rating:5, title:'', body:'', productName:'', isVerified:true, isFeatured:false
  })

  const filtered = reviews.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.body.toLowerCase().includes(search.toLowerCase()) ||
    (r.productName || '').toLowerCase().includes(search.toLowerCase())
  )

  const toggleFeatured = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
  }

  const deleteReview = (id: string) => {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      setReviews(prev => prev.filter(r => r.id !== id))
    }
  }

  const handleAdd = () => {
    if (!newReview.name || !newReview.body) return
    const review: Review = {
      ...newReview,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    }
    setReviews(prev => [review, ...prev])
    setNewReview({ name:'', rating:5, title:'', body:'', productName:'', isVerified:true, isFeatured:false })
    setShowAdd(false)
  }

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Yorumlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{reviews.length} yorum · {reviews.filter(r=>r.isFeatured).length} öne çıkan</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
          <Plus size={16} /> Yorum Ekle
        </button>
      </div>

      {/* Arama */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Yorum, isim, ürün ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
        />
      </div>

      {/* Yorum Ekle Formu */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-900">Yeni Yorum Ekle</h2>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
              <XCircle size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Müşteri Adı *</label>
              <input value={newReview.name} onChange={e => setNewReview(p=>({...p,name:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Elif K." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Ürün</label>
              <input value={newReview.productName} onChange={e => setNewReview(p=>({...p,productName:e.target.value}))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Allorea Radiance Serum" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Başlık</label>
            <input value={newReview.title} onChange={e => setNewReview(p=>({...p,title:e.target.value}))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="İnanılmaz sonuç!" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Yorum Metni *</label>
            <textarea rows={3} value={newReview.body} onChange={e => setNewReview(p=>({...p,body:e.target.value}))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" placeholder="Yorumunu buraya yaz..." />
          </div>

          <div className="flex items-center gap-6">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Puan</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setNewReview(p=>({...p,rating:s}))}
                    className="transition-transform hover:scale-110">
                    <Star size={22} className={s <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newReview.isVerified} onChange={e => setNewReview(p=>({...p,isVerified:e.target.checked}))}
                className="w-4 h-4 accent-brand-600" />
              <span className="text-sm font-medium text-gray-700">Doğrulanmış Alım</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newReview.isFeatured} onChange={e => setNewReview(p=>({...p,isFeatured:e.target.checked}))}
                className="w-4 h-4 accent-brand-600" />
              <span className="text-sm font-medium text-gray-700">Öne Çıkar</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              İptal
            </button>
            <button onClick={handleAdd}
              className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Yorum Listesi */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Müşteri</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Yorum</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ürün</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Puan</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Durum</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[260px]">
                    {r.title && <p className="font-semibold text-gray-900 text-xs mb-0.5">{r.title}</p>}
                    <p className="text-gray-600 text-xs line-clamp-2">{r.body}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-gray-500">{r.productName || '—'}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StarRow rating={r.rating} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      {r.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium w-fit">
                          <CheckCircle size={9} /> Doğrulanmış
                        </span>
                      )}
                      {r.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full font-medium w-fit">
                          <Star size={9} className="fill-brand-600" /> Öne Çıkan
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleFeatured(r.id)}
                        title={r.isFeatured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-brand-600">
                        {r.isFeatured ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => deleteReview(r.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Star size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Yorum bulunamadı</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
