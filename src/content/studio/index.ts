import { a1Studio01 } from './a1-01'
import { a1Studio02 } from './a1-02'
import { a1Studio03 } from './a1-03'
import { a1Studio04 } from './a1-04'
import { a2Studio01 } from './a2-01'
import { b1Studio01 } from './b1-01'
import type { StudioTask } from './types'

export const studioTasks: StudioTask[] = [
  a1Studio01,
  a1Studio02,
  a1Studio03,
  a1Studio04,
  a2Studio01,
  b1Studio01,
]

export function getStudioTask(id: string): StudioTask | undefined {
  return studioTasks.find((task) => task.id === id)
}

export * from './types'
