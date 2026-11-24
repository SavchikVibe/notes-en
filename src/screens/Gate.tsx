import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { readings } from '@/content/readings'
import { units, type Level, type WriteExercise } from '@/content'
import { studioTasks } from '@/content/studio'
import { getAllLessonProgress, getKv, setKv, type LessonProgress } from '@/db/db'
import { gateKey, gateTask, getGate, type LevelGateState } from '@/lib/gates'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'
import { WriteView, type ExerciseViewHandle } from './lesson/exercises'
import { SpeakingStep } from './studio/SpeakingStep'

type Step = 'check' | 'writing' | 'speaking' | 'result'

export default function GateScreen() {
  const { level = '' } = useParams()
  const navigate = useNavigate()
  const gate = getGate(level as Level)

  const [progress, setProgress] = useState<Record<string, LessonProgress> | null>(null)
  const [saved, setSaved] = useState<LevelGateState | null>(null)
  const [step, setStep] = useState<Step>('check')
  const [writingDone, setWritingDone] = useState(false)
  const [writingCanCheck, setWritingCanCheck] = useState(false)
  const [speaking, setSpeaking] = useState<'recorded' | 'skipped' | null>(null)
  const [speakingRun, setSpeakingRun] = useState(0)
  const [retrying, setRetrying] = useState(false)
  const writeRef = useRef<ExerciseViewHandle | null>(null)

  useEffect(() => {
    if (!gate) return
    void Promise.all([
      getAllLessonProgress(),
      getKv<LevelGateState>(gateKey(gate.level)),
    ]).then(([progressValue, savedValue]) => {
      setProgress(progressValue)
      setSaved(savedValue ?? null)
    })
  }, [gate])

  if (!gate) {
    return (
      <>
        <AppBar title="Проверка" onBack={() => navigate('/path')} />
        <main className="px-5 pt-6">
          <p className="text-[17px] text-ink-2">Такой проверки нет.</p>
        </main>
      </>
    )
  }

  if (!progress) {
    return (
      <>
        <AppBar title="Проверка" onBack={() => navigate('/path')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  const levelUnits = units.filter((unit) => unit.level === gate.level)
  const unitsDone = levelUnits.filter((unit) => progress[unit.id]?.status === 'done').length
  const allUnitsDone = levelUnits.length > 0 && unitsDone === levelUnits.length
  const studio = studioTasks.find((task) => task.id === gate.studioId)
  const studioDone = progress[gate.studioId]?.status === 'done'
  const texts = gate.textIds.map((id) => ({
    id,
    reading: readings.find((item) => item.id === id),
    done: progress[id]?.status === 'done',
  }))
  const textsDone = texts.every((item) => item.done)
  const canStart = allUnitsDone && studioDone && textsDone
  const canPass = canStart && writingDone && speaking === 'recorded'
  const passed = saved?.passed === true && !retrying

  function retry() {
    setRetrying(true)
    setWritingDone(false)
    setSpeaking(null)
    setStep('check')
  }

  async function finish() {
    if (!gate || !canPass) return
    const state: LevelGateState = {
      passed: true,
      at: Date.now(),
      studio: true,
      texts: gate.textIds,
      writing: true,
      speaking: 'recorded',
    }
    await setKv(gateKey(gate.level), state)
    setSaved(state)
    setRetrying(false)
  }

  const writingExercise: WriteExercise = {
    kind: 'write',
    id: `gate-${gate.level}-writing`,
    prompt: gate.writingPrompt,
    minWords: gate.writingMinWords,
    maxWords: gate.writingMinWords + 80,
    checklist: gate.writingChecklist,
    modelAnswer: '',
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col">
      <AppBar
        title={`Проверка ${gate.level}`}
        subtitle={`${gate.level} → ${gate.nextLevel}`}
        onBack={() => navigate('/path')}
      />

      <main className="flex-1 px-5 pb-10 pt-6">
        {passed && (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Check size={28} strokeWidth={1.5} />
            </div>
            <h1 className="mt-6 text-[30px] leading-tight">Проверка {gate.level} пройдена</h1>
            <p className="mt-2 text-[15px] leading-snug text-ink-2">
              Студия, два текста, письмо и речь — всё сделано. Уровень {gate.nextLevel} открыт.
            </p>
            <div className="mt-8 space-y-2.5">
              <Button className="w-full" onClick={() => navigate(`/level/${gate.nextLevel}`)}>
                К уровню {gate.nextLevel}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/path')}>
                К пути
              </Button>
              <Button variant="ghost" className="w-full" onClick={retry}>
                Пройти проверку заново
              </Button>
            </div>
          </>
        )}

        {!passed && step === 'check' && (
          <>
            <h1 className="text-[30px] leading-tight">Выходной билет</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              Это не новый урок. Проверка показывает, что уровень действительно закрыт: последняя
              студия, два текста библиотеки, короткое письмо и речь.
            </p>

            <section className="mt-7 space-y-4">
              <div className="border-b border-line pb-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[17px]">Уроки уровня</p>
                  <span className="num text-[13px] text-ink-3">
                    {unitsDone} / {levelUnits.length}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-ink-3">
                  {allUnitsDone
                    ? 'Все уроки пройдены.'
                    : 'Сначала пройди все уроки уровня — проверка откроется после этого.'}
                </p>
              </div>

              <div className="border-b border-line pb-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[17px]">Студия</p>
                  <span className={`text-[13px] ${studioDone ? 'text-accent' : 'text-ink-3'}`}>
                    {studioDone ? 'пройдена' : 'не пройдена'}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-ink-3">{studio?.title ?? gate.studioId}</p>
                {!studioDone && (
                  <Button
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={() => navigate(`/studio/${gate.studioId}`)}
                  >
                    Открыть студию
                  </Button>
                )}
              </div>

              <div className="border-b border-line pb-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[17px]">Тексты библиотеки</p>
                  <span className={`text-[13px] ${textsDone ? 'text-accent' : 'text-ink-3'}`}>
                    {texts.filter((item) => item.done).length} / 2
                  </span>
                </div>
                <ul className="mt-1 space-y-1 text-[13px] text-ink-3">
                  {texts.map((item) => (
                    <li key={item.id}>
                      {item.done ? '✓' : '—'} {item.reading?.title ?? item.id}
                    </li>
                  ))}
                </ul>
                {!textsDone && (
                  <Button
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={() => navigate('/reading')}
                  >
                    К чтению
                  </Button>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[17px]">Письмо и речь</p>
                <span className="text-[13px] text-ink-3">
                  {writingDone ? 'письмо готово' : 'письмо не проверено'}
                  {speaking ? ` · речь: ${speaking === 'recorded' ? 'записана' : 'пропущена'}` : ''}
                </span>
              </div>
            </section>

            <div className="mt-8 space-y-2.5">
              <Button
                className="w-full"
                disabled={!canStart}
                onClick={() => setStep('writing')}
              >
                {writingDone ? 'К речи' : 'Начать письмо'}
              </Button>
              {!canStart && (
                <p className="text-[13px] leading-snug text-ink-3">
                  Письмо откроется, когда будут пройдены уроки, студия и два текста.
                </p>
              )}
            </div>
          </>
        )}

        {!passed && step === 'writing' && (
          <>
            <h1 className="text-[26px] leading-tight">Письмо для проверки</h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              Без русского промпта и без образца: напиши сам(а), потом проверь по чек-листу.
            </p>
            <div className="mt-6">
              <WriteView
                ref={writeRef}
                exercise={writingExercise}
                locked={false}
                onResult={() => {
                  setWritingDone(true)
                  setStep('speaking')
                }}
                onCanCheck={setWritingCanCheck}
              />
            </div>
            <Button
              className="mt-6 w-full"
              disabled={!writingCanCheck}
              onClick={() => writeRef.current?.check()}
            >
              Проверить и перейти к речи
            </Button>
          </>
        )}

        {!passed && step === 'speaking' && (
          <SpeakingStep
            key={`speaking-${speakingRun}`}
            task={gateTask(gate)}
            onDone={(status) => {
              setSpeaking(status)
              setStep('result')
            }}
          />
        )}

        {!passed && step === 'result' && (
          <>
            <h1 className="text-[30px] leading-tight">
              {canPass ? 'Всё готово' : 'Проверка не завершена'}
            </h1>
            <ul className="mt-4 space-y-2 text-[15px] leading-snug text-ink-2">
              <li>{allUnitsDone ? '✓' : '—'} Уроки уровня</li>
              <li>{studioDone ? '✓' : '—'} Студия</li>
              <li>{textsDone ? '✓' : '—'} Два текста библиотеки</li>
              <li>{writingDone ? '✓' : '—'} Письмо</li>
              <li>{speaking === 'recorded' ? '✓' : '—'} Речь записана</li>
            </ul>
            {!canPass && (
              <p className="mt-4 text-[15px] leading-snug text-ink-2">
                Речь — обязательная часть проверки. Если микрофон недоступен, вернись, когда будет
                возможность записать.
              </p>
            )}
            <div className="mt-8 space-y-2.5">
              {canPass ? (
                <Button className="w-full" onClick={() => void finish()}>
                  Завершить проверку
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setSpeaking(null)
                    setSpeakingRun((value) => value + 1)
                    setStep('speaking')
                  }}
                >
                  Вернуться к речи
                </Button>
              )}
              <Button variant="ghost" className="w-full" onClick={() => setStep('check')}>
                К списку проверки
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
