import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

export function AppBar({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-line bg-paper px-5"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex min-h-14 items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад"
            className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink-2 active:bg-surface"
          >
            <ArrowLeft size={22} strokeWidth={1.5} />
          </button>
        )}
        <div className="min-w-0 flex-1 py-2">
          <h1 className="truncate font-serif text-[20px] leading-tight text-ink">{title}</h1>
          {subtitle && <p className="truncate text-[13px] leading-tight text-ink-3">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}
