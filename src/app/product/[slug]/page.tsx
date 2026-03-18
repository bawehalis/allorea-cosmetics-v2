'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingBag, Minus, Plus, ChevronDown, Shield, Truck, RefreshCw, Check } from 'lucide-react'
import { PRODUCTS } from '@/lib/mock-data'
import { useCartStore } from '@/store/cart'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'
import { notFound } from 'next/navigation'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find(p => p.slug === params.slug)
  if (!product) notFound()

  const [selectedImg, setSelectedImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [openTab, setOpenTab] = useState<string | null>('description')
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, openCart } = useCartStore()
  const discount = calculateDiscount(product.price, product.comparePrice)

  const related = PRODUCTS.filter(p => p.category.id === product.category.id && p.id !== product.id).slice(0, 4)

  const handleAddToCart = async () => {
    if (product.stock === 0) return
    setIsAdding(true)
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.images[0]?.url || '',
      stock: product.stock,
    })
    toast.success(`${product.name} added to bag`)
    setTimeout(() => { setIsAdding(false); openCart() }, 500)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setTimeout(() => { window.location.href = '/checkout' }, 600)
  }

  const TABS = [
    { id: 'description', label: 'Açıklama', content: product.description },
    { id: 'ingredients', label: 'İçindekiler', content: product.ingredients },
    { id: 'how-to-use', label: 'Nasıl Kullanılır', content: product.howToUse },
  ].filter(t => t.content)

  return (
    <div className="bg-pearl min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-4">
          <nav className="font-body text-xs text-nude-400 flex items-center gap-2">
            <Link href="/" className="hover:text-charcoal">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-charcoal">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-charcoal">{product.category.name}</Link>
            <span>/</span>
            <span className="text-charcoal truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="hidden sm:flex flex-col gap-3 w-20 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImg(i)}
                    className={cn(
                      'relative w-20 h-24 overflow-hidden border-2 transition-all',
                      selectedImg === i ? 'border-charcoal' : 'border-transparent hover:border-nude-300'
                    )}
                  >
                    <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1">
              <div className="relative aspect-square overflow-hidden bg-nude-100 sticky top-24">
                <Image
                  src={product.images[selectedImg]?.url || product.images[0]?.url || ''}
                  alt={product.images[selectedImg]?.alt || product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="badge-sale text-sm px-3 py-1">-{discount}% OFF</span>
                  </div>
                )}
              </div>
              {/* Mobile thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3 sm:hidden">
                  {product.images.map((img, i) => (
                    <button key={img.id} onClick={() => setSelectedImg(i)}
                      className={cn('relative w-16 h-20 overflow-hidden border-2 transition-all',
                        selectedImg === i ? 'border-charcoal' : 'border-transparent')}>
                      <Image src={img.url} alt={product.name} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-1">
              <Link href={`/shop?category=${product.category.slug}`} className="font-body text-xs tracking-[0.2em] uppercase text-nude-500 hover:text-brand-600 transition-colors">
                {product.category.name}
              </Link>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-light text-charcoal mb-4 leading-tight">{product.name}</h1>

            {/* Rating */}
            {product.averageRating && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={15} className={cn(s <= Math.round(product.averageRating!) ? 'text-brand-400 fill-brand-400' : 'text-nude-200 fill-nude-200')} />
                  ))}
                </div>
                <span className="font-body text-sm text-nude-500">{product.averageRating} ({product.reviewCount} yorum)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl font-light text-charcoal">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="font-body text-lg text-nude-400 line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="badge-sale">İndirim</span>
                </>
              )}
            </div>

            <p className="font-body text-sm text-nude-600 leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 10 ? (
                <><Check size={14} className="text-green-600" /><span className="font-body text-sm text-green-700">Stokta Var</span></>
              ) : product.stock > 0 ? (
                <><Check size={14} className="text-amber-600" /><span className="font-body text-sm text-amber-700">Sınırlı stok — hemen sipariş verin</span></>
              ) : (
                <span className="font-body text-sm text-red-600">Tükendi</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-stretch gap-3 mb-4">
              <div className="flex items-center border border-nude-200 bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-nude-50 transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-12 text-center font-body text-sm font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-12 h-full flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40">
                  <Plus size={15} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAdding}
                className={cn('flex-1 btn-primary gap-2', isAdding && 'bg-green-700')}
              >
                <ShoppingBag size={18} />
                {product.stock === 0 ? 'Tükendi' : isAdding ? 'Eklendi!' : 'Çantaya Ekle'}
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn('w-14 border border-nude-200 flex items-center justify-center hover:border-charcoal transition-colors',
                  isWishlisted && 'border-red-300 text-red-500')}
                aria-label="Add to wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full btn-outline mb-8"
            >
              Hemen Al
            </button>

            {/* Trust Icons */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-nude-50">
              {[
                { icon: Truck, text: '75$ üzeri ücretsiz kargo' },
                { icon: RefreshCw, text: '30 günlük ücretsiz iade' },
                { icon: Shield, text: 'Güvenli ödeme' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 text-center">
                  <Icon size={20} className="text-brand-500" />
                  <span className="font-body text-xs text-nude-600 leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* Accordion tabs */}
            <div className="space-y-0 border-t border-nude-200">
              {TABS.map(tab => (
                <div key={tab.id} className="border-b border-nude-200">
                  <button
                    onClick={() => setOpenTab(openTab === tab.id ? null : tab.id)}
                    className="flex items-center justify-between w-full py-4 font-body text-sm font-medium text-charcoal"
                  >
                    {tab.label}
                    <ChevronDown size={15} className={cn('transition-transform', openTab === tab.id && 'rotate-180')} />
                  </button>
                  {openTab === tab.id && (
                    <div className="pb-5 font-body text-sm text-nude-600 leading-relaxed">
                      {tab.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-20">
          <div className="border-t border-nude-200 pt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="font-display text-3xl font-light text-charcoal">Müşteri Yorumları</h2>
                {product.averageRating && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={cn(s <= Math.round(product.averageRating!) ? 'text-brand-400 fill-brand-400' : 'text-nude-200 fill-nude-200')} />)}</div>
                    <span className="font-body text-sm text-nude-500">{product.averageRating} üzerinden 5 · {product.reviewCount} yorum</span>
                  </div>
                )}
              </div>
              <button className="btn-outline text-xs px-6 py-3">Yorum Yaz</button>
            </div>

            {/* Placeholder yorum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Sarah M.', rating: 5, date: 'Mayıs 2024', title: 'Cildiniz için oyun değiştirici!', body: '3 aydır kullanıyorum ve fark inanılmaz. Cildim çok daha parlak ve pürüzsüz. Her kuruşuna değer.', verified: true },
                { name: 'Emma L.', rating: 5, date: 'Nisan 2024', title: 'Vazgeçilmez ürün', body: 'Başta şüpheciydim ama gerçekten işe yarıyor. Hiperpigmentasyonum belirgin biçimde azaldı ve cilt tenim çok daha düzgün.', verified: true },
                { name: 'Priya K.', rating: 4, date: 'Nisan 2024', title: 'Dokusu harika', body: 'Hafif ve hızla emiliyor, yapışkan kalıntı bırakmıyor. Cildim çok nemlendi. Pompası bazen takıldığı için 4 yıldız veriyorum.', verified: false },
                { name: 'Chloe R.', rating: 5, date: 'Mart 2024', title: 'Kategorisinin en iyisi', body: 'Pek çok C vitamini serumu denedim, bu açık ara en iyisi. Formül kararlı ve haftalar içinde sonuçları görebiliyorsunuz.', verified: true },
              ].map((review, i) => (
                <div key={i} className="bg-white p-6 border border-nude-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex mb-1">{[1,2,3,4,5].map(s => <Star key={s} size={13} className={cn(s <= review.rating ? 'text-brand-400 fill-brand-400' : 'text-nude-200 fill-nude-200')} />)}</div>
                      <h4 className="font-body font-semibold text-sm text-charcoal">{review.title}</h4>
                    </div>
                    {review.verified && <span className="badge badge-new text-[9px]">Doğrulanmış Satın Alma</span>}
                  </div>
                  <p className="font-body text-sm text-nude-600 leading-relaxed mb-3">{review.body}</p>
                  <p className="font-body text-xs text-nude-400">{review.name} · {review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-nude-200 pt-16">
            <h2 className="font-display text-3xl font-light text-charcoal mb-10">Bunları da Beğenebilirsiniz</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
