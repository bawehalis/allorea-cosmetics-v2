'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Heart, Menu, X, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Mağaza', href: '/shop', children: [
    { label: 'Tüm Ürünler',    href: '/shop' },
    { label: 'Cilt Bakımı',    href: '/shop?category=skincare' },
    { label: 'Saç Bakımı',     href: '/shop?category=hair-care' },
    { label: 'Serumlar',       href: '/shop?category=serums' },
    { label: 'Vücut Bakımı',   href: '/shop?category=body-care' },
    { label: 'Makyaj',         href: '/shop?category=makeup' },
    { label: 'Parfüm',         href: '/shop?category=fragrance' },
  ]},
  { label: 'Ürünler', href: '/shop?featured=true', children: [
    { label: 'Yeni Gelenler',  href: '/shop?sort=newest' },
    { label: 'En Çok Satanlar',href: '/shop?sort=bestseller' },
    { label: 'Kampanyalar',    href: '/shop?sale=true' },
    { label: 'Saç Serumu',     href: '/product/allorea-sac-yogunlastirici-serum' },
    { label: 'Gece Kremi',     href: '/product/allorea-gece-onarim-kremi' },
    { label: 'C Vitamini Serum',href:'/product/allorea-radiance-c-vitamini-serum' },
  ]},
  { label: 'Hakkımızda', href: '/about', children: null },
  { label: 'Blog',       href: '/blog',  children: null },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar">
        <p>299₺ üzeri siparişlerde ücretsiz kargo · İlk siparişinizde <strong>ALLOREA15</strong> kodunu kullanın</p>
      </div>

      <header className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
      )}>
        <div className="container-main">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center lg:items-start">
              <span className="font-display text-2xl md:text-3xl font-light tracking-[0.15em] text-charcoal">
                ALLOREA
              </span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-nude-500 -mt-1">
                Cosmetics
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'nav-link flex items-center gap-1 py-6',
                      activeMenu === item.label && 'text-brand-600'
                    )}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={13} className="transition-transform group-hover:rotate-180" />}
                  </Link>

                  {item.children && (
                    <div className={cn(
                      'absolute top-full left-0 w-52 bg-white shadow-xl border-t-2 border-brand-500 py-3 transition-all duration-200',
                      activeMenu === item.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    )}>
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 font-body text-sm text-charcoal hover:bg-nude-50 hover:text-brand-600 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:text-brand-600 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link href="/account" className="p-2 hover:text-brand-600 transition-colors hidden sm:block" aria-label="Account">
                <User size={20} />
              </Link>
              <Link href="/wishlist" className="p-2 hover:text-brand-600 transition-colors hidden sm:block" aria-label="Favoriler">
                <Heart size={20} />
              </Link>
              <button
                onClick={openCart}
                className="relative p-2 hover:text-brand-600 transition-colors"
                aria-label={`Cart (${count} items)`}
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-600 text-white text-[10px] font-body font-medium rounded-full px-1">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn(
          'border-t border-nude-100 overflow-hidden transition-all duration-300',
          searchOpen ? 'max-h-16' : 'max-h-0'
        )}>
          <div className="container-main py-3">
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/shop?search=${searchQuery}` }}>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün arayın..."
                  className="w-full pl-11 pr-4 py-3 bg-nude-50 border-0 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  autoFocus={searchOpen}
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <>
        <div
          className={cn(
            'fixed inset-0 bg-charcoal/40 z-40 lg:hidden transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div className={cn(
          'fixed top-0 left-0 h-full w-[300px] bg-white z-50 lg:hidden transition-transform duration-300 overflow-y-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-nude-100">
            <span className="font-display text-xl tracking-wider">ALLOREA</span>
            <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
          </div>
          <nav className="px-5 py-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border-b border-nude-50">
                <Link
                  href={item.href}
                  className="block py-3.5 font-body text-sm tracking-wider uppercase text-charcoal"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 font-body text-sm text-nude-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/account" className="flex items-center gap-3 py-3 font-body text-sm" onClick={() => setMobileOpen(false)}>
                <User size={18} /> Hesabım
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 py-3 font-body text-sm" onClick={() => setMobileOpen(false)}>
                <Heart size={18} /> Favoriler
              </Link>
            </div>
          </nav>
        </div>
      </>
    </>
  )
}
