import { expect, test } from '@playwright/test'
import { readings } from '../src/content/readings'
import { answerReadQuestions } from './helpers'

/**
 * Библиотека чтения: первый текст A1, все ответы верные, текст засчитан,
 * переход к следующему. Уровень по умолчанию — A1, пока курс не сдвинулся.
 */
test('reading library: answer the first A1 text and pass it', async ({ page }) => {
  const first = readings.find((reading) => reading.level === 'A1')
  expect(first, 'an A1 reading must exist').toBeTruthy()

  await page.goto('/#/reading')
  await expect(page.getByText(first!.title, { exact: true }).first()).toBeVisible()

  await answerReadQuestions(page, first!.questions)
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Засчитано', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Следующий текст' }).click()
  await expect(page.getByText(/A1 · 2 из \d+/)).toBeVisible()

  // Повторное открытие показывает текст как прочитанный: счётчик уменьшился.
  await page.goto('/')
  await page.goto('/#/reading')
  await expect(page.getByText(first!.title, { exact: true })).toHaveCount(0)
})
