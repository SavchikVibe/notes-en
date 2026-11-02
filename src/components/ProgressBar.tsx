export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const percent = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className={`h-1 overflow-hidden rounded-full bg-line ${className}`}>
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
