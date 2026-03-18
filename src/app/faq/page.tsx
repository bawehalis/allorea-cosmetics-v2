'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Sıkça Sorulan Sorular' }

const FAQS = [
  { category: 'Sipariş ve Kargo', items: [
    { q: 'Kargom ne zaman gelir?',          a: 'Standart kargo 5–7 iş günü, ekspres kargo 2–3 iş günü, aynı gün kargo ise sonraki iş günü teslim edilir. Seçeneğinizi ödeme adımında belirleyebilirsiniz.' },
    { q: 'Ücretsiz kargo var mı?',           a: '75$ ve üzeri siparişlerde standart kargo ücretsizdir. Yurt dışı kargo ücretleri hedefe göre değişmektedir.' },
    { q: 'Siparişimi değiştirebilir miyim?', a: 'Siparişler verilmesinden itibaren 2 saat içinde değiştirilebilir ya da iptal edilebilir. Bu süreden sonra işleme alınan siparişler değiştirilemez. Lütfen hemen hello@allorea-cosmetics.com adresine yazın.' },
    { q: 'Yurt dışına gönderim yapıyor musunuz?', a: 'Evet, 40\'tan fazla ülkeye kargo gönderiyoruz. Uluslararası siparişler 10–14 iş gününde teslim edilir. Gümrük ve vergiler alıcıya aittir.' },
  ]},
  { category: 'İade ve Geri Ödeme', items: [
    { q: 'İade politikanız nedir?',          a: 'Teslimatten itibaren 30 gün içinde, kullanılmamış ve orijinal ambalajında olan ürünleri iade kabul ediyoruz. İndirimli ürünler iadeye tabi değildir.' },
    { q: 'İade nasıl başlatırım?',           a: 'Sipariş numaranızla returns@allorea-cosmetics.com adresine e-posta gönderin. 24 saat içinde ön ödemeli iade etiketi göndeririz. Geri ödeme, ürünün bize ulaşmasından 5–7 iş günü içinde yapılır.' },
    { q: 'Ürünum hasarlı geldi, ne yapmalıyım?', a: 'Özür dileriz! Teslimatten itibaren 48 saat içinde hasara ait fotoğraflar ve sipariş numaranızla bize e-posta gönderin. Hemen yenisini yollayalım.' },
  ]},
  { category: 'Ürünler ve Formüller', items: [
    { q: 'Ürünleriniz cruelty-free mi?',      a: 'Evet, %100. PETA sertifikalıyız ve üretimin hiçbir aşamasında hayvanlarda test yapmıyoruz. Tüm tedarikçilerimiz aynı standardı karşılamak zorundadır.' },
    { q: 'Ürünleriniz vegan mı?',             a: 'Ürünlerimizin büyük çoğunluğu vegandir. Balmumu veya diğer hayvansal türevler içeren ürünler ürün sayfasında açıkça belirtilmektedir.' },
    { q: 'Hassas ciltler için güvenli mi?',   a: 'Tüm Allorea ürünleri dermatolojik olarak test edilmiş ve paraben, sülfat ile sentetik parfümden arındırılmış formüllere sahiptir. Yine de tam uygulamadan önce yama testi önerilir.' },
    { q: 'Ürünleri nasıl saklamalıyım?',      a: 'Ürünleri serin ve kuru bir yerde, doğrudan güneş ışığından uzak saklayın. C vitamini serumları gibi bazı ürünler buzdolabında saklandığında raf ömrü uzar.' },
  ]},
  { category: 'Hesap ve Ödeme', items: [
    { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Visa, Mastercard, American Express, PayPal, Apple Pay ve Google Pay kabul ediyoruz. Tüm ödemeler Stripe üzerinden güvenle işlenmektedir.' },
    { q: 'Ödeme bilgilerim güvende mi?',      a: 'Kesinlikle. Kart bilgilerinizi hiç saklamıyoruz. Tüm ödemeler 256-bit SSL şifrelemesiyle Stripe tarafından işlenir. PCI-DSS uyumlu bir sistemiz.' },
    { q: 'Birden fazla indirim kodu kullanabilir miyim?', a: 'Sipariş başına yalnızca bir indirim kodu uygulanabilir. Özellikle belirtilmediği sürece kodlar diğer kampanyalarla birleştirilemez.' },
  ]},
]

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (key: string) => setOpen(o => o === key ? null : key)

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-nude-100 py-16 border-b border-nude-200">
        <div className="container-main text-center">
          <p className="section-subtitle">Yardım Merkezi</p>
          <h1 className="font-display text-5xl font-light text-charcoal">Sıkça Sorulan Sorular</h1>
          <p className="font-body text-nude-500 mt-4 max-w-md mx-auto">
            Aradığınızı bulamadınız mı?{' '}
            <a href="/contact" className="text-brand-600 underline">Bize yazın</a>, yardımcı olalım.
          </p>
        </div>
      </div>
      <div className="container-main py-16 max-w-3xl">
        {FAQS.map(section => (
          <div key={section.category} className="mb-10">
            <h2 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-brand-600 mb-4">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((faq, i) => {
                const key = `${section.category}-${i}`
                const isOpen = open === key
                return (
                  <div key={key} className="bg-white border border-nude-100">
                    <button onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left">
                      <span className="font-body font-medium text-sm text-charcoal pr-4">{faq.q}</span>
                      <ChevronDown size={16} className={cn('text-nude-400 shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="font-body text-sm text-nude-600 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
