'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Lock, Check, CreditCard, Smartphone } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

type Step = 'information' | 'shipping' | 'payment'

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'Spain', 'Italy', 'Japan', 'Singapore']
const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Shipping', desc: '5–7 business days', price: 7.99 },
  { id: 'express', label: 'Express Shipping', desc: '2–3 business days', price: 18.99 },
  { id: 'overnight', label: 'Overnight Shipping', desc: 'Next business day', price: 34.99 },
]

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore()
  const [step, setStep] = useState<Step>('information')
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address1: '', address2: '', city: '', state: '', postalCode: '', country: 'United States',
    phone: '', saveInfo: false,
  })
  const [selectedShipping, setSelectedShipping] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const total = subtotal()
  const shipping = total >= 75 ? 0 : SHIPPING_METHODS.find(s => s.id === selectedShipping)?.price || 7.99
  const tax = total * 0.08
  const orderTotal = total + shipping + tax

  const updateForm = (key: string, value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))
  const updateCard = (key: string, value: string) => setCard(prev => ({ ...prev, [key]: value }))

  const formatCardNumber = (v: string) => v.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5)

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    await new Promise(r => setTimeout(r, 2000))
    setOrderComplete(true)
    clearCart()
  }

  const STEPS: { key: Step; label: string }[] = [
    { key: 'information', label: 'Information' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
  ]

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="font-display text-4xl font-light text-charcoal mb-3">Sipariş Onaylandı!</h1>
          <p className="font-body text-nude-500 mb-2">Alışverişiniz için teşekkür ederiz, {form.firstName}.</p>
          <p className="font-body text-sm text-nude-400 mb-8">Onay e-postası şu adrese gönderildi: <strong>{form.email}</strong></p>
          <div className="bg-white border border-nude-100 p-5 mb-8 text-left">
            <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">Sipariş numarası</p>
            <p className="font-display text-2xl font-light text-charcoal">ALR-{Date.now().toString(36).toUpperCase()}</p>
          </div>
          <Link href="/shop" className="btn-primary w-full justify-center">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left — Form */}
        <div className="px-4 sm:px-8 lg:px-16 py-10 lg:py-16 bg-white">
          {/* Logo */}
          <Link href="/" className="inline-block mb-10">
            <span className="font-display text-2xl font-light tracking-[0.2em] text-charcoal">ALLOREA</span>
          </Link>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.key === 'shipping' && step === 'payment') setStep('shipping')
                    if (s.key === 'information') setStep('information')
                  }}
                  className={cn(
                    'font-body text-sm transition-colors',
                    step === s.key ? 'text-charcoal font-medium' : 'text-nude-400 hover:text-nude-600'
                  )}
                >
                  {s.label}
                </button>
                {i < STEPS.length - 1 && <ChevronDown size={13} className="text-nude-300 rotate-[-90deg]" />}
              </div>
            ))}
          </div>

          {/* INFORMATION STEP */}
          {step === 'information' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-light text-charcoal mb-5">İletişim Bilgileri</h2>
                <input type="email" placeholder="Email address" value={form.email}
                  onChange={e => updateForm('email', e.target.value)}
                  className="input-field" />
              </div>

              <div>
                <h2 className="font-display text-2xl font-light text-charcoal mb-5">Teslimat Adresi</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="First name" value={form.firstName} onChange={e => updateForm('firstName', e.target.value)} className="input-field" />
                    <input placeholder="Last name" value={form.lastName} onChange={e => updateForm('lastName', e.target.value)} className="input-field" />
                  </div>
                  <input placeholder="Address" value={form.address1} onChange={e => updateForm('address1', e.target.value)} className="input-field" />
                  <input placeholder="Apartment, suite, etc. (optional)" value={form.address2} onChange={e => updateForm('address2', e.target.value)} className="input-field" />
                  <div className="grid grid-cols-3 gap-3">
                    <input placeholder="City" value={form.city} onChange={e => updateForm('city', e.target.value)} className="input-field" />
                    <input placeholder="State" value={form.state} onChange={e => updateForm('state', e.target.value)} className="input-field" />
                    <input placeholder="ZIP code" value={form.postalCode} onChange={e => updateForm('postalCode', e.target.value)} className="input-field" />
                  </div>
                  <select value={form.country} onChange={e => updateForm('country', e.target.value)} className="input-field">
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input placeholder="Phone (optional)" value={form.phone} onChange={e => updateForm('phone', e.target.value)} className="input-field" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.saveInfo} onChange={e => updateForm('saveInfo', e.target.checked)}
                  className="w-4 h-4 accent-brand-600" />
                <span className="font-body text-sm text-nude-600">Bilgilerimi kaydet (hızlı ödeme için)</span>
              </label>

              <button
                onClick={() => setStep('shipping')}
                disabled={!form.email || !form.firstName || !form.address1}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                Kargoya Devam
              </button>
            </div>
          )}

          {/* SHIPPING STEP */}
          {step === 'shipping' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-light text-charcoal mb-5">Kargo Yöntemi</h2>
              <div className="space-y-3">
                {SHIPPING_METHODS.map(method => (
                  <label key={method.id} className={cn(
                    'flex items-center justify-between p-4 border cursor-pointer transition-all',
                    selectedShipping === method.id ? 'border-charcoal bg-nude-50' : 'border-nude-200 hover:border-nude-400'
                  )}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={method.id} checked={selectedShipping === method.id}
                        onChange={() => setSelectedShipping(method.id)} className="accent-brand-600" />
                      <div>
                        <p className="font-body text-sm font-medium text-charcoal">{method.label}</p>
                        <p className="font-body text-xs text-nude-400">{method.desc}</p>
                      </div>
                    </div>
                    <span className="font-body text-sm font-medium text-charcoal">
                      {total >= 75 && method.id === 'standard' ? 'FREE' : formatPrice(method.price)}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('information')} className="btn-outline flex-1">← Back</button>
                <button onClick={() => setStep('payment')} className="btn-primary flex-1">Ödemeye Devam</button>
              </div>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === 'payment' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-light text-charcoal mb-5">Payment</h2>

              {/* Payment method selector */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card' as const, label: 'Card', icon: CreditCard },
                  { id: 'apple' as const, label: 'Apple Pay', icon: Smartphone },
                  { id: 'paypal' as const, label: 'PayPal', icon: CreditCard },
                ].map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setPaymentMethod(id)}
                    className={cn('flex flex-col items-center gap-2 p-3 border text-sm font-body transition-all',
                      paymentMethod === id ? 'border-charcoal bg-charcoal text-white' : 'border-nude-200 hover:border-nude-400 text-charcoal')}>
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input placeholder="Card number" value={card.number}
                      onChange={e => updateCard('number', formatCardNumber(e.target.value))}
                      maxLength={19} className="input-field pr-12" />
                    <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400" />
                  </div>
                  <input placeholder="Name on card" value={card.name}
                    onChange={e => updateCard('name', e.target.value)} className="input-field" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" value={card.expiry}
                      onChange={e => updateCard('expiry', formatExpiry(e.target.value))}
                      maxLength={5} className="input-field" />
                    <input placeholder="CVV" value={card.cvv}
                      onChange={e => updateCard('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="input-field" />
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="bg-nude-50 border border-nude-200 p-8 text-center">
                  <p className="font-body text-sm text-nude-600">
                    You will be redirected to {paymentMethod === 'apple' ? 'Apple Pay' : 'PayPal'} to complete your payment.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-nude-500">
                <Lock size={13} />
                <span className="font-body text-xs">Ödeme bilgileriniz şifrelenmiş ve güvende</span>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('shipping')} className="btn-outline flex-1">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="btn-primary flex-1 gap-2"
                >
                  {isPlacing ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> İşleniyor...</>
                  ) : (
                    <><Lock size={14} /> Siparişi Onayla · {formatPrice(orderTotal)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div className="bg-nude-50 px-4 sm:px-8 lg:px-16 py-10 lg:py-16 border-l border-nude-200">
          <h3 className="font-body text-sm font-medium text-nude-500 uppercase tracking-wider mb-6">Order Summary</h3>

          {/* Items */}
          <div className="space-y-5 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-20 bg-white border border-nude-200 overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-nude-600 text-white text-[10px] rounded-full flex items-center justify-center font-body">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-charcoal truncate">{item.name}</p>
                  {item.variant && <p className="font-body text-xs text-nude-400">{item.variant}</p>}
                </div>
                <span className="font-body text-sm font-medium text-charcoal shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="divider mb-5" />

          <div className="space-y-3 mb-5">
            <div className="flex justify-between font-body text-sm">
              <span className="text-nude-600">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-nude-600">Shipping</span>
              <span className={shipping === 0 ? 'text-green-700' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-nude-600">Vergi (%8)</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="divider mb-5" />

          <div className="flex justify-between font-body font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
