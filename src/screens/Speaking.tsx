import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mic, Play, Square } from 'lucide-react'
import { units } from '@/content'
import { speakingTasksFor, type SpeakingTask } from '@/content/speaking'
import { getAllLessonProgress, getKv, setKv } from '@/db/db'
import { speak } from '@/lib/speech'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/components/SpeakButton'

type Phase = 'idle' | 'prep' | 'recording' | 'recorded'

const DONE_KEY = 'speaking-done'
const TASKS_PER_SESSION = 2

export default function SpeakingScreen() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<SpeakingTask[] | null>(null)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checks, setChecks] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)
  const [sessionRecorded, setSessionRecorded] = useState(0)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const doneRef = useRef<Record<string, number>>({})

  useEffect(() => {
    void (async () => {
      const [progress, done] = await Promise.all([
        getAllLessonProgress(),
        getKv<Record<string, number>>(DONE_KEY),
      ])
      const completed = done ?? {}
      doneRef.current = completed
      const nextUnit = units.find((unit) => progress[unit.id]?.status !== 'done')
      const level = nextUnit?.level ?? 'A1'
      const levelTasks = speakingTasksFor(level)
      const fresh = levelTasks.filter((task) => !completed[task.id])
      const pickSession = (pool: SpeakingTask[]): SpeakingTask[] => {
        const answer = pool.find((item) => item.mode !== 'shadow')
        const shadow = pool.find((item) => item.mode === 'shadow')
        if (answer && shadow) return [answer, shadow]
        return pool.slice(0, TASKS_PER_SESSION)
      }
      const chosen =
        fresh.length > 0
          ? pickSession(fresh)
          : pickSession(
              [...levelTasks].sort((a, b) => (completed[a.id] ?? 0) - (completed[b.id] ?? 0)),
            )
      setQueue(chosen)
    })()
  }, [])

  const task = queue?.[index]

  useEffect(() => {
    if (phase !== 'prep' && phase !== 'recording') return
    if (secondsLeft <= 0) {
      if (phase === 'recording') recorderRef.current?.stop()
      else setPhase('idle')
      return
    }
    const id = setTimeout(() => setSecondsLeft((value) => value - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, secondsLeft])

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current
      if (recorder && recorder.state === 'recording') recorder.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  function resetTask() {
    setPhase('idle')
    setSecondsLeft(0)
    setError(null)
    setChecks([])
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
  }

  function startPrep() {
    if (!task) return
    setPhase('prep')
    setSecondsLeft(task.preparationSeconds)
  }

  async function startRecording() {
    if (!task) return
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        setAudioUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous)
          return URL.createObjectURL(blob)
        })
        setPhase('recorded')
        stream.getTracks().forEach((track) => track.stop())
      }
      recorderRef.current = recorder
      recorder.start()
      setPhase('recording')
      setSecondsLeft(task.speakingSeconds)
    } catch {
      setError('Микрофон недоступен. Нужен HTTPS или localhost и разрешение браузера.')
    }
  }

  async function next() {
    if (!queue || !task) return
    if (audioUrl || phase === 'recorded') {
      setSessionRecorded((value) => value + 1)
      const updated = { ...doneRef.current, [task.id]: Date.now() }
      doneRef.current = updated
      await setKv(DONE_KEY, updated)
    }
    if (index + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    resetTask()
  }

  if (!queue) {
    return (
      <>
        <AppBar title="Речь" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (finished || queue.length === 0) {
    return (
      <>
        <AppBar title="Речь" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">Речь на сегодня готова</h1>
          <p className="mt-2 text-[15px] leading-snug text-ink-2">
            {sessionRecorded > 0
              ? `Записано ответов: ${sessionRecorded}. Это не оценка произношения: важно говорить вслух и слышать себя.`
              : 'Ответы не записаны. Можно вернуться к блоку, когда будет тихое место и микрофон.'}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  if (!task) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Речь"
        subtitle={`${task.level} · ${index + 1} из ${queue.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <h1 className="text-[26px] leading-tight">{task.title}</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{task.prompt}</p>

        {task.mode === 'shadow' && task.lines && task.lines.length > 0 && (
          <div className="mt-4 border-l-2 border-accent pl-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-ink-3">Образец</p>
              <button
                type="button"
                onClick={() => speak(task.lines!.join(' '), 0.9)}
                className="flex min-h-9 items-center rounded-[8px] border border-line px-2.5 text-[13px] text-ink-2"
              >
                Прослушать всё
              </button>
            </div>
            <ul className="mt-2 space-y-1.5">
              {task.lines.map((line) => (
                <li key={line} className="flex items-start gap-1">
                  <SpeakButton text={line} size={14} compact />
                  <p className="font-serif text-[17px] leading-snug">{line}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] leading-snug text-ink-3">
              Сначала прослушай каждую фразу, потом повтори все три без текста.
            </p>
          </div>
        )}

        {task.pairs && task.pairs.length > 0 && (
          <div className="mt-4 border-l-2 border-accent pl-4">
            <p className="text-[13px] font-medium text-ink-3">Пары звуков</p>
            <ul className="mt-2 space-y-1.5">
              {task.pairs.map(([left, right]) => (
                <li key={`${left}-${right}`} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="flex items-center gap-1">
                    <SpeakButton text={left} size={14} compact />
                    <span className="font-serif text-[17px] leading-snug">{left}</span>
                  </span>
                  <span className="text-ink-3">—</span>
                  <span className="flex items-center gap-1">
                    <SpeakButton text={right} size={14} compact />
                    <span className="font-serif text-[17px] leading-snug">{right}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] leading-snug text-ink-3">
              Сначала прослушай оба слова, потом запиши все пары без текста.
            </p>
          </div>
        )}

        {task.usefulLanguage && task.usefulLanguage.length > 0 && (
          <div className="mt-4 border-l-2 border-accent pl-4">
            <p className="text-[13px] font-medium text-ink-3">Можно использовать</p>
            <ul className="mt-1 space-y-0.5">
              {task.usefulLanguage.map((phrase) => (
                <li key={phrase} className="font-serif text-[16px] leading-snug">
                  {phrase}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          {phase === 'idle' && (
            <Button variant="secondary" onClick={startPrep}>
              Подготовка {task.preparationSeconds} сек
            </Button>
          )}
          {phase === 'prep' && (
            <span className="flex min-h-12 items-center rounded-[10px] border border-line px-4 text-[15px] text-ink-2">
              Подготовка: {secondsLeft} сек
            </span>
          )}
          {phase === 'recording' ? (
            <button
              type="button"
              onClick={() => recorderRef.current?.stop()}
              className="flex min-h-12 items-center gap-2 rounded-[10px] bg-err px-4 text-[16px] text-paper"
            >
              <Square size={17} strokeWidth={1.5} />
              Стоп · {secondsLeft} сек
            </button>
          ) : (
            <Button onClick={() => void startRecording()}>
              <Mic size={19} strokeWidth={1.5} />
              {audioUrl ? 'Записать ещё' : 'Записать'}
            </Button>
          )}
          <button
            type="button"
            disabled={!audioUrl}
            onClick={() => audioRef.current?.play()}
            className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px] disabled:opacity-40"
          >
            <Play size={18} strokeWidth={1.5} />
            Моя запись
          </button>
        </div>

        {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
        {error && <p className="mt-3 text-[15px] text-err">{error}</p>}

        <div className="mt-7 border-t border-line pt-5">
          <p className="text-[13px] font-medium text-ink-3">Самопроверка</p>
          <ul className="mt-2 space-y-2">
            {task.checklist.map((item, itemIndex) => (
              <li key={item}>
                <label className="flex items-start gap-2 text-[15px] leading-snug text-ink">
                  <input
                    type="checkbox"
                    checked={checks[itemIndex] ?? false}
                    onChange={() =>
                      setChecks((current) =>
                        current.map((checkedItem, checkedIndex) =>
                          checkedIndex === itemIndex ? !checkedItem : checkedItem,
                        ),
                      )
                    }
                    className="mt-0.5 size-4 accent-[var(--color-accent)]"
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
            Чек-лист не блокирует завершение. Достаточно записать ответ или пропустить задание.
          </p>
        </div>

        <div className="mt-7 border-t border-line pt-5">
          <p className="text-[13px] font-medium text-ink-3">Беглость</p>
          <p className="mt-1 text-[15px] leading-snug text-ink-2">
            60 секунд без подготовки: говори на тему, послушай себя, повтори.
          </p>
          <Button variant="secondary" className="mt-3" onClick={() => navigate('/fluency')}>
            Открыть цикл беглости
          </Button>
        </div>
      </main>

      <div
        className="sticky bottom-0 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <Button className="w-full" disabled={!audioUrl} onClick={() => void next()}>
          {index + 1 >= queue.length ? 'Завершить' : 'Следующее задание'}
        </Button>
        <button
          type="button"
          onClick={() => void next()}
          className="mt-2 w-full py-2 text-[15px] text-ink-3 underline underline-offset-4"
        >
          Пропустить без записи
        </button>
      </div>
    </div>
  )
}
