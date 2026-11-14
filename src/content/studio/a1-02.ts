import type { StudioTask } from './types'

export const a1Studio02: StudioTask = {
  id: 'studio-a1-02',
  level: 'A1',
  title: 'Обычный понедельник',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать текст о дне школьницы, понять короткий звонок, написать сообщение о своём дне и рассказать о распорядке',
  estimatedMinutes: 15,
  reading: {
    title: 'A Busy Monday',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Mia is a student. On Monday, she gets up at seven o’clock. She has breakfast with her family. She eats eggs and toast and drinks a glass of milk.',
      'At eight o’clock, Mia walks to school with her brother. School starts at eight thirty. Her first class is English. She likes English because her teacher tells funny stories.',
      'At twelve o’clock, Mia has lunch in the school café. She usually eats a sandwich and an apple. After lunch, she has math and history.',
      'School finishes at three o’clock. Mia goes home and does her homework. In the evening, she helps her mother make dinner. She goes to bed at ten o’clock. On Monday, Mia is busy, but she is happy.',
    ],
    questions: [
      {
        question: 'What time does Mia get up?',
        options: ['At seven o’clock', 'At eight o’clock', 'At ten o’clock'],
        answer: 0,
        evidence: 'On Monday, she gets up at seven o’clock.',
      },
      {
        question: 'What is Mia’s first class?',
        options: ['English', 'Math', 'History'],
        answer: 0,
        evidence: 'Her first class is English.',
      },
      {
        question: 'Where does Mia have lunch?',
        options: ['In the school café', 'At home', 'In the park'],
        answer: 0,
        evidence: 'At twelve o’clock, Mia has lunch in the school café.',
      },
      {
        question: 'Mia walks to school with her brother.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'At eight o’clock, Mia walks to school with her brother.',
      },
      {
        question: 'Mia goes to bed at nine o’clock.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'She goes to bed at ten o’clock.',
      },
    ],
  },
  listening: {
    title: 'A Phone Call',
    intro: 'Миа звонит другу, чтобы узнать домашнее задание. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a1-02.mp3',
    lines: [
      { speaker: 'Mia', text: 'Hi, Leo. It’s Mia. Do you have the math homework?', pitch: 1.1 },
      { speaker: 'Leo', text: 'Yes. We have to do page twelve, exercises one and two.', pitch: 0.86 },
      { speaker: 'Mia', text: 'Thanks. Do you want to study together?', pitch: 1.1 },
      { speaker: 'Leo', text: 'Sure. Let’s meet at the library at five.', pitch: 0.86 },
      { speaker: 'Mia', text: 'OK. See you at five. Bye!', pitch: 1.1 },
      { speaker: 'Leo', text: 'Bye!', pitch: 0.86 },
    ],
    notes: [
      {
        before: 'The math homework is on page',
        after: '.',
        answer: 'twelve',
        accept: ['twelve', '12'],
      },
      {
        before: 'They have to do exercises one and',
        after: '.',
        answer: 'two',
        accept: ['two', '2'],
      },
      {
        before: 'Mia and Leo will meet at the',
        after: '.',
        answer: 'library',
        accept: ['library', 'the library'],
      },
      {
        before: 'They will meet at',
        after: 'o’clock.',
        answer: 'five',
        accept: ['five', '5'],
      },
    ],
    questions: [
      {
        question: 'Why does Mia call Leo?',
        options: ['To ask about homework', 'To invite him to dinner', 'To talk about a film'],
        answer: 0,
      },
      {
        question: 'Where will they meet?',
        options: ['At the library', 'At school', 'At the café'],
        answer: 0,
      },
    ],
    transcript: [
      'Mia: Hi, Leo. It’s Mia. Do you have the math homework?',
      'Leo: Yes. We have to do page twelve, exercises one and two.',
      'Mia: Thanks. Do you want to study together?',
      'Leo: Sure. Let’s meet at the library at five.',
      'Mia: OK. See you at five. Bye!',
      'Leo: Bye!',
    ],
  },
  writing: {
    title: 'Напиши сообщение о своём дне',
    prompt:
      'Write a short message to your friend about your Monday. Say what time you get up, what you do after school, and what time you go to bed. Write 60–80 words.',
    minWords: 60,
    maxWords: 80,
    checklist: [
      'Есть приветствие и подпись.',
      'Названо время, когда ты встаёшь.',
      'Сказано, что ты делаешь после школы.',
      'Названо время, когда ты ложишься спать.',
    ],
    modelAnswer:
      'Hi Leo,\n\nOn Monday, I get up at seven o’clock. I have breakfast and go to school at eight. After school, I do my homework and help my mother. In the evening, I read a book or watch a film. I go to bed at ten o’clock. What about you?\n\nSee you,\nMia',
    usefulLanguage: ['I get up at...', 'After school, I...', 'In the evening, I...', 'I go to bed at...'],
  },
  speaking: {
    title: 'Расскажи о своём обычном дне',
    prompt:
      'Talk about your typical day. Say what time you get up, what you do in the morning, and what you do in the evening. Speak for 45–60 seconds.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а), во сколько встаёшь.',
      'Сказал(а), что делаешь утром.',
      'Сказал(а), что делаешь вечером.',
      'Использовал(а) минимум две связки: and, but, because.',
    ],
  },
}
