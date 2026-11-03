import { Volume2 } from 'lucide-react'
import { speak } from '@/lib/speech'

export function SpeakButton({
  text,
  size = 17,
  compact = false,
  className = '',
}: {
  text: string
  size?: number
  compact?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        speak(text)
      }}
      aria-label={`Прослушать: ${text}`}
      className={`inline-flex ${compact ? 'size-9' : 'size-10'} shrink-0 items-center justify-center rounded-full text-ink-3 transition-colors active:bg-surface ${className}`}
    >
      <Volume2 size={size} strokeWidth={1.5} />
    </button>
  )
}
