import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Play, Square } from 'lucide-react'
import { units } from '@/content'
import { fluencyPromptsFor, type FluencyPrompt } from '@/content/fluency'
import { getAllLessonProgress, getKv, setKv } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'

type Phase = 'idle' | 'recording' | 'recorded'

const SECONDS = 60
const TURN_KEY = 'fluency-turn'

export default function FluencyScreen() {
  const navigate = useNavigate()
  const [prompts, setPrompts] = useState<FluencyPrompt[] | null>(null)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const [secondsLeft, setSecondsLeft] = useState(SECONDS)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [round, setRound] = useState(1)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    void (async () => {
      const [progress, turn] = await Promise.all([
        getAllLessonProgress(),
        getKv<number>(TURN_KEY),
      ])
      const nextUnit = units.find((unit) => progress[unit.id]?.status !== 'done')
      const level = nextUnit?.level ?? 'A1'
      const list = fluencyPromptsFor(level)
      const start = (turn ?? 0) % Math.max(1, list.length)
      setIndex(start)
      setPrompts(list)
    })()
  }, [])

  useEffect(() => {
    if (phase !== 'recording') return
    if (secondsLeft <= 0) {
      recorderRef.current?.stop()
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

  const prompt = prompts?.[index]

  async function startRecording() {
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
      setSecondsLeft(SECONDS)
      setPhase('recording')
    } catch {
      setError('Микрофон недоступен. Нужен HTTPS или localhost и разрешение браузера.')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function repeatSame() {
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setPhase('idle')
    setRound((value) => value + 1)
    void startRecording()
  }

  async function nextPrompt() {
    if (!prompts || prompts.length === 0) return
    const next = (index + 1) % prompts.length
    await setKv(TURN_KEY, next)
    setIndex(next)
    setRound(1)
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setPhase('idle')
    setSecondsLeft(SECONDS)
  }

  if (!prompts) {
    return (
      <>
        <AppBar title="Беглость" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (!prompt) {
    return (
      <>
        <AppBar title="Беглость" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <h1 className="text-[28px] leading-tight">Тем пока нет</h1>
          <Button className="mt-6 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Беглость"
        subtitle={`${prompt.level} · ${index + 1} из ${prompts.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <p className="text-[13px] font-medium text-ink-3">
          {round === 1 ? 'Первый заход' : `Заход ${round} — та же тема`}
        </p>
        <h1 className="mt-1 text-[26px] leading-tight">{prompt.title}</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{prompt.prompt}</p>

        <p className="mt-4 border-l-2 border-line-strong pl-3 text-[14px] leading-snug text-ink-3">
          Без подготовки. Говори 60 секунд, даже если не знаешь слово — опиши его иначе. Цель —
          не идеальная фраза, а поток речи.
        </p>

        {phase === 'recording' && (
          <p className="num mt-6 font-serif text-[56px] leading-none text-ink">{secondsLeft}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-2.5">
          {phase === 'idle' && (
            <Button onClick={() => void startRecording()}>
              <Mic size={19} strokeWidth={1.5} />
              Говорить 60 секунд
            </Button>
          )}
          {phase === 'recording' && (
            <button
              type="button"
              onClick={stopRecording}
              className="flex min-h-12 items-center gap-2 rounded-[10px] bg-err px-4 text-[16px] text-paper"
            >
              <Square size={17} strokeWidth={1.5} />
              Стоп · {secondsLeft} сек
            </button>
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

        {phase === 'recorded' && (
          <div className="mt-7 border-t border-line pt-5">
            <p className="text-[15px] leading-relaxed text-ink-2">
              Послушай запись. Потом повтори ту же тему: второй раз обычно выходит ровнее.
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Button variant="secondary" onClick={repeatSame}>
                Повторить тему
              </Button>
              <button
                type="button"
                onClick={() => void nextPrompt()}
                className="flex min-h-12 items-center rounded-[10px] border border-line px-4 text-[16px] text-ink-2"
              >
                Другая тема
              </button>
            </div>
          </div>
        )}

        {phase === 'idle' && round > 1 && (
          <button
            type="button"
            onClick={() => void nextPrompt()}
            className="mt-5 text-[15px] text-ink-3 underline underline-offset-4"
          >
            Пропустить и взять другую тему
          </button>
        )}
      </main>

      <div
        className="sticky bottom-0 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <p className="text-[13px] leading-snug text-ink-3">
          Это не оценка. Запись остаётся только на телефоне и никуда не отправляется.
        </p>
      </div>
    </div>
  )
}
