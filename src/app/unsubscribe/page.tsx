// src/app/unsubscribe/page.tsx
// Email linkinden tıklandığında GET parametreleriyle çalışan güvenli unsubscribe sayfası
import { Suspense } from 'react'
import UnsubscribeContent from '@/components/ui/UnsubscribeContent'

export const metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from Allorea newsletter.',
  robots: { index: false },
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
