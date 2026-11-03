let cachedVoice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  if (cachedVoice && voices.includes(cachedVoice)) return cachedVoice
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'))
  cachedVoice =
    english.find((voice) => /en-US/i.test(voice.lang) && /google|samantha|natural/i.test(voice.name)) ??
    english.find((voice) => /en-US/i.test(voice.lang)) ??
    english[0] ??
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

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel()
}
