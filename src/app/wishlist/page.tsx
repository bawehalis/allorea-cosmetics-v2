// src/app/wishlist/page.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { PRODUCTS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import toast from 'react-hot-toast'

// In production this would read from DB/auth; using mock for demo

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(PRODUCTS.slice(0, 4))
  const { addItem, openCart } = useCartStore()

  const remove = (id: string) => {
    setWishlist(w => w.filter(p => p.id !== id))
    toast.success('Removed from wishlist')
  }

  const moveToCart = (product: (typeof PRODUCTS)[0]) => {
    addItem({ productId: product.id, name: product.name, slug: product.slug, price: product.price, quantity: 1, image: product.images[0]?.url || '', stock: product.stock })
    remove(product.id)
    openCart()
  }

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <p className="font-body text-xs text-nude-400 mb-2">Home / Wishlist</p>
          <h1 className="font-display text-4xl font-light text-charcoal">Favorilerim</h1>
          <p className="font-body text-sm text-nude-500 mt-1">{wishlist.length} saved items</p>
        </div>
      </div>

      <div className="container-main py-10">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-nude-300 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-light text-charcoal mb-3">Favori listeniz boş</h2>
            <p className="font-body text-nude-500 mb-8">Save items you love to come back to later.</p>
            <Link href="/shop" className="btn-primary gap-2">Browse Products <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map(product => (
              <div key={product.id} className="bg-white group relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-nude-50">
                  <Image src={product.images[0]?.url || ''} alt={product.name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" />
                  <button onClick={() => remove(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-body text-xs text-nude-400 uppercase tracking-wider mb-1">{product.category.name}</p>
                  <Link href={`/product/${product.slug}`}>
                    <p className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors line-clamp-2 mb-2">{product.name}</p>
                  </Link>
                  <p className="font-body font-semibold text-charcoal text-sm mb-3">{formatPrice(product.price)}</p>
                  <button onClick={() => moveToCart(product)} disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-charcoal text-white text-xs tracking-widest uppercase font-body hover:bg-brand-700 transition-colors disabled:opacity-50">
                    <ShoppingBag size={14} />{product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
