import { buildTutorPack } from '../src/lib/tutor-pack'
import type { ErrorItem, LessonProgress, Writing } from '../src/db/db'

let failures = 0
function check(name: string, condition: boolean) {
  if (condition) return
  failures += 1
  console.log(`FAIL: ${name}`)
}

const now = Date.now()
const writing: Writing = {
  id: 'gate-a1-writing',
  prompt: 'Write about your week.',
  text: 'I went to the park. I am going to visit my grandmother.',
  firstText: 'I go to the park.',
  createdAt: now - 3_600_000,
  updatedAt: now - 3_600_000,
  revisions: 1,
}
const oldWriting: Writing = {
  ...writing,
  id: 'old',
  prompt: 'Old prompt',
  updatedAt: now - 30 * 86_400_000,
}
const error: ErrorItem = {
  exerciseId: 'a1-01-ex-01',
  unitId: 'a1-01',
  box: 0,
  dueAt: now,
  reviews: 1,
  correct: 0,
  wrong: 3,
  lastAt: now,
}
const progress: LessonProgress = {
  lessonId: 'a1-01',
  status: 'done',
  exerciseIndex: 0,
  bestScore: 1,
  lastScore: 1,
  attempts: 1,
  updatedAt: now,
  completedAt: now,
}

const pack = buildTutorPack({
  writings: [writing, oldWriting],
  errors: [error],
  progress: [progress],
  now,
})
check('есть заголовок', pack.includes('# Пакет для репетитора'))
check('есть письмо', pack.includes('Write about your week.'))
check('есть первый вариант', pack.includes('Первый вариант'))
check('есть текущий вариант', pack.includes('Текущий вариант'))
check('есть ошибка', pack.includes('ошибок: 3'))
check('есть тема', pack.includes('A1 ·'))
check('нет старой работы за неделю', !pack.includes('Old prompt'))
check('есть раздел тем', pack.includes('## Пройденные темы'))

const empty = buildTutorPack({ writings: [], errors: [], progress: [], now })
check('пустой пакет: нет работ', empty.includes('Письменных работ пока нет'))
check('пустой пакет: нет ошибок', empty.includes('Ошибок в банке пока нет'))
check('пустой пакет: нет тем', empty.includes('За последние 7 дней завершённых тем нет'))

console.log(`Проверок пакета для репетитора не пройдено: ${failures}.`)
if (failures > 0) process.exitCode = 1
