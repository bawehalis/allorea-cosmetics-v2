'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { Product } from '@/types'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  layout?: 'grid' | 'list'
}

export default function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore()

  const mainImage = product.images[imgIdx] || product.images[0]
  const hoverImage = product.images[1] || product.images[0]
  const discount = calculateDiscount(product.price, product.comparePrice)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    setIsAdding(true)
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || '',
      stock: product.stock,
    })
    toast.success(`${product.name} çantaya eklendi`)
    setTimeout(() => { setIsAdding(false); openCart() }, 400)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast.success(isWishlisted ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi')
  }

  if (layout === 'list') {
    return (
      <Link href={`/product/${product.slug}`} className="group flex gap-5 p-4 bg-white hover:shadow-md transition-shadow">
        <div className="relative w-28 h-36 shrink-0 bg-nude-50 overflow-hidden">
          <Image src={mainImage?.url || ''} alt={product.name} fill className="object-cover" sizes="112px" />
        </div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <p className="font-body text-xs text-nude-500 uppercase tracking-wider mb-1">{product.category.name}</p>
            <h3 className="font-display text-lg font-light text-charcoal group-hover:text-brand-600 transition-colors">{product.name}</h3>
            <p className="font-body text-sm text-nude-500 mt-2 line-clamp-2">{product.description}</p>
            {product.averageRating && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= Math.round(product.averageRating!) ? 'text-brand-400 fill-brand-400' : 'text-nude-200 fill-nude-200'} />)}</div>
                <span className="font-body text-xs text-nude-500">({product.reviewCount})</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="font-body font-semibold text-charcoal">{formatPrice(product.price)}</span>
              {product.comparePrice && <span className="font-body text-sm text-nude-400 line-through">{formatPrice(product.comparePrice)}</span>}
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0 || isAdding} className="btn-primary text-xs px-5 py-2.5">
              {product.stock === 0 ? 'Tükendi' : 'Çantaya Ekle'}
            </button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="card-product">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="product-image-wrapper"
          onMouseEnter={() => product.images.length > 1 && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}
        >
          <Image
            src={imgIdx === 0 ? mainImage?.url || '' : hoverImage?.url || ''}
            alt={mainImage?.alt || product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && <span className="badge-new">New</span>}
            {discount > 0 && <span className="badge-sale">-{discount}%</span>}
            {product.isBestSeller && !product.isNew && <span className="badge-bestseller">Best Seller</span>}
          </div>

          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={cn(
                'w-9 h-9 flex items-center justify-center bg-white shadow-md hover:bg-brand-50 transition-colors',
                isWishlisted && 'text-red-500'
              )}
              aria-label="Add to wishlist"
            >
              <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="w-9 h-9 flex items-center justify-center bg-white shadow-md hover:bg-brand-50 transition-colors"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Add to bag overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className={cn(
                'w-full py-3.5 font-body text-xs tracking-widest uppercase font-medium transition-colors',
                product.stock === 0
                  ? 'bg-nude-300 text-nude-600 cursor-not-allowed'
                  : 'bg-charcoal text-white hover:bg-brand-700',
                isAdding && 'bg-brand-600'
              )}
            >
              {product.stock === 0 ? 'Tükendi' : isAdding ? 'Eklendi!' : 'Çantaya Ekle'}
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-nude-500 mb-1">{product.category.name}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors leading-snug mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.averageRating && product.reviewCount ? (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={cn(
                    s <= Math.round(product.averageRating!)
                      ? 'text-brand-400 fill-brand-400'
                      : 'text-nude-200 fill-nude-200'
                  )}
                />
              ))}
            </div>
            <span className="font-body text-xs text-nude-500">({product.reviewCount})</span>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-charcoal text-sm">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="font-body text-xs text-nude-400 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
