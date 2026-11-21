import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { getStudioTask } from '@/content/studio'
import { addStudyTime, finishLesson, getKv, setKv } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ReadingStep } from './studio/ReadingStep'
import type { StepScore } from './studio/ReadingStep'
import { ListeningStep } from './studio/ListeningStep'
import { WritingStep } from './studio/WritingStep'
import { SpeakingStep } from './studio/SpeakingStep'

interface StudioDetails {
  reading?: StepScore
  listening?: StepScore
  writing?: boolean
  speaking?: 'recorded' | 'skipped'
}

const STEP_LABELS = ['Чтение', 'Слушание', 'Письмо', 'Речь']
const STEP_HINTS = [
  'Ответь на вопросы и нажми «Проверить ответы».',
  'Заполни заметки и ответь на вопросы, затем нажми «Проверить заметки».',
  'Напиши текст и нажми «Проверить черновик».',
  'Запиши ответ или пропусти речь.',
]

export default function StudioTaskScreen() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const task = getStudioTask(id)

  const [step, setStep] = useState(0)
  const [done, setDone] = useState<boolean[]>([false, false, false, false])
  const [details, setDetails] = useState<StudioDetails>({})
  const [ready, setReady] = useState(false)
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    let alive = true
    void (async () => {
      const saved = await getKv<{
        step?: number
        done?: boolean[]
        details?: StudioDetails
      }>(`studio:${id}`)
      if (!alive) return
      if (saved) {
        setStep(Math.min(3, Math.max(0, saved.step ?? 0)))
        if (Array.isArray(saved.done) && saved.done.length === 4) setDone(saved.done)
        if (saved.details && typeof saved.details === 'object') setDetails(saved.details)
      } else {
        // Переносим старый прогресс из localStorage один раз.
        try {
          const legacy = JSON.parse(localStorage.getItem(`studio:${id}`) ?? 'null') as {
            step?: number
            done?: boolean[]
          } | null
          if (legacy) {
            const nextStep = Math.min(3, Math.max(0, legacy.step ?? 0))
            const nextDone =
              Array.isArray(legacy.done) && legacy.done.length === 4
                ? legacy.done
                : [false, false, false, false]
            setStep(nextStep)
            setDone(nextDone)
            await setKv(`studio:${id}`, { step: nextStep, done: nextDone })
            localStorage.removeItem(`studio:${id}`)
          }
        } catch {
          // Битый localStorage просто игнорируем.
        }
      }
      setReady(true)
    })()
    return () => {
      alive = false
    }
  }, [id])

  useEffect(() => {
    if (!ready) return
    void setKv(`studio:${id}`, { step, done, details })
  }, [id, step, done, details, ready])

  const markDone = useCallback((index: number, detail?: Partial<StudioDetails>) => {
    setDone((current) => current.map((value, itemIndex) => (itemIndex === index ? true : value)))
    if (detail) setDetails((current) => ({ ...current, ...detail }))
  }, [])

  if (!task) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="text-[17px] text-ink-2">Студия не найдена.</p>
        <Button variant="secondary" onClick={() => navigate('/studio')}>
          К студии
        </Button>
      </div>
    )
  }

  async function next() {
    if (!task) return
    if (step < 3) {
      setStep((value) => value + 1)
      window.scrollTo({ top: 0 })
      return
    }
    const checked = [details.reading, details.listening].filter(
      (item): item is StepScore => Boolean(item && item.total > 0),
    )
    const score = checked.length
      ? checked.reduce((sum, item) => sum + item.correct / item.total, 0) / checked.length
      : 0
    await finishLesson(task.id, score, 4)
    await addStudyTime(Math.round((Date.now() - startedAt.current) / 1000))
    try {
      localStorage.removeItem(`studio:${id}`)
    } catch {
      // Не критично: при следующем запуске шаг просто восстановится.
    }
    setFinished(true)
  }

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] items-center justify-center px-5">
        <p className="text-[15px] text-ink-3">Загрузка…</p>
      </div>
    )
  }

  if (finished) {
    const checked = [details.reading, details.listening].filter(
      (item): item is StepScore => Boolean(item && item.total > 0),
    )
    const score = checked.length
      ? checked.reduce((sum, item) => sum + item.correct / item.total, 0) / checked.length
      : 0
    const readingOk = Boolean(
      details.reading && details.reading.total > 0 && details.reading.correct / details.reading.total >= 0.6,
    )
    const listeningOk = Boolean(
      details.listening &&
        details.listening.total > 0 &&
        details.listening.correct / details.listening.total >= 0.6,
    )
    const fullCycle = readingOk && listeningOk && details.writing === true && details.speaking === 'recorded'
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 pb-8 pt-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={28} strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-[32px] leading-tight">Студия завершена</h1>
        <p className="mt-1 text-[17px] text-ink-2">{task.title}</p>

        <div className="mt-8 border-t border-line pt-5">
          <p className="text-[13px] font-medium text-ink-3">Результат проверяемых шагов</p>
          <p className="num mt-1 font-serif text-[36px] leading-none">
            {checked.length > 0 ? `${Math.round(score * 100)}%` : '—'}
          </p>
          <ul className="mt-4 space-y-2 text-[15px] leading-snug text-ink-2">
            <li>
              Чтение:{' '}
              {details.reading
                ? `${details.reading.correct} из ${details.reading.total}`
                : 'не проверено'}
            </li>
            <li>
              Слушание:{' '}
              {details.listening
                ? `${details.listening.correct} из ${details.listening.total}`
                : 'не проверено'}
            </li>
            <li>Письмо: {details.writing ? 'черновик сохранён' : 'не написано'}</li>
            <li>
              Речь:{' '}
              {details.speaking === 'recorded'
                ? 'записана'
                : details.speaking === 'skipped'
                  ? 'пропущена'
                  : 'не записана'}
            </li>
          </ul>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            {fullCycle
              ? 'Полный цикл: чтение и слушание выше 60%, письмо сохранено, речь записана.'
              : 'Попытка сохранена. Это не оценка языка: чтение, слушание и письмо проверены частично, речь — по чек-листу.'}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
            Черновик сохранён на этом устройстве. Вернись к нему через неделю и перепиши одну
            часть — это и есть редактура.
          </p>
        </div>

        <div className="mt-auto space-y-2.5 pt-8">
          <Button className="w-full" onClick={() => navigate('/studio')}>
            К студии
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/')}>
            На сегодня
          </Button>
        </div>
      </div>
    )
  }

  const stepDone = done[step] ?? false

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title={task.title}
        subtitle={task.kind === 'project' ? `Проект · ${task.subtitle}` : task.subtitle}
        onBack={() => navigate('/studio')}
        right={<span className="num text-[13px] text-ink-3">{step + 1} / 4</span>}
      />

      <div className="flex gap-1.5 px-5 pb-3">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex-1">
            <div className={`h-1 rounded-full ${index <= step ? 'bg-accent' : 'bg-line'}`} />
            <p
              className={`mt-1 text-[11px] leading-tight ${
                index === step ? 'font-medium text-ink' : 'text-ink-3'
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <main className="flex-1 px-5 pb-28 pt-4">
        {step === 0 && (
          <ReadingStep
            task={task}
            onDone={(score) => markDone(0, score ? { reading: score } : undefined)}
          />
        )}
        {step === 1 && (
          <ListeningStep
            task={task}
            onDone={(score) => markDone(1, score ? { listening: score } : undefined)}
          />
        )}
        {step === 2 && <WritingStep task={task} onDone={() => markDone(2, { writing: true })} />}
        {step === 3 && (
          <SpeakingStep task={task} onDone={(status) => markDone(3, { speaking: status })} />
        )}
      </main>

      <div
        className="sticky bottom-0 z-10 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {!stepDone && (
          <p className="mb-2 text-center text-[13px] text-ink-3">{STEP_HINTS[step]}</p>
        )}
        <Button className="w-full" disabled={!stepDone} onClick={() => void next()}>
          {step === 3 ? 'Завершить студию' : 'Дальше'}
        </Button>
      </div>
    </div>
  )
}
