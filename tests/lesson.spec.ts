import { expect, test, type Page } from '@playwright/test'
import { getUnit, type Exercise } from '../src/content/index'

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Вариант в choice/listen: кнопка содержит букву A/B/C и текст. */
function letterOption(page: Page, text: string) {
  return page
    .getByRole('button', { name: new RegExp(`^[A-D]\\s+${escapeRegExp(text)}$`) })
    .first()
}

/** Ответить на упражнение верно и перейти дальше. */
async function answerCorrectly(page: Page, exercise: Exercise) {
  if (exercise.kind === 'choice') {
    await letterOption(page, exercise.options[exercise.answer]).click()
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
      await letterOption(page, exercise.options[Number(exercise.answer)]).click()
    } else {
      await page.getByPlaceholder('Напиши, что услышал').fill(String(exercise.answer))
    }
  } else if (exercise.kind === 'read') {
    for (const question of exercise.questions) {
      const block = page.locator('div.space-y-3').filter({ hasText: question.question }).last()
      await block.getByRole('button', { name: question.options[question.answer], exact: true }).click()
    }
  } else if (exercise.kind === 'speak') {
    await page.getByRole('button', { name: /Пропустить/ }).first().click()
  }

  if (exercise.kind === 'speak') {
    await page.getByRole('button', { name: 'Дальше' }).click()
    return
  }

  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Верно', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /^(Дальше|Завершить)$/ }).click()
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
  // Формула свёрнута по умолчанию, чтобы не подсказывать ответ.
  await expect(page.getByText('I + am', { exact: true })).toHaveCount(0)

  for (const exercise of core) {
    await answerCorrectly(page, exercise)
  }

  await expect(page.getByText('Урок пройден')).toBeVisible()
  await expect(page.getByText('Итоговая точность')).toBeVisible()
})

/**
 * Ошибка с первой попытки не должна исчезать после правильного повтора:
 * итог считается по firstAnswers, а не по последнему ответу.
 */
test('first attempt counts: wrong then correct repeat is not 100%', async ({ page }) => {
  const unit = getUnit('a1-01')
  expect(unit, 'a1-01 must exist').toBeTruthy()
  const core = unit!.exercises.filter((exercise) => !exercise.optional)
  const first = core[0]
  expect(first.kind).toBe('choice')
  if (first.kind !== 'choice') return

  await page.goto('/#/lesson/a1-01')
  const wrong = first.options[(first.answer + 1) % first.options.length]
  await letterOption(page, wrong).click()
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText('Неверно', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  for (const exercise of core.slice(1)) {
    await answerCorrectly(page, exercise)
  }

  // Ошибочное упражнение вернулось в конец очереди; отвечаем верно.
  await answerCorrectly(page, first)

  await expect(page.getByText('Урок пройден')).toBeVisible()
  await expect(page.getByText('Ошибок с первой попытки: 1')).toBeVisible()
  await expect(page.getByText('100%')).toHaveCount(0)
})
