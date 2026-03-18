'use client'
// src/components/ui/LoginForm.tsx
// GÜVENLİK DÜZELTMESİ: Open redirect açığı kapatıldı.
// redirect parametresi artık yalnızca aynı origin'e (dahili path) yönlendirebilir.
// Harici URL'lere (http://, https://) yönlendirme engellendi.
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Layers } from 'lucide-react'

// Yalnızca dahili path'lere izin ver — harici URL yönlendirmesi engelle
function sanitizeRedirect(raw: string | null): string {
  if (!raw) return '/admin'
  // Protokol içeriyorsa (http, https, //) harici URL — güvensiz, varsayılana dön
  if (/^https?:\/\//i.test(raw) || raw.startsWith('//')) return '/admin'
  // Yalnızca / ile başlayan dahili path'lere izin ver
  if (!raw.startsWith('/')) return '/admin'
  return raw
}

export default function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = sanitizeRedirect(searchParams.get('redirect'))

  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Login failed')
      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-charcoal rounded-2xl mb-4">
            <Layers size={24} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-light text-charcoal">ALLOREA</h1>
          <p className="font-body text-sm text-nude-500 mt-1">Admin Paneli</p>
        </div>

        <div className="bg-white border border-nude-100 rounded-2xl p-8 shadow-sm">
          <h2 className="font-display text-xl font-light text-charcoal mb-6">Giriş Yap</h2>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="font-body text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nude-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@allorea-cosmetics.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 border border-nude-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs font-medium text-gray-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-nude-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 border border-nude-200 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-nude-400 hover:text-charcoal transition-colors"
                  aria-label={showPass ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-charcoal text-white font-body font-medium text-sm rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor…
                </span>
              ) : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-nude-400 mt-6">
          <Link href="/" className="hover:text-charcoal transition-colors">← Mağazaya Dön</Link>
        </p>
      </div>
    </div>
  )
}
