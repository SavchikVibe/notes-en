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

function pickDictation(unit: Unit) {
  return unit.words
    .flatMap((word) => word.examples)
    .filter((example) => {
      const count = example.en.split(/\s+/).length
      return count >= 3 && count <= 6
    })
    .sort((a, b) => a.en.length - b.en.length)[0]
}

function withContent(unit: Unit): Unit {
  const read = unit.exercises.filter((exercise) => exercise.kind === 'read')
  const base = unit.exercises.filter((exercise) => exercise.kind !== 'read')
  const extra = extraExercises[unit.id] ?? []
  const derived: Exercise[] = []

  const dictation = pickDictation(unit)
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

  return { ...unit, exercises: [...base, ...extra, ...derived, ...read] }
}

export const units: Unit[] = [a101, a102, a103, a104, a105, a106, a107, a108, a109, a110, a111, a112, a113, a114, a115, a116, a117, a118, a119, a120, a121, a122, a123, a124, a125, a126, a127, a128, a129, a130, a131, a132, a133, a134, a135, a136, a137, a138, a139, a140, a201, a202, a203, a204, a205, a206, a207, a208, a209, a210, a211, a212, a213, a214, a215, a216, a217, a218, a219, a220, a221, a222, a223, a224, a225, a226, a227, a228, a229, a230, a231, a232, a233, a234, a235, a236, a237, a238, a239, a240, a241, a242, a243, a244, a245, a246, a247, a248, a249, a250, b101, b102, b103, b104, b105, b106, b107, b108, b109, b110, b111, b112, b113, b114, b115, b116, b117, b118, b119, b120, b121, b122, b123, b124, b125, b126, b127, b128, b129, b130]
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
