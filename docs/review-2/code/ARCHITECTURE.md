# Code map for reviewers

The whole app is 317 files and about 70,700 lines of TS/TSX/CSS. You do not need all of it. This
folder contains the eight files that carry the learning and trust logic, plus this map. Paths
below are relative to the repository root; the copies in this folder keep the same names.

## Stack

Vite 8 + React 19 + TypeScript + Tailwind 4 + `idb` + `vite-plugin-pwa`. HashRouter for GitHub
Pages. No backend, no API calls, no analytics. Content is TypeScript data imported eagerly.

## Data flow

```
src/content/units/*.ts  ──┐
src/content/extra-*.ts   ├─→ src/content/index.ts ─→ units[] ─→ Today / Path / Lesson
src/content/photo-map.ts ┘        (merge examples, photos, derived exercises)

src/content/readings.ts ─→ Reading / Listening screens
src/content/studio/*.ts ─→ Studio list / StudioTask (4 steps)
src/content/speaking.ts ─→ Speaking / Fluency

screens ─→ src/db/db.ts (IndexedDB `english`) ─→ progress / days / kv / srs / errors / writings
```

## Files in this folder

### `types.ts` (123 lines)

The content schema: `Unit`, `Word`, `Example`, `Formula`, `Exercise` union (`choice`, `assemble`,
`translate`, `listen`, `speak`, `read`, `write`), `ReadQuestion` (with `type: 'tfng'` and
`evidence`). This is the source of truth for content shape.

### `content-index.ts` (450 lines; original `src/content/index.ts`)

Imports every unit, merges `extraExamples` and `photos`, appends derived exercises
(`extraExercises` and generated dictation/speak), sorts by `order`, exposes `units`, `getUnit`,
`allWords`, `levelNumber`. This is the single eager import that makes the bundle 2.6 MB. Adding a
unit means adding one import line here; forgetting it is caught by the validator.

### `session.ts` (147 lines; original `src/lib/session.ts`)

`buildSession(units, progress, settings, now, due, readingsLeft, listeningLeft)` builds Today's
plan. `targetMinutes` reads the weekday minutes or the tutor day (90). Split table:
90 → 30/20/25/5/10, 120 → 45/25/30/10/10, 150 → 55/30/35/15/15, 180 → 70/35/45/15/15
(course/listening/reading/speaking/SRS). The course block takes 1–5 next unfinished units.

### `Lesson.tsx` (404 lines; original `src/screens/Lesson.tsx`)

The lesson state machine. `core` and `workshop` split by `optional`; `queue` holds core indices;
a wrong answer is appended once (`requeued` set); `handleResult` stores first answers and mistakes;
`handleSkip` excludes skipped exercises; `handleNext` calls `finishLesson(unit.id, score,
denominator)`; `restart` resets the attempt. Resume loads saved answers and starts at the first
unanswered exercise. Study time is flushed on visibility change and unmount.

Potential review points: the repeat-at-end rule, first-attempt scoring, skip denominator,
restart behaviour, and whether the UI can get into a state where the queue is empty but the
lesson is not finished.

### `exercises.tsx` (851 lines; original `src/screens/lesson/exercises.tsx`)

All exercise views and their `check()` implementations. Key details:

- `choice` / `listen` / `read` prepare shuffled options via `shuffleOptions(options, answer, key)`
  and remap the answer; TFNG is not shuffled.
- `AssembleView` compares the token sequence exactly.
- `TranslateView` calls `matchesAny(value, ex.accept)`.
- `ListenView` supports choice or typed dictation.
- `ReadView` calls `onScore(correct, total)` and `onResult(correct === total)`; evidence quotes
  appear when locked.
- `WriteView` loads/saves the draft in IndexedDB, gates “check” on `minWords`, and on check calls
  `markWritingChecked`.
- `SpeakView` records with `MediaRecorder`, can be skipped, and always reports success.

### `db.ts` (529 lines; original `src/db/db.ts`)

IndexedDB `english`, version 4, stores `progress`, `days`, `kv`, `srs`, `errors`, `writings`.
Important functions:

- `saveResume` / `saveAnswer` / `saveSkip` / `finishLesson` / `restartLesson` — progress model
  with latest and first answers.
- `addWordsToSrs`, `getDueCards(20)`, `reviewCard` — eight boxes `[0,1,3,7,16,35,75,150]`, wrong
  answer `−2` boxes and 6 hours, new cards limited to 8 in `countDue`.
- `saveError`, `reviewError`, `getDueErrors` — error boxes `[1,3,7,16,35,75]`.
- `saveWriting`, `markWritingChecked`, `listWritings` — first text and current text.
- `exportBackup`, `importBackup`, `resetAll` — JSON backup; import replaces data but keeps
  sections missing from old backups.
- `requestPersist` — asks the browser for persistent storage.

### `Today.tsx` (319 lines; original `src/screens/Today.tsx`)

Renders the session from `buildSession`, due counts, reading/listening remaining, resume link and
the backup reminder. If the plan looks wrong, this is where to look.

### `validate-content.ts` (356 lines; original `scripts/validate-content.ts`)

Structural and linguistic checks: unique ids, required fields, IPA shape, US spelling warnings,
answer skew, assemble distractors, translation variants, duplicate sentences, reading length,
TFNG and headings rules, evidence quotes. `npm run check` runs it together with reading, logic and
DB checks.

## Files intentionally not included

- `src/lib/options.ts` (shuffle + remap) — short; ask if needed.
- `src/lib/text.ts` (normalization) — short; ask if needed.
- `src/lib/srs.ts` (cloze builder) — short; ask if needed.
- `src/screens/studio/*` (four step components) — described in `02-HOW-IT-WORKS.md`; two Studio
  tasks are in `samples/studio/`.
- `src/screens/Reading.tsx`, `Listening.tsx`, `Speaking.tsx`, `Portfolio.tsx`, `Settings.tsx` —
  UI shells over the logic above; screenshots show them.
- `scripts/check-db.ts`, `check-logic.ts`, `check-readings.ts` — tests; output is in
  `EVIDENCE.md`.
- The rest of `src/content/units/` — six samples are in `samples/units/`.

## How to run the checks

```bash
npm run check          # content + readings + logic + DB, ~3 s
npm run audit:content  # raw content statistics, warnings included
npm run test:e2e       # 7 Playwright flows, dev server on :4173, ~13 s
npm run test:e2e:offline # build + preview on :4174, 2 offline runs
```

Node 26, npm 11, Chromium installed via Playwright. Do not run `npm install` or deploy.
