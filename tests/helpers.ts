import { expect, type Page } from '@playwright/test'

/** Экранирование текста для регулярных выражений. */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Вариант в choice/listen: кнопка содержит букву A/B/C и текст. */
export function letterOption(page: Page, text: string) {
  return page
    .getByRole('button', { name: new RegExp(`^[A-D]\\s+${escapeRegExp(text)}$`) })
    .first()
}

interface ReadQuestion {
  question: string
  options: string[]
  answer: number
}

/**
 * Ответить на вопросы чтения: блок ищется по номеру и тексту вопроса,
 * поэтому одинаковые варианты в разных вопросах не мешают.
 */
export async function answerReadQuestions(page: Page, questions: ReadQuestion[]) {
  for (const [index, question] of questions.entries()) {
    const block = page
      .locator('div.space-y-3')
      .filter({ hasText: `${index + 1}. ${question.question}` })
      .last()
    await expect(block).toBeVisible()
    await block
      .getByRole('button', { name: question.options[question.answer], exact: true })
      .click()
  }
}

/** Ответить на вопрос слушания в студии (тот же номер и текст). */
export async function answerStudioQuestion(
  page: Page,
  index: number,
  question: string,
  options: string[],
  answer: number,
) {
  const block = page
    .locator('div.space-y-2')
    .filter({ hasText: `${index + 1}. ${question}` })
    .last()
  await expect(block).toBeVisible()
  await block.getByRole('button', { name: options[answer], exact: true }).click()
}

/** Строка из нужного числа слов для поля письма. */
export function draftWithWords(minWords: number): string {
  const sentence = 'This is my practice draft for the writing task and I am checking each part. '
  let text = ''
  let words = 0
  while (words < minWords) {
    text += sentence
    words = text.trim().split(/\s+/).length
  }
  return text.trim()
}
