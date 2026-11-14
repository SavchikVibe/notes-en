import { useRef, useState } from 'react'
import type { ReadExercise } from '@/content'
import type { StudioTask } from '@/content/studio'
import { Button } from '@/components/Button'
import { ReadView, type ExerciseViewHandle } from '@/screens/lesson/exercises'

export function ReadingStep({
  task,
  onDone,
}: {
  task: StudioTask
  onDone: () => void
}) {
  const ref = useRef<ExerciseViewHandle | null>(null)
  const [checked, setChecked] = useState(false)
  const [canCheck, setCanCheck] = useState(false)

  const exercise: ReadExercise = {
    kind: 'read',
    id: `${task.id}-reading`,
    title: task.reading.title,
    paragraphs: task.reading.paragraphs,
    questions: task.reading.questions,
  }

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-3">Шаг 1 · Чтение</p>
      <h1 className="mt-1 text-[26px] leading-tight">Прочитай текст и ответь на вопросы</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        {task.reading.hint ??
          'В вопросах True / False / Not Given выбирай Not Given, если текст не даёт ответа. После проверки под вопросами появится цитата-доказательство.'}
      </p>

      <div className="mt-6">
        <ReadView
          ref={ref}
          exercise={exercise}
          locked={checked}
          onResult={() => {
            setChecked(true)
            onDone()
          }}
          onCanCheck={setCanCheck}
        />
      </div>

      {!checked && (
        <Button className="mt-6 w-full" disabled={!canCheck} onClick={() => ref.current?.check()}>
          Проверить ответы
        </Button>
      )}

      {checked && (
        <p className="mt-6 border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-ink-2">
          Проверено. Прочитай доказательства и реши, какие ответы были ошибками.
        </p>
      )}
    </div>
  )
}
