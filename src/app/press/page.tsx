import { Metadata } from 'next'
import { Mail } from 'lucide-react'

export const metadata: Metadata = { title: 'Basın & Medya' }

const PRESS = [
  { outlet: 'Vogue',           quote: 'Editörlerin yılın en iyisi olarak nitelendirdiği C vitamini serumu.', date: 'Mayıs 2024' },
  { outlet: 'Elle',            quote: 'Allorea, lüks temiz güzelliğin şifresini çözdü.',                    date: 'Nisan 2024' },
  { outlet: 'Harper\'s Bazaar', quote: 'Yalnızca bir serum kullanacaksanız, bu olsun.',                      date: 'Mart 2024' },
  { outlet: 'InStyle',         quote: 'Gerçekten işe yarayan gece kremi — hepsini denedik.',                date: 'Şubat 2024' },
]

export default function PressPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-nude-100 py-16 border-b border-nude-200">
        <div className="container-main text-center">
          <p className="section-subtitle">Dünyadan Sesler</p>
          <h1 className="font-display text-5xl font-light text-charcoal">Basın & Medya</h1>
        </div>
      </div>
      <div className="container-main py-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {PRESS.map(item => (
            <div key={item.outlet} className="bg-white border border-nude-100 p-8">
              <p className="font-body text-xs font-semibold tracking-[0.25em] uppercase text-nude-400 mb-4">
                {item.outlet} · {item.date}
              </p>
              <p className="font-display text-2xl font-light text-charcoal italic leading-snug">"{item.quote}"</p>
            </div>
          ))}
        </div>
        <div className="bg-charcoal text-white p-10 text-center">
          <h2 className="font-display text-3xl font-light mb-3">Basın İletişimi</h2>
          <p className="font-body text-white/70 mb-6 max-w-md mx-auto">
            Basın materyalleri, ürün örnekleri veya röportaj talepleri için iletişim ekibimizle iletişime geçin.
          </p>
          <a href="mailto:press@allorea-cosmetics.com" className="inline-flex items-center gap-2 btn-brand">
            <Mail size={16} /> press@allorea-cosmetics.com
          </a>
        </div>
      </div>
    </div>
  )
}
