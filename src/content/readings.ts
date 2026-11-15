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
      'Chicago is a big city, and the food is very good. Tomorrow we are going to a baseball game.',
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
      'Today I saw a famous bridge. The food here is great, but it is expensive. See you soon! Max.',    ],
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
      'Hi Sam, I am happy because my cousin is visiting me next weekend. She lives in New York.',
      'We are going to see a movie and eat pizza on Saturday. On Sunday, we are going to the beach.',
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
      'Every morning we walk in the forest. One day we saw a lake.',
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
      'Next week, our class has a project about animals. I am writing about dolphins.',
      'Dolphins are smart and friendly. They live in the ocean and eat fish.',
      'My friend Anna is drawing a picture of a dolphin. We are presenting our project on Friday.',
    ],
    questions: [
      { question: 'What is the project about?', options: ['Animals', 'Cities', 'Food'], answer: 0 },
      { question: 'What animal does the writer choose?', options: ['A dog', 'A dolphin', 'A cat'], answer: 1 },
      { question: 'When is the presentation?', options: ['On Monday', 'On Friday', 'Next month'], answer: 1 },
    ],
  },
  {
    id: 'reading-11',
    level: 'A2',
    title: 'A New Neighbor',
    paragraphs: [
      'Last month, a new family moved into the house next to Nora’s. The house was empty for a long time, so Nora was curious. She saw boxes, a bicycle, and a small dog in the yard. The family has two children, a boy and a girl. The boy is named Sam, and he is the same age as Nora.',
      'On Saturday, Nora’s mother made a cake and asked Nora to take it to the new neighbors. Nora was nervous. She did not know what to say. She knocked on the door, and Sam opened it. “Hello,” Nora said. “My mother made this cake for you. Welcome to the neighborhood.” Sam smiled. “Thank you! Would you like to come in? My sister and I are making a puzzle.”',
      'Nora went inside. The puzzle was a picture of a big city. Sam’s sister, Lily, showed Nora the pieces. They worked on the puzzle for an hour and drank lemonade. They talked about school, music, and their favorite books. Lily is two years younger, but she knew a lot about animals.',
      'Now Nora and Sam walk to school together. They have become good friends. Nora is happy that she knocked on the door. She says, “Sometimes a small cake is the beginning of a big friendship.”',
    ],
    questions: [
      {
        question: 'Who moved next to Nora?',
        options: ['A new family', 'A teacher', 'Her cousin'],
        answer: 0,
        evidence: 'Last month, a new family moved into the house next to Nora’s.',
      },
      {
        question: 'What did Nora’s mother make?',
        options: ['A cake', 'A pizza', 'A salad'],
        answer: 0,
        evidence: 'On Saturday, Nora’s mother made a cake.',
      },
      {
        question: 'What did Sam and Nora do inside?',
        options: ['A puzzle', 'Their homework', 'A football game'],
        answer: 0,
        evidence: 'My sister and I are making a puzzle.',
      },
      {
        question: 'Nora was not nervous.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'Nora was nervous.',
      },
      {
        question: 'Nora and Sam walk to school together now.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'Now Nora and Sam walk to school together.',
      },
    ],
  },
  {
    id: 'reading-12',
    level: 'A2',
    title: 'The School Trip',
    paragraphs: [
      'Last Friday, Class 8B went on a school trip to a science museum. They left school at eight o’clock and traveled by bus. The journey took one hour. On the bus, the students talked about the robots they wanted to see.',
      'At the museum, a guide showed them a robot that could draw pictures. The students asked many questions. Then they visited a room about space. They saw a model of Mars and learned about the first moon landing. The guide explained how astronauts live and work in space.',
      'After lunch, the class had a workshop. They built small cars from plastic pieces. The cars had to move using a balloon. Tom’s car went the fastest. Everyone clapped. The teacher took photos for the school website.',
      'On the way home, the bus was quiet. Many students were tired, but they were happy. Their teacher said, “You asked excellent questions today. I am proud of you.” The next week, the class wrote a report about the trip. Tom wrote about the balloon cars. He said it was the best school trip of the year.',
    ],
    questions: [
      {
        question: 'Where did Class 8B go?',
        options: ['A science museum', 'A zoo', 'A farm'],
        answer: 0,
        evidence: 'Class 8B went on a school trip to a science museum.',
      },
      {
        question: 'How did they travel?',
        options: ['By bus', 'By train', 'By car'],
        answer: 0,
        evidence: 'They left school at eight o’clock and traveled by bus.',
      },
      {
        question: 'What did they build?',
        options: ['Small cars', 'Robots', 'Rockets'],
        answer: 0,
        evidence: 'They built small cars from plastic pieces.',
      },
      {
        question: 'Tom’s car went the fastest.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'Tom’s car went the fastest.',
      },
      {
        question: 'The students were noisy on the way home.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'On the way home, the bus was quiet.',
      },
    ],
  },
  {
    id: 'reading-13',
    level: 'A2',
    title: 'A Healthy Habit',
    paragraphs: [
      'Leo used to drink two cans of soda every day. He also ate chips after school and did not exercise. He often felt tired, and he could not concentrate in class. His mother was worried, so she made an appointment with the doctor.',
      'One day, his doctor said, “You do not need a special diet. You need three small habits.” First, Leo started drinking water instead of soda. Second, he walked to school instead of taking the bus. Third, he ate fruit for an afternoon snack. The doctor said, “Do not try to change everything at once.”',
      'The first week was difficult. Leo missed the taste of soda, and he was hungry after school. But he did not give up. He wrote a note on his desk: “One small choice at a time.” His mother helped him by keeping a bottle of water in the fridge.',
      'After a month, Leo felt better. He had more energy, and he could concentrate in class. He also slept better. His doctor was happy. Leo still drinks soda sometimes, but not every day. He says, “I did not change my whole life. I changed three small things.”',
    ],
    questions: [
      {
        question: 'What did Leo use to drink every day?',
        options: ['Two cans of soda', 'Two cups of tea', 'A bottle of juice'],
        answer: 0,
        evidence: 'Leo used to drink two cans of soda every day.',
      },
      {
        question: 'What was the first habit?',
        options: ['Drinking water instead of soda', 'Running every day', 'Eating more chips'],
        answer: 0,
        evidence: 'First, Leo started drinking water instead of soda.',
      },
      {
        question: 'How did Leo go to school after the change?',
        options: ['He walked', 'He took the bus', 'He cycled'],
        answer: 0,
        evidence: 'Second, he walked to school instead of taking the bus.',
      },
      {
        question: 'The first week was easy.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'The first week was difficult.',
      },
      {
        question: 'Leo still drinks soda sometimes.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'Leo still drinks soda sometimes, but not every day.',
      },
    ],
  },
  {
    id: 'reading-14',
    level: 'A2',
    title: 'The Lost Phone',
    paragraphs: [
      'On Sunday afternoon, Maya and her friend Jess were shopping in the city center. Maya was trying on a jacket when she realized her phone was not in her bag. She looked in her pockets, under the chair, and on the floor. The phone was gone.',
      'Maya was worried. Her phone had photos, messages, and her train ticket. Jess said, “Let’s go back to the last shop. Maybe someone found it.” They walked back to the bookstore. Maya asked the assistant, “Excuse me, did anyone find a phone?”',
      'The assistant checked a drawer and smiled. “Is it a black phone with a blue case?” Maya said yes. A customer had found it near the magazines and given it to the assistant. The customer was still in the shop, so Maya thanked her too.',
      'Maya was very happy. On the train home, she said to Jess, “I was lucky. Next time, I will keep my phone in my zipped pocket.” Jess laughed. “And I will check my bag before I try on a jacket.”',
    ],
    questions: [
      {
        question: 'What was Maya doing when she lost her phone?',
        options: ['Shopping', 'Reading', 'Cooking'],
        answer: 0,
        evidence: 'Maya and her friend Jess were shopping in the city center.',
      },
      {
        question: 'Where did they go back?',
        options: ['The bookstore', 'The train station', 'The café'],
        answer: 0,
        evidence: 'They walked back to the bookstore.',
      },
      {
        question: 'Who found the phone?',
        options: ['A customer', 'Jess', 'The assistant'],
        answer: 0,
        evidence: 'A customer had found it near the magazines.',
      },
      {
        question: 'Maya’s phone had her train ticket.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'Her phone had photos, messages, and her train ticket.',
      },
      {
        question: 'Maya was not worried.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'Maya was worried.',
      },
    ],
  },
  {
    id: 'reading-15',
    level: 'A2',
    title: 'A Small Business',
    paragraphs: [
      'Three years ago, Ana started a small business from her kitchen. She made candles and sold them to friends and neighbors. At first, she had only ten customers. She worked in the evening, after her day job. Her kitchen smelled of lavender and lemon.',
      'Ana learned quickly. She asked customers what they liked, and she changed her products. She started making candles with lavender and lemon. She also opened an online shop. Soon, people from other cities were buying her candles. Ana was surprised, but she was ready to work harder.',
      'Last year, Ana moved her business into a small workshop. She hired one assistant, her cousin. They now sell about 300 candles a month. Ana still makes some candles herself, but she spends more time on planning and orders. She has also started using recycled boxes.',
      'Ana says, “The most important thing was listening. I did not start with a perfect plan. I started with one product and learned from my customers.” She wants to open a second workshop next year, but she wants to grow slowly. “Fast growth is not always good growth,” she says.',
    ],
    questions: [
      {
        question: 'What did Ana make at first?',
        options: ['Candles', 'Soap', 'Cakes'],
        answer: 0,
        evidence: 'She made candles and sold them to friends and neighbors.',
      },
      {
        question: 'Where did she work at first?',
        options: ['In her kitchen', 'In a shop', 'In an office'],
        answer: 0,
        evidence: 'Ana started a small business from her kitchen.',
      },
      {
        question: 'Who is her assistant?',
        options: ['Her cousin', 'Her sister', 'Her friend'],
        answer: 0,
        evidence: 'She hired one assistant, her cousin.',
      },
      {
        question: 'Ana started with a perfect plan.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'I did not start with a perfect plan.',
      },
      {
        question: 'They sell about 300 candles a month now.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'They now sell about 300 candles a month.',
      },
    ],
  },
  {
    id: 'reading-16',
    level: 'A2',
    title: 'The Weather Changes',
    paragraphs: [
      'Every summer, the town of Riverside has a festival in the park. Last year, the weather was sunny and dry. This year, the festival was different. In the morning, the sky was clear. Families arrived with blankets and food. Children played near the river.',
      'At two o’clock, dark clouds appeared. The wind became stronger, and the first drops of rain fell. People ran to the school hall. The festival continued inside. The music group played, and the children made paper boats. Everyone was a little wet, but nobody was unhappy.',
      '“We cannot change the weather,” said the mayor. “But we can change our plans.” The rain stopped at five o’clock. A rainbow appeared over the river. People went outside and took photos. The festival ended with a small fireworks show.',
      'This year, the town will prepare two plans: one for sunny weather and one for rain. The mayor says, “If we are ready, the weather will not stop us.” The festival will also have a text-message alert so families know where to go.',
    ],
    questions: [
      {
        question: 'Where was the festival?',
        options: ['In the park', 'At school', 'Near the sea'],
        answer: 0,
        evidence: 'Every summer, the town of Riverside has a festival in the park.',
      },
      {
        question: 'What happened at two o’clock?',
        options: ['It started to rain', 'The music stopped', 'The park closed'],
        answer: 0,
        evidence: 'At two o’clock, dark clouds appeared... the first drops of rain fell.',
      },
      {
        question: 'Where did people go?',
        options: ['The school hall', 'Their homes', 'The river'],
        answer: 0,
        evidence: 'People ran to the school hall.',
      },
      {
        question: 'The festival stopped completely.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'The festival continued inside.',
      },
      {
        question: 'The town will prepare two plans this year.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'This year, the town will prepare two plans: one for sunny weather and one for rain.',
      },
    ],
  },
  {
    id: 'reading-17',
    level: 'A2',
    title: 'A Message from Camp',
    paragraphs: [
      'Hi Mom and Dad, I am at camp, and I am fine. The camp is near a lake, and the water is cold but clean. I have already made three friends. Their names are Ben, Lily, and Sam. We sleep in a small cabin with four beds.',
      'Every morning, we have breakfast at seven thirty. Then we have activities. Yesterday, I tried kayaking. It was difficult at first, but I did not fall in. In the afternoon, we hiked in the forest. We saw a deer and a lot of birds. My legs are tired, but I am happy.',
      'The food is OK. We have pasta, soup, and fruit. I miss your cooking, Mom, but I am not hungry. Tomorrow, we are going to have a campfire. Ben is going to play the guitar, and Lily is going to tell a story. I am going to sing, but please do not laugh.',
      'I will come home on Sunday afternoon. See you soon! Love, Alex.',
    ],
    questions: [
      {
        question: 'Where is Alex?',
        options: ['At camp', 'At school', 'At home'],
        answer: 0,
        evidence: 'I am at camp, and I am fine.',
      },
      {
        question: 'What did Alex try yesterday?',
        options: ['Kayaking', 'Swimming', 'Fishing'],
        answer: 0,
        evidence: 'Yesterday, I tried kayaking.',
      },
      {
        question: 'What will they do tomorrow?',
        options: ['Have a campfire', 'Go home', 'Visit a museum'],
        answer: 0,
        evidence: 'Tomorrow, we are going to have a campfire.',
      },
      {
        question: 'Alex has made three friends.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'I have already made three friends.',
      },
      {
        question: 'Alex will come home on Saturday.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'I will come home on Sunday afternoon.',
      },
    ],
  },
  {
    id: 'reading-18',
    level: 'A2',
    title: 'The Community Garden',
    paragraphs: [
      'Two years ago, an empty lot near the library was full of trash and dry grass. Nobody used it. Then a group of neighbors had an idea: why not turn it into a community garden? They asked the city for permission and promised to keep the area clean.',
      'The city agreed to let them use the land for three years. The neighbors cleaned the lot and built twelve raised beds. They planted tomatoes, beans, herbs, and flowers. Some people did not have a garden, so they shared a bed with another family. Children helped to water the plants.',
      'The garden has changed the neighborhood. People meet there on Saturdays and talk. Children learn where food comes from. The garden also helps the environment: the plants cool the air and the soil absorbs rainwater. The neighbors have started a small seed library, too.',
      'The project is not perfect. Weeds grow quickly, and the water bill is higher than expected. But the neighbors have a plan. They will collect rainwater in two large barrels and ask local shops for help with tools. Maria, one of the organizers, says, “We did not wait for a big project. We started with one small garden. Now everyone knows their neighbors.”',
    ],
    questions: [
      {
        question: 'What was the lot before?',
        options: ['Full of trash', 'A playground', 'A parking lot'],
        answer: 0,
        evidence: 'An empty lot near the library was full of trash and dry grass.',
      },
      {
        question: 'How many raised beds did they build?',
        options: ['Twelve', 'Two', 'Twenty'],
        answer: 0,
        evidence: 'The neighbors cleaned the lot and built twelve raised beds.',
      },
      {
        question: 'What will they collect?',
        options: ['Rainwater', 'Old tools', 'Flowers'],
        answer: 0,
        evidence: 'They will collect rainwater in two large barrels.',
      },
      {
        question: 'The project is perfect.',
        options: ['True', 'False'],
        answer: 1,
        type: 'tfng',
        evidence: 'The project is not perfect.',
      },
      {
        question: 'The garden helps people meet their neighbors.',
        options: ['True', 'False'],
        answer: 0,
        type: 'tfng',
        evidence: 'People meet there on Saturdays and talk... Now everyone knows their neighbors.',
      },
    ],
  },
]
