'use client'
import { cn } from '@/lib/utils'
import type { ProductBundle } from '@/lib/mock-data'

interface Props {
  bundles:  ProductBundle[]
  selected: string
  onChange: (id: string) => void
}

export default function BundleSelector({ bundles, selected, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-nude-500 mb-1">
        Paket Seçin
      </p>

      {bundles.map(b => {
        const isSelected = selected === b.id

        return (
          <button
            key={b.id}
            onClick={() => onChange(b.id)}
            type="button"
            className={cn(
              'relative w-full border-[3px] p-3.5 text-left transition-all duration-150',
              /* köşeli/sert görünüm — rounded değil */
              isSelected
                ? 'border-red-600 bg-red-50'
                : 'border-nude-200 bg-white hover:border-nude-400'
            )}
          >
            {/* EN ÇOK SATAN — kartın üstünden taşıyor, kırmızı, büyük, köşeli */}
            {b.isMostPopular && (
              <span className="absolute -top-[14px] left-0 right-0 flex items-center justify-center pointer-events-none">
                <span className="bg-red-600 text-white text-[11px] font-black uppercase tracking-[0.1em] px-4 py-1">
                  🔥 EN ÇOK SATAN — %{b.discountPercent} İNDİRİM
                </span>
              </span>
            )}

            <div className="flex items-center justify-between gap-2">
              {/* Sol: radio + etiket + tasarruf */}
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Sert kare radio */}
                <div className={cn(
                  'w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors',
                  isSelected ? 'border-red-600 bg-red-600' : 'border-nude-300 bg-white'
                )}>
                  {isSelected && <div className="w-2 h-2 bg-white" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      'font-black text-sm',
                      isSelected ? 'text-red-700' : 'text-charcoal'
                    )}>
                      {b.label}
                    </span>
                    {b.discountPercent > 0 && !b.isMostPopular && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5">
                        %{b.discountPercent} İNDİRİM
                      </span>
                    )}
                  </div>
                  {b.savings != null && b.savings > 0 && (
                    <p className="text-[11px] text-red-600 font-bold mt-0.5 leading-tight">
                      ↓ {b.savings.toLocaleString('tr-TR')}₺ tasarruf
                    </p>
                  )}
                </div>
              </div>

              {/* Sağ: fiyat bloğu — sert, büyük */}
              <div className="text-right shrink-0">
                <div className={cn(
                  'font-black text-xl leading-tight',
                  isSelected ? 'text-red-700' : 'text-charcoal'
                )}>
                  {b.price.toLocaleString('tr-TR')}₺
                </div>
                {b.comparePrice != null && b.comparePrice > b.price && (
                  <div className="text-xs text-nude-400 line-through leading-tight">
                    {b.comparePrice.toLocaleString('tr-TR')}₺
                  </div>
                )}
              </div>
            </div>

            {/* Seçili: alt vurgu çizgisi */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}
