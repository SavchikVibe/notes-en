import type { Level, ReadQuestion } from '../types'

export interface StudioReading {
  title: string
  /** Подсказка перед вопросами; для A1 не нужно объяснять Not Given. */
  hint?: string
  paragraphs: string[]
  questions: ReadQuestion[]
}

export interface StudioListeningLine {
  speaker: string
  text: string
  /** Разный pitch создаёт ощущение двух голосов на одном en-US голосе. */
  pitch: number
  rate?: number
}

export interface StudioNote {
  before: string
  after: string
  answer: string
  /** Допустимые варианты: «20» и «twenty», «March 12» и «March 12th». */
  accept?: string[]
}

export interface StudioListening {
  title: string
  /** Короткое описание ситуации; для A1 — кафе, для B1 — office hours. */
  intro?: string
  /** Путь относительно base, например 'audio/studio-a1-01.mp3'. */
  audio?: string
  lines: StudioListeningLine[]
  notes: StudioNote[]
  questions: ReadQuestion[]
  transcript: string[]
}

export interface StudioWriting {
  title?: string
  prompt: string
  minWords: number
  maxWords: number
  checklist: string[]
  modelAnswer: string
  usefulLanguage: string[]
}

export interface StudioSpeaking {
  title?: string
  prompt: string
  preparationSeconds: number
  speakingSeconds: number
  checklist: string[]
}

export interface StudioTask {
  id: string
  level: Level
  /** project — задача-проект (C1): та же студия, но с ролью итоговой работы. */
  kind?: 'studio' | 'project'
  title: string
  subtitle: string
  goal: string
  estimatedMinutes: number
  reading: StudioReading
  listening: StudioListening
  writing: StudioWriting
  speaking: StudioSpeaking
}
