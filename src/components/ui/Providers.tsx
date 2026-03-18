'use client'
// src/components/ui/Providers.tsx
// BUG 9 FIX: react-hot-toast's <Toaster> requires a client component boundary.
// Isolates all client-only providers from the Server Component root layout.
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-jost)',
            fontSize:   '14px',
            borderRadius: '2px',
            border: '1px solid #ecddd0',
          },
          success: { iconTheme: { primary: '#bf6043', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  )
}
