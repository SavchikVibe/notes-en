import { expect, test } from '@playwright/test'
import { getStudioTask } from '../src/content/studio'
import {
  answerReadQuestions,
  answerStudioQuestion,
  draftWithWords,
} from './helpers'

/**
 * Полный проход студии A1-01: чтение, слушание с заметками, письмо,
 * пропуск речи и экран завершения. Заодно проверяется, что черновик
 * письма попал в портфолио и скачивается как .txt.
 */
test('studio flow: reading, listening, writing, speaking skip', async ({ page }) => {
  const task = getStudioTask('studio-a1-01')
  expect(task, 'studio-a1-01 must exist').toBeTruthy()

  await page.goto('/#/studio')
  await expect(page.getByText('Проект', { exact: true })).toHaveCount(8)

  await page.goto('/#/studio/studio-a1-01')
  await expect(page.getByText('Шаг 1 · Чтение')).toBeVisible()

  await answerReadQuestions(page, task!.reading.questions)
  await page.getByRole('button', { name: 'Проверить ответы' }).click()
  await expect(page.getByText('Проверено. Прочитай доказательства')).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  await expect(page.getByText('Шаг 2 · Слушание')).toBeVisible()
  const noteInputs = page.getByPlaceholder('…')
  await expect(noteInputs).toHaveCount(task!.listening.notes.length)
  for (const [index, note] of task!.listening.notes.entries()) {
    await noteInputs.nth(index).fill(note.answer)
  }
  for (const [index, question] of task!.listening.questions.entries()) {
    await answerStudioQuestion(
      page,
      index,
      question.question,
      question.options,
      question.answer,
    )
  }
  await page.getByRole('button', { name: 'Проверить заметки' }).click()
  await expect(page.getByText('Транскрипт', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  await expect(page.getByText('Шаг 3 · Письмо')).toBeVisible()
  const draft = draftWithWords(task!.writing.minWords)
  await page.getByPlaceholder('Напиши черновик здесь').fill(draft)
  await page.getByRole('button', { name: 'Проверить черновик' }).click()
  await expect(page.getByText('Самопроверка')).toBeVisible()
  await page.getByRole('button', { name: 'Дальше' }).click()

  await expect(page.getByText('Шаг 4 · Речь')).toBeVisible()
  await page.getByRole('button', { name: 'Пропустить речь' }).click()
  await page.getByRole('button', { name: 'Завершить студию' }).click()
  await expect(page.getByText('Студия завершена')).toBeVisible()
  await expect(page.getByText('Чтение: 5 из 5')).toBeVisible()
  await expect(page.getByText('Речь: пропущена')).toBeVisible()
  await expect(page.getByText('Попытка сохранена')).toBeVisible()

  // Черновик попал в портфолио и выгружается текстом.
  await page.goto('/#/portfolio')
  await expect(page.getByText(/Работ: \d+/)).toBeVisible()
  await page
    .getByRole('button')
    .filter({ hasText: task!.writing.prompt })
    .first()
    .click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Скачать текст' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^writing-.*\.txt$/)
  const path = await download.path()
  const text = await (await import('node:fs/promises')).readFile(path!, 'utf8')
  expect(text).toContain(task!.writing.prompt)
  expect(text).toContain('Дата:')
  expect(text).toContain(draft)
})
