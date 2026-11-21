import { allWords, units } from '../src/content'
import { buildCloze } from '../src/lib/srs'
import { shuffle, shuffleOptions } from '../src/lib/options'
import { answersMatch, matchesAny, normalizeAnswer } from '../src/lib/text'
import { buildSession, targetMinutes } from '../src/lib/session'
import { defaultSettings } from '../src/db/db'

let failures = 0

function check(name: string, condition: boolean) {
  if (condition) return
  failures += 1
  console.log(`FAIL: ${name}`)
}

function equal<T>(name: string, actual: T, expected: T) {
  check(`${name} (ожидалось ${JSON.stringify(expected)}, получено ${JSON.stringify(actual)})`, actual === expected)
}

/* ------------------------------ нормализация ------------------------------- */

equal('пунктуация не важна', normalizeAnswer('I am a student.'), 'i am a student')
equal('сокращение раскрывается', normalizeAnswer("I'm a student"), 'i am a student')
equal('отрицание раскрывается', normalizeAnswer("She doesn't work"), 'she does not work')
equal('cannot = can not', normalizeAnswer('I cannot swim'), 'i can not swim')
equal('десятичная точка сохраняется', normalizeAnswer('It costs 2.5 dollars'), 'it costs 2.5 dollars')

check('принимает сокращение', matchesAny("I'm from Russia.", ['I am from Russia.']))
check('принимает полную форму', matchesAny('I am from Russia.', ["I'm from Russia."]))
check('не принимает другой смысл', !matchesAny("I don't like it", ['I like it.']))
check(
  "she's been = she has been",
  answersMatch("She's been busy lately.", 'She has been busy lately.'),
)
check("she's ready = she is ready", answersMatch("She's ready.", 'She is ready.'))
check("he'd gone = he had gone", answersMatch("He'd gone home.", 'He had gone home.'))
check(
  'двойные кавычки не мешают',
  answersMatch('“Conduct” collocates with “research.”', 'Conduct collocates with research.'),
)
check(
  'одинарные кавычки не мешают',
  answersMatch("'Conduct' collocates with 'research.'", 'Conduct collocates with research.'),
)
check(
  "she's been не равно she is",
  !answersMatch("She's been busy.", 'She is busy.'),
)

/* --------------------------------- варианты -------------------------------- */

const base = ['am', 'is', 'are']
const first = shuffle(base, 'a1-01-ex-01')
const second = shuffle(base, 'a1-01-ex-01')
equal('перемешивание детерминировано', first.join(','), second.join(','))
equal('перемешивание сохраняет набор', [...first].sort().join(','), [...base].sort().join(','))

const shuffled = shuffleOptions(['am', 'is', 'are'], 2, 'seed')
equal('индекс ответа пересчитан', shuffled.options[shuffled.answer], 'are')

/* ---------------------------------- cloze ---------------------------------- */

const words = allWords()
const clozeWord = words.find((word) => word.examples.length > 0)!
const cloze = buildCloze(clozeWord, words)
check('в cloze есть пропуск', cloze.sentence.includes('____'))
check('ответ есть в вариантах', cloze.options.includes(cloze.answer))
equal('четыре варианта', cloze.options.length, 4)
equal('варианты уникальны', new Set(cloze.options).size, 4)

/* --------------------------------- сессия ---------------------------------- */

const session = buildSession(units, {}, defaultSettings, new Date('2026-11-15T10:00:00'), 0, 54, 54)
equal('минуты сессии равны цели', session.totalMinutes, targetMinutes(defaultSettings, new Date('2026-11-15T10:00:00')))
equal(
  'блоки складываются в цель',
  session.blocks.reduce((sum, block) => sum + block.minutes, 0),
  session.totalMinutes,
)
check('первый блок — курс', session.blocks[0].key === 'course')
check('курс содержит уроки', session.blocks[0].units.length > 0)
check('чтение и слушание готовы при наличии текстов', session.blocks.every((block) => block.key === 'srs' || block.status === 'ready'))
equal('первый урок — a1-01', session.firstUnit?.id, 'a1-01')

const smallDay = buildSession(
  units,
  {},
  { ...defaultSettings, minutes: { ...defaultSettings.minutes, 0: 90 } },
  new Date('2026-11-15T10:00:00'),
)
equal('маленький день — 90 минут', smallDay.totalMinutes, 90)
equal(
  'маленький день складывается',
  smallDay.blocks.reduce((sum, block) => sum + block.minutes, 0),
  90,
)

/* -------------------------------- мастерская ------------------------------ */

const workshopUnit = units.find((unit) => unit.id === 'a2-23')!
const workshopWords = workshopUnit.exercises
  .filter((exercise) => exercise.optional)
  .map((exercise) => {
    const text =
      exercise.kind === 'listen'
        ? exercise.audio
        : exercise.kind === 'translate'
          ? exercise.sample
          : exercise.kind === 'speak'
            ? exercise.phrase
            : ''
    return workshopUnit.words.find((word) => word.examples.some((example) => example.en === text))
      ?.id
  })
check(
  'мастерская берёт примеры из разных слов',
  new Set(workshopWords.filter(Boolean)).size >= 2,
)

/* --------------------------------- итог ----------------------------------- */

console.log(`Проверок не пройдено: ${failures}.`)
if (failures > 0) process.exitCode = 1
