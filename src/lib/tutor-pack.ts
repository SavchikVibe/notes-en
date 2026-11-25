import { getUnit } from '@/content'
import { readings } from '@/content/readings'
import { studioTasks } from '@/content/studio'
import type { ErrorItem, LessonProgress, Writing } from '@/db/db'

const WEEK = 7 * 86_400_000

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function exerciseSummary(unitId: string, exerciseId: string): string | null {
  const unit = getUnit(unitId)
  const exercise = unit?.exercises.find((item) => item.id === exerciseId)
  if (!exercise) return null
  switch (exercise.kind) {
    case 'choice':
      return `${exercise.question} → ${exercise.options[exercise.answer]}`
    case 'assemble':
      return exercise.answer.join(' ')
    case 'translate':
      return `${exercise.source} → ${exercise.sample}`
    case 'listen':
      return Array.isArray(exercise.options)
        ? `${exercise.audio} → ${exercise.options[Number(exercise.answer)]}`
        : exercise.audio
    case 'speak':
      return exercise.phrase
    default:
      return null
  }
}

function topicLabel(lessonId: string): string | null {
  if (lessonId.startsWith('studio-')) {
    const task = studioTasks.find((item) => item.id === lessonId)
    return task ? `Студия · ${task.title}` : null
  }
  if (lessonId.startsWith('reading-')) {
    const text = readings.find((item) => item.id === lessonId)
    return text ? `Чтение · ${text.title} (${text.level})` : null
  }
  if (lessonId.startsWith('listening-')) {
    const id = lessonId.replace('listening-', '')
    const text = readings.find((item) => item.id === id)
    return text ? `Слушание · ${text.title} (${text.level})` : null
  }
  const unit = getUnit(lessonId)
  return unit ? `${unit.level} · ${unit.title}` : null
}

export interface TutorPackInput {
  writings: Writing[]
  errors: ErrorItem[]
  progress: LessonProgress[]
  now?: number
}

/**
 * Один локальный файл для живого репетитора: письма, топ ошибок и темы недели.
 * Ничего не отправляет и не требует сети.
 */
export function buildTutorPack(input: TutorPackInput): string {
  const now = input.now ?? Date.now()
  const since = now - WEEK
  const weekWritings = input.writings
    .filter((writing) => writing.updatedAt >= since)
    .sort((a, b) => b.updatedAt - a.updatedAt)
  const fallbackWritings = weekWritings.length > 0
    ? weekWritings
    : [...input.writings].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3)

  const errors = [...input.errors].sort((a, b) => b.wrong - a.wrong).slice(0, 10)

  const topics = new Set<string>()
  for (const entry of input.progress) {
    if (entry.status !== 'done') continue
    const at = entry.completedAt ?? entry.updatedAt
    if (at < since) continue
    const label = topicLabel(entry.lessonId)
    if (label) topics.add(label)
  }

  const lines: string[] = [
    '# Пакет для репетитора',
    '',
    `Дата: ${formatDate(now)}`,
    'Период: последние 7 дней',
    '',
    '## Письменные работы',
    '',
  ]

  if (fallbackWritings.length === 0) {
    lines.push('Письменных работ пока нет.')
  } else {
    if (weekWritings.length === 0) {
      lines.push('За последние 7 дней новых работ нет; ниже — последние сохранённые.', '')
    }
    fallbackWritings.forEach((writing, index) => {
      lines.push(`### ${index + 1}. ${writing.prompt}`, '')
      lines.push(`Дата: ${formatDate(writing.updatedAt)} · проверок: ${writing.revisions}`, '')
      if (writing.firstText && writing.firstText !== writing.text) {
        lines.push('Первый вариант:', '', writing.firstText, '')
        lines.push('Текущий вариант:', '', writing.text, '')
      } else {
        lines.push('Текущий вариант:', '', writing.text, '')
      }
    })
  }

  lines.push('## Ошибки: топ-10', '')
  if (errors.length === 0) {
    lines.push('Ошибок в банке пока нет.')
  } else {
    errors.forEach((error, index) => {
      const unit = getUnit(error.unitId)
      const summary = exerciseSummary(error.unitId, error.exerciseId)
      lines.push(
        `${index + 1}. ${unit ? `${unit.level} · ${unit.title}` : error.unitId} — ошибок: ${error.wrong}, коробка: ${error.box}`,
      )
      if (summary) lines.push(`   Задание: ${summary}`)
      lines.push('')
    })
  }

  lines.push('## Пройденные темы', '')
  if (topics.size === 0) {
    lines.push('За последние 7 дней завершённых тем нет.')
  } else {
    for (const topic of topics) lines.push(`- ${topic}`)
  }

  lines.push('', '---', 'Собрано локально, без сети.', '')
  return lines.join('\n')
}
