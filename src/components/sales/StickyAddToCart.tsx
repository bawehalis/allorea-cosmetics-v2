'use client'
import { useEffect, useState } from 'react'
import { ShoppingBag, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  price:         number
  comparePrice?: number
  bundleLabel:   string
  onAdd:         () => void
  inStock:       boolean
  adding:        boolean
  productName:   string
}

export default function StickyAddToCart({
  price, comparePrice, bundleLabel, onAdd, inStock, adding, productName,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 450)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300',
      visible ? 'translate-y-0' : 'translate-y-full'
    )}>
      {/* ─── Rating şeridi ───────────────────────────────────────────── */}
      <div className="bg-charcoal py-1.5 flex items-center justify-center gap-2">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-white text-[11px] font-black">4.9 · 1.243 değerlendirme</span>
        <span className="text-white/50 text-[10px]">·</span>
        <span className="text-green-400 text-[11px] font-bold">✓ Stokta var</span>
      </div>

      {/* ─── Ana bar ─────────────────────────────────────────────────── */}
      <div
        className="bg-white border-t-4 border-red-600 px-4 flex items-center gap-3"
        style={{ paddingTop: '10px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
      >
        {/* Fiyat bloğu */}
        <div className="shrink-0 min-w-[100px]">
          {discount > 0 && (
            <p className="text-[10px] text-nude-400 line-through leading-none">
              {comparePrice!.toLocaleString('tr-TR')}₺
            </p>
          )}
          <div className="flex items-baseline gap-1.5">
            {/* Fiyat daha büyük, kırmızı */}
            <span className="text-2xl font-black text-red-600 leading-tight">
              {price.toLocaleString('tr-TR')}₺
            </span>
            {discount > 0 && (
              <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5">
                -%{discount}
              </span>
            )}
          </div>
          <p className="text-[10px] text-nude-500 leading-tight font-semibold">{bundleLabel}</p>
        </div>

        {/* CTA — thumb-friendly, büyük, kırmızı */}
        <button
          onClick={onAdd}
          disabled={!inStock || adding}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 font-black text-base transition-all duration-150',
            /* yükseklik artırıldı: thumb-friendly */
            'h-14',
            !inStock
              ? 'bg-nude-200 text-nude-500 cursor-not-allowed'
              : adding
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] shadow-xl shadow-red-600/30'
          )}
        >
          <ShoppingBag size={20} />
          {!inStock ? 'Tükendi' : adding ? '✓ Eklendi!' : 'SEPETE EKLE'}
        </button>
      </div>
    </div>
  )
}
