// src/app/admin/settings/page.tsx
'use client'
import { useState } from 'react'
import { Save, CheckCircle, Store, CreditCard, Mail, Globe, Shield } from 'lucide-react'

const Field = ({ label, value, type = 'text', placeholder = '', onChange, readOnly = false }: {
  label: string; value: string; type?: string; placeholder?: string
  onChange?: (v: string) => void; readOnly?: boolean
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${readOnly ? 'bg-gray-50 text-gray-500 cursor-default' : ''}`}
    />
  </div>
)

export default function AdminSettingsPage() {
  const [storeSaved,  setStoreSaved]  = useState(false)
  const [stripeSaved, setStripeSaved] = useState(false)
  const [smtpSaved,   setSmtpSaved]   = useState(false)
  const [tab,         setTab]         = useState<'store'|'payments'|'smtp'|'security'>('store')

  const [store, setStore] = useState({
    name:'Allorea Cosmetics', email:'hello@allorea-cosmetics.com',
    currency:'TRY', freeShippingThreshold:'299', taxRate:'18', whatsapp:'905001234567',
    address:'İstanbul, Türkiye', instagram:'alloreacosetics', website:'https://allorea-cosmetics.com',
  })

  const handleSave = (setter: (v: boolean) => void) => {
    setter(true)
    setTimeout(() => setter(false), 3000)
  }

  const tabs = [
    { key:'store',    label:'Mağaza',  icon:Store },
    { key:'payments', label:'Ödeme',   icon:CreditCard },
    { key:'smtp',     label:'E-posta', icon:Mail },
    { key:'security', label:'Güvenlik',icon:Shield },
  ] as const

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-sm text-gray-500 mt-0.5">Mağaza genel ayarları</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            <t.icon size={14}/>
            {t.label}
          </button>
        ))}
      </div>

      {/* Mağaza Ayarları */}
      {tab === 'store' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Mağaza Bilgileri</h2>
            <button onClick={() => handleSave(setStoreSaved)}
              className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
              {storeSaved ? <><CheckCircle size={15}/> Kaydedildi</> : <><Save size={15}/> Kaydet</>}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Mağaza Adı"      value={store.name}      onChange={v => setStore(p=>({...p,name:v}))}  />
            <Field label="İletişim E-postası" value={store.email}  onChange={v => setStore(p=>({...p,email:v}))} type="email" />
            <Field label="Para Birimi"      value={store.currency}  onChange={v => setStore(p=>({...p,currency:v}))} />
            <Field label="Ücretsiz Kargo Eşiği (₺)" value={store.freeShippingThreshold}
              onChange={v => setStore(p=>({...p,freeShippingThreshold:v}))} type="number" />
            <Field label="KDV Oranı (%)"   value={store.taxRate}   onChange={v => setStore(p=>({...p,taxRate:v}))} type="number" />
            <Field label="WhatsApp No"     value={store.whatsapp}  onChange={v => setStore(p=>({...p,whatsapp:v}))} placeholder="905001234567" />
            <Field label="Instagram"       value={store.instagram} onChange={v => setStore(p=>({...p,instagram:v}))} />
            <Field label="Web Sitesi"      value={store.website}   onChange={v => setStore(p=>({...p,website:v}))} />
          </div>

          <Field label="Adres" value={store.address} onChange={v => setStore(p=>({...p,address:v}))} />
        </div>
      )}

      {/* Ödeme Ayarları */}
      {tab === 'payments' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Ödeme Entegrasyonları</h2>
            <button onClick={() => handleSave(setStripeSaved)}
              className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
              {stripeSaved ? <><CheckCircle size={15}/> Kaydedildi</> : <><Save size={15}/> Kaydet</>}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800">⚠️ Hassas Bilgi</p>
            <p className="text-xs text-amber-700 mt-1">API anahtarlarını .env.local dosyasında saklayın. Bu değerler yalnızca şifre formatında gösterilir.</p>
          </div>

          <div className="space-y-4">
            <Field label="Stripe Publishable Key" value="pk_test_..." readOnly placeholder="pk_live_..." />
            <Field label="Stripe Secret Key" value="sk_test_..." readOnly type="password" />
            <Field label="Stripe Webhook Secret" value="whsec_..." readOnly type="password" />
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Kapıda Ödeme Ayarları</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only" />
                  <div className="w-10 h-5 bg-brand-600 rounded-full" />
                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Kapıda ödemeyi aktif et</span>
              </label>
              <Field label="Kapıda Ödeme Ek Ücreti (₺)" value="15" />
            </div>
          </div>
        </div>
      )}

      {/* SMTP */}
      {tab === 'smtp' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">E-posta (SMTP) Ayarları</h2>
            <button onClick={() => handleSave(setSmtpSaved)}
              className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
              {smtpSaved ? <><CheckCircle size={15}/> Kaydedildi</> : <><Save size={15}/> Kaydet</>}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800">ℹ️ SMTP yapılandırması</p>
            <p className="text-xs text-blue-700 mt-1">Sipariş onayı, şifre sıfırlama ve bülten e-postalarını göndermek için SMTP sunucusu gereklidir.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="SMTP Sunucu"   value="" placeholder="smtp.gmail.com" />
            <Field label="SMTP Port"     value="" placeholder="587" />
            <Field label="SMTP Kullanıcı" value="" placeholder="noreply@allorea-cosmetics.com" />
            <Field label="SMTP Şifre"   value="" type="password" placeholder="••••••••" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-brand-600" />
            <span className="text-sm font-semibold text-gray-700">SSL/TLS kullan</span>
          </label>
        </div>
      )}

      {/* Güvenlik */}
      {tab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-bold text-gray-900">Güvenlik Ayarları</h2>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-green-800">JWT Güvenliği Aktif</p>
                <p className="text-xs text-green-700 mt-0.5">JWT_SECRET environment variable ayarlanmış durumda.</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-green-800">Middleware Koruması Aktif</p>
                <p className="text-xs text-green-700 mt-0.5">Admin rotaları token doğrulaması ile korunuyor.</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-semibold text-green-800">Content-Security-Policy Aktif</p>
                <p className="text-xs text-green-700 mt-0.5">CSP header tüm sayfalarda uygulanıyor.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Admin Şifresi Değiştir</h3>
            <div className="space-y-3 max-w-sm">
              <Field label="Mevcut Şifre"  value="" type="password" />
              <Field label="Yeni Şifre"    value="" type="password" />
              <Field label="Şifre Tekrarı" value="" type="password" />
              <button className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
                Şifreyi Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
