import type { Unit, Word } from './types'
import { extraExamples } from './extra-examples'
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

export const units: Unit[] = [a101, a102, a103, a104, a105, a106, a107, a108, a109, a110]
  .map((unit) => ({
    ...unit,
    words: unit.words.map((word) => {
      const extra = extraExamples[word.id]
      return extra ? { ...word, examples: [...word.examples, extra] } : word
    }),
  }))
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
