# 03 — Verified state, version 0.97.0

Everything here is measured on 2026-11-21 from the repository, not estimated.

## Content

| Level | Units | Words | Words/unit | Core exercises | Optional | Exercises/unit | Unit reading (avg words) | Library texts | Library words |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A1 | 40 | 240 | 6.0 | 480 | 120 | 12 | 53 | 10 | 107–118 |
| A2 | 50 | 400 | 8.0 | 600 | 150 | 12 | 68 | 10 | 200–213 |
| B1 | 60 | 480 | 8.0 | 840 | 180 | 14 | 96 | 12 | 300–384 |
| B2 | 60 | 480 | 8.0 | 840 | 180 | 14 | 87 | 12 | 702–718 |
| C1 | 24 | 192 | 8.0 | 288 | 72 | 12 | 141 | 10 | 901–915 |
| **Total** | **234** | **1,792** | — | **3,048** | **702** | — | — | **54** | — |

Exercise kinds across the course: 822 `choice`, 612 `assemble`, 702 `translate`, 702 `listen`,
678 `speak`, 234 `read`. Total 3,750.

Other blocks:

- 29 Studio tasks: 4 A1, 5 A2, 6 B1, 6 B2, 8 C1. Eight C1 tasks are projects.
- 43 speaking tasks: 30 answers (6 per level), 10 shadowing, 3 minimal-pair drills.
- 29 Studio MP3 files and 54 library MP3 files in `public/audio/`.
- Unit readings are short by design (3–4 paragraphs); long reading lives in the library. The
  library is leveled and uses MCQ, True/False/Not Given and matching headings with evidence.

## Validator and audit

`npm run check` output:

```text
Контент в порядке: 234 юнитов, 3750 упражнений, 1792 слов, 54 текстов, 29 студий.
Текстов: 54.
Ошибок в вопросах-заголовках: 0.
Цитат, которых нет в тексте дословно: 0.
Текстов вне целевого объёма: 0.
Проверок не пройдено: 0.
Проверок БД не пройдено: 0.
```

`npm run audit:content` on the same build:

```text
choice answers: { '0': 792, '1': 22, '2': 8 }        // 822 choice exercises
listen(choice): { '0': 228, '1': 3, '2': 3 }         // 234 listen-choice
read question:  { '0': 682, '1': 10, '2': 10 }       // 702 questions
assemble with <2 distractors: 0
translate with <2 accepted variants: 626
duplicate sentences inside units: 1279
read paragraph words by level: A1 40–74 (avg 53), A2 55–84 (68), B1 70–119 (96),
  B2 61–119 (87), C1 126–156 (141)
shuffle mapping errors: 0
```

How to read this honestly:

- **Answer indices in the source are still heavily skewed to 0.** The UI shuffles options
  deterministically at render time and remaps the answer, so the learner does not see the skew.
  This is a mitigation, not a cleanup. The audit is useful because it shows the source is fragile
  if the shuffle regresses.
- **626 translations have fewer than two accepted variants.** After the content pass, variants
  were added only where a real synonym exists. A sentence like “Я студент” has one natural
  translation; adding “I'm a student / I am a student” is handled by contraction expansion, not
  by a second string. This is a deliberate trade-off, but it means a correct paraphrase can be
  marked wrong. Judges should test this.
- **1,279 “duplicate sentences”** are mostly word examples reused as derived exercises
  (workshop translate/listen, generated dictation). The validator's duplicate rule compares
  sentences across exercises, and reusing a word's example as practice is intended scaffolding.
  The content pass removed accidental duplicates inside exercises. Verify whether the remaining
  reuse is acceptable or feels like filler.
- **Unit readings are short at B2 (avg 87 words).** This is a documented decision: the unit
  reading is lesson material; long reading is the library (B2 texts 702–718 words). The previous
  review criticized 87-word B2 readings. The owner's position is that the split is intentional;
  judge whether the split actually delivers enough reading per week.

## Tests

`npm run test:e2e` — 7 passed in about 13 seconds (Chromium, dev server):

- desktop: full A1-01 lesson; full Studio A1-01 (reading, listening, writing, speaking skip,
  portfolio export); first A1 library text; backup export/reset/import round-trip.
- mobile (Pixel 7): the same lesson and Studio flows, plus viewport checks (no horizontal
  scrolling, sticky button on screen, tap targets ≥ 44 px).

`npm run test:e2e:offline` — 2 passed (desktop and Pixel 7) against the built PWA served by
`vite preview`: service worker controls the page, Today and a lesson open with the network off,
the update button returns to a working Settings screen. A real version swap is not simulated;
that is verified on deploy.

`npm run check` also runs `check:db` on `fake-indexeddb`: resume, first-attempt scoring, finish,
SRS boxes, error intervals, portfolio, backup and reset.

## Build and startup

- Bundle: 2,640.93 kB JS minified, 682.52 kB gzip; CSS 38.17 kB (8.01 kB gzip).
- Precache: 184 entries, 18,002.75 KiB (app shell, fonts, 29 Studio MP3). Library audio is
  excluded and cached on demand.
- Measured on the built app in headless Chromium with 4× CPU throttling (desktop class machine,
  local server, no network latency): first contentful paint 888 ms; Today screen visible in
  1,153 ms. This is not a phone measurement, but it is the closest automated proxy.
- No code splitting. The bulk is course content, and Today imports all units to build the
  session, so route-level splitting would barely help. Revisit only if startup becomes slow on
  the phone.

## Repository

- Live app: https://savchikvibe.github.io/notes-en/ (installable PWA; works offline).
- Source: GitHub `SavchikVibe/notes-en` (public, no personal progress data).
- Stack: Vite 8, React 19, TypeScript, Tailwind 4, `idb`, `vite-plugin-pwa`. No backend.
- Content: TypeScript files under `src/content/`; 234 unit files, one library file, 29 Studio
  files. Derived exercises are added at build time in `src/content/index.ts`.
- Docs: `SPEC.md`, `CONTENT.md`, `DESIGN.md`, `CURRICULUM.md` in the repository root.
