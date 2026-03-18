import Link from 'next/link'
import Image from 'next/image'
import { Star, CheckCircle, ArrowRight, ShieldCheck, Truck, RotateCcw, Flame } from 'lucide-react'
import { FEATURED_PRODUCTS, SAC_SERUMU } from '@/lib/mock-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Allorea Cosmetics — Bilimsel Güzellik Ürünleri',
  description: '30 günde görünür fark veya paranız iade. Klinik test edilmiş kozmetik ürünler.',
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200'} />
      ))}
    </div>
  )
}

export default function HomePage() {
  const hero      = SAC_SERUMU
  const avgRating = hero.reviews.reduce((s,r)=>s+r.rating,0) / hero.reviews.length

  return (
    <div className="bg-pearl">

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-nude-100 to-white py-6 lg:py-10">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Metin */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-3">
                <StarRow rating={5} size={16} />
                <span className="text-sm font-black text-charcoal">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-nude-500">· {hero.reviews.length}+ değerlendirme</span>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-charcoal leading-[1.05] mb-4 tracking-tight">
                Saç Dökülmesini
                <br />
                <span className="text-red-600 italic underline decoration-4">Durdurun.</span>
              </h1>

              <div className="space-y-1.5 mb-4">
                {[
                  '30 günde görünür fark veya paranızı geri alın',
                  'Klinik test edilmiş biotin + kafein formülü',
                  'Kapıda ödeme · Hızlı kargo · Ücretsiz iade',
                ].map(f => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={16} className="text-brand-500 shrink-0 mt-0.5" />
                    <span className="text-base text-nude-700">{f}</span>
                  </div>
                ))}
              </div>

              {/* Sosyal kanıt */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-2xl border border-nude-100 w-fit shadow-sm">
                <div className="flex -space-x-2">
                  {['1622338242992','1596462502278','1598440947619'].map((id,i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shrink-0">
                      <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=80&q=80`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-black text-charcoal">2.847 kişi satın aldı</p>
                  <p className="text-xs text-nude-500">son 30 günde</p>
                </div>
              </div>

              {/* Paket butonları */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                {hero.bundles.map(b => (
                  <Link key={b.id} href={`/product/${hero.slug}`}
                    className={`relative flex-1 text-center py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                      b.isMostPopular
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:scale-[1.02]'
                        : 'border-2 border-nude-200 text-charcoal bg-white hover:border-brand-400 hover:shadow-sm'
                    }`}>
                    {b.isMostPopular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-400 text-amber-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        <Flame size={8} /> POPÜLER
                      </span>
                    )}
                    <span className="block font-black">{b.label}</span>
                    <span className="block text-xs mt-0.5 opacity-90">
                      {b.price.toLocaleString('tr-TR')}₺
                      {b.discountPercent > 0 && ` (-%${b.discountPercent})`}
                    </span>
                  </Link>
                ))}
              </div>

              <Link href={`/product/${hero.slug}`}
                className="inline-flex items-center gap-3 bg-red-600 text-white font-black py-5 px-12 text-lg hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/30 w-full sm:w-auto justify-center">
                <ShieldCheck size={22} />
                HEMEN SİPARİŞ VER
                <ArrowRight size={20} />
              </Link>

              <p className="text-xs text-nude-400 mt-3 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-brand-400" />
                30 gün memnuniyet garantisi · Kapıda ödeme seçeneği
              </p>
            </div>

            {/* Görsel */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square max-w-xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-nude-100 rounded-3xl" />
                <Image src={hero.images[0].url} alt={hero.name} fill priority
                  className="object-cover rounded-3xl"
                  sizes="(max-width:1024px) 100vw, 50vw" />
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-xl p-3 border border-nude-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-charcoal">Klinik Onaylı</p>
                      <p className="text-[10px] text-nude-400">Dermatoloji test</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-xl p-3 border border-nude-100">
                  <StarRow rating={5} size={13} />
                  <p className="text-xs font-black text-charcoal mt-0.5">{avgRating.toFixed(1)} / 5</p>
                  <p className="text-[10px] text-nude-400">{hero.reviews.length} doğrulanmış yorum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. KAYAN ŞERIT ───────────────────────────────────────────────── */}
      <section className="py-3 bg-charcoal text-white overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap" style={{ animation:'scroll 22s linear infinite' }}>
          {[...Array(3)].map((_,i) => (
            <div key={i} className="flex gap-10 shrink-0">
              {['⭐ 2.847 Mutlu Müşteri','✅ Klinik Test Edildi','🚚 1–3 Gün Kargo','💰 Kapıda Ödeme','🔄 30 Gün İade','🌿 Doğal Formül'].map(txt => (
                <span key={txt} className="text-sm font-semibold text-white/80 shrink-0">{txt}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. FAYDA KARTLARI ────────────────────────────────────────────── */}
      <section className="py-5 bg-white">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon:'🧪', title:'Klinik Onaylı',   desc:'Dermatoloji test' },
              { icon:'🌿', title:'%100 Doğal',       desc:'Kimyasal yok' },
              { icon:'📦', title:'Paket Avantajı',   desc:'%52\'ye varan indirim' },
              { icon:'💪', title:'30 Gün Garanti',   desc:'Sonuç yok = para iade' },
            ].map(item => (
              <div key={item.title}
                className="text-center p-4 bg-nude-50 rounded-2xl hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-nude-100">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-black text-sm text-charcoal">{item.title}</p>
                <p className="text-xs text-nude-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. TÜM ÜRÜNLER ───────────────────────────────────────────────── */}
      <section className="py-5 bg-nude-50">
        <div className="container-main">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Koleksiyonumuz</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Tüm Ürünler</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURED_PRODUCTS.map(p => (
              <Link key={p.id} href={`/product/${p.slug}`}
                className="group bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="relative aspect-square overflow-hidden bg-nude-50">
                  <Image src={p.image} alt={p.name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <StarRow rating={Math.round(p.rating)} size={12} />
                    <span className="text-xs text-nude-500">({p.reviewCount})</span>
                  </div>
                  <h3 className="font-bold text-sm text-charcoal leading-snug mb-1">{p.name}</h3>
                  <p className="text-xs text-nude-500 line-clamp-2 mb-3">{p.tagline}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-lg text-charcoal">{p.price.toLocaleString('tr-TR')}₺</span>
                    <span className="text-xs text-nude-400 line-through">{p.comparePrice.toLocaleString('tr-TR')}₺</span>
                    {p.bestBundle && (
                      <span className="text-[10px] bg-green-100 text-green-700 font-black px-1.5 py-0.5 rounded-full">
                        %{p.bestBundle.discountPercent} İNDİRİM
                      </span>
                    )}
                  </div>
                  <div className="mt-3 w-full bg-brand-600 text-white text-xs font-black py-2.5 rounded-xl text-center group-hover:bg-brand-700 transition-colors">
                    Ürüne Git →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. YORUMLAR ──────────────────────────────────────────────────── */}
      <section className="py-8 bg-white">
        <div className="container-main">
          <div className="text-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Gerçek Müşteriler</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Mutlu Müşterilerimiz</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hero.reviews.filter(r=>r.isFeatured).slice(0,3).map(review => (
              <div key={review.id}
                className="bg-white rounded-2xl p-5 border border-nude-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                <StarRow rating={review.rating} size={14} />
                <p className="font-black text-sm text-charcoal mt-2">{review.title}</p>
                <p className="text-sm text-nude-600 mt-1 leading-relaxed line-clamp-3">{review.body}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-nude-100">
                  <span className="text-xs font-black text-charcoal">{review.name}</span>
                  {review.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600 font-semibold">
                      <CheckCircle size={10} /> Doğrulanmış
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. PAKET SEÇENEKLERİ ─────────────────────────────────────────── */}
      <section className="py-8 bg-nude-50">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Özel Fiyatlar</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Paketinizi Seçin</h2>
            <p className="text-nude-500 text-sm mt-1">Daha fazla alın, daha çok tasarruf edin</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {hero.bundles.map(b => (
              <div key={b.id}
                className={`relative rounded-2xl border-2 p-5 text-center transition-all duration-200 hover:scale-[1.02] ${
                  b.isMostPopular ? 'border-brand-600 shadow-xl shadow-brand-600/10' : 'border-nude-200 hover:border-brand-300 hover:shadow-md'
                }`}>
                {b.isMostPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-brand-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">
                    <Flame size={10} /> En Çok Tercih Edilen
                  </div>
                )}
                <p className="font-black text-lg text-charcoal">{b.label}</p>
                {b.discountPercent > 0 && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-black px-2.5 py-0.5 rounded-full mt-1">
                    %{b.discountPercent} İNDİRİM
                  </span>
                )}
                <div className="my-3">
                  <div className="text-3xl font-black text-charcoal">{b.price.toLocaleString('tr-TR')}₺</div>
                  {b.comparePrice && <div className="text-sm text-nude-400 line-through">{b.comparePrice.toLocaleString('tr-TR')}₺</div>}
                  {b.savings != null && b.savings > 0 && (
                    <p className="text-green-600 text-sm font-black mt-1">{b.savings.toLocaleString('tr-TR')}₺ tasarruf</p>
                  )}
                </div>
                <Link href={`/product/${hero.slug}`}
                  className={`block w-full py-3 rounded-xl font-black text-sm transition-all ${
                    b.isMostPopular ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                  }`}>
                  Hemen Al →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-nude-400 mt-4">
            💳 Kapıda ödeme · 🚚 299₺ üzeri ücretsiz kargo · 🔄 30 gün iade
          </p>
        </div>
      </section>

      {/* ─── 7. SON CTA ───────────────────────────────────────────────────── */}
      <section className="py-6 bg-red-600 text-white">
        <div className="container-main text-center max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-light mb-2">Saçlarınız İçin Harekete Geçin</h2>
          <p className="text-white/80 mb-5 text-sm">{hero.reviews.length}+ kişi zaten sonuç aldı. Sıra sizde.</p>
          <Link href={`/product/${hero.slug}`}
            className="inline-flex items-center gap-3 bg-white text-red-600 font-black py-5 px-12 text-lg hover:bg-red-50 transition-colors shadow-2xl w-full sm:w-auto justify-center">
            <ShieldCheck size={20} />
            30 Gün Garanti ile Dene
            <ArrowRight size={18} />
          </Link>
          <p className="text-white/50 text-xs mt-4">Kapıda ödeme · WhatsApp sipariş · Hızlı kargo</p>
        </div>
      </section>
    </div>
  )
}
