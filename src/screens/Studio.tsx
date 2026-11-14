import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { studioTasks } from '@/content/studio'
import { getAllLessonProgress, type LessonProgress } from '@/db/db'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'

export default function StudioScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)

  useEffect(() => {
    void getAllLessonProgress().then(setProgress)
  }, [])

  return (
    <>
      <AppBar
        title="Студия"
        subtitle="Длинные задачи"
        onBack={() => navigate('/')}
      />

      <main className="px-5 pb-10 pt-6">
        <h1 className="text-[32px] leading-tight">Студия</h1>
        <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
          Здесь нет коротких упражнений. Одна задача — это текст, разговор на слух, письмо с
          черновиком и устный ответ. 15–40 минут в зависимости от уровня.
        </p>

        <div className="mt-8 space-y-4">
          {studioTasks.map((task) => {
            const done = progress?.[task.id]?.status === 'done'
            const readingWords = task.reading.paragraphs
              .join(' ')
              .split(/\s+/)
              .filter(Boolean).length
            return (
              <section key={task.id} className="border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium text-ink-3">
                      {task.level} · {task.estimatedMinutes} мин
                    </p>
                    <h2 className="mt-1 text-[24px] leading-tight">{task.title}</h2>
                  </div>
                  {done && (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check size={18} strokeWidth={1.5} />
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{task.goal}</p>

                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-[14px] text-ink-2">
                  <span>Чтение · ~{readingWords} слов</span>
                  <span>Слушание · диалог</span>
                  <span>
                    Письмо · {task.writing.minWords}–{task.writing.maxWords} слов
                  </span>
                  <span>Речь · {task.speaking.speakingSeconds} секунд</span>
                </div>

                <Button
                  className="mt-5 w-full"
                  variant={done ? 'secondary' : 'primary'}
                  onClick={() => navigate(`/studio/${task.id}`)}
                >
                  {done ? 'Пройти ещё раз' : 'Начать'}
                  <ArrowRight size={18} strokeWidth={1.5} />
                </Button>
              </section>
            )
          })}
        </div>

        <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
          Письмо сохраняется как черновик на этом устройстве. Проверка письма и речи — по
          чек-листу, без автоматической оценки.
        </p>
      </main>
    </>
  )
}
