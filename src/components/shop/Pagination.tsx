// src/components/shop/Pagination.tsx
'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="w-10 h-10 flex items-center justify-center border border-nude-200 hover:border-charcoal hover:bg-charcoal hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) => p === '...' ? (
        <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-nude-400 font-body text-sm">...</span>
      ) : (
        <button key={p} onClick={() => onPageChange(p as number)}
          className={cn('w-10 h-10 font-body text-sm transition-all border',
            page === p
              ? 'bg-charcoal text-white border-charcoal'
              : 'border-nude-200 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white')}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
        className="w-10 h-10 flex items-center justify-center border border-nude-200 hover:border-charcoal hover:bg-charcoal hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
