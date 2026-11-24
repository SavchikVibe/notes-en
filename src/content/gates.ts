import type { Level } from './types'

export interface LevelGate {
  level: Level
  nextLevel: Level
  /** Последняя студия уровня: она должна быть пройдена до проверки. */
  studioId: string
  /** Два текста библиотеки уровня, которые должны быть прочитаны. */
  textIds: [string, string]
  writingPrompt: string
  writingMinWords: number
  writingChecklist: string[]
  speakingPrompt: string
  speakingSeconds: number
  speakingChecklist: string[]
}

/**
 * Проверки на границах уровней. Это не новые уроки, а короткий выходной билет:
 * последняя студия уровня + два текста библиотеки + письмо и речь по новой теме.
 */
export const levelGates: LevelGate[] = [
  {
    level: 'A1',
    nextLevel: 'A2',
    studioId: 'studio-a1-04',
    textIds: ['reading-09', 'reading-10'],
    writingPrompt:
      'Write 5–7 sentences about your week: what you did, where you went, and what you plan for next weekend.',
    writingMinWords: 40,
    writingChecklist: [
      'Написано 5–7 предложений о своей неделе.',
      'Использован Past Simple для прошедшего.',
      'Есть одно предложение о планах (going to / will).',
    ],
    speakingPrompt:
      'Talk about your week for 45 seconds: what you did, where you went, and what you will do next weekend.',
    speakingSeconds: 45,
    speakingChecklist: [
      'Сказал(а), что делал(а) на неделе.',
      'Сказал(а), куда ходил(а).',
      'Сказал(а) о планах на выходные.',
    ],
  },
  {
    level: 'A2',
    nextLevel: 'B1',
    studioId: 'studio-a2-05',
    textIds: ['reading-19', 'reading-20'],
    writingPrompt:
      'Write a short message to a friend about a problem you had last week and what you did about it. Write 60–80 words.',
    writingMinWords: 60,
    writingChecklist: [
      'Описана проблема и что случилось.',
      'Сказано, что ты сделал(а).',
      'Есть приветствие и подпись.',
    ],
    speakingPrompt:
      'Tell a friend about a problem you had last week and how you solved it. Speak for 60 seconds.',
    speakingSeconds: 60,
    speakingChecklist: [
      'Названа проблема.',
      'Объяснено, что произошло.',
      'Сказано, как ты это решил(а).',
    ],
  },
  {
    level: 'B1',
    nextLevel: 'B2',
    studioId: 'studio-b1-06',
    textIds: ['reading-31', 'reading-32'],
    writingPrompt:
      'Write a short opinion paragraph: is it better to study alone or with others? Give two reasons and one example. Write 80–100 words.',
    writingMinWords: 80,
    writingChecklist: [
      'Сформулировано мнение.',
      'Есть два аргумента.',
      'Есть пример и связки (because, however, for example).',
    ],
    speakingPrompt:
      'Give your opinion: is it better to study alone or with others? Give two reasons and one example. Speak for 90 seconds.',
    speakingSeconds: 90,
    speakingChecklist: [
      'Сразу сказано мнение.',
      'Названы два аргумента.',
      'Приведён пример.',
    ],
  },
  {
    level: 'B2',
    nextLevel: 'C1',
    studioId: 'studio-b2-06',
    textIds: ['reading-43', 'reading-44'],
    writingPrompt:
      'Write a short argument: should schools require students to do community service? State your position, acknowledge one counterargument, and conclude. Write 100–120 words.',
    writingMinWords: 100,
    writingChecklist: [
      'Позиция сформулирована в первом абзаце.',
      'Признан один контраргумент.',
      'Есть вывод, а не повтор введения.',
    ],
    speakingPrompt:
      'Argue for or against required community service. Acknowledge one counterargument. Speak for 2 minutes.',
    speakingSeconds: 120,
    speakingChecklist: [
      'Позиция ясна с первых секунд.',
      'Признан сильный контраргумент.',
      'Есть конкретный пример или цифра.',
    ],
  },
]
