'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { cn, calculateDiscount } from '@/lib/utils'
import toast from 'react-hot-toast'

// Product — DB'den veya mock-data'dan gelen genel tip
interface ProductCardData {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  stock: number
  isActive?: boolean
  isBestSeller?: boolean
  isNew?: boolean
  badge?: string
  images: { url: string; alt?: string }[]
  averageRating?: number
  reviewCount?: number
  category?: { name: string; slug: string }
  categorySlug?: string
}

interface ProductCardProps {
  product: ProductCardData
  layout?: 'grid' | 'list'
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-nude-100 text-nude-200'} />
      ))}
    </div>
  )
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [hovered,      setHovered]      = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding,     setIsAdding]     = useState(false)
  const { addItem, openCart } = useCartStore()

  const mainImage  = product.images[0]?.url || ''
  const hoverImage = product.images[1]?.url || mainImage
  const discount   = calculateDiscount(product.price, product.comparePrice)
  const rating     = product.averageRating ?? 4.8
  const reviews    = product.reviewCount   ?? 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    setIsAdding(true)
    addItem({
      productId: product.id,
      name:      product.name,
      slug:      product.slug,
      price:     product.price,
      quantity:  1,
      image:     mainImage,
      stock:     product.stock,
    })
    toast.success(`${product.name} sepete eklendi!`, { icon:'🛍️', duration:2500 })
    await new Promise(r => setTimeout(r, 600))
    setIsAdding(false)
    openCart()
  }

  if (layout === 'list') {
    return (
      <Link href={`/product/${product.slug}`}
        className="group flex gap-4 bg-white rounded-2xl border border-nude-100 p-4 hover:shadow-md hover:scale-[1.005] transition-all duration-200">
        <div className="relative w-24 h-24 shrink-0 bg-nude-50 rounded-xl overflow-hidden">
          <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="96px" />
          {discount > 0 && (
            <span className="absolute top-1 right-1 bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              -%{discount}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <StarRow rating={rating} />
            <span className="text-[10px] text-nude-400">({reviews})</span>
          </div>
          <p className="font-bold text-sm text-charcoal group-hover:text-brand-600 transition-colors">{product.name}</p>
          <p className="text-xs text-nude-500 mt-1 line-clamp-2">{product.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-black text-base text-charcoal">{product.price.toLocaleString('tr-TR')}₺</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-nude-400 line-through">{product.comparePrice.toLocaleString('tr-TR')}₺</span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          <button onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-black hover:bg-brand-700 transition-colors disabled:opacity-50">
            <ShoppingBag size={15}/>
            {product.stock === 0 ? 'Tükendi' : 'Ekle'}
          </button>
        </div>
      </Link>
    )
  }

  return (
    <div
      className="group relative bg-white rounded-2xl border border-nude-100 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Görsel */}
        <div className="relative aspect-square overflow-hidden bg-nude-50">
          <Image
            src={hovered && hoverImage !== mainImage ? hoverImage : mainImage}
            alt={product.name} fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />

          {/* Rozetler */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-charcoal text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Yeni</span>
            )}
            {product.badge && !product.isNew && (
              <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              -%{discount}
            </span>
          )}

          {/* Wishlist butonu */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted) }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
            style={{ top: discount > 0 ? '2.5rem' : '0.5rem' }}
          >
            <Heart size={14} className={cn(
              'transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-nude-500'
            )} />
          </button>

          {/* Hızlı sepete ekle */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 transition-transform duration-300',
            hovered ? 'translate-y-0' : 'translate-y-full'
          )}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={cn(
                'w-full py-3 font-black text-xs uppercase tracking-widest transition-colors',
                product.stock === 0
                  ? 'bg-nude-200 text-nude-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-green-600 text-white'
                  : 'bg-charcoal text-white hover:bg-brand-700'
              )}
            >
              {product.stock === 0 ? 'Tükendi' : isAdding ? '✓ Eklendi!' : 'Sepete Ekle'}
            </button>
          </div>

          {/* Tükendi overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="font-body text-xs font-bold uppercase tracking-widest text-nude-500 bg-white px-3 py-1.5 rounded-full border border-nude-200">
                Tükendi
              </span>
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div className="p-3.5">
          {(rating > 0 || reviews > 0) && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <StarRow rating={rating} />
              <span className="text-[10px] text-nude-400">({reviews})</span>
            </div>
          )}
          {product.category && (
            <p className="font-body text-[9px] uppercase tracking-widest text-nude-400 mb-0.5">
              {product.category.name}
            </p>
          )}
          <p className="font-body font-bold text-sm text-charcoal leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {product.name}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-base text-charcoal">
              {product.price.toLocaleString('tr-TR')}₺
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-nude-400 line-through">
                {product.comparePrice.toLocaleString('tr-TR')}₺
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
