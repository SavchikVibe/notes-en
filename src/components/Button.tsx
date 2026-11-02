import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink active:opacity-90 disabled:bg-line disabled:text-ink-3 disabled:opacity-100',
  secondary:
    'border border-line-strong bg-surface text-ink active:bg-paper disabled:border-line disabled:text-ink-3',
  ghost: 'text-ink-2 active:bg-surface disabled:text-ink-3',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex min-h-[52px] select-none items-center justify-center gap-2 rounded-[10px] px-5 text-[17px] font-medium transition-opacity disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    />
  )
}
