import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { getStudioTask } from '@/content/studio'
import { addStudyTime, finishLesson } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ReadingStep } from './studio/ReadingStep'
import { ListeningStep } from './studio/ListeningStep'
import { WritingStep } from './studio/WritingStep'
import { SpeakingStep } from './studio/SpeakingStep'

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

  const [step, setStep] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`studio:${id}`) ?? 'null') as {
        step?: number
      } | null
      return Math.min(3, Math.max(0, saved?.step ?? 0))
    } catch {
      return 0
    }
  })
  const [done, setDone] = useState<boolean[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`studio:${id}`) ?? 'null') as {
        done?: boolean[]
      } | null
      return Array.isArray(saved?.done) && saved.done.length === 4
        ? saved.done
        : [false, false, false, false]
    } catch {
      return [false, false, false, false]
    }
  })
  const [finished, setFinished] = useState(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    try {
      localStorage.setItem(`studio:${id}`, JSON.stringify({ step, done }))
    } catch {
      // Черновик шага не сохранится, но сама студия продолжит работать.
    }
  }, [id, step, done])

  const markDone = useCallback((index: number) => {
    setDone((current) => current.map((value, itemIndex) => (itemIndex === index ? true : value)))
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
    await finishLesson(task.id, 1, 4)
    await addStudyTime(Math.round((Date.now() - startedAt.current) / 1000))
    try {
      localStorage.removeItem(`studio:${id}`)
    } catch {
      // Не критично: при следующем запуске шаг просто восстановится.
    }
    setFinished(true)
  }

  if (finished) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 pb-8 pt-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={28} strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 text-[32px] leading-tight">Студия пройдена</h1>
        <p className="mt-1 text-[17px] text-ink-2">{task.title}</p>

        <div className="mt-8 border-t border-line pt-5">
          <p className="text-[15px] leading-relaxed text-ink-2">
            Ты прошёл полный цикл: прочитал текст, разобрал разговор на слух, написал текст и
            завершил устный шаг.
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
        subtitle={task.subtitle}
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
        {step === 0 && <ReadingStep task={task} onDone={() => markDone(0)} />}
        {step === 1 && <ListeningStep task={task} onDone={() => markDone(1)} />}
        {step === 2 && <WritingStep task={task} onDone={() => markDone(2)} />}
        {step === 3 && <SpeakingStep task={task} onDone={() => markDone(3)} />}
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
