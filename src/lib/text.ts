const CURLY_APOSTROPHES = /[’‘`´]/g
const DOUBLE_QUOTES = /["“”«»]/g

/** Убирает кавычки-обёртки, не трогая апострофы внутри слов (don't). */
function stripQuoteMarks(value: string): string {
  return value
    .replace(CURLY_APOSTROPHES, "'")
    .replace(DOUBLE_QUOTES, '')
    .replace(/(^|[\s([{])['‘’]/g, '$1')
    .replace(/['‘’](?=$|[\s)\]},.!?;:])/g, '')
}

function baseNormalize(value: string): string {
  let text = stripQuoteMarks(value)
    .toLowerCase()
    .replace(/[.,!?;:]/g, (match, offset, source) => {
      // Десятичная точка между цифрами значима, остальная пунктуация — нет.
      if (
        match === '.' &&
        /\d/.test(source[offset - 1] ?? '') &&
        /\d/.test(source[offset + 1] ?? '')
      ) {
        return match
      }
      return ''
    })
    .replace(/\s+/g, ' ')
    .trim()

  // Однозначные сокращения раскрываются сразу, чтобы не плодить варианты.
  const fixed: Array<[RegExp, string]> = [
    [/\blet's\b/g, 'let us'],
    [/\bdon't\b/g, 'do not'],
    [/\bdoesn't\b/g, 'does not'],
    [/\bdidn't\b/g, 'did not'],
    [/\bisn't\b/g, 'is not'],
    [/\baren't\b/g, 'are not'],
    [/\bwasn't\b/g, 'was not'],
    [/\bweren't\b/g, 'were not'],
    [/\bhaven't\b/g, 'have not'],
    [/\bhasn't\b/g, 'has not'],
    [/\bhadn't\b/g, 'had not'],
    [/\bcan't\b/g, 'can not'],
    [/\bcannot\b/g, 'can not'],
    [/\bcouldn't\b/g, 'could not'],
    [/\bshouldn't\b/g, 'should not'],
    [/\bwouldn't\b/g, 'would not'],
    [/\bwon't\b/g, 'will not'],
    [/\bmustn't\b/g, 'must not'],
    [/\b(\w+)'m\b/g, '$1 am'],
    [/\b(\w+)'re\b/g, '$1 are'],
    [/\b(\w+)'ve\b/g, '$1 have'],
    [/\b(\w+)'ll\b/g, '$1 will'],
  ]
  for (const [pattern, replacement] of fixed) {
    text = text.replace(pattern, replacement)
  }
  return text.replace(/\s+/g, ' ').trim()
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

/**
 * Все допустимые раскрытия ответа. Для 's и 'd их два: is/has и would/had.
 * Это важно для «She's been busy» (= she has been) и «He'd gone» (= he had gone).
 */
export function normalizeVariants(value: string): string[] {
  const base = baseNormalize(value)
  if (!base) return ['']

  let variants = [base]
  if (base.includes("'s")) {
    const next: string[] = []
    for (const variant of variants) {
      next.push(variant.replace(/'s\b/g, ' is'), variant.replace(/'s\b/g, ' has'))
    }
    variants = next
  }
  if (base.includes("'d")) {
    const next: string[] = []
    for (const variant of variants) {
      next.push(variant.replace(/'d\b/g, ' would'), variant.replace(/'d\b/g, ' had'))
    }
    variants = next
  }

  return unique(variants.map((variant) => variant.replace(/\s+/g, ' ').trim())).slice(0, 16)
}

/**
 * Канонический вид ответа. Для сравнения используйте answersMatch или matchesAny:
 * у 's и 'd есть два законных раскрытия, и одна строка их не покрывает.
 */
export function normalizeAnswer(value: string): string {
  return normalizeVariants(value)[0] ?? ''
}

/** Сравнивает два ответа с учётом всех раскрытий сокращений. */
export function answersMatch(value: string, expected: string): boolean {
  const left = new Set(normalizeVariants(value))
  return normalizeVariants(expected).some((variant) => left.has(variant))
}

export function matchesAny(value: string, accepted: string[]): boolean {
  const normalized = new Set(normalizeVariants(value))
  if (normalized.size === 0 || (normalized.size === 1 && normalized.has(''))) return false
  return accepted.some((item) =>
    normalizeVariants(item).some((variant) => normalized.has(variant)),
  )
}

export function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[.!?,;:]+$/g, '').trim()
}
