import type { StudioTask } from './types'

export const a2Studio05: StudioTask = {
  id: 'studio-a2-05',
  level: 'A2',
  title: 'Планы изменились',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать историю о позднем поезде, понять звонок маме, написать сообщение об изменении планов и рассказать о похожем случае',
  estimatedMinutes: 20,
  reading: {
    title: 'The Train Was Late',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'On Friday afternoon, Mia and her friend Sophie were going to London for the weekend. They were waiting for the train at the station. The train was supposed to leave at four o’clock, but it was late.',
      'At four thirty, the station manager announced that the train had a problem. It was not going to leave before six o’clock. Mia and Sophie were worried. They had tickets for a show at eight o’clock.',
      'Sophie said, “If we take the next train, we will arrive at seven thirty. We can still go to the show.” They bought coffee and sat on a bench. Sophie called the theater and explained the problem. The manager was kind and said they could come late.',
      'They finally got on the train at six fifteen. The journey took two hours. They arrived in London at eight fifteen, so they missed the beginning of the show. However, the theater let them in, and they watched the second half. After the show, they ate dinner and laughed about the day.',
      'Mia said, “If the train is late again next time, we will take the bus.”',
    ],
    questions: [
      {
        question: 'Where were Mia and Sophie going?',
        options: ['To London', 'To Paris', 'To the airport'],
        answer: 0,
        evidence: 'On Friday afternoon, Mia and her friend Sophie were going to London for the weekend.',
      },
      {
        question: 'Why were they worried?',
        options: ['They had tickets for a show', 'They lost their bags', 'They missed the bus'],
        answer: 0,
        evidence: 'They had tickets for a show at eight o’clock.',
      },
      {
        question: 'What time did they arrive in London?',
        options: ['At eight fifteen', 'At six fifteen', 'At four thirty'],
        answer: 0,
        evidence: 'They arrived in London at eight fifteen.',
      },
      {
        question: 'They missed the whole show.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'They missed the beginning of the show. However, the theater let them in, and they watched the second half.',
      },
      {
        question: 'Mia says they will take the bus next time if the train is late.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'If the train is late again next time, we will take the bus.',
      },
    ],
  },
  listening: {
    title: 'A Call about the Delay',
    intro: 'Миа звонит маме с вокзала. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a2-05.mp3',
    lines: [
      { speaker: 'Mother', text: 'Hello? Mia, are you on the train?', pitch: 0.94 },
      { speaker: 'Mia', text: 'Not yet. The train is late. It will leave at six fifteen.', pitch: 1.06 },
      { speaker: 'Mother', text: 'Oh no. What about the show?', pitch: 0.94 },
      { speaker: 'Mia', text: 'We have tickets for eight o’clock. If we arrive at seven thirty, we can still go.', pitch: 1.06 },
      { speaker: 'Mother', text: 'I hope so. Are you OK?', pitch: 0.94 },
      { speaker: 'Mia', text: 'Yes, we are fine. We are drinking coffee and waiting.', pitch: 1.06 },
      { speaker: 'Mother', text: 'Call me when you arrive in London.', pitch: 0.94 },
      { speaker: 'Mia', text: 'I will. Bye, Mom.', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'The train will leave at',
        after: 'fifteen.',
        answer: 'six',
        accept: ['six', '6'],
      },
      {
        before: 'Mia and Sophie have tickets for a',
        after: 'at eight.',
        answer: 'show',
        accept: ['show'],
      },
      {
        before: 'They hope to arrive at',
        after: 'thirty.',
        answer: 'seven',
        accept: ['seven', '7'],
      },
      {
        before: 'Mia will call her mother when she arrives in',
        after: '.',
        answer: 'London',
        accept: ['london'],
      },
    ],
    questions: [
      {
        question: 'Why is Mia calling?',
        options: ['To say the train is late', 'To ask for money', 'To cancel the trip'],
        answer: 0,
      },
      {
        question: 'What are they doing while they wait?',
        options: ['Drinking coffee', 'Shopping', 'Sleeping'],
        answer: 0,
      },
    ],
    transcript: [
      'Mother: Hello? Mia, are you on the train?',
      'Mia: Not yet. The train is late. It will leave at six fifteen.',
      'Mother: Oh no. What about the show?',
      'Mia: We have tickets for eight o’clock. If we arrive at seven thirty, we can still go.',
      'Mother: I hope so. Are you OK?',
      'Mia: Yes, we are fine. We are drinking coffee and waiting.',
      'Mother: Call me when you arrive in London.',
      'Mia: I will. Bye, Mom.',
    ],
  },
  writing: {
    title: 'Напиши сообщение об изменении планов',
    prompt:
      'Write a message to a friend about a time your plans changed. Say what you planned, what happened, and what you did. Write 80–100 words.',
    minWords: 80,
    maxWords: 100,
    checklist: [
      'Есть приветствие и подпись.',
      'Сказано, что планировалось.',
      'Сказано, что случилось.',
      'Сказано, что вы сделали.',
    ],
    modelAnswer:
      'Hi Anna,\n\nLast Friday, my friend and I planned to go to London for a show. We had tickets for eight o’clock. Our train was late, so we arrived at eight fifteen. We missed the beginning of the show, but the theater let us in. We watched the second half and then ate dinner. It was not the evening we planned, but we still had fun. Next time, we will take the bus.\n\nMia',
    usefulLanguage: ['We planned to...', 'Our train was late', 'We missed...', 'Next time, we will...'],
  },
  speaking: {
    title: 'Расскажи, как изменились планы',
    prompt:
      'Talk about a time your plans changed. Say what you planned, what happened, and how you felt. Speak for 60–90 seconds.',
    preparationSeconds: 45,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а), что планировал(а).',
      'Сказал(а), что случилось.',
      'Сказал(а), что сделал(а).',
      'Сказал(а), как себя чувствовал(а).',
    ],
  },
}
