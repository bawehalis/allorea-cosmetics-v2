'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/mock-data'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  // Demo: tüm ürünleri favoriye eklenmiş gibi göster
  const [wishlist, setWishlist] = useState(ALL_PRODUCTS.map(p => p.id))
  const { addItem, openCart }   = useCartStore()

  const wishlistedProducts = ALL_PRODUCTS.filter(p => wishlist.includes(p.id))

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(i => i !== id))
    toast.success('Favorilerden kaldırıldı', { icon:'💔', duration:2000 })
  }

  const addToCart = (p: typeof ALL_PRODUCTS[0]) => {
    if (p.stock === 0) return
    const b = p.bundles[0]
    addItem({
      productId: p.id,
      name:      p.name,
      slug:      p.slug,
      price:     b.price,
      quantity:  1,
      image:     p.images[0]?.url || '',
      stock:     p.stock,
      variant:   b.label,
    })
    toast.success(`${p.name} sepete eklendi!`, { icon:'🛍️' })
    openCart()
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-nude-100 flex items-center justify-center mb-6">
          <Heart size={40} className="text-nude-300" />
        </div>
        <h1 className="font-display text-4xl font-light text-charcoal mb-3">Favorileriniz Boş</h1>
        <p className="font-body text-nude-500 mb-8 max-w-sm">
          Beğendiğiniz ürünleri kaydedin, istediğiniz zaman kolayca bulun.
        </p>
        <Link href="/shop" className="btn-primary gap-2 rounded-2xl">
          Ürünleri Keşfet <ArrowRight size={16}/>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <h1 className="font-display text-3xl font-light text-charcoal">Favorilerim</h1>
          <p className="font-body text-sm text-nude-500 mt-1">{wishlistedProducts.length} ürün kaydedildi</p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistedProducts.map(p => {
            const avg  = p.reviews.reduce((s,r)=>s+r.rating,0)/p.reviews.length
            const disc = p.comparePrice > p.price ? Math.round(((p.comparePrice-p.price)/p.comparePrice)*100) : 0
            return (
              <div key={p.id} className="group bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200">
                <div className="relative aspect-square overflow-hidden bg-nude-50">
                  <Link href={`/product/${p.slug}`}>
                    <Image src={p.images[0]?.url||''} alt={p.name} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, 25vw" />
                  </Link>
                  {disc > 0 && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      -%{disc}
                    </span>
                  )}
                  <button
                    onClick={() => removeFromWishlist(p.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-red-50 transition-colors">
                    <Heart size={14} className="fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11}
                        className={s <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200'} />
                    ))}
                    <span className="text-[10px] text-nude-400">({p.reviews.length})</span>
                  </div>

                  <Link href={`/product/${p.slug}`}
                    className="font-bold text-sm text-charcoal leading-snug line-clamp-2 hover:text-brand-600 transition-colors block mb-2">
                    {p.name}
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-black text-base text-charcoal">{p.price.toLocaleString('tr-TR')}₺</span>
                    {p.comparePrice > p.price && (
                      <span className="text-xs text-nude-400 line-through">{p.comparePrice.toLocaleString('tr-TR')}₺</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all',
                        p.stock === 0
                          ? 'bg-nude-100 text-nude-400 cursor-not-allowed'
                          : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
                      )}>
                      <ShoppingBag size={13}/>
                      {p.stock === 0 ? 'Tükendi' : 'Sepete Ekle'}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(p.id)}
                      className="p-2.5 rounded-xl border border-nude-200 text-nude-400 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 size={13}/>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
