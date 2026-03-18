// src/app/admin/products/[id]/page.tsx
import ProductForm from '@/components/admin/ProductForm'
export const metadata = { title: 'Edit Product' }
export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductForm mode="edit" productId={params.id} />
}
