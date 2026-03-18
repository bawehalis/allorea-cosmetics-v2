// src/components/ui/UnsubscribeContent.tsx
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      setStatus('error')
      setMessage('Geçersiz link. Lütfen e-postanızdaki bağlantıyı kullanın.')
      return
    }

    fetch(`/api/newsletter?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
    })
      .then(r => r.json())
      .then(j => {
        if (j.error) { setStatus('error'); setMessage(j.error) }
        else         { setStatus('success'); setMessage(j.data?.message ?? 'Unsubscribed successfully.') }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Bir hata oluştu. Lütfen tekrar deneyin veya destek ile iletişime geçin.')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white border border-nude-100 rounded-2xl p-10">
        {status === 'loading' && (
          <>
            <Loader2 size={36} className="animate-spin text-nude-400 mx-auto mb-4" />
            <p className="font-body text-nude-500">İsteğiniz işleniyor…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={40} className="text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-3xl font-light text-charcoal mb-2">Unsubscribed</h1>
            <p className="font-body text-nude-500 mb-6">{message}</p>
            <Link href="/" className="btn-outline text-sm px-8 py-3">Back to Home</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h1 className="font-display text-3xl font-light text-charcoal mb-2">Error</h1>
            <p className="font-body text-nude-500 mb-6">{message}</p>
            <Link href="/" className="btn-outline text-sm px-8 py-3">Back to Home</Link>
          </>
        )}
      </div>
    </div>
  )
}
