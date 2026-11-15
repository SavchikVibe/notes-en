const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bi'm\b/g, 'i am'],
  [/\bi've\b/g, 'i have'],
  [/\bi'll\b/g, 'i will'],
  [/\bi'd\b/g, 'i would'],
  [/\byou're\b/g, 'you are'],
  [/\byou've\b/g, 'you have'],
  [/\byou'll\b/g, 'you will'],
  [/\byou'd\b/g, 'you would'],
  [/\bhe's\b/g, 'he is'],
  [/\bshe's\b/g, 'she is'],
  [/\bit's\b/g, 'it is'],
  [/\bwe're\b/g, 'we are'],
  [/\bwe've\b/g, 'we have'],
  [/\bwe'll\b/g, 'we will'],
  [/\bwe'd\b/g, 'we would'],
  [/\bthey're\b/g, 'they are'],
  [/\bthey've\b/g, 'they have'],
  [/\bthey'll\b/g, 'they will'],
  [/\bthey'd\b/g, 'they would'],
  [/\bthat's\b/g, 'that is'],
  [/\bthere's\b/g, 'there is'],
  [/\bhere's\b/g, 'here is'],
  [/\bwhat's\b/g, 'what is'],
  [/\bwho's\b/g, 'who is'],
  [/\bwhere's\b/g, 'where is'],
  [/\bhow's\b/g, 'how is'],
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
  [/\blet's\b/g, 'let us'],
]

/**
 * Приводит сокращения к полной форме, чтобы «I'm» и «I am» считались
 * одним ответом. Это снижает риск ложной ошибки в переводе.
 */
export function normalizeAnswer(value: string): string {
  let text = value
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,!?;:]/g, (match, offset, source) => {
      // Десятичная точка между цифрами значима, остальная пунктуация — нет.
      if (match === '.' && /\d/.test(source[offset - 1] ?? '') && /\d/.test(source[offset + 1] ?? '')) {
        return match
      }
      return ''
    })
    .replace(/\s+/g, ' ')
    .trim()

  for (const [pattern, replacement] of CONTRACTIONS) {
    text = text.replace(pattern, replacement)
  }

  return text.replace(/\s+/g, ' ').trim()
}

export function matchesAny(value: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(value)
  if (!normalized) return false
  return accepted.some((item) => normalizeAnswer(item) === normalized)
}

export function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[.!?,;:]+$/g, '').trim()
}
