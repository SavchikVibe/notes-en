export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatTodayRu(date = new Date()): string {
  const text = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = Math.round(minutes % 60)
  if (hours === 0) return `${rest} мин`
  if (rest === 0) return `${hours} ч`
  return `${hours} ч ${rest} мин`
}

export function formatSeconds(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} мин`
  return formatDuration(minutes)
}

export const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

export const WEEKDAYS_FULL = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

export function streakFromDays(days: { date: string; seconds: number }[], now = new Date()): number {
  const active = new Set(days.filter((day) => day.seconds > 0).map((day) => day.date))
  let streak = 0
  const cursor = new Date(now)
  if (!active.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  while (active.has(todayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function lastNDays(n: number, now = new Date()): { date: string; label: string; weekday: string }[] {
  const result = []
  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    result.push({
      date: todayKey(date),
      label: String(date.getDate()),
      weekday: WEEKDAYS[date.getDay()],
    })
  }
  return result
}
