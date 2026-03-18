'use client'
import { useState } from 'react'
import { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock, Check } from 'lucide-react'

export const metadata = { title: 'İletişim' }

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-nude-100 py-16 border-b border-nude-200">
        <div className="container-main text-center">
          <p className="section-subtitle">Size Yardımcıyız</p>
          <h1 className="font-display text-5xl font-light text-charcoal">Bize Ulaşın</h1>
        </div>
      </div>

      <div className="container-main py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            {[
              { icon: Mail,  title: 'E-posta',           info: 'hello@allorea-cosmetics.com', sub: '24 saat içinde yanıt veririz' },
              { icon: Phone, title: 'Telefon',            info: '1-800-555-0192',             sub: 'Pzt–Cum 09:00–18:00' },
              { icon: MapPin,title: 'Genel Merkez',       info: '15 Rue du Faubourg',         sub: 'Paris, Fransa 75008' },
              { icon: Clock, title: 'Müşteri Hizmetleri', info: 'Pzt–Cum 09:00–18:00',       sub: 'Hafta sonu: 10:00–16:00' },
            ].map(({ icon: Icon, title, info, sub }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="font-body font-medium text-sm text-charcoal">{title}</p>
                  <p className="font-body text-sm text-charcoal mt-0.5">{info}</p>
                  <p className="font-body text-xs text-nude-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white p-8 border border-nude-100">
            <h2 className="font-display text-2xl font-light text-charcoal mb-6">Mesaj Gönderin</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check size={28} className="text-green-600" />
                </div>
                <h3 className="font-display text-2xl font-light text-charcoal mb-2">Mesajınız İletildi!</h3>
                <p className="font-body text-nude-500">24 saat içinde size döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">Ad Soyad *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" placeholder="Adınız Soyadınız" />
                  </div>
                  <div>
                    <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">E-posta *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className="input-field" placeholder="ornek@mail.com" />
                  </div>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">Konu</label>
                  <select value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} className="input-field">
                    <option value="">Konu seçin</option>
                    <option>Sipariş sorgulama</option>
                    <option>Ürün sorusu</option>
                    <option>İade ve değişim</option>
                    <option>İş birliği</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">Mesaj *</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} className="input-field resize-none" placeholder="Size nasıl yardımcı olabiliriz?" />
                </div>
                <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
                  {status === 'loading' ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
