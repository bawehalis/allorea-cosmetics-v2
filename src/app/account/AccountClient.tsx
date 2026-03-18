'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, LogOut, Edit2, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthUser {
  id: string
  email: string
  name?: string
  role: string
}

export default function AccountClient() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => {
        if (r.status === 401) {
          router.replace('/login?redirect=/account')
          return null
        }
        return r.json()
      })
      .then(j => {
        if (!j) return
        const u = j.data?.user
        if (!u) {
          router.replace('/login?redirect=/account')
          return
        }
        setUser(u)
        setName(u.name ?? '')
      })
      .catch(() => router.replace('/login?redirect=/account'))
      .finally(() => setLoading(false))
  }, [router])

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setUser(prev => (prev ? { ...prev, name: name.trim() } : prev))
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Could not save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading)
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-nude-400" />
      </div>
    )

  if (!user) return null

  return (
    <div className="bg-pearl min-h-screen">
      <div className="bg-white border-b border-nude-100">
        <div className="container-main py-8">
          <nav className="font-body text-xs text-nude-400 mb-2">
            <Link href="/" className="hover:text-charcoal">Home</Link> / My Account
          </nav>
          <h1 className="font-display text-4xl font-light text-charcoal">My Account</h1>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-nude-100 p-6">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-nude-100">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-body font-medium text-charcoal truncate">{user.name || 'Account'}</p>
                  <p className="font-body text-xs text-nude-400 truncate">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {[
                  { icon: User, label: 'Profile', href: '/account', active: true },
                  { icon: Package, label: 'My Orders', href: '/account/orders' },
                  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
                  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
                ].map(({ icon: Icon, label, href, active }) => (
                  <Link key={label} href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-nude-50 text-charcoal font-medium'
                        : 'text-nude-600 hover:text-charcoal hover:bg-nude-50'
                    )}>
                    <Icon size={16} /> {label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mt-2">
                  <LogOut size={16} /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-nude-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-charcoal">Profile Details</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 text-sm text-nude-600 hover:text-charcoal">
                    <Edit2 size={14} /> Edit
                  </button>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 mb-4">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-nude-400 mb-1 uppercase tracking-wider">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-nude-200 text-sm focus:outline-none focus:border-charcoal"
                      />
                    ) : (
                      <p className="text-sm text-charcoal">{user.name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-nude-400 mb-1 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-sm text-charcoal">{user.email}</p>
                  </div>
                </div>

                {editing && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary text-sm px-6 py-2.5 gap-2 flex items-center disabled:opacity-60">
                      {saving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : saved ? (
                        <CheckCircle size={15} />
                      ) : null}
                      {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setName(user.name ?? '') }}
                      className="text-sm text-nude-500 hover:text-charcoal">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Package, title: 'My Orders', desc: 'Track and manage orders', href: '/account/orders' },
                { icon: Heart, title: 'Wishlist', desc: 'Your saved products', href: '/wishlist' },
              ].map(({ icon: Icon, title, desc, href }) => (
                <Link key={title} href={href}
                  className="bg-white border border-nude-100 p-6 hover:border-nude-300 transition-colors">
                  <Icon size={24} className="text-brand-500 mb-3" />
                  <p className="font-medium text-charcoal">{title}</p>
                  <p className="text-sm text-nude-500 mt-1">{desc}</p>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
