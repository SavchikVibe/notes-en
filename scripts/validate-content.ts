import { units } from '../src/content/index.ts'
import type { Exercise, ReadQuestion, Unit, Word } from '../src/content/types.ts'

const errors: string[] = []
const unitIds = new Set<string>()
const wordIds = new Set<string>()
const unitOrders = new Set<number>()

function fail(message: string) {
  errors.push(message)
}

function checkChoice(
  path: string,
  options: string[] | undefined,
  answer: number,
  min = 2,
  max = 4,
) {
  if (!options || options.length < min || options.length > max) {
    fail(`${path}: нужно ${min}–${max} варианта, сейчас ${options?.length ?? 0}`)
    return
  }
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    fail(`${path}: answer=${answer} вне диапазона вариантов`)
  }
  if (new Set(options).size !== options.length) {
    fail(`${path}: варианты повторяются`)
  }
}

function checkQuestions(path: string, questions: ReadQuestion[]) {
  if (questions.length === 0) {
    fail(`${path}: нет вопросов к тексту`)
    return
  }
  questions.forEach((question, index) => {
    if (!question.question.trim()) fail(`${path}: пустой вопрос ${index + 1}`)
    checkChoice(`${path}.q${index + 1}`, question.options, question.answer)
  })
}

function checkExercise(unit: Unit, exercise: Exercise, seen: Set<string>) {
  const path = `${unit.id}/${exercise.id}`
  if (seen.has(exercise.id)) fail(`${path}: id упражнения повторяется`)
  seen.add(exercise.id)
  if (!exercise.id.trim()) fail(`${unit.id}: пустой id упражнения`)

  switch (exercise.kind) {
    case 'choice':
      if (!exercise.question.includes('___')) {
        fail(`${path}: в вопросе нет пропуска ___`)
      }
      checkChoice(path, exercise.options, exercise.answer)
      break
    case 'assemble':
      if (exercise.answer.length < 2) fail(`${path}: слишком короткий ответ`)
      if (exercise.words.length < exercise.answer.length) {
        fail(`${path}: в банке меньше слов, чем в ответе`)
      }
      if (!exercise.translation.trim()) fail(`${path}: нет перевода-подсказки`)
      {
        const bank = [...exercise.words]
        for (const token of exercise.answer) {
          const index = bank.findIndex((word) => word === token)
          if (index === -1) {
            fail(`${path}: слова «${token}» нет в банке`)
          } else {
            bank.splice(index, 1)
          }
        }
      }
      break
    case 'translate':
      if (!exercise.source.trim()) fail(`${path}: нет исходной фразы`)
      if (exercise.accept.length === 0) fail(`${path}: пустой список допустимых ответов`)
      if (exercise.accept.some((item) => !item.trim())) fail(`${path}: пустой вариант в accept`)
      if (!exercise.sample.trim()) fail(`${path}: нет образца`)
      break
    case 'listen':
      if (!exercise.audio.trim()) fail(`${path}: пустая фраза для озвучки`)
      if (!exercise.question.trim()) fail(`${path}: пустой вопрос`)
      if (exercise.mode === 'choice') {
        checkChoice(path, exercise.options, Number(exercise.answer), 3, 4)
      } else if (!String(exercise.answer).trim()) {
        fail(`${path}: пустой ответ для режима type`)
      }
      break
    case 'speak':
      if (!exercise.phrase.trim()) fail(`${path}: пустая фраза`)
      if (!exercise.translation.trim()) fail(`${path}: нет перевода`)
      break
    case 'read':
      if (!exercise.title.trim()) fail(`${path}: нет заголовка текста`)
      if (exercise.paragraphs.length === 0) fail(`${path}: нет абзацев`)
      if (exercise.paragraphs.some((paragraph) => !paragraph.trim())) {
        fail(`${path}: пустой абзац`)
      }
      checkQuestions(path, exercise.questions)
      break
  }
}

function checkWord(unit: Unit, word: Word) {
  const path = `${unit.id}/word:${word.id}`
  if (!word.id.trim()) fail(`${path}: пустой id`)
  if (wordIds.has(word.id)) fail(`${path}: слово повторяется в курсе`)
  wordIds.add(word.id)
  if (!word.term.trim()) fail(`${path}: пустой term`)
  if (!word.ipa.trim()) fail(`${path}: пустая транскрипция`)
  if (/[[\]]/.test(word.ipa)) fail(`${path}: транскрипция должна быть без квадратных скобок`)
  if (word.level !== unit.level) {
    fail(`${path}: уровень ${word.level} не совпадает с уровнем юнита ${unit.level}`)
  }
  if (!word.translation.trim()) fail(`${path}: пустой перевод`)
  if (word.examples.length < 3) fail(`${path}: нужно минимум 3 примера`)
  if (word.examples.length > 4) fail(`${path}: больше 4 примеров`)
  word.examples.forEach((example, index) => {
    if (!example.en.trim()) fail(`${path}: пустой английский пример ${index + 1}`)
    if (!example.ru.trim()) fail(`${path}: пустой перевод примера ${index + 1}`)
    if (!example.en.toLowerCase().includes(word.term.toLowerCase().split(' ')[0])) {
      fail(`${path}: в примере ${index + 1} нет слова «${word.term}»`)
    }
  })
}

for (const unit of units) {
  if (unitIds.has(unit.id)) fail(`Юнит ${unit.id}: id повторяется`)
  unitIds.add(unit.id)
  if (unitOrders.has(unit.order)) fail(`Юнит ${unit.id}: order ${unit.order} повторяется`)
  unitOrders.add(unit.order)
  if (!/^[a-z]\d-\d{2}$/.test(unit.id)) fail(`Юнит ${unit.id}: id должен быть вида a1-01`)
  if (!unit.title.trim()) fail(`Юнит ${unit.id}: нет заголовка`)
  if (!unit.goal.trim()) fail(`Юнит ${unit.id}: нет цели`)
  if (unit.formulas.length === 0) fail(`Юнит ${unit.id}: нет формул`)
  if (unit.exercises.length < 12) fail(`Юнит ${unit.id}: меньше 12 упражнений`)
  if (unit.exercises.length > 14) fail(`Юнит ${unit.id}: больше 14 упражнений`)
  if (unit.words.length === 0) fail(`Юнит ${unit.id}: нет слов`)

  const exerciseIds = new Set<string>()
  for (const exercise of unit.exercises) checkExercise(unit, exercise, exerciseIds)
  for (const word of unit.words) checkWord(unit, word)
}

const exerciseCount = units.reduce((sum, unit) => sum + unit.exercises.length, 0)
const wordCount = units.reduce((sum, unit) => sum + unit.words.length, 0)

if (errors.length > 0) {
  console.error(`Контент не прошёл проверку: ${errors.length} ошибок\n`)
  for (const message of errors) console.error(`  • ${message}`)
  process.exitCode = 1
} else {
  console.log(
    `Контент в порядке: ${units.length} юнитов, ${exerciseCount} упражнений, ${wordCount} слов.`,
  )
}
