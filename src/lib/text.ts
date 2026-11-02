export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchesAny(value: string, accepted: string[]): boolean {
  const normalized = normalizeAnswer(value)
  if (!normalized) return false
  return accepted.some((item) => normalizeAnswer(item) === normalized)
}

export function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[.!?,;:]+$/g, '').trim()
}
