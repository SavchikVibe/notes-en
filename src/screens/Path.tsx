import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { units } from '@/content'
import { getAllLessonProgress, type LessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { ProgressBar } from '@/components/ProgressBar'

export default function PathScreen() {
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)

  useEffect(() => {
    void getAllLessonProgress().then(setProgress)
  }, [])

  const data = progress ?? {}
  const done = units.filter((unit) => data[unit.id]?.status === 'done').length
  const percent = units.length > 0 ? done / units.length : 0

  return (
    <>
      <AppBar title="Путь" subtitle="Курс английского" />

      <main className="pb-10">
        <div className="px-5 pt-6">
          <div className="flex items-end justify-between">
            <h2 className="text-[28px] leading-none">A1</h2>
            <span className="num text-[13px] text-ink-3">
              {done} / {units.length}
            </span>
          </div>
          <ProgressBar value={percent} className="mt-3" />
          <p className="mt-2 text-[15px] text-ink-2">
            Начало пути: to be, местоимения, Present Simple.
          </p>
        </div>

        <ul className="mt-6">
          {units.map((unit) => {
            const item = data[unit.id]
            return (
              <li key={unit.id} className="border-t border-line last:border-b">
                <Link
                  to={`/lesson/${unit.id}`}
                  className="flex min-h-[68px] items-center gap-3 px-5 py-3 active:bg-surface"
                >
                  <span className="num w-6 text-[13px] text-ink-3">
                    {String(unit.order).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[17px] text-ink">{unit.title}</p>
                    <p className="truncate text-[13px] text-ink-3">{unit.subtitle ?? unit.goal}</p>
                  </div>
                  {item?.status === 'done' ? (
                    <span className="flex size-7 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check size={16} strokeWidth={2} />
                    </span>
                  ) : item?.status === 'in_progress' ? (
                    <span className="num text-[13px] text-ink-3">
                      {Math.round(
                        ((item.exerciseIndex + 1) / unit.exercises.length) * 100,
                      )}
                      %
                    </span>
                  ) : (
                    <ChevronRight size={18} strokeWidth={1.5} className="text-ink-3" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
