import { units } from '../src/content/index'

let failures = 0
let simple = 0

for (const unit of units) {
  if (unit.level !== 'B2') continue
  for (const exercise of unit.exercises) {
    if (exercise.kind !== 'choice') continue
    const options = exercise.options.map((option) => option.trim().toLowerCase())
    const badModal = options.some((option) =>
      /^(can|may|must|should|might|will|would) to$/.test(option) ||
      /^is (can|may|must|should|might|will|would)$/.test(option),
    )
    if (badModal) {
      console.log(`FAIL: модальная ловушка в ${unit.id}/${exercise.id}: ${exercise.options.join(' / ')}`)
      failures += 1
    }
    const words = exercise.question.split(/\s+/).filter(Boolean).length
    const elementary = options.every((option) => option.split(/\s+/).length <= 2)
    if (elementary && words <= 7) simple += 1
  }
}

console.log(`Простых choice в B2 (информационно): ${simple}.`)
console.log(`Проверок B2-грамматики не пройдено: ${failures}.`)
if (failures > 0) process.exitCode = 1
