'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore()
  const total = subtotal()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const freeShippingThreshold = 75
  const remaining = Math.max(0, freeShippingThreshold - total)
  const progress = Math.min(100, (total / freeShippingThreshold) * 100)

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-charcoal/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-nude-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-charcoal" />
            <h2 className="font-display text-xl font-light tracking-wide">
              Çantanız
              {items.length > 0 && (
                <span className="font-body text-sm text-nude-500 ml-2">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center hover:bg-nude-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 py-4 bg-nude-50 border-b border-nude-100">
            {remaining > 0 ? (
              <p className="font-body text-xs text-charcoal mb-2">
                Add <span className="font-medium text-brand-700">{formatPrice(remaining)}</span> more for <span className="font-medium">free shipping</span>
              </p>
            ) : (
              <p className="font-body text-xs font-medium text-green-700 mb-2">🎉 You've unlocked free shipping!</p>
            )}
            <div className="h-1.5 bg-nude-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-nude-100 flex items-center justify-center">
                <ShoppingBag size={32} className="text-nude-400" />
              </div>
              <div>
                <p className="font-display text-xl font-light text-charcoal mb-2">Çantanız boş</p>
                <p className="font-body text-sm text-nude-500">Ürün ekleyerek başlayın</p>
              </div>
              <button onClick={closeCart} className="btn-outline text-xs px-6 py-3">
                Alışverişe Devam
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-nude-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-5">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="shrink-0">
                    <div className="w-20 h-24 bg-nude-50 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/product/${item.slug}`} onClick={closeCart}>
                        <p className="font-body text-sm font-medium text-charcoal hover:text-brand-600 transition-colors leading-snug">
                          {item.name}
                        </p>
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-nude-400 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    {item.variant && (
                      <p className="font-body text-xs text-nude-500 mt-0.5">{item.variant}</p>
                    )}
                    <p className="font-body text-sm font-semibold text-charcoal mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-nude-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center font-body text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-body text-xs text-nude-400">
                        {item.stock <= 5 ? `Only ${item.stock} left` : ''}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-nude-100 p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-nude-600">Ara Toplam</span>
              <span className="font-body font-semibold text-charcoal">{formatPrice(total)}</span>
            </div>
            <p className="font-body text-xs text-nude-500">Shipping and taxes calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center gap-2"
            >
              Ödeme <ArrowRight size={16} />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block text-center font-body text-sm text-nude-600 hover:text-charcoal transition-colors underline underline-offset-2"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
