'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronDown, Lock, Check, CreditCard, Truck,
  MessageCircle, Shield, ChevronRight,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

type Step      = 'information' | 'shipping' | 'payment'
type PayMethod = 'card' | 'cod' | 'whatsapp'

const COUNTRIES = ['Türkiye','United States','United Kingdom','Germany','France']
const SHIPPING  = [
  { id:'standard', label:'Standart Kargo', desc:'3–5 iş günü',   price:29.90 },
  { id:'express',  label:'Ekspres Kargo',  desc:'1–2 iş günü',   price:59.90 },
]

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()

  const [step,       setStep]       = useState<Step>('information')
  const [payMethod,  setPayMethod]  = useState<PayMethod>('card')
  const [isPlacing,  setIsPlacing]  = useState(false)
  const [orderDone,  setOrderDone]  = useState(false)
  const [shipMethod, setShipMethod] = useState('standard')

  const [form, setForm] = useState({
    email:'', firstName:'', lastName:'', address1:'', address2:'',
    city:'', state:'', postalCode:'', country:'Türkiye', phone:'',
  })
  const [card, setCard] = useState({ number:'', name:'', expiry:'', cvv:'' })

  const subtot    = subtotal()
  const freeShip  = subtot >= 299
  const shipPrice = freeShip ? 0 : (SHIPPING.find(s => s.id === shipMethod)?.price || 29.90)
  const codFee    = payMethod === 'cod' ? 15 : 0
  const grandTotal = subtot + shipPrice + codFee

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const fmtCard   = (v: string) => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)
  const fmtExpiry = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').slice(0,5)

  const handleOrder = async () => {
    setIsPlacing(true)

    if (payMethod === 'whatsapp') {
      const lines = items.map(i => `• ${i.name} (${i.variant || '1 adet'}) x${i.quantity} — ${(i.price * i.quantity).toLocaleString('tr-TR')}₺`)
      const msg   = encodeURIComponent(
        `Merhaba, sipariş vermek istiyorum!\n\n${lines.join('\n')}\n\nToplam: ${grandTotal.toLocaleString('tr-TR')}₺\nAdres: ${form.city}, ${form.country}`
      )
      window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '905001234567'}?text=${msg}`, '_blank')
      setIsPlacing(false)
      return
    }

    await new Promise(r => setTimeout(r, 2000))
    setOrderDone(true)
    clearCart()
  }

  /* ── Sipariş tamamlandı ─────────────────────────────────────────────── */
  if (orderDone) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl font-light text-charcoal mb-2">Sipariş Alındı!</h1>
          <p className="font-body text-nude-500 mb-2">Teşekkürler {form.firstName},</p>
          {payMethod === 'cod' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
              <p className="text-sm font-black text-amber-800">💵 Kapıda Ödeme Seçildi</p>
              <p className="text-xs text-amber-700 mt-1">Ürününüz teslimatta ödeme alınarak gönderilecektir.</p>
            </div>
          )}
          <p className="text-sm text-nude-400 mb-6">Sipariş numaranız kısa sürede {form.email} adresine gönderilecek.</p>
          <div className="bg-white border border-nude-100 rounded-2xl p-5 mb-6 text-left">
            <p className="text-xs text-nude-400 uppercase tracking-wider mb-1">Sipariş No</p>
            <p className="font-display text-2xl font-light text-charcoal">
              ALR-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
          <Link href="/" className="btn-primary w-full justify-center rounded-2xl py-4">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* ── Sol: Form ────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-8 lg:px-12 py-8 bg-white order-2 lg:order-1">
          <Link href="/" className="inline-block mb-8">
            <span className="font-display text-2xl font-light tracking-[0.2em] text-charcoal">ALLOREA</span>
          </Link>

          {/* Adım göstergesi */}
          <div className="flex items-center gap-2 mb-7 text-sm">
            {(['information','shipping','payment'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s === 'information') setStep('information')
                    if (s === 'shipping' && step === 'payment') setStep('shipping')
                  }}
                  className={cn(
                    'font-semibold transition-colors',
                    step === s ? 'text-charcoal' : 'text-nude-400 hover:text-nude-600'
                  )}
                >
                  {s === 'information' ? 'Bilgiler' : s === 'shipping' ? 'Kargo' : 'Ödeme'}
                </button>
                {i < 2 && <ChevronRight size={13} className="text-nude-300" />}
              </div>
            ))}
          </div>

          {/* ADIM 1 */}
          {step === 'information' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-light text-charcoal">İletişim Bilgileri</h2>
              <input type="email" placeholder="E-posta" value={form.email}
                onChange={e => upd('email', e.target.value)} className="input-field" />
              <input type="tel" placeholder="Telefon" value={form.phone}
                onChange={e => upd('phone', e.target.value)} className="input-field" />

              <h2 className="font-display text-xl font-light text-charcoal pt-2">Teslimat Adresi</h2>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Ad" value={form.firstName}
                  onChange={e => upd('firstName', e.target.value)} className="input-field" />
                <input placeholder="Soyad" value={form.lastName}
                  onChange={e => upd('lastName', e.target.value)} className="input-field" />
              </div>
              <input placeholder="Adres" value={form.address1}
                onChange={e => upd('address1', e.target.value)} className="input-field" />
              <input placeholder="Daire, kat vb. (opsiyonel)" value={form.address2}
                onChange={e => upd('address2', e.target.value)} className="input-field" />
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Şehir" value={form.city}
                  onChange={e => upd('city', e.target.value)} className="input-field" />
                <input placeholder="İlçe" value={form.state}
                  onChange={e => upd('state', e.target.value)} className="input-field" />
                <input placeholder="Posta kodu" value={form.postalCode}
                  onChange={e => upd('postalCode', e.target.value)} className="input-field" />
              </div>
              <select value={form.country} onChange={e => upd('country', e.target.value)} className="input-field">
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>

              <button
                onClick={() => setStep('shipping')}
                disabled={!form.email || !form.firstName || !form.address1}
                className="w-full btn-primary justify-center rounded-2xl py-4 disabled:opacity-50 text-base font-black mt-2"
              >
                Kargoya Devam →
              </button>
            </div>
          )}

          {/* ADIM 2 */}
          {step === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-light text-charcoal">Kargo Yöntemi</h2>
              <div className="space-y-3">
                {SHIPPING.map(m => (
                  <label key={m.id}
                    className={cn(
                      'flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all',
                      shipMethod === m.id ? 'border-brand-600 bg-brand-50' : 'border-nude-200 hover:border-nude-400'
                    )}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={m.id}
                        checked={shipMethod === m.id} onChange={() => setShipMethod(m.id)}
                        className="accent-brand-600" />
                      <div>
                        <p className="font-bold text-sm text-charcoal">{m.label}</p>
                        <p className="text-xs text-nude-400">{m.desc}</p>
                      </div>
                    </div>
                    <span className="font-black text-sm">
                      {freeShip && m.id === 'standard' ? 'ÜCRETSİZ' : `${m.price.toFixed(2)}₺`}
                    </span>
                  </label>
                ))}
              </div>
              {!freeShip && (
                <p className="text-xs text-brand-600 bg-brand-50 rounded-xl px-4 py-2.5">
                  💡 299₺ üzeri siparişlerde standart kargo ücretsiz!
                </p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep('information')} className="btn-outline flex-1 rounded-2xl">← Geri</button>
                <button onClick={() => setStep('payment')} className="btn-primary flex-1 justify-center rounded-2xl py-4 font-black">Ödemeye Geç →</button>
              </div>
            </div>
          )}

          {/* ADIM 3 */}
          {step === 'payment' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-light text-charcoal">Ödeme Yöntemi</h2>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id:'card'      as PayMethod, Icon:CreditCard,    label:'Kredi / Banka Kartı', sub:'Güvenli SSL şifreli' },
                  { id:'cod'       as PayMethod, Icon:Truck,          label:'Kapıda Ödeme',        sub:'+15₺ ek ücret — teslimatta öde' },
                  { id:'whatsapp'  as PayMethod, Icon:MessageCircle,  label:'WhatsApp ile Sipariş', sub:'Manuel onay, WhatsApp\'a yönlendirir' },
                ].map(({ id, Icon, label, sub }) => (
                  <label key={id}
                    className={cn(
                      'flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all',
                      payMethod === id ? 'border-brand-600 bg-brand-50' : 'border-nude-200 hover:border-nude-400'
                    )}>
                    <input type="radio" name="pay" value={id}
                      checked={payMethod === id} onChange={() => setPayMethod(id)}
                      className="accent-brand-600" />
                    <Icon size={20} className="text-charcoal shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-charcoal">{label}</p>
                      <p className="text-xs text-nude-400">{sub}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Kart formu */}
              {payMethod === 'card' && (
                <div className="space-y-3 p-4 bg-nude-50 rounded-2xl border border-nude-200">
                  <div className="relative">
                    <input placeholder="Kart numarası" maxLength={19}
                      value={card.number} onChange={e => setCard(p => ({ ...p, number:fmtCard(e.target.value) }))}
                      className="input-field pr-12" />
                    <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400" />
                  </div>
                  <input placeholder="Kart üzerindeki isim"
                    value={card.name} onChange={e => setCard(p => ({ ...p, name:e.target.value }))}
                    className="input-field" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="AA/YY" maxLength={5}
                      value={card.expiry} onChange={e => setCard(p => ({ ...p, expiry:fmtExpiry(e.target.value) }))}
                      className="input-field" />
                    <input placeholder="CVV" maxLength={4}
                      value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv:e.target.value.replace(/\D/g,'').slice(0,4) }))}
                      className="input-field" />
                  </div>
                </div>
              )}

              {payMethod === 'cod' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-sm font-black text-amber-800">📦 Kapıda Ödeme Bilgisi</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Ürününüz kargoya verilir, teslimatta nakit veya kart ile ödeme yaparsınız. +15₺ ek ücret uygulanır.
                  </p>
                </div>
              )}

              {payMethod === 'whatsapp' && (
                <div className="bg-[#e7f8ee] border border-[#25D366]/30 rounded-2xl p-4">
                  <p className="text-sm font-black text-[#128C7E]">💬 WhatsApp Sipariş Bilgisi</p>
                  <p className="text-xs text-[#128C7E]/80 mt-1">
                    Siparişiniz WhatsApp'a yönlendirilecek. Müşteri hizmetlerimiz sizi arayarak onaylayacak.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-nude-500">
                <Lock size={12} />
                <span className="text-xs">Bilgileriniz 256-bit SSL ile korunmaktadır</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('shipping')} className="btn-outline flex-1 rounded-2xl">← Geri</button>
                <button onClick={handleOrder} disabled={isPlacing}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all',
                    payMethod === 'whatsapp'
                      ? 'bg-[#25D366] text-white hover:bg-[#1eb858]'
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25',
                  )}>
                  {isPlacing ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> İşleniyor...</>
                  ) : payMethod === 'whatsapp' ? (
                    <><MessageCircle size={16} /> WhatsApp'a Gönder</>
                  ) : (
                    <><Lock size={14} /> Siparişi Tamamla · {grandTotal.toLocaleString('tr-TR')}₺</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sağ: Özet ────────────────────────────────────────────────── */}
        <div className="bg-nude-50 px-4 sm:px-8 lg:px-12 py-8 border-l border-nude-200 order-1 lg:order-2">
          <h3 className="text-sm font-black text-nude-500 uppercase tracking-widest mb-5">Sipariş Özeti</h3>

          {/* Ürünler */}
          <div className="space-y-3 mb-5">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-16 h-16 bg-white border border-nude-200 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-charcoal text-white text-[10px] rounded-full flex items-center justify-center font-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-charcoal truncate">{item.name}</p>
                  {item.variant && <p className="text-xs text-nude-400">{item.variant}</p>}
                </div>
                <span className="text-sm font-black text-charcoal shrink-0">
                  {(item.price * item.quantity).toLocaleString('tr-TR')}₺
                </span>
              </div>
            ))}
          </div>

          {/* Satır toplamları */}
          <div className="space-y-2 pt-4 border-t border-nude-200 text-sm">
            <div className="flex justify-between">
              <span className="text-nude-600">Ara Toplam</span>
              <span className="font-semibold">{subtot.toLocaleString('tr-TR')}₺</span>
            </div>
            <div className="flex justify-between">
              <span className="text-nude-600">Kargo</span>
              <span className={cn('font-semibold', freeShip ? 'text-green-600' : '')}>
                {freeShip ? 'ÜCRETSİZ' : `${shipPrice.toFixed(2)}₺`}
              </span>
            </div>
            {payMethod === 'cod' && (
              <div className="flex justify-between text-amber-700">
                <span>Kapıda Ödeme</span>
                <span className="font-semibold">+15.00₺</span>
              </div>
            )}
          </div>

          <div className="flex justify-between font-black text-lg mt-4 pt-4 border-t border-nude-200">
            <span>Toplam</span>
            <span>{grandTotal.toLocaleString('tr-TR')}₺</span>
          </div>

          {/* Mini güven */}
          <div className="mt-5 space-y-2">
            {[
              { icon:Shield,    text:'SSL Güvenli Ödeme' },
              { icon:Truck,     text:'1–3 iş günü kargo' },
              { icon:Check,     text:'30 gün iade garantisi' },
            ].map(({ icon:Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-nude-600">
                <Icon size={13} className="text-brand-500 shrink-0" />
                <span className="text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
