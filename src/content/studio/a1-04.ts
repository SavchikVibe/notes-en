import type { StudioTask } from './types'

export const a1Studio04: StudioTask = {
  id: 'studio-a1-04',
  level: 'A1',
  title: 'Планы на выходные',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать текст о планах, понять разговор о выходных, написать сообщение о планах и рассказать о следующих выходных',
  estimatedMinutes: 15,
  reading: {
    title: 'Next Weekend',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Next weekend, Alex is going to visit his grandparents. They live in a small town near the mountains. Alex is going to take the train on Friday afternoon.',
      'On Saturday morning, Alex and his grandfather are going to work in the garden. They are going to plant tomatoes and flowers. In the afternoon, Alex is going to walk to the lake with his grandmother. They are going to feed the ducks.',
      'On Sunday, Alex’s parents are going to drive to the town. They are going to have lunch together. After lunch, Alex is going to play chess with his grandfather.',
      'Alex is going to go home on Sunday evening. He is going to be tired, but he is going to be happy.',
    ],
    questions: [
      {
        question: 'Where is Alex going to visit?',
        options: ['His grandparents', 'His friends', 'His teacher'],
        answer: 0,
        evidence: 'Next weekend, Alex is going to visit his grandparents.',
      },
      {
        question: 'How is Alex going to travel on Friday?',
        options: ['By train', 'By car', 'By bus'],
        answer: 0,
        evidence: 'Alex is going to take the train on Friday afternoon.',
      },
      {
        question: 'What is Alex going to do in the garden?',
        options: ['Plant tomatoes and flowers', 'Feed the ducks', 'Play chess'],
        answer: 0,
        evidence: 'They are going to plant tomatoes and flowers.',
      },
      {
        question: 'Alex is going to walk to the lake with his grandmother.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'In the afternoon, Alex is going to walk to the lake with his grandmother.',
      },
      {
        question: 'Alex is going to go home on Saturday.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'Alex is going to go home on Sunday evening.',
      },
    ],
  },
  listening: {
    title: 'Making Plans',
    intro: 'Алекс звонит другу Сэму и рассказывает о планах. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a1-04.mp3',
    lines: [
      { speaker: 'Sam', text: 'Hi, Alex. Are you free next weekend?', pitch: 0.94 },
      { speaker: 'Alex', text: 'No, I’m not. I’m going to visit my grandparents.', pitch: 1.06 },
      { speaker: 'Sam', text: 'Oh, nice. What are you going to do there?', pitch: 0.94 },
      { speaker: 'Alex', text: 'I’m going to work in the garden and walk to the lake.', pitch: 1.06 },
      { speaker: 'Sam', text: 'When are you going to come home?', pitch: 0.94 },
      { speaker: 'Alex', text: 'On Sunday evening. Do you want to play football on Monday?', pitch: 1.06 },
      { speaker: 'Sam', text: 'Sure! Let’s meet at the park at four.', pitch: 0.94 },
      { speaker: 'Alex', text: 'Great. See you on Monday!', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'Alex is going to visit his',
        after: '.',
        answer: 'grandparents',
        accept: ['grandparents'],
      },
      {
        before: 'He is going to work in the',
        after: '.',
        answer: 'garden',
        accept: ['garden'],
      },
      {
        before: 'He is going to come home on',
        after: 'evening.',
        answer: 'Sunday',
        accept: ['sunday'],
      },
      {
        before: 'They are going to meet at the',
        after: 'at four.',
        answer: 'park',
        accept: ['park'],
      },
    ],
    questions: [
      {
        question: 'Why can’t Alex meet Sam next weekend?',
        options: [
          'He is going to visit his grandparents',
          'He is going to school',
          'He is going to the beach',
        ],
        answer: 0,
      },
      {
        question: 'When are they going to play football?',
        options: ['On Monday', 'On Saturday', 'On Sunday'],
        answer: 0,
      },
    ],
    transcript: [
      'Sam: Hi, Alex. Are you free next weekend?',
      'Alex: No, I’m not. I’m going to visit my grandparents.',
      'Sam: Oh, nice. What are you going to do there?',
      'Alex: I’m going to work in the garden and walk to the lake.',
      'Sam: When are you going to come home?',
      'Alex: On Sunday evening. Do you want to play football on Monday?',
      'Sam: Sure! Let’s meet at the park at four.',
      'Alex: Great. See you on Monday!',
    ],
  },
  writing: {
    title: 'Напиши сообщение о планах',
    prompt:
      'Write a message to a friend about your plans for next weekend. Say where you are going to go, what you are going to do, and when you are going to come home. Write 60–80 words.',
    minWords: 60,
    maxWords: 80,
    checklist: [
      'Есть приветствие и подпись.',
      'Названо место, куда ты собираешься.',
      'Сказано, что ты собираешься делать.',
      'Названо время возвращения.',
    ],
    modelAnswer:
      'Hi Sam,\n\nNext weekend, I am going to visit my grandparents. They live in a small town near the mountains. On Saturday, I am going to work in the garden and walk to the lake. On Sunday, my parents are going to come for lunch. I am going to go home on Sunday evening.\n\nSee you on Monday,\nAlex',
    usefulLanguage: ['I am going to...', 'On Saturday, I...', 'I am going to come home...', 'See you'],
  },
  speaking: {
    title: 'Расскажи о планах на выходные',
    prompt:
      'Talk about your plans for next weekend. Say what you are going to do, who you are going to be with, and why. Speak for 45–60 seconds.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а), что собираешься делать.',
      'Сказал(а), с кем будешь.',
      'Объяснил(а), почему.',
      'Использовал(а) going to.',
    ],
  },
}
