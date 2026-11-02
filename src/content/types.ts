export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export interface Example {
  en: string
  ru: string
}

export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'pron' | 'conj' | 'phr'

export interface Word {
  id: string
  term: string
  ipa: string
  translation: string
  pos?: PartOfSpeech
  level: Level
  examples: Example[]
  /** '/photos/student.webp' — только для конкретных слов */
  photo?: string
  tags?: string[]
}

export interface Formula {
  label: string
  pattern: string
  note?: string
}

interface ExerciseBase {
  id: string
  explanation?: string
}

export interface ChoiceExercise extends ExerciseBase {
  kind: 'choice'
  question: string
  options: string[]
  answer: number
}

export interface AssembleExercise extends ExerciseBase {
  kind: 'assemble'
  task?: string
  translation: string
  words: string[]
  answer: string[]
}

export interface TranslateExercise extends ExerciseBase {
  kind: 'translate'
  source: string
  accept: string[]
  sample: string
}

export interface ListenExercise extends ExerciseBase {
  kind: 'listen'
  audio: string
  question: string
  mode: 'choice' | 'type'
  options?: string[]
  answer: number | string
  translation?: string
}

export interface SpeakExercise extends ExerciseBase {
  kind: 'speak'
  phrase: string
  translation: string
}

export interface ReadQuestion {
  question: string
  options: string[]
  answer: number
}

export interface ReadExercise extends ExerciseBase {
  kind: 'read'
  title: string
  paragraphs: string[]
  questions: ReadQuestion[]
}

export type Exercise =
  | ChoiceExercise
  | AssembleExercise
  | TranslateExercise
  | ListenExercise
  | SpeakExercise
  | ReadExercise

export interface Unit {
  id: string
  level: Level
  order: number
  title: string
  subtitle?: string
  goal: string
  formulas: Formula[]
  words: Word[]
  exercises: Exercise[]
}
