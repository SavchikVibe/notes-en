import { expect, test, type Page } from '@playwright/test'
import { getUnit } from '../src/content/index'
import { letterOption } from './helpers'

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow, 'no horizontal scrolling on a phone').toBeLessThanOrEqual(1)
}

/**
 * Телефонный проход: главный экран, первый шаг урока и настройки
 * на вьюпорте Pixel 7. Полный урок и студия проверяются в mobile-проекте
 * теми же сценариями, что и на десктопе.
 */
test('phone: today, lesson start and settings fit the viewport', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('План на сегодня')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Сегодня' })).toBeVisible()
  await expectNoHorizontalScroll(page)

  const unit = getUnit('a1-01')
  const firstChoice = unit!.exercises.find(
    (exercise) => exercise.kind === 'choice' && !exercise.optional,
  )
  expect(firstChoice, 'a1-01 must start with a choice exercise').toBeTruthy()

  await page.goto('/#/lesson/a1-01')
  await letterOption(page, firstChoice!.options[firstChoice!.answer]).click()
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Верно', { exact: true })).toBeVisible()
  await expectNoHorizontalScroll(page)

  const next = page.getByRole('button', { name: 'Дальше' })
  const box = await next.boundingBox()
  const viewport = page.viewportSize()!
  expect(box, 'the next button must be visible').toBeTruthy()
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1)

  await page.goto('/#/settings')
  await expect(page.getByText('Бэкап', { exact: true })).toBeVisible()
  const backup = page.getByRole('button', { name: 'Скачать бэкап' })
  await expect(backup).toBeVisible()
  const backupBox = await backup.boundingBox()
  expect(backupBox!.height, 'tap target at least 44 px').toBeGreaterThanOrEqual(44)
  await expectNoHorizontalScroll(page)
})
