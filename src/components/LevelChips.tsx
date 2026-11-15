import type { Level } from '@/content'

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export function LevelChips({
  level,
  counts,
  onChange,
}: {
  level: Level | 'all'
  counts: Map<Level, number>
  onChange: (level: Level | 'all') => void
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {LEVELS.map((item) => {
        const active = level === item
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`flex min-h-10 items-center gap-1.5 rounded-[10px] border px-3 text-[15px] ${
              active
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line bg-surface text-ink-2'
            }`}
          >
            <span className="num">{item}</span>
            <span className="text-[12px] text-ink-3">{counts.get(item) ?? 0}</span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => onChange('all')}
        className={`flex min-h-10 items-center rounded-[10px] border px-3 text-[15px] ${
          level === 'all'
            ? 'border-accent bg-accent-soft text-accent'
            : 'border-line bg-surface text-ink-2'
        }`}
      >
        Все
      </button>
    </div>
  )
}
