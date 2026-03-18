// src/app/shop/page.tsx
// FIX: useSearchParams() must be inside a <Suspense> boundary in Next.js 14 App Router.
// The actual page content is in ShopContent; this file provides the Suspense wrapper.
import { Suspense } from 'react'
import ShopContent from '@/components/shop/ShopContent'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export const metadata = {
  title: 'Tüm Ürünler',
  description: 'Browse our full collection of luxury skincare, makeup, fragrance and body care.',
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pearl flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
