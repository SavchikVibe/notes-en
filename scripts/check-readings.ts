import { readings } from '../src/content/readings'

const ordinals: Record<string, number> = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
  fifth: 4,
  sixth: 5,
  seventh: 6,
  eighth: 7,
  ninth: 8,
  tenth: 9,
}

/** Целевой объём текста библиотеки по уровню (слов). */
const TARGET_WORDS: Record<string, [number, number]> = {
  A1: [100, 200],
  A2: [200, 300],
  B1: [300, 600],
  B2: [700, 900],
  C1: [900, 1200],
}

let headingProblems = 0
let looseEvidence = 0
const outsideTarget: string[] = []

for (const reading of readings) {
  const text = reading.paragraphs.join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  const target = TARGET_WORDS[reading.level]
  if (target && (words < target[0] || words > target[1])) {
    outsideTarget.push(`${reading.id} (${reading.level}): ${words} слов, цель ${target[0]}–${target[1]}`)
  }
  for (const question of reading.questions) {
    if (question.type === 'heading') {
      const match = question.question.match(
        /(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)/,
      )
      if (!match) {
        console.log(`heading без номера абзаца: ${reading.id} — ${question.question}`)
        headingProblems += 1
        continue
      }
      const paragraph = reading.paragraphs[ordinals[match[1]]] ?? ''
      if (!question.evidence || !paragraph.includes(question.evidence)) {
        console.log(`heading указывает не на тот абзац: ${reading.id} — ${match[1]}`)
        headingProblems += 1
      }
    }
    if (
      question.evidence &&
      !question.evidence.includes('...') &&
      !text.includes(question.evidence)
    ) {
      looseEvidence += 1
    }
  }
}

console.log(`Текстов: ${readings.length}.`)
console.log(`Ошибок в вопросах-заголовках: ${headingProblems}.`)
console.log(`Цитат, которых нет в тексте дословно: ${looseEvidence}.`)
console.log(`Текстов вне целевого объёма: ${outsideTarget.length}.`)
for (const line of outsideTarget) console.log(`  • ${line}`)

if (headingProblems > 0) process.exitCode = 1
