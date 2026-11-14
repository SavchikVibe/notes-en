import type { StudioTask } from './types'

export const b1Studio03: StudioTask = {
  id: 'studio-b1-03',
  level: 'B1',
  title: 'Новый город',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать историю о переезде, понять разговор со старой подругой, написать письмо о переменах и рассказать о большом изменении',
  estimatedMinutes: 25,
  reading: {
    title: 'A New Life in a New City',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Three years ago, Lena lived in a small town in the north. She used to walk everywhere, and she knew most people in the streets. Her life was quiet and predictable. She worked in a small office and spent her weekends with her family. Then she got a job in a large city in the south.',
      'At first, the city felt overwhelming. The streets were crowded, the buses were full, and the prices were higher than in her town. Her apartment was smaller than her old house, and the noise kept her awake at night. Lena missed her old friends and the quiet mornings. She used to have breakfast in the garden; now she had breakfast on a bus.',
      'After a few months, things began to change. Lena joined a photography club and met new people. She learned to use the subway and found a small café near her apartment. She also discovered that the city had more opportunities: evening classes, concerts, and museums. On weekends, she started exploring new neighborhoods with her camera.',
      'Lena still misses her town, but she does not want to go back. She has learned to enjoy the city, and she has become more independent. Last month, she visited her family and showed them photos of her new life. Her mother said, “You look different. You look more confident.”',
      'Lena smiled. She knew it was true. The move was difficult, but it had changed her in a good way.',
    ],
    questions: [
      {
        question: 'Where did Lena live three years ago?',
        options: ['In a small town', 'In a big city', 'In another country'],
        answer: 0,
        evidence: 'Three years ago, Lena lived in a small town in the north.',
      },
      {
        question: 'What did she miss at first?',
        options: ['Her old friends and quiet mornings', 'Her old job', 'The subway'],
        answer: 0,
        evidence: 'Lena missed her old friends and the quiet mornings.',
      },
      {
        question: 'What did she join?',
        options: ['A photography club', 'A football team', 'A cooking class'],
        answer: 0,
        evidence: 'Lena joined a photography club and met new people.',
      },
      {
        question: 'Lena wants to go back to her town.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'Lena still misses her town, but she does not want to go back.',
      },
      {
        question: 'Lena’s mother thinks she looks more confident.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'You look different. You look more confident.',
      },
    ],
  },
  listening: {
    title: 'A Call to an Old Friend',
    intro: 'Лена звонит старой подруге Дженни. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-b1-03.mp3',
    lines: [
      { speaker: 'Jenny', text: 'Hi, Lena! How is life in the city?', pitch: 1.06 },
      { speaker: 'Lena', text: 'It is very different from our town. I am still getting used to it.', pitch: 0.94 },
      { speaker: 'Jenny', text: 'What do you miss most?', pitch: 1.06 },
      { speaker: 'Lena', text: 'I miss the quiet mornings and my old friends. The city is noisy, but there are more things to do.', pitch: 0.94 },
      { speaker: 'Jenny', text: 'How is your new job?', pitch: 1.06 },
      { speaker: 'Lena', text: 'It is interesting. I have met many people, and I have learned to use the subway.', pitch: 0.94 },
      { speaker: 'Jenny', text: 'Do you like your apartment?', pitch: 1.06 },
      { speaker: 'Lena', text: 'Yes, it is smaller than our old house, but it is close to a park.', pitch: 0.94 },
      { speaker: 'Jenny', text: 'I am glad. Come and visit us when you can.', pitch: 1.06 },
      { speaker: 'Lena', text: 'I will. I am going to come back next month.', pitch: 0.94 },
    ],
    notes: [
      {
        before: 'Lena is still getting used to life in the',
        after: '.',
        answer: 'city',
        accept: ['city'],
      },
      {
        before: 'She misses the quiet',
        after: '.',
        answer: 'mornings',
        accept: ['mornings'],
      },
      {
        before: 'The city is noisy, but there are more things to',
        after: '.',
        answer: 'do',
        accept: ['do'],
      },
      {
        before: 'Lena has learned to use the',
        after: '.',
        answer: 'subway',
        accept: ['subway', 'underground'],
      },
      {
        before: 'She is going to come back next',
        after: '.',
        answer: 'month',
        accept: ['month'],
      },
    ],
    questions: [
      {
        question: 'Where does Lena live now?',
        options: ['In a city', 'In a small town', 'In another country'],
        answer: 0,
      },
      {
        question: 'What does she miss?',
        options: ['Quiet mornings and old friends', 'Her old job', 'The subway'],
        answer: 0,
      },
    ],
    transcript: [
      'Jenny: Hi, Lena! How is life in the city?',
      'Lena: It is very different from our town. I am still getting used to it.',
      'Jenny: What do you miss most?',
      'Lena: I miss the quiet mornings and my old friends. The city is noisy, but there are more things to do.',
      'Jenny: How is your new job?',
      'Lena: It is interesting. I have met many people, and I have learned to use the subway.',
      'Jenny: Do you like your apartment?',
      'Lena: Yes, it is smaller than our old house, but it is close to a park.',
      'Jenny: I am glad. Come and visit us when you can.',
      'Lena: I will. I am going to come back next month.',
    ],
  },
  writing: {
    title: 'Напиши письмо о переезде',
    prompt:
      'Write an email to a friend about moving to a new city. Say what changed, what you miss, and what you like. Write 120–150 words.',
    minWords: 120,
    maxWords: 150,
    checklist: [
      'Есть приветствие и подпись.',
      'Сказано, что изменилось.',
      'Сказано, чего не хватает.',
      'Сказано, что нравится в новом месте.',
      'Использованы used to и сравнения.',
    ],
    modelAnswer:
      'Hi Jenny,\n\nI have been in the city for three months now, and life is very different. I used to walk everywhere in our town, but here I take the subway. The streets are noisier, and the prices are higher.\n\nI miss the quiet mornings and our old café. I also miss my family and my friends. Sometimes I feel tired of the crowds.\n\nBut there are good things too. I have joined a photography club, and I have met interesting people. The city has more concerts and evening classes. My apartment is smaller than our old house, but it is close to a park.\n\nI am still getting used to the city, but I think I am becoming more independent. Come and visit me!\n\nLena',
    usefulLanguage: ['I used to...', 'I miss...', 'The city has...', 'I am still getting used to...'],
  },
  speaking: {
    title: 'Расскажи о большом изменении',
    prompt:
      'Talk about a big change in your life. Say what changed, how you felt, and what you learned. Speak for 90–120 seconds.',
    preparationSeconds: 60,
    speakingSeconds: 120,
    checklist: [
      'Назвал(а), что изменилось.',
      'Сказал(а), как себя чувствовал(а).',
      'Сказал(а), чему научился(ась).',
      'Использовал(а) past simple и used to.',
    ],
  },
}
