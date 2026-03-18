export interface Product {
  id: string
  name: string
  slug: string
  description: string
  ingredients?: string
  howToUse?: string
  price: number
  comparePrice?: number
  sku: string
  stock: number
  isActive: boolean
  isFeatured: boolean
  isBestSeller: boolean
  isNew: boolean
  category: Category
  images: ProductImage[]
  variants?: ProductVariant[]
  reviews?: Review[]
  averageRating?: number
  reviewCount?: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  position: number
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  stock: number
  sku?: string
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

export interface Review {
  id: string
  rating: number
  title?: string
  body: string
  isVerified: boolean
  createdAt: string
  user: {
    name?: string
  }
}

export interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  quantity: number
  image: string
  variant?: string
  stock: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  itemCount: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED' | 'FAILED'

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
  tags: string[]
  publishedAt?: string
  createdAt: string
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

export interface ShopFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'bestseller' | 'rating'
  page?: number
  limit?: number
  search?: string
}

export interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  saveAddress?: boolean
  notes?: string
}
