import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { allWords, units } from '@/content'
import {
  addWordsToSrs,
  getAllLessonProgress,
  getDueCards,
  reviewCard,
  type SrsCard,
} from '@/db/db'
import { buildCloze } from '@/lib/srs'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/components/SpeakButton'

export default function ReviewScreen() {
  const navigate = useNavigate()
  const words = useMemo(() => allWords(), [])
  const [queue, setQueue] = useState<SrsCard[] | null>(null)
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const correct = useRef(0)
  const wrong = useRef(0)
  const requeued = useRef(new Set<string>())

  useEffect(() => {
    void (async () => {
      const progress = await getAllLessonProgress()
      const done = new Set(
        Object.values(progress)
          .filter((item) => item.status === 'done')
          .map((item) => item.lessonId),
      )
      await addWordsToSrs(
        units
          .filter((unit) => done.has(unit.id))
          .flatMap((unit) => unit.words.map((word) => word.id)),
      )
      const due = await getDueCards(20)
      const known = new Set(words.map((item) => item.id))
      setQueue(due.filter((card) => known.has(card.wordId)))
    })()
  }, [words])

  const card = queue?.[index]
  const word = card ? words.find((item) => item.id === card.wordId) : undefined
  const cloze = useMemo(() => (word ? buildCloze(word, words) : null), [word, words])

  function choose(option: string) {
    if (picked || !card || !word) return
    setPicked(option)
    const ok = option === word.term
    if (ok) correct.current += 1
    else wrong.current += 1
    void reviewCard(card.wordId, ok)

    if (!ok && !requeued.current.has(card.wordId)) {
      requeued.current.add(card.wordId)
      setQueue((current) => (current ? [...current, card] : current))
    }
  }

  function next() {
    if (!queue) return
    if (index + 1 >= queue.length) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setPicked(null)
  }

  if (!queue) {
    return (
      <>
        <AppBar title="Повторение" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (queue.length === 0) {
    return (
      <>
        <AppBar title="Повторение" onBack={() => navigate('/')} />
        <main className="px-5 pt-10">
          <h1 className="text-[28px] leading-tight">Повторять пока нечего</h1>
          <p className="mt-2 text-[15px] text-ink-2">
            Слова появятся здесь после первого пройденного урока.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  if (finished) {
    return (
      <>
        <AppBar title="Повторение" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">Повторение завершено</h1>
          <p className="mt-2 text-[17px] text-ink-2">
            Верно: {correct.current} · Ошибок: {wrong.current}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate('/')}>
            Готово
          </Button>
        </main>
      </>
    )
  }

  if (!word || !cloze || !card) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Повторение"
        subtitle={`${index + 1} из ${queue.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        <p className="text-[13px] font-medium text-ink-3">Выбери пропущенное слово</p>

        <p className="mt-2 font-serif text-[22px] leading-snug">
          {cloze.sentence.split('____').map((part, partIndex, parts) => (
            <span key={partIndex}>
              {part}
              {partIndex < parts.length - 1 && (
                <span className="mx-1 inline-block w-16 border-b-2 border-ink-2/60 align-baseline" />
              )}
            </span>
          ))}
        </p>

        <p className="mt-1 text-[15px] text-ink-2">{cloze.translation}</p>

        <div className="mt-6 space-y-2.5">
          {cloze.options.map((option) => {
            const base =
              'flex w-full min-h-14 items-center rounded-[10px] border bg-surface px-4 py-3 text-left text-[17px] transition-colors disabled:opacity-100'
            const className = picked
              ? option === cloze.answer
                ? `${base} border-accent bg-accent-soft`
                : option === picked
                  ? `${base} border-err bg-err-soft`
                  : `${base} border-line`
              : `${base} border-line`
            return (
              <button
                key={option}
                type="button"
                disabled={!!picked}
                onClick={() => choose(option)}
                className={className}
              >
                {option}
              </button>
            )
          })}
        </div>

        {picked && (
          <div
            className={`mt-6 rounded-[10px] border-l-2 p-4 ${
              picked === cloze.answer ? 'border-accent bg-accent-soft' : 'border-err bg-err-soft'
            }`}
          >
            <p
              className={`text-[13px] font-medium ${
                picked === cloze.answer ? 'text-accent' : 'text-err'
              }`}
            >
              {picked === cloze.answer ? 'Верно' : 'Неверно'}
            </p>
            <div className="mt-1 flex items-start gap-1">
              <SpeakButton text={cloze.sentence.replace('____', cloze.answer)} size={14} compact />
              <div>
                <p className="text-[15px] leading-snug text-ink">
                  {cloze.sentence.replace('____', cloze.answer)}
                </p>
                <p className="text-[14px] leading-snug text-ink-2">{word.translation}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <div
        className="sticky bottom-0 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <Button className="w-full" disabled={!picked} onClick={next}>
          {index + 1 >= queue.length ? 'Завершить' : 'Дальше'}
        </Button>
      </div>
    </div>
  )
}
