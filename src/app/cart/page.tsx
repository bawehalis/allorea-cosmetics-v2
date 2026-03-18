'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const [coupon,        setCoupon]        = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError,   setCouponError]   = useState('')
  const [discountRate,  setDiscountRate]  = useState(0)

  const total    = subtotal()
  const shipping = total >= 299 ? 0 : 29.90
  const discount = couponApplied ? Math.round(total * discountRate * 100) / 100 : 0
  const tax      = (total - discount) * 0.18
  const orderTotal = total - discount + shipping + tax

  const applyCoupon = async () => {
    const code = coupon.toUpperCase().trim()
    if (!code) return

    const res  = await fetch('/api/checkout/validate-coupon', {
      method:  'POST',
      headers: { 'Content-Type':'application/json' },
      body:    JSON.stringify({ code, subtotal: total }),
    })
    const json = await res.json()

    if (!res.ok) {
      setCouponError(json.error || 'Geçersiz kupon kodu')
      return
    }

    setCouponApplied(true)
    setCouponError('')
    if (json.data?.type === 'PERCENTAGE') {
      setDiscountRate(json.data.value / 100)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-nude-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-nude-400" />
        </div>
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Çantanız Boş</h1>
        <p className="font-body text-nude-500 mb-8 max-w-sm leading-relaxed">
          Henüz ürün eklemediniz. Koleksiyonlarımızı keşfedin!
        </p>
        <Link href="/shop" className="btn-primary gap-2 rounded-2xl">
          Alışverişe Başla <ArrowRight size={16}/>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-6">
          <h1 className="font-display text-3xl font-light text-charcoal">Alışveriş Çantası</h1>
          <p className="font-body text-sm text-nude-500 mt-1">
            {items.length} ürün · {items.reduce((s,i)=>s+i.quantity,0)} adet
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Ürün listesi */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-nude-100 overflow-hidden">
              {/* Başlık satırı */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-nude-100 font-body text-xs tracking-wider uppercase text-nude-400">
                <div className="col-span-6">Ürün</div>
                <div className="col-span-2 text-center">Fiyat</div>
                <div className="col-span-2 text-center">Adet</div>
                <div className="col-span-2 text-right">Toplam</div>
              </div>

              <ul className="divide-y divide-nude-100">
                {items.map(item => (
                  <li key={item.id} className="grid grid-cols-12 gap-4 p-5 items-center">
                    {/* Görsel + İsim */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                      <Link href={`/product/${item.slug}`} className="shrink-0">
                        <div className="relative w-18 h-20 rounded-xl overflow-hidden bg-nude-50">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="72px"/>
                        </div>
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/product/${item.slug}`}
                          className="font-body text-sm font-semibold text-charcoal hover:text-brand-600 transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        {item.variant && (
                          <span className="inline-block font-body text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full mt-1 font-semibold">
                            {item.variant}
                          </span>
                        )}
                        <button onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 font-body text-xs text-nude-400 hover:text-red-500 transition-colors mt-1.5">
                          <Trash2 size={11}/> Kaldır
                        </button>
                      </div>
                    </div>

                    {/* Fiyat */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <span className="sm:hidden font-body text-xs text-nude-400 block mb-0.5">Fiyat</span>
                      <span className="font-body text-sm font-bold text-charcoal">
                        {item.price.toLocaleString('tr-TR')}₺
                      </span>
                    </div>

                    {/* Adet */}
                    <div className="col-span-4 sm:col-span-2 flex justify-center">
                      <div className="flex items-center border border-nude-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity-1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors">
                          <Minus size={12}/>
                        </button>
                        <span className="w-8 text-center font-body text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity+1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40">
                          <Plus size={12}/>
                        </button>
                      </div>
                    </div>

                    {/* Toplam */}
                    <div className="col-span-4 sm:col-span-2 text-right">
                      <span className="sm:hidden font-body text-xs text-nude-400 block mb-0.5">Toplam</span>
                      <span className="font-body text-sm font-black text-charcoal">
                        {(item.price * item.quantity).toLocaleString('tr-TR')}₺
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-4 border-t border-nude-100 flex items-center justify-between">
                <Link href="/shop" className="font-body text-sm text-nude-500 hover:text-charcoal transition-colors flex items-center gap-2">
                  ← Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>

          {/* Sipariş özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-nude-100 p-6 sticky top-24 space-y-5">
              <h2 className="font-display text-2xl font-light text-charcoal">Sipariş Özeti</h2>

              {/* Tutar detayı */}
              <div className="space-y-2.5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">Ara Toplam</span>
                  <span className="font-semibold">{total.toLocaleString('tr-TR')}₺</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between font-body text-sm text-green-700">
                    <span>İndirim</span>
                    <span className="font-bold">-{discount.toLocaleString('tr-TR')}₺</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">Kargo</span>
                  <span className={cn('font-semibold', shipping===0 ? 'text-green-700' : 'text-charcoal')}>
                    {shipping===0 ? 'ÜCRETSİZ' : `${shipping.toFixed(2)}₺`}
                  </span>
                </div>
                {total < 299 && (
                  <p className="text-xs text-brand-600 bg-brand-50 rounded-xl px-3 py-2">
                    💡 {(299-total).toFixed(2)}₺ daha ekleyin, kargo ücretsiz!
                  </p>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">KDV (%18)</span>
                  <span className="font-semibold">{tax.toFixed(2)}₺</span>
                </div>
                <div className="pt-3 border-t border-nude-100 flex justify-between font-body font-black text-lg">
                  <span className="text-charcoal">Toplam</span>
                  <span className="text-charcoal">{orderTotal.toFixed(2)}₺</span>
                </div>
              </div>

              {/* Kupon */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400"/>
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                      placeholder="Kupon kodu"
                      className="input-field pl-8 text-sm py-2.5 rounded-xl"
                    />
                  </div>
                  <button onClick={applyCoupon}
                    className="btn-outline text-xs px-4 py-2.5 rounded-xl">
                    Uygula
                  </button>
                </div>
                {couponError   && <p className="font-body text-xs text-red-500 mt-1">{couponError}</p>}
                {couponApplied && <p className="font-body text-xs text-green-600 mt-1">✓ Kupon uygulandı!</p>}
              </div>

              <Link href="/checkout"
                className="block w-full bg-brand-600 text-white font-black py-4 rounded-2xl text-center text-base hover:bg-brand-700 active:scale-[0.99] transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2">
                Ödemeye Geç <ArrowRight size={18}/>
              </Link>

              <div className="flex items-center gap-1.5 justify-center text-nude-500">
                <ShieldCheck size={13} className="text-brand-400"/>
                <span className="font-body text-xs">Güvenli ödeme · SSL şifreli</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {['VISA','MC','AMEX','PayPal'].map(p => (
                  <div key={p} className="px-2 py-1 bg-nude-100 rounded text-[9px] font-body font-bold text-nude-500">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
