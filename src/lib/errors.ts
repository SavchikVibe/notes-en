import type { Exercise } from '@/content'

/** Упражнения с однозначной проверкой: только они попадают в банк ошибок. */
const REVIEWABLE: Exercise['kind'][] = ['choice', 'assemble', 'translate', 'listen']

export function isReviewable(exercise: Exercise): boolean {
  return REVIEWABLE.includes(exercise.kind)
}
