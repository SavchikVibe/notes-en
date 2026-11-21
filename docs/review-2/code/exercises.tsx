import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { Mic, Play, Square, Volume2 } from 'lucide-react'
import type {
  AssembleExercise,
  ChoiceExercise,
  Exercise,
  ListenExercise,
  ReadExercise,
  SpeakExercise,
  TranslateExercise,
  WriteExercise,
} from '@/content'
import { matchesAny, normalizeAnswer, normalizeToken } from '@/lib/text'
import { getWriting, markWritingChecked, saveWriting } from '@/db/db'
import { shuffle, shuffleOptions } from '@/lib/options'
import { speak, speechSupported } from '@/lib/speech'
import { SpeakButton } from '@/components/SpeakButton'

export interface ExerciseViewHandle {
  check: () => void
}

export interface ExerciseViewProps {
  exercise: Exercise
  locked: boolean
  onResult: (correct: boolean) => void
  onCanCheck: (can: boolean) => void
  onSkip?: () => void
  /** Для чтения: сколько вопросов верно из скольких. */
  onScore?: (correct: number, total: number) => void
}

type OptionState = 'idle' | 'picked' | 'correct' | 'wrong'

function optionClass(state: OptionState): string {
  const base =
    'flex w-full min-h-14 items-center rounded-[10px] border bg-surface px-4 py-3 text-left text-[17px] leading-snug transition-colors disabled:opacity-100'
  switch (state) {
    case 'picked':
      return `${base} border-line-strong ring-2 ring-line-strong`
    case 'correct':
      return `${base} border-accent bg-accent-soft`
    case 'wrong':
      return `${base} border-err bg-err-soft`
    default:
      return `${base} border-line`
  }
}

function Letter({ index }: { index: number }) {
  return <span className="num mr-3 text-[13px] text-ink-3">{String.fromCharCode(65 + index)}</span>
}

function Stem({ children }: { children: ReactNode }) {
  return <p className="font-serif text-[22px] leading-snug text-ink">{children}</p>
}

function Blank() {
  return (
    <span
      aria-label="пропуск"
      className="mx-1 inline-block w-14 border-b-2 border-ink-2/60 align-baseline"
    />
  )
}

function QuestionText({ text }: { text: string }) {
  const parts = text.split('___')
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && <Blank />}
        </span>
      ))}
    </>
  )
}

/* ---------------------------------- choice --------------------------------- */

export const ChoiceView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function ChoiceView({ exercise, locked, onResult, onCanCheck }, ref) {
    const ex = exercise as ChoiceExercise
    const prepared = useMemo(
      () => shuffleOptions(ex.options, ex.answer, ex.id),
      [ex.options, ex.answer, ex.id],
    )
    const [picked, setPicked] = useState<number | null>(null)

    useEffect(() => {
      onCanCheck(picked !== null)
    }, [picked, onCanCheck])

    useImperativeHandle(
      ref,
      () => ({
        check: () => onResult(picked === prepared.answer),
      }),
      [picked, prepared.answer, onResult],
    )

    return (
      <div className="space-y-4">
        <Stem>
          <QuestionText text={ex.question} />
        </Stem>
        <div className="space-y-2.5">
          {prepared.options.map((option, index) => {
            const state: OptionState = locked
              ? index === prepared.answer
                ? 'correct'
                : index === picked
                  ? 'wrong'
                  : 'idle'
              : index === picked
                ? 'picked'
                : 'idle'
            return (
              <button
                key={`${option}-${index}`}
                type="button"
                disabled={locked}
                onClick={() => setPicked(index)}
                className={optionClass(state)}
              >
                <Letter index={index} />
                {option}
              </button>
            )
          })}
        </div>
      </div>
    )
  },
)

/* --------------------------------- assemble -------------------------------- */

export const AssembleView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function AssembleView({ exercise, locked, onResult, onCanCheck }, ref) {
    const ex = exercise as AssembleExercise
    const [picked, setPicked] = useState<number[]>([])
    const [verdict, setVerdict] = useState<boolean | null>(null)
    const [bank] = useState(() =>
      shuffle(
        ex.words.map((word, index) => ({ word, index })),
        ex.id,
      ),
    )

    useEffect(() => {
      onCanCheck(picked.length > 0)
    }, [picked, onCanCheck])

    useImperativeHandle(
      ref,
      () => ({
        check: () => {
          const built = picked.map((index) => normalizeToken(ex.words[index])).join(' ')
          const target = ex.answer.map(normalizeToken).join(' ')
          const ok = built === target
          setVerdict(ok)
          onResult(ok)
        },
      }),
      [picked, ex.words, ex.answer, onResult],
    )

    function removeAt(position: number) {
      if (locked) return
      setPicked((current) => current.filter((_, index) => index !== position))
    }

    return (
      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-medium text-ink-3">{ex.task ?? 'Собери предложение'}</p>
          <p className="mt-1 text-[17px] text-ink-2">{ex.translation}</p>
          <p className="mt-2 text-[13px] text-ink-3">
            Не все слова нужны — выбери только слова предложения.
          </p>
        </div>

        <div
          className={`flex min-h-16 flex-wrap content-start gap-2 rounded-[10px] border p-3 ${
            verdict === true
              ? 'border-accent bg-accent-soft'
              : verdict === false
                ? 'border-err bg-err-soft'
                : 'border-line bg-surface'
          }`}
        >
          {picked.length === 0 ? (
            <span className="px-1 py-2 text-[15px] text-ink-3">Нажимай слова ниже</span>
          ) : (
            picked.map((wordIndex, position) => (
              <button
                key={`${wordIndex}-${position}`}
                type="button"
                onClick={() => removeAt(position)}
                className="min-h-11 rounded-[8px] border border-line-strong bg-paper px-3 text-[16px]"
              >
                {ex.words[wordIndex]}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {bank.map(({ word, index }) => {
            const used = picked.includes(index)
            return (
              <button
                key={`${word}-${index}`}
                type="button"
                disabled={locked || used}
                onClick={() => setPicked((current) => [...current, index])}
                className={`min-h-11 rounded-[8px] border px-3 text-[16px] transition-opacity ${
                  used
                    ? 'border-line bg-paper text-ink-3 opacity-40'
                    : 'border-line-strong bg-surface text-ink'
                }`}
              >
                {word}
              </button>
            )
          })}
        </div>

        {locked && verdict === false && (
          <p className="text-[15px] text-ink-2">
            Правильно: <span className="text-ink">{ex.answer.join(' ')}</span>
          </p>
        )}
      </div>
    )
  },
)

/* --------------------------------- translate ------------------------------- */

export const TranslateView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function TranslateView({ exercise, locked, onResult, onCanCheck }, ref) {
    const ex = exercise as TranslateExercise
    const [value, setValue] = useState('')
    const [verdict, setVerdict] = useState<boolean | null>(null)

    useEffect(() => {
      onCanCheck(value.trim().length > 0)
    }, [value, onCanCheck])

    useImperativeHandle(
      ref,
      () => ({
        check: () => {
          const ok = matchesAny(value, ex.accept)
          setVerdict(ok)
          onResult(ok)
        },
      }),
      [value, ex.accept, onResult],
    )

    return (
      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-medium text-ink-3">Переведи на английский</p>
          <Stem>{ex.source}</Stem>
        </div>

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={locked}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Напиши по-английски"
          className={`w-full rounded-[10px] border bg-surface px-4 py-3.5 text-[17px] outline-none transition-colors placeholder:text-ink-3 disabled:opacity-100 ${
            verdict === true
              ? 'border-accent'
              : verdict === false
                ? 'border-err'
                : 'border-line focus:border-line-strong'
          }`}
        />

        {locked && (
          <div className="border-l-2 border-accent pl-3">
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-medium text-ink-3">Образец</p>
              <SpeakButton text={ex.sample} size={14} compact />
            </div>
            <p className="text-[17px] text-ink">{ex.sample}</p>
          </div>
        )}
      </div>
    )
  },
)

/* ---------------------------------- listen --------------------------------- */

export const ListenView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function ListenView({ exercise, locked, onResult, onCanCheck }, ref) {
    const ex = exercise as ListenExercise
    const prepared = useMemo(
      () =>
        ex.mode === 'choice' && Array.isArray(ex.options)
          ? shuffleOptions(ex.options, Number(ex.answer), ex.id)
          : null,
      [ex.mode, ex.options, ex.answer, ex.id],
    )
    const [picked, setPicked] = useState<number | null>(null)
    const [value, setValue] = useState('')

    const can = prepared ? picked !== null : value.trim().length > 0

    useEffect(() => {
      onCanCheck(can)
    }, [can, onCanCheck])

    useImperativeHandle(
      ref,
      () => ({
        check: () => {
          const ok = prepared
            ? picked === prepared.answer
            : normalizeAnswer(value) === normalizeAnswer(String(ex.answer))
          onResult(ok)
        },
      }),
      [prepared, picked, value, ex.answer, onResult],
    )

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => speak(ex.audio)}
            className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px]"
          >
            <Volume2 size={19} strokeWidth={1.5} />
            Прослушать
          </button>
          <button
            type="button"
            onClick={() => speak(ex.audio, 0.7)}
            className="flex min-h-12 items-center rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
          >
            0.7×
          </button>
          {!speechSupported() && <span className="text-[13px] text-ink-3">Озвучка недоступна</span>}
        </div>

        <Stem>{ex.question}</Stem>

        {prepared ? (
          <div className="space-y-2.5">
            {prepared.options.map((option, index) => {
              const state: OptionState = locked
                ? index === prepared.answer
                  ? 'correct'
                  : index === picked
                    ? 'wrong'
                    : 'idle'
                : index === picked
                  ? 'picked'
                  : 'idle'
              return (
                <button
                  key={`${option}-${index}`}
                  type="button"
                  disabled={locked}
                  onClick={() => setPicked(index)}
                  className={optionClass(state)}
                >
                  <Letter index={index} />
                  {option}
                </button>
              )
            })}
          </div>
        ) : (
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={locked}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Напиши, что услышал"
            className="w-full rounded-[10px] border border-line bg-surface px-4 py-3.5 text-[17px] outline-none placeholder:text-ink-3 focus:border-line-strong disabled:opacity-100"
          />
        )}

        {locked && ex.translation && (
          <p className="text-[15px] text-ink-2">Перевод: {ex.translation}</p>
        )}
      </div>
    )
  },
)

/* ----------------------------------- speak --------------------------------- */

export const SpeakView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function SpeakView({ exercise, locked, onResult, onCanCheck, onSkip }, ref) {
    const ex = exercise as SpeakExercise
    const [recording, setRecording] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const recorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const streamRef = useRef<MediaStream | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        check: () => onResult(true),
      }),
      [onResult],
    )

    useEffect(() => {
      onCanCheck(audioUrl !== null || error !== null)
    }, [audioUrl, error, onCanCheck])

    useEffect(() => {
      return () => {
        const recorder = recorderRef.current
        if (recorder && recorder.state === 'recording') recorder.stop()
        streamRef.current?.getTracks().forEach((track) => track.stop())
        if (audioUrl) URL.revokeObjectURL(audioUrl)
      }
    }, [audioUrl])

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
          setRecording(false)
          stream.getTracks().forEach((track) => track.stop())
        }
        recorderRef.current = recorder
        recorder.start()
        setRecording(true)
      } catch {
        setError('Микрофон недоступен. Нужен HTTPS или localhost и разрешение браузера.')
      }
    }

    function stopRecording() {
      recorderRef.current?.stop()
    }

    return (
      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-medium text-ink-3">Повтори за диктором</p>
          <Stem>{ex.phrase}</Stem>
          <p className="mt-1 text-[17px] text-ink-2">{ex.translation}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => speak(ex.phrase)}
            className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px]"
          >
            <Volume2 size={19} strokeWidth={1.5} />
            Эталон
          </button>

          <button
            type="button"
            onClick={() => speak(ex.phrase, 0.7)}
            className="flex min-h-12 items-center rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
          >
            0.7×
          </button>

          {recording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="flex min-h-12 items-center gap-2 rounded-[10px] bg-err px-4 text-[16px] text-paper"
            >
              <Square size={17} strokeWidth={1.5} />
              Стоп
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              disabled={locked}
              className="flex min-h-12 items-center gap-2 rounded-[10px] bg-accent px-4 text-[16px] text-accent-ink disabled:opacity-50"
            >
              <Mic size={19} strokeWidth={1.5} />
              {audioUrl ? 'Записать ещё' : 'Записать'}
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

          <button
            type="button"
            disabled={!audioUrl}
            onClick={() => speak(ex.phrase, 0.92, () => audioRef.current?.play())}
            className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px] disabled:opacity-40"
          >
            <Play size={18} strokeWidth={1.5} />
            Сравнить
          </button>
        </div>

        {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}

        {error && <p className="text-[15px] text-err">{error}</p>}

        {!error && (
          <p className="text-[15px] text-ink-3">
            Скажи фразу вслух, запиши и сравни свою запись с эталоном.
          </p>
        )}

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-[15px] text-ink-3 underline underline-offset-4"
          >
            Пропустить упражнение
          </button>
        )}
      </div>
    )
  },
)

/* ----------------------------------- read ---------------------------------- */

export const ReadView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function ReadView({ exercise, locked, onResult, onCanCheck, onScore }, ref) {
    const ex = exercise as ReadExercise
    const prepared = useMemo(
      () =>
        ex.questions.map((question, index) =>
          question.type === 'tfng'
            ? { options: question.options, answer: question.answer }
            : shuffleOptions(question.options, question.answer, `${ex.id}-q${index}`),
        ),
      [ex],
    )
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const complete = ex.questions.every((_, index) => answers[index] !== undefined)

    useEffect(() => {
      onCanCheck(complete)
    }, [complete, onCanCheck])

    useImperativeHandle(
      ref,
      () => ({
        check: () => {
          const correct = prepared.filter(
            (question, index) => answers[index] === question.answer,
          ).length
          onScore?.(correct, prepared.length)
          onResult(correct === prepared.length)
        },
      }),
      [answers, prepared, onResult, onScore],
    )

    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[20px] text-ink">{ex.title}</h3>
            <SpeakButton text={ex.paragraphs.join(' ')} size={16} compact />
          </div>
          {ex.paragraphs.map((paragraph, index) => (
            <div key={index} className="flex items-start gap-1">
              <SpeakButton text={paragraph} size={14} compact />
              <p className="text-[17px] leading-relaxed text-ink-2">{paragraph}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {ex.questions.map((question, questionIndex) => {
            const current = prepared[questionIndex]
            return (
              <div key={questionIndex} className="space-y-3">
                <p className="text-[16px] font-medium text-ink">
                  {questionIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {current.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex
                    const state: OptionState = locked
                      ? optionIndex === current.answer
                        ? 'correct'
                        : selected
                          ? 'wrong'
                          : 'idle'
                      : selected
                        ? 'picked'
                        : 'idle'
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={locked}
                        onClick={() =>
                          setAnswers((value) => ({ ...value, [questionIndex]: optionIndex }))
                        }
                        className={optionClass(state)}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                {locked && question.evidence && (
                  <p className="border-l-2 border-accent pl-3 text-[14px] leading-snug text-ink-2">
                    Доказательство: «{question.evidence}»
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

/* ----------------------------------- write --------------------------------- */

export const WriteView = forwardRef<ExerciseViewHandle, ExerciseViewProps>(
  function WriteView({ exercise, onResult, onCanCheck }, ref) {
    const ex = exercise as WriteExercise
    const storageKey = `write:${ex.id}`
    const [value, setValue] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [checked, setChecked] = useState(false)
    const [checks, setChecks] = useState<boolean[]>(() => ex.checklist.map(() => false))
    const dirty = useRef(false)

    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    const enough = words >= ex.minWords

    useEffect(() => {
      onCanCheck(enough)
    }, [enough, onCanCheck])

    // Черновик живёт в IndexedDB; старый localStorage переносим один раз.
    useEffect(() => {
      let alive = true
      void (async () => {
        const saved = await getWriting(ex.id)
        if (!alive) return
        if (saved) {
          if (!dirty.current) setValue(saved.text)
        } else {
          try {
            const legacy = localStorage.getItem(storageKey)
            if (legacy && !dirty.current) setValue(legacy)
          } catch {
            // localStorage может быть недоступен.
          }
        }
        setLoaded(true)
      })()
      return () => {
        alive = false
      }
    }, [ex.id, storageKey])

    useEffect(() => {
      if (!loaded) return
      const timer = setTimeout(() => {
        void saveWriting(ex.id, ex.prompt, value)
      }, 500)
      return () => clearTimeout(timer)
    }, [value, loaded, ex.id, ex.prompt])

    useImperativeHandle(
      ref,
      () => ({
        check: () => {
          setChecked(true)
          void markWritingChecked(ex.id, ex.prompt, value)
          onResult(true)
        },
      }),
      [onResult, ex.id, ex.prompt, value],
    )

    return (
      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-medium text-ink-3">Письмо</p>
          <Stem>{ex.prompt}</Stem>
          {ex.sourceText && (
            <p className="mt-3 border-l-2 border-line-strong pl-3 text-[15px] leading-relaxed text-ink-2">
              {ex.sourceText}
            </p>
          )}
        </div>

        <textarea
          value={value}
          onChange={(event) => {
            dirty.current = true
            setValue(event.target.value)
          }}
          rows={10}
          placeholder="Напиши черновик здесь"
          className="w-full resize-y rounded-[10px] border border-line bg-surface px-4 py-3.5 text-[17px] leading-relaxed outline-none placeholder:text-ink-3 focus:border-line-strong"
        />

        <div className="flex items-baseline justify-between gap-3">
          <p className={`text-[13px] ${enough ? 'text-ink-3' : 'text-warn'}`}>
            {words} / {ex.minWords}
            {ex.maxWords ? `–${ex.maxWords}` : ''} слов
          </p>
          {!enough && (
            <p className="text-[13px] text-ink-3">Проверка станет доступна после минимума</p>
          )}
        </div>

        {checked && (
          <div className="space-y-5 border-t border-line pt-5">
            <div>
              <p className="text-[13px] font-medium text-ink-3">Самопроверка</p>
              <ul className="mt-2 space-y-2">
                {ex.checklist.map((item, index) => (
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
            </div>

            {ex.usefulLanguage && ex.usefulLanguage.length > 0 && (
              <div>
                <p className="text-[13px] font-medium text-ink-3">Полезные фразы</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
                  {ex.usefulLanguage.join(' · ')}
                </p>
              </div>
            )}

            <div>
              <p className="text-[13px] font-medium text-ink-3">Образец</p>
              <p className="mt-2 whitespace-pre-line border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-ink">
                {ex.modelAnswer}
              </p>
            </div>

            <div className="border-l-2 border-accent pl-3">
              <p className="text-[13px] font-medium text-accent">Перепиши одну часть</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
                Выбери один пункт чек-листа и измени абзац. Правки сохраняются в портфолио
                автоматически.
              </p>
            </div>
          </div>
        )}
      </div>
    )
  },
)

/* ----------------------------------- render -------------------------------- */

export function renderExercise(
  exercise: Exercise,
  props: ExerciseViewProps,
  ref: Ref<ExerciseViewHandle>,
) {
  switch (exercise.kind) {
    case 'choice':
      return <ChoiceView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'assemble':
      return <AssembleView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'translate':
      return <TranslateView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'listen':
      return <ListenView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'speak':
      return <SpeakView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'read':
      return <ReadView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    case 'write':
      return <WriteView key={exercise.id} ref={ref} {...props} exercise={exercise} />
    default:
      return null
  }
}
