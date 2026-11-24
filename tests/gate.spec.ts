import { expect, test } from '@playwright/test'
import { units } from '../src/content/index'
import { draftWithWords, putRecords } from './helpers'

test.use({
  launchOptions: {
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
  },
})

function doneRecord(lessonId: string) {
  return {
    lessonId,
    status: 'done',
    exerciseIndex: 0,
    bestScore: 1,
    lastScore: 1,
    attempts: 1,
    updatedAt: Date.now(),
    completedAt: Date.now(),
  }
}

test('gate A1: studio, texts, writing and speaking unlock A2', async ({ page }) => {
  const a1 = units.filter((unit) => unit.level === 'A1')
  await page.goto('/')
  await putRecords(page, 'progress', [
    ...a1.map((unit) => doneRecord(unit.id)),
    doneRecord('studio-a1-04'),
    doneRecord('reading-09'),
    doneRecord('reading-10'),
  ])

  await page.goto('/#/gate/A1')
  await expect(page.getByText('Выходной билет')).toBeVisible()
  await expect(page.getByText('Все уроки пройдены.')).toBeVisible()
  await page.getByRole('button', { name: 'Начать письмо' }).click()

  await page.getByPlaceholder('Напиши черновик здесь').fill(draftWithWords(45))
  await page.getByRole('button', { name: 'Проверить и перейти к речи' }).click()

  await expect(page.getByText('Устная часть проверки')).toBeVisible()
  await page.getByRole('button', { name: 'Записать', exact: true }).click()
  await expect(page.getByRole('button', { name: /Стоп/ })).toBeVisible()
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: /Стоп/ }).click()

  await expect(page.getByText('Всё готово')).toBeVisible()
  await page.getByRole('button', { name: 'Завершить проверку' }).click()
  await expect(page.getByText('Проверка A1 пройдена')).toBeVisible()

  await page.goto('/#/level/A2')
  await expect(page.getByRole('button', { name: 'Начать уровень' })).toBeVisible()
  await expect(page.getByText('Сначала проверка A1')).toHaveCount(0)
})

test('gate does not open before all level units are done', async ({ page }) => {
  await page.goto('/#/gate/A1')
  await expect(page.getByText('Сначала пройди все уроки уровня')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Начать письмо' })).toBeDisabled()

  await page.goto('/#/lesson/a2-01')
  await expect(page).toHaveURL(/#\/gate\/A1/)
  await expect(page.getByText('Выходной билет')).toBeVisible()

  await page.goto('/#/path')
  await expect(page.getByText('закрыт').first()).toBeVisible()
})
