import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { getUnit, units, type Exercise } from '@/content'
import { getDueErrors, reviewError } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { renderExercise, type ExerciseViewHandle } from './lesson/exercises'

interface WorkshopItem {
  exercise: Exercise
  label: string
  errorId?: string
}

export default function WorkshopScreen() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const unit = getUnit(id)
  const [queue, setQueue] = useState<WorkshopItem[] | null>(null)
  const [position, setPosition] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const viewRef = useRef<ExerciseViewHandle | null>(null)

  useEffect(() => {
    if (!unit) {
      setQueue([])
      return
    }
    let alive = true
    void (async () => {
      const items: WorkshopItem[] = unit.exercises
        .filter((exercise) => exercise.optional)
        .map((exercise) => ({ exercise, label: 'Мастерская' }))

      // Старые ошибки из других юнитов подмешиваются в конец мастерской.
      const due = await getDueErrors(3)
      for (const error of due) {
        const source = units.find((item) => item.id === error.unitId)
        const exercise = source?.exercises.find((item) => item.id === error.exerciseId)
        if (!exercise || items.some((item) => item.exercise.id === exercise.id)) continue
        items.push({
          exercise,
          label: `Повтор ошибки · ${source?.title ?? 'урок'}`,
          errorId: exercise.id,
        })
      }

      if (!alive) return
      setQueue(items)
    })()
    return () => {
      alive = false
    }
  }, [unit])

  const current = queue?.[position]
  const selfAssessed = current?.exercise.kind === 'write'

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!current) return
      setLastCorrect(correct)
      setPhase('feedback')
      if (current.errorId) void reviewError(current.errorId, correct)
    },
    [current],
  )

  function next() {
    if (!queue) return
    if (position + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setPosition((value) => value + 1)
    setPhase('answer')
    setCanCheck(false)
  }

  if (!unit) {
    return (
      <>
        <AppBar title="Мастерская" onBack={() => navigate('/path')} />
        <main className="px-5 pb-8 pt-10">
          <p className="text-[17px] text-ink-2">Урок не найден.</p>
          <Button className="mt-6 w-full" onClick={() => navigate('/path')}>
            К пути
          </Button>
        </main>
      </>
    )
  }

  if (!queue) {
    return (
      <>
        <AppBar title="Мастерская" onBack={() => navigate(`/lesson/${unit.id}`)} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (finished || queue.length === 0) {
    return (
      <>
        <AppBar title="Мастерская" onBack={() => navigate(`/lesson/${unit.id}`)} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">
            {queue.length === 0 ? 'Мастерская пуста' : 'Мастерская пройдена'}
          </h1>
          <p className="mt-2 text-[15px] leading-snug text-ink-2">
            {queue.length === 0
              ? 'Для этого урока нет дополнительных упражнений.'
              : 'Дополнительные упражнения не входят в счёт урока. Ошибки из прошлых уроков вернутся по расписанию.'}
          </p>
          <div className="mt-8 space-y-2.5">
            <Button className="w-full" onClick={() => navigate('/path')}>
              К пути
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/lesson/${unit.id}`)}
            >
              К уроку
            </Button>
          </div>
        </main>
      </>
    )
  }

  if (!current) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Мастерская"
        subtitle={`${unit.title} · ${position + 1} из ${queue.length}`}
        onBack={() => navigate(`/lesson/${unit.id}`)}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <p className="mb-4 text-[13px] font-medium text-ink-3">{current.label}</p>

        <div key={`${current.exercise.id}-${position}`}>
          {renderExercise(
            current.exercise,
            {
              exercise: current.exercise,
              locked: phase !== 'answer',
              onResult: handleResult,
              onCanCheck: setCanCheck,
            },
            viewRef,
          )}
        </div>

        {phase === 'feedback' && (
          <div
            className={`mt-6 rounded-[10px] border-l-2 p-4 ${
              selfAssessed
                ? 'border-accent bg-accent-soft'
                : lastCorrect
                  ? 'border-accent bg-accent-soft'
                  : 'border-err bg-err-soft'
            }`}
          >
            <p
              className={`text-[13px] font-medium ${
                selfAssessed ? 'text-accent' : lastCorrect ? 'text-accent' : 'text-err'
              }`}
            >
              {selfAssessed ? 'Сохранено' : lastCorrect ? 'Верно' : 'Неверно'}
            </p>
            {current.exercise.explanation && (
              <p className="mt-1 text-[15px] leading-snug text-ink">
                {current.exercise.explanation}
              </p>
            )}
          </div>
        )}
      </main>

      <div
        className="sticky bottom-0 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {phase === 'answer' ? (
          <Button className="w-full" disabled={!canCheck} onClick={() => viewRef.current?.check()}>
            Проверить
          </Button>
        ) : (
          <Button className="w-full" onClick={next}>
            {position + 1 >= queue.length ? 'Завершить' : 'Дальше'}
          </Button>
        )}
      </div>
    </div>
  )
}
