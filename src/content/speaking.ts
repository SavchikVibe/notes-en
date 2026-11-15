import type { Level } from './types'

export interface SpeakingTask {
  id: string
  level: Level
  title: string
  prompt: string
  preparationSeconds: number
  speakingSeconds: number
  checklist: string[]
  usefulLanguage?: string[]
  /** shadow — повторение готовых фраз за образцом. */
  mode?: 'answer' | 'shadow'
  lines?: string[]
}

/**
 * Отдельный блок речи: короткие ответы с записью и самопроверкой.
 * Задания привязаны к уровням курса, а не к юнитам, поэтому их можно
 * повторять независимо от прогресса.
 */
export const speakingTasks: SpeakingTask[] = [
  {
    id: 'speak-a1-01',
    level: 'A1',
    title: 'О себе',
    prompt:
      'Introduce yourself. Say your name, how old you are, where you are from, and what you do. Speak for 30–40 seconds.',
    preparationSeconds: 20,
    speakingSeconds: 40,
    checklist: [
      'Назвал(а) имя и возраст.',
      'Сказал(а), откуда ты.',
      'Сказал(а), что ты делаешь: I am a student.',
      'Использовал(а) am / is / are правильно.',
    ],
    usefulLanguage: ['My name is …', 'I am twelve years old.', 'I am from …', 'I am a student.'],
  },
  {
    id: 'speak-a1-02',
    level: 'A1',
    title: 'Моя семья',
    prompt:
      'Talk about your family. Say how many people are in your family, who they are, and one thing you do together.',
    preparationSeconds: 20,
    speakingSeconds: 45,
    checklist: [
      'Назвал(а), сколько человек в семье.',
      'Сказал(а), кто они: mother, father, sister, brother.',
      'Сказал(а), что вы делаете вместе.',
      'Говорил(а) целыми предложениями.',
    ],
    usefulLanguage: ['There are four people in my family.', 'We watch films together.'],
  },
  {
    id: 'speak-a1-03',
    level: 'A1',
    title: 'Моя комната',
    prompt:
      'Describe your room. Name four things in it and say where they are: on the desk, near the window, under the bed.',
    preparationSeconds: 20,
    speakingSeconds: 40,
    checklist: [
      'Назвал(а) четыре предмета.',
      'Использовал(а) on / in / under / near.',
      'Сказал(а), что тебе нравится в комнате.',
    ],
    usefulLanguage: ['There is a desk near the window.', 'My books are on the shelf.'],
  },
  {
    id: 'speak-a1-04',
    level: 'A1',
    title: 'Мой день',
    prompt:
      'Talk about your day. Say what you do in the morning, at school, and in the evening. Use three time expressions.',
    preparationSeconds: 20,
    speakingSeconds: 45,
    checklist: [
      'Сказал(а) про утро, школу и вечер.',
      'Использовал(а) in the morning, at school, in the evening.',
      'Использовал(а) present simple: I get up, I go, I have.',
    ],
    usefulLanguage: ['I get up at seven.', 'After school I do my homework.'],
  },
  {
    id: 'speak-a1-05',
    level: 'A1',
    title: 'Еда',
    prompt:
      'Talk about food. Say what your favorite food is, when you eat it, and who cooks in your family.',
    preparationSeconds: 20,
    speakingSeconds: 40,
    checklist: [
      'Назвал(а) любимую еду.',
      'Сказал(а), когда ты её ешь.',
      'Сказал(а), кто готовит дома.',
    ],
    usefulLanguage: ['My favorite food is …', 'My mother cooks it on Sundays.'],
  },
  {
    id: 'speak-a1-06',
    level: 'A1',
    title: 'Мой друг',
    prompt:
      'Talk about a friend. Say their name, how old they are, where you met, and what you do together.',
    preparationSeconds: 20,
    speakingSeconds: 45,
    checklist: [
      'Назвал(а) имя и возраст друга.',
      'Сказал(а), где вы познакомились.',
      'Сказал(а), что вы делаете вместе.',
    ],
    usefulLanguage: ['My friend is …', 'We play football together.'],
  },
  {
    id: 'speak-a2-01',
    level: 'A2',
    title: 'Прошлые выходные',
    prompt:
      'Talk about last weekend. Say where you were, who you were with, what you did, and whether you liked it.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Использовал(а) past simple: was, went, saw, played.',
      'Сказал(а), где и с кем был(а).',
      'Сказал(а), понравилось или нет, и почему.',
    ],
    usefulLanguage: ['Last Saturday I went to …', 'It was boring because …'],
  },
  {
    id: 'speak-a2-02',
    level: 'A2',
    title: 'Мой город',
    prompt:
      'Talk about your city or town. Name three places you like, say why, and mention one problem.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а) три места.',
      'Объяснил(а), почему они нравятся.',
      'Назвал(а) одну проблему города.',
    ],
    usefulLanguage: ['There is a park near …', 'The problem is that …'],
  },
  {
    id: 'speak-a2-03',
    level: 'A2',
    title: 'Любимое занятие',
    prompt:
      'Talk about a hobby. Say what it is, how often you do it, when you started, and why you like it.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а) занятие и частоту: every day, twice a week.',
      'Сказал(а), когда начал(а).',
      'Объяснил(а), почему нравится.',
    ],
    usefulLanguage: ['I started two years ago.', 'I like it because …'],
  },
  {
    id: 'speak-a2-04',
    level: 'A2',
    title: 'Планы на лето',
    prompt:
      'Talk about your plans for the summer. Say three things you are going to do and who you will do them with.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Использовал(а) going to для планов.',
      'Назвал(а) три плана.',
      'Сказал(а), с кем ты это сделаешь.',
    ],
    usefulLanguage: ['I am going to visit …', 'We are going to travel by train.'],
  },
  {
    id: 'speak-a2-05',
    level: 'A2',
    title: 'Школа',
    prompt:
      'Talk about school. Say which subject you like, which is difficult, and what makes a good teacher.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Назвал(а) любимый предмет.',
      'Назвал(а) трудный предмет и причину.',
      'Описал(а) хорошего учителя двумя прилагательными.',
    ],
    usefulLanguage: ['My favorite subject is …', 'A good teacher is patient and funny.'],
  },
  {
    id: 'speak-a2-06',
    level: 'A2',
    title: 'Покупка',
    prompt:
      'Talk about something you bought recently. Say what it was, where you bought it, how much it cost, and whether you are happy with it.',
    preparationSeconds: 30,
    speakingSeconds: 60,
    checklist: [
      'Использовал(а) past simple.',
      'Назвал(а) цену: it cost …',
      'Сказал(а), доволен(на) покупкой или нет.',
    ],
    usefulLanguage: ['I bought it in a shop near …', 'It was cheap, but very good.'],
  },
  {
    id: 'speak-b1-01',
    level: 'B1',
    title: 'Полезная привычка',
    prompt:
      'Describe a habit that helps you. Say what it is, when you started, how it changed your day, and whether you would recommend it.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а) привычку и время начала.',
      'Объяснил(а), как она изменила день.',
      'Дал(а) рекомендацию с would.',
      'Связал(а) идеи: because, so, although.',
    ],
    usefulLanguage: ['I got into the habit of …', 'It helps me because …', 'I would recommend …'],
  },
  {
    id: 'speak-b1-02',
    level: 'B1',
    title: 'Телефон и приложения',
    prompt:
      'Talk about how you use your phone. Say which apps you use most, how they help, and one thing you would like to change.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а) два приложения и их пользу.',
      'Сказал(а), сколько времени проводишь в телефоне.',
      'Предложил(а) одно изменение.',
    ],
    usefulLanguage: ['I use it mainly for …', 'It saves me time.', 'I wish I spent less time …'],
  },
  {
    id: 'speak-b1-03',
    level: 'B1',
    title: 'Поездка',
    prompt:
      'Describe a trip you remember. Say where you went, who was with you, what happened, and whether you would go again.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Рассказал(а) историю по порядку.',
      'Использовал(а) past simple и past continuous.',
      'Сказал(а), повторил(а) бы поездку или нет.',
    ],
    usefulLanguage: ['We were driving when …', 'It was worth it because …'],
  },
  {
    id: 'speak-b1-04',
    level: 'B1',
    title: 'Проблема в городе',
    prompt:
      'Describe one problem in your city: transport, rubbish, noise, or something else. Explain why it matters and suggest one solution.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а) проблему и объяснил(а), почему она важна.',
      'Предложил(а) решение.',
      'Использовал(а) should / could / need to.',
    ],
    usefulLanguage: ['The main problem is …', 'The city should …', 'This would help because …'],
  },
  {
    id: 'speak-b1-05',
    level: 'B1',
    title: 'После школы',
    prompt:
      'Talk about your plans after school. Say what you want to study or do, why, and what worries you about it.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а) план и причину.',
      'Сказал(а) о сомнении или трудности.',
      'Использовал(а) want to / hope to / plan to.',
    ],
    usefulLanguage: ['I hope to study …', 'I am not sure yet, because …'],
  },
  {
    id: 'speak-b1-06',
    level: 'B1',
    title: 'Спорт',
    prompt:
      'Talk about sport. Say what you play or watch, how often, and why some people do not exercise. Give one piece of advice.',
    preparationSeconds: 40,
    speakingSeconds: 90,
    checklist: [
      'Назвал(а) вид спорта и частоту.',
      'Объяснил(а), почему люди не занимаются.',
      'Дал(а) совет с should.',
    ],
    usefulLanguage: ['I play … twice a week.', 'Some people do not have time because …'],
  },
  {
    id: 'speak-b2-01',
    level: 'B2',
    title: 'Удалённая работа',
    prompt:
      'Discuss remote work. What are its main advantages and disadvantages for employees and for cities? Give your opinion with reasons.',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Назвал(а) плюс и минус для работника.',
      'Назвал(а) последствие для города.',
      'Высказал(а) своё мнение с аргументом.',
      'Использовал(а) linking words: however, on the other hand.',
    ],
    usefulLanguage: ['One advantage is …', 'On the other hand, …', 'In my view, …'],
  },
  {
    id: 'speak-b2-02',
    level: 'B2',
    title: 'Города без машин',
    prompt:
      'Some cities are removing cars from their centers. Do the benefits outweigh the problems? Consider residents, shops, and disabled people.',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Рассмотрел(а) две группы людей.',
      'Привёл(а) конкретный пример.',
      'Сделал(а) вывод, а не просто перечислил(а) мнения.',
    ],
    usefulLanguage: ['Supporters argue that …', 'Critics point out that …', 'Overall, I think …'],
  },
  {
    id: 'speak-b2-03',
    level: 'B2',
    title: 'Пищевые отходы',
    prompt:
      'A third of food is wasted. What can families, shops, and governments do about it? Which measure would be most effective, and why?',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Назвал(а) меры для трёх групп.',
      'Выбрал(а) самую эффективную и объяснил(а) почему.',
      'Использовал(а) would / could для гипотез.',
    ],
    usefulLanguage: ['Families could …', 'Supermarkets should be required to …', 'This would work if …'],
  },
  {
    id: 'speak-b2-04',
    level: 'B2',
    title: 'Телефоны в школе',
    prompt:
      'Should phones be banned during school hours? Discuss learning, safety, and social life, then give your recommendation.',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Рассмотрел(а) учёбу и безопасность.',
      'Упомянул(а) возможный контраргумент.',
      'Дал(а) чёткую рекомендацию.',
    ],
    usefulLanguage: ['It could be argued that …', 'Nevertheless, …', 'I would recommend …'],
  },
  {
    id: 'speak-b2-05',
    level: 'B2',
    title: 'Бесплатные музеи',
    prompt:
      'Should public museums be free for everyone? Discuss access, funding, and the quality of exhibitions.',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Обсудил(а) доступность и деньги.',
      'Привёл(а) пример страны или города.',
      'Сформулировал(а) условие: free if …',
    ],
    usefulLanguage: ['Free entry increases access, but …', 'A reasonable compromise would be …'],
  },
  {
    id: 'speak-b2-06',
    level: 'B2',
    title: 'Быстрая мода',
    prompt:
      'Who is responsible for the environmental cost of fast fashion: shoppers, brands, or governments? Explain your position and one practical step.',
    preparationSeconds: 45,
    speakingSeconds: 120,
    checklist: [
      'Назвал(а), кто несёт ответственность, и почему.',
      'Признал(а) сложность: цена, работа, привычка.',
      'Предложил(а) конкретный шаг.',
    ],
    usefulLanguage: ['The main responsibility lies with …', 'Consumers can …, but only if …'],
  },
  {
    id: 'speak-c1-01',
    level: 'C1',
    title: 'Внимание как ресурс',
    prompt:
      'Is attention a personal responsibility or a public issue? Discuss design, regulation, and individual choice, and say what should change.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Разделил(а) личную и общественную ответственность.',
      'Привёл(а) механизм: как дизайн влияет на выбор.',
      'Сформулировал(а) конкретное предложение.',
      'Использовал(а) точные связки: whereas, insofar as, arguably.',
    ],
    usefulLanguage: ['It is tempting to argue that …', 'The evidence suggests …', 'A more defensible position is …'],
  },
  {
    id: 'speak-c1-02',
    level: 'C1',
    title: 'Эффективность и устойчивость',
    prompt:
      'When should a system sacrifice efficiency for resilience? Use one example from business, health care, or infrastructure, and draw a general principle.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Взял(а) один конкретный пример.',
      'Объяснил(а) компромисс между эффективностью и устойчивостью.',
      'Сформулировал(а) общий принцип.',
    ],
    usefulLanguage: ['The trade-off is between …', 'In practice, this means …', 'The principle generalises to …'],
  },
  {
    id: 'speak-c1-03',
    level: 'C1',
    title: 'Доверие к науке',
    prompt:
      'Why does public trust in science fluctuate, and what could institutions do to earn it? Distinguish between trusting a method and trusting a claim.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Различил(а) метод и отдельное утверждение.',
      'Назвал(а) причину колебаний доверия.',
      'Предложил(а) институциональное решение.',
    ],
    usefulLanguage: ['Trust is calibrated, not absolute.', 'Institutions could …', 'This distinction matters because …'],
  },
  {
    id: 'speak-c1-04',
    level: 'C1',
    title: 'Карты и власть',
    prompt:
      'What does a map leave out, and why does that matter politically? Use one example: borders, data maps, or navigation apps.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Объяснил(а) идею отбора и искажения.',
      'Взял(а) один пример и разобрал(а) его.',
      'Связал(а) пример с вопросом власти.',
    ],
    usefulLanguage: ['Every map is a selection.', 'The omission is significant because …'],
  },
  {
    id: 'speak-c1-05',
    level: 'C1',
    title: 'Память и памятники',
    prompt:
      'Should contested monuments be removed, reinterpreted, or left in place? Argue for one option and address the strongest objection to it.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Выбрал(а) одну позицию.',
      'Назвал(а) сильнейшее возражение.',
      'Ответил(а) на возражение, а не проигнорировал(а).',
    ],
    usefulLanguage: ['The strongest objection is …', 'Even so, …', 'On balance, …'],
  },
  {
    id: 'speak-c1-06',
    level: 'C1',
    title: 'Исчезновение языков',
    prompt:
      'Does the loss of small languages matter beyond the communities that speak them? Discuss knowledge, identity, and cost.',
    preparationSeconds: 60,
    speakingSeconds: 150,
    checklist: [
      'Рассмотрел(а) знание и идентичность.',
      'Учёл(а) цену поддержки языков.',
      'Сформулировал(а) вывод с оговоркой.',
    ],
    usefulLanguage: ['It matters because …', 'The cost is real, yet …', 'A defensible conclusion is …'],
  },
  {
    id: 'speak-shadow-a1-01',
    level: 'A1',
    title: 'Ритм: мой день',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 10,
    speakingSeconds: 45,
    mode: 'shadow',
    lines: [
      'I usually get up at seven in the morning.',
      'Then I have breakfast and go to school.',
      'In the evening I do my homework.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сохранил(а) ритм и ударения.',
      'Во второй раз говорил(а) без листа.',
    ],
  },
  {
    id: 'speak-shadow-a1-02',
    level: 'A1',
    title: 'Ритм: мой друг',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 10,
    speakingSeconds: 45,
    mode: 'shadow',
    lines: [
      'My friend lives near the park.',
      'We play football on Saturdays.',
      'He is very good at it.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Не потерял(а) окончания слов.',
      'Сказал(а) фразы слитно, без пауз между словами.',
    ],
  },
  {
    id: 'speak-shadow-a2-01',
    level: 'A2',
    title: 'Ритм: прошлые выходные',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 15,
    speakingSeconds: 60,
    mode: 'shadow',
    lines: [
      'Last weekend I went to the market with my sister.',
      'We bought some fruit and a warm hat.',
      'It was cold, but we had a good time.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сохранил(а) past simple: went, bought, had.',
      'Связал(а) фразы интонацией, а не паузами.',
    ],
  },
  {
    id: 'speak-shadow-a2-02',
    level: 'A2',
    title: 'Ритм: планы',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 15,
    speakingSeconds: 60,
    mode: 'shadow',
    lines: [
      'I am going to visit my grandparents in July.',
      'We will travel by train and stay for a week.',
      'I hope the weather will be sunny.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сказал(а) going to и will без запинки.',
      'Сохранил(а) ровный темп.',
    ],
  },
  {
    id: 'speak-shadow-b1-01',
    level: 'B1',
    title: 'Ритм: учёба',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 20,
    speakingSeconds: 75,
    mode: 'shadow',
    lines: [
      'I have been learning English for about three years.',
      'At first it was difficult, but now I enjoy it.',
      'I try to practise a little every day.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сказал(а) have been learning без паузы.',
      'Сохранил(а) естественные ударения.',
    ],
  },
  {
    id: 'speak-shadow-b1-02',
    level: 'B1',
    title: 'Ритм: мой город',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 20,
    speakingSeconds: 75,
    mode: 'shadow',
    lines: [
      'One thing I would change about my city is the traffic.',
      'There are too many cars in the center.',
      'The city should build more bike lanes.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сказал(а) would change и should build правильно.',
      'Не разрывал(а) фразу на отдельные слова.',
    ],
  },
  {
    id: 'speak-shadow-b2-01',
    level: 'B2',
    title: 'Ритм: удалённая работа',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 25,
    speakingSeconds: 90,
    mode: 'shadow',
    lines: [
      'Although remote work saves time, it can make teamwork harder.',
      'On the other hand, it gives people more control.',
      'In my view, a hybrid model works best.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сохранил(а) логические ударения на although и on the other hand.',
      'Связал(а) фразы без длинных пауз.',
    ],
  },
  {
    id: 'speak-shadow-b2-02',
    level: 'B2',
    title: 'Ритм: жизнь в городе',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 25,
    speakingSeconds: 90,
    mode: 'shadow',
    lines: [
      'The main advantage of living in a city is access to opportunities.',
      'However, the cost of housing has risen sharply.',
      'This puts pressure on younger residents.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сказал(а) however с правильной интонацией.',
      'Сохранил(а) ровный темп в длинной фразе.',
    ],
  },
  {
    id: 'speak-shadow-c1-01',
    level: 'C1',
    title: 'Ритм: эффективность',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 30,
    speakingSeconds: 105,
    mode: 'shadow',
    lines: [
      'It is tempting to treat efficiency as an end in itself.',
      'In practice, however, resilient systems need a certain amount of slack.',
      'The question is not whether to optimize, but what to optimize for.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сохранил(а) паузы в длинных конструкциях.',
      'Сказал(а) фразы слитно, не по словам.',
    ],
  },
  {
    id: 'speak-shadow-c1-02',
    level: 'C1',
    title: 'Ритм: доверие',
    prompt: 'Listen to each line, then repeat all three without reading.',
    preparationSeconds: 30,
    speakingSeconds: 105,
    mode: 'shadow',
    lines: [
      'Trust in institutions depends less on claims than on behavior.',
      'When errors are acknowledged openly, credibility tends to recover.',
      'That is a slower process, and a more durable one.',
    ],
    checklist: [
      'Повторил(а) все три фразы.',
      'Сохранил(а) ударение на смысловых словах.',
      'Не потерял(а) окончания в быстрой речи.',
    ],
  },
]

export function speakingTasksFor(level: Level): SpeakingTask[] {
  return speakingTasks.filter((task) => task.level === level)
}
