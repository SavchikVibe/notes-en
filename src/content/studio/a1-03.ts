import type { StudioTask } from './types'

export const a1Studio03: StudioTask = {
  id: 'studio-a1-03',
  level: 'A1',
  title: 'Поездка на пляж',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать рассказ о поездке, понять звонок подруге, написать сообщение о выходных и рассказать о поездке',
  estimatedMinutes: 15,
  reading: {
    title: 'A Trip to the Beach',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Last Saturday, Nina and her family went to the beach. They left home at eight o’clock in the morning. The weather was sunny and warm, and the sky was blue.',
      'They drove for one hour. At the beach, Nina swam in the sea with her brother. Her parents sat under a big umbrella and read books. At noon, they ate sandwiches, apples, and cookies.',
      'In the afternoon, Nina found a small shell. It was pink and white. She put it in her bag. Then they walked along the beach and took photos.',
      'They went home at five o’clock. Nina was tired, but she was very happy. She wants to go to the beach again next summer.',
    ],
    questions: [
      {
        question: 'When did Nina go to the beach?',
        options: ['Last Saturday', 'Last Sunday', 'Next summer'],
        answer: 0,
        evidence: 'Last Saturday, Nina and her family went to the beach.',
      },
      {
        question: 'What did Nina do in the sea?',
        options: ['She swam', 'She read a book', 'She took photos'],
        answer: 0,
        evidence: 'At the beach, Nina swam in the sea with her brother.',
      },
      {
        question: 'What did Nina find?',
        options: ['A small shell', 'A big fish', 'A red bag'],
        answer: 0,
        evidence: 'In the afternoon, Nina found a small shell.',
      },
      {
        question: 'They left home at ten o’clock.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'They left home at eight o’clock in the morning.',
      },
      {
        question: 'Nina wants to go to the beach again.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'She wants to go to the beach again next summer.',
      },
    ],
  },
  listening: {
    title: 'A Phone Call about the Trip',
    intro: 'Нина звонит подруге Эмме и рассказывает о поездке. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a1-03.mp3',
    lines: [
      { speaker: 'Emma', text: 'Hi, Nina! How was the beach?', pitch: 0.94 },
      { speaker: 'Nina', text: 'It was great! The weather was sunny and warm.', pitch: 1.06 },
      { speaker: 'Emma', text: 'What did you do there?', pitch: 0.94 },
      { speaker: 'Nina', text: 'I swam in the sea and found a small shell.', pitch: 1.06 },
      { speaker: 'Emma', text: 'Nice! Did you take photos?', pitch: 0.94 },
      { speaker: 'Nina', text: 'Yes, I did. I can show you on Monday.', pitch: 1.06 },
      { speaker: 'Emma', text: 'Great. What time did you go home?', pitch: 0.94 },
      { speaker: 'Nina', text: 'We went home at five o’clock.', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'The weather was sunny and',
        after: '.',
        answer: 'warm',
        accept: ['warm'],
      },
      {
        before: 'Nina swam in the sea and found a small',
        after: '.',
        answer: 'shell',
        accept: ['shell'],
      },
      {
        before: 'Nina took',
        after: '.',
        answer: 'photos',
        accept: ['photos', 'photos of the beach'],
      },
      {
        before: 'They went home at',
        after: 'o’clock.',
        answer: 'five',
        accept: ['five', '5'],
      },
    ],
    questions: [
      {
        question: 'How was the beach?',
        options: ['Great', 'Boring', 'Cold'],
        answer: 0,
      },
      {
        question: 'When can Nina show the photos?',
        options: ['On Monday', 'On Saturday', 'Next summer'],
        answer: 0,
      },
    ],
    transcript: [
      'Emma: Hi, Nina! How was the beach?',
      'Nina: It was great! The weather was sunny and warm.',
      'Emma: What did you do there?',
      'Nina: I swam in the sea and found a small shell.',
      'Emma: Nice! Did you take photos?',
      'Nina: Yes, I did. I can show you on Monday.',
      'Emma: Great. What time did you go home?',
      'Nina: We went home at five o’clock.',
    ],
  },
  writing: {
    title: 'Напиши сообщение о выходных',
    prompt:
      'Write a message to a friend about your last weekend. Say where you went, what you did, and how you felt. Write 60–80 words.',
    minWords: 60,
    maxWords: 80,
    checklist: [
      'Есть приветствие и подпись.',
      'Названо место, куда ты ходил(а).',
      'Сказано, что ты делал(а).',
      'Сказано, как ты себя чувствовал(а).',
    ],
    modelAnswer:
      'Hi Emma,\n\nLast Saturday, I went to the beach with my family. We left home at eight o’clock. The weather was sunny and warm. I swam in the sea and found a small shell. We ate sandwiches and took photos. We went home at five o’clock. I was tired, but very happy. It was a great day.\n\nSee you,\nNina',
    usefulLanguage: ['Last Saturday, I...', 'I went to...', 'I was...', 'It was a great day'],
  },
  speaking: {
    title: 'Расскажи о поездке',
    prompt:
      'Talk about a trip you remember. Say where you went, who you were with, what you did, and how you felt. Speak for 45–60 seconds.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а), куда ездил(а).',
      'Сказал(а), с кем был(а).',
      'Сказал(а), что делал(а).',
      'Сказал(а), как себя чувствовал(а).',
    ],
  },
}
