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

/** Ищет пример, в котором можно спрятать слово, и подходящий шаблон. */
function findPattern(word: Word): { example: Word['examples'][number]; pattern: RegExp } {
  const exact = new RegExp(`\\b${escapeRegExp(word.term)}\\b`, 'i')
  const exactExample = word.examples.find((example) => exact.test(example.en))
  if (exactExample) return { example: exactExample, pattern: exact }

  const stem = word.term.split(' ')[0].replace(/(e|y|ing|ed|s)$/i, '')
  const stemPattern = new RegExp(`\\b${escapeRegExp(stem)}\\w*\\b`, 'i')
  const stemExample = word.examples.find((example) => stemPattern.test(example.en))
  if (stemExample) return { example: stemExample, pattern: stemPattern }

  return {
    example: word.examples[word.examples.length - 1] ?? word.examples[0],
    pattern: exact,
  }
}

/** Пропуск в примере слова: сначала точная форма, затем основа. */
export function buildCloze(word: Word, pool: Word[]): Cloze {
  const { example, pattern } = findPattern(word)
  const sentence = pattern.test(example.en)
    ? example.en.replace(pattern, '____')
    : `${example.en} — ____`

  const candidates = pool.filter((item) => item.id !== word.id && item.term !== word.term)
  const samePos = candidates.filter((item) => item.pos === word.pos)
  const sameLevel = samePos.filter((item) => item.level === word.level)
  const preferred =
    sameLevel.length >= 3 ? sameLevel : samePos.length >= 3 ? samePos : candidates
  const distractors = shuffle(preferred)
    .slice(0, 3)
    .map((item) => item.term)

  return {
    sentence,
    translation: example.ru,
    options: shuffle([word.term, ...distractors]),
    answer: word.term,
  }
}
