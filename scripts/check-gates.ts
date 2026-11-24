import { levelGates } from '../src/content/gates'
import { units } from '../src/content/index'
import { readings } from '../src/content/readings'
import { studioTasks } from '../src/content/studio'
import { LEVEL_ORDER } from '../src/lib/gates'

let failures = 0

for (const gate of levelGates) {
  const levelIndex = LEVEL_ORDER.indexOf(gate.level)
  if (levelIndex === -1) {
    console.log(`FAIL: неизвестный уровень ${gate.level}`)
    failures += 1
  }
  if (gate.nextLevel !== LEVEL_ORDER[levelIndex + 1]) {
    console.log(`FAIL: ${gate.level} → ${gate.nextLevel} нарушает порядок`)
    failures += 1
  }

  const studio = studioTasks.find((task) => task.id === gate.studioId)
  if (!studio || studio.level !== gate.level) {
    console.log(`FAIL: студия ${gate.studioId} не найдена или не ${gate.level}`)
    failures += 1
  }

  for (const id of gate.textIds) {
    const reading = readings.find((item) => item.id === id)
    if (!reading || reading.level !== gate.level) {
      console.log(`FAIL: текст ${id} не найден или не ${gate.level}`)
      failures += 1
    }
  }

  if (!gate.writingPrompt.trim() || gate.writingMinWords < 20) {
    console.log(`FAIL: письмо ${gate.level} пустое или слишком короткое`)
    failures += 1
  }
  if (!gate.speakingPrompt.trim() || gate.speakingSeconds < 30) {
    console.log(`FAIL: речь ${gate.level} пустая или слишком короткая`)
    failures += 1
  }
  if (gate.writingChecklist.length < 2 || gate.speakingChecklist.length < 2) {
    console.log(`FAIL: чек-лист ${gate.level} слишком короткий`)
    failures += 1
  }

  const levelUnits = units.filter((unit) => unit.level === gate.level)
  if (levelUnits.length === 0) {
    console.log(`FAIL: у ${gate.level} нет уроков`)
    failures += 1
  }
}

console.log(`Проверок гейтов не пройдено: ${failures}.`)
if (failures > 0) process.exitCode = 1
