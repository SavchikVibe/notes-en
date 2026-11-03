import type { Unit } from '@/content'
import type { LessonProgress, Settings } from '@/db/db'

export type BlockKey = 'course' | 'listening' | 'reading' | 'speaking' | 'srs'

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

function wordsLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'слово'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'слова'
  return 'слов'
}

function textsLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return 'текст'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'текста'
  return 'текстов'
}

const SPLITS: Record<
  number,
  { course: number; listening: number; reading: number; speaking: number; srs: number }
> = {
  90: { course: 30, listening: 20, reading: 20, speaking: 10, srs: 10 },
  120: { course: 45, listening: 25, reading: 25, speaking: 15, srs: 10 },
  150: { course: 55, listening: 30, reading: 30, speaking: 20, srs: 15 },
  180: { course: 70, listening: 35, reading: 40, speaking: 20, srs: 15 },
}

function splitFor(total: number) {
  const known = SPLITS[total]
  if (known) return known
  const srs = Math.max(5, Math.round(total * 0.08))
  const rest = total - srs
  const course = round5(rest * 0.44)
  const listening = round5(rest * 0.24)
  const reading = round5(rest * 0.24)
  const speaking = Math.max(5, total - srs - course - listening - reading)
  return { course, listening, reading, speaking, srs }
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
  dueCount = 0,
  readingsLeft = 0,
  listeningLeft = 0,
): Session {
  const total = targetMinutes(settings, now)
  const split = splitFor(total)
  const courseMinutes = split.course
  const listeningMinutes = split.listening
  const readingMinutes = split.reading
  const speakingMinutes = split.speaking
  const srsMinutes = split.srs

  const doneIds = new Set(
    Object.values(progress)
      .filter((item) => item.status === 'done')
      .map((item) => item.lessonId),
  )

  const lessonsCount = Math.min(5, Math.max(1, Math.round(courseMinutes / 12)))
  const nextLessons = units.filter((unit) => !doneIds.has(unit.id)).slice(0, lessonsCount)

  const blocks: SessionBlock[] = [
    {
      key: 'course',
      title: 'Курс',
      minutes: courseMinutes,
      status: nextLessons.length > 0 ? 'ready' : 'soon',
      note: nextLessons.length > 0 ? '10–12 минут на урок' : 'Все уроки этого этапа пройдены',
      units: nextLessons,
    },
    {
      key: 'listening',
      title: 'Слушание',
      minutes: listeningMinutes,
      status: listeningLeft > 0 ? 'ready' : 'soon',
      note:
        listeningLeft > 0
          ? `${listeningLeft} ${textsLabel(listeningLeft)}`
          : 'Все тексты разобраны',
      units: [],
    },
    {
      key: 'reading',
      title: 'Чтение',
      minutes: readingMinutes,
      status: readingsLeft > 0 ? 'ready' : 'soon',
      note: readingsLeft > 0 ? `${readingsLeft} ${textsLabel(readingsLeft)}` : 'Все тексты прочитаны',
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
      status: dueCount > 0 ? 'ready' : 'soon',
      note: dueCount > 0 ? `${dueCount} ${wordsLabel(dueCount)} к повторению` : 'Пока нечего повторять',
      units: [],
    },
  ]

  return {
    totalMinutes: total,
    blocks,
    firstUnit: nextLessons[0],
  }
}
