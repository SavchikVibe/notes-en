let cachedVoice: SpeechSynthesisVoice | null = null

const VOICE_KEY = 'speech:voice'

export function getUsVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return []
  return window.speechSynthesis
    .getVoices()
    .filter((voice) => /^en[-_]us/i.test(voice.lang))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getSelectedVoiceName(): string {
  try {
    return localStorage.getItem(VOICE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setSelectedVoiceName(name: string): void {
  try {
    if (name) localStorage.setItem(VOICE_KEY, name)
    else localStorage.removeItem(VOICE_KEY)
  } catch {
    // Приватный режим: выбор не сохранится, но озвучка продолжит работать.
  }
  cachedVoice = null
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  if (cachedVoice && voices.includes(cachedVoice)) return cachedVoice

  const selectedName = getSelectedVoiceName()
  if (selectedName) {
    const selected = voices.find((voice) => voice.name === selectedName)
    if (selected) {
      cachedVoice = selected
      return selected
    }
  }

  // Курс американский: не подменяем en-US британским или другим английским молча.
  const american = voices.filter((voice) => /^en[-_]us/i.test(voice.lang))
  cachedVoice =
    american.find((voice) => /google|samantha|natural|aria|jenny/i.test(voice.name)) ??
    american[0] ??
    null
  return cachedVoice
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function primeVoices(): void {
  if (!speechSupported()) return
  pickVoice()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = null
    pickVoice()
  })
}

export function speak(text: string, rate = 0.92, onEnd?: () => void): void {
  if (!speechSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  if (onEnd) utterance.onend = () => onEnd()
  window.speechSynthesis.speak(utterance)
}

export interface SpeechLine {
  text: string
  /** 0.85–0.95 — ниже голос, 1.05–1.15 — выше. */
  pitch?: number
  rate?: number
}

/** Читает реплики подряд, не обрывая предыдущую. Для диалогов в студии. */
export function speakSequence(lines: SpeechLine[], onEnd?: () => void): void {
  if (!speechSupported()) return
  window.speechSynthesis.cancel()
  let index = 0

  const next = () => {
    if (index >= lines.length) {
      onEnd?.()
      return
    }
    const line = lines[index]
    index += 1
    if (!line.text.trim()) {
      next()
      return
    }
    const utterance = new SpeechSynthesisUtterance(line.text)
    utterance.lang = 'en-US'
    utterance.rate = line.rate ?? 0.92
    // Сильный сдвиг pitch на системном голосе звучит неестественно.
    utterance.pitch = Math.min(1.06, Math.max(0.94, line.pitch ?? 1))
    const voice = pickVoice()
    if (voice) utterance.voice = voice
    utterance.onend = next
    window.speechSynthesis.speak(utterance)
  }

  next()
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel()
}
