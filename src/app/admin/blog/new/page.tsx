// src/app/admin/blog/new/page.tsx
import BlogForm from '@/components/admin/BlogForm'
export const metadata = { title: 'New Blog Post' }
export default function NewBlogPostPage() { return <BlogForm mode="create" /> }
