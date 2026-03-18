// src/app/login/page.tsx
import { Suspense } from 'react'
import LoginForm from '@/components/ui/LoginForm'

export const metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
