// src/components/admin/BlogForm.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogFormProps {
  mode: 'create' | 'edit'
  postId?: string
}

interface FormState {
  title:       string
  slug:        string
  excerpt:     string
  content:     string
  image:       string
  authorName:  string
  tags:        string
  isPublished: boolean
}

const INITIAL: FormState = {
  title: '', slug: '', excerpt: '', content: '',
  image: '', authorName: '', tags: '', isPublished: false,
}

export default function BlogForm({ mode, postId }: BlogFormProps) {
  const router       = useRouter()
  const [loading, setLoading]         = useState(false)
  const [fetchLoading, setFetchLoading] = useState(mode === 'edit')
  const [toast, setToast]             = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [form, setForm]               = useState<FormState>(INITIAL)

  useEffect(() => {
    if (mode !== 'edit' || !postId) return
    fetch(`/api/blog/${postId}`)
      .then(r => r.json())
      .then(j => {
        const p = j.data
        if (!p) return
        setForm({
          title:       p.title       ?? '',
          slug:        p.slug        ?? '',
          excerpt:     p.excerpt     ?? '',
          content:     p.content     ?? '',
          image:       p.image       ?? '',
          authorName:  p.authorName  ?? '',
          tags:        Array.isArray(p.tags) ? p.tags.join(', ') : '',
          isPublished: p.isPublished ?? false,
        })
      })
      .finally(() => setFetchLoading(false))
  }, [mode, postId])

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  // FIX: explicit submit handler (not cast as any on button)
  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim() || !form.authorName.trim()) {
      showToast('error', 'Title, excerpt, content and author are required.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      const url    = mode === 'edit' ? `/api/blog/${postId}` : '/api/blog'
      const method = mode === 'edit' ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error ?? 'Failed to save post')
      }
      showToast('success', mode === 'edit' ? 'Post updated!' : 'Post published!')
      setTimeout(() => router.push('/admin/blog'), 1200)
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const up = (k: keyof FormState, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  if (fetchLoading) {
    return <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
  }

  return (
    <div className="max-w-4xl space-y-5">
      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-medium',
          toast.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        )}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'New Blog Post' : 'Edit Post'}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
        >
          <Save size={15} />
          {loading ? 'Saving…' : mode === 'create' ? 'Publish Post' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={e => up('title', e.target.value)}
                placeholder="Post title…"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={e => up('excerpt', e.target.value)}
                rows={3}
                placeholder="Brief summary shown in listings…"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content * (Markdown supported)</label>
              <textarea
                value={form.content}
                onChange={e => up('content', e.target.value)}
                rows={18}
                placeholder="Write your post content here…"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Post Settings</h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Author Name *</label>
              <input
                value={form.authorName}
                onChange={e => up('authorName', e.target.value)}
                placeholder="Dr. Isabelle Laurent"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Cover Image URL</label>
              <input
                value={form.image}
                onChange={e => up('image', e.target.value)}
                placeholder="https://…"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <input
                value={form.tags}
                onChange={e => up('tags', e.target.value)}
                placeholder="skincare, tips, routine"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">URL Slug (auto-generated if empty)</label>
              <input
                value={form.slug}
                onChange={e => up('slug', e.target.value)}
                placeholder="my-post-title"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={e => up('isPublished', e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Publish immediately</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-60 transition-colors"
          >
            <Save size={15} />
            {loading ? 'Saving…' : mode === 'create' ? 'Create Post' : 'Save Changes'}
          </button>

          <Link href="/admin/blog"
            className="w-full flex items-center justify-center py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}
