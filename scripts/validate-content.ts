import { units } from '../src/content/index.ts'
import { readings } from '../src/content/readings.ts'
import { normalizeAnswer } from '../src/lib/text.ts'
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

const MIN_READ_WORDS: Record<string, number> = {
  A1: 100,
  A2: 200,
  B1: 400,
  B2: 700,
  C1: 450,
}

const BRITISH_SPELLING =
  /\b(colour|flavour|centre|metre|organise|realise|recognise|analyse|travelling|travelled|traveller|cancelled|cancelling|labelled|modelling|programme|catalogue|dialogue|defence|offence|grey|tyre|cheque|aeroplane|aluminium)\b/i

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

  for (const word of unit.words) {
    for (const example of word.examples) remember(example.en, `word:${word.id}`)
  }
  for (const exercise of unit.exercises) {
    if (exercise.kind === 'assemble') remember(exercise.answer.join(' '), exercise.id)
    if (exercise.kind === 'translate') remember(exercise.sample, exercise.id)
    if (exercise.kind === 'listen') remember(exercise.audio, exercise.id)
    if (exercise.kind === 'read') {
      for (const paragraph of exercise.paragraphs) remember(paragraph, exercise.id)
    }
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
    if (/ɒ|ɜː(?!r)|ɪə|eə|ʊə/.test(word.ipa)) issues.add(`IPA:${word.ipa}`)
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
          (item) => normalizeAnswer(item) === normalizeAnswer(exercise.sample),
        )
      ) {
        fail(`${path}: образец не входит в accept`)
      }
      if (exercise.accept.length < 2) {
        warn(`${path}: только один допустимый вариант перевода`)
      }
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
      {
        const words = exercise.paragraphs.join(' ').split(/\s+/).filter(Boolean).length
        const minimum = MIN_READ_WORDS[unit.level] ?? 0
        if (words < minimum) {
          warn(`${path}: текст ${words} слов, ориентир для ${unit.level} — ${minimum}+`)
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
  if (unit.exercises.length < 12) fail(`Юнит ${unit.id}: меньше 12 упражнений`)
  if (unit.exercises.length > 14) fail(`Юнит ${unit.id}: больше 14 упражнений`)
  if (unit.words.length === 0) fail(`Юнит ${unit.id}: нет слов`)

  const exerciseIds = new Set<string>()
  for (const exercise of unit.exercises) checkExercise(unit, exercise, exerciseIds)
  for (const word of unit.words) checkWord(unit, word)

  const choiceAnswers = unit.exercises
    .filter((exercise) => exercise.kind === 'choice')
    .map((exercise) => exercise.answer)
  if (choiceAnswers.length >= 3 && choiceAnswers.every((answer) => answer === 0)) {
    warn(`${unit.id}: все choice-ответы — вариант A`)
  }

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

if (errors.length > 0) {
  console.error(`Контент не прошёл проверку: ${errors.length} ошибок\n`)
  for (const message of errors) console.error(`  • ${message}`)
  process.exitCode = 1
} else {
  console.log(
    `Контент в порядке: ${units.length} юнитов, ${exerciseCount} упражнений, ${wordCount} слов, ${readings.length} текстов.`,
  )
}

if (warnings.length > 0) {
  console.warn(`\nПредупреждения: ${warnings.length}`)
  for (const message of warnings.slice(0, 30)) console.warn(`  • ${message}`)
  if (warnings.length > 30) console.warn(`  … и ещё ${warnings.length - 30}`)
}
