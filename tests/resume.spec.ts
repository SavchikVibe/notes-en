import { expect, test } from '@playwright/test'
import { getUnit } from '../src/content/index'
import { putRecord } from './helpers'

test('resume skips answered and skipped exercises', async ({ page }) => {
  const unit = getUnit('a1-01')
  expect(unit, 'a1-01 must exist').toBeTruthy()
  const core = unit!.exercises.filter((exercise) => !exercise.optional)
  const speak = core[5]
  expect(speak.kind).toBe('speak')
  const next = core[6]

  const answers: Record<string, boolean> = {}
  const firstAnswers: Record<string, boolean> = {}
  for (const exercise of core.slice(0, 5)) {
    answers[exercise.id] = true
    firstAnswers[exercise.id] = true
  }

  await page.goto('/')
  await putRecord(page, 'progress', {
    lessonId: 'a1-01',
    status: 'in_progress',
    exerciseIndex: 6,
    bestScore: 0,
    lastScore: 0,
    attempts: 0,
    updatedAt: Date.now(),
    answers,
    firstAnswers,
    skipped: { [speak.id]: true },
  })

  await page.goto('/#/lesson/a1-01')
  await expect(page.getByText('Повтори за диктором')).toHaveCount(0)

  if (next.kind === 'choice') {
    const text = next.question.replace(/_{2,}/g, '').replace(/\s+/g, ' ').trim()
    await expect(page.getByText(text, { exact: false })).toBeVisible()
  } else {
    await expect(page.getByRole('button', { name: 'Проверить' })).toBeVisible()
  }
})
