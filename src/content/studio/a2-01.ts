import type { StudioTask } from './types'

export const a2Studio01: StudioTask = {
  id: 'studio-a2-01',
  level: 'A2',
  title: 'Выходные в Нью-Йорке',
  subtitle: 'Reading · Listening · Writing · Speaking',
  goal: 'Прочитать рассказ о поездке, понять разговор в отеле, написать письмо о поездке и рассказать о путешествии',
  estimatedMinutes: 20,
  reading: {
    title: 'A Weekend in New York',
    hint: 'Выбери правильный вариант. В вопросах True / False выбери True или False.',
    paragraphs: [
      'Last month, Sofia visited New York for the first time. She went with her older sister, Maria. They stayed in a small hotel near Central Park. The hotel was not expensive, but it was clean and quiet. Their room was on the fifth floor.',
      'On Saturday morning, they walked in Central Park and took a lot of photos. Then they visited a famous museum. Sofia has always wanted to see the paintings there, and she was very happy. In the afternoon, they went shopping. Sofia bought a red scarf for her mother and a book for her father.',
      'In the evening, they ate pizza at a small restaurant. The waiter was friendly, and the food was delicious. After dinner, they saw a show on Broadway. Sofia loved the music and the actors.',
      'On Sunday, the weather was rainy, so they stayed in a café and wrote postcards. They flew home on Sunday evening. Sofia says it was a short trip, but she has already decided to go back next year.',
    ],
    questions: [
      {
        question: 'Who did Sofia go to New York with?',
        options: ['Her sister', 'Her mother', 'Her friend'],
        answer: 0,
        evidence: 'She went with her older sister, Maria.',
      },
      {
        question: 'Where was the hotel?',
        options: ['Near Central Park', 'Near the airport', 'Near the museum'],
        answer: 0,
        evidence: 'They stayed in a small hotel near Central Park.',
      },
      {
        question: 'What did Sofia buy for her mother?',
        options: ['A red scarf', 'A book', 'A postcard'],
        answer: 0,
        evidence: 'Sofia bought a red scarf for her mother and a book for her father.',
      },
      {
        question: 'The weather was rainy on Sunday.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'On Sunday, the weather was rainy.',
      },
      {
        question: 'Sofia has decided to go back next year.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'She has already decided to go back next year.',
      },
    ],
  },
  listening: {
    title: 'At the Hotel',
    intro: 'София приехала в отель и говорит с администратором. Сначала слушай целиком, потом заполни пропуски.',
    audio: 'audio/studio-a2-01.mp3',
    lines: [
      { speaker: 'Receptionist', text: 'Good afternoon. Welcome to the Park Hotel.', pitch: 0.94 },
      { speaker: 'Sofia', text: 'Hello. I have a reservation for two people. My name is Sofia Ramos.', pitch: 1.06 },
      { speaker: 'Receptionist', text: 'Let me check. Yes, a room for two nights. Is that correct?', pitch: 0.94 },
      { speaker: 'Sofia', text: 'Yes, that’s right. Is breakfast included?', pitch: 1.06 },
      { speaker: 'Receptionist', text: 'Yes, breakfast is from seven to ten in the café on the first floor.', pitch: 0.94 },
      { speaker: 'Sofia', text: 'Great. What time is check-out?', pitch: 1.06 },
      { speaker: 'Receptionist', text: 'Check-out is at eleven. Here are your keys. Your room is on the fifth floor.', pitch: 0.94 },
      { speaker: 'Sofia', text: 'Thank you very much.', pitch: 1.06 },
    ],
    notes: [
      {
        before: 'Sofia has a reservation for',
        after: 'nights.',
        answer: 'two',
        accept: ['two', '2'],
      },
      {
        before: 'Breakfast is from seven to',
        after: '.',
        answer: 'ten',
        accept: ['ten', '10'],
      },
      {
        before: 'Breakfast is in the café on the',
        after: 'floor.',
        answer: 'first',
        accept: ['first', '1st'],
      },
      {
        before: 'Check-out is at',
        after: '.',
        answer: 'eleven',
        accept: ['eleven', '11'],
      },
    ],
    questions: [
      {
        question: 'Where is Sofia?',
        options: ['At a hotel', 'At a train station', 'At a museum'],
        answer: 0,
      },
      {
        question: 'What time is check-out?',
        options: ['At eleven', 'At seven', 'At ten'],
        answer: 0,
      },
    ],
    transcript: [
      'Receptionist: Good afternoon. Welcome to the Park Hotel.',
      'Sofia: Hello. I have a reservation for two people. My name is Sofia Ramos.',
      'Receptionist: Let me check. Yes, a room for two nights. Is that correct?',
      'Sofia: Yes, that’s right. Is breakfast included?',
      'Receptionist: Yes, breakfast is from seven to ten in the café on the first floor.',
      'Sofia: Great. What time is check-out?',
      'Receptionist: Check-out is at eleven. Here are your keys. Your room is on the fifth floor.',
      'Sofia: Thank you very much.',
    ],
  },
  writing: {
    title: 'Напиши письмо о поездке',
    prompt:
      'Write an email to a friend about your trip to New York. Say where you stayed, what you did, and what you liked most. Write 80–100 words.',
    minWords: 80,
    maxWords: 100,
    checklist: [
      'Есть приветствие и подпись.',
      'Названо, где ты жил(а).',
      'Сказано, что ты делал(а).',
      'Сказано, что понравилось больше всего.',
    ],
    modelAnswer:
      'Hi Anna,\n\nLast month, I went to New York with my sister. We stayed in a small hotel near Central Park. On Saturday, we walked in the park and visited a museum. I bought a red scarf for my mother. In the evening, we saw a show on Broadway. The music was wonderful. On Sunday, it was rainy, so we wrote postcards in a café. I loved the trip and want to go back.\n\nSee you,\nSofia',
    usefulLanguage: ['We stayed in...', 'On Saturday, we...', 'I liked... most', 'I want to go back'],
  },
  speaking: {
    title: 'Расскажи о поездке',
    prompt:
      'Talk about a trip you enjoyed. Say where you went, who you were with, what you did, and why you liked it. Speak for 60–90 seconds.',
    preparationSeconds: 45,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а), куда ездил(а).',
      'Сказал(а), с кем был(а).',
      'Сказал(а), что делал(а).',
      'Объяснил(а), почему поездка понравилась.',
    ],
  },
}
