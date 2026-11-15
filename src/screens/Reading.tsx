import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { units, type Level } from '@/content'
import { readings, type Reading } from '@/content/readings'
import { readingAudio } from '@/content/reading-audio'
import { addStudyTime, finishLesson, getAllLessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ReadView, type ExerciseViewHandle } from './lesson/exercises'

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export default function ReadingScreen() {
  const navigate = useNavigate()
  const [done, setDone] = useState<Set<string> | null>(null)
  const [level, setLevel] = useState<Level | 'all'>('A1')
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [lastScore, setLastScore] = useState(0)
  const [lastTotal, setLastTotal] = useState(0)
  const [finished, setFinished] = useState(false)
  const viewRef = useRef<ExerciseViewHandle | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioFailed, setAudioFailed] = useState(false)
  const startedAt = useRef(Date.now())

  function flushTime() {
    const seconds = (Date.now() - startedAt.current) / 1000
    startedAt.current = Date.now()
    if (seconds > 1) void addStudyTime(seconds)
  }

  useEffect(() => {
    void (async () => {
      const progress = await getAllLessonProgress()
      const finishedIds = new Set(
        Object.values(progress)
          .filter((item) => item.status === 'done')
          .map((item) => item.lessonId),
      )
      setDone(finishedIds)

      // По умолчанию открываем уровень, на котором сейчас идёт курс.
      const nextUnit = units.find((unit) => progress[unit.id]?.status !== 'done')
      if (nextUnit) setLevel(nextUnit.level)
    })()
  }, [])

  useEffect(() => {
    return () => flushTime()
  }, [])

  useEffect(() => {
    setIndex(0)
    setPhase('answer')
    setCanCheck(false)
    setFinished(false)
    setAudioFailed(false)
  }, [level])

  const unread = useMemo(() => {
    if (!done) return [] as Reading[]
    return readings.filter(
      (reading) => (level === 'all' || reading.level === level) && !done.has(reading.id),
    )
  }, [done, level])

  const counts = useMemo(() => {
    const map = new Map<Level, number>()
    if (!done) return map
    for (const reading of readings) {
      if (done.has(reading.id)) continue
      map.set(reading.level, (map.get(reading.level) ?? 0) + 1)
    }
    return map
  }, [done])

  const current = unread[index]
  const audioSrc =
    current && readingAudio[current.id]
      ? `${import.meta.env.BASE_URL}${readingAudio[current.id]}`
      : null
  const useAudio = Boolean(audioSrc) && !audioFailed

  useEffect(() => {
    setAudioFailed(false)
  }, [current?.id])

  // Аудио библиотеки не в precache: прогреваем кэш при открытии текста,
  // чтобы прослушивание работало офлайн и не требовало ждать при нажатии.
  useEffect(() => {
    if (!audioSrc || !navigator.onLine) return
    const controller = new AbortController()
    void fetch(audioSrc, { signal: controller.signal })
      .then((response) => response.arrayBuffer())
      .catch(() => {})
    return () => controller.abort()
  }, [audioSrc])

  function handleResult() {
    if (!current) return
    setPhase('feedback')
    flushTime()
  }

  function handleScore(correct: number, total: number) {
    if (!current) return
    setLastScore(correct)
    setLastTotal(total)
    const threshold = Math.ceil(total * 0.6)
    if (correct >= threshold) {
      void finishLesson(current.id, correct / total, total)
    }
  }

  function next() {
    flushTime()
    if (index + 1 >= unread.length) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setPhase('answer')
    setCanCheck(false)
  }

  if (!done) {
    return (
      <>
        <AppBar title="Чтение" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const levelChips = (
    <div className="mb-5 flex flex-wrap gap-2">
      {LEVELS.map((item) => {
        const active = level === item
        return (
          <button
            key={item}
            type="button"
            onClick={() => setLevel(item)}
            className={`flex min-h-10 items-center gap-1.5 rounded-[10px] border px-3 text-[15px] ${
              active
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line bg-surface text-ink-2'
            }`}
          >
            <span className="num">{item}</span>
            <span className="text-[12px] text-ink-3">{counts.get(item) ?? 0}</span>
          </button>
        )
      })}
      <button
        type="button"
        onClick={() => setLevel('all')}
        className={`flex min-h-10 items-center rounded-[10px] border px-3 text-[15px] ${
          level === 'all'
            ? 'border-accent bg-accent-soft text-accent'
            : 'border-line bg-surface text-ink-2'
        }`}
      >
        Все
      </button>
    </div>
  )

  if (finished || unread.length === 0) {
    return (
      <>
        <AppBar title="Чтение" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-6">
          {levelChips}
          <div className="mt-4 flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">
            {unread.length === 0 ? 'Этот уровень прочитан' : 'Чтение на сегодня готово'}
          </h1>
          <p className="mt-2 text-[15px] leading-snug text-ink-2">
            {unread.length === 0
              ? 'Выбери другой уровень выше или вернись к текстам позже: слабый результат оставляет текст в библиотеке.'
              : `Прочитано текстов: ${index + 1}.`}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  if (!current) return null

  const exercise = {
    kind: 'read' as const,
    id: current.id,
    title: current.title,
    paragraphs: current.paragraphs,
    questions: current.questions,
  }

  const threshold = Math.ceil((lastTotal || current.questions.length) * 0.6)
  const passed = lastScore >= threshold

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Чтение"
        subtitle={`${current.level} · ${index + 1} из ${unread.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        {levelChips}

        {useAudio && (
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const audio = audioRef.current
                if (!audio) return
                audio.currentTime = 0
                void audio.play().catch(() => setAudioFailed(true))
              }}
              className="flex min-h-11 items-center rounded-[10px] border border-line-strong bg-surface px-3 text-[15px]"
            >
              Прослушать текст
            </button>
            <button
              type="button"
              onClick={() => {
                audioRef.current?.pause()
                if (audioRef.current) audioRef.current.currentTime = 0
              }}
              className="flex min-h-11 items-center rounded-[10px] border border-line px-3 text-[15px] text-ink-2"
            >
              Стоп
            </button>
          </div>
        )}

        {audioSrc && (
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="none"
            onError={() => setAudioFailed(true)}
            className="hidden"
          />
        )}

        {audioSrc && audioFailed && (
          <p className="mb-4 text-[13px] leading-snug text-ink-3">
            Аудио не загрузилось. Оно скачивается при первом прослушивании — включи сеть один раз,
            дальше работает офлайн.
          </p>
        )}

        <ReadView
          key={current.id}
          ref={viewRef}
          exercise={exercise}
          locked={phase === 'feedback'}
          onResult={handleResult}
          onCanCheck={setCanCheck}
          onScore={handleScore}
        />

        {phase === 'feedback' && (
          <div
            className={`mt-6 rounded-[10px] border-l-2 p-4 ${
              passed ? 'border-accent bg-accent-soft' : 'border-err bg-err-soft'
            }`}
          >
            <p className={`text-[13px] font-medium ${passed ? 'text-accent' : 'text-err'}`}>
              {passed ? 'Засчитано' : 'Пока не засчитано'}
            </p>
            <p className="mt-1 text-[15px] leading-snug text-ink">
              {passed
                ? 'Текст засчитан. Можно переходить к следующему.'
                : `Нужно хотя бы ${threshold} правильных ответов из ${lastTotal}. Текст останется в библиотеке.`}
            </p>
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
            {index + 1 >= unread.length ? 'Готово' : 'Следующий текст'}
          </Button>
        )}
      </div>
    </div>
  )
}
