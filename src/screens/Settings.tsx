import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, RefreshCw, RotateCcw, Upload } from 'lucide-react'
import {
  exportBackup,
  getSettings,
  importBackup,
  resetAll,
  saveSettings,
  type Settings,
} from '@/db/db'
import { todayKey, WEEKDAYS, WEEKDAYS_FULL } from '@/lib/date'
import { AppBar } from '@/components/AppBar'
import { Button } from '@/components/Button'

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

export default function SettingsScreen() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    void getSettings().then(setSettings)
  }, [])

  function update(next: Settings) {
    setSettings(next)
    void saveSettings(next)
  }

  function setMinutes(day: number, value: number) {
    if (!settings) return
    const minutes = Math.max(30, Math.min(300, Number.isFinite(value) ? value : 60))
    update({ ...settings, minutes: { ...settings.minutes, [day]: minutes } })
  }

  async function handleExport() {
    const data = await exportBackup()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `english-backup-${todayKey()}.json`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Бэкап скачан.')
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!window.confirm('Импорт заменит весь текущий прогресс. Продолжить?')) return
      await importBackup(data)
      setSettings(await getSettings())
      setMessage('Бэкап загружен.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Не удалось прочитать файл')
    } finally {
      event.target.value = ''
    }
  }

  async function handleReset() {
    if (!window.confirm('Удалить весь прогресс без возможности восстановления?')) return
    await resetAll()
    setSettings(await getSettings())
    setMessage('Прогресс удалён.')
  }

  async function checkUpdate() {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      await registration?.update()
    } finally {
      window.location.reload()
    }
  }

  if (!settings) {
    return (
      <>
        <AppBar title="Настройки" onBack={() => navigate('/')} />
        <main className="px-5 pt-6">
          <p className="text-[15px] text-ink-3">Загрузка…</p>
        </main>
      </>
    )
  }

  return (
    <>
      <AppBar title="Настройки" onBack={() => navigate('/')} />

      <main className="px-5 pb-10 pt-6">
        <section>
          <h2 className="text-[20px]">Время занятий</h2>
          <p className="mt-1 text-[15px] text-ink-2">Сколько минут в день ты готов заниматься.</p>

          <ul className="mt-4">
            {DAY_ORDER.map((day) => (
              <li
                key={day}
                className="flex min-h-[52px] items-center justify-between gap-4 border-b border-line"
              >
                <span className="text-[17px]">
                  {WEEKDAYS_FULL[day]}
                  {settings.tutorDay === day ? (
                    <span className="ml-2 text-[13px] text-ink-3">репетитор</span>
                  ) : null}
                </span>
                <label className="flex items-center gap-2 text-[15px] text-ink-3">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={30}
                    max={300}
                    step={5}
                    value={settings.minutes[day] ?? 120}
                    onChange={(event) => setMinutes(day, Number(event.target.value))}
                    className="num w-16 border-b border-line bg-transparent py-1 text-right text-[17px] text-ink outline-none focus:border-accent"
                  />
                  мин
                </label>
              </li>
            ))}
          </ul>

          <label className="mt-5 flex items-center justify-between gap-4">
            <span className="text-[17px]">День с репетитором</span>
            <select
              value={settings.tutorDay ?? ''}
              onChange={(event) =>
                update({
                  ...settings,
                  tutorDay: event.target.value === '' ? null : Number(event.target.value),
                })
              }
              className="min-h-11 rounded-[10px] border border-line bg-surface px-3 text-[15px]"
            >
              <option value="">Нет</option>
              {DAY_ORDER.map((day) => (
                <option key={day} value={day}>
                  {WEEKDAYS[day]}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1 text-[13px] text-ink-3">В этот день план — 90 минут.</p>
        </section>

        <section className="mt-9 border-t border-line pt-6">
          <h2 className="text-[20px]">Бэкап</h2>
          <p className="mt-1 text-[15px] text-ink-2">
            Прогресс хранится только на этом устройстве. Раз в неделю — файл в облако.
          </p>

          <div className="mt-4 grid gap-2.5">
            <Button variant="secondary" className="w-full" onClick={() => void handleExport()}>
              <Download size={19} strokeWidth={1.5} />
              Скачать бэкап
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={19} strokeWidth={1.5} />
              Загрузить бэкап
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => void handleImport(event)}
            />
          </div>

          {message && <p className="mt-3 text-[15px] text-ink-2">{message}</p>}
        </section>

        <section className="mt-9 border-t border-line pt-6">
          <h2 className="text-[20px]">Данные</h2>
          <Button variant="ghost" className="mt-2 w-full justify-start px-0" onClick={() => void handleReset()}>
            <RotateCcw size={18} strokeWidth={1.5} />
            Сбросить прогресс
          </Button>
        </section>

        <section className="mt-9 border-t border-line pt-6">
          <h2 className="text-[20px]">О приложении</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
            English — личный курс. Версия 0.25.0. Работает офлайн после установки на главный экран.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
            Фото в словаре —{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Unsplash
            </a>
            .
          </p>
          <Button variant="secondary" className="mt-4 w-full" onClick={() => void checkUpdate()}>
            <RefreshCw size={18} strokeWidth={1.5} />
            Проверить обновление
          </Button>
        </section>
      </main>
    </>
  )
}
