// src/components/ui/QuantitySelector.tsx
'use client'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function QuantitySelector({
  value, min = 1, max = 999, onChange, size = 'md', className
}: QuantitySelectorProps) {
  const sizeMap = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11' }
  const dec = () => value > min && onChange(value - 1)
  const inc = () => value < max && onChange(value + 1)

  return (
    <div className={cn('flex items-center border border-nude-200 bg-white', className)}>
      <button onClick={dec} disabled={value <= min}
        className={cn('flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40', sizeMap[size])}>
        <Minus size={size === 'sm' ? 11 : size === 'lg' ? 16 : 13} />
      </button>
      <span className={cn('flex items-center justify-center font-body font-medium', sizeMap[size])}>{value}</span>
      <button onClick={inc} disabled={value >= max}
        className={cn('flex items-center justify-center hover:bg-nude-50 transition-colors disabled:opacity-40', sizeMap[size])}>
        <Plus size={size === 'sm' ? 11 : size === 'lg' ? 16 : 13} />
      </button>
    </div>
  )
}
