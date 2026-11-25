import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
import { putRecord } from './helpers'

test('portfolio exports a tutor pack', async ({ page }, testInfo) => {
  await page.goto('/')
  await putRecord(page, 'writings', {
    id: 'a1-01-ex-06',
    prompt: 'Write about your family.',
    text: 'My family is small. I have a mother and a father.',
    firstText: 'My family is small.',
    createdAt: Date.now() - 3_600_000,
    updatedAt: Date.now() - 3_600_000,
    revisions: 1,
  })
  await putRecord(page, 'errors', {
    exerciseId: 'a1-01-ex-01',
    unitId: 'a1-01',
    box: 0,
    dueAt: Date.now(),
    reviews: 1,
    correct: 0,
    wrong: 3,
    lastAt: Date.now(),
  })

  await page.goto('/#/portfolio')
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Пакет для репетитора' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^tutor-pack-.*\.md$/)

  const path = await download.path()
  const text = await fs.readFile(path!, 'utf8')
  expect(text).toContain('# Пакет для репетитора')
  expect(text).toContain('Write about your family.')
  expect(text).toContain('Первый вариант')
  expect(text).toContain('ошибок: 3')
  expect(text).toContain('## Пройденные темы')
  testInfo.annotations.push({ type: 'tutor-pack', description: 'downloaded and checked' })
})
