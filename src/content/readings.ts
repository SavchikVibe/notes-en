import type { Level, ReadQuestion } from './types'

export interface Reading {
  id: string
  level: Level
  title: string
  paragraphs: string[]
  questions: ReadQuestion[]
}

export const readings: Reading[] = [
  {
    id: 'reading-01',
    level: 'A1',
    title: 'A Message from Alex',
    paragraphs: [
      'Hi! How are you? I am in Chicago with my family. We are at my aunt’s house.',
      'Chicago is a big city, and the food is very good. Tomorrow we go to a baseball game.',
      'Do you like baseball? Write me later! Alex.',
    ],
    questions: [
      { question: 'Where is Alex?', options: ['In Chicago', 'In New York', 'In Moscow'], answer: 0 },
      { question: 'Who is he with?', options: ['His friends', 'His family', 'His teacher'], answer: 1 },
      {
        question: 'What do they do tomorrow?',
        options: ['Go to a baseball game', 'Go to school', 'Go to the beach'],
        answer: 0,
      },
    ],
  },
  {
    id: 'reading-02',
    level: 'A1',
    title: 'At the Coffee Shop',
    paragraphs: [
      'Barista: Good morning! What would you like?',
      'Anna: A coffee, please. And a bagel.',
      'Barista: Anything else?',
      'Anna: No, thank you. How much is it?',
      'Barista: Five dollars.',
      'Anna: Here you are.',
      'Barista: Thank you. Have a nice day!',
    ],
    questions: [
      {
        question: 'What does Anna order?',
        options: ['Coffee and a bagel', 'Tea and a cake', 'Water and a sandwich'],
        answer: 0,
      },
      { question: 'How much is it?', options: ['Three dollars', 'Five dollars', 'Ten dollars'], answer: 1 },
      {
        question: 'What does the barista say at the end?',
        options: ['Good night!', 'See you tomorrow!', 'Have a nice day!'],
        answer: 2,
      },
    ],
  },
  {
    id: 'reading-03',
    level: 'A1',
    title: 'A Postcard from California',
    paragraphs: [
      'Dear Ben, I am in California for a week. The weather is warm and sunny.',
      'In the morning I swim in the ocean, and in the afternoon I walk in the city.',
      'Today I see a famous bridge. The food here is great, but it is expensive. See you soon! Max.',    ],
    questions: [
      { question: 'Where is Max?', options: ['In California', 'In Canada', 'In Chicago'], answer: 0 },
      { question: 'What does he do in the morning?', options: ['He walks', 'He swims', 'He reads'], answer: 1 },
      {
        question: 'What does he see today?',
        options: ['A famous bridge', 'A big park', 'A baseball game'],
        answer: 0,
      },
    ],
  },
  {
    id: 'reading-04',
    level: 'A1',
    title: 'School Notice',
    paragraphs: [
      'School starts on Monday, September 8. All students must be at school at 8:30.',
      'Please bring a notebook, two pens, and a water bottle.',
      'There is no class on Friday because it is a day off. The school library is open from 9:00 to 4:00 every day.',
    ],
    questions: [
      {
        question: 'When does school start?',
        options: ['Monday, September 8', 'Friday, September 5', 'Monday, October 8'],
        answer: 0,
      },
      {
        question: 'What must students bring?',
        options: ['A phone and a bag', 'A notebook, two pens, and a water bottle', 'A book and a ball'],
        answer: 1,
      },
      { question: 'Why is there no class on Friday?', options: ['It is a day off', 'It is a test day', 'It is a short day'], answer: 0 },
    ],
  },
  {
    id: 'reading-05',
    level: 'A1',
    title: 'A Note from Mom',
    paragraphs: [
      'Hi, I am at the grocery store. We need milk, eggs, and bread for dinner.',
      'Your father is at work, and your sister is at soccer practice.',
      'Please clean your room before I come home. Dinner is at seven. Love, Mom.',
    ],
    questions: [
      { question: 'Where is Mom?', options: ['At home', 'At the grocery store', 'At work'], answer: 1 },
      { question: 'What does she need?', options: ['Milk, eggs, and bread', 'Apples and juice', 'Cheese and tea'], answer: 0 },
      { question: 'When is dinner?', options: ['At six', 'At seven', 'At eight'], answer: 1 },
    ],
  },
  {
    id: 'reading-06',
    level: 'A1',
    title: 'My City',
    paragraphs: [
      'I live in a small city near the mountains. It is quiet, and the people are friendly.',
      'There is a big park in the center, and a river near my house.',
      'In summer, my friends and I play soccer in the park. In winter, we go skiing. I like my city very much.',
    ],
    questions: [
      { question: 'Where is the city?', options: ['Near the mountains', 'Near the ocean', 'Near a big lake'], answer: 0 },
      { question: 'What is in the center?', options: ['A school', 'A big park', 'A grocery store'], answer: 1 },
      { question: 'What do they do in winter?', options: ['They swim', 'They play soccer', 'They go skiing'], answer: 2 },
    ],
  },
  {
    id: 'reading-07',
    level: 'A1',
    title: 'An Email about a Visit',
    paragraphs: [
      'Hi Sam, I am happy because my cousin visits me next weekend. She lives in New York.',
      'We see a movie and eat pizza on Saturday. On Sunday, we go to the beach.',
      'The weather is sunny. Can you come with us? Write back! Leo.',
    ],
    questions: [
      { question: 'Who visits Leo?', options: ['His cousin', 'His brother', 'His friend Sam'], answer: 0 },
      {
        question: 'What do they do on Saturday?',
        options: ['See a movie and eat pizza', 'Go to the beach', 'Play baseball'],
        answer: 0,
      },
      { question: 'Where do they go on Sunday?', options: ['To the park', 'To the beach', 'To New York'], answer: 1 },
    ],
  },
  {
    id: 'reading-08',
    level: 'A1',
    title: 'The Dog Next Door',
    paragraphs: [
      'My neighbor has a big brown dog. His name is Max.',
      'Every morning, Max runs in the yard and plays with a ball. He likes people, but he does not like cats.',
      'In the evening, he sleeps near the door. My little sister loves Max and gives him food.',
    ],
    questions: [
      { question: 'What color is the dog?', options: ['Black', 'Brown', 'White'], answer: 1 },
      {
        question: 'What does Max do every morning?',
        options: ['He sleeps', 'He runs and plays', 'He eats'],
        answer: 1,
      },
      { question: 'What does Max not like?', options: ['Cats', 'People', 'Balls'], answer: 0 },
    ],
  },
  {
    id: 'reading-09',
    level: 'A1',
    title: 'A Trip to the Mountains',
    paragraphs: [
      'Every summer, my family goes to the mountains. We stay in a small cabin for five days.',
      'Every morning we walk in the forest. One day we see a lake.',
      'The water is cold, but my brother swims in it. In the evening, we cook dinner and play cards. It is a great trip.',
    ],
    questions: [
      { question: 'Where does the family go?', options: ['To the mountains', 'To the ocean', 'To a big city'], answer: 0 },
      { question: 'How long do they stay?', options: ['Two days', 'Five days', 'Ten days'], answer: 1 },
      { question: 'What do they see one day?', options: ['A lake', 'A bridge', 'A dog'], answer: 0 },
    ],
  },
  {
    id: 'reading-10',
    level: 'A1',
    title: 'A Class Project',
    paragraphs: [
      'Next week, our class has a project about animals. I write about dolphins.',
      'Dolphins are smart and friendly. They live in the ocean and eat fish.',
      'My friend Anna draws a picture of a dolphin. We present our project on Friday.',
    ],
    questions: [
      { question: 'What is the project about?', options: ['Animals', 'Cities', 'Food'], answer: 0 },
      { question: 'What animal does the writer choose?', options: ['A dog', 'A dolphin', 'A cat'], answer: 1 },
      { question: 'When is the presentation?', options: ['On Monday', 'On Friday', 'Next month'], answer: 1 },
    ],
  },
]
