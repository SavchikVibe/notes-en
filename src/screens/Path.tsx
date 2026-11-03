import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { units, levelNumber } from '@/content'
import { getAllLessonProgress, type LessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { ProgressBar } from '@/components/ProgressBar'

const LEVEL_NOTES: Record<string, string> = {
  A1: 'Начало пути: to be, местоимения, Present Simple.',
  A2: 'Быт, работа, учёба и прошлое.',
  B1: 'Мнения, истории и планы.',
  B2: 'Академический английский и IELTS.',
  C1: 'Свободная речь и стиль.',
}

export default function PathScreen() {
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)

  useEffect(() => {
    void getAllLessonProgress().then(setProgress)
  }, [])

  const data = progress ?? {}
  const levels = [...new Set(units.map((unit) => unit.level))]

  return (
    <>
      <AppBar title="Путь" subtitle="Курс английского" />

      <main className="pb-10">
        {levels.map((level) => {
          const levelUnits = units.filter((unit) => unit.level === level)
          const levelDone = levelUnits.filter((unit) => data[unit.id]?.status === 'done').length

          return (
            <section key={level}>
              <div className="px-5 pt-6">
                <div className="flex items-end justify-between">
                  <h2 className="text-[28px] leading-none">{level}</h2>
                  <span className="num text-[13px] text-ink-3">
                    {levelDone} / {levelUnits.length}
                  </span>
                </div>
                <ProgressBar
                  value={levelUnits.length > 0 ? levelDone / levelUnits.length : 0}
                  className="mt-3"
                />
                {LEVEL_NOTES[level] && (
                  <p className="mt-2 text-[15px] text-ink-2">{LEVEL_NOTES[level]}</p>
                )}
              </div>

              <ul className="mt-4">
                {levelUnits.map((unit) => {
                  const item = data[unit.id]
                  return (
                    <li key={unit.id} className="border-t border-line last:border-b">
                      <Link
                        to={`/lesson/${unit.id}`}
                        className="flex min-h-[68px] items-center gap-3 px-5 py-3 active:bg-surface"
                      >
                        <span className="num w-6 text-[13px] text-ink-3">
                          {String(levelNumber(unit)).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[17px] text-ink">{unit.title}</p>
                          <p className="truncate text-[13px] text-ink-3">
                            {unit.subtitle ?? unit.goal}
                          </p>
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
            </section>
          )
        })}
      </main>
    </>
  )
}
