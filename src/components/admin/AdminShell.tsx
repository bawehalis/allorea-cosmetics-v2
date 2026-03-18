// src/components/admin/AdminShell.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  BarChart3, Settings, FileText, LogOut, Menu, X,
  ChevronRight, Bell, Search, Layers, Archive,
  Star, Image as ImageIcon, Zap, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',           label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/admin/products',  label: 'Ürünler',      icon: Package },
  { href: '/admin/bundles',   label: 'Paketler',     icon: Layers },
  { href: '/admin/reviews',   label: 'Yorumlar',     icon: Star },
  { href: '/admin/orders',    label: 'Siparişler',   icon: ShoppingCart },
  { href: '/admin/customers', label: 'Müşteriler',   icon: Users },
  { href: '/admin/analytics', label: 'Analitik',     icon: BarChart3 },
  { href: '/admin/content',   label: 'İçerik',       icon: ImageIcon },
  { href: '/admin/urgency',   label: 'FOMO Ayarları',icon: Zap },
  { href: '/admin/coupons',   label: 'Kuponlar',     icon: Tag },
  { href: '/admin/inventory', label: 'Stok',         icon: Archive },
  { href: '/admin/blog',      label: 'Blog',         icon: FileText },
  { href: '/admin/settings',  label: 'Ayarlar',      icon: Settings },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [sidebarOpen,       setSidebarOpen]       = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 flex items-center justify-center shrink-0 rounded-lg">
            <Layers size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-display text-base font-light tracking-widest text-white">ALLOREA</p>
              <p className="font-body text-[9px] text-white/40 tracking-widest uppercase">Admin Panel</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link key={href} href={href}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150',
                active
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}>
              <Icon size={16} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-body text-sm flex-1">{label}</span>
                  {active && <ChevronRight size={12} />}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all">
          <Package size={16} />
          {sidebarOpen && <span className="font-body text-sm">Mağazayı Gör</span>}
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all">
          <LogOut size={16} />
          {sidebarOpen && <span className="font-body text-sm">Çıkış Yap</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-charcoal transition-all duration-300 shrink-0',
        sidebarOpen ? 'w-52' : 'w-[56px]'
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <>
        <div className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )} onClick={() => setMobileSidebarOpen(false)} />
        <aside className={cn(
          'fixed top-0 left-0 h-full w-52 bg-charcoal z-50 lg:hidden transition-transform duration-300',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <SidebarContent />
        </aside>
      </>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-1.5 hover:bg-gray-100 rounded-lg">
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" placeholder="Ürün, sipariş, müşteri ara..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell size={17} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
