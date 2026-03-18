// src/app/admin/blog/page.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog?limit=50').then(r=>r.json()).then(j=>setPosts(j.data||[])).finally(()=>setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700">
          <Plus size={16}/> New Post
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Title','Author','Status','Published',''].map(h=>(
                <th key={h} className="text-left px-5 py-3.5 font-medium text-gray-600 text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? [...Array(5)].map((_,i)=><tr key={i}>{[...Array(5)].map((_,j)=><td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>)}</tr>)
            : posts.length===0 ? <tr><td colSpan={5} className="text-center py-12 text-gray-400">No posts yet</td></tr>
            : posts.map(post=>(
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900 truncate max-w-[280px]">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[280px]">{post.excerpt}</p>
                </td>
                <td className="px-4 py-4 text-gray-600">{post.authorName}</td>
                <td className="px-4 py-4">
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', post.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500')}>
                    {post.isPublished?'Published':'Draft'}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-500 text-xs">{post.publishedAt?formatDate(post.publishedAt):'—'}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Eye size={15}/></Link>
                    <Link href={`/admin/blog/${post.id}`} className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Edit2 size={15}/></Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
