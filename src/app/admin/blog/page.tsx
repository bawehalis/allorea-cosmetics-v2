// src/app/admin/blog/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, FileText, RefreshCw } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'

interface Post {
  id: string; title: string; slug: string; authorName: string
  isPublished: boolean; publishedAt?: string; createdAt: string
  tags: string[]
}

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/blog?admin=true')
      const json = await res.json()
      setPosts(json.data || [])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/blog/${id}`, { method:'DELETE' })
    fetch_()
  }

  const togglePublish = async (post: Post) => {
    await fetch(`/api/blog/${post.id}`, {
      method:'PATCH',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    })
    fetch_()
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Yazıları</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} yazı · {posts.filter(p=>p.isPublished).length} yayında</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetch_} className="p-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50">
            <RefreshCw size={15} className={loading ? 'animate-spin text-brand-600' : 'text-gray-500'}/>
          </button>
          <Link href="/admin/blog/new"
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors">
            <Plus size={16}/> Yeni Yazı
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Başlık veya yazar ara..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-400"/>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Başlık</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden md:table-cell">Yazar</th>
              <th className="text-center px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">Durum</th>
              <th className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide hidden lg:table-cell">Tarih</th>
              <th className="text-right px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wide">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_,i) => (
                <tr key={i}>{[...Array(5)].map((_,j) => (
                  <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse"/></td>
                ))}</tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                <FileText size={32} className="mx-auto mb-2 opacity-30"/>
                <p>Yazı bulunamadı</p>
              </td></tr>
            ) : filtered.map(post => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={14} className="text-brand-600"/>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate max-w-[260px] group-hover:text-brand-600">
                        {post.title}
                      </p>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {post.tags?.slice(0,2).map(t => (
                          <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-600">{post.authorName}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full',
                    post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {post.isPublished ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <p className="text-xs text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => togglePublish(post)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-brand-600"
                      title={post.isPublished ? 'Taslağa al' : 'Yayına al'}>
                      {post.isPublished ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                    <Link href={`/admin/blog/${post.id}`}
                      className="p-2 rounded-xl hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600">
                      <Edit2 size={14}/>
                    </Link>
                    <button onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
                      <Trash2 size={14}/>
                    </button>
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
