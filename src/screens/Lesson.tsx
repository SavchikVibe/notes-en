import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronDown, X } from 'lucide-react'
import { getUnit } from '@/content'
import { finishLesson, getLessonProgress, saveAnswer, saveError, saveSkip, restartLesson, addStudyTime, addWordsToSrs } from '@/db/db'
import { isReviewable } from '@/lib/errors'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/components/SpeakButton'
import { renderExercise, type ExerciseViewHandle } from './lesson/exercises'

interface Result {
  correct: number
  total: number
  score: number
  mistakes: number
  skipped: number
}

export default function LessonScreen() {
  const { id = '' } = useParams()
  const unit = getUnit(id)
  const navigate = useNavigate()
  const core = unit ? unit.exercises.filter((exercise) => !exercise.optional) : []
  const workshop = unit ? unit.exercises.filter((exercise) => exercise.optional) : []

  const [ready, setReady] = useState(false)
  const [queue, setQueue] = useState<number[]>(() => core.map((_, index) => index))
  const [position, setPosition] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback' | 'skipped'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [firstAnswers, setFirstAnswers] = useState<Record<string, boolean>>({})
  const [skipped, setSkipped] = useState<Record<string, boolean>>({})
  const [lastCorrect, setLastCorrect] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [resumeComplete, setResumeComplete] = useState(false)
  const [formulasOpen, setFormulasOpen] = useState(true)
  const viewRef = useRef<ExerciseViewHandle | null>(null)
  const requeued = useRef(new Set<number>())
  const activeSince = useRef<number | null>(Date.now())
  const pendingSeconds = useRef(0)

  const flushTime = useCallback(() => {
    if (activeSince.current !== null) {
      pendingSeconds.current += (Date.now() - activeSince.current) / 1000
      activeSince.current = Date.now()
    }
    const whole = Math.floor(pendingSeconds.current)
    if (whole > 0) {
      pendingSeconds.current -= whole
      void addStudyTime(whole)
    }
  }, [])

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        flushTime()
        activeSince.current = null
      } else if (activeSince.current === null) {
        activeSince.current = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      flushTime()
    }
  }, [flushTime])

  useEffect(() => {
    if (!unit) return
    let alive = true
    void getLessonProgress(unit.id).then((progress) => {
      if (!alive) return
      if (progress) {
        const savedAnswers = progress.answers ?? {}
        const savedFirst = progress.firstAnswers ?? savedAnswers
        const savedSkipped = progress.skipped ?? {}
        setAnswers(savedAnswers)
        setFirstAnswers(savedFirst)
        setSkipped(savedSkipped)

        if (progress.status === 'in_progress') {
          const answered = new Set(Object.keys(savedAnswers))
          const pending = core
            .map((exercise, index) =>
              !answered.has(exercise.id) && !savedSkipped[exercise.id] ? index : -1,
            )
            .filter((index) => index >= 0)
          const repeats = core
            .map((exercise, index) =>
              savedAnswers[exercise.id] === false && !savedSkipped[exercise.id] ? index : -1,
            )
            .filter((index) => index >= 0)

          if (pending.length === 0 && repeats.length === 0) {
            setResumeComplete(true)
          } else {
            requeued.current = new Set(repeats)
            setQueue([...pending, ...repeats])
            setPosition(0)
          }
        }
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [unit])

  const exerciseIndex = queue[position] ?? 0
  const total = core.length
  const current = core[exerciseIndex]

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!unit) return
      const exercise = core[exerciseIndex]
      const firstAttempt = answers[exercise.id] === undefined && skipped[exercise.id] !== true

      setAnswers((currentAnswers) => ({ ...currentAnswers, [exercise.id]: correct }))
      if (firstAttempt) {
        setFirstAnswers((currentAnswers) => ({ ...currentAnswers, [exercise.id]: correct }))
      }
      void saveAnswer(
        unit.id,
        exercise.id,
        correct,
        Math.min(exerciseIndex + 1, core.length - 1),
        firstAttempt,
      )

      if (firstAttempt && !correct) {
        if (isReviewable(exercise)) void saveError(unit.id, exercise.id)
        if (!requeued.current.has(exerciseIndex)) {
          requeued.current.add(exerciseIndex)
          setQueue((currentQueue) => [...currentQueue, exerciseIndex])
        }
      }

      setLastCorrect(correct)
      setPhase('feedback')
    },
    [unit, exerciseIndex, answers, skipped],
  )

  const handleSkip = useCallback(() => {
    if (!unit) return
    const exercise = core[exerciseIndex]
    setSkipped((current) => ({ ...current, [exercise.id]: true }))
    setPhase('skipped')
    void saveSkip(unit.id, exercise.id, Math.min(exerciseIndex + 1, core.length - 1))
  }, [unit, core, exerciseIndex])

  async function completeLesson() {
    if (!unit) return
    const skippedIds = Object.keys(skipped)
    const denominator = Math.max(0, total - skippedIds.length)
    const firstMistakes = Object.entries(firstAnswers).filter(
      ([exerciseId, ok]) => ok === false && !skipped[exerciseId],
    ).length
    const correct = Object.entries(firstAnswers).filter(
      ([exerciseId, ok]) => ok && !skipped[exerciseId],
    ).length
    const score = denominator > 0 ? correct / denominator : 0
    flushTime()
    activeSince.current = null
    await finishLesson(unit.id, score, denominator)
    await addWordsToSrs(unit.words.map((word) => word.id))
    setResult({
      correct,
      total: denominator,
      score,
      mistakes: firstMistakes,
      skipped: skippedIds.length,
    })
  }

  async function handleNext() {
    if (!unit) return
    if (position >= queue.length - 1) {
      await completeLesson()
      return
    }
    setPosition((value) => value + 1)
    setPhase('answer')
    setCanCheck(false)
    setFormulasOpen(false)
  }

  function restart() {
    setResult(null)
    setResumeComplete(false)
    setPosition(0)
    setQueue(core.map((_, index) => index))
    setAnswers({})
    setFirstAnswers({})
    setSkipped({})
    setPhase('answer')
    setCanCheck(false)
    setFormulasOpen(true)
    requeued.current.clear()
    pendingSeconds.current = 0
    activeSince.current = Date.now()
    if (unit) void restartLesson(unit.id)
  }

  if (!unit) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-[17px] text-ink-2">Урок не найден.</p>
        <Button variant="secondary" onClick={() => navigate('/path')}>
          К пути
        </Button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] items-center justify-center px-5">
        <p className="text-[15px] text-ink-3">Загрузка…</p>
      </div>
    )
  }

  if (resumeComplete && !result) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 pb-8 pt-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={28} strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-[30px] leading-tight">Все упражнения отвечены</h1>
        <p className="mt-2 text-[15px] leading-snug text-ink-2">
          Эта попытка уже пройдена. Можно завершить урок и увидеть итог или начать заново.
        </p>
        <div className="mt-auto space-y-2.5 pt-8">
          <Button className="w-full" onClick={() => void completeLesson()}>
            Завершить урок
          </Button>
          <Button variant="secondary" className="w-full" onClick={restart}>
            Начать заново
          </Button>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 pb-8 pt-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={28} strokeWidth={1.5} />
        </div>

        <h1 className="mt-6 text-[32px] leading-tight">Урок пройден</h1>
        <p className="mt-1 text-[17px] text-ink-2">{unit.title}</p>

        <div className="mt-8 border-b border-line pb-6">
          <p className="text-[13px] font-medium text-ink-3">Итоговая точность</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="num font-serif text-[44px] leading-none">
              {Math.round(result.score * 100)}%
            </span>
            <span className="text-[15px] text-ink-2">
              {result.correct} из {result.total} упражнений
            </span>
          </div>
        </div>

        {result.skipped > 0 && (
          <p className="mt-3 text-[15px] leading-snug text-ink-2">
            Пропущено: {result.skipped}. Пропущенные задания не входят в итоговый процент.
          </p>
        )}

        {result.mistakes > 0 && (
          <p className="mt-3 text-[15px] leading-snug text-warn">
            Ошибок с первой попытки: {result.mistakes}. Они были возвращены в конец урока.
          </p>
        )}

        <div className="mt-6">
          <p className="text-[13px] font-medium text-ink-3">Слова урока</p>
          <ul className="mt-2 divide-y divide-line">
            {unit.words.map((word) => (
              <li key={word.id} className="flex items-center gap-1 py-2">
                <SpeakButton text={word.term} size={15} />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px]">{word.term}</p>
                  <p className="font-ipa text-[13px] leading-snug text-ink-3">[{word.ipa}]</p>
                </div>
                <span className="max-w-[48%] text-right text-[15px] text-ink-2">
                  {word.translation}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-2.5 pt-8">
          <Button className="w-full" onClick={() => navigate('/path')}>
            К пути
          </Button>
          {workshop.length > 0 && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigate(`/workshop/${unit.id}`)}
            >
              Мастерская · {workshop.length} упр.
            </Button>
          )}
          <Button variant="secondary" className="w-full" onClick={restart}>
            Пройти ещё раз
          </Button>
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <header
        className="sticky top-0 z-20 border-b border-line bg-paper px-5"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex h-14 items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/path')}
            aria-label="Закрыть урок"
            className="-ml-2 flex size-11 items-center justify-center rounded-full text-ink-2 active:bg-surface"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium leading-tight">{unit.title}</p>
            <p className="truncate text-[13px] leading-tight text-ink-3">{unit.goal}</p>
          </div>
          <span className="num text-[13px] text-ink-3">
            {position + 1} / {queue.length}
          </span>
        </div>
        <div className="flex gap-1.5 pb-3">
          {queue.map((stepIndex, step) => (
            <span
              key={`${stepIndex}-${step}`}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step <= position
                  ? 'bg-accent'
                  : requeued.current.has(stepIndex)
                    ? 'bg-warn'
                    : 'bg-line'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 pb-8 pt-6">
        {position >= total && (
          <p className="mb-4 text-[13px] font-medium text-warn">Повторение ошибки</p>
        )}

        <section className="mb-6">
          <button
            type="button"
            onClick={() => setFormulasOpen((open) => !open)}
            className="flex w-full items-center justify-between border-b border-line pb-2 text-[13px] font-medium text-ink-3"
          >
            <span>Формула</span>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={`transition-transform ${formulasOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {formulasOpen && (
            <div className="mt-3 space-y-3 border-l-2 border-accent pl-4">
              {unit.formulas.map((formula) => (
                <div key={formula.pattern}>
                  <p className="font-serif text-[19px] leading-snug">{formula.pattern}</p>
                  <p className="text-[13px] text-ink-3">
                    {formula.label}
                    {formula.note ? ` — ${formula.note}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <div key={`${current.id}-${position}`}>
          {renderExercise(current, {
            exercise: current,
            locked: phase !== 'answer',
            onResult: handleResult,
            onCanCheck: setCanCheck,
            onSkip: handleSkip,
          }, viewRef)}
        </div>

        {phase !== 'answer' && (
          <div
            className={`mt-6 rounded-[10px] border-l-2 p-4 ${
              phase === 'skipped'
                ? 'border-line-strong bg-surface'
                : lastCorrect
                  ? 'border-accent bg-accent-soft'
                  : 'border-err bg-err-soft'
            }`}
          >
            <p
              className={`text-[13px] font-medium ${
                phase === 'skipped' ? 'text-ink-3' : lastCorrect ? 'text-accent' : 'text-err'
              }`}
            >
              {phase === 'skipped' ? 'Пропущено' : lastCorrect ? 'Верно' : 'Неверно'}
            </p>
            {current.explanation && phase !== 'skipped' && (
              <p className="mt-1 text-[15px] leading-snug text-ink">{current.explanation}</p>
            )}
          </div>
        )}
      </main>

      <div
        className="sticky bottom-0 z-10 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {phase === 'answer' ? (
          <Button className="w-full" disabled={!canCheck} onClick={() => viewRef.current?.check()}>
            Проверить
          </Button>
        ) : (
          <Button className="w-full" onClick={() => void handleNext()}>
            {position >= queue.length - 1 ? 'Завершить' : 'Дальше'}
          </Button>
        )}
      </div>
    </div>
  )
}
