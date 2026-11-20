import { a1Studio01 } from './a1-01'
import { a1Studio02 } from './a1-02'
import { a1Studio03 } from './a1-03'
import { a1Studio04 } from './a1-04'
import { a2Studio01 } from './a2-01'
import { a2Studio02 } from './a2-02'
import { a2Studio03 } from './a2-03'
import { a2Studio04 } from './a2-04'
import { a2Studio05 } from './a2-05'
import { b1Studio01 } from './b1-01'
import { b1Studio02 } from './b1-02'
import { b1Studio03 } from './b1-03'
import { b1Studio04 } from './b1-04'
import { b1Studio05 } from './b1-05'
import { b1Studio06 } from './b1-06'
import { b2Studio01 } from './b2-01'
import { b2Studio02 } from './b2-02'
import { b2Studio03 } from './b2-03'
import { b2Studio04 } from './b2-04'
import { b2Studio05 } from './b2-05'
import { b2Studio06 } from './b2-06'
import { c1Studio01 } from './c1-01'
import { c1Studio02 } from './c1-02'
import { c1Studio03 } from './c1-03'
import { c1Studio04 } from './c1-04'
import { c1Studio05 } from './c1-05'
import { c1Studio06 } from './c1-06'
import { c1Studio07 } from './c1-07'
import { c1Studio08 } from './c1-08'
import type { StudioTask } from './types'

export const studioTasks: StudioTask[] = [
  a1Studio01,
  a1Studio02,
  a1Studio03,
  a1Studio04,
  a2Studio01,
  a2Studio02,
  a2Studio03,
  a2Studio04,
  a2Studio05,
  b1Studio01,
  b1Studio02,
  b1Studio03,
  b1Studio04,
  b1Studio05,
  b1Studio06,
  b2Studio01,
  b2Studio02,
  b2Studio03,
  b2Studio04,
  b2Studio05,
  b2Studio06,
  c1Studio01,
  c1Studio02,
  c1Studio03,
  c1Studio04,
  c1Studio05,
  c1Studio06,
  c1Studio07,
  c1Studio08,
]

export function getStudioTask(id: string): StudioTask | undefined {
  return studioTasks.find((task) => task.id === id)
}

export * from './types'
