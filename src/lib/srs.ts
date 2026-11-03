import type { Word } from '@/content'

export interface Cloze {
  sentence: string
  translation: string
  options: string[]
  answer: string
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

/** Пропуск в последнем (третьем) примере слова: он всегда содержит точную форму. */
export function buildCloze(word: Word, pool: Word[]): Cloze {
  const example = word.examples[word.examples.length - 1] ?? word.examples[0]
  const pattern = new RegExp(`\\b${escapeRegExp(word.term)}\\b`, 'i')
  const sentence = pattern.test(example.en)
    ? example.en.replace(pattern, '____')
    : `${example.en} — ____`

  const distractors = shuffle(
    pool.filter((item) => item.id !== word.id && item.term !== word.term),
  )
    .slice(0, 3)
    .map((item) => item.term)

  return {
    sentence,
    translation: example.ru,
    options: shuffle([word.term, ...distractors]),
    answer: word.term,
  }
}
