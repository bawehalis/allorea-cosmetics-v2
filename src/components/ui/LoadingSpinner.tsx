// src/components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils'
export default function LoadingSpinner({ size = 'md', className }: { size?: 'sm'|'md'|'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' }
  return <div className={cn('animate-spin rounded-full border-gray-200 border-t-brand-600', sizes[size], className)} />
}
