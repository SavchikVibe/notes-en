# Accept-list pass — A1–C1 translations

Date: 2026-11-22 (B2/C1), 2026-11-25 (B1, A2, A1). Scope: every `translate` exercise in A1
(120), A2 (150), B1 (180), B2 (180) and C1 (72), 702 items.
Method: each item was read against its Russian source; alternatives were added only when they
are real, grammatical paraphrases (passive/active, may/might, has/there is, close verbs,
word order). No fuzzy matching, no mechanical substitution.

Implementation: `src/content/accept-variants.ts`, merged into `accept` by
`src/content/index.ts` (`withAcceptVariants`). `npm run check:accept` validates the map and
reports coverage.

## Result

| Level | Translations | With variants | Intentionally single |
|---|---:|---:|---:|
| A1 | 120 | 97 | 23 |
| A2 | 150 | 136 | 14 |
| B1 | 180 | 165 | 15 |
| B2 | 180 | 172 | 8 |
| C1 | 72 | 69 | 3 |
| **Total** | **702** | **639** | **63** |

Before the pass, 13 B2/C1 items had variants (mostly the concrete fixes from the review). After
the pass, 639 of 702 have at least two curated answers.

## A1 pass (2026-11-25)

23 A1 translations were left single after review:

| Id | Why one |
|---|---|
| `a1-03-workshop-translate` | `He is an engineer.` — fixed profession. |
| `a1-07-workshop-translate` | `soccer` is the US term; `football` would mean a different sport. |
| `a1-08-extra-03` | `Where does she work?` — fixed question. |
| `a1-08-workshop-translate` | `Where do you live?` — fixed question. |
| `a1-09-workshop-translate` | `I am at home today.` — contraction `I'm` handled by normalization. |
| `a1-10-extra-03` | `My parents live in Moscow.` — fixed statement. |
| `a1-14-workshop-translate` | `The price is on the box.` — fixed spatial phrase. |
| `a1-19-workshop-translate` | `Turn right after the park.` — fixed direction. |
| `a1-20-workshop-translate` | `I am waiting for the bus.` — contraction handled. |
| `a1-21-workshop-translate` | `He is listening to music.` — contraction handled. |
| `a1-22-ex-06` | `in the evening` is fixed; `at night` changes the time. |
| `a1-23-workshop-translate` | `It is cold outside.` — contraction handled. |
| `a1-24-ex-07` | `Her birthday was in May.` — fixed date. |
| `a1-26-ex-07` | `didn't` is handled by normalization. |
| `a1-26-workshop-translate` | `He answered the question.` — fixed action. |
| `a1-28-ex-07` | `He took my pen.` — fixed action. |
| `a1-30-ex-07` | `They moved to New York.` — fixed event. |
| `a1-33-workshop-translate` | `The room is small.` — fixed description. |
| `a1-34-ex-07` | `It is the worst day of the week.` — contraction handled. |
| `a1-34-workshop-translate` | `movie` is the US term; `film` is British. |
| `a1-35-workshop-translate` | `These shoes are new.` — fixed description. |
| `a1-37-ex-06` | `He has a toothache.` — fixed collocation. |
| `a1-40-ex-06` | `Describe your family.` — fixed instruction. |

## A2 pass (2026-11-25)

14 A2 translations were left single after review:

| Id | Source | Accepted | Why one |
|---|---|---|---|
| `a2-14-ex-07` | Климат здесь мягкий. | The climate here is mild. | “Weather” is not the same as climate. |
| `a2-16-ex-06` | Ты был здесь раньше? | Have you been here before? | Changing the tense changes the question. |
| `a2-20-workshop-translate` | Мы решили остаться. | We decided to stay. | Fixed decision; no honest paraphrase. |
| `a2-29-workshop-translate` | Здесь река широкая. | The river is wide here. | Fixed description. |
| `a2-31-ex-07` | Мой отец вышел на пенсию в прошлом году. | My father retired last year. | Fixed event. |
| `a2-32-workshop-translate` | Он хочет похудеть. | He wants to lose weight. | “Slim down” is more informal and not identical. |
| `a2-35-ex-07` | Я тебе верю. | I believe you. | Fixed short phrase. |
| `a2-36-ex-07` | Они живут в современной квартире. | They live in a modern apartment. | “Flat” is British; US English needs apartment. |
| `a2-36-workshop-translate` | У меня было счастливое детство. | I had a happy childhood. | Fixed phrase. |
| `a2-37-ex-06` | Телефон был изобретён в 1876 году. | The telephone was invented in 1876. | Fixed historical fact. |
| `a2-40-workshop-translate` | Достаточно тепло. | It is warm enough. | Fixed degree phrase. |
| `a2-43-ex-06` | Возьмите номер и подождите. | Take a number and wait. | Fixed instruction at a counter. |
| `a2-48-workshop-translate` | Пожалуйста, прикрепите резюме. | Please attach your resume. | “CV” is British; US English needs resume. |
| `a2-49-ex-06` | Нам нужен электрик. | We need an electrician. | Fixed profession. |

## B1 pass (2026-11-25)

15 B1 translations were left single after review:

| Id | Source | Accepted | Why one |
|---|---|---|---|
| `b1-03-ex-09` | Медицинская страховка — это льгота. | Health insurance is a benefit. | “Perk” is more informal; “one of the benefits” changes the structure. |
| `b1-15-workshop-translate` | Введение объясняет тему. | The introduction explains the topic. | “Introduces” is not the same claim. |
| `b1-20-workshop-translate` | Общество меняется. | Society is changing. | “Society changes” loses the ongoing process. |
| `b1-24-workshop-translate` | Диагноз был ясным. | The diagnosis was clear. | Fixed medical collocation; alternatives are vaguer. |
| `b1-29-ex-09` | Это хорошая экранизация. | It is a good adaptation. | “Screen adaptation” is narrower; “version” is wrong. |
| `b1-31-workshop-translate` | Страховое покрытие хорошее. | The insurance coverage is good. | “Covers a lot” changes the subject. |
| `b1-35-ex-09` | Резолюция была единогласной. | The resolution was unanimous. | One legal collocation. |
| `b1-38-ex-08` | Автор подписал книгу. | The author signed the book. | Fixed action; no honest paraphrase. |
| `b1-38-workshop-translate` | Автор живёт в Бостоне. | The author lives in Boston. | “Is based in” is not the same as lives. |
| `b1-45-workshop-translate` | Плакат был пропагандой. | The poster was propaganda. | Fixed classification. |
| `b1-46-ex-09` | Они отреставрировали картину. | They restored the painting. | “Fixed” is narrower than restored. |
| `b1-47-ex-08` | Брак — это обязательство. | Marriage is a commitment. | Fixed definition. |
| `b1-54-workshop-translate` | Многие глаголы неправильные. | Many verbs are irregular. | Fixed grammatical term. |
| `b1-56-ex-09` | Лондон — мультикультурный город. | London is a multicultural city. | Fixed description. |
| `b1-59-ex-08` | Выборка была слишком маленькой. | The sample was too small. | Fixed research phrase. |

## Intentionally single B2/C1 (reviewed, no honest paraphrase)

| Id | Source | Accepted | Why one |
|---|---|---|---|
| `b2-22-ex-08` | Выход позади тебя. | The exit is behind you. | Fixed spatial phrase; alternatives change the meaning. |
| `b2-23-ex-09` | Средний возраст — 30. | The average age is 30. | Digits are in the source; spelling out “thirty” would need number normalization. |
| `b2-32-ex-09` | Город планирует перестроить порт. | The city plans to redevelop the port. | “Rebuild” is narrower than “redevelop”; not an exact paraphrase. |
| `b2-35-ex-08` | Меритократия вознаграждает талант. | A meritocracy rewards talent. | “Rewards merit” changes the claim (talent vs merit). |
| `b2-47-ex-08` | Не контролируй каждую задачу. | Do not micromanage every task. | “Micromanage” is the precise term; “control” is weaker. |
| `b2-55-ex-08` | Чистый воздух — общественное благо. | Clean air is a public good. | “Common good” is a different economic category. |
| `b2-57-workshop-translate` | Программа проприетарная. | The software is proprietary. | “Closed-source” is not identical to proprietary. |
| `b2-60-workshop-translate` | Говорение — переносимый навык. | Speaking is a transferable skill. | “Portable skill” is not idiomatic. |
| `c1-19-ex-08` | Быстрое исправление сохраняет ответ ясным. | A quick correction keeps the answer clear. | Alternatives (“understandable”, “lucid”) shift the register or meaning. |
| `c1-22-ex-07` | Фильм переоценён, но не плох. | The film is overrated, but not bad. | Only punctuation differs; normalization already ignores it. |
| `c1-23-workshop-translate` | Франшиза — две тысячи долларов. | The deductible is two thousand dollars. | “$2,000” differs only in number formatting, which the normalizer does not unify. |

## Examples of added variants

- `c1-14-ex-08`: `Scarcely` / `Hardly` / `Barely had the results appeared...`
- `b2-17-ex-09`: active `The study used qualitative interviews.` / passive
  `Qualitative interviews were used in the study.`
- `b2-49-ex-09`: `can` / `may` / `might contain bias`
- `b1-38-ex-09`: `uses` / `has` / `There is a strong metaphor in the poem.`
- `c1-04-ex-07`: `cannot be extrapolated` / `cannot be generalized`
- `b2-19-ex-09`: `small pension` / `modest pension`
- `b2-52-ex-09`: `rises/falls` / `goes up/goes down`

## What this pass does not cover

- B1, A2 and A1 translations (B1 currently 10/180, A2/A1 mostly single). They are outside the
  scope the reviewers set, but the same method can be applied later.
- Number-word normalization (`thirty` vs `30`, `$2,000` vs `two thousand dollars`). This is a
  separate decision; it is why those items stay single.
- Grammar correctness of the alternatives beyond the review in this pass. The validator checks
  structure, not meaning; a future external sample can check a random subset.
