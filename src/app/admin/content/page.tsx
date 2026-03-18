// src/app/admin/content/page.tsx
'use client'
import { useState } from 'react'
import { Save, Eye, Image as ImageIcon, CheckCircle } from 'lucide-react'

interface ContentSettings {
  heroTitle:     string
  heroSubtitle:  string
  heroCta:       string
  heroImageUrl:  string
  beforeUrl:     string
  afterUrl:      string
  beforeLabel:   string
  afterLabel:    string
  seoTitle:      string
  seoDescription:string
}

const DEFAULTS: ContentSettings = {
  heroTitle:     'Saç Dökülmesini\nDurdurun.',
  heroSubtitle:  '30 günde görünür fark veya paranızı geri alın. Klinik test edilmiş biotin + kafein formülü.',
  heroCta:       'Hemen Sipariş Ver',
  heroImageUrl:  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  beforeUrl:     'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
  afterUrl:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  beforeLabel:   'Önce',
  afterLabel:    'Sonra',
  seoTitle:      'Allorea Cosmetics — Saç Bakımında Bilimsel Güç',
  seoDescription:'30 günde görünür fark veya paranız iade. Klinik test edilmiş saç bakım serumu.',
}

export default function AdminContentPage() {
  const [settings, setSettings] = useState<ContentSettings>(DEFAULTS)
  const [saved,    setSaved]    = useState(false)
  const [tab,      setTab]      = useState<'hero'|'before-after'|'seo'>('hero')

  const upd = (k: keyof ContentSettings, v: string) =>
    setSettings(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    // Gerçek uygulamada API'ye gönderilir
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Field = ({ label, field, type = 'text', rows = 1 }: {
    label: string; field: keyof ContentSettings; type?: string; rows?: number
  }) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">{label}</label>
      {rows > 1 ? (
        <textarea
          rows={rows}
          value={settings[field]}
          onChange={e => upd(field, e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
        />
      ) : (
        <input
          type={type}
          value={settings[field]}
          onChange={e => upd(field, e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      )}
    </div>
  )

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">İçerik Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Hero, before/after ve SEO içeriklerini düzenle</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
          {saved ? <><CheckCircle size={16} /> Kaydedildi</> : <><Save size={16} /> Kaydet</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {([
          { key: 'hero',         label: 'Hero Alanı' },
          { key: 'before-after', label: 'Before/After' },
          { key: 'seo',          label: 'SEO' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? 'bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

        {/* Hero */}
        {tab === 'hero' && (
          <>
            <Field label="Ana Başlık" field="heroTitle" rows={3} />
            <Field label="Alt Metin / Açıklama" field="heroSubtitle" rows={2} />
            <Field label="CTA Buton Metni" field="heroCta" />
            <div>
              <Field label="Hero Görsel URL" field="heroImageUrl" />
              {settings.heroImageUrl && (
                <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden">
                  <img src={settings.heroImageUrl} alt="Hero önizleme" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800">💡 Önizleme</p>
              <div className="mt-3 bg-gradient-to-b from-nude-100 to-white rounded-xl p-5">
                <h2 className="font-display text-2xl font-black text-charcoal whitespace-pre-line">{settings.heroTitle}</h2>
                <p className="text-sm text-nude-600 mt-2 max-w-sm">{settings.heroSubtitle}</p>
                <button className="mt-4 bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold">
                  {settings.heroCta}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Before/After */}
        {tab === 'before-after' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Önce Etiketi" field="beforeLabel" />
              <Field label="Sonra Etiketi" field="afterLabel" />
            </div>
            <div>
              <Field label="'Önce' Görsel URL" field="beforeUrl" />
              {settings.beforeUrl && (
                <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden">
                  <img src={settings.beforeUrl} alt="Önce" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">ÖNCE</span>
                </div>
              )}
            </div>
            <div>
              <Field label="'Sonra' Görsel URL" field="afterUrl" />
              {settings.afterUrl && (
                <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden">
                  <img src={settings.afterUrl} alt="Sonra" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded">SONRA</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* SEO */}
        {tab === 'seo' && (
          <>
            <Field label="SEO Başlığı (title)" field="seoTitle" />
            <Field label="Meta Açıklaması" field="seoDescription" rows={2} />
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Google Önizleme</p>
              <p className="text-blue-600 text-sm font-medium">{settings.seoTitle}</p>
              <p className="text-green-700 text-xs">allorea-cosmetics.com</p>
              <p className="text-gray-600 text-xs mt-0.5">{settings.seoDescription}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
