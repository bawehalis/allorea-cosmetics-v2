// src/app/admin/blog/[id]/page.tsx
import BlogForm from '@/components/admin/BlogForm'
export const metadata = { title: 'Edit Blog Post' }
export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  return <BlogForm mode="edit" postId={params.id} />
}
