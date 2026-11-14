import type { StudioTask } from './types'

export const a2Studio04: StudioTask = {
  id: 'studio-a2-04',
  level: 'A2',
  title: 'Новая квартира',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать историю о переезде, понять разговор с арендодателем, написать сообщение о новой квартире и рассказать о доме',
  estimatedMinutes: 20,
  reading: {
    title: 'A New Home',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Last month, Daniel and his family moved to a new apartment. Their old apartment was small and noisy. It was near a busy road, and Daniel could not sleep well. The move took two days, and they used a moving company.',
      'The new apartment is bigger and quieter. It is on the third floor of a building near a park. It has two bedrooms, a living room, a kitchen, and a balcony. Daniel’s favorite place is the balcony. He can see trees and birds from there. His sister has her own room now, and she is very happy.',
      'The family has already painted the living room and bought a new sofa. They have not finished the kitchen yet. They want to buy a table and four chairs next week.',
      'Daniel likes the new neighborhood. There is a supermarket, a library, and a sports center near the building. He has already made friends with a boy who lives on the first floor.',
    ],
    questions: [
      {
        question: 'Why couldn’t Daniel sleep well in the old apartment?',
        options: ['It was noisy', 'It was too big', 'It was cold'],
        answer: 0,
        evidence: 'It was near a busy road, and Daniel could not sleep well.',
      },
      {
        question: 'Where is the new apartment?',
        options: ['Near a park', 'Near a busy road', 'Near the airport'],
        answer: 0,
        evidence: 'It is on the third floor of a building near a park.',
      },
      {
        question: 'What have they already done?',
        options: ['Painted the living room', 'Finished the kitchen', 'Bought a table'],
        answer: 0,
        evidence: 'The family has already painted the living room and bought a new sofa.',
      },
      {
        question: 'Daniel’s sister has her own room now.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'His sister has her own room now, and she is very happy.',
      },
      {
        question: 'They have finished the kitchen.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'They have not finished the kitchen yet.',
      },
    ],
  },
  listening: {
    title: 'A Call to the Landlord',
    intro: 'Мама Даниэля звонит арендодателю. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a2-04.mp3',
    lines: [
      { speaker: 'Landlord', text: 'Hello, Mr. Brown speaking.', pitch: 0.94 },
      { speaker: 'Anna', text: 'Hello. This is Anna Miller. We moved into apartment three B last week.', pitch: 1.06 },
      { speaker: 'Landlord', text: 'Yes, of course. Is everything OK?', pitch: 0.94 },
      { speaker: 'Anna', text: 'Almost. The kitchen window does not close, and the hot water is not working.', pitch: 1.06 },
      { speaker: 'Landlord', text: 'I’m sorry about that. I can send a repair person tomorrow morning.', pitch: 0.94 },
      { speaker: 'Anna', text: 'Thank you. What time will he come?', pitch: 1.06 },
      { speaker: 'Landlord', text: 'Between nine and eleven. Will someone be at home?', pitch: 0.94 },
      { speaker: 'Anna', text: 'Yes, I will be at home.', pitch: 1.06 },
      { speaker: 'Landlord', text: 'Good. I will call you when he is on his way.', pitch: 0.94 },
    ],
    notes: [
      {
        before: 'Anna Miller lives in apartment',
        after: '.',
        answer: '3B',
        accept: ['3b', '3 b', 'three b'],
      },
      {
        before: 'The kitchen',
        after: 'does not close.',
        answer: 'window',
        accept: ['window'],
      },
      {
        before: 'The',
        after: 'water is not working.',
        answer: 'hot',
        accept: ['hot'],
      },
      {
        before: 'The repair person will come between nine and',
        after: '.',
        answer: 'eleven',
        accept: ['eleven', '11'],
      },
    ],
    questions: [
      {
        question: 'What is the problem?',
        options: ['A window and hot water', 'A broken door', 'No electricity'],
        answer: 0,
      },
      {
        question: 'When will the repair person come?',
        options: ['Tomorrow morning', 'Today evening', 'Next week'],
        answer: 0,
      },
    ],
    transcript: [
      'Landlord: Hello, Mr. Brown speaking.',
      'Anna: Hello. This is Anna Miller. We moved into apartment three B last week.',
      'Landlord: Yes, of course. Is everything OK?',
      'Anna: Almost. The kitchen window does not close, and the hot water is not working.',
      'Landlord: I’m sorry about that. I can send a repair person tomorrow morning.',
      'Anna: Thank you. What time will he come?',
      'Landlord: Between nine and eleven. Will someone be at home?',
      'Anna: Yes, I will be at home.',
      'Landlord: Good. I will call you when he is on his way.',
    ],
  },
  writing: {
    title: 'Напиши сообщение о новой квартире',
    prompt:
      'Write a message to a friend about your new apartment. Say where it is, what you like about it, and what you still need to buy. Write 80–100 words.',
    minWords: 80,
    maxWords: 100,
    checklist: [
      'Есть приветствие и подпись.',
      'Названо, где находится квартира.',
      'Сказано, что нравится.',
      'Сказано, что ещё нужно купить.',
    ],
    modelAnswer:
      'Hi Ben,\n\nWe moved to a new apartment last week. It is on the third floor of a building near a park. It is bigger and quieter than our old home. I like the balcony because I can see trees and birds. We have already painted the living room and bought a sofa. We still need a table and four chairs for the kitchen.\n\nCome and visit us soon!\n\nDaniel',
    usefulLanguage: ['We moved to...', 'It is near...', 'I like... because...', 'We still need...'],
  },
  speaking: {
    title: 'Расскажи о своём доме',
    prompt:
      'Talk about your home or a home you would like to have. Say where it is, what it looks like, and what you like about it. Speak for 60–90 seconds.',
    preparationSeconds: 45,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а), где находится дом.',
      'Описа́л(а), как он выглядит.',
      'Сказал(а), что нравится.',
      'Использовал(а) there is / there are.',
    ],
  },
}
