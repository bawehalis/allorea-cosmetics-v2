// src/types/index.ts

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
  variant?: string      // "1 Adet", "3 Adet Paket" vb.
  bundleLabel?: string  // paket etiketi
  stock: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  sku: string
  stock: number
  lowStockAt?: number
  isActive: boolean
  isFeatured: boolean
  isBestSeller: boolean
  isNew: boolean
  category: { id: string; name: string; slug: string }
  images: { id: string; url: string; alt?: string; position: number }[]
  variants?: { id: string; name: string; value: string; price?: number; stock: number }[]
  reviews?: { rating: number }[]
  averageRating?: number
  reviewCount?: number
  tags?: string[]
  costPrice?: number
  badge?: string
  categorySlug?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  items: OrderItem[]
  address?: Address
  user?: { id: string; name?: string }
  email?: string
  notes?: string
  stripePaymentId?: string
  createdAt: string
  updatedAt?: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  bundleLabel?: string
  variant?: string
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export type OrderStatus   = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED'
export type PaymentMethod = 'card' | 'cod' | 'whatsapp' | 'stripe'

export interface User {
  id: string
  email: string
  name?: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  authorName: string
  isPublished?: boolean
  tags: string[]
  publishedAt?: string
  createdAt: string
}

export interface ShopFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  limit?: number
  search?: string
  featured?: boolean
  sale?: boolean
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
