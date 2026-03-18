// src/app/checkout/success/page.tsx
import { Suspense } from 'react'
import CheckoutSuccessContent from '@/components/ui/CheckoutSuccessContent'

export const metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been placed successfully.',
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
