import type { Level } from './types'

export interface LevelInfo {
  title: string
  summary: string
  can: string[]
  need: string[]
  grammar: string[]
}

export const LEVEL_INFO: Record<Level, LevelInfo> = {
  A1: {
    title: 'Начало',
    summary: 'Представиться, рассказать о семье, доме, распорядке, еде и покупках.',
    can: [
      'Представиться и рассказать о себе, семье и доме',
      'Задать простые вопросы и ответить на них',
      'Понимать короткие медленные сообщения на знакомые темы',
      'Читать простые тексты и писать мини-рассказ',
    ],
    need: [
      '40 уроков A1',
      'Около 500–700 слов',
      'To be, Present Simple, Past Simple, планы и сравнения',
    ],
    grammar: [
      'to be',
      'Present Simple',
      'Present Continuous',
      'Past Simple',
      'going to',
      'сравнения',
    ],
  },
  A2: {
    title: 'Быт',
    summary: 'Решать бытовые ситуации, рассказать о прошлом и планах.',
    can: [
      'Описать прошлые события и планы',
      'Сделать покупки, заказать еду, спросить дорогу, побывать у врача',
      'Понимать основное в коротких разговорах',
      'Найти информацию в письмах, объявлениях и несложных статьях',
      'Написать личное сообщение и связный рассказ',
    ],
    need: [
      '50 уроков A2',
      'Около 1200–1600 слов',
      'Present Perfect, Past Continuous, Conditionals, Passive',
    ],
    grammar: [
      'Present Perfect',
      'Past Continuous',
      'will / going to',
      'First Conditional',
      'модальные глаголы',
      'gerund / infinitive',
    ],
  },
  B1: {
    title: 'Разговор',
    summary: 'Поддерживать разговор, объяснять мнение и причины.',
    can: [
      'Говорить на знакомые и новые темы',
      'Объяснять мнение, причины и примеры',
      'Понимать основное в естественной речи с ясным произношением',
      'Читать несложные тексты для носителей со словарём по необходимости',
      'Писать эссе, письмо и пересказ с понятной структурой',
    ],
    need: [
      '60 уроков B1',
      'Около 2300–2900 слов',
      'Perfect Continuous, Second Conditional, Passive, reported speech',
    ],
    grammar: [
      'Present / Past Perfect Continuous',
      'Second Conditional',
      'Passive',
      'reported speech',
      'относительные придаточные',
      'связки',
    ],
  },
  B2: {
    title: 'Учёба',
    summary: 'Участвовать в дискуссии, понимать лекции и писать IELTS Academic.',
    can: [
      'Участвовать в дискуссии без долгой подготовки',
      'Аргументировать, уточнять и возражать',
      'Понимать лекции, интервью и большинство текстов',
      'Различать факты, мнения и аргументы',
      'Писать IELTS Academic Writing в заданном формате',
    ],
    need: [
      '60 уроков B2',
      'Около 3600–4600 слов',
      'Third / mixed Conditionals, advanced Passive, hedging, academic writing',
    ],
    grammar: [
      'Third / mixed Conditionals',
      'wish / if only',
      'have / get something done',
      'модальная оценка прошлого',
      'номинализация',
      'академическая связность',
    ],
  },
  C1: {
    title: 'Свобода',
    summary: 'Гибко использовать язык в вузе, работе и жизни.',
    can: [
      'Следить за длинными рассуждениями и неявными смыслами',
      'Читать академические и публицистические тексты',
      'Оценивать надёжность аргументов и источников',
      'Писать структурированные работы и менять стиль под аудиторию',
      'Говорить подробно без заметной потери беглости',
    ],
    need: [
      '60 уроков C1',
      'Около 5200–6800 слов',
      'Inversion, ellipsis, nominalization, register',
    ],
    grammar: [
      'инверсия и эмфаза',
      'cleft sentences',
      'advanced Passive',
      'ellipsis / substitution',
      'номинализация',
      'регистр и стиль',
    ],
  },
}
