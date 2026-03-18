// src/lib/validation.ts
// FIX: Removed invalid .toUpperCase() and .toLowerCase() Zod calls.
//      Zod strings do not have these methods — they cause a runtime TypeError.
//      Use .transform() instead for casing, or handle in the route handler.
import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Invalid email address').trim().transform((v: string) => v.toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email:    z.string().email('Invalid email').trim().transform((v: string) => v.toLowerCase()),
  password: z.string().min(8, 'At least 8 characters').max(100),
  name:     z.string().min(2, 'At least 2 characters').max(100).trim().optional(),
})

// ─── Product ──────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name:         z.string().min(2).max(200).trim(),
  slug:         z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only').optional(),
  description:  z.string().min(10).max(5000).trim(),
  ingredients:  z.string().max(5000).optional(),
  howToUse:     z.string().max(2000).optional(),
  price:        z.number({ invalid_type_error: 'Price must be a number' }).positive().max(99999),
  comparePrice: z.number().positive().max(99999).optional().nullable(),
  costPrice:    z.number().positive().optional().nullable(),
  sku:          z.string().min(2).max(100).trim(),
  barcode:      z.string().max(100).optional(),
  stock:        z.number({ invalid_type_error: 'Stock must be a number' }).int().min(0).max(999999),
  lowStockAt:   z.number().int().min(0).default(5),
  weight:       z.number().positive().optional().nullable(),
  isActive:     z.boolean().default(true),
  isFeatured:   z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNew:        z.boolean().default(false),
  categoryId:   z.string().cuid('Invalid category ID'),
  images: z.array(z.object({
    url:      z.string().url('Each image must be a valid URL'),
    alt:      z.string().max(200).optional(),
    position: z.number().int().min(0),
  })).min(1, 'At least one image is required'),
  tags: z.array(z.string().max(50)).optional(),
})

export const productUpdateSchema = productSchema.partial()

// ─── Order ────────────────────────────────────────────────────────────────────
export const orderStatusSchema = z.object({
  status:         z.enum(['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']),
  trackingNumber: z.string().max(200).optional(),
  note:           z.string().max(500).optional(),
})

// ─── Checkout ─────────────────────────────────────────────────────────────────
export const checkoutSchema = z.object({
  email:          z.string().email('Invalid email').trim().transform((v: string) => v.toLowerCase()),
  firstName:      z.string().min(1).max(100).trim(),
  lastName:       z.string().min(1).max(100).trim(),
  address1:       z.string().min(5).max(200).trim(),
  address2:       z.string().max(200).optional(),
  city:           z.string().min(2).max(100).trim(),
  state:          z.string().min(2).max(100).trim(),
  postalCode:     z.string().min(3).max(20).trim(),
  country:        z.string().min(2).max(100).trim(),
  phone:          z.string().max(30).optional(),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  couponCode:     z.string().max(50).optional(),
  items: z.array(z.object({
    productId: z.string().cuid('Invalid product ID'),
    quantity:  z.number().int().positive().max(100),
    variant:   z.string().optional(),
  })).min(1, 'At least one item is required'),
})

// ─── Category ─────────────────────────────────────────────────────────────────
export const categorySchema = z.object({
  name:        z.string().min(2).max(100).trim(),
  slug:        z.string().regex(/^[a-z0-9-]+$/, 'Lowercase, numbers and hyphens only').optional(),
  description: z.string().max(1000).optional(),
  image:       z.string().url().optional().nullable(),
  parentId:    z.string().cuid().optional().nullable(),
})

// ─── Coupon ───────────────────────────────────────────────────────────────────
export const couponSchema = z.object({
  // FIX: .toUpperCase() is not a Zod method. Use .transform() instead.
  code:        z.string().min(3).max(50).trim().transform(v => v.toUpperCase()),
  type:        z.enum(['PERCENTAGE', 'FIXED']),
  value:       z.number().positive(),
  minPurchase: z.number().min(0).optional().nullable(),
  maxUses:     z.number().int().positive().optional().nullable(),
  expiresAt:   z.string().datetime().optional().nullable(),
  isActive:    z.boolean().default(true),
})

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  // FIX: Use .transform() for case normalisation, not .toLowerCase()
  email: z.string().email('Invalid email address').trim().transform((v: string) => v.toLowerCase()),
  name:  z.string().max(100).optional(),
})

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().trim().transform((v: string) => v.toLowerCase()),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000).trim(),
})

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogPostSchema = z.object({
  title:       z.string().min(5).max(300).trim(),
  slug:        z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt:     z.string().min(20).max(500).trim(),
  content:     z.string().min(50).trim(),
  image:       z.string().url().optional().nullable(),
  authorName:  z.string().min(2).max(100).trim(),
  tags:        z.array(z.string().max(50)).optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
})

// ─── Inventory ────────────────────────────────────────────────────────────────
export const inventoryUpdateSchema = z.object({
  updates: z.array(z.object({
    productId: z.string().cuid(),
    stock:     z.number().int().min(0),
  })).min(1).max(100),
})

// ─── Review ───────────────────────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title:  z.string().max(200).optional(),
  body:   z.string().min(10).max(2000).trim(),
})
