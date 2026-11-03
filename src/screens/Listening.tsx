import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { readings, type Reading } from '@/content/readings'
import { addStudyTime, finishLesson, getAllLessonProgress } from '@/db/db'
import { normalizeAnswer } from '@/lib/text'
import { speak } from '@/lib/speech'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { SpeakButton } from '@/components/SpeakButton'

type Step = 'gist' | 'dictation' | 'shadow'

function sentencesOf(reading: Reading): string[] {
  return reading.paragraphs
    .flatMap((paragraph) => paragraph.split(/(?<=[.!?])\s+/))
    .map((sentence) => sentence.replace(/^[A-Z][a-z]+:\s*/, '').trim())
    .filter((sentence) => {
      const words = sentence.split(/\s+/).length
      return words >= 4 && words <= 7
    })
    .slice(0, 2)
}

function optionClass(selected: boolean, correct: boolean, checked: boolean): string {
  const base =
    'flex w-full min-h-14 items-center rounded-[10px] border bg-surface px-4 py-3 text-left text-[17px] disabled:opacity-100'
  if (!checked) return `${base} ${selected ? 'border-line-strong ring-2 ring-line-strong' : 'border-line'}`
  if (correct) return `${base} border-accent bg-accent-soft`
  if (selected) return `${base} border-err bg-err-soft`
  return `${base} border-line`
}

export default function ListeningScreen() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<Reading[] | null>(null)
  const [index, setIndex] = useState(0)
  const [step, setStep] = useState<Step>('gist')
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [gistChecked, setGistChecked] = useState(false)
  const [gistCorrect, setGistCorrect] = useState(0)
  const [dictationIndex, setDictationIndex] = useState(0)
  const [dictation, setDictation] = useState('')
  const [dictationChecked, setDictationChecked] = useState(false)
  const [dictationCorrect, setDictationCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
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
      setQueue(readings.filter((reading) => !done.has(`listening-${reading.id}`)))
    })()
  }, [])

  useEffect(() => {
    return () => flushTime()
  }, [])

  const current = queue?.[index]
  const sentences = current ? sentencesOf(current) : []
  const sentence = sentences[dictationIndex]
  const fullText =
    current?.paragraphs.map((paragraph) => paragraph.replace(/^[A-Z][a-z]+:\s*/, '')).join(' ') ?? ''
  const allAnswered = current ? current.questions.every((_, i) => answers[i] !== undefined) : false

  function checkGist() {
    if (!current) return
    const correct = current.questions.filter((question, i) => answers[i] === question.answer).length
    setGistCorrect(correct)
    setGistChecked(true)
  }

  function checkDictation() {
    if (!sentence) return
    const ok = normalizeAnswer(dictation) === normalizeAnswer(sentence)
    if (ok) setDictationCorrect((value) => value + 1)
    setDictationChecked(true)
  }

  function toDictation() {
    if (sentences.length === 0) {
      setStep('shadow')
      return
    }
    setStep('dictation')
    setDictationIndex(0)
    setDictation('')
    setDictationChecked(false)
  }

  function toNextDictation() {
    if (dictationIndex + 1 < sentences.length) {
      setDictationIndex((value) => value + 1)
      setDictation('')
      setDictationChecked(false)
      return
    }
    setStep('shadow')
  }

  async function finish() {
    if (!current || !queue) return
    flushTime()
    const total = current.questions.length + sentences.length
    const correct = gistCorrect + dictationCorrect
    await finishLesson(`listening-${current.id}`, total > 0 ? correct / total : 0, total)

    if (index + 1 >= queue.length) {
      setFinished(true)
      return
    }

    setIndex((value) => value + 1)
    setStep('gist')
    setAnswers({})
    setGistChecked(false)
    setGistCorrect(0)
    setDictationIndex(0)
    setDictation('')
    setDictationChecked(false)
    setDictationCorrect(0)
    startedAt.current = Date.now()
  }

  if (!queue) {
    return (
      <>
        <AppBar title="Слушание" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  if (finished || queue.length === 0) {
    return (
      <>
        <AppBar title="Слушание" onBack={() => navigate('/')} />
        <main className="px-5 pb-8 pt-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Check size={28} strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 text-[30px] leading-tight">Слушание готово</h1>
          <p className="mt-2 text-[15px] text-ink-2">
            {queue.length === 0
              ? 'Все тексты этого этапа разобраны. Новые появятся с обновлением контента.'
              : `Разобрано текстов: ${index + 1}.`}
          </p>
          <Button className="mt-8 w-full" onClick={() => navigate('/')}>
            К занятиям
          </Button>
        </main>
      </>
    )
  }

  if (!current) return null

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title="Слушание"
        subtitle={`${index + 1} из ${queue.length}`}
        onBack={() => navigate('/')}
      />

      <main className="flex-1 px-5 pb-8 pt-6">
        {step === 'gist' && (
          <>
            <p className="text-[13px] font-medium text-ink-3">Шаг 1 · Слушай</p>
            <h1 className="mt-1 text-[22px] leading-tight">Прослушай текст</h1>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => speak(fullText)}
                className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px]"
              >
                <Play size={18} strokeWidth={1.5} />
                Прослушать
              </button>
              <button
                type="button"
                onClick={() => speak(fullText, 0.7)}
                className="flex min-h-12 items-center rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
              >
                0.7×
              </button>
            </div>

            <p className="mt-2 text-[13px] text-ink-3">
              Текст скрыт. Слушай и отвечай на вопросы.
            </p>

            <div className="mt-6 space-y-6">
              {current.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="space-y-3">
                  <p className="text-[16px] font-medium text-ink">
                    {questionIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[questionIndex] === optionIndex
                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={gistChecked}
                          onClick={() =>
                            setAnswers((value) => ({ ...value, [questionIndex]: optionIndex }))
                          }
                          className={optionClass(
                            selected,
                            optionIndex === question.answer,
                            gistChecked,
                          )}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {gistChecked && (
              <div
                className={`mt-6 rounded-[10px] border-l-2 p-4 ${
                  gistCorrect === current.questions.length
                    ? 'border-accent bg-accent-soft'
                    : 'border-err bg-err-soft'
                }`}
              >
                <p
                  className={`text-[13px] font-medium ${
                    gistCorrect === current.questions.length ? 'text-accent' : 'text-err'
                  }`}
                >
                  Верно: {gistCorrect} из {current.questions.length}
                </p>
                <div className="mt-3 space-y-2">
                  {current.paragraphs.map((paragraph, paragraphIndex) => (
                    <div key={paragraphIndex} className="flex items-start gap-1">
                      <SpeakButton text={paragraph} size={14} compact />
                      <p className="text-[15px] leading-relaxed text-ink-2">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 'dictation' && (
          <>
            <p className="text-[13px] font-medium text-ink-3">
              Шаг 2 · Диктант {dictationIndex + 1} из {sentences.length}
            </p>
            <h1 className="mt-1 text-[22px] leading-tight">Напиши, что слышишь</h1>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => sentence && speak(sentence)}
                className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px]"
              >
                <Play size={18} strokeWidth={1.5} />
                Прослушать
              </button>
              <button
                type="button"
                onClick={() => sentence && speak(sentence, 0.7)}
                className="flex min-h-12 items-center rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
              >
                0.7×
              </button>
            </div>

            <input
              value={dictation}
              onChange={(event) => setDictation(event.target.value)}
              disabled={dictationChecked}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Напиши фразу по-английски"
              className="mt-6 w-full rounded-[10px] border border-line bg-surface px-4 py-3.5 text-[17px] outline-none placeholder:text-ink-3 focus:border-line-strong disabled:opacity-100"
            />

            {dictationChecked && sentence && (
              <div
                className={`mt-4 rounded-[10px] border-l-2 p-4 ${
                  normalizeAnswer(dictation) === normalizeAnswer(sentence)
                    ? 'border-accent bg-accent-soft'
                    : 'border-err bg-err-soft'
                }`}
              >
                <p
                  className={`text-[13px] font-medium ${
                    normalizeAnswer(dictation) === normalizeAnswer(sentence)
                      ? 'text-accent'
                      : 'text-err'
                  }`}
                >
                  {normalizeAnswer(dictation) === normalizeAnswer(sentence) ? 'Верно' : 'Неверно'}
                </p>
                <div className="mt-1 flex items-start gap-1">
                  <SpeakButton text={sentence} size={14} compact />
                  <p className="text-[15px] leading-snug text-ink">{sentence}</p>
                </div>
              </div>
            )}
          </>
        )}

        {step === 'shadow' && (
          <>
            <p className="text-[13px] font-medium text-ink-3">Шаг 3 · Повтори</p>
            <h1 className="mt-1 text-[22px] leading-tight">Слушай и повторяй вслух</h1>
            <p className="mt-2 text-[13px] text-ink-3">
              Включи абзац, говори вместе с диктором, затем повтори сам.
            </p>

            <div className="mt-5 space-y-4">
              {current.paragraphs.map((paragraph, paragraphIndex) => (
                <div key={paragraphIndex} className="flex items-start gap-1">
                  <SpeakButton text={paragraph} size={15} compact />
                  <p className="text-[17px] leading-relaxed text-ink-2">{paragraph}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <div
        className="sticky bottom-0 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {step === 'gist' &&
          (gistChecked ? (
            <Button className="w-full" onClick={toDictation}>
              Дальше
            </Button>
          ) : (
            <Button className="w-full" disabled={!allAnswered} onClick={checkGist}>
              Проверить
            </Button>
          ))}

        {step === 'dictation' &&
          (dictationChecked ? (
            <Button className="w-full" onClick={toNextDictation}>
              {dictationIndex + 1 < sentences.length ? 'Следующая фраза' : 'Дальше'}
            </Button>
          ) : (
            <Button className="w-full" disabled={!dictation.trim()} onClick={checkDictation}>
              Проверить
            </Button>
          ))}

        {step === 'shadow' && (
          <Button className="w-full" onClick={() => void finish()}>
            {index + 1 >= queue.length ? 'Завершить' : 'Следующий текст'}
          </Button>
        )}
      </div>
    </div>
  )
}
