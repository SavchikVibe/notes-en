import { units } from '../src/content/index.ts'
import { shuffleOptions } from '../src/lib/options.ts'
import type { Exercise } from '../src/content/types.ts'

const choiceAnswers = new Map<number, number>()
const listenAnswers = new Map<number, number>()
const readAnswers = new Map<number, number>()
let choiceTotal = 0
let listenChoiceTotal = 0
let readQuestionTotal = 0
let unitsWithAllZero = 0
let unitsWithChoice = 0
const assembleNoDistractors: string[] = []
const translateSingleAccept: string[] = []
const readLengths: Record<string, number[]> = {}
const duplicateSentences: string[] = []
let shuffleErrors = 0
const byLevel = new Map<string, { assemble: number; assembleWeak: number; translate: number; translateWeak: number }>()

function bump(map: Map<number, number>, key: number) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

for (const unit of units) {
  let unitChoiceCount = 0
  let unitChoiceZero = 0

  const unitSentences = new Map<string, string>()
  const remember = (sentence: string, source: string) => {
    const key = sentence.toLowerCase().replace(/\s+/g, ' ').trim()
    if (!key) return
    const previous = unitSentences.get(key)
    if (previous && previous !== source) duplicateSentences.push(`${unit.id}: ${previous} = ${source}`)
    else unitSentences.set(key, source)
  }

  for (const exercise of unit.exercises as Exercise[]) {
    if (exercise.kind === 'choice') {
      choiceTotal += 1
      unitChoiceCount += 1
      bump(choiceAnswers, exercise.answer)
      if (exercise.answer === 0) unitChoiceZero += 1
      const shuffled = shuffleOptions(exercise.options, exercise.answer, exercise.id)
      if (shuffled.options[shuffled.answer] !== exercise.options[exercise.answer]) shuffleErrors += 1
    }
    if (exercise.kind === 'listen' && exercise.mode === 'choice') {
      listenChoiceTotal += 1
      bump(listenAnswers, Number(exercise.answer))
      const shuffled = shuffleOptions(
        exercise.options ?? [],
        Number(exercise.answer),
        exercise.id,
      )
      if (shuffled.options[shuffled.answer] !== exercise.options?.[Number(exercise.answer)]) {
        shuffleErrors += 1
      }
    }
    if (exercise.kind === 'read') {
      const words = exercise.paragraphs.join(' ').split(/\s+/).length
      ;(readLengths[unit.level] ??= []).push(words)
      exercise.questions.forEach((question, questionIndex) => {
        readQuestionTotal += 1
        bump(readAnswers, question.answer)
        const shuffled = shuffleOptions(
          question.options,
          question.answer,
          `${exercise.id}-q${questionIndex}`,
        )
        if (shuffled.options[shuffled.answer] !== question.options[question.answer]) {
          shuffleErrors += 1
        }
      })
      for (const paragraph of exercise.paragraphs) remember(paragraph, `${exercise.id} paragraph`)
    }
    const levelStats = byLevel.get(unit.level) ?? { assemble: 0, assembleWeak: 0, translate: 0, translateWeak: 0 }
    byLevel.set(unit.level, levelStats)
    if (exercise.kind === 'assemble') {
      const extras = exercise.words.length - exercise.answer.length
      levelStats.assemble += 1
      if (extras < 2) {
        levelStats.assembleWeak += 1
        assembleNoDistractors.push(`${exercise.id} (+${extras})`)
      }
      remember(exercise.answer.join(' '), `${exercise.id} answer`)
    }
    if (exercise.kind === 'translate') {
      levelStats.translate += 1
      if (exercise.accept.length < 2) {
        levelStats.translateWeak += 1
        translateSingleAccept.push(exercise.id)
      }
      remember(exercise.sample, `${exercise.id} sample`)
    }
    if (exercise.kind === 'listen') remember(exercise.audio, `${exercise.id} audio`)
  }

  if (unitChoiceCount > 0) {
    unitsWithChoice += 1
    if (unitChoiceZero === unitChoiceCount) unitsWithAllZero += 1
  }

  for (const word of unit.words) {
    for (const example of word.examples) remember(example.en, `${unit.id} word:${word.id}`)
  }
}

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0

console.log('choice answers:', Object.fromEntries([...choiceAnswers].sort((a, b) => a[0] - b[0])))
console.log('listen(choice) answers:', Object.fromEntries([...listenAnswers].sort((a, b) => a[0] - b[0])))
console.log('read question answers:', Object.fromEntries([...readAnswers].sort((a, b) => a[0] - b[0])))
console.log('totals:', { choiceTotal, listenChoiceTotal, readQuestionTotal })
console.log('units with all choice answers = 0:', unitsWithAllZero, '/', unitsWithChoice)
console.log('assemble with <2 distractors:', assembleNoDistractors.length)
console.log('  first 15:', assembleNoDistractors.slice(0, 15))
console.log('translate with <2 accepted variants:', translateSingleAccept.length)
console.log('  first 15:', translateSingleAccept.slice(0, 15))
console.log('read paragraph words by level:', Object.fromEntries(Object.entries(readLengths).map(([level, values]) => [level, { min: Math.min(...values), max: Math.max(...values), avg: average(values), count: values.length }])))
console.log('duplicate sentences inside units:', duplicateSentences.length)
console.log('  first 10:', duplicateSentences.slice(0, 10))
console.log('by level:', Object.fromEntries(byLevel))
console.log('shuffle mapping errors:', shuffleErrors)
