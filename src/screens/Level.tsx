import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { LEVEL_INFO, units } from '@/content'
import type { Level } from '@/content'
import { levelGates } from '@/content/gates'
import { getAllLessonProgress, getKv, type LessonProgress } from '@/db/db'
import {
  gateKey,
  isLevelUnlocked,
  previousLevel,
  type LevelGateState,
} from '@/lib/gates'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'

export default function LevelScreen() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const info = LEVEL_INFO[code as Level]
  const levelUnits = units.filter((unit) => unit.level === code)
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)
  const [gates, setGates] = useState<Record<string, LevelGateState | undefined> | null>(null)

  useEffect(() => {
    void getAllLessonProgress().then(setProgress)
    void Promise.all(
      levelGates.map(async (gate) => [
        gate.level,
        await getKv<LevelGateState>(gateKey(gate.level)),
      ] as const),
    ).then((entries) => setGates(Object.fromEntries(entries)))
  }, [])

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

  if (!progress || !gates) {
    return (
      <>
        <AppBar title={`Уровень ${code}`} onBack={() => navigate('/path')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const data = progress
  const done = levelUnits.filter((unit) => data[unit.id]?.status === 'done').length
  const percent = levelUnits.length > 0 ? done / levelUnits.length : 0
  const next = levelUnits.find((unit) => data[unit.id]?.status !== 'done')
  const unlocked = isLevelUnlocked(code as Level, gates)
  const previous = previousLevel(code as Level)
  const gate = levelGates.find((item) => item.level === code)
  const gatePassed = gates[code]?.passed === true
  const allDone = levelUnits.length > 0 && done === levelUnits.length

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

        {!unlocked && previous && (
          <div className="mt-5 border border-line bg-surface p-4">
            <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
              <Lock size={16} strokeWidth={1.5} />
              Сначала проверка {previous}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-3">
              Уровень откроется после студии, двух текстов, письма и речи на проверке {previous}.
            </p>
            <Button className="mt-3 w-full" onClick={() => navigate(`/gate/${previous}`)}>
              К проверке {previous}
            </Button>
          </div>
        )}

        {levelUnits.length > 0 && (
          <>
            <ProgressBar value={percent} className="mt-4" />
            <p className="mt-1 text-[13px] text-ink-3">{Math.round(percent * 100)}% уровня</p>
            {unlocked ? (
              next ? (
                <Button className="mt-4 w-full" onClick={() => navigate(`/lesson/${next.id}`)}>
                  {done > 0 ? 'Продолжить' : 'Начать уровень'}
                </Button>
              ) : allDone && gate && !gatePassed ? (
                <Button className="mt-4 w-full" onClick={() => navigate(`/gate/${code}`)}>
                  Пройти проверку {code}
                </Button>
              ) : (
                <p className="mt-4 text-[15px] text-accent">Все уроки этого уровня пройдены.</p>
              )
            ) : null}
          </>
        )}

        {gate && (
          <div className="mt-6 border-t border-line pt-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[20px]">Проверка уровня</h2>
              <span className={`text-[13px] ${gatePassed ? 'text-accent' : 'text-ink-3'}`}>
                {gatePassed ? 'пройдена' : allDone ? 'готова' : 'после уроков'}
              </span>
            </div>
            <p className="mt-1 text-[15px] leading-snug text-ink-2">
              {gatePassed
                ? 'Студия, два текста, письмо и речь зачтены. Следующий уровень открыт.'
                : 'Последняя студия, два текста библиотеки, короткое письмо и речь. Это закрывает уровень.'}
            </p>
            <Button
              variant={gatePassed ? 'secondary' : 'primary'}
              className="mt-3 w-full"
              disabled={!allDone}
              onClick={() => navigate(`/gate/${code}`)}
            >
              {gatePassed ? 'Посмотреть проверку' : allDone ? 'Открыть проверку' : `Осталось уроков: ${levelUnits.length - done}`}
            </Button>
          </div>
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
