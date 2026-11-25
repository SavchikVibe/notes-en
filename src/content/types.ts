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
  /** Необязательное упражнение мастерской: не входит в счёт урока. */
  optional?: boolean
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
  /** B1+: английский текст скрыт до первой записи. */
  blind?: boolean
}

export interface ReadQuestion {
  question: string
  options: string[]
  answer: number
  /** mcq — обычный выбор; tfng — True/False/Not Given; heading — подбор заголовка. */
  type?: 'mcq' | 'tfng' | 'heading'
  /** Цитата из текста, которая доказывает ответ. Показывается после проверки. */
  evidence?: string
}

export interface ReadExercise extends ExerciseBase {
  kind: 'read'
  title: string
  paragraphs: string[]
  questions: ReadQuestion[]
}

export interface WriteExercise extends ExerciseBase {
  kind: 'write'
  prompt: string
  minWords: number
  maxWords?: number
  /** Конкретные критерии самопроверки, а не общие слова. */
  checklist: string[]
  modelAnswer: string
  /** Короткая продукция без образца: оценивается только по чек-листу. */
  selfAssessed?: boolean
  usefulLanguage?: string[]
  sourceText?: string
}

export type Exercise =
  | ChoiceExercise
  | AssembleExercise
  | TranslateExercise
  | ListenExercise
  | SpeakExercise
  | ReadExercise
  | WriteExercise

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
