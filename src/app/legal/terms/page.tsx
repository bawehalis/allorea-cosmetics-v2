import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kullanım Koşulları' }

export default function TermsPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="container-main py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Kullanım Koşulları</h1>
        <p className="font-body text-xs text-nude-400 mb-10">Son güncelleme: Haziran 2024</p>
        <div className="space-y-8 font-body text-nude-700 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Koşulların Kabulü</h2>
            <p>Allorea Cosmetics web sitesine erişerek ve bu siteyi kullanarak işbu Kullanım Koşulları'nı kabul etmiş sayılırsınız. Kabul etmiyorsanız lütfen sitemizi kullanmayın.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Ürünler ve Fiyatlandırma</h2>
            <p>Fiyatları istediğimiz zaman değiştirme hakkımızı saklı tutarız. Aksi belirtilmedikçe tüm fiyatlar USD cinsindendir. Doğru ürün bilgisi ve fiyatlandırma göstermek için her türlü çabayı gösteriyoruz.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Fikri Mülkiyet</h2>
            <p>Metin, görsel, logo ve tasarımlar dahil bu web sitesindeki tüm içerik Allorea Cosmetics'e aittir ve ilgili fikri mülkiyet yasalarıyla korunmaktadır.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
