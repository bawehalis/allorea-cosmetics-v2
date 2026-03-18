import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function PromoBanner() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1400&q=85"
        alt="Allorea kampanya"
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-charcoal/20" />
      <div className="relative h-full container-main flex items-center">
        <div className="max-w-lg">
          <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-brand-300 mb-4">
            Sınırlı Süre
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-white mb-4 leading-tight">
            Allorea<br /><em>Kampanyası</em>
          </h2>
          <p className="font-body text-base text-white/75 mb-8 leading-relaxed">
            Favori cilt bakım ürünlerinizde %30&apos;a varan indirim. Pazar geceyarısına kadar geçerli.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/shop?sale=true" className="btn-brand gap-2">
              Kampanyayı Gör <ArrowRight size={16} />
            </Link>
            <div className="text-white">
              <span className="font-body text-xs text-white/60 uppercase tracking-wider block">Kod</span>
              <span className="font-display text-2xl font-light tracking-widest">ALLOREA30</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
