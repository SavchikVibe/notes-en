import { a1Studio01 } from './a1-01'
import { b1Studio01 } from './b1-01'
import type { StudioTask } from './types'

export const studioTasks: StudioTask[] = [a1Studio01, b1Studio01]

export function getStudioTask(id: string): StudioTask | undefined {
  return studioTasks.find((task) => task.id === id)
}

export * from './types'
