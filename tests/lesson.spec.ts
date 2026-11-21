import { expect, test, type Page } from '@playwright/test'
import { getUnit } from '../src/content/index'

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Вариант в choice/listen: кнопка содержит букву A/B/C и текст. */
function letterOption(page: Page, text: string) {
  return page
    .getByRole('button', { name: new RegExp(`^[A-D]\\s+${escapeRegExp(text)}$`) })
    .first()
}

/**
 * Полный проход урока A1-01: все обязательные упражнения, проверка,
 * переходы и экран результата. Ошибки не допускаются, иначе урок
 * вернёт упражнение в конец и тест пойдёт не по сценарию.
 */
test('full lesson flow: answer every core exercise and finish', async ({ page }) => {
  const unit = getUnit('a1-01')
  expect(unit, 'a1-01 must exist').toBeTruthy()
  const core = unit!.exercises.filter((exercise) => !exercise.optional)

  await page.goto('/#/lesson/a1-01')
  await expect(page.getByRole('button', { name: 'Проверить' })).toBeVisible()

  for (const exercise of core) {
    if (exercise.kind === 'choice') {
      const option = exercise.options[exercise.answer]
      await letterOption(page, option).click()
    } else if (exercise.kind === 'assemble') {
      const bank = page.locator('div.flex.flex-wrap.gap-2').last()
      for (const token of exercise.answer) {
        const candidates = bank.getByRole('button', { name: token, exact: true })
        const count = await candidates.count()
        let clicked = false
        for (let index = 0; index < count; index += 1) {
          if (await candidates.nth(index).isEnabled()) {
            await candidates.nth(index).click()
            clicked = true
            break
          }
        }
        expect(clicked, `token "${token}" must be clickable`).toBe(true)
      }
    } else if (exercise.kind === 'translate') {
      await page.getByPlaceholder('Напиши по-английски').fill(exercise.sample)
    } else if (exercise.kind === 'listen') {
      if (Array.isArray(exercise.options)) {
        const option = exercise.options[Number(exercise.answer)]
        await letterOption(page, option).click()
      } else {
        await page.getByPlaceholder('Напиши, что услышал').fill(String(exercise.answer))
      }
    } else if (exercise.kind === 'read') {
      for (const question of exercise.questions) {
        const block = page.locator('div.space-y-3').filter({ hasText: question.question }).last()
        const option = question.options[question.answer]
        await block.getByRole('button', { name: option, exact: true }).click()
      }
    } else if (exercise.kind === 'speak') {
      await page.getByRole('button', { name: /Пропустить/ }).first().click()
    }

    if (exercise.kind === 'speak') {
      await page.getByRole('button', { name: 'Дальше' }).click()
      continue
    }

    await page.getByRole('button', { name: 'Проверить' }).click()
    await expect(page.getByText('Верно', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: /^(Дальше|Завершить)$/ }).click()
  }

  await expect(page.getByText('Урок пройден')).toBeVisible()
  await expect(page.getByText('Итоговая точность')).toBeVisible()
})
