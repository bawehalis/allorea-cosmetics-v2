import Link from 'next/link'
import { Instagram, Facebook, Youtube, Twitter, MapPin, Mail, Phone } from 'lucide-react'

const FOOTER_LINKS = {
  shop: [
    { label: 'Tüm Ürünler', href: '/shop' },
    { label: 'Skincare', href: '/shop?category=skincare' },
    { label: 'Makeup', href: '/shop?category=makeup' },
    { label: 'Body Care', href: '/shop?category=body-care' },
    { label: 'Fragrance', href: '/shop?category=fragrance' },
    { label: 'Yeni Gelenler', href: '/shop?sort=newest' },
    { label: 'En Çok Satanlar', href: '/shop?sort=bestseller' },
  ],
  help: [
    { label: 'Bize Ulaşın', href: '/contact' },
    { label: 'SSS', href: '/faq' },
    { label: 'Sipariş Takibi', href: '/track' },
    { label: 'Kargo Politikası', href: '/legal/shipping' },
    { label: 'İade Politikası', href: '/legal/returns' },
    { label: 'Mağaza Bul', href: '/stores' },
  ],
  company: [
    { label: 'Hakkımızda', href: '/about' },
    { label: 'Hikayemiz', href: '/about#story' },
    { label: 'Sürdürülebilirlik', href: '/about#sustainability' },
    { label: 'Blog', href: '/blog' },
    { label: 'Basın', href: '/press' },
    { label: 'Kariyer', href: '/careers' },
  ],
  legal: [
    { label: 'Gizlilik Politikası', href: '/legal/privacy' },
    { label: 'Kullanım Koşulları', href: '/legal/terms' },
    { label: 'Çerez Politikası', href: '/legal/cookies' },
    { label: 'Erişilebilirlik', href: '/accessibility' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Top strip */}
      <div className="border-b border-white/10">
        <div className="container-main py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={18} />
            </div>
            <div>
              <p className="font-body font-medium text-sm tracking-wider uppercase mb-1">Mağaza Bul</p>
              <p className="font-body text-sm text-white/60">Dünya genelinde 50'den fazla mağazamızdan birini ziyaret edin</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <Mail size={18} />
            </div>
            <div>
              <p className="font-body font-medium text-sm tracking-wider uppercase mb-1">E-posta</p>
              <a href="mailto:hello@allorea-cosmetics.com" className="font-body text-sm text-white/60 hover:text-white transition-colors">
                hello@allorea-cosmetics.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-body font-medium text-sm tracking-wider uppercase mb-1">Telefon</p>
              <a href="tel:+18005550192" className="font-body text-sm text-white/60 hover:text-white transition-colors">
                1-800-555-0192 (Pzt–Cum 09:00–18:00)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <div className="font-display text-3xl font-light tracking-[0.2em]">ALLOREA</div>
              <div className="font-body text-[9px] tracking-[0.4em] uppercase text-white/50 mt-0.5">Cosmetics</div>
            </Link>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-6">
              Crafting luxury beauty essentials with the finest natural ingredients. 
              Cruelty-free, sustainably sourced, and made to make you glow.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-brand-600 hover:border-brand-600 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: 'Mağaza', links: FOOTER_LINKS.shop },
            { title: 'Müşteri Hizmetleri', links: FOOTER_LINKS.help },
            { title: 'Şirket', links: FOOTER_LINKS.company },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-body text-xs tracking-[0.2em] uppercase font-medium mb-5 text-white/90">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-white/10">
        <div className="container-main py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {['Hayvansız Test', 'Vegan Formüller', 'Sürdürülebilir Kaynak', 'Dermatoloji Onaylı', 'Temiz Güzellik'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="font-body text-xs tracking-wider uppercase text-white/50">{badge}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <p className="font-body text-xs text-white/40">
              © 2026 Allorea Cosmetics. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-5">
              {FOOTER_LINKS.legal.map((link) => (
                <Link key={link.label} href={link.href} className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            {/* Payment icons */}
            <div className="flex items-center gap-2">
              {['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay'].map((p) => (
                <div key={p} className="px-2 py-1 bg-white/10 rounded text-[9px] font-body font-medium text-white/50 tracking-wider">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
