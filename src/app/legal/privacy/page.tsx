import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gizlilik Politikası' }

export default function PrivacyPage() {
  return (
    <div className="bg-pearl min-h-screen">
      <div className="container-main py-16 max-w-3xl">
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Gizlilik Politikası</h1>
        <p className="font-body text-xs text-nude-400 mb-10">Son güncelleme: Haziran 2024</p>
        <div className="space-y-8 font-body text-nude-700 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Topladığımız Bilgiler</h2>
            <p>Hesap oluşturduğunuzda, alışveriş yaptığınızda veya destek için bize ulaştığınızda doğrudan bize ilettiğiniz bilgileri topluyoruz. Bu bilgiler; ad, e-posta adresi, kargo adresi ve ödeme bilgilerini kapsar.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Bilgileri Nasıl Kullanıyoruz</h2>
            <p>Topladığımız bilgileri işlemleri işlemek, sipariş onayı ve güncellemeleri göndermek, müşteri hizmetleri sunmak ve (onayınızla) tanıtım iletişimi için kullanıyoruz.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Veri Güvenliği</h2>
            <p>Kişisel bilgilerinizi korumak için SSL şifrelemesi, güvenli sunucular ve düzenli güvenlik denetimleri dahil sektör standardı güvenlik önlemleri uyguluyoruz.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-light text-charcoal mb-3">Bize Ulaşın</h2>
            <p>Gizlilik sorularınız için{' '}
              <a href="mailto:privacy@allorea-cosmetics.com" className="text-brand-600 underline">privacy@allorea-cosmetics.com</a>
              {' '}adresine yazabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
