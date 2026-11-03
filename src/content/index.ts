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

export const units: Unit[] = [a101, a102, a103, a104, a105, a106, a107, a108, a109, a110, a111, a112, a113, a114, a115, a116, a117, a118, a119, a120, a121, a122, a123, a124, a125, a126, a127, a128, a129, a130, a131, a132, a133, a134, a135, a136, a137, a138, a139, a140]
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
