import type { Unit } from '@/content'
import type { LessonProgress, Settings } from '@/db/db'

export type BlockKey = 'course' | 'listening' | 'speaking' | 'srs'

export interface SessionBlock {
  key: BlockKey
  title: string
  minutes: number
  status: 'ready' | 'soon'
  note?: string
  units: Unit[]
}

export interface Session {
  totalMinutes: number
  blocks: SessionBlock[]
  firstUnit?: Unit
}

function round5(value: number): number {
  return Math.max(5, Math.round(value / 5) * 5)
}

export function targetMinutes(settings: Settings, now = new Date()): number {
  const day = now.getDay()
  if (settings.tutorDay === day) return 90
  return settings.minutes[day] ?? 120
}

export function buildSession(
  units: Unit[],
  progress: Record<string, LessonProgress>,
  settings: Settings,
  now = new Date(),
): Session {
  const total = targetMinutes(settings, now)
  const courseMinutes = round5(total * 0.5)
  const listeningMinutes = round5(total * 0.25)
  const speakingMinutes = round5(total * 0.17)
  const srsMinutes = Math.max(5, total - courseMinutes - listeningMinutes - speakingMinutes)

  const doneIds = new Set(
    Object.values(progress)
      .filter((item) => item.status === 'done')
      .map((item) => item.lessonId),
  )

  const lessonsCount = Math.min(4, Math.max(1, Math.round(courseMinutes / 15)))
  const nextLessons = units.filter((unit) => !doneIds.has(unit.id)).slice(0, lessonsCount)

  const blocks: SessionBlock[] = [
    {
      key: 'course',
      title: 'Курс',
      minutes: courseMinutes,
      status: nextLessons.length > 0 ? 'ready' : 'soon',
      note: nextLessons.length > 0 ? `${nextLessons.length} урока по 12–15 мин` : 'Все уроки этого этапа пройдены',
      units: nextLessons,
    },
    {
      key: 'listening',
      title: 'Слушание',
      minutes: listeningMinutes,
      status: 'soon',
      note: 'Разбор аудио — следующий этап',
      units: [],
    },
    {
      key: 'speaking',
      title: 'Речь',
      minutes: speakingMinutes,
      status: 'soon',
      note: 'Фразы из урока — этап 3',
      units: [],
    },
    {
      key: 'srs',
      title: 'Повторение',
      minutes: srsMinutes,
      status: 'soon',
      note: 'Слова по интервалам — этап 2',
      units: [],
    },
  ]

  return {
    totalMinutes: total,
    blocks,
    firstUnit: nextLessons[0],
  }
}
