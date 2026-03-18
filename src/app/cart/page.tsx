'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')

  const total = subtotal()
  const shipping = total >= 75 ? 0 : 7.99
  const discount = couponApplied ? total * 0.1 : 0
  const tax = (total - discount) * 0.08
  const orderTotal = total - discount + shipping + tax

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'ALLOREA15' || coupon.toUpperCase() === 'ALLOREA30') {
      setCouponApplied(true)
      setCouponError('')
    } else {
      setCouponError('Geçersiz kupon kodu')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-nude-100 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-nude-400" />
        </div>
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Çantanız boş</h1>
        <p className="font-body text-nude-500 mb-8 max-w-sm">Henüz çantanıza ürün eklemediniz. Koleksiyonlarımızı keşfedin!</p>
        <Link href="/shop" className="btn-primary gap-2">
          Alışverişe Devam <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <h1 className="font-display text-4xl font-light text-charcoal">Alışveriş Çantası</h1>
          <p className="font-body text-sm text-nude-500 mt-1">{items.length} {items.length === 1 ? 'ürün' : 'ürün'}</p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-nude-100">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-nude-100 font-body text-xs tracking-wider uppercase text-nude-400">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <ul className="divide-y divide-nude-100">
                {items.map(item => (
                  <li key={item.id} className="grid grid-cols-12 gap-4 p-5 sm:p-6 items-center">
                    {/* Image + Name */}
                    <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                      <Link href={`/product/${item.slug}`} className="shrink-0">
                        <div className="relative w-20 h-24 overflow-hidden bg-nude-50">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        </div>
                      </Link>
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors">
                          {item.name}
                        </Link>
                        {item.variant && <p className="font-body text-xs text-nude-400 mt-0.5">{item.variant}</p>}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 font-body text-xs text-nude-400 hover:text-red-500 transition-colors mt-2"
                        >
                          <Trash2 size={12} /> Kaldır
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-4 sm:col-span-2 text-center">
                      <span className="sm:hidden font-body text-xs text-nude-400 mr-2">Price:</span>
                      <span className="font-body text-sm text-charcoal">{formatPrice(item.price)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 sm:col-span-2 flex justify-center">
                      <div className="flex items-center border border-nude-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors text-charcoal">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-body text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-4 sm:col-span-2 text-right">
                      <span className="sm:hidden font-body text-xs text-nude-400 mr-2">Total:</span>
                      <span className="font-body text-sm font-semibold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="px-6 py-4 border-t border-nude-100 flex items-center justify-between">
                <Link href="/shop" className="font-body text-sm text-nude-500 hover:text-charcoal transition-colors flex items-center gap-2">
                  ← Alışverişe Devam
                </Link>
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-nude-100 p-6 sticky top-24">
              <h2 className="font-display text-2xl font-light text-charcoal mb-6">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">Ara Toplam</span>
                  <span className="text-charcoal">{formatPrice(total)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between font-body text-sm text-green-700">
                    <span>İndirim (%10)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">Kargo</span>
                  <span className={cn(shipping === 0 ? 'text-green-700' : 'text-charcoal')}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-nude-600">Tahmini Vergi</span>
                  <span className="text-charcoal">{formatPrice(tax)}</span>
                </div>
                <div className="pt-3 border-t border-nude-100 flex justify-between font-body font-semibold text-base">
                  <span className="text-charcoal">Total</span>
                  <span className="text-charcoal">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400" />
                    <input
                      type="text"
                      value={coupon}
                      onChange={e => { setCoupon(e.target.value); setCouponError('') }}
                      placeholder="Coupon code"
                      className="input-field pl-9 text-sm py-2.5"
                    />
                  </div>
                  <button onClick={applyCoupon} className="btn-outline text-xs px-4 py-2.5">Apply</button>
                </div>
                {couponError && <p className="font-body text-xs text-red-500 mt-1">{couponError}</p>}
                {couponApplied && <p className="font-body text-xs text-green-600 mt-1">✓ Kupon uygulandı!</p>}
              </div>

              <Link href="/checkout" className="btn-primary w-full justify-center gap-2 text-sm">
                Ödemeye Geç <ArrowRight size={16} />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                  <div key={p} className="px-2 py-1 bg-nude-100 rounded text-[9px] font-body font-medium text-nude-500">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
