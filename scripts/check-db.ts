import 'fake-indexeddb/auto'
import {
  addWordsToSrs,
  countDueErrors,
  exportBackup,
  finishLesson,
  getDueCards,
  getDueErrors,
  getLessonProgress,
  getWriting,
  markWritingChecked,
  resetAll,
  reviewCard,
  reviewError,
  saveAnswer,
  saveError,
  saveResume,
  saveWriting,
} from '../src/db/db'

let failures = 0

function check(name: string, condition: boolean) {
  if (condition) return
  failures += 1
  console.log(`FAIL: ${name}`)
}

const DAY = 86_400_000
const HOUR = 3_600_000
const near = (value: number, target: number, tolerance = 5_000) =>
  Math.abs(value - target) <= tolerance

async function main() {
  await resetAll()

  /* ------------------------------- прогресс -------------------------------- */

  await saveResume('a1-01', 3)
  const resumed = await getLessonProgress('a1-01')
  check('resume: статус in_progress', resumed?.status === 'in_progress')
  check('resume: индекс упражнения', resumed?.exerciseIndex === 3)

  await saveAnswer('a1-01', 'a1-01-ex-01', false, 1, true)
  const afterWrong = await getLessonProgress('a1-01')
  check('первая попытка: ответ сохранён', afterWrong?.answers?.['a1-01-ex-01'] === false)
  check('первая попытка: firstAnswers сохранён', afterWrong?.firstAnswers?.['a1-01-ex-01'] === false)

  await saveAnswer('a1-01', 'a1-01-ex-01', true, 2, false)
  const afterRetry = await getLessonProgress('a1-01')
  check('повтор: последний ответ обновился', afterRetry?.answers?.['a1-01-ex-01'] === true)
  check(
    'повтор: первая попытка не перезаписана',
    afterRetry?.firstAnswers?.['a1-01-ex-01'] === false,
  )

  await finishLesson('a1-01', 0.75, 12)
  const finished = await getLessonProgress('a1-01')
  check('финиш: статус done', finished?.status === 'done')
  check('финиш: score', finished?.lastScore === 0.75)
  check('финиш: attempts', finished?.attempts === 1)

  /* ---------------------------------- SRS ---------------------------------- */

  await addWordsToSrs(['student', 'teacher'])
  const fresh = await getDueCards(20)
  check('новые карточки выдаются', fresh.some((card) => card.wordId === 'student'))
  check('новых карточек не больше восьми', fresh.filter((card) => card.reviews === 0).length <= 8)

  const beforeReview = Date.now()
  await reviewCard('student', true)
  const cards = await getDueCards(20)
  const student = cards.find((card) => card.wordId === 'student')
  check('верный ответ повышает коробку', student === undefined)
  const allAfter = await exportBackup()
  const studentCard = allAfter.srs?.find((card) => card.wordId === 'student')
  check('SRS: коробка 1 после верного ответа', studentCard?.box === 1)
  check(
    'SRS: следующий повтор через день',
    near(studentCard?.dueAt ?? 0, beforeReview + DAY, 10_000),
  )

  await reviewCard('teacher', false)
  const teacherCard = (await exportBackup()).srs?.find((card) => card.wordId === 'teacher')
  check('SRS: ошибка сбрасывает коробку', teacherCard?.box === 0)
  check('SRS: ошибка возвращается через 6 часов', near(teacherCard?.dueAt ?? 0, Date.now() + 6 * HOUR, 10_000))

  /* --------------------------------- ошибки -------------------------------- */

  await saveError('a1-01', 'a1-01-ex-01')
  const dueErrors = await getDueErrors()
  check('ошибка не показывается сразу', dueErrors.length === 0)
  check('счётчик ошибок', (await countDueErrors()) === 0)

  const errorBackup = await exportBackup()
  const savedError = errorBackup.errors?.find((item) => item.exerciseId === 'a1-01-ex-01')
  check('ошибка: коробка 0', savedError?.box === 0)
  check('ошибка: первый повтор через день', near(savedError?.dueAt ?? 0, Date.now() + DAY, 10_000))
  check('ошибка: счётчик wrong', savedError?.wrong === 1)

  await reviewError('a1-01-ex-01', true)
  const reviewed = (await exportBackup()).errors?.find(
    (item) => item.exerciseId === 'a1-01-ex-01',
  )
  check('ошибка: коробка 1 после верного ответа', reviewed?.box === 1)
  check('ошибка: повтор через 3 дня', near(reviewed?.dueAt ?? 0, Date.now() + 3 * DAY, 10_000))

  await reviewError('a1-01-ex-01', false)
  const failedAgain = (await exportBackup()).errors?.find(
    (item) => item.exerciseId === 'a1-01-ex-01',
  )
  check('ошибка: снова коробка 0', failedAgain?.box === 0)
  check('ошибка: снова через день', near(failedAgain?.dueAt ?? 0, Date.now() + DAY, 10_000))

  /* -------------------------------- портфолио ------------------------------- */

  await saveWriting('studio-a1-01-writing', 'Prompt', 'First draft.')
  const draft = await getWriting('studio-a1-01-writing')
  check('черновик сохранён', draft?.text === 'First draft.')
  check('первый вариант не отмечен до проверки', draft?.firstText === undefined)

  await markWritingChecked('studio-a1-01-writing', 'Prompt', 'First draft.')
  await saveWriting('studio-a1-01-writing', 'Prompt', 'Second draft.')
  const checked = await getWriting('studio-a1-01-writing')
  check('первый вариант зафиксирован', checked?.firstText === 'First draft.')
  check('текущий текст обновился', checked?.text === 'Second draft.')
  check('число проверок', checked?.revisions === 1)

  /* --------------------------------- бэкап ---------------------------------- */

  const backup = await exportBackup()
  check('бэкап содержит прогресс', (backup.progress ?? []).length > 0)
  check('бэкап содержит ошибки', (backup.errors ?? []).length > 0)
  check('бэкап содержит портфолио', (backup.writings ?? []).length > 0)

  await resetAll()
  check('сброс очищает прогресс', (await getLessonProgress('a1-01')) === undefined)
  check('сброс очищает ошибки', (await countDueErrors()) === 0)

  console.log(`Проверок БД не пройдено: ${failures}.`)
  if (failures > 0) process.exitCode = 1
}

void main()
