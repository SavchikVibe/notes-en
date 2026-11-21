import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Square } from 'lucide-react'
import type { StudioTask } from '@/content/studio'
import { answersMatch } from '@/lib/text'
import { shuffleOptions } from '@/lib/options'
import { speakSequence, speechSupported, stopSpeaking } from '@/lib/speech'
import { Button } from '@/components/Button'
import type { StepScore } from './ReadingStep'

function optionClass(selected: boolean, correct: boolean, checked: boolean) {
  const base =
    'flex w-full min-h-12 items-center rounded-[10px] border bg-surface px-4 py-2.5 text-left text-[15px] leading-snug disabled:opacity-100'
  if (!checked) return `${base} ${selected ? 'border-line-strong ring-2 ring-line-strong' : 'border-line'}`
  if (correct) return `${base} border-accent bg-accent-soft`
  if (selected) return `${base} border-err bg-err-soft`
  return `${base} border-line`
}

export function ListeningStep({
  task,
  onDone,
}: {
  task: StudioTask
  onDone: (score?: StepScore) => void
}) {
  const [notes, setNotes] = useState<string[]>(() => task.listening.notes.map(() => ''))
  const [gist, setGist] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioFailed, setAudioFailed] = useState(false)

  const audioSrc = task.listening.audio
    ? `${import.meta.env.BASE_URL}${task.listening.audio}`
    : null
  const useAudio = Boolean(audioSrc) && !audioFailed

  const prepared = useMemo(
    () =>
      task.listening.questions.map((question, index) =>
        shuffleOptions(question.options, question.answer, `${task.id}-listening-q${index}`),
      ),
    [task],
  )

  const canCheck =
    notes.every((note) => note.trim().length > 0) &&
    task.listening.questions.every((_, index) => gist[index] !== undefined)

  function play(multiplier = 1) {
    if (useAudio && audioRef.current) {
      const audio = audioRef.current
      audio.playbackRate = multiplier
      audio.currentTime = 0
      void audio.play().catch(() => setAudioFailed(true))
      return
    }
    speakSequence(
      task.listening.lines.map((line) => ({
        ...line,
        rate: (line.rate ?? 0.92) * multiplier,
      })),
    )
  }

  function stop() {
    if (useAudio && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      return
    }
    stopSpeaking()
  }

  function check() {
    const notesCorrect = task.listening.notes.filter((note, index) => {
      const accepted = note.accept ?? [note.answer]
      return accepted.some((item) => answersMatch(notes[index] ?? '', item))
    }).length
    const gistCorrect = task.listening.questions.filter(
      (_, index) => gist[index] === prepared[index]?.answer,
    ).length
    setChecked(true)
    onDone({
      correct: notesCorrect + gistCorrect,
      total: task.listening.notes.length + task.listening.questions.length,
    })
  }

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-3">Шаг 2 · Слушание</p>
      <h1 className="mt-1 text-[26px] leading-tight">Послушай разговор и заполни заметки</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        {task.listening.intro ??
          'Сначала слушай целиком, потом заполни пропуски. Транскрипт появится после проверки.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => play(1)}
          className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-4 text-[16px]"
        >
          <Play size={18} strokeWidth={1.5} />
          Прослушать
        </button>
        <button
          type="button"
          onClick={() => play(0.72)}
          className="flex min-h-12 items-center rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
        >
          0.7×
        </button>
        <button
          type="button"
          onClick={() => stop()}
          className="flex min-h-12 items-center gap-2 rounded-[10px] border border-line px-3 text-[14px] text-ink-2"
        >
          <Square size={15} strokeWidth={1.5} />
          Стоп
        </button>
        {!useAudio && !speechSupported() && (
          <span className="self-center text-[13px] text-ink-3">Озвучка недоступна</span>
        )}
      </div>

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          onError={() => setAudioFailed(true)}
          className="hidden"
        />
      )}

      <p className="mt-2 text-[13px] text-ink-3">
        {useAudio
          ? 'Аудио записано нейроголосами. Если файл не загрузится, включится системный голос.'
          : 'Голос звучит плохо?'}{' '}
        <Link to="/settings" className="underline underline-offset-4">
          Сменить голос
        </Link>
      </p>

      <section className="mt-7">
        <h2 className="text-[20px]">Заметки</h2>
        <p className="mt-1 text-[13px] text-ink-3">Одно-два слова в каждый пропуск.</p>
        <div className="mt-2">
          {task.listening.notes.map((note, index) => {
            const accepted = note.accept ?? [note.answer]
            const correct = accepted.some(
              (item) => answersMatch(item, notes[index] ?? ''),
            )
            return (
              <div key={index} className="border-b border-line py-3">
                <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-[16px] leading-relaxed">
                  <span className="text-ink-3">{index + 1}.</span>
                  <span>{note.before}</span>
                  <input
                    value={notes[index] ?? ''}
                    onChange={(event) =>
                      setNotes((current) =>
                        current.map((value, itemIndex) =>
                          itemIndex === index ? event.target.value : value,
                        ),
                      )
                    }
                    disabled={checked}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="…"
                    className={`min-w-[110px] flex-1 border-b bg-transparent px-1 py-0.5 text-[16px] outline-none disabled:opacity-100 ${
                      checked
                        ? correct
                          ? 'border-accent text-ink'
                          : 'border-err text-err'
                        : 'border-line-strong focus:border-accent'
                    }`}
                  />
                  <span>{note.after}</span>
                </div>
                {checked && !correct && (
                  <p className="mt-1 text-[14px] text-ink-2">
                    Правильно: <span className="text-ink">{note.answer}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="text-[20px]">Понимание</h2>
        <div className="mt-3 space-y-5">
          {task.listening.questions.map((question, questionIndex) => {
            const current = prepared[questionIndex]
            return (
              <div key={questionIndex} className="space-y-2">
                <p className="text-[16px] font-medium text-ink">
                  {questionIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {current.options.map((option, optionIndex) => {
                    const selected = gist[questionIndex] === optionIndex
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={checked}
                        onClick={() =>
                          setGist((value) => ({ ...value, [questionIndex]: optionIndex }))
                        }
                        className={optionClass(
                          selected,
                          optionIndex === current.answer,
                          checked,
                        )}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {!checked && (
        <Button className="mt-6 w-full" disabled={!canCheck} onClick={check}>
          Проверить заметки
        </Button>
      )}

      {checked && (
        <div className="mt-7 border-t border-line pt-5">
          <p className="text-[13px] font-medium text-ink-3">Транскрипт</p>
          <div className="mt-2 space-y-1.5">
            {task.listening.transcript.map((line) => (
              <p key={line} className="text-[15px] leading-relaxed text-ink-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
