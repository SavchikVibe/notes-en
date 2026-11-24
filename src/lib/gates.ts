import type { Level } from '@/content'
import type { StudioTask } from '@/content/studio'
import { levelGates, type LevelGate } from '@/content/gates'

export const LEVEL_ORDER: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export interface LevelGateState {
  passed: boolean
  at: number
  studio: boolean
  texts: string[]
  writing: boolean
  speaking: 'recorded' | 'skipped'
}

export function gateKey(level: Level): string {
  return `gate:${level}`
}

export function getGate(level: Level): LevelGate | undefined {
  return levelGates.find((gate) => gate.level === level)
}

export function previousLevel(level: Level): Level | null {
  const index = LEVEL_ORDER.indexOf(level)
  return index > 0 ? LEVEL_ORDER[index - 1] : null
}

export function nextLevel(level: Level): Level | null {
  const index = LEVEL_ORDER.indexOf(level)
  return index >= 0 && index < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[index + 1] : null
}

/** Уровень открыт, если проверка предыдущего уровня пройдена. */
export function isLevelUnlocked(
  level: Level,
  states: Record<string, LevelGateState | undefined>,
): boolean {
  const previous = previousLevel(level)
  return !previous || states[previous]?.passed === true
}

/** Минимальная Studio-задача для экрана речи: используется только speaking. */
export function gateTask(gate: LevelGate): StudioTask {
  return {
    id: `gate-${gate.level}`,
    level: gate.level,
    title: `Проверка уровня ${gate.level}`,
    subtitle: '',
    goal: '',
    estimatedMinutes: 10,
    reading: { title: '', paragraphs: [], questions: [] },
    listening: { title: '', lines: [], notes: [], questions: [], transcript: [] },
    writing: {
      title: 'Письмо для проверки',
      prompt: gate.writingPrompt,
      minWords: gate.writingMinWords,
      maxWords: gate.writingMinWords + 80,
      checklist: gate.writingChecklist,
      modelAnswer: '',
      usefulLanguage: [],
    },
    speaking: {
      title: 'Устная часть проверки',
      prompt: gate.speakingPrompt,
      preparationSeconds: 30,
      speakingSeconds: gate.speakingSeconds,
      checklist: gate.speakingChecklist,
    },
  }
}
