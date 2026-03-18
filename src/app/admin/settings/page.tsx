'use client'
// src/app/admin/settings/page.tsx
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface SettingField { label: string; value: string; type: string }

const STORE_FIELDS: SettingField[] = [
  { label: 'Mağaza Adı',                    value: 'Allorea Cosmetics',            type: 'text'   },
  { label: 'Store Email',                   value: 'hello@allorea-cosmetics.com',  type: 'email'  },
  { label: 'Currency',                      value: 'USD',                          type: 'text'   },
  { label: 'Free Shipping Threshold ($)',   value: '75',                           type: 'number' },
  { label: 'Tax Rate (%)',                  value: '8',                            type: 'number' },
]

export default function AdminSettingsPage() {
  const [storeSaved,  setStoreSaved]  = useState(false)
  const [stripeSaved, setStripeSaved] = useState(false)

  const handleSave = (setter: (v: boolean) => void) => {
    setter(true)
    setTimeout(() => setter(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store configuration.</p>
      </div>

      {/* Store config */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-base font-semibold text-gray-900">Store Configuration</h2>
        {STORE_FIELDS.map(({ label, value, type }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
              type={type}
              defaultValue={value}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        ))}
        <button
          onClick={() => handleSave(setStoreSaved)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          {storeSaved && <CheckCircle size={15} />}
          {storeSaved ? 'Saved!' : 'Ayarları Kaydet'}
        </button>
      </div>

      {/* Stripe */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Stripe Integration</h2>
        <p className="text-sm text-gray-500">
          Configure payment keys. In production, set these via environment variables — never store secret keys in the UI.
        </p>
        {['Stripe Publishable Key (pk_live_...)', 'Stripe Secret Key (sk_live_...)', 'Webhook Signing Secret (whsec_...)'].map(k => (
          <div key={k}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{k}</label>
            <input
              type="password"
              placeholder="Stored in environment variables"
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed font-mono"
            />
          </div>
        ))}
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          ⚠️ Set <code className="font-mono">STRIPE_SECRET_KEY</code>, <code className="font-mono">STRIPE_PUBLISHABLE_KEY</code>, and{' '}
          <code className="font-mono">STRIPE_WEBHOOK_SECRET</code> in your Vercel environment variables dashboard.
        </p>
      </div>

      {/* Email */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Email (SMTP)</h2>
        {[
          { label: 'SMTP Host',     placeholder: 'smtp.gmail.com' },
          { label: 'SMTP Port',     placeholder: '587' },
          { label: 'SMTP Username', placeholder: 'noreply@yourdomain.com' },
          { label: 'SMTP Password', placeholder: 'app-password' },
        ].map(({ label, placeholder }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
              type={label.includes('Password') ? 'password' : 'text'}
              placeholder={`Set via SMTP env var (e.g. ${placeholder})`}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
