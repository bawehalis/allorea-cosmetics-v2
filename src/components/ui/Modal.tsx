// src/components/ui/Modal.tsx
'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white w-full shadow-2xl', SIZES[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-nude-100">
            <h2 className="font-display text-xl font-light text-charcoal">{title}</h2>
            <button onClick={onClose} className="p-1 hover:text-brand-600 transition-colors"><X size={18} /></button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-3 right-3 p-1 hover:text-brand-600 transition-colors z-10">
            <X size={18} />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
