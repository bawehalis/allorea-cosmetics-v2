import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import Providers from '@/components/ui/Providers'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://allorea-cosmetics.com'
  ),
  title: {
    default: 'Allorea Cosmetics — Doğanın Gücüyle Lüks Güzellik',
    template: '%s | Allorea Cosmetics',
  },
  description:
    'En seçkin doğal bileşenlerden ilham alan lüks cilt bakımı, makyaj ve parfüm. Cruelty-free. Sürdürülebilir kaynaklı. Dermatolojik olarak test edilmiş.',
  keywords: ['lüks kozmetik', 'cilt bakımı', 'makyaj', 'cruelty-free güzellik', 'doğal güzellik', 'allorea'],
  authors: [{ name: 'Allorea Cosmetics' }],
  creator: 'Allorea Cosmetics',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Allorea Cosmetics',
    title: 'Allorea Cosmetics — Doğanın Gücüyle Lüks Güzellik',
    description: 'En seçkin doğal bileşenlerden ilham alan lüks cilt bakımı, makyaj ve parfüm.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Allorea Cosmetics' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allorea Cosmetics',
    description: 'Lüks güzellik ürünleri, doğanın gücüyle.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <Providers>{null}</Providers>
      </body>
    </html>
  )
}
