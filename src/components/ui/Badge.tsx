// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils'
const variants = {
  default: 'bg-gray-100 text-gray-700',
  brand: 'bg-brand-100 text-brand-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  new: 'bg-brand-600 text-white',
  sale: 'bg-red-500 text-white',
}
export default function Badge({ label, variant = 'default', className }: { label: string; variant?: keyof typeof variants; className?: string }) {
  return <span className={cn('inline-block text-xs font-medium px-2.5 py-0.5 rounded-full tracking-wide', variants[variant], className)}>{label}</span>
}
