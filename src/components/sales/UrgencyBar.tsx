'use client'
import { useEffect, useState } from 'react'
import { Flame, Users, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  stock:      number
  buyers24h?: number
  viewers?:   number
}

export default function UrgencyBar({ stock, buyers24h = 63, viewers = 19 }: Props) {
  const [pulse, setPulse] = useState(false)
  const [count, setCount] = useState(buyers24h)

  useEffect(() => {
    if (stock > 20) return
    const t = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }, 5000)
    return () => clearInterval(t)
  }, [stock])

  /* Alıcı sayısı zaman zaman hafifçe artar (FOMO) */
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.7) setCount(c => c + 1)
    }, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-2">

      {/* ─── 24 saatlik alım sayısı — koyu kırmızı ─────────────────── */}
      <div className="flex items-center gap-2 bg-red-600 px-3.5 py-2.5">
        <Flame size={15} className="text-white shrink-0" />
        <p className="text-sm font-black text-white">
          Son 24 saatte{' '}
          <span className="text-yellow-300">{count}</span>{' '}
          kişi satın aldı
        </p>
      </div>

      {/* ─── Stok uyarısı — sadece az stokta ───────────────────────── */}
      {stock <= 20 && (
        <div className={cn(
          'flex items-start gap-2.5 border-2 border-red-600 px-3.5 py-2.5 transition-colors duration-300',
          pulse ? 'bg-red-600' : 'bg-red-50'
        )}>
          <AlertTriangle size={16} className={cn('shrink-0 mt-0.5 transition-colors', pulse ? 'text-white' : 'text-red-600')} />
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-black transition-colors', pulse ? 'text-white' : 'text-red-700')}>
              ⚠️ Stokta sadece <span className="text-2xl">{stock}</span> adet kaldı!
            </p>
            {/* mini stok bar */}
            <div className="flex gap-0.5 mt-1.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={cn(
                  'h-2 flex-1 transition-colors',
                  i < Math.ceil((stock / 50) * 10)
                    ? pulse ? 'bg-white' : 'bg-red-500'
                    : 'bg-nude-200'
                )} />
              ))}
            </div>
            <p className={cn('text-[10px] font-bold mt-1 transition-colors', pulse ? 'text-white/80' : 'text-red-500')}>
              Bu hızla satışta hemen biter — kaçırmayın
            </p>
          </div>
        </div>
      )}

      {/* ─── Anlık izleyici ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <Users size={12} className="text-green-600" />
        </div>
        <p className="text-xs font-semibold text-nude-700">
          Şu an{' '}
          <span className="font-black text-charcoal">{viewers}</span>{' '}
          kişi bu ürünü inceliyor
        </p>
      </div>

    </div>
  )
}
