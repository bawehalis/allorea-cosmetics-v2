import { Metadata } from 'next'

export const metadata: Metadata = { title: 'İade Politikası' }

export default function ReturnsPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="container-main py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">İade Politikası</h1>
        <p className="font-body text-xs text-nude-400 mb-10">Son güncelleme: Haziran 2024</p>
        <div className="space-y-8 font-body text-nude-700 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">30 Günlük İade</h2>
            <p>Teslimatten itibaren 30 gün içinde iade kabul ediyoruz. Ürünlerin orijinal halinde, kullanılmamış ve orijinal ambalajında olması gerekir. İndirimli ürünler iadeye tabi değildir.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">İade Nasıl Yapılır</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Sipariş numaranızla returns@allorea-cosmetics.com adresine e-posta gönderin</li>
              <li>24 saat içinde ön ödemeli iade etiketini size yollayacağız</li>
              <li>Ürününüzü güvenli bir şekilde paketleyip herhangi bir kargo noktasına bırakın</li>
              <li>Geri ödeme, ürünün bize ulaşmasından 5–7 iş günü içinde yapılır</li>
            </ol>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Değişim</h2>
            <p>Değişim için orijinal ürünü iade edip yeni bir sipariş oluşturmanız yeterlidir. Bu sayede işleminiz en hızlı şekilde tamamlanır.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
