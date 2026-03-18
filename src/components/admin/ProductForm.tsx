// src/components/admin/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { ArrowLeft, Plus, X, Save, Eye, ImagePlus, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),
  price: z.number({ invalid_type_error: 'Enter a valid price' }).positive('Price must be positive'),
  comparePrice: z.number().positive().optional().nullable(),
  costPrice: z.number().positive().optional().nullable(),
  sku: z.string().min(2, 'SKU required'),
  stock: z.number({ invalid_type_error: 'Enter a valid number' }).int().min(0),
  lowStockAt: z.number().int().min(0).default(5),
  categoryId: z.string().min(1, 'Select a category'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(false),
  imageUrls: z.array(z.string().url('Enter a valid URL')).min(1, 'At least one image required'),
  tags: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface ProductFormProps {
  mode: 'create' | 'edit'
  productId?: string
}

const CATEGORIES = [
  { id: 'cat-1', name: 'Skincare', slug: 'skincare' },
  { id: 'cat-2', name: 'Makeup', slug: 'makeup' },
  { id: 'cat-3', name: 'Body Care', slug: 'body-care' },
  { id: 'cat-4', name: 'Fragrance', slug: 'fragrance' },
  { id: 'cat-5', name: 'Hair Care', slug: 'hair-care' },
  { id: 'cat-6', name: 'Serums', slug: 'serums' },
]

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(mode === 'edit')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'inventory' | 'seo'>('basic')

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { isActive: true, isFeatured: false, isBestSeller: false, isNew: false, stock: 0, lowStockAt: 5, imageUrls: [] },
  })

  const imageUrls = watch('imageUrls') || []

  useEffect(() => {
    if (mode === 'edit' && productId) {
      fetch(`/api/products/${productId}`)
        .then(r => r.json())
        .then(json => {
          const p = json.data
          reset({
            name: p.name, description: p.description, ingredients: p.ingredients || '',
            howToUse: p.howToUse || '', price: p.price, comparePrice: p.comparePrice,
            costPrice: p.costPrice, sku: p.sku, stock: p.stock, lowStockAt: p.lowStockAt,
            categoryId: p.category?.id || '', isActive: p.isActive, isFeatured: p.isFeatured,
            isBestSeller: p.isBestSeller, isNew: p.isNew,
            imageUrls: p.images?.map((img: any) => img.url) || [],
            tags: p.tags?.map((t: any) => t.tag).join(', ') || '',
          })
        })
        .finally(() => setFetchLoading(false))
    }
  }, [mode, productId, reset])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        images: data.imageUrls.map((url, i) => ({ url, alt: data.name, position: i })),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        comparePrice: data.comparePrice || null,
        costPrice: data.costPrice || null,
      }

      const url = mode === 'edit' ? `/api/products/${productId}` : '/api/products'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save product')
      }

      showToast('success', mode === 'edit' ? 'Product updated successfully!' : 'Product created successfully!')
      setTimeout(() => router.push('/admin/products'), 1200)
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return
    try { new URL(newImageUrl) } catch { showToast('error', 'Enter a valid image URL'); return }
    setValue('imageUrls', [...imageUrls, newImageUrl.trim()])
    setNewImageUrl('')
  }

  const removeImage = (idx: number) => {
    setValue('imageUrls', imageUrls.filter((_, i) => i !== idx))
  }

  const TABS = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'seo', label: 'Visibility' },
  ] as const

  if (fetchLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-96 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium transition-all',
          toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        )}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {mode === 'create' ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === 'create' ? 'Fill in the details to create a new product' : 'Update product information'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'edit' && productId && (
            <Link href={`/product/${productId}`} target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye size={15} /> Preview
            </Link>
          )}
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors">
            <Save size={15} />
            {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Ürün Oluştur' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form - 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex border-b border-gray-100">
                {TABS.map(tab => (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                    className={cn('px-5 py-3.5 text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'text-brand-600 border-b-2 border-brand-600 -mb-px'
                        : 'text-gray-500 hover:text-gray-700')}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* BASIC INFO TAB */}
                {activeTab === 'basic' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                      <input {...register('name')} placeholder="e.g. Allorea Radiance Serum"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description *</label>
                      <textarea {...register('description')} rows={4} placeholder="Describe this product clearly..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                      <select {...register('categoryId')}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white">
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
                    </div>
                  </div>
                )}

                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingredients</label>
                      <textarea {...register('ingredients')} rows={5}
                        placeholder="Water, Niacinamide, Sodium Hyaluronate..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">How to Use</label>
                      <textarea {...register('howToUse')} rows={3}
                        placeholder="Apply morning and evening to clean skin..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                      <input {...register('tags')} placeholder="brightening, vitamin-c, serum (comma separated)"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                      <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                    </div>
                  </div>
                )}

                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input type="number" step="0.01" {...register('price', { valueAsNumber: true })}
                            placeholder="0.00"
                            className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                        </div>
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Compare Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input type="number" step="0.01" {...register('comparePrice', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                            placeholder="0.00"
                            className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cost Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input type="number" step="0.01" {...register('costPrice', { valueAsNumber: true, setValueAs: v => v === '' ? null : Number(v) })}
                            placeholder="0.00"
                            className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
                        <input {...register('sku')} placeholder="ALR-SER-001"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono" />
                        {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity *</label>
                        <input type="number" {...register('stock', { valueAsNumber: true })} placeholder="0"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                        {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Alert At</label>
                        <input type="number" {...register('lowStockAt', { valueAsNumber: true })} placeholder="5"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* VISIBILITY TAB */}
                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    {[
                      { field: 'isActive', label: 'Active', desc: 'Show this product on the storefront' },
                      { field: 'isFeatured', label: 'Featured', desc: 'Ana sayfada Öne Çıkan Ürünler bölümünde göster' },
                      { field: 'isBestSeller', label: 'Best Seller', desc: 'En Çok Satanlar bölümünde göster' },
                      { field: 'isNew', label: 'New Arrival', desc: 'Ürün kartında Yeni etiketi göster' },
                    ].map(({ field, label, desc }) => (
                      <label key={field} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" {...register(field as keyof FormData)}
                          className="mt-0.5 w-4 h-4 accent-brand-600 rounded" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-5">
            {/* Product Images */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImagePlus size={16} /> Product Images
              </h3>

              {/* Image previews */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                      <Image src={url} alt={`Product ${i + 1}`} fill className="object-cover" sizes="80px" />
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-brand-600 text-white text-[9px] font-medium text-center py-0.5">
                          MAIN
                        </span>
                      )}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.imageUrls && (
                <p className="text-red-500 text-xs mb-3">{errors.imageUrls.message as string}</p>
              )}

              {/* Add image URL */}
              <div className="flex gap-2">
                <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-400" />
                <button type="button" onClick={addImage}
                  className="px-3 py-2 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Add image URLs. First image is the main image.</p>
            </div>

            {/* Quick stats for edit mode */}
            {mode === 'edit' && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Stock</span>
                    <span className="font-medium">{watch('stock')} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sale Price</span>
                    <span className="font-medium">${watch('price') || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full',
                      watch('isActive') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors">
              <Save size={16} />
              {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Ürün Oluştur' : 'Değişiklikleri Kaydet'}
            </button>

            <Link href="/admin/products"
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
