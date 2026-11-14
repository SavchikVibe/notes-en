import type { Level, ReadQuestion } from '../types'

export interface StudioReading {
  title: string
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
  lines: StudioListeningLine[]
  notes: StudioNote[]
  questions: ReadQuestion[]
  transcript: string[]
}

export interface StudioWriting {
  prompt: string
  minWords: number
  maxWords: number
  checklist: string[]
  modelAnswer: string
  usefulLanguage: string[]
}

export interface StudioSpeaking {
  prompt: string
  preparationSeconds: number
  speakingSeconds: number
  checklist: string[]
}

export interface StudioTask {
  id: string
  level: Level
  title: string
  subtitle: string
  goal: string
  reading: StudioReading
  listening: StudioListening
  writing: StudioWriting
  speaking: StudioSpeaking
}
