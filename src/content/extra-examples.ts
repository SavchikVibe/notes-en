import type { Example } from './types'

/**
 * Третий пример к каждому слову: другая ситуация, чем в первых двух.
 * Держим отдельно, чтобы не раздувать файлы юнитов и легко менять при ревизии.
 */
export const extraExamples: Record<string, Example> = {
  student: { en: 'The student next to me is from Brazil.', ru: 'Студент рядом со мной из Бразилии.' },
  teacher: { en: 'The teacher gave us homework for Friday.', ru: 'Учитель задал нам домашнее задание на пятницу.' },
  from: { en: 'This cheese is from California.', ru: 'Этот сыр из Калифорнии.' },
  country: { en: 'Canada is a cold country in the north.', ru: 'Канада — холодная страна на севере.' },
  city: { en: 'We walked around the city all evening.', ru: 'Мы гуляли по городу весь вечер.' },
  friend: { en: 'My friend sent me a photo from New York.', ru: 'Мой друг прислал мне фото из Нью-Йорка.' },

  mother: { en: 'My mother works at a hospital.', ru: 'Моя мама работает в больнице.' },
  father: { en: 'My father cooks dinner on Sundays.', ru: 'Мой папа готовит ужин по воскресеньям.' },
  brother: { en: 'My brother plays soccer after school.', ru: 'Мой брат играет в футбол после школы.' },
  sister: { en: 'My sister lives in Chicago with her husband.', ru: 'Моя сестра живёт в Чикаго с мужем.' },
  family: { en: 'We visit my family every summer.', ru: 'Мы навещаем мою семью каждое лето.' },
  name: { en: 'Please write your name at the top of the page.', ru: 'Пожалуйста, напиши своё имя вверху страницы.' },

  doctor: { en: 'The doctor says I need more sleep.', ru: 'Врач говорит, что мне нужно больше спать.' },
  engineer: { en: 'An engineer built this bridge in 1998.', ru: 'Инженер построил этот мост в 1998 году.' },
  driver: { en: 'The driver stopped at the red light.', ru: 'Водитель остановился на красный свет.' },
  cook: { en: 'The cook made soup for the whole family.', ru: 'Повар приготовил суп для всей семьи.' },
  nurse: { en: 'The nurse gave me some water.', ru: 'Медсестра дала мне воды.' },
  job: { en: 'My first job was in a coffee shop.', ru: 'Моя первая работа была в кофейне.' },

  book: { en: 'I read this book on the train.', ru: 'Я читал эту книгу в поезде.' },
  pen: { en: 'Can I borrow your pen for a minute?', ru: 'Можно мне взять твою ручку на минуту?' },
  table: { en: 'We sat at the table by the window.', ru: 'Мы сидели за столом у окна.' },
  chair: { en: 'This chair is too small for the kitchen.', ru: 'Этот стул слишком маленький для кухни.' },
  phone: { en: 'My phone is charging in the bedroom.', ru: 'Мой телефон заряжается в спальне.' },
  bag: { en: 'My bag is full of books and papers.', ru: 'Моя сумка полна книг и бумаг.' },

  live: { en: 'My grandparents live in a small town.', ru: 'Мои бабушка и дедушка живут в маленьком городке.' },
  work: { en: 'I work from home on Fridays.', ru: 'По пятницам я работаю из дома.' },
  study: { en: 'We study history and math at school.', ru: 'В школе мы изучаем историю и математику.' },
  play: { en: 'The children play outside after dinner.', ru: 'Дети играют на улице после ужина.' },
  like: { en: 'I like this song very much.', ru: 'Мне очень нравится эта песня.' },
  speak: { en: 'Can you speak more slowly, please?', ru: 'Можешь говорить помедленнее, пожалуйста?' },

  'get-up': { en: 'I get up early on weekdays.', ru: 'По будням я встаю рано.' },
  go: { en: 'We go to the gym three times a week.', ru: 'Мы ходим в спортзал три раза в неделю.' },
  have: { en: 'I have two tickets for the concert.', ru: 'У меня есть два билета на концерт.' },
  watch: { en: 'We watch the news after dinner.', ru: 'Мы смотрим новости после ужина.' },
  read: { en: 'I read the news on my phone every morning.', ru: 'Каждое утро я читаю новости в телефоне.' },
  eat: { en: 'We eat lunch at noon.', ru: 'Мы обедаем в полдень.' },

  need: { en: 'I need a new pair of shoes.', ru: 'Мне нужна новая пара обуви.' },
  want: { en: 'Do you want to come with us?', ru: 'Хочешь пойти с нами?' },
  understand: { en: "I don't understand this question.", ru: 'Я не понимаю этот вопрос.' },
  know: { en: 'Do you know the way to the station?', ru: 'Ты знаешь дорогу до станции?' },
  drink: { en: 'I drink water during the day.', ru: 'Днём я пью воду.' },
  sleep: { en: 'I sleep eight hours every night.', ru: 'Я сплю восемь часов каждую ночь.' },

  what: { en: 'What time does the store open?', ru: 'Во сколько открывается магазин?' },
  where: { en: 'Where did you buy those shoes?', ru: 'Где ты купил эти туфли?' },
  when: { en: 'When is your next English class?', ru: 'Когда твой следующий урок английского?' },
  why: { en: 'Why are you late today?', ru: 'Почему ты сегодня опоздал?' },
  who: { en: 'Who is that man in the blue jacket?', ru: 'Кто этот мужчина в синей куртке?' },
  how: { en: 'How do you spell your last name?', ru: 'Как пишется твоя фамилия?' },

  morning: { en: 'The morning is my favorite time to study.', ru: 'Утро — моё любимое время для учёбы.' },
  afternoon: { en: 'We have a meeting in the afternoon.', ru: 'У нас встреча днём.' },
  evening: { en: 'The evening was warm and quiet.', ru: 'Вечер был тёплым и тихим.' },
  night: { en: 'The city is beautiful at night.', ru: 'Город красив ночью.' },
  today: { en: 'Today is a good day for a walk.', ru: 'Сегодня хороший день для прогулки.' },
  tomorrow: { en: 'The test is tomorrow morning.', ru: 'Тест завтра утром.' },

  parents: { en: 'My parents are visiting us this weekend.', ru: 'Мои родители приезжают к нам на выходных.' },
  son: { en: 'Their son plays the guitar.', ru: 'Их сын играет на гитаре.' },
  daughter: { en: 'Her daughter goes to high school.', ru: 'Её дочь учится в старшей школе.' },
  husband: { en: 'Her husband cooks on weekends.', ru: 'Её муж готовит по выходным.' },
  wife: { en: 'His wife works at a bank.', ru: 'Его жена работает в банке.' },
  children: { en: 'The children are playing in the yard.', ru: 'Дети играют во дворе.' },
}
