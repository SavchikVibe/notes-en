function hash(value: string) {
  let result = 0
  for (const char of value) result = (result * 31 + char.charCodeAt(0)) % 100000
  return result
}

/** Детерминированная перестановка: один и тот же seed даёт один и тот же порядок. */
export function shuffle<T>(items: T[], seedText: string): T[] {
  let seed = hash(seedText) || 1
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    const swap = seed % (index + 1)
    const temp = result[index]
    result[index] = result[swap]
    result[swap] = temp
  }
  return result
}

export interface ShuffledOptions {
  options: string[]
  answer: number
}

/**
 * Перемешивает варианты ответа и пересчитывает индекс правильного.
 * Исходный порядок в контенте не важен: правильный ответ не должен стоять первым.
 */
export function shuffleOptions(options: string[], answer: number, seed: string): ShuffledOptions {
  const items = options.map((text, index) => ({ text, index }))
  const shuffled = shuffle(items, seed)
  return {
    options: shuffled.map((item) => item.text),
    answer: shuffled.findIndex((item) => item.index === answer),
  }
}
