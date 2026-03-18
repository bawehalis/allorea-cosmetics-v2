import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Leaf, Heart, Award, Globe } from 'lucide-react'

export const metadata: Metadata = { title: 'Hakkımızda — Hikayemiz' }

export default function AboutPage() {
  return (
    <div className="bg-pearl">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1400&q=85"
          alt="Allorea Hakkında"
          fill className="object-cover" sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="relative h-full container-main flex items-center justify-center text-center">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-white/70 mb-4">Hikayemiz</p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-white">
              Güzellikte<br /><em>Ödünsüz Lüks</em>
            </h1>
          </div>
        </div>
      </section>

      {/* Misyon */}
      <section className="page-section">
        <div className="container-main max-w-3xl text-center">
          <p className="section-subtitle">Misyonumuz</p>
          <h2 className="section-title mb-6">Size değer veren lüks</h2>
          <p className="font-body text-nude-600 leading-relaxed text-lg">
            Allorea, lüks güzellik ve temiz içeriklerin hiçbir zaman birbirini dışlamaması gerektiği inancıyla kuruldu.
            Her formül, en seçkin botaniklerle özenle hazırlanmış, titizlikle test edilmiş ve cildinizde gerçek bir
            fark yaratmak için tasarlanmıştır — sağlığınızdan ya da gezegenimizden ödün vermeden.
          </p>
        </div>
      </section>

      {/* Değerler */}
      <section className="page-section bg-nude-50">
        <div className="container-main">
          <div className="text-center mb-14">
            <p className="section-subtitle">Neye İnandığımız</p>
            <h2 className="section-title">Değerlerimiz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf,  title: 'Temiz Formüller',       desc: 'Paraben, sülfat ya da sentetik parfüm yok. Her bileşenin bir amacı ve temiz bir güvenlik profili vardır.' },
              { icon: Heart, title: 'Hayvansız Test',         desc: 'PETA sertifikalıyız. Hiçbir zaman hayvanlarda test yapmadık, yapmayacağız da. Güzellik zarar vermemelidir.' },
              { icon: Globe, title: 'Sürdürülebilir Kaynak',  desc: 'İçeriklerimiz, çevreye olan bağlılığımızı paylaşan çiftçilerden etik şekilde temin edilmektedir.' },
              { icon: Award, title: 'Dermatoloji Onaylı',     desc: 'Her ürün bağımsız olarak test edilmiş ve sertifikalı dermatologlarca onaylanmıştır.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                  <Icon size={26} className="text-brand-600" />
                </div>
                <h3 className="font-display text-xl font-light text-charcoal mb-3">{title}</h3>
                <p className="font-body text-sm text-nude-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hikaye */}
      <section className="page-section">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subtitle">Nasıl Başladı</p>
              <h2 className="section-title mb-6">Bir Paris atölyesinde doğdu</h2>
              <p className="font-body text-nude-600 leading-relaxed mb-4">
                Allorea, biyokimyager ve güzellik tutkunu Isabelle Laurent'ın etkinlik ile temiz
                içerikler arasında seçim yapmak zorunda kalmasına karşı çıkmasıyla 2018'de kuruldu.
                İki yıl boyunca hem bilimsel olarak kanıtlanmış hem de zararlı kimyasallardan arındırılmış
                formüller geliştirerek bu boşluğu kapatmaya çalıştı.
              </p>
              <p className="font-body text-nude-600 leading-relaxed mb-8">
                Bugün Allorea, 40'tan fazla ülkede yüz binlerce müşteri tarafından kullanılmaktadır
                ve her ürün, ilk seriyle aynı titiz kalite anlayışını taşımaya devam etmektedir.
              </p>
              <Link href="/shop" className="btn-primary gap-2">Koleksiyonu Keşfet</Link>
            </div>
            <div className="relative aspect-square overflow-hidden bg-nude-100">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
                alt="Allorea hikayesi"
                fill className="object-cover" sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
