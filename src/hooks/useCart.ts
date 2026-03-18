// src/hooks/useCart.ts
// Convenience wrapper around the Zustand cart store.
// All cart state and mutations in one clean hook.
'use client'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AddToCartItem {
  productId: string
  name:      string
  slug:      string
  price:     number
  image:     string
  stock:     number
  variant?:  string
}

export function useCart() {
  const store = useCartStore()

  const addToCart = (item: AddToCartItem, quantity = 1) => {
    store.addItem({ ...item, quantity })
    toast.success(`${item.name} added to bag`, { duration: 2500 })
  }

  const removeFromCart = (id: string, name?: string) => {
    store.removeItem(id)
    toast.success(name ? `${name} removed` : 'Item removed')
  }

  return {
    items:             store.items,
    isOpen:            store.isOpen,
    itemCount:         store.itemCount(),
    subtotal:          store.subtotal(),
    formattedSubtotal: formatPrice(store.subtotal()),
    addToCart,
    removeFromCart,
    updateQuantity:    store.updateQuantity,
    clearCart:         store.clearCart,
    openCart:          store.openCart,
    closeCart:         store.closeCart,
    toggleCart:        store.toggleCart,
  }
}
