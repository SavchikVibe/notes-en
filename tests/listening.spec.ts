import { expect, test } from '@playwright/test'
import { readings } from '../src/content/readings'

/** Слушание: 0 правильных не должно помечать текст как разобранный. */
test('listening: a failed text stays in the library', async ({ page }) => {
  const reading = readings.find((item) => item.level === 'A1')
  expect(reading, 'an A1 reading must exist').toBeTruthy()

  await page.goto('/#/listening')
  await expect(page.getByText('Шаг 1 · Слушай')).toBeVisible()

  for (const [index, question] of reading!.questions.entries()) {
    const wrong = question.options[(question.answer + 1) % question.options.length]
    const block = page
      .locator('div.space-y-3')
      .filter({ hasText: `${index + 1}. ${question.question}` })
      .last()
    await block.getByRole('button', { name: wrong, exact: true }).click()
  }
  await page.getByRole('button', { name: 'Проверить' }).click()
  await expect(page.getByText(/Верно: 0 из \d+/)).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  await expect(page.getByText(/Шаг 2 · Диктант/)).toBeVisible()
  for (;;) {
    await page.getByPlaceholder('Напиши фразу по-английски').fill('wrong answer')
    await page.getByRole('button', { name: 'Проверить' }).click()
    await expect(page.getByText('Неверно', { exact: true })).toBeVisible()
    const label = await page
      .getByRole('button', { name: /^(Следующая фраза|Дальше)$/ })
      .textContent()
    await page.getByRole('button', { name: /^(Следующая фраза|Дальше)$/ }).click()
    if (label?.includes('Дальше')) break
  }

  await expect(page.getByText('Шаг 3 · Повтори')).toBeVisible()
  await page.getByRole('button', { name: /^(Следующий текст|Завершить)$/ }).click()

  await expect(page.getByText('Пока не засчитано')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Пройти заново' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Следующий текст' })).toBeVisible()
})
