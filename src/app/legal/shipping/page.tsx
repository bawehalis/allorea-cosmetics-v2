import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kargo Politikası' }

export default function ShippingPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="container-main py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Kargo Politikası</h1>
        <p className="font-body text-xs text-nude-400 mb-10">Son güncelleme: Haziran 2024</p>
        <div className="space-y-8 font-body text-nude-700 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">İşlem Süresi</h2>
            <p>Siparişler 1–2 iş günü içinde işleme alınır. Saat 14:00'dan sonra verilen siparişler ertesi iş günü işleme alınır.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Kargo Seçenekleri</h2>
            <div className="overflow-hidden border border-nude-200">
              <table className="w-full text-sm">
                <thead className="bg-nude-50">
                  <tr>{['Yöntem','Teslimat Süresi','Ücret'].map(h=><th key={h} className="px-4 py-3 text-left font-medium text-charcoal">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-nude-100">
                  <tr><td className="px-4 py-3">Standart</td><td className="px-4 py-3">5–7 iş günü</td><td className="px-4 py-3">$7.99 (75$ üzeri ücretsiz)</td></tr>
                  <tr className="bg-nude-50"><td className="px-4 py-3">Ekspres</td><td className="px-4 py-3">2–3 iş günü</td><td className="px-4 py-3">$18.99</td></tr>
                  <tr><td className="px-4 py-3">Aynı Gün</td><td className="px-4 py-3">Sonraki iş günü</td><td className="px-4 py-3">$34.99</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
