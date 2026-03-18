import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hukuki Belgeler' }

const PAGES = [
  { href: '/legal/privacy',  title: 'Gizlilik Politikası',   desc: 'Verilerinizi nasıl topladığımızı ve kullandığımızı öğrenin' },
  { href: '/legal/terms',    title: 'Kullanım Koşulları',    desc: 'Web sitemizin kullanımını düzenleyen kurallar' },
  { href: '/legal/shipping', title: 'Kargo Politikası',      desc: 'Teslimat süreleri, maliyetler ve süreçler' },
  { href: '/legal/returns',  title: 'İade Politikası',       desc: '30 günlük zahmetsiz iade sürecimiz' },
]
export default function LegalIndexPage() {
  return (
    <div className="container-main py-16 max-w-2xl">
      <h1 className="font-display text-4xl font-light text-charcoal mb-10">Hukuki Bilgiler</h1>
      <div className="space-y-4">
        {PAGES.map(p => (
          <Link key={p.href} href={p.href} className="block p-6 bg-white border border-nude-100 hover:border-nude-300 transition-colors">
            <h2 className="font-body font-semibold text-charcoal">{p.title}</h2>
            <p className="font-body text-sm text-nude-500 mt-1">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
