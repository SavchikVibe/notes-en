import { defineConfig, devices } from '@playwright/test'

/** Тест офлайн-режима идёт против собранного приложения (vite preview). */
export default defineConfig({
  testDir: './tests',
  testMatch: /offline\.spec\.ts/,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'offline-desktop' },
    {
      name: 'offline-mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
