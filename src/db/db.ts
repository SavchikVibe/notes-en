import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface LessonProgress {
  lessonId: string
  status: 'in_progress' | 'done'
  exerciseIndex: number
  bestScore: number
  lastScore: number
  attempts: number
  updatedAt: number
  completedAt?: number
  /** Последний ответ по id упражнения: true — верно. */
  answers?: Record<string, boolean>
  /** Первый ответ по id упражнения: нужен для честного счёта ошибок. */
  firstAnswers?: Record<string, boolean>
  /** Пропущенные упражнения: не входят в знаменатель итогового счёта. */
  skipped?: Record<string, boolean>
}

export interface DayLog {
  date: string
  seconds: number
  exercises: number
  lessons: string[]
}

export interface SrsCard {
  wordId: string
  box: number
  dueAt: number
  reviews: number
  correct: number
  wrong: number
  lastAt: number
}

/** Ошибка в упражнении, которая возвращается по расписанию. */
export interface ErrorItem {
  exerciseId: string
  unitId: string
  box: number
  dueAt: number
  reviews: number
  correct: number
  wrong: number
  lastAt: number
}

export interface Settings {
  /** Целевые минуты по дню недели. 0 — воскресенье. */
  minutes: Record<number, number>
  /** День с репетитором: 90 минут вместо обычного. */
  tutorDay: number | null
}

export const DEFAULT_MINUTES: Record<number, number> = {
  0: 150,
  1: 120,
  2: 90,
  3: 120,
  4: 120,
  5: 120,
  6: 180,
}

export const defaultSettings: Settings = {
  minutes: { ...DEFAULT_MINUTES },
  tutorDay: null,
}

interface EnglishDB extends DBSchema {
  progress: { key: string; value: LessonProgress }
  days: { key: string; value: DayLog }
  kv: { key: string; value: unknown }
  srs: { key: string; value: SrsCard }
  errors: { key: string; value: ErrorItem }
}

let dbPromise: Promise<IDBPDatabase<EnglishDB>> | null = null

function db() {
  if (!dbPromise) {
    dbPromise = openDB<EnglishDB>('english', 3, {
      upgrade(database, oldVersion) {
        if (oldVersion < 1) {
          database.createObjectStore('progress', { keyPath: 'lessonId' })
          database.createObjectStore('days', { keyPath: 'date' })
          database.createObjectStore('kv')
        }
        if (oldVersion < 2) {
          database.createObjectStore('srs', { keyPath: 'wordId' })
        }
        if (oldVersion < 3) {
          database.createObjectStore('errors', { keyPath: 'exerciseId' })
        }
      },
      blocking() {
        // Другая вкладка обновляет базу — отпускаем соединение, чтобы миграция прошла.
        void dbPromise?.then((database) => database.close())
        dbPromise = null
      },
      blocked() {
        console.warn('Обновление базы ждёт: закройте приложение на других вкладках')
      },
    })
  }
  return dbPromise
}

export async function requestPersist(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function getLessonProgress(lessonId: string): Promise<LessonProgress | undefined> {
  return (await db()).get('progress', lessonId)
}

export async function getAllLessonProgress(): Promise<Record<string, LessonProgress>> {
  const all = await (await db()).getAll('progress')
  return Object.fromEntries(all.map((item) => [item.lessonId, item]))
}

export async function saveResume(lessonId: string, exerciseIndex: number): Promise<void> {
  const database = await db()
  const existing = await database.get('progress', lessonId)
  if (existing?.status === 'done') return
  await database.put('progress', {
    ...existing,
    lessonId,
    status: 'in_progress',
    exerciseIndex,
    bestScore: existing?.bestScore ?? 0,
    lastScore: existing?.lastScore ?? 0,
    attempts: existing?.attempts ?? 0,
    updatedAt: Date.now(),
  })
}

export async function saveAnswer(
  lessonId: string,
  exerciseId: string,
  correct: boolean,
  nextIndex: number,
  firstAttempt: boolean,
): Promise<void> {
  const database = await db()
  const existing = await database.get('progress', lessonId)
  if (existing?.status === 'done') return
  const firstAnswers = existing?.firstAnswers ?? existing?.answers ?? {}
  await database.put('progress', {
    ...existing,
    lessonId,
    status: 'in_progress',
    exerciseIndex: nextIndex,
    bestScore: existing?.bestScore ?? 0,
    lastScore: existing?.lastScore ?? 0,
    attempts: existing?.attempts ?? 0,
    updatedAt: Date.now(),
    answers: { ...(existing?.answers ?? {}), [exerciseId]: correct },
    firstAnswers: firstAttempt
      ? { ...firstAnswers, [exerciseId]: correct }
      : firstAnswers,
  })
}

export async function saveSkip(
  lessonId: string,
  exerciseId: string,
  nextIndex: number,
): Promise<void> {
  const database = await db()
  const existing = await database.get('progress', lessonId)
  if (existing?.status === 'done') return
  await database.put('progress', {
    ...existing,
    lessonId,
    status: 'in_progress',
    exerciseIndex: nextIndex,
    bestScore: existing?.bestScore ?? 0,
    lastScore: existing?.lastScore ?? 0,
    attempts: existing?.attempts ?? 0,
    updatedAt: Date.now(),
    skipped: { ...(existing?.skipped ?? {}), [exerciseId]: true },
  })
}

export async function finishLesson(
  lessonId: string,
  score: number,
  exerciseCount: number,
): Promise<void> {
  const database = await db()
  const existing = await database.get('progress', lessonId)
  await database.put('progress', {
    ...existing,
    lessonId,
    status: 'done',
    exerciseIndex: 0,
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    lastScore: score,
    attempts: (existing?.attempts ?? 0) + 1,
    updatedAt: Date.now(),
    completedAt: existing?.completedAt ?? Date.now(),
  })
  await touchDay(0, exerciseCount, lessonId)
}

export async function restartLesson(lessonId: string): Promise<void> {
  const database = await db()
  const existing = await database.get('progress', lessonId)
  if (!existing) return
  await database.put('progress', {
    ...existing,
    lessonId,
    status: 'in_progress',
    exerciseIndex: 0,
    updatedAt: Date.now(),
    answers: {},
    firstAnswers: {},
    skipped: {},
  })
}

export async function getDay(date: string): Promise<DayLog | undefined> {
  return (await db()).get('days', date)
}

export async function getAllDays(): Promise<DayLog[]> {
  return (await db()).getAll('days')
}

export async function touchDay(seconds: number, exercises: number, lessonId?: string): Promise<void> {
  const database = await db()
  const date = dayKey()
  const existing = (await database.get('days', date)) ?? { date, seconds: 0, exercises: 0, lessons: [] }
  existing.seconds += Math.max(0, Math.round(seconds))
  existing.exercises += exercises
  if (lessonId && !existing.lessons.includes(lessonId)) existing.lessons.push(lessonId)
  await database.put('days', existing)
}

export async function addStudyTime(seconds: number): Promise<void> {
  const whole = Math.round(seconds)
  if (whole <= 0) return
  await touchDay(whole, 0)
}

const SRS_DAYS = [0, 1, 3, 7, 16, 35, 75, 150]

export async function addWordsToSrs(wordIds: string[]): Promise<void> {
  const database = await db()
  const existing = new Set((await database.getAll('srs')).map((card) => card.wordId))
  const now = Date.now()
  const tx = database.transaction('srs', 'readwrite')
  for (const wordId of wordIds) {
    if (existing.has(wordId)) continue
    tx.store.put({ wordId, box: 0, dueAt: now, reviews: 0, correct: 0, wrong: 0, lastAt: 0 })
  }
  await tx.done
}

export async function getAllSrs(): Promise<SrsCard[]> {
  return (await db()).getAll('srs')
}

export async function getDueCards(limit = 20): Promise<SrsCard[]> {
  const now = Date.now()
  const all = await (await db()).getAll('srs')
  const due = all.filter((card) => card.dueAt <= now)
  const reviews = due.filter((card) => card.reviews > 0)
  const fresh = due.filter((card) => card.reviews === 0)
  // Новые карточки не должны вытеснять повторение и не должны приходить лавиной.
  return [...reviews, ...fresh.slice(0, 8)]
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, limit)
}

export async function countDue(): Promise<number> {
  const now = Date.now()
  const all = await (await db()).getAll('srs')
  const due = all.filter((card) => card.dueAt <= now)
  const reviews = due.filter((card) => card.reviews > 0).length
  const fresh = due.filter((card) => card.reviews === 0).length
  return reviews + Math.min(fresh, 8)
}

export async function reviewCard(wordId: string, correct: boolean): Promise<void> {
  const database = await db()
  const card = await database.get('srs', wordId)
  if (!card) return
  const nextBox = correct
    ? Math.min(card.box + 1, SRS_DAYS.length - 1)
    : Math.max(0, card.box - 2)
  const days = correct ? SRS_DAYS[nextBox] : 0.25
  const now = Date.now()
  await database.put('srs', {
    ...card,
    box: nextBox,
    dueAt: now + days * 86_400_000,
    reviews: card.reviews + 1,
    correct: card.correct + (correct ? 1 : 0),
    wrong: card.wrong + (correct ? 0 : 1),
    lastAt: now,
  })
}

/* ------------------------------- error bank -------------------------------- */

const ERROR_DAYS = [1, 3, 7, 16, 35, 75]
const DAY_MS = 86_400_000

/** Первая ошибка: карточка ждёт следующего дня, чтобы не дублировать урок. */
export async function saveError(unitId: string, exerciseId: string): Promise<void> {
  const database = await db()
  const existing = await database.get('errors', exerciseId)
  const now = Date.now()
  if (existing) {
    await database.put('errors', {
      ...existing,
      box: 0,
      dueAt: now + DAY_MS,
      wrong: existing.wrong + 1,
      lastAt: now,
    })
    return
  }
  await database.put('errors', {
    exerciseId,
    unitId,
    box: 0,
    dueAt: now + DAY_MS,
    reviews: 0,
    correct: 0,
    wrong: 1,
    lastAt: now,
  })
}

export async function reviewError(exerciseId: string, correct: boolean): Promise<void> {
  const database = await db()
  const item = await database.get('errors', exerciseId)
  if (!item) return
  const now = Date.now()
  const nextBox = correct ? Math.min(item.box + 1, ERROR_DAYS.length - 1) : 0
  const days = correct ? ERROR_DAYS[nextBox] : 1
  await database.put('errors', {
    ...item,
    box: nextBox,
    dueAt: now + days * DAY_MS,
    reviews: item.reviews + 1,
    correct: item.correct + (correct ? 1 : 0),
    wrong: item.wrong + (correct ? 0 : 1),
    lastAt: now,
  })
}

export async function getDueErrors(limit = 12): Promise<ErrorItem[]> {
  const now = Date.now()
  const all = await (await db()).getAll('errors')
  return all
    .filter((item) => item.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .slice(0, limit)
}

export async function countDueErrors(): Promise<number> {
  const now = Date.now()
  const all = await (await db()).getAll('errors')
  return all.filter((item) => item.dueAt <= now).length
}

export async function getSettings(): Promise<Settings> {  const stored = (await (await db()).get('kv', 'settings')) as Partial<Settings> | undefined
  if (!stored) return { ...defaultSettings, minutes: { ...DEFAULT_MINUTES } }
  return {
    minutes: { ...DEFAULT_MINUTES, ...stored.minutes },
    tutorDay: stored.tutorDay ?? null,
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await (await db()).put('kv', settings, 'settings')
}

export interface Backup {
  version: 1
  exportedAt: string
  settings: Settings
  progress: LessonProgress[]
  days: DayLog[]
  srs?: SrsCard[]
  errors?: ErrorItem[]
}

export async function exportBackup(): Promise<Backup> {
  const database = await db()
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: await getSettings(),
    progress: await database.getAll('progress'),
    days: await database.getAll('days'),
    srs: await database.getAll('srs'),
    errors: await database.getAll('errors'),
  }
}

export async function importBackup(data: unknown): Promise<void> {
  if (!data || typeof data !== 'object') throw new Error('Файл не похож на бэкап')
  const backup = data as Partial<Backup>
  if (backup.version !== 1) throw new Error('Неизвестная версия бэкапа')
  const database = await db()
  const tx = database.transaction(['progress', 'days', 'kv', 'srs', 'errors'], 'readwrite')
  await tx.objectStore('progress').clear()
  await tx.objectStore('days').clear()
  await tx.objectStore('srs').clear()
  await tx.objectStore('errors').clear()
  for (const item of backup.progress ?? []) await tx.objectStore('progress').put(item)
  for (const item of backup.days ?? []) await tx.objectStore('days').put(item)
  for (const item of backup.srs ?? []) await tx.objectStore('srs').put(item)
  for (const item of backup.errors ?? []) await tx.objectStore('errors').put(item)
  if (backup.settings) await tx.objectStore('kv').put(backup.settings, 'settings')
  await tx.done
}

export async function resetAll(): Promise<void> {
  const database = await db()
  const tx = database.transaction(['progress', 'days', 'kv', 'srs', 'errors'], 'readwrite')
  await tx.objectStore('progress').clear()
  await tx.objectStore('days').clear()
  await tx.objectStore('kv').clear()
  await tx.objectStore('srs').clear()
  await tx.objectStore('errors').clear()
  await tx.done
}

function dayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
