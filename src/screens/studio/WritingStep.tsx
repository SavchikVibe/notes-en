import { useRef, useState } from 'react'
import type { WriteExercise } from '@/content'
import type { StudioTask } from '@/content/studio'
import { Button } from '@/components/Button'
import { WriteView, type ExerciseViewHandle } from '@/screens/lesson/exercises'

export function WritingStep({
  task,
  onDone,
}: {
  task: StudioTask
  onDone: () => void
}) {
  const ref = useRef<ExerciseViewHandle | null>(null)
  const [checked, setChecked] = useState(false)
  const [canCheck, setCanCheck] = useState(false)

  const exercise: WriteExercise = {
    kind: 'write',
    id: `${task.id}-writing`,
    prompt: task.writing.prompt,
    minWords: task.writing.minWords,
    maxWords: task.writing.maxWords,
    checklist: task.writing.checklist,
    modelAnswer: task.writing.modelAnswer,
    usefulLanguage: task.writing.usefulLanguage,
  }

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-3">Шаг 3 · Письмо</p>
      <h1 className="mt-1 text-[26px] leading-tight">Напиши письмо</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        Сначала черновик. После проверки откроются чек-лист и образец; сравни и перепиши
        хотя бы одну часть.
      </p>

      <div className="mt-6">
        <WriteView
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
          Проверить черновик
        </Button>
      )}

      {checked && (
        <p className="mt-6 border-l-2 border-accent pl-3 text-[15px] leading-relaxed text-ink-2">
          Черновик сохранён. Отметь пункты чек-листа и перепиши одну часть текста, если видишь
          разницу с образцом.
        </p>
      )}
    </div>
  )
}
