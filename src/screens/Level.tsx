import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LEVEL_INFO, units } from '@/content'
import type { Level } from '@/content'
import { getAllLessonProgress, type LessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'

export default function LevelScreen() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const info = LEVEL_INFO[code as Level]
  const levelUnits = units.filter((unit) => unit.level === code)
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)

  useEffect(() => {
    void getAllLessonProgress().then(setProgress)
  }, [])

  const data = progress ?? {}
  const done = levelUnits.filter((unit) => data[unit.id]?.status === 'done').length
  const percent = levelUnits.length > 0 ? done / levelUnits.length : 0
  const next = levelUnits.find((unit) => data[unit.id]?.status !== 'done')

  if (!info) {
    return (
      <>
        <AppBar title="Уровень" onBack={() => navigate('/path')} />
        <main className="px-5 pt-6">
          <p className="text-[17px] text-ink-2">Такого уровня нет.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <AppBar title={`Уровень ${code}`} onBack={() => navigate('/path')} />

      <main className="px-5 pb-10 pt-6">
        <div className="flex items-end justify-between">
          <h1 className="text-[44px] leading-none">{code}</h1>
          <span className="num text-[13px] text-ink-3">
            {done} / {levelUnits.length}
          </span>
        </div>
        <p className="mt-1 font-serif text-[22px] leading-tight">{info.title}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{info.summary}</p>

        {levelUnits.length > 0 && (
          <>
            <ProgressBar value={percent} className="mt-4" />
            <p className="mt-1 text-[13px] text-ink-3">{Math.round(percent * 100)}% уровня</p>
            {next ? (
              <Button className="mt-4 w-full" onClick={() => navigate(`/lesson/${next.id}`)}>
                {done > 0 ? 'Продолжить' : 'Начать уровень'}
              </Button>
            ) : (
              <p className="mt-4 text-[15px] text-accent">Все уроки этого уровня пройдены.</p>
            )}
          </>
        )}

        <section className="mt-8 border-t border-line pt-5">
          <h2 className="text-[20px]">Что ты умеешь</h2>
          <ul className="mt-2 space-y-2">
            {info.can.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink-2">
                <span className="text-accent">—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 border-t border-line pt-5">
          <h2 className="text-[20px]">Что нужно, чтобы дойти</h2>
          <ul className="mt-2 space-y-2">
            {info.need.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-snug text-ink-2">
                <span className="text-ink-3">—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 border-t border-line pt-5">
          <h2 className="text-[20px]">Грамматика</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {info.grammar.map((item) => (
              <span
                key={item}
                className="rounded-[6px] border border-line bg-surface px-2.5 py-1 text-[13px] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
