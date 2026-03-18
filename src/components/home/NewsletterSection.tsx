'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-nude-100 py-20">
      <div className="container-main max-w-2xl text-center">
        <p className="section-subtitle">Haberdar Olun</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-charcoal mb-4">
          Join the Allorea Circle
        </h2>
        <p className="font-body text-base text-nude-600 mb-8 leading-relaxed">
          Yeni lansmanlar, özel teklifler ve uzman güzellik ipuçlarından ilk haberdar olan siz olun.
        </p>

        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 text-green-700">
            <Check className="w-5 h-5" />
            <p className="font-body">Allorea ailesine hoş geldiniz! Gelen kutunuzda sizi bekleyen bir sürpriz var.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              required
              className="flex-1 input-field border-nude-300 text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary shrink-0 gap-2 sm:w-auto"
            >
              {status === 'loading' ? 'Kaydediliyor...' : <>Subscribe <ArrowRight size={15} /></>}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="font-body text-sm text-red-500 mt-3">Bir hata oluştu. Lütfen tekrar deneyin.</p>
        )}

        <p className="font-body text-xs text-nude-400 mt-5">
          Abone olarak{' '}
          <a href="/legal/privacy" className="underline hover:text-nude-600">Gizlilik Politikası</a>.
          kabul etmiş olursunuz. İstediğiniz zaman abonelikten çıkabilirsiniz.
        </p>
      </div>
    </section>
  )
}
