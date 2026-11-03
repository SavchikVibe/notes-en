# CONTENT — формат контента

Источник истины — `src/content/types.ts`. Этот файл объясняет формат и правила проверки.

## Юнит

```ts
interface Unit {
  id: string;          // 'a1-01' — уровень + номер, уникален
  level: Level;        // 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  order: number;       // порядок в пути
  title: string;       // 'Глагол to be'
  subtitle?: string;   // 'I am · you are · he is'
  goal: string;        // 'Рассказать, кто ты и откуда'
  formulas: Formula[]; // карточка-формула перед упражнениями
  words: Word[];       // слова урока, попадают в словарь и SRS
  exercises: Exercise[];
}
```

**Formula** — карточка-формула. `label` — по-русски, `pattern` — конструкция, `note` — подсказка.

```ts
{ label: 'Он / она / оно', pattern: 'He / She / It + is', note: "He is = He's" }
```

## Слово

```ts
interface Word {
  id: string;          // 'student' — уникален во всём курсе
  term: string;        // 'student'
  ipa: string;         // 'ˈstuːdənt' — General American, без скобок
  translation: string; // 'студент, студентка'
  pos?: 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'pron' | 'conj' | 'phr';
  level: Level;
  examples: Example[]; // 3, английский + русский
  photo?: string;      // '/photos/student.webp' — только для конкретных слов
  tags?: string[];     // 'people', 'food', 'travel'
}
```

Курс — американский английский: IPA General American, орфография и лексика США. Третий пример хранится в `src/content/extra-examples.ts` и подмешивается при сборке контента.

Правило фото: конкретные слова (предметы, еда, места, люди, действия) — с фото; абстрактные (`likely`, `except`, `although`) — без фото, карточка держится на типографике.

## Упражнения

Шесть типов. Дискриминированный союз по полю `kind`.

### choice — выбрать вариант

```ts
{
  kind: 'choice',
  id: 'ex-01',
  question: 'I ___ from Russia.',   // ___ — место пропуска
  options: ['am', 'is', 'are'],
  answer: 0,                        // индекс правильного
  explanation: 'С «I» всегда am.'
}
```

### assemble — собрать предложение из слов

```ts
{
  kind: 'assemble',
  id: 'ex-02',
  task: 'Собери предложение',
  translation: 'Он из Канады.',            // подсказка по-русски
  words: ['He', 'is', 'are', 'from', 'Canada', 'she'], // банк, с ловушками
  answer: ['He', 'is', 'from', 'Canada'],
  explanation: 'Порядок: кто → to be → откуда.'
}
```

### translate — перевод RU → EN

```ts
{
  kind: 'translate',
  id: 'ex-03',
  source: 'Я студент.',
  accept: ['I am a student.', "I'm a student."], // все допустимые варианты
  sample: 'I am a student.',                     // показывается после ответа
  explanation: 'Перед профессией нужен артикль a.'
}
```

### listen — аудирование

```ts
{
  kind: 'listen',
  id: 'ex-04',
  audio: 'They are from Spain.',   // озвучивается TTS
  question: 'Что ты услышал?',
  mode: 'choice',                  // 'choice' | 'type'
  options: ['They are from Spain.', 'They are from France.', 'We are from Spain.'],
  answer: 0,
  translation: 'Они из Испании.'
}
```

### speak — повтор за диктором

```ts
{
  kind: 'speak',
  id: 'ex-05',
  phrase: 'I am from Russia.',
  translation: 'Я из России.'
}
```

### read — текст и вопросы

```ts
{
  kind: 'read',
  id: 'ex-06',
  title: 'Alex from Canada',
  paragraphs: ['Hi! My name is Alex. I am from Canada.'],
  questions: [
    { question: 'Where is Alex from?', options: ['Canada', 'Russia', 'Spain'], answer: 0 }
  ]
}
```

## Правила проверки

`npm run validate:content` проверяет:

1. `unit.id` уникален и совпадает с шаблоном `a1-01`.
2. `exercise.id` уникален внутри юнита.
3. `choice` / `listen(choice)` / `read`: 2–4 варианта, `answer` в диапазоне.
4. `assemble`: каждое слово ответа есть в банке `words` (с учётом повторов).
5. `translate`: `accept` не пуст, `sample` не пуст.
6. `speak`: `phrase` не пуст.
7. `read`: есть хотя бы один абзац и один вопрос.
8. Слова: `id` уникален во всём курсе, `term`, `ipa`, `translation` не пусты, 3 примера.
9. Нет пустых упражнений и юнитов.

## Как добавлять партию

1. 10 юнитов в `src/content/units/` — по файлу на юнит.
2. Импорт в `src/content/index.ts`.
3. `npm run validate:content` — без ошибок.
4. Проверка глазами: формулы, примеры, переводы.
5. Только потом следующая партия.

Не генерировать больше 10 уроков до того, как предыдущие 10 пройдены на практике.
