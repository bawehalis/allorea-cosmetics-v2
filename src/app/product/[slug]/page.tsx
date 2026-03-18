'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingBag, MessageCircle, CheckCircle,
  Minus, Plus, Star, Truck, Phone, ShieldCheck,
  RotateCcw, ChevronRight, Zap,
} from 'lucide-react'
import { getProductBySlug } from '@/lib/mock-data'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

import ProductGallery    from '@/components/sales/ProductGallery'
import BundleSelector    from '@/components/sales/BundleSelector'
import TrustBadges       from '@/components/sales/TrustBadges'
import BeforeAfterSlider from '@/components/sales/BeforeAfterSlider'
import ReviewList        from '@/components/sales/ReviewList'
import FaqAccordion      from '@/components/sales/FaqAccordion'
import StickyAddToCart   from '@/components/sales/StickyAddToCart'
import UrgencyBar        from '@/components/sales/UrgencyBar'

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={cn('shrink-0', s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200')} />
      ))}
    </div>
  )
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const [selectedBundle, setSelectedBundle] = useState(product.bundles[0].id)
  const [qty,    setQty]    = useState(1)
  const [adding, setAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const bundle    = product.bundles.find(b => b.id === selectedBundle)!
  const avgRating = product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
  const roundAvg  = (Math.round(avgRating * 10) / 10).toFixed(1)

  const discountPct = bundle.comparePrice && bundle.comparePrice > bundle.price
    ? Math.round(((bundle.comparePrice - bundle.price) / bundle.comparePrice) * 100)
    : 0

  const handleAddToCart = async () => {
    setAdding(true)
    addItem({
      productId: product.id, name: product.name, slug: product.slug,
      price: bundle.price, quantity: qty,
      image: product.images[0]?.url || '', stock: product.stock, variant: bundle.label,
    })
    toast.success(`${product.name} (${bundle.label}) sepete eklendi!`, { duration: 3000, icon: '🛍️' })
    await new Promise(r => setTimeout(r, 700))
    setAdding(false)
    openCart()
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Merhaba! "${product.name}" — ${bundle.label} paketi (${bundle.price.toLocaleString('tr-TR')}₺) hakkında bilgi almak istiyorum.`)
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905001234567'}?text=${msg}`, '_blank')
  }

  const handleCOD = async () => {
    await handleAddToCart()
    setTimeout(() => { window.location.href = '/checkout?method=cod' }, 600)
  }

  return (
    <div className="bg-pearl">

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-nude-100 py-2 px-4 text-xs text-nude-400">
        <div className="container-main flex items-center gap-1.5">
          <Link href="/" className="hover:text-charcoal">Ana Sayfa</Link>
          <ChevronRight size={11} />
          <Link href="/shop" className="hover:text-charcoal">Ürünler</Link>
          <ChevronRight size={11} />
          <span className="text-charcoal truncate max-w-[180px]">{product.name}</span>
        </div>
      </nav>

      {/* ─── BÖLÜM 1: GALERİ + SATIŞ PANELİ ─────────────────────────── */}
      {/* py küçültüldü: daha sıkışık görünüm */}
      <section className="bg-white py-3 lg:py-6">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">

            {/* Görseller */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Sağ satış paneli — space-y küçültüldü */}
            <div className="space-y-3">

              {/* Rozet + puan */}
              <div className="flex items-center gap-3 flex-wrap">
                {product.badge && (
                  <span className="bg-red-600 text-white text-[11px] font-black uppercase px-3 py-1 tracking-wide">
                    {product.badge}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <StarRow rating={Math.round(avgRating)} size={16} />
                  <span className="text-sm font-black text-charcoal">{roundAvg}</span>
                  <span className="text-sm text-nude-500">
                    · {product.reviews.length.toLocaleString('tr-TR')} değerlendirme
                  </span>
                </div>
              </div>

              {/* Başlık */}
              <div>
                {/* h1 daha büyük, daha sert */}
                <h1 className="font-display text-2xl lg:text-[2rem] font-semibold text-charcoal leading-tight">
                  {product.name}
                </h1>
                <p className="text-red-600 font-bold text-sm mt-1">{product.tagline}</p>
              </div>

              {/* ═══ FİYAT BLOĞU — büyük, kırmızı, dikkat çekici ══════ */}
              <div className="bg-red-50 border-2 border-red-200 px-4 py-3">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Ana fiyat — büyük, kırmızı */}
                  <span className="text-5xl font-black text-red-600 leading-none">
                    {bundle.price.toLocaleString('tr-TR')}₺
                  </span>
                  {bundle.comparePrice != null && bundle.comparePrice > bundle.price && (
                    <div className="flex items-center gap-2.5">
                      {/* Eski fiyat — çizili, soluk */}
                      <span className="text-2xl text-nude-400 line-through font-medium leading-none">
                        {bundle.comparePrice.toLocaleString('tr-TR')}₺
                      </span>
                      {/* İndirim badge — kırmızı, köşeli, büyük */}
                      <span className="bg-red-600 text-white text-base font-black px-3 py-1.5 tracking-wide">
                        %{discountPct} İNDİRİM
                      </span>
                    </div>
                  )}
                </div>
                {bundle.savings != null && bundle.savings > 0 && (
                  <p className="text-red-700 font-bold text-sm mt-1.5">
                    ✓ {bundle.savings.toLocaleString('tr-TR')}₺ tasarruf ediyorsunuz
                  </p>
                )}
              </div>

              {/* ═══ URGENCY — kırmızı, dikkat çekici ══════════════════ */}
              <UrgencyBar stock={product.stock} buyers24h={63} viewers={19} />

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 border-y border-nude-100">
                {[
                  { icon: Truck,       text: 'Hızlı Teslimat' },
                  { icon: Phone,       text: 'Kapıda Ödeme' },
                  { icon: ShieldCheck, text: 'Güvenli Alışveriş' },
                  { icon: RotateCcw,   text: '30 Gün İade' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-nude-600">
                    <Icon size={13} className="text-brand-500 shrink-0" />
                    <span className="text-xs font-semibold">{text}</span>
                  </div>
                ))}
              </div>

              {/* Paket seçimi */}
              <BundleSelector
                bundles={product.bundles}
                selected={selectedBundle}
                onChange={id => { setSelectedBundle(id); setQty(1) }}
              />

              {/* Adet */}
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-nude-500 mb-1.5">Adet</p>
                <div className="inline-flex items-center border-2 border-nude-200 overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-nude-50 transition-colors">
                    <Minus size={15} />
                  </button>
                  <span className="w-12 text-center font-black text-charcoal text-base">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                    className="w-11 h-11 flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40">
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* ═══ BUTONLAR ═══════════════════════════════════════════ */}
              <div className="space-y-2">
                {/* Ana CTA — büyük, kırmızı */}
                <button onClick={handleAddToCart} disabled={product.stock === 0 || adding}
                  className={cn(
                    'w-full py-5 text-lg font-black flex items-center justify-center gap-3 transition-all duration-150',
                    product.stock === 0 ? 'bg-nude-200 text-nude-500 cursor-not-allowed'
                    : adding ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.99] shadow-xl shadow-red-600/30',
                  )}>
                  <ShoppingBag size={22} />
                  {product.stock === 0 ? 'Tükendi' : adding ? '✓ Sepete Eklendi!' : 'SEPETE EKLE'}
                </button>

                {/* Kapıda Öde */}
                <button onClick={handleCOD} disabled={product.stock === 0}
                  className="w-full py-4 text-base font-black border-2 border-charcoal text-charcoal flex items-center justify-center gap-3 hover:bg-charcoal hover:text-white transition-all duration-150 active:scale-[0.99] disabled:opacity-40">
                  <span className="text-xl">💵</span>
                  Kapıda Öde
                </button>

                {/* WhatsApp */}
                <button onClick={handleWhatsApp}
                  className="w-full py-3.5 text-sm font-black bg-[#25D366] text-white flex items-center justify-center gap-2.5 hover:bg-[#1eb858] transition-colors active:scale-[0.99]">
                  <MessageCircle size={18} />
                  WhatsApp ile Sipariş Ver
                </button>
              </div>

              {/* Özellikler */}
              <div className="space-y-1.5">
                {[
                  'Klinik olarak test edilmiş formül',
                  'Paraben, sülfat ve silikon içermez',
                  '30 gün memnuniyet garantisi — soru yok',
                  "Türkiye'ye 1–3 iş günü kargo",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle size={14} className="text-brand-500 shrink-0" />
                    <span className="text-sm text-nude-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 2: GÜVEN ROZETLERİ ───────────────────────────────── */}
      <section className="py-3 bg-nude-50 border-y border-nude-100">
        <div className="container-main"><TrustBadges /></div>
      </section>

      {/* ─── BÖLÜM 3: SORUN ANLATIMI ─────────────────────────────────── */}
      <section className="py-6 bg-white">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Problemi Tanıyor musunuz?</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Saç Dökülmesi Sadece Estetik Değil</h2>
          </div>
          <div className="space-y-2.5 text-nude-700">
            {product.problemText?.split('\n').map((para, i) => {
              if (!para.trim()) return null
              if (para.startsWith('**') && para.endsWith('**'))
                return <p key={i} className="font-bold text-charcoal text-base lg:text-lg">{para.slice(2,-2)}</p>
              return <p key={i} className="text-sm lg:text-base leading-relaxed">{para}</p>
            })}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{ icon:'😔', text:'Özgüven kaybı' }, { icon:'💸', text:'Pahalı çözümler' }, { icon:'⏰', text:'Zaman kaybı' }].map(item => (
              <div key={item.text} className="text-center p-3 bg-nude-50 border border-nude-100 hover:shadow-sm transition-shadow">
                <div className="text-3xl mb-1">{item.icon}</div>
                <p className="text-sm font-bold text-charcoal">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 4: ÇÖZÜM ──────────────────────────────────────────── */}
      <section className="py-6 bg-gradient-to-b from-red-50 to-white">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Çözüm</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Allorea Serum Nasıl Çalışır?</h2>
          </div>
          <div className="space-y-2 text-nude-700">
            {product.solutionText?.split('\n').map((para, i) => {
              if (!para.trim()) return null
              if (para.startsWith('**') && para.endsWith('**'))
                return <p key={i} className="font-bold text-charcoal text-base lg:text-lg">{para.slice(2,-2)}</p>
              if (para.startsWith('- '))
                return <div key={i} className="flex items-start gap-2"><CheckCircle size={14} className="text-red-500 shrink-0 mt-0.5"/><span className="text-sm lg:text-base">{para.slice(2)}</span></div>
              return <p key={i} className="text-sm lg:text-base leading-relaxed">{para}</p>
            })}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{n:'%47',text:'Dökülme azalması',sub:'4. haftada'},{n:'%63',text:'Yeni tüy çıkışı',sub:'8. haftada'},{n:'%31',text:'Yoğunluk artışı',sub:'3. ayda'}].map(stat => (
              <div key={stat.n} className="text-center p-4 bg-white border-2 border-red-200 hover:shadow-md transition-shadow">
                <div className="text-4xl font-black text-red-600">{stat.n}</div>
                <p className="text-xs font-bold text-charcoal mt-1 leading-tight">{stat.text}</p>
                <p className="text-[10px] text-nude-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 5: BEFORE / AFTER ─────────────────────────────────── */}
      <section className="py-6 bg-white">
        <div className="container-main max-w-lg">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Gerçek Sonuçlar</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Farkı Kendiniz Görün</h2>
            <p className="text-sm text-nude-500 mt-1">← Parmağınızla veya mouseyla sürükleyin →</p>
          </div>
          <BeforeAfterSlider
            beforeUrl="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80"
            afterUrl="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
          />
          <p className="text-center text-[11px] text-nude-400 mt-2">* Bireysel sonuçlar farklılık gösterebilir. 8 haftalık kullanım sonucu.</p>
        </div>
      </section>

      {/* ─── BÖLÜM 6: KULLANIM TALİMATI ──────────────────────────────── */}
      <section className="py-6 bg-nude-50">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Nasıl Kullanılır</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Günde 5 Dakika Yeterli</h2>
          </div>
          <div className="space-y-2">
            {product.howToUse.map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-4 border border-nude-100 hover:shadow-sm transition-shadow">
                <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center text-sm font-black shrink-0">{i+1}</div>
                <p className="text-sm text-nude-700 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BÖLÜM 7: MÜŞTERİ YORUMLARI ─────────────────────────────── */}
      <section className="py-6 bg-white" id="yorumlar">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Müşteri Yorumları</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">
              {product.reviews.length.toLocaleString('tr-TR')}+ Mutlu Müşteri
            </h2>
          </div>
          <ReviewList reviews={product.reviews} productName={product.name} />
        </div>
      </section>

      {/* ─── BÖLÜM 8: SSS ─────────────────────────────────────────────── */}
      <section className="py-6 bg-nude-50">
        <div className="container-main max-w-2xl">
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Sık Sorulan Sorular</span>
            <h2 className="font-display text-2xl lg:text-3xl font-light text-charcoal mt-1">Aklınızdaki Sorular</h2>
          </div>
          <FaqAccordion faqs={product.faqs} />
        </div>
      </section>

      {/* ─── BÖLÜM 9: TEKRAR CTA ─────────────────────────────────────── */}
      <section className="py-6 bg-charcoal text-white">
        <div className="container-main max-w-2xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-light mb-2">Hâlâ Bekliyor musunuz?</h2>
          <p className="text-white/70 text-sm mb-1">{product.tagline}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <StarRow rating={5} size={16} />
            <span className="text-white/80 text-sm">{product.reviews.length} kişi zaten sonuç aldı</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4">
            {product.bundles.map(b => (
              <button key={b.id}
                onClick={() => { setSelectedBundle(b.id); window.scrollTo({ top:0, behavior:'smooth' }) }}
                className={cn('px-5 py-3 border-2 text-sm font-bold transition-all',
                  b.isMostPopular ? 'bg-red-600 border-red-600 text-white' : 'border-white/30 text-white hover:border-white')}>
                {b.label} — {b.price.toLocaleString('tr-TR')}₺
                {b.discountPercent > 0 && <span className="ml-1 text-red-300 text-xs">(%{b.discountPercent})</span>}
              </button>
            ))}
          </div>
          <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
            className="bg-red-600 text-white font-black py-5 px-10 text-lg hover:bg-red-700 transition-colors shadow-xl w-full sm:w-auto">
            HEMEN SİPARİŞ VER →
          </button>
          <p className="text-white/40 text-xs mt-3">30 gün para iade garantisi · Kapıda ödeme · Hızlı kargo</p>
        </div>
      </section>

      {/* Mobil sticky */}
      <StickyAddToCart
        price={bundle.price}
        comparePrice={bundle.comparePrice}
        bundleLabel={bundle.label}
        onAdd={handleAddToCart}
        inStock={product.stock > 0}
        adding={adding}
        productName={product.name}
      />
    </div>
  )
}
