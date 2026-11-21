import type { StudioTask } from './types'

export const a2Studio03: StudioTask = {
  id: 'studio-a2-03',
  level: 'A2',
  title: 'Проблема с заказом',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать историю о неправильном заказе, понять звонок в поддержку, написать письмо о проблеме и рассказать о похожем случае',
  estimatedMinutes: 20,
  reading: {
    title: 'The Wrong Size',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Last month, Emma ordered a pair of running shoes online. She needed them for a race. The shoes were blue, size 38. She paid by card and waited for the delivery.',
      'The shoes arrived three days later, but there was a problem. The box contained black shoes, size 36. Emma checked the order again. She had ordered blue shoes, size 38. The company had sent the wrong size and the wrong color.',
      'Emma called customer service. She explained the problem politely. The assistant checked the order and said, “I am sorry. We will send the correct shoes today. The return is free. Please return the black shoes in the same box.”',
      'Emma printed the return label and sent the shoes back. Two days later, she received the blue shoes. They were the right size and color. She was happy with the shoes, but she thought the delivery was slow. She wrote a short review and gave the company three stars.',
    ],
    questions: [
      {
        question: 'What did Emma order?',
        options: ['Running shoes', 'A jacket', 'A bag'],
        answer: 0,
        evidence: 'Last month, Emma ordered a pair of running shoes online.',
      },
      {
        question: 'What was wrong with the first delivery?',
        options: ['The wrong size and color', 'The shoes were old', 'The box was empty'],
        answer: 0,
        evidence: 'The company had sent the wrong size and the wrong color.',
      },
      {
        question: 'What did customer service do?',
        options: ['Sent the correct shoes', 'Refused to help', 'Asked her to pay again'],
        answer: 0,
        evidence: 'We will send the correct shoes today.',
      },
      {
        question: 'Emma ordered black shoes, size 36.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'She had ordered blue shoes, size 38.',
      },
      {
        question: 'The return was free.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'The return is free.',
      },
    ],
  },
  listening: {
    title: 'A Call to Customer Service',
    intro: 'Эмма звонит в поддержку магазина. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a2-03.mp3',
    lines: [
      { speaker: 'Assistant', text: 'Good morning. How can I help you?', pitch: 0.94 },
      { speaker: 'Emma', text: 'Hello. I ordered a pair of running shoes last week, but I received the wrong size.', pitch: 1.06 },
      { speaker: 'Assistant', text: 'I’m sorry about that. What is your order number?', pitch: 0.94 },
      { speaker: 'Emma', text: 'It’s four seven two nine.', pitch: 1.06 },
      { speaker: 'Assistant', text: 'Thank you. I see the order: blue shoes, size thirty-eight. What did you receive?', pitch: 0.94 },
      { speaker: 'Emma', text: 'Black shoes, size thirty-six.', pitch: 1.06 },
      { speaker: 'Assistant', text: 'We will send the correct shoes today. The return is free. Please use the same box.', pitch: 0.94 },
      { speaker: 'Emma', text: 'Thank you. How long will the delivery take?', pitch: 1.06 },
      { speaker: 'Assistant', text: 'Two or three days.', pitch: 0.94 },
      { speaker: 'Emma', text: 'Great. Thank you for your help.', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'Emma ordered running',
        after: '.',
        answer: 'shoes',
        accept: ['shoes'],
      },
      {
        before: 'Her order number is',
        after: '.',
        answer: '4729',
        accept: ['4729', '4 7 2 9', '4-7-2-9'],
      },
      {
        before: 'The company will send the correct',
        after: 'today.',
        answer: 'shoes',
        accept: ['shoes'],
      },
      {
        before: 'The return is',
        after: '.',
        answer: 'free',
        accept: ['free'],
      },
    ],
    questions: [
      {
        question: 'Why does Emma call?',
        options: ['She received the wrong order', 'She wants a new job', 'She cannot find the shop'],
        answer: 0,
      },
      {
        question: 'How long will the delivery take?',
        options: ['Two or three days', 'One hour', 'Two weeks'],
        answer: 0,
      },
    ],
    transcript: [
      'Assistant: Good morning. How can I help you?',
      'Emma: Hello. I ordered a pair of running shoes last week, but I received the wrong size.',
      'Assistant: I’m sorry about that. What is your order number?',
      'Emma: It’s four seven two nine.',
      'Assistant: Thank you. I see the order: blue shoes, size thirty-eight. What did you receive?',
      'Emma: Black shoes, size thirty-six.',
      'Assistant: We will send the correct shoes today. The return is free. Please use the same box.',
      'Emma: Thank you. How long will the delivery take?',
      'Assistant: Two or three days.',
      'Emma: Great. Thank you for your help.',
    ],
  },
  writing: {
    title: 'Напиши письмо в поддержку',
    prompt:
      'Write an email to customer service about a problem with an order. Say what you ordered, what was wrong, and what you want them to do. Write 80–100 words.',
    minWords: 80,
    maxWords: 100,
    checklist: [
      'Есть вежливое обращение и подпись.',
      'Названо, что ты заказал(а).',
      'Сказано, что было не так.',
      'Сказано, что ты хочешь от компании.',
    ],
    modelAnswer:
      'Dear Customer Service,\n\nI ordered a pair of blue running shoes, size 38, last week. My order number is 4729. Today I received black shoes, size 36. This is the wrong size and color. I need the shoes for a race next month.\n\nI would like you to send the correct shoes as soon as possible. Please tell me how to return the black shoes. I hope the return is free. I look forward to your reply.\n\nThank you for your help.\n\nBest regards,\nEmma',
    usefulLanguage: ['I ordered...', 'I received...', 'I would like you to...', 'Please tell me...'],
  },
  speaking: {
    title: 'Расскажи о проблеме с покупкой',
    prompt:
      'Talk about a time you had a problem with a purchase or a service. Say what happened and how it was solved. Speak for 60–90 seconds.',
    preparationSeconds: 45,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а), что купил(а) или заказал(а).',
      'Сказал(а), в чём была проблема.',
      'Сказал(а), как её решили.',
      'Использовал(а) past simple.',
    ],
  },
}
