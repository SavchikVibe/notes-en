# Evidence — raw outputs

Collected on 2026-11-21, version 0.97.0, Windows 11, Node v26.9.0, npm 11.19.1, Playwright
Chromium 159.

## `npm run check`

```text
> english-app@0.97.0 check
> tsx scripts/validate-content.ts && tsx scripts/check-readings.ts && tsx scripts/check-logic.ts && tsx scripts/check-db.ts

Контент в порядке: 234 юнитов, 3750 упражнений, 1792 слов, 54 текстов, 29 студий.
Текстов: 54.
Ошибок в вопросах-заголовках: 0.
Цитат, которых нет в тексте дословно: 0.
Текстов вне целевого объёма: 0.
Проверок не пройдено: 0.
Проверок БД не пройдено: 0.
```

## `npm run audit:content`

```text
choice answers: { '0': 792, '1': 22, '2': 8 }
listen(choice) answers: { '0': 228, '1': 3, '2': 3 }
read question answers: { '0': 682, '1': 10, '2': 10 }
totals: { choiceTotal: 822, listenChoiceTotal: 234, readQuestionTotal: 702 }
units with all choice answers = 0: 214 / 234
assemble with <2 distractors: 0
translate with <2 accepted variants: 626
duplicate sentences inside units: 1279
read paragraph words by level: { A1: 40–74 (avg 53), A2: 55–84 (68), B1: 70–119 (96),
  B2: 61–119 (87), C1: 126–156 (141) }
by level: A1 assemble 80 / weak 0, translate 120 / weak 66; A2 100/0, 150/137;
  B1 180/0, 180/171; B2 180/0, 180/180; C1 72/0, 72/72
shuffle mapping errors: 0
```

The audit is a warning report, not a pass/fail gate. `05-CLAIMS-TO-VERIFY.md` explains the
single-variant translations and the duplicate count.

## `npx tsc --noEmit`

Clean, no output.

## `npm run test:e2e`

```text
Running 7 tests using 6 workers

ok [desktop] backup round-trip: export, reset, import
ok [desktop] reading library: answer the first A1 text and pass it
ok [desktop] studio flow: reading, listening, writing, speaking skip
ok [desktop] full lesson flow: answer every core exercise and finish
ok [mobile]  full lesson flow: answer every core exercise and finish
ok [mobile]  phone: today, lesson start and settings fit the viewport
ok [mobile]  studio flow: reading, listening, writing, speaking skip

7 passed (12.9s)
```

## `npm run test:e2e:offline`

```text
Running 2 tests using 2 workers

ok [offline-desktop] offline: app shell and a lesson work without network (3.4s)
ok [offline-mobile]  offline: app shell and a lesson work without network (3.5s)

2 passed (6.3s)
```

The offline test builds the app first (`tsc --noEmit && vite build`), serves `dist` with
`vite preview` on port 4174, waits for the service worker to control the page, disables the
network, reloads Today, opens `/#/lesson/a1-01`, and finally checks that “Проверить обновление”
returns to a working Settings screen. A real version swap is not simulated.

## Build

```text
dist/assets/index-*.js   2,640.93 kB │ gzip: 682.52 kB
dist/assets/index-*.css     38.17 kB │ gzip:   8.01 kB
precache                    184 entries, 18,002.75 KiB
```

A Vite warning says a chunk is larger than 500 kB. This is known and accepted; see
`03-STATE-0.97.md`.

## Startup measurement

Headless Chromium against the built app, 4× CPU throttling, local server, no network latency:

```text
first contentful paint: 888 ms
Today screen visible:   1,153 ms
DOMContentLoaded:       674 ms
load:                   675 ms
```

This is a desktop-class machine; it is not a phone measurement. It is the closest automated
proxy. The app is precached, so subsequent starts do not download the bundle.

## Content statistics

```text
A1: 40 units, 240 words, 6.0 words/unit, 480 core + 120 optional, avg unit reading 53 words,
    10 library texts 107–118 words
A2: 50 units, 400 words, 8.0, 600 + 150, avg 68, 10 texts 200–213
B1: 60 units, 480 words, 8.0, 840 + 180, avg 96, 12 texts 300–384
B2: 60 units, 480 words, 8.0, 840 + 180, avg 87, 12 texts 702–718
C1: 24 units, 192 words, 8.0, 288 + 72, avg 141, 10 texts 901–915
Total: 234 units, 1,792 words, 3,048 core + 702 optional = 3,750 exercises
Kinds: 822 choice, 612 assemble, 702 translate, 702 listen, 678 speak, 234 read
Studio: 4 A1, 5 A2, 6 B1, 6 B2, 8 C1 = 29; 8 C1 projects
Speaking: 30 answers, 10 shadowing, 3 minimal pairs = 43
Audio: 29 Studio MP3 + 54 library MP3
```

## Screenshots

`screens/01-today.png` … `screens/11-settings.png`, 390×844 at 2× scale, fresh install (no
progress). They show the workbook design and the main screens, not a completed course.
