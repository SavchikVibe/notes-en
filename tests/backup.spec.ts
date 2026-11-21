import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'

/**
 * Бэкап: скачивание JSON, сброс прогресса и восстановление из файла.
 * Проверяем на настройке, которую видно на экране (минуты понедельника).
 */
test('backup round-trip: export, reset, import', async ({ page }, testInfo) => {
  await page.goto('/#/settings')

  const monday = page.locator('input[type=number]').first()
  await expect(monday).toHaveValue('120')
  await monday.fill('45')
  await expect(monday).toHaveValue('45')

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Скачать бэкап' }).click(),
  ])
  await expect(page.getByText('Бэкап скачан.')).toBeVisible()

  const file = testInfo.outputPath('backup.json')
  await download.saveAs(file)
  const data = JSON.parse(await fs.readFile(file, 'utf8')) as {
    version: number
    exportedAt: string
    settings: { minutes: Record<string, number> }
    progress: unknown[]
    writings: unknown[]
  }
  expect(data.version).toBe(2)
  expect(typeof data.exportedAt).toBe('string')
  expect(data.settings.minutes['1']).toBe(45)
  expect(Array.isArray(data.progress)).toBe(true)
  expect(Array.isArray(data.writings)).toBe(true)
  expect(Array.isArray(data.kv)).toBe(true)

  page.on('dialog', (dialog) => void dialog.accept())

  await page.getByRole('button', { name: 'Сбросить прогресс' }).click()
  await expect(page.getByText('Прогресс удалён.')).toBeVisible()
  await expect(monday).toHaveValue('120')

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Загрузить бэкап' }).click(),
  ])
  await chooser.setFiles(file)
  await expect(page.getByText('Бэкап загружен.')).toBeVisible()
  await expect(monday).toHaveValue('45')
})
