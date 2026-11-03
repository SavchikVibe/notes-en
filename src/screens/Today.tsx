import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon } from 'lucide-react'
import { units } from '@/content'
import { getAllLessonProgress, getSettings, type LessonProgress, type Settings } from '@/db/db'
import { buildSession } from '@/lib/session'
import { formatDuration, formatTodayRu } from '@/lib/date'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'

export default function TodayScreen() {
  const navigate = useNavigate()
  const [state, setState] = useState<{
    progress: Record<string, LessonProgress>
    settings: Settings
  } | null>(null)

  useEffect(() => {
    void Promise.all([getAllLessonProgress(), getSettings()]).then(([progress, settings]) => {
      setState({ progress, settings })
    })
  }, [])

  if (!state) {
    return (
      <>
        <AppBar title="Сегодня" />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const session = buildSession(units, state.progress, state.settings)
  const course = session.blocks[0]
  const others = session.blocks.slice(1)
  const hasResume = course.units.some((unit) => state.progress[unit.id]?.status === 'in_progress')

  return (
    <>
      <AppBar
        title="Сегодня"
        right={
          <Link
            to="/settings"
            aria-label="Настройки"
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink-3 active:bg-surface"
          >
            <SettingsIcon size={21} strokeWidth={1.5} />
          </Link>
        }
      />

      <main className="px-5 pb-10 pt-6">
        <p className="text-[13px] font-medium text-ink-3">{formatTodayRu()}</p>
        <h1 className="mt-1 text-[34px] leading-none">{formatDuration(session.totalMinutes)}</h1>
        <p className="mt-2 text-[15px] text-ink-2">План на сегодня</p>

        <section className="mt-8 border-t border-line pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[20px]">Курс</h2>
            <span className="num text-[15px] text-ink-3">{course.minutes} мин</span>
          </div>

          {course.units.length > 0 ? (
            <>
              <ul className="mt-3">
                {course.units.map((unit) => {
                  const progress = state.progress[unit.id]
                  return (
                    <li
                      key={unit.id}
                      className="flex min-h-[60px] items-center gap-3 border-b border-line py-2.5"
                    >
                      <span className="num w-6 text-[13px] text-ink-3">
                        {String(unit.order).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[17px] text-ink">{unit.title}</p>
                        <p className="truncate text-[13px] text-ink-3">
                          {progress?.status === 'in_progress' ? 'продолжить · ' : ''}
                          {unit.subtitle ?? unit.goal}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <Button className="mt-5 w-full" onClick={() => navigate(`/lesson/${course.units[0].id}`)}>
                {hasResume ? 'Продолжить' : 'Начать'}
              </Button>
            </>
          ) : (
            <div className="mt-4 border-l-2 border-accent pl-4">
              <p className="text-[17px]">Все уроки этого этапа пройдены.</p>
              <p className="mt-1 text-[15px] text-ink-2">
                Следующая партия появится вместе с обновлением контента.
              </p>
            </div>
          )}
        </section>

        <section className="mt-9">
          <h2 className="text-[20px]">Ещё сегодня</h2>
          <div className="mt-2">
            {others.map((block) => (
              <div
                key={block.key}
                className="flex min-h-[60px] items-start justify-between gap-4 border-b border-line py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-[17px] text-ink-2">{block.title}</p>
                  <p className="text-[13px] text-ink-3">{block.note}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="num text-[15px] text-ink-3">{block.minutes} мин</p>
                  <p className="text-[11px] text-ink-3">скоро</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
            Слушание, чтение, речь и повторение подключатся на следующих этапах. Тогда «Сегодня»
            будет собирать полное занятие на два часа.
          </p>
        </section>
      </main>
    </>
  )
}
