'use client'
import { useState, useRef, useCallback, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'

interface Props {
  beforeUrl:    string
  afterUrl:     string
  beforeLabel?: string
  afterLabel?:  string
  className?:   string
}

export default function BeforeAfterSlider({
  beforeUrl, afterUrl,
  beforeLabel = 'Önce',
  afterLabel  = 'Sonra',
  className   = '',
}: Props) {
  const [pct, setPct]   = useState(50)
  const containerRef    = useRef<HTMLDivElement>(null)
  const isDragging      = useRef(false)

  const clamp     = (v: number) => Math.max(1, Math.min(99, v))
  const updatePct = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    setPct(clamp(((clientX - left) / width) * 100))
  }, [])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    updatePct(e.clientX)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    updatePct(e.clientX)
  }
  const onPointerUp = () => { isDragging.current = false }

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square overflow-hidden select-none touch-none cursor-col-resize shadow-2xl ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* SONRA — arkaplan */}
      <Image src={afterUrl} alt={afterLabel} fill priority
        className="object-cover pointer-events-none"
        sizes="(max-width:768px) 100vw, 50vw" />

      {/* ÖNCE — clip-path */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <Image src={beforeUrl} alt={beforeLabel} fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 50vw" />
      </div>

      {/* ─── Divider çizgisi — daha kalın (6px) ────────────────────── */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
      >
        {/* Kalın beyaz çizgi — 6px */}
        <div className="absolute inset-0 w-[6px] bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.4),0_0_24px_rgba(0,0,0,0.5)]" />

        {/* ─── Büyük yuvarlak handle — belirgin ──────────────────── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-16 h-16 rounded-full bg-white
          shadow-[0_6px_24px_rgba(0,0,0,0.45),0_0_0_4px_rgba(255,255,255,0.6)]
          flex items-center justify-center
          border-4 border-white
          pointer-events-none"
        >
          {/* Çift ok — kalın, net */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M11 16 L3 16 M3 16 L8 11 M3 16 L8 21"
              stroke="#1c1c1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 16 L29 16 M29 16 L24 11 M29 16 L24 21"
              stroke="#1c1c1e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Üst ok */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2 L5 8 M2 4.5 L5 2 L8 4.5" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {/* Alt ok */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2 L5 8 M2 5.5 L5 8 L8 5.5" stroke="#1c1c1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ─── BEFORE label — koyu, köşeli ─────────────────────────── */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <span className="block bg-black/80 text-white text-xs font-black px-4 py-2 uppercase tracking-[0.15em]">
          {beforeLabel}
        </span>
      </div>

      {/* ─── AFTER label — kırmızı, köşeli ──────────────────────── */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <span className="block bg-red-600 text-white text-xs font-black px-4 py-2 uppercase tracking-[0.15em]">
          {afterLabel}
        </span>
      </div>

      {/* ─── Alt gradient + ipucu ────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-3 pointer-events-none">
        <p className="text-center text-white text-[11px] font-black tracking-[0.2em] uppercase">
          ← Sürükleyerek Karşılaştır →
        </p>
      </div>
    </div>
  )
}
