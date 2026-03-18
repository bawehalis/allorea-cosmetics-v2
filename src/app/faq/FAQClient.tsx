'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    question: 'Sipariş ne zaman gelir?',
    answer: 'Genellikle 2-5 iş günü içinde teslim edilir.',
  },
  {
    question: 'İade var mı?',
    answer: 'Evet, 14 gün içinde iade edebilirsiniz.',
  },
]

export default function FAQClient() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="container-main py-16">
      <h1 className="text-3xl mb-6">Sıkça Sorulan Sorular</h1>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="border p-4">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex justify-between w-full">
              {faq.question}
              <ChevronDown />
            </button>

            {open === i && (
              <p className="mt-3 text-sm text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
