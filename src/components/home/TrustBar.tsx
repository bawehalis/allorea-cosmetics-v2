import { Truck, RefreshCw, ShieldCheck, Leaf, Award } from 'lucide-react'

const FEATURES = [
  { icon: Truck, title: 'Ücretsiz Kargo', desc: '75$ üzeri siparişlerde' },
  { icon: RefreshCw, title: 'Kolay İade', desc: '30 günlük iade politikası' },
  { icon: ShieldCheck, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
  { icon: Leaf, title: 'Temiz Güzellik', desc: 'Zararlı içerik yok' },
  { icon: Award, title: 'Ödüllü Marka', desc: 'Editörlerin tercihi' },
]

export default function TrustBar() {
  return (
    <div className="bg-charcoal text-white py-6 border-y border-white/10">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon size={22} className="text-brand-400 shrink-0" />
              <div>
                <p className="font-body text-xs font-medium tracking-wider uppercase text-white leading-none mb-0.5">{title}</p>
                <p className="font-body text-xs text-white/50">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
