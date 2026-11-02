import { useEffect, useState } from 'react'
import { units } from '@/content'
import { getAllDays, getAllLessonProgress, type DayLog, type LessonProgress } from '@/db/db'
import { formatDuration, lastNDays, streakFromDays } from '@/lib/date'
import { AppBar } from '@/components/AppBar'
import { Ring } from '@/components/Ring'

export default function ProgressScreen() {
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)
  const [days, setDays] = useState<DayLog[] | null>(null)

  useEffect(() => {
    void Promise.all([getAllLessonProgress(), getAllDays()]).then(([lessonProgress, dayLogs]) => {
      setProgress(lessonProgress)
      setDays(dayLogs)
    })
  }, [])

  if (!progress || !days) {
    return (
      <>
        <AppBar title="Прогресс" />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const doneIds = new Set(
    Object.values(progress)
      .filter((item) => item.status === 'done')
      .map((item) => item.lessonId),
  )
  const done = units.filter((unit) => doneIds.has(unit.id)).length
  const percent = units.length > 0 ? done / units.length : 0
  const words = units
    .filter((unit) => doneIds.has(unit.id))
    .reduce((sum, unit) => sum + unit.words.length, 0)
  const streak = streakFromDays(days)

  const week = lastNDays(7)
  const minutesByDate = new Map(days.map((day) => [day.date, Math.round(day.seconds / 60)]))
  const weekMinutes = week.reduce((sum, day) => sum + (minutesByDate.get(day.date) ?? 0), 0)
  const maxMinutes = Math.max(1, ...week.map((day) => minutesByDate.get(day.date) ?? 0))

  return (
    <>
      <AppBar title="Прогресс" subtitle="Курс, серия, слова" />

      <main className="px-5 pb-10 pt-6">
        <div className="flex items-center gap-6">
          <Ring value={percent}>
            <span className="num font-serif text-[30px] leading-none">
              {Math.round(percent * 100)}%
            </span>
            <span className="mt-1 text-[11px] text-ink-3">курса</span>
          </Ring>
          <div className="min-w-0">
            <p className="font-serif text-[22px] leading-tight">A1</p>
            <p className="mt-1 text-[15px] text-ink-2">
              {done} из {units.length} уроков
            </p>
            <p className="mt-1 text-[13px] text-ink-3">Первый уровень пути</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line">
          <div className="bg-paper p-4">
            <p className="text-[13px] text-ink-3">Уроки</p>
            <p className="num mt-1 font-serif text-[24px] leading-none">
              {done} / {units.length}
            </p>
          </div>
          <div className="bg-paper p-4">
            <p className="text-[13px] text-ink-3">Слов в обороте</p>
            <p className="num mt-1 font-serif text-[24px] leading-none">{words}</p>
          </div>
          <div className="bg-paper p-4">
            <p className="text-[13px] text-ink-3">Серия дней</p>
            <p className="num mt-1 font-serif text-[24px] leading-none">{streak}</p>
          </div>
          <div className="bg-paper p-4">
            <p className="text-[13px] text-ink-3">За 7 дней</p>
            <p className="num mt-1 font-serif text-[24px] leading-none">
              {formatDuration(weekMinutes)}
            </p>
          </div>
        </div>

        <section className="mt-8 border-t border-line pt-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[20px]">Последние 7 дней</h2>
            <span className="num text-[13px] text-ink-3">минуты</span>
          </div>

          <div className="mt-4 flex h-32 items-end gap-2">
            {week.map((day) => {
              const minutes = minutesByDate.get(day.date) ?? 0
              const height = minutes > 0 ? Math.max(6, (minutes / maxMinutes) * 100) : 2
              return (
                <div key={day.date} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-[2px] ${minutes > 0 ? 'bg-accent' : 'bg-line'}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-ink-3">{day.weekday}</span>
                </div>
              )
            })}
          </div>
        </section>

        <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
          «Слов в обороте» — слова из пройденных уроков. На этапе 2 к ним добавится повторение по
          интервалам.
        </p>
      </main>
    </>
  )
}
