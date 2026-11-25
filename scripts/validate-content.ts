import { units } from '../src/content/index.ts'
import { readings } from '../src/content/readings.ts'
import { studioTasks } from '../src/content/studio/index.ts'
import { answersMatch } from '../src/lib/text.ts'
import type { Exercise, ReadQuestion, Unit, Word } from '../src/content/types.ts'

const errors: string[] = []
const warnings: string[] = []
const unitIds = new Set<string>()
const wordIds = new Set<string>()
const unitOrders = new Set<number>()

function fail(message: string) {
  errors.push(message)
}

function warn(message: string) {
  warnings.push(message)
}

/**
 * Тексты внутри урока короткие по замыслу: урок идёт 10–15 минут.
 * Длинное чтение живёт в отдельной библиотеке (`scripts/check-readings.ts`).
 */
const MIN_UNIT_READ_WORDS: Record<string, number> = {
  A1: 40,
  A2: 55,
  B1: 70,
  B2: 60,
  C1: 100,
}

const BRITISH_SPELLING =
  /\b(colour|flavour|centre|metre|organise|realise|recognise|analyse|travelling|travelled|traveller|cancelled|cancelling|labelled|modelling|programme|catalogue|dialogue|defence|offence|grey|tyre|cheque|aeroplane|aluminium)\b/i

/**
 * Повтор модели-примера в упражнении — это задуманная опора для A1/A2.
 * Предупреждаем только о повторе одного и того же предложения
 * в разных упражнениях юнита.
 */
function collectSentences(unit: Unit): number {
  const seen = new Map<string, string>()
  const duplicates = new Set<string>()
  const remember = (text: string, source: string) => {
    const key = text.toLowerCase().replace(/\s+/g, ' ').trim()
    if (!key) return
    const previous = seen.get(key)
    if (previous && previous !== source) duplicates.add(key)
    else seen.set(key, source)
  }

  for (const exercise of unit.exercises) {
    if (exercise.kind === 'assemble') remember(exercise.answer.join(' '), exercise.id)
    if (exercise.kind === 'translate') remember(exercise.sample, exercise.id)
    if (exercise.kind === 'listen') remember(exercise.audio, exercise.id)
  }

  return duplicates.size
}

function americanIssues(unit: Unit): string[] {
  const issues = new Set<string>()
  const check = (text: string) => {
    const match = text.match(BRITISH_SPELLING)
    if (match) issues.add(match[0].toLowerCase())
  }

  for (const word of unit.words) {
    if (/ɒ|ɜː(?!r)|(?<![aeɔo])ɪə|(?<![ao])ʊə|eə/.test(word.ipa)) issues.add(`IPA:${word.ipa}`)
    for (const example of word.examples) check(example.en)
  }

  for (const exercise of unit.exercises) {
    if (exercise.kind === 'choice') {
      check(exercise.question)
      exercise.options.forEach(check)
    }
    if (exercise.kind === 'assemble') {
      exercise.words.forEach(check)
    }
    if (exercise.kind === 'translate') {
      exercise.accept.forEach(check)
      check(exercise.sample)
    }
    if (exercise.kind === 'listen') {
      check(exercise.audio)
      check(exercise.question)
      exercise.options?.forEach(check)
    }
    if (exercise.kind === 'speak') check(exercise.phrase)
    if (exercise.kind === 'write') {
      check(exercise.prompt)
      if (!exercise.selfAssessed) check(exercise.modelAnswer)
      exercise.usefulLanguage?.forEach(check)
    }
    if (exercise.kind === 'read') {
      check(exercise.title)
      exercise.paragraphs.forEach(check)
      exercise.questions.forEach((question) => {
        check(question.question)
        question.options.forEach(check)
      })
    }
  }

  return [...issues]
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
      if (exercise.words.length - exercise.answer.length < 2) {
        warn(`${path}: меньше двух слов-ловушек в банке`)
      }
      break
    case 'translate':
      if (!exercise.source.trim()) fail(`${path}: нет исходной фразы`)
      if (exercise.accept.length === 0) fail(`${path}: пустой список допустимых ответов`)
      if (exercise.accept.some((item) => !item.trim())) fail(`${path}: пустой вариант в accept`)
      if (!exercise.sample.trim()) fail(`${path}: нет образца`)
      if (
        exercise.sample.trim() &&
        !exercise.accept.some(
          (item) => answersMatch(item, exercise.sample),
        )
      ) {
        fail(`${path}: образец не входит в accept`)
      }
      // Один допустимый вариант — норма для коротких фраз: сравнение уже
      // игнорирует пунктуацию и раскрывает сокращения («I'm» = «I am»).
      // Список расширяем вручную там, где реально есть синоним.
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
    case 'write':
      if (!exercise.prompt.trim()) fail(`${path}: нет задания`)
      if (exercise.minWords <= 0) fail(`${path}: minWords должен быть больше нуля`)
      if (exercise.maxWords !== undefined && exercise.maxWords < exercise.minWords) {
        fail(`${path}: maxWords меньше minWords`)
      }
      if (exercise.checklist.length === 0) fail(`${path}: пустой чек-лист`)
      if (!exercise.selfAssessed && !exercise.modelAnswer.trim()) {
        fail(`${path}: нет образца`)
      }
      break
    case 'read':
      if (!exercise.title.trim()) fail(`${path}: нет заголовка текста`)
      if (exercise.paragraphs.length === 0) fail(`${path}: нет абзацев`)
      if (exercise.paragraphs.some((paragraph) => !paragraph.trim())) {
        fail(`${path}: пустой абзац`)
      }
      checkQuestions(path, exercise.questions)
      {
        const words = exercise.paragraphs.join(' ').split(/\s+/).filter(Boolean).length
        const minimum = MIN_UNIT_READ_WORDS[unit.level] ?? 0
        if (words < minimum) {
          warn(`${path}: текст ${words} слов, минимум для урока ${unit.level} — ${minimum}`)
        }
      }
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
  const coreCount = unit.exercises.filter((exercise) => !exercise.optional).length
  if (coreCount < 12) fail(`Юнит ${unit.id}: меньше 12 обязательных упражнений`)
  if (coreCount > 14) fail(`Юнит ${unit.id}: больше 14 обязательных упражнений`)
  if (unit.words.length === 0) fail(`Юнит ${unit.id}: нет слов`)

  const exerciseIds = new Set<string>()
  for (const exercise of unit.exercises) checkExercise(unit, exercise, exerciseIds)
  for (const word of unit.words) checkWord(unit, word)

  // Порядок вариантов перемешивается при показе (shuffleOptions), поэтому
  // «все ответы — A» в исходнике ничего не говорит о том, что видит ученик.

  const duplicateSentences = collectSentences(unit)
  if (duplicateSentences > 0) {
    warn(`${unit.id}: ${duplicateSentences} повторяющихся предложений внутри юнита`)
  }

  const issues = americanIssues(unit)
  if (issues.length > 0) {
    warn(`${unit.id}: американский английский — ${issues.slice(0, 5).join(', ')}${issues.length > 5 ? '…' : ''}`)
  }
}

const exerciseCount = units.reduce((sum, unit) => sum + unit.exercises.length, 0)
const wordCount = units.reduce((sum, unit) => sum + unit.words.length, 0)

const readingIds = new Set<string>()
for (const reading of readings) {
  const path = `reading/${reading.id}`
  if (readingIds.has(reading.id)) fail(`${path}: id повторяется`)
  readingIds.add(reading.id)
  if (!reading.title.trim()) fail(`${path}: нет заголовка`)
  if (reading.paragraphs.length < 2) fail(`${path}: меньше 2 абзацев`)
  if (reading.paragraphs.some((paragraph) => !paragraph.trim())) fail(`${path}: пустой абзац`)
  checkQuestions(path, reading.questions)
}

const studioIds = new Set<string>()
for (const task of studioTasks) {
  const path = `studio/${task.id}`
  if (studioIds.has(task.id)) fail(`${path}: id повторяется`)
  studioIds.add(task.id)
  if (!task.title.trim()) fail(`${path}: нет заголовка`)
  if (!task.goal.trim()) fail(`${path}: нет цели`)
  if (task.estimatedMinutes <= 0) fail(`${path}: estimatedMinutes должен быть больше нуля`)

  if (task.reading.paragraphs.length < 2) fail(`${path}/reading: меньше 2 абзацев`)
  if (task.reading.paragraphs.some((paragraph) => !paragraph.trim())) {
    fail(`${path}/reading: пустой абзац`)
  }
  checkQuestions(`${path}/reading`, task.reading.questions)

  if (task.listening.lines.length === 0) fail(`${path}/listening: нет реплик`)
  if (task.listening.notes.length === 0) fail(`${path}/listening: нет заметок`)
  for (const [index, note] of task.listening.notes.entries()) {
    if (!note.before.trim() || !note.after.trim() || !note.answer.trim()) {
      fail(`${path}/listening: пустая заметка ${index + 1}`)
    }
  }
  checkQuestions(`${path}/listening`, task.listening.questions)

  if (!task.writing.prompt.trim()) fail(`${path}/writing: нет задания`)
  if (task.writing.minWords <= 0) fail(`${path}/writing: minWords должен быть больше нуля`)
  if (task.writing.checklist.length === 0) fail(`${path}/writing: пустой чек-лист`)
  if (!task.writing.modelAnswer.trim()) fail(`${path}/writing: нет образца`)

  if (!task.speaking.prompt.trim()) fail(`${path}/speaking: нет задания`)
  if (task.speaking.checklist.length === 0) fail(`${path}/speaking: пустой чек-лист`)
}

if (errors.length > 0) {
  console.error(`Контент не прошёл проверку: ${errors.length} ошибок\n`)
  for (const message of errors) console.error(`  • ${message}`)
  process.exitCode = 1
} else {
  const studioCount = studioTasks.length
  const studioLabel =
    studioCount % 10 === 1 && studioCount % 100 !== 11
      ? 'студия'
      : studioCount % 10 >= 2 &&
          studioCount % 10 <= 4 &&
          (studioCount % 100 < 12 || studioCount % 100 > 14)
        ? 'студии'
        : 'студий'
  console.log(
    `Контент в порядке: ${units.length} юнитов, ${exerciseCount} упражнений, ${wordCount} слов, ${readings.length} текстов, ${studioCount} ${studioLabel}.`,
  )
}

if (warnings.length > 0) {
  console.warn(`\nПредупреждения: ${warnings.length}`)
  for (const message of warnings.slice(0, 30)) console.warn(`  • ${message}`)
  if (warnings.length > 30) console.warn(`  … и ещё ${warnings.length - 30}`)
}
