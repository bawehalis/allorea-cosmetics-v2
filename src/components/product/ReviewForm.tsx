'use client'
// src/components/product/ReviewForm.tsx
'use client'
import { useState } from 'react'
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'auth'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setErrorMsg('Please select a rating'); return }
    if (body.length < 10) { setErrorMsg('Yorum en az 10 karakter olmalıdır'); return }

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, body }),
      })
      if (res.status === 401) { setStatus('auth'); return }
      if (!res.ok) { const j = await res.json(); throw new Error(j.error) }
      setStatus('success')
      onSuccess?.()
    } catch (e: any) {
      setStatus('error')
      setErrorMsg(e.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center bg-green-50 border border-green-200 p-6">
        <CheckCircle size={32} className="text-green-600" />
        <h3 className="font-display text-xl font-light text-charcoal">Thank you for your review!</h3>
        <p className="font-body text-sm text-nude-500">Your review will appear after moderation.</p>
      </div>
    )
  }

  if (status === 'auth') {
    return (
      <div className="text-center py-8 bg-nude-50 border border-nude-200 p-6">
        <p className="font-body text-sm text-nude-600 mb-4">You need to be signed in to leave a review.</p>
        <a href="/login" className="btn-primary text-sm px-6 py-2.5">Sign In</a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star Rating */}
      <div>
        <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-2">Your Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button"
              onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110">
              <Star size={28} className={cn(
                'transition-colors',
                star <= (hover || rating) ? 'text-brand-400 fill-brand-400' : 'text-nude-200 fill-nude-200'
              )} />
            </button>
          ))}
          <span className="ml-2 font-body text-sm text-nude-500 self-center">
            {rating > 0 ? ['','Poor','Fair','Good','Very Good','Excellent'][rating] : 'Click to rate'}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">Review Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={200}
          placeholder="Summarise your experience..."
          className="w-full input-field" />
      </div>

      {/* Body */}
      <div>
        <label className="block font-body text-xs uppercase tracking-wider text-nude-500 mb-1.5">Your Review *</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} required minLength={10}
          placeholder="Tell others about your experience with this product..."
          className="w-full input-field resize-none" />
        <p className="font-body text-xs text-nude-400 mt-1">{body.length}/2000</p>
      </div>

      {(errorMsg) && (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle size={14} />
          <p className="font-body text-sm">{errorMsg}</p>
        </div>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary gap-2 disabled:opacity-60">
        <Send size={15} />
        {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
      </button>
    </form>
  )
}
