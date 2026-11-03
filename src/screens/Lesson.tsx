import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronDown, X } from 'lucide-react'
import { getUnit } from '@/content'
import { finishLesson, getLessonProgress, saveAnswer, saveResume, addStudyTime } from '@/db/db'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/components/SpeakButton'
import { renderExercise, type ExerciseViewHandle } from './lesson/exercises'

interface Result {
  correct: number
  total: number
  score: number
}

export default function LessonScreen() {
  const { id = '' } = useParams()
  const unit = getUnit(id)
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback' | 'skipped'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [lastCorrect, setLastCorrect] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [formulasOpen, setFormulasOpen] = useState(true)
  const viewRef = useRef<ExerciseViewHandle | null>(null)
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
        setAnswers(progress.answers ?? {})
        if (progress.status === 'in_progress') {
          setIndex(Math.min(progress.exerciseIndex, unit.exercises.length - 1))
        }
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [unit])

  const handleResult = useCallback(
    (correct: boolean) => {
      if (!unit) return
      const exercise = unit.exercises[index]
      setAnswers((current) => ({ ...current, [exercise.id]: correct }))
      setLastCorrect(correct)
      setPhase('feedback')
      void saveAnswer(unit.id, exercise.id, correct, Math.min(index + 1, unit.exercises.length - 1))
    },
    [unit, index],
  )

  const total = unit?.exercises.length ?? 0
  const current = unit?.exercises[index]

  const handleSkip = useCallback(() => {
    if (!unit) return
    setPhase('skipped')
    void saveResume(unit.id, Math.min(index + 1, unit.exercises.length - 1))
  }, [unit, index])

  async function handleNext() {
    if (!unit) return
    if (index >= total - 1) {
      const correct = Object.values(answers).filter(Boolean).length
      const score = total > 0 ? correct / total : 0
      flushTime()
      activeSince.current = null
      await finishLesson(unit.id, score, total)
      setResult({ correct, total, score })
      return
    }
    setIndex((currentIndex) => currentIndex + 1)
    setPhase('answer')
    setCanCheck(false)
    setFormulasOpen(false)
  }

  function restart() {
    setResult(null)
    setIndex(0)
    setAnswers({})
    setPhase('answer')
    setCanCheck(false)
    setFormulasOpen(true)
    pendingSeconds.current = 0
    activeSince.current = Date.now()
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

  if (result) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 pb-8 pt-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={28} strokeWidth={1.5} />
        </div>

        <h1 className="mt-6 text-[32px] leading-tight">Урок пройден</h1>
        <p className="mt-1 text-[17px] text-ink-2">{unit.title}</p>

        <div className="mt-8 flex items-baseline gap-3 border-b border-line pb-6">
          <span className="num font-serif text-[44px] leading-none">
            {Math.round(result.score * 100)}%
          </span>
          <span className="text-[15px] text-ink-2">
            {result.correct} из {result.total} упражнений
          </span>
        </div>

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
            {index + 1} / {total}
          </span>
        </div>
        <div className="flex gap-1.5 pb-3">
          {unit.exercises.map((exercise, step) => (
            <span
              key={exercise.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step <= index ? 'bg-accent' : 'bg-line'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 pb-8 pt-6">
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

        {renderExercise(current, {
          exercise: current,
          locked: phase !== 'answer',
          onResult: handleResult,
          onCanCheck: setCanCheck,
          onSkip: handleSkip,
        }, viewRef)}

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
            {index === total - 1 ? 'Завершить' : 'Дальше'}
          </Button>
        )}
      </div>
    </div>
  )
}
