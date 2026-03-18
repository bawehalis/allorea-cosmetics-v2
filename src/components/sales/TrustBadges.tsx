import { Truck, CreditCard, ShieldCheck, RotateCcw, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const BADGES = [
  { icon: Truck,       title: 'Hızlı Teslimat',    sub: '1–3 iş günü' },
  { icon: Phone,       title: 'Kapıda Ödeme',       sub: 'Teslimatta öde' },
  { icon: ShieldCheck, title: 'Güvenli Alışveriş',  sub: '256-bit SSL' },
  { icon: RotateCcw,   title: '30 Gün İade',        sub: 'Şartsız garanti' },
  { icon: CreditCard,  title: 'Taksit İmkânı',      sub: 'Tüm kartlara' },
]

interface Props { compact?: boolean; className?: string }

export default function TrustBadges({ compact = false, className = '' }: Props) {
  if (compact) {
    return (
      <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
        {BADGES.slice(0,3).map(b => (
          <div key={b.title} className="flex items-center gap-1.5 text-nude-600">
            <b.icon size={13} className="text-brand-500 shrink-0" />
            <span className="text-xs font-semibold">{b.title}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-3 sm:grid-cols-5 gap-2', className)}>
      {BADGES.map(b => (
        <div key={b.title}
          className="flex flex-col items-center gap-1.5 p-3 bg-white border-2 border-nude-100 text-center hover:border-brand-400 hover:shadow-sm transition-all">
          <b.icon size={20} className="text-red-600" />
          <span className="text-[11px] font-black text-charcoal leading-tight">{b.title}</span>
          <span className="text-[10px] text-nude-500 leading-tight">{b.sub}</span>
        </div>
      ))}
    </div>
  )
}
