import { useEffect, useRef, useState } from 'react'
import { Mic, Play, Square } from 'lucide-react'
import type { StudioTask } from '@/content/studio'
import { Button } from '@/components/Button'

type Phase = 'idle' | 'prep' | 'recording' | 'recorded'

export function SpeakingStep({
  task,
  onDone,
}: {
  task: StudioTask
  onDone: () => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)
  const [checks, setChecks] = useState<boolean[]>(() =>
    task.speaking.checklist.map(() => false),
  )

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const doneCalled = useRef(false)

  const done = audioUrl !== null || skipped

  useEffect(() => {
    if (done && !doneCalled.current) {
      doneCalled.current = true
      onDone()
    }
  }, [done, onDone])

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
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  function startPrep() {
    setPhase('prep')
    setSecondsLeft(task.speaking.preparationSeconds)
  }

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
      setPhase('recording')
      setSecondsLeft(task.speaking.speakingSeconds)
    } catch {
      setError('Микрофон недоступен. Нужен HTTPS или localhost и разрешение браузера.')
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
  }

  function resetRecording() {
    setAudioUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setPhase('idle')
    setChecks(task.speaking.checklist.map(() => false))
    setSkipped(false)
    doneCalled.current = false
  }

  function skip() {
    setSkipped(true)
    doneCalled.current = true
    onDone()
  }

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-3">Шаг 4 · Речь</p>
      <h1 className="mt-1 text-[26px] leading-tight">
        {task.speaking.title ?? 'Расскажи о месте, которое хочешь изменить'}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{task.speaking.prompt}</p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {phase === 'idle' && (
          <Button variant="secondary" onClick={startPrep}>
            Подготовка {task.speaking.preparationSeconds} сек
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
            onClick={stopRecording}
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
          {task.speaking.checklist.map((item, index) => (
            <li key={item}>
              <label className="flex items-start gap-2 text-[15px] leading-snug text-ink">
                <input
                  type="checkbox"
                  checked={checks[index] ?? false}
                  onChange={() =>
                    setChecks((current) =>
                      current.map((checkedItem, itemIndex) =>
                        itemIndex === index ? !checkedItem : checkedItem,
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
          Чек-лист — для самопроверки. Он не блокирует завершение: достаточно записи или пропуска.
          Это не оценка произношения.
        </p>
      </div>

      {!audioUrl && !skipped && (
        <button
          type="button"
          onClick={skip}
          className="mt-4 text-[15px] text-ink-3 underline underline-offset-4"
        >
          Пропустить речь
        </button>
      )}

      {skipped && (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
          Речь пропущена. Можно завершить студию и вернуться к записи позже.
        </p>
      )}

      {audioUrl && (
        <button
          type="button"
          onClick={resetRecording}
          className="mt-4 text-[15px] text-ink-3 underline underline-offset-4"
        >
          Удалить запись и начать заново
        </button>
      )}
    </div>
  )
}
