import type { Level } from './types'

export interface FluencyPrompt {
  id: string
  level: Level
  title: string
  prompt: string
}

/**
 * Темы для цикла беглости: говоришь 60 секунд без подготовки, слушаешь,
 * повторяешь ту же тему ещё раз. Без чек-листа и без оценки.
 */
export const fluencyPrompts: FluencyPrompt[] = [
  {
    id: 'fluency-a1-01',
    level: 'A1',
    title: 'Моё утро',
    prompt: 'Tell me about your morning. What time do you get up? What do you do?',
  },
  {
    id: 'fluency-a1-02',
    level: 'A1',
    title: 'Любимая еда',
    prompt: 'Talk about your favorite food. What is it? When do you eat it? Who cooks it?',
  },
  {
    id: 'fluency-a1-03',
    level: 'A1',
    title: 'Мой друг',
    prompt: 'Tell me about your friend. What is their name? How old are they? What do you do together?',
  },
  {
    id: 'fluency-a2-01',
    level: 'A2',
    title: 'Прошлые выходные',
    prompt: 'What did you do last weekend? Where did you go, and who was with you?',
  },
  {
    id: 'fluency-a2-02',
    level: 'A2',
    title: 'Мой город',
    prompt: 'Describe your town. What places do you like? What is one problem?',
  },
  {
    id: 'fluency-a2-03',
    level: 'A2',
    title: 'Планы на неделю',
    prompt: 'What are you going to do next week? Tell me about three plans.',
  },
  {
    id: 'fluency-b1-01',
    level: 'B1',
    title: 'Новая привычка',
    prompt: 'Talk about a habit you would like to start. Why is it useful, and what makes it difficult?',
  },
  {
    id: 'fluency-b1-02',
    level: 'B1',
    title: 'Проблема в городе',
    prompt: 'Describe one problem in your city and suggest a solution. Explain who should act.',
  },
  {
    id: 'fluency-b1-03',
    level: 'B1',
    title: 'Поездка',
    prompt: 'Tell me about a trip you remember. Where did you go, and what happened?',
  },
  {
    id: 'fluency-b2-01',
    level: 'B2',
    title: 'Удалённая работа',
    prompt: 'What are the main advantages and disadvantages of remote work? Give your opinion.',
  },
  {
    id: 'fluency-b2-02',
    level: 'B2',
    title: 'Города без машин',
    prompt: 'Should cities remove cars from their centers? Consider residents, shops, and access.',
  },
  {
    id: 'fluency-b2-03',
    level: 'B2',
    title: 'Быстрая мода',
    prompt: 'Who is responsible for the cost of fast fashion: shoppers, brands, or governments?',
  },
  {
    id: 'fluency-c1-01',
    level: 'C1',
    title: 'Внимание',
    prompt: 'Is attention a personal responsibility or a public issue? Explain your position.',
  },
  {
    id: 'fluency-c1-02',
    level: 'C1',
    title: 'Эффективность',
    prompt: 'When should a system trade efficiency for resilience? Use one example and draw a principle.',
  },
  {
    id: 'fluency-c1-03',
    level: 'C1',
    title: 'Доверие',
    prompt: 'How can institutions earn public trust? Distinguish between claims and behavior.',
  },
]

export function fluencyPromptsFor(level: Level): FluencyPrompt[] {
  return fluencyPrompts.filter((item) => item.level === level)
}
