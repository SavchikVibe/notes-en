import type { Unit, Word } from './types'
import { a101 } from './units/a1-01'

export const units: Unit[] = [a101].sort((a, b) => a.order - b.order)

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
