'use client'
import { useState } from 'react'
import { Star, CheckCircle, ThumbsUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Review } from '@/lib/mock-data'

function StarRow({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={cn('shrink-0',
          s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200')} />
      ))}
    </div>
  )
}

interface Props { reviews: Review[]; productName: string }

export default function ReviewList({ reviews, productName }: Props) {
  const [showAll, setShowAll] = useState(false)
  const [liked,   setLiked]   = useState<Record<string,boolean>>({})

  const avg      = reviews.reduce((s,r)=>s+r.rating,0)/reviews.length
  const roundAvg = (Math.round(avg*10)/10).toFixed(1)
  const displayed = showAll ? reviews : reviews.slice(0, 5)

  const dist = [5,4,3,2,1].map(n => ({
    n,
    count: reviews.filter(r=>r.rating===n).length,
    pct:   Math.round((reviews.filter(r=>r.rating===n).length/reviews.length)*100),
  }))

  return (
    <div>
      {/* ── Özet ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-5 items-center bg-amber-50 border-2 border-amber-200 p-5 mb-4">
        <div className="text-center shrink-0">
          <p className="text-7xl font-black text-charcoal leading-none">{roundAvg}</p>
          <StarRow rating={Math.round(avg)} size={20} />
          <p className="text-xs text-nude-500 mt-1 font-semibold">
            {reviews.length.toLocaleString('tr-TR')} değerlendirme
          </p>
        </div>
        <div className="flex-1 w-full space-y-1.5">
          {dist.map(d => (
            <div key={d.n} className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 w-4 shrink-0 text-right">{d.n}</span>
              <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
              <div className="flex-1 h-3 bg-nude-200 overflow-hidden">
                <div className="h-full bg-amber-400 transition-all duration-700"
                  style={{ width:`${d.pct}%` }} />
              </div>
              <span className="text-xs text-nude-500 w-5 shrink-0 font-semibold">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Yorum kartları ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        {displayed.map(r => (
          <div key={r.id} className={cn(
            'bg-white border p-4 hover:shadow-sm transition-shadow',
            r.rating <= 3 ? 'border-nude-200' : 'border-nude-100'
          )}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className={cn(
                  'w-9 h-9 flex items-center justify-center font-black text-sm shrink-0',
                  r.rating >= 5 ? 'bg-brand-100 text-brand-700' :
                  r.rating >= 4 ? 'bg-amber-100 text-amber-700' :
                  'bg-nude-100 text-nude-600'
                )}>
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-charcoal">{r.name}</span>
                    {r.isVerified && (
                      <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-semibold">
                        <CheckCircle size={10} /> Doğrulanmış
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRow rating={r.rating} />
                    <span className="text-[10px] text-nude-400">{r.date}</span>
                  </div>
                </div>
              </div>
              {/* Puan chip */}
              <span className={cn(
                'text-xs font-black px-2 py-0.5 shrink-0',
                r.rating >= 5 ? 'bg-green-600 text-white' :
                r.rating >= 4 ? 'bg-amber-500 text-white' :
                r.rating >= 3 ? 'bg-nude-400 text-white' : 'bg-red-500 text-white'
              )}>
                {r.rating}/5
              </span>
            </div>

            {/* Başlık */}
            <p className="font-black text-sm text-charcoal mb-1.5">{r.title}</p>

            {/* Metin — tam, kısaltma yok */}
            <p className="text-sm text-nude-700 leading-relaxed">{r.body}</p>

            {/* Before/After */}
            {r.beforeImage && r.afterImage && (
              <div className="flex gap-2 mt-3">
                <div className="relative flex-1 aspect-square overflow-hidden">
                  <img src={r.beforeImage} alt="Önce" className="w-full h-full object-cover" />
                  <span className="absolute top-0 left-0 bg-black/80 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                    ÖNCE
                  </span>
                </div>
                <div className="relative flex-1 aspect-square overflow-hidden">
                  <img src={r.afterImage} alt="Sonra" className="w-full h-full object-cover" />
                  <span className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                    SONRA
                  </span>
                </div>
              </div>
            )}

            {/* Faydalı mı? */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-nude-50">
              <span className="text-[11px] text-nude-400">Bu yorum faydalı mıydı?</span>
              <button onClick={() => setLiked(p=>({...p,[r.id]:!p[r.id]}))}
                className={cn('flex items-center gap-1 text-[11px] font-semibold transition-colors',
                  liked[r.id] ? 'text-brand-600' : 'text-nude-400 hover:text-brand-500')}>
                <ThumbsUp size={12} className={liked[r.id] ? 'fill-brand-600' : ''} />
                Evet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tümünü gör */}
      {!showAll && reviews.length > 5 && (
        <button onClick={() => setShowAll(true)}
          className="w-full mt-3 py-4 flex items-center justify-center gap-2 border-2 border-nude-200 text-sm font-black text-nude-700 hover:border-charcoal hover:text-charcoal transition-colors">
          <ChevronDown size={16} />
          Tüm {reviews.length} Yorumu Gör
        </button>
      )}
    </div>
  )
}
