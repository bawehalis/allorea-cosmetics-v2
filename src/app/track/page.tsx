// src/app/track/page.tsx
import { Suspense } from 'react'
import TrackContent from '@/components/ui/TrackContent'

export const metadata = {
  title: 'Siparişinizi Takip Edin',
  description: 'Enter your order number to track delivery status.',
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  )
}
