import type { StudioTask } from './types'

export const a1Studio01: StudioTask = {
  id: 'studio-a1-01',
  level: 'A1',
  title: 'Субботний рынок',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать короткий текст, понять диалог в кафе, написать сообщение другу и рассказать о семье',
  estimatedMinutes: 20,
  reading: {
    title: 'A Saturday Market',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'On Saturday morning, Anna and her mother go to the market. The market is near their house. It is small, but it has many things: fruit, vegetables, bread, and flowers.',
      'Anna likes the fruit stand. The apples are red and the bananas are yellow. Her mother buys tomatoes, bread, and a big bag of oranges. Anna buys a small box of strawberries. They cost three dollars.',
      'At the market, Anna sees her friend Ben. He is with his father. Ben says, “Hello, Anna! Do you like the market?” Anna says, “Yes, I do. I like the strawberries.”',
      'Anna and her mother walk home. They are happy. On Sunday, they want to make a fruit salad.',
    ],
    questions: [
      {
        question: 'Where do Anna and her mother go on Saturday?',
        options: ['To the market', 'To the park', 'To school'],
        answer: 0,
        evidence: 'On Saturday morning, Anna and her mother go to the market.',
      },
      {
        question: 'What does Anna buy?',
        options: ['Strawberries', 'Bread', 'Flowers'],
        answer: 0,
        evidence: 'Anna buys a small box of strawberries.',
      },
      {
        question: 'Who does Anna see at the market?',
        options: ['Her friend Ben', 'Her teacher', 'Her brother'],
        answer: 0,
        evidence: 'At the market, Anna sees her friend Ben.',
      },
      {
        question: 'The market is far from Anna’s house.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'The market is near their house.',
      },
      {
        question: 'Anna and her mother want to make a fruit salad.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'On Sunday, they want to make a fruit salad.',
      },
    ],
  },
  listening: {
    title: 'At the Café',
    intro:
      'Анна в кафе. Сначала слушай целиком, потом заполни пропуски.',
    lines: [
      { speaker: 'Server', text: 'Good morning! What would you like?', pitch: 0.86 },
      { speaker: 'Anna', text: 'I would like a sandwich and a coffee, please.', pitch: 1.1 },
      { speaker: 'Server', text: 'Would you like milk in your coffee?', pitch: 0.86 },
      { speaker: 'Anna', text: 'Yes, please. And a glass of water.', pitch: 1.1 },
      { speaker: 'Server', text: 'Anything else?', pitch: 0.86 },
      { speaker: 'Anna', text: 'No, thank you. How much is it?', pitch: 1.1 },
      { speaker: 'Server', text: 'That is eight dollars.', pitch: 0.86 },
      { speaker: 'Anna', text: 'Here you are.', pitch: 1.1 },
      { speaker: 'Server', text: 'Thank you. Have a nice day!', pitch: 0.86 },
    ],
    notes: [
      {
        before: 'Anna orders a',
        after: 'and a coffee.',
        answer: 'sandwich',
        accept: ['sandwich', 'a sandwich'],
      },
      {
        before: 'She wants',
        after: 'in her coffee.',
        answer: 'milk',
        accept: ['milk'],
      },
      {
        before: 'She also asks for a glass of',
        after: '.',
        answer: 'water',
        accept: ['water'],
      },
      {
        before: 'The food and drink cost',
        after: 'dollars.',
        answer: 'eight',
        accept: ['eight', '8'],
      },
    ],
    questions: [
      {
        question: 'Where is Anna?',
        options: ['At a café', 'At a market', 'At school'],
        answer: 0,
      },
      {
        question: 'What does Anna drink?',
        options: ['Coffee and water', 'Tea and juice', 'Milk and water'],
        answer: 0,
      },
    ],
    transcript: [
      'Server: Good morning! What would you like?',
      'Anna: I would like a sandwich and a coffee, please.',
      'Server: Would you like milk in your coffee?',
      'Anna: Yes, please. And a glass of water.',
      'Server: Anything else?',
      'Anna: No, thank you. How much is it?',
      'Server: That is eight dollars.',
      'Anna: Here you are.',
      'Server: Thank you. Have a nice day!',
    ],
  },
  writing: {
    title: 'Напиши сообщение другу',
    prompt:
      'Write a short message to your friend. Invite them to the market on Saturday. Say what time you want to meet and what you want to buy. Write 50–70 words.',
    minWords: 50,
    maxWords: 70,
    checklist: [
      'Есть приветствие и подпись.',
      'Назван день и время встречи.',
      'Сказано, что ты хочешь купить.',
      'Есть вежливое приглашение.',
    ],
    modelAnswer:
      'Hi Ben,\n\nDo you want to go to the market with me on Saturday? I want to buy strawberries and bread. Let’s meet at ten o’clock near the market. My mother can take us. Write back and tell me if you can come.\n\nSee you,\nAnna',
    usefulLanguage: ['Do you want to...', 'Let’s meet at...', 'Write back', 'See you'],
  },
  speaking: {
    title: 'Расскажи о своей семье',
    prompt:
      'Talk about your family. Say how many people are in your family, who they are, and one thing you like to do together. Speak for 30–45 seconds.',
    preparationSeconds: 30,
    speakingSeconds: 45,
    checklist: [
      'Назвал(а), сколько человек в семье.',
      'Сказал(а), кто они.',
      'Сказал(а), что вы любите делать вместе.',
      'Говорил(а) целыми предложениями.',
    ],
  },
}
