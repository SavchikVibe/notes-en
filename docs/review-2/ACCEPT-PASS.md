# Accept-list pass — B1–C1 translations

Date: 2026-11-22 (B2/C1) and 2026-11-25 (B1). Scope: every `translate` exercise in B1 (180),
B2 (180) and C1 (72), 432 items.
Method: each item was read against its Russian source; alternatives were added only when they
are real, grammatical paraphrases (passive/active, may/might, has/there is, close verbs,
word order). No fuzzy matching, no mechanical substitution.

Implementation: `src/content/accept-variants.ts`, merged into `accept` by
`src/content/index.ts` (`withAcceptVariants`). `npm run check:accept` validates the map and
reports coverage.

## Result

| Level | Translations | With variants | Intentionally single |
|---|---:|---:|---:|
| B1 | 180 | 165 | 15 |
| B2 | 180 | 172 | 8 |
| C1 | 72 | 69 | 3 |
| **Total** | **432** | **406** | **26** |

Before the pass, 13 B2/C1 items had variants (mostly the concrete fixes from the review). After
the pass, 406 of 432 have at least two curated answers.

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
