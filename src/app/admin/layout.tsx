// src/app/admin/layout.tsx
// AÇIK 3 DÜZELTİLDİ: getSession() ve redirect() geri eklendi.
// Hem middleware hem layout seviyesinde çift kontrol yapılıyor (defense in depth).

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s — Allorea Admin',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sunucu tarafında ikinci bir kontrol — middleware atlanabiliyorsa bu engeller
  const session = await getSession()

  if (!session) {
    redirect('/login?redirect=/admin')
  }

  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    redirect('/')
  }

  return <AdminShell>{children}</AdminShell>
}
