import { units } from '../src/content/index'
import { acceptVariants } from '../src/content/accept-variants'

let failures = 0

const translateIds = new Set<string>()
for (const unit of units) {
  for (const exercise of unit.exercises) {
    if (exercise.kind === 'translate') translateIds.add(exercise.id)
  }
}

for (const [id, variants] of Object.entries(acceptVariants)) {
  if (!translateIds.has(id)) {
    console.log(`FAIL: вариант для неизвестного перевода ${id}`)
    failures += 1
  }
  if (!Array.isArray(variants) || variants.length === 0) {
    console.log(`FAIL: пустой список вариантов ${id}`)
    failures += 1
  }
}

for (const level of ['A1', 'A2', 'B1', 'B2', 'C1'] as const) {
  let total = 0
  let multi = 0
  for (const unit of units) {
    if (unit.level !== level) continue
    for (const exercise of unit.exercises) {
      if (exercise.kind !== 'translate') continue
      total += 1
      if (exercise.accept.length > 1) multi += 1
    }
  }
  console.log(`${level}: ${multi}/${total} переводов с вариантами`)
}

console.log(`Ошибок в карте вариантов: ${failures}.`)
if (failures > 0) process.exitCode = 1
