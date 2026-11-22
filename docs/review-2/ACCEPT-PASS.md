# Accept-list pass — B2/C1 translations

Date: 2026-11-22. Scope: every `translate` exercise in B2 (180) and C1 (72), 252 items.
Method: each item was read against its Russian source; alternatives were added only when they
are real, grammatical paraphrases (passive/active, may/might, has/there is, close verbs,
word order). No fuzzy matching, no mechanical substitution.

Implementation: `src/content/accept-variants.ts`, merged into `accept` by
`src/content/index.ts` (`withAcceptVariants`). `npm run check:accept` validates the map and
reports coverage.

## Result

| Level | Translations | With variants | Intentionally single |
|---|---:|---:|---:|
| B2 | 180 | 172 | 8 |
| C1 | 72 | 69 | 3 |
| **Total** | **252** | **241** | **11** |

Before the pass, 13 items had variants (mostly the concrete fixes from the review). After the
pass, 241 of 252 have at least two curated answers.

## Intentionally single (reviewed, no honest paraphrase)

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
