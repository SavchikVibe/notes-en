import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { readings, type Reading } from '@/content/readings'
import { addStudyTime, finishLesson, getAllLessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { ReadView, type ExerciseViewHandle } from './lesson/exercises'

export default function ReadingScreen() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<Reading[] | null>(null)
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'answer' | 'feedback'>('answer')
  const [canCheck, setCanCheck] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(false)
  const [finished, setFinished] = useState(false)
  const viewRef = useRef<ExerciseViewHandle | null>(null)
  const startedAt = useRef(Date.now())

  function flushTime() {
    const seconds = (Date.now() - startedAt.current) / 1000
    startedAt.current = Date.now()
    if (seconds > 1) void addStudyTime(seconds)
  }

  useEffect(() => {
    void (async () => {
      const progress = await getAllLessonProgress()
      const done = new Set(
        Object.values(progress)
          .filter((item) => item.status === 'done')
          .map((item) => item.lessonId),
      )
      setQueue(readings.filter((reading) => !done.has(reading.id)))
    })()
  }, [])

  useEffect(() => {
    return () => flushTime()
  }, [])

  const current = queue?.[index]

  function handleResult(correct: boolean) {
    if (!current) return
    setLastCorrect(correct)
    setPhase('feedback')
    flushTime()
    void finishLesson(current.id, correct ? 1 : 0, current.questions.length)
  }

  function next() {
    if (!queue) return
    flushTime()
    if (index + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setPhase('answer')
    setCanCheck(false)
  }

  if (!queue) {
    return (
      <>
        <AppBar title="Чтение" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (finished || queue.length === 0) {
    return (
      <>
        <AppBar title="Чтение" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">Чтение на сегодня готово</h1>
          <p className="mt-2 text-[15px] text-ink-2">
            {queue.length === 0
              ? 'Все тексты этого этапа прочитаны. Новые появятся с обновлением контента.'
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Чтение"
        subtitle={`${index + 1} из ${queue.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <ReadView
          key={current.id}
          ref={viewRef}
          exercise={exercise}
          locked={phase === 'feedback'}
          onResult={handleResult}
          onCanCheck={setCanCheck}
        />

        {phase === 'feedback' && (
          <div
            className={`mt-6 rounded-[10px] border-l-2 p-4 ${
              lastCorrect ? 'border-accent bg-accent-soft' : 'border-err bg-err-soft'
            }`}
          >
            <p className={`text-[13px] font-medium ${lastCorrect ? 'text-accent' : 'text-err'}`}>
              {lastCorrect ? 'Верно' : 'Неверно'}
            </p>
            <p className="mt-1 text-[15px] leading-snug text-ink">
              Проверь подсвеченные ответы в тексте и прочитай его ещё раз.
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
            {index + 1 >= queue.length ? 'Готово' : 'Следующий текст'}
          </Button>
        )}
      </div>
    </div>
  )
}
