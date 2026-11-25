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

/* ------------------------------ IndexedDB ------------------------------- */

async function openAppDb(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('english')
      request.onsuccess = () => {
        request.result.close()
        resolve(request.result)
      }
      request.onerror = () => reject(request.error)
    })
  })
}

/** Положить запись в стор приложения (например, ошибку или прогресс). */
export async function putRecord(page: Page, store: string, value: unknown): Promise<void> {
  await putRecords(page, store, [value])
}

/** Положить несколько записей одной транзакцией (например, 40 уроков). */
export async function putRecords(page: Page, store: string, values: unknown[]): Promise<void> {
  await openAppDb(page)
  await page.evaluate(
    async ({ storeName, records }) => {
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('english')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      await new Promise<void>((resolve, reject) => {
        const tx = database.transaction(storeName, 'readwrite')
        const objectStore = tx.objectStore(storeName)
        for (const record of records) objectStore.put(record)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    },
    { storeName: store, records: values },
  )
}

/** Прочитать запись из стора приложения по ключу. */
export async function getRecord<T>(page: Page, store: string, key: string): Promise<T | undefined> {
  await openAppDb(page)
  return page.evaluate(
    async ({ storeName, recordKey }) => {
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('english')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      return new Promise<T | undefined>((resolve, reject) => {
        const tx = database.transaction(storeName, 'readonly')
        const request = tx.objectStore(storeName).get(recordKey)
        request.onsuccess = () => resolve(request.result as T | undefined)
        request.onerror = () => reject(request.error)
      })
    },
    { storeName: store, recordKey: key },
  )
}

/** Положить значение в kv-стор приложения (у него нет keyPath). */
export async function putKv(page: Page, key: string, value: unknown): Promise<void> {
  await openAppDb(page)
  await page.evaluate(
    async ({ recordKey, recordValue }) => {
      const database = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('english')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      await new Promise<void>((resolve, reject) => {
        const tx = database.transaction('kv', 'readwrite')
        tx.objectStore('kv').put(recordValue, recordKey)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    },
    { recordKey: key, recordValue: value },
  )
}
