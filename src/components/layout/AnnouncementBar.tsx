'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const MESSAGES = [
  '75$ üzeri siparişlerde ücretsiz kargo — Kod: ALLOREA15 ile ilk siparişinizde %15 indirim',
  'Yeni Koleksiyon: Fleur Blanche Eau de Parfum şimdi mevcut ✨',
  'Sürdürülebilir güzellik — Tüm ürünlerimiz cruelty-free ve doğa dostu',
]

export default function AnnouncementBar() {
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(true)
  const [fade, setFade]       = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length)
        setFade(true)
      }, 400)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-charcoal text-white py-2.5 px-4 relative">
      <p
        className="font-body text-xs text-center tracking-wide transition-opacity duration-400"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {MESSAGES[idx]}
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Kapat"
      >
        <X size={14} />
      </button>
    </div>
  )
}
