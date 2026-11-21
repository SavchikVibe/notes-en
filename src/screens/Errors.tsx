import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { units, type Exercise, type Unit } from '@/content'
import { getDueErrors, reviewError, type ErrorItem } from '@/db/db'
import { isReviewable } from '@/lib/errors'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { renderExercise, type ExerciseViewHandle } from './lesson/exercises'

interface QueueItem {
  item: ErrorItem
  unit: Unit
  exercise: Exercise
}

export default function ErrorsScreen() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<QueueItem[] | null>(null)
  const [position, setPosition] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const viewRef = useRef<ExerciseViewHandle | null>(null)
  const correctCount = useRef(0)
  const wrongCount = useRef(0)
  const requeued = useRef(new Set<string>())

  useEffect(() => {
    void (async () => {
      const due = await getDueErrors(12)
      const byUnit = new Map(units.map((unit) => [unit.id, unit]))
      const items: QueueItem[] = []
      for (const item of due) {
        const unit = byUnit.get(item.unitId)
        const exercise = unit?.exercises.find((entry) => entry.id === item.exerciseId)
        if (!unit || !exercise || !isReviewable(exercise)) continue
        items.push({ item, unit, exercise })
      }
      setQueue(items)
    })()
  }, [])

  const current = queue?.[position]

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!current) return
      const firstAttempt = !requeued.current.has(current.exercise.id)
      setLastCorrect(correct)
      setPhase('feedback')
      if (firstAttempt) {
        void reviewError(current.exercise.id, correct)
        if (correct) correctCount.current += 1
        else wrongCount.current += 1
      }
      if (!correct && !requeued.current.has(current.exercise.id)) {
        requeued.current.add(current.exercise.id)
        setQueue((items) => (items ? [...items, current] : items))
      }
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

  const reviewable = useMemo(
    () => queue?.filter((entry) => isReviewable(entry.exercise)) ?? [],
    [queue],
  )

  if (!queue) {
    return (
      <>
        <AppBar title="Ошибки" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (reviewable.length === 0 || finished) {
    const empty = reviewable.length === 0
    return (
      <>
        <AppBar title="Ошибки" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">
            {empty ? 'Ошибок на сегодня нет' : 'Повторение ошибок завершено'}
          </h1>
          <p className="mt-2 text-[15px] leading-snug text-ink-2">
            {empty
              ? 'Сюда попадают задания, где первый ответ был неверным. Они возвращаются через день, потом через три, семь и дальше.'
              : `Верно: ${correctCount.current} · Ошибок: ${wrongCount.current}. Следующий повтор — по расписанию.`}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  if (!current) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Ошибки"
        subtitle={`${current.unit.title} · ${position + 1} из ${queue.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <p className="mb-4 text-[13px] font-medium text-ink-3">
          {position >= reviewable.length ? 'Повтор ошибки' : 'Вернись к заданию, где была ошибка'}
        </p>

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
              lastCorrect ? 'border-accent bg-accent-soft' : 'border-err bg-err-soft'
            }`}
          >
            <p className={`text-[13px] font-medium ${lastCorrect ? 'text-accent' : 'text-err'}`}>
              {lastCorrect ? 'Верно' : 'Неверно'}
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
