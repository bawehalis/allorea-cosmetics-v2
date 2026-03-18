import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Header     from '@/components/layout/Header'
import Footer     from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import Providers  from '@/components/ui/Providers'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300','400','500','600','700'],
  style:    ['normal','italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

const jost = Jost({
  subsets:  ['latin'],
  weight:   ['300','400','500','600','700'],
  variable: '--font-jost',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://allorea-cosmetics.com'),
  title: {
    default:  'Allorea Cosmetics — Bilimsel Güzellik',
    template: '%s | Allorea Cosmetics',
  },
  description: '30 günde görünür fark veya paranız iade. Klinik test edilmiş cilt ve saç bakım serumları.',
  keywords:    ['kozmetik','cilt bakımı','saç bakımı','serum','biotin','kafein','allorea'],
  authors:     [{ name:'Allorea Cosmetics' }],
  creator:     'Allorea Cosmetics',
  openGraph: {
    type:        'website',
    locale:      'tr_TR',
    siteName:    'Allorea Cosmetics',
    title:       'Allorea Cosmetics — Bilimsel Güzellik',
    description: 'Klinik test edilmiş saç ve cilt bakım serumları. 30 gün memnuniyet garantisi.',
    images: [{ url:'/og-image.jpg', width:1200, height:630, alt:'Allorea Cosmetics' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Allorea Cosmetics',
    description: 'Klinik test edilmiş kozmetik ürünleri.',
    images:      ['/og-image.jpg'],
  },
  robots: {
    index:     true,
    follow:    true,
    googleBot: { index:true, follow:true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Providers>
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
