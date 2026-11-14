import type { StudioTask } from './types'

export const a2Studio02: StudioTask = {
  id: 'studio-a2-02',
  level: 'A2',
  title: 'У врача',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать историю о простуде, понять разговор с врачом, написать сообщение о болезни и рассказать о случае, когда болел',
  estimatedMinutes: 20,
  reading: {
    title: 'A Bad Cold',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'On Monday morning, Leo did not go to school. He felt terrible. He had a headache, a sore throat, a cough, and a temperature. His mother called the school and made an appointment with Dr. Patel.',
      'At the doctor’s office, Dr. Patel asked Leo some questions. Leo said he had felt ill since Sunday evening. He had not slept well. The doctor listened to his chest and looked at his throat. She asked if he had any allergies. Leo said no. She said it was a bad cold, not the flu.',
      'Dr. Patel told Leo to stay home for two days, drink a lot of water, and sleep. She gave him some medicine for his headache. She also wrote a note for the school. She said he should not go to football practice this week.',
      'Leo went home and followed the doctor’s advice. On Wednesday, he felt much better. He was happy to go back to school on Thursday.',
    ],
    questions: [
      {
        question: 'Why didn’t Leo go to school?',
        options: ['He felt ill', 'He was on holiday', 'He missed the bus'],
        answer: 0,
        evidence: 'On Monday morning, Leo did not go to school. He felt terrible.',
      },
      {
        question: 'What was wrong with Leo?',
        options: ['A bad cold', 'A broken leg', 'A toothache'],
        answer: 0,
        evidence: 'She said it was a bad cold, not the flu.',
      },
      {
        question: 'What did the doctor tell him to do?',
        options: ['Stay home and rest', 'Go to football practice', 'Go to school'],
        answer: 0,
        evidence: 'Dr. Patel told Leo to stay home for two days, drink a lot of water, and sleep.',
      },
      {
        question: 'Leo had a temperature.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'He had a headache, a sore throat, a cough, and a temperature.',
      },
      {
        question: 'Leo went back to school on Wednesday.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'He was happy to go back to school on Thursday.',
      },
    ],
  },
  listening: {
    title: 'At the Doctor’s',
    intro: 'Лео пришёл к врачу. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a2-02.mp3',
    lines: [
      { speaker: 'Doctor', text: 'Good morning, Leo. What seems to be the problem?', pitch: 0.94 },
      { speaker: 'Leo', text: 'I have a headache and a sore throat. I feel very tired.', pitch: 1.06 },
      { speaker: 'Doctor', text: 'How long have you felt like this?', pitch: 0.94 },
      { speaker: 'Leo', text: 'Since Sunday evening. I also have a cough.', pitch: 1.06 },
      { speaker: 'Doctor', text: 'Do you have a temperature?', pitch: 0.94 },
      { speaker: 'Leo', text: 'Yes, I think so.', pitch: 1.06 },
      { speaker: 'Doctor', text: 'You have a bad cold. Stay home for two days and drink a lot of water.', pitch: 0.94 },
      { speaker: 'Leo', text: 'Should I take any medicine?', pitch: 1.06 },
      { speaker: 'Doctor', text: 'Yes, take this for your headache. And no football this week.', pitch: 0.94 },
      { speaker: 'Leo', text: 'OK. Thank you, Doctor.', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'Leo has a headache and a sore',
        after: '.',
        answer: 'throat',
        accept: ['throat'],
      },
      {
        before: 'He has felt ill since',
        after: 'evening.',
        answer: 'Sunday',
        accept: ['sunday'],
      },
      {
        before: 'The doctor tells him to stay home for',
        after: 'days.',
        answer: 'two',
        accept: ['two', '2'],
      },
      {
        before: 'Leo should not play',
        after: 'this week.',
        answer: 'football',
        accept: ['football'],
      },
    ],
    questions: [
      {
        question: 'What is the problem?',
        options: ['A bad cold', 'A broken arm', 'A stomachache'],
        answer: 0,
      },
      {
        question: 'What should Leo do?',
        options: ['Rest and drink water', 'Go to football', 'Eat more'],
        answer: 0,
      },
    ],
    transcript: [
      'Doctor: Good morning, Leo. What seems to be the problem?',
      'Leo: I have a headache and a sore throat. I feel very tired.',
      'Doctor: How long have you felt like this?',
      'Leo: Since Sunday evening. I also have a cough.',
      'Doctor: Do you have a temperature?',
      'Leo: Yes, I think so.',
      'Doctor: You have a bad cold. Stay home for two days and drink a lot of water.',
      'Leo: Should I take any medicine?',
      'Doctor: Yes, take this for your headache. And no football this week.',
      'Leo: OK. Thank you, Doctor.',
    ],
  },
  writing: {
    title: 'Напиши сообщение о болезни',
    prompt:
      'Write a message to your friend. Say you are ill, what is wrong, and what the doctor said. Write 80–100 words.',
    minWords: 80,
    maxWords: 100,
    checklist: [
      'Есть приветствие и подпись.',
      'Сказано, что ты болен(на).',
      'Названы симптомы.',
      'Сказано, что посоветовал врач.',
    ],
    modelAnswer:
      'Hi Max,\n\nI am sorry, but I cannot come to school today. I have a bad cold. I have a headache, a sore throat, and a cough. I also have a temperature. I went to the doctor this morning. She said I should stay home for two days, drink a lot of water, and rest. I should not play football this week. I hope to see you on Thursday.\n\nGet well soon,\nLeo',
    usefulLanguage: ['I have a...', 'I feel...', 'The doctor said...', 'I hope to see you'],
  },
  speaking: {
    title: 'Расскажи, как ты болел',
    prompt:
      'Talk about a time you were ill. Say what was wrong, what you did, and how you felt. Speak for 60–90 seconds.',
    preparationSeconds: 45,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а), что болело.',
      'Сказал(а), что делал(а).',
      'Сказал(а), как себя чувствовал(а).',
      'Использовал(а) past simple.',
    ],
  },
}
