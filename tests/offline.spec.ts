import { expect, test } from '@playwright/test'

/**
 * Офлайн-режим собранного приложения: после первой загрузки service worker
 * отдаёт оболочку и урок без сети. Запускается через `npm run test:e2e:offline`
 * (перед этим `npm run build` и `vite preview`).
 */
test('offline: app shell and a lesson work without network', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByText('План на сегодня')).toBeVisible()

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // При активации приложение перезагружается само (controllerchange),
  // поэтому первый reload может быть прерван — это ожидаемо.
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined)
  await expect(page.getByText('План на сегодня')).toBeVisible({ timeout: 20_000 })
  expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

  await context.setOffline(true)
  try {
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined)
    await expect(page.getByText('План на сегодня')).toBeVisible({ timeout: 20_000 })

    await page.goto('/#/lesson/a1-01')
    await expect(page.getByRole('button', { name: 'Проверить' })).toBeVisible({
      timeout: 20_000,
    })
  } finally {
    await context.setOffline(false)
  }

  // Кнопка обновления перезагружает приложение; реальную смену версии
  // проверяем при деплое, здесь — что путь не ломает экран.
  await page.goto('/#/settings')
  await expect(page.getByText('Бэкап', { exact: true })).toBeVisible()
  await page
    .getByRole('button', { name: 'Проверить обновление' })
    .click()
    .catch(() => undefined)
  await expect(page.getByText('Бэкап', { exact: true })).toBeVisible({ timeout: 20_000 })
})
