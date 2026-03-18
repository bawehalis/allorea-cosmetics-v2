'use client'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductFaq } from '@/lib/mock-data'

export default function FaqAccordion({ faqs }: { faqs: ProductFaq[] }) {
  const [open, setOpen] = useState<number|null>(0)

  return (
    <div className="space-y-1.5">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={cn(
            'border-2 transition-colors duration-150',
            isOpen ? 'border-red-600 bg-red-50' : 'border-nude-200 bg-white'
          )}>
            <button onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className={cn('font-bold text-sm pr-4 leading-snug',
                isOpen ? 'text-red-700' : 'text-charcoal')}>
                {faq.question}
              </span>
              <div className={cn(
                'w-7 h-7 flex items-center justify-center shrink-0 transition-colors border-2',
                isOpen ? 'bg-red-600 border-red-600 text-white' : 'bg-nude-100 border-nude-200 text-nude-500'
              )}>
                {isOpen ? <Minus size={13} /> : <Plus size={13} />}
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-sm text-nude-700 leading-relaxed border-t border-red-200 pt-3">{faq.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
