// src/components/ui/EmptyState.tsx
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
interface Props { icon: LucideIcon; title: string; description?: string; action?: { label: string; href: string } }
export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-nude-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-nude-400" />
      </div>
      <h3 className="font-display text-2xl font-light text-charcoal mb-2">{title}</h3>
      {description && <p className="font-body text-sm text-nude-500 max-w-xs">{description}</p>}
      {action && <Link href={action.href} className="btn-outline mt-6 text-sm px-6 py-2.5">{action.label}</Link>}
    </div>
  )
}
