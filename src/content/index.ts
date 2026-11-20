import type { Exercise, Unit, Word } from './types'
import { extraExamples } from './extra-examples'
import { extraExercises } from './extra-exercises'
import { photos } from './photo-map'
import { a101 } from './units/a1-01'
import { a102 } from './units/a1-02'
import { a103 } from './units/a1-03'
import { a104 } from './units/a1-04'
import { a105 } from './units/a1-05'
import { a106 } from './units/a1-06'
import { a107 } from './units/a1-07'
import { a108 } from './units/a1-08'
import { a109 } from './units/a1-09'
import { a110 } from './units/a1-10'
import { a111 } from './units/a1-11'
import { a112 } from './units/a1-12'
import { a113 } from './units/a1-13'
import { a114 } from './units/a1-14'
import { a115 } from './units/a1-15'
import { a116 } from './units/a1-16'
import { a117 } from './units/a1-17'
import { a118 } from './units/a1-18'
import { a119 } from './units/a1-19'
import { a120 } from './units/a1-20'
import { a121 } from './units/a1-21'
import { a122 } from './units/a1-22'
import { a123 } from './units/a1-23'
import { a124 } from './units/a1-24'
import { a125 } from './units/a1-25'
import { a126 } from './units/a1-26'
import { a127 } from './units/a1-27'
import { a128 } from './units/a1-28'
import { a129 } from './units/a1-29'
import { a130 } from './units/a1-30'
import { a131 } from './units/a1-31'
import { a132 } from './units/a1-32'
import { a133 } from './units/a1-33'
import { a134 } from './units/a1-34'
import { a135 } from './units/a1-35'
import { a136 } from './units/a1-36'
import { a137 } from './units/a1-37'
import { a138 } from './units/a1-38'
import { a139 } from './units/a1-39'
import { a140 } from './units/a1-40'
import { a201 } from './units/a2-01'
import { a202 } from './units/a2-02'
import { a203 } from './units/a2-03'
import { a204 } from './units/a2-04'
import { a205 } from './units/a2-05'
import { a206 } from './units/a2-06'
import { a207 } from './units/a2-07'
import { a208 } from './units/a2-08'
import { a209 } from './units/a2-09'
import { a210 } from './units/a2-10'
import { a211 } from './units/a2-11'
import { a212 } from './units/a2-12'
import { a213 } from './units/a2-13'
import { a214 } from './units/a2-14'
import { a215 } from './units/a2-15'
import { a216 } from './units/a2-16'
import { a217 } from './units/a2-17'
import { a218 } from './units/a2-18'
import { a219 } from './units/a2-19'
import { a220 } from './units/a2-20'
import { a221 } from './units/a2-21'
import { a222 } from './units/a2-22'
import { a223 } from './units/a2-23'
import { a224 } from './units/a2-24'
import { a225 } from './units/a2-25'
import { a226 } from './units/a2-26'
import { a227 } from './units/a2-27'
import { a228 } from './units/a2-28'
import { a229 } from './units/a2-29'
import { a230 } from './units/a2-30'
import { a231 } from './units/a2-31'
import { a232 } from './units/a2-32'
import { a233 } from './units/a2-33'
import { a234 } from './units/a2-34'
import { a235 } from './units/a2-35'
import { a236 } from './units/a2-36'
import { a237 } from './units/a2-37'
import { a238 } from './units/a2-38'
import { a239 } from './units/a2-39'
import { a240 } from './units/a2-40'
import { a241 } from './units/a2-41'
import { a242 } from './units/a2-42'
import { a243 } from './units/a2-43'
import { a244 } from './units/a2-44'
import { a245 } from './units/a2-45'
import { a246 } from './units/a2-46'
import { a247 } from './units/a2-47'
import { a248 } from './units/a2-48'
import { a249 } from './units/a2-49'
import { a250 } from './units/a2-50'
import { b101 } from './units/b1-01'
import { b102 } from './units/b1-02'
import { b103 } from './units/b1-03'
import { b104 } from './units/b1-04'
import { b105 } from './units/b1-05'
import { b106 } from './units/b1-06'
import { b107 } from './units/b1-07'
import { b108 } from './units/b1-08'
import { b109 } from './units/b1-09'
import { b110 } from './units/b1-10'
import { b111 } from './units/b1-11'
import { b112 } from './units/b1-12'
import { b113 } from './units/b1-13'
import { b114 } from './units/b1-14'
import { b115 } from './units/b1-15'
import { b116 } from './units/b1-16'
import { b117 } from './units/b1-17'
import { b118 } from './units/b1-18'
import { b119 } from './units/b1-19'
import { b120 } from './units/b1-20'
import { b121 } from './units/b1-21'
import { b122 } from './units/b1-22'
import { b123 } from './units/b1-23'
import { b124 } from './units/b1-24'
import { b125 } from './units/b1-25'
import { b126 } from './units/b1-26'
import { b127 } from './units/b1-27'
import { b128 } from './units/b1-28'
import { b129 } from './units/b1-29'
import { b130 } from './units/b1-30'
import { b131 } from './units/b1-31'
import { b132 } from './units/b1-32'
import { b133 } from './units/b1-33'
import { b134 } from './units/b1-34'
import { b135 } from './units/b1-35'
import { b136 } from './units/b1-36'
import { b137 } from './units/b1-37'
import { b138 } from './units/b1-38'
import { b139 } from './units/b1-39'
import { b140 } from './units/b1-40'
import { b141 } from './units/b1-41'
import { b142 } from './units/b1-42'
import { b143 } from './units/b1-43'
import { b144 } from './units/b1-44'
import { b145 } from './units/b1-45'
import { b146 } from './units/b1-46'
import { b147 } from './units/b1-47'
import { b148 } from './units/b1-48'
import { b149 } from './units/b1-49'
import { b150 } from './units/b1-50'
import { b151 } from './units/b1-51'
import { b152 } from './units/b1-52'
import { b153 } from './units/b1-53'
import { b154 } from './units/b1-54'
import { b155 } from './units/b1-55'
import { b156 } from './units/b1-56'
import { b157 } from './units/b1-57'
import { b158 } from './units/b1-58'
import { b159 } from './units/b1-59'
import { b160 } from './units/b1-60'
import { b201 } from './units/b2-01'
import { b202 } from './units/b2-02'
import { b203 } from './units/b2-03'
import { b204 } from './units/b2-04'
import { b205 } from './units/b2-05'
import { b206 } from './units/b2-06'
import { b207 } from './units/b2-07'
import { b208 } from './units/b2-08'
import { b209 } from './units/b2-09'
import { b210 } from './units/b2-10'
import { b211 } from './units/b2-11'
import { b212 } from './units/b2-12'
import { b213 } from './units/b2-13'
import { b214 } from './units/b2-14'
import { b215 } from './units/b2-15'
import { b216 } from './units/b2-16'
import { b217 } from './units/b2-17'
import { b218 } from './units/b2-18'
import { b219 } from './units/b2-19'
import { b220 } from './units/b2-20'
import { b221 } from './units/b2-21'
import { b222 } from './units/b2-22'
import { b223 } from './units/b2-23'
import { b224 } from './units/b2-24'
import { b225 } from './units/b2-25'
import { b226 } from './units/b2-26'
import { b227 } from './units/b2-27'
import { b228 } from './units/b2-28'
import { b229 } from './units/b2-29'
import { b230 } from './units/b2-30'
import { b231 } from './units/b2-31'
import { b232 } from './units/b2-32'
import { b233 } from './units/b2-33'
import { b234 } from './units/b2-34'
import { b235 } from './units/b2-35'
import { b236 } from './units/b2-36'
import { b237 } from './units/b2-37'
import { b238 } from './units/b2-38'
import { b239 } from './units/b2-39'
import { b240 } from './units/b2-40'
import { b241 } from './units/b2-41'
import { b242 } from './units/b2-42'
import { b243 } from './units/b2-43'
import { b244 } from './units/b2-44'
import { b245 } from './units/b2-45'
import { b246 } from './units/b2-46'
import { b247 } from './units/b2-47'
import { b248 } from './units/b2-48'
import { b249 } from './units/b2-49'
import { b250 } from './units/b2-50'
import { b251 } from './units/b2-51'
import { b252 } from './units/b2-52'
import { b253 } from './units/b2-53'
import { b254 } from './units/b2-54'
import { b255 } from './units/b2-55'
import { b256 } from './units/b2-56'
import { b257 } from './units/b2-57'
import { b258 } from './units/b2-58'
import { b259 } from './units/b2-59'
import { b260 } from './units/b2-60'
import { c101 } from './units/c1-01'
import { c102 } from './units/c1-02'
import { c103 } from './units/c1-03'
import { c104 } from './units/c1-04'
import { c105 } from './units/c1-05'
import { c106 } from './units/c1-06'
import { c107 } from './units/c1-07'
import { c108 } from './units/c1-08'
import { c109 } from './units/c1-09'
import { c110 } from './units/c1-10'
import { c111 } from './units/c1-11'
import { c112 } from './units/c1-12'
import { c113 } from './units/c1-13'
import { c114 } from './units/c1-14'
import { c115 } from './units/c1-15'
import { c116 } from './units/c1-16'
import { c117 } from './units/c1-17'
import { c118 } from './units/c1-18'
import { c119 } from './units/c1-19'
import { c120 } from './units/c1-20'
import { c121 } from './units/c1-21'
import { c122 } from './units/c1-22'
import { c123 } from './units/c1-23'
import { c124 } from './units/c1-24'

function sentenceKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Необязательная мастерская: 3 упражнения из примеров, не занятых в уроке. */
function buildWorkshop(unit: Unit, used: Set<string>): Exercise[] {
  const seen = new Set<string>()
  const picks: Word['examples'] = []
  for (const word of unit.words) {
    for (const example of word.examples) {
      if (picks.length >= 3) break
      const key = sentenceKey(example.en)
      if (used.has(key) || seen.has(key)) continue
      seen.add(key)
      picks.push(example)
    }
    if (picks.length >= 3) break
  }

  const workshop: Exercise[] = []
  if (picks[0]) {
    workshop.push({
      kind: 'listen',
      id: `${unit.id}-workshop-listen`,
      audio: picks[0].en,
      question: 'Напиши, что услышал',
      mode: 'type',
      answer: picks[0].en,
      translation: picks[0].ru,
      optional: true,
    })
  }
  if (picks[1]) {
    workshop.push({
      kind: 'translate',
      id: `${unit.id}-workshop-translate`,
      source: picks[1].ru,
      accept: [picks[1].en],
      sample: picks[1].en,
      optional: true,
    })
  }
  if (picks[2]) {
    workshop.push({
      kind: 'speak',
      id: `${unit.id}-workshop-speak`,
      phrase: picks[2].en,
      translation: picks[2].ru,
      optional: true,
    })
  }
  return workshop
}

function pickDictation(unit: Unit, used: Set<string>) {
  const candidates = unit.words
    .flatMap((word) => word.examples)
    .filter((example) => {
      const count = example.en.split(/\s+/).length
      return count >= 3 && count <= 6
    })
  const fresh = candidates.filter((example) => !used.has(sentenceKey(example.en)))
  return (fresh.length > 0 ? fresh : candidates).sort((a, b) => a.en.length - b.en.length)[0]
}

/**
 * Банк слов для assemble: сохраняем все слова, нужные ответу (включая повторы
 * вроде двух «the»), убираем лишние дубликаты-ловушки и добираем ловушки
 * из слов юнита, чтобы в банке было хотя бы два лишних слова.
 */
function withDistractors(unit: Unit, exercise: Exercise): Exercise {
  if (exercise.kind !== 'assemble') return exercise

  const answerCounts = new Map<string, number>()
  for (const word of exercise.answer) {
    const key = word.toLowerCase()
    answerCounts.set(key, (answerCounts.get(key) ?? 0) + 1)
  }

  const usedAnswer = new Map<string, number>()
  const seenDistractors = new Set<string>()
  const words: string[] = []

  for (const word of exercise.words) {
    const key = word.toLowerCase()
    const needed = answerCounts.get(key) ?? 0
    const used = usedAnswer.get(key) ?? 0
    if (needed > used) {
      words.push(word)
      usedAnswer.set(key, used + 1)
      continue
    }
    if (seenDistractors.has(key)) continue
    seenDistractors.add(key)
    words.push(word)
  }

  // Если в банке не хватило копий слова из ответа, добавляем их.
  for (const [key, needed] of answerCounts) {
    let used = usedAnswer.get(key) ?? 0
    while (used < needed) {
      const sample = exercise.answer.find((word) => word.toLowerCase() === key) ?? key
      words.push(sample)
      used += 1
    }
    usedAnswer.set(key, used)
  }

  const countDistractors = () =>
    words.filter((word) => !answerCounts.has(word.toLowerCase())).length

  for (const term of unit.words.map((word) => word.term)) {
    if (countDistractors() >= 2) break
    const key = term.toLowerCase()
    if (seenDistractors.has(key) || answerCounts.has(key) || term.includes(' ')) continue
    seenDistractors.add(key)
    words.push(term)
  }

  return { ...exercise, words }
}

function withContent(unit: Unit): Unit {
  const read = unit.exercises.filter((exercise) => exercise.kind === 'read')
  const base = unit.exercises.filter((exercise) => exercise.kind !== 'read')
  const extra = extraExercises[unit.id] ?? []
  const derived: Exercise[] = []

  const usedSentences = new Set<string>()
  for (const exercise of [...base, ...extra]) {
    if (exercise.kind === 'translate') usedSentences.add(sentenceKey(exercise.sample))
    if (exercise.kind === 'assemble') usedSentences.add(sentenceKey(exercise.answer.join(' ')))
    if (exercise.kind === 'listen') usedSentences.add(sentenceKey(exercise.audio))
  }

  const dictation = pickDictation(unit, usedSentences)
  if (dictation) {
    derived.push({
      kind: 'listen',
      id: `${unit.id}-gen-listen`,
      audio: dictation.en,
      question: 'Напиши, что услышал',
      mode: 'type',
      answer: dictation.en,
      translation: dictation.ru,
    })
    usedSentences.add(sentenceKey(dictation.en))
  }

  const translate =
    extra.find((exercise) => exercise.kind === 'translate') ??
    base.find((exercise) => exercise.kind === 'translate')
  if (translate && translate.kind === 'translate') {
    derived.push({
      kind: 'speak',
      id: `${unit.id}-gen-speak`,
      phrase: translate.sample,
      translation: translate.source,
    })
  }

  const workshop = buildWorkshop(unit, usedSentences)

  return {
    ...unit,
    exercises: [...base, ...extra, ...derived, ...read, ...workshop].map((exercise) =>
      withDistractors(unit, exercise),
    ),
  }
}

export const units: Unit[] = [a101, a102, a103, a104, a105, a106, a107, a108, a109, a110, a111, a112, a113, a114, a115, a116, a117, a118, a119, a120, a121, a122, a123, a124, a125, a126, a127, a128, a129, a130, a131, a132, a133, a134, a135, a136, a137, a138, a139, a140, a201, a202, a203, a204, a205, a206, a207, a208, a209, a210, a211, a212, a213, a214, a215, a216, a217, a218, a219, a220, a221, a222, a223, a224, a225, a226, a227, a228, a229, a230, a231, a232, a233, a234, a235, a236, a237, a238, a239, a240, a241, a242, a243, a244, a245, a246, a247, a248, a249, a250, b101, b102, b103, b104, b105, b106, b107, b108, b109, b110, b111, b112, b113, b114, b115, b116, b117, b118, b119, b120, b121, b122, b123, b124, b125, b126, b127, b128, b129, b130, b131, b132, b133, b134, b135, b136, b137, b138, b139, b140, b141, b142, b143, b144, b145, b146, b147, b148, b149, b150, b151, b152, b153, b154, b155, b156, b157, b158, b159, b160, b201, b202, b203, b204, b205, b206, b207, b208, b209, b210, b211, b212, b213, b214, b215, b216, b217, b218, b219, b220, b221, b222, b223, b224, b225, b226, b227, b228, b229, b230, b231, b232, b233, b234, b235, b236, b237, b238, b239, b240, b241, b242, b243, b244, b245, b246, b247, b248, b249, b250, b251, b252, b253, b254, b255, b256, b257, b258, b259, b260, c101, c102, c103, c104, c105, c106, c107, c108, c109, c110, c111, c112, c113, c114, c115, c116, c117, c118, c119, c120, c121, c122, c123, c124]
  .map((unit) =>
    withContent({
      ...unit,
      words: unit.words.map((word) => {
        const extra = extraExamples[word.id]
        return {
          ...word,
          examples: extra ? [...word.examples, extra] : word.examples,
          photo: photos[word.id] ?? word.photo,
        }
      }),
    }),
  )
  .sort((a, b) => a.order - b.order)

export function getUnit(id: string): Unit | undefined {
  return units.find((unit) => unit.id === id)
}

export function levelNumber(unit: Unit): number {
  const levelUnits = units.filter((item) => item.level === unit.level)
  return levelUnits.findIndex((item) => item.id === unit.id) + 1
}

export function nextUnits(doneIds: Set<string>, count: number): Unit[] {
  return units.filter((unit) => !doneIds.has(unit.id)).slice(0, count)
}

export function allWords(): Word[] {
  return units.flatMap((unit) => unit.words)
}

export function wordsOfUnit(unit: Unit): Word[] {
  return unit.words
}

export * from './types'
export * from './levels'
