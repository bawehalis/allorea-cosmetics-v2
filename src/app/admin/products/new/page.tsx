// src/app/admin/products/new/page.tsx
import ProductForm from '@/components/admin/ProductForm'
export const metadata = { title: 'Add Product' }
export default function NewProductPage() {
  return <ProductForm mode="create" />
}
