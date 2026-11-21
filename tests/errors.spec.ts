import { expect, test } from '@playwright/test'
import { getUnit } from '../src/content/index'
import { getRecord, letterOption, putRecord } from './helpers'

const DAY = 86_400_000

interface ErrorRecord {
  exerciseId: string
  unitId: string
  box: number
  dueAt: number
  reviews: number
  correct: number
  wrong: number
  lastAt: number
}

/**
 * Немедленный повтор внутри сессии не должен переводить карточку с +1 дня на +3.
 * Ошибка сначала сбрасывается, затем повторяется верно через несколько секунд.
 */
test('error retry keeps the next-day schedule', async ({ page }) => {
  const unit = getUnit('a1-01')
  expect(unit, 'a1-01 must exist').toBeTruthy()
  const exercise = unit!.exercises.find((item) => item.id === 'a1-01-ex-01')
  expect(exercise?.kind).toBe('choice')
  if (exercise?.kind !== 'choice') return

  await page.goto('/')
  await putRecord(page, 'errors', {
    exerciseId: exercise.id,
    unitId: 'a1-01',
    box: 0,
    dueAt: Date.now() - 1_000,
    reviews: 0,
    correct: 0,
    wrong: 1,
    lastAt: Date.now() - 1_000,
  } satisfies ErrorRecord)

  await page.goto('/#/errors')
  await expect(page.getByRole('button', { name: 'Проверить' })).toBeVisible()

  const wrong = exercise.options[(exercise.answer + 1) % exercise.options.length]
  await letterOption(page, wrong).click()
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Неверно', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  await letterOption(page, exercise.options[exercise.answer]).click()
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Верно', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Завершить' }).click()
  await expect(page.getByText('Повторение ошибок завершено')).toBeVisible()

  const record = await getRecord<ErrorRecord>(page, 'errors', exercise.id)
  expect(record?.box).toBe(0)
  expect(record?.dueAt ?? 0).toBeGreaterThan(Date.now() + DAY - 30_000)
  expect(record?.dueAt ?? 0).toBeLessThan(Date.now() + DAY + 30_000)
})
