import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400 mb-4">404 Hatası</p>
      <h1 className="font-display text-6xl md:text-8xl font-light text-charcoal mb-4">Sayfa Bulunamadı</h1>
      <p className="font-body text-nude-500 max-w-sm mb-10 leading-relaxed">
        Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="btn-primary gap-2">Ana Sayfaya Dön <ArrowRight size={16} /></Link>
        <Link href="/shop" className="btn-outline">Ürünleri Keşfet</Link>
      </div>
    </div>
  )
}
