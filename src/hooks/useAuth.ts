// src/hooks/useAuth.ts
// FIX: Removed unused createContext, useContext imports and dead AuthCtx interface.
'use client'
import { useState, useEffect, useCallback } from 'react'

export interface AuthUser {
  id:    string
  email: string
  name?: string
  role:  'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'
}

export function useAuth() {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const json = await res.json()
        setUser(json.data?.user ?? null)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
      window.location.href = '/'
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return {
    user,
    loading,
    logout,
    refresh,
    isAdmin:    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isLoggedIn: user !== null,
  }
}
