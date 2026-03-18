'use client'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <h2 className="font-display text-3xl font-light text-charcoal mb-3">Bir Hata Oluştu</h2>
      <p className="font-body text-nude-500 max-w-sm mb-8">
        Beklenmedik bir hata meydana geldi. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary">Tekrar Dene</button>
        <a href="/" className="btn-outline">Ana Sayfa</a>
      </div>
    </div>
  )
}
