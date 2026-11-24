import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Lock } from 'lucide-react'
import { units, levelNumber } from '@/content'
import { levelGates } from '@/content/gates'
import { getAllLessonProgress, getKv, type LessonProgress } from '@/db/db'
import { gateKey, isLevelUnlocked, type LevelGateState } from '@/lib/gates'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ProgressBar } from '@/components/ProgressBar'

const LEVEL_NOTES: Record<string, string> = {
  A1: 'Начало пути: to be, местоимения, Present Simple.',
  A2: 'Быт, работа, учёба и прошлое.',
  B1: 'Мнения, истории и планы.',
  B2: 'Академический английский и IELTS.',
  C1: 'Свободная речь и стиль.',
}

export default function PathScreen() {
  const navigate = useNavigate()
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

  if (!progress || !gates) {
    return (
      <>
        <AppBar title="Путь" subtitle="Курс английского" />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const data = progress ?? {}
  const levels = [...new Set(units.map((unit) => unit.level))]
  const currentLevel =
    levels.find((level) => {
      const levelUnits = units.filter((unit) => unit.level === level)
      return (
        isLevelUnlocked(level, gates) &&
        levelUnits.some((unit) => data[unit.id]?.status !== 'done')
      )
    }) ??
    levels.find((level) => isLevelUnlocked(level, gates)) ??
    levels[0]
  const currentUnits = units.filter((unit) => unit.level === currentLevel)
  const currentDone = currentUnits.filter((unit) => data[unit.id]?.status === 'done').length
  const currentPercent =
    currentUnits.length > 0 ? Math.round((currentDone / currentUnits.length) * 100) : 0

  return (
    <>
      <AppBar
        title="Путь"
        subtitle="Курс английского"
        right={
          <span className="num text-[13px] text-ink-3">
            {currentLevel} · {currentPercent}%
          </span>
        }
      />

      <main className="pb-10">
        {levels.map((level) => {
          const levelUnits = units.filter((unit) => unit.level === level)
          const levelDone = levelUnits.filter((unit) => data[unit.id]?.status === 'done').length
          const levelPercent =
            levelUnits.length > 0 ? Math.round((levelDone / levelUnits.length) * 100) : 0
          const unlocked = isLevelUnlocked(level, gates)
          const gate = levelGates.find((item) => item.level === level)
          const gateState = gates[level]
          const allDone = levelUnits.length > 0 && levelDone === levelUnits.length

          return (
            <section key={level}>
              <Link
                to={`/level/${level}`}
                className="block px-5 pt-6 active:bg-surface"
              >
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[28px] leading-none">{level}</h2>
                    {level === currentLevel && (
                      <span className="rounded-[3px] border border-accent/40 bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
                        сейчас
                      </span>
                    )}
                    {!unlocked && (
                      <span className="flex items-center gap-1 rounded-[3px] border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink-3">
                        <Lock size={11} strokeWidth={1.5} />
                        закрыт
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="num text-[13px] text-ink-3">
                      {levelDone} / {levelUnits.length} · {levelPercent}%
                    </span>
                    <ChevronRight size={16} strokeWidth={1.5} className="text-ink-3" />
                  </span>
                </div>
                <ProgressBar value={levelUnits.length > 0 ? levelDone / levelUnits.length : 0} className="mt-3" />
                {LEVEL_NOTES[level] && (
                  <p className="mt-2 text-[15px] text-ink-2">{LEVEL_NOTES[level]}</p>
                )}
              </Link>

              <ul className="mt-4">
                {levelUnits.map((unit) => {
                  const item = data[unit.id]
                  const content = (
                    <>
                      <span className="num w-6 text-[13px] text-ink-3">
                        {String(levelNumber(unit)).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[17px] text-ink">{unit.title}</p>
                        <p className="truncate text-[13px] text-ink-3">
                          {unit.subtitle ?? unit.goal}
                        </p>
                      </div>
                      {!unlocked ? (
                        <Lock size={16} strokeWidth={1.5} className="text-ink-3" />
                      ) : item?.status === 'done' ? (
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
                    </>
                  )

                  return (
                    <li key={unit.id} className="border-t border-line last:border-b">
                      {unlocked ? (
                        <Link
                          to={`/lesson/${unit.id}`}
                          className="flex min-h-[68px] items-center gap-3 px-5 py-3 active:bg-surface"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex min-h-[68px] items-center gap-3 px-5 py-3 opacity-50">
                          {content}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>

              {gate && (
                <div className="mx-5 mt-4 border border-line bg-surface p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[15px] font-medium text-ink">Проверка {level}</p>
                    <span className={`text-[13px] ${gateState?.passed ? 'text-accent' : 'text-ink-3'}`}>
                      {gateState?.passed ? 'пройдена' : allDone ? 'готова' : 'после уроков'}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-ink-3">
                    Студия, два текста, письмо и речь. Без неё следующий уровень закрыт.
                  </p>
                  {gateState?.passed ? (
                    <Button
                      variant="secondary"
                      className="mt-3 w-full"
                      onClick={() => navigate(`/gate/${level}`)}
                    >
                      Посмотреть проверку
                    </Button>
                  ) : (
                    <Button
                      className="mt-3 w-full"
                      disabled={!allDone}
                      onClick={() => navigate(`/gate/${level}`)}
                    >
                      {allDone ? 'Пройти проверку' : `Осталось уроков: ${levelUnits.length - levelDone}`}
                    </Button>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </main>
    </>
  )
}
