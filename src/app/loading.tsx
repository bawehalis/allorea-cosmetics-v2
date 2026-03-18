// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-nude-200 border-t-brand-500 rounded-full animate-spin" />
        <p className="font-body text-sm text-nude-400 tracking-wider uppercase">Loading</p>
      </div>
    </div>
  )
}
