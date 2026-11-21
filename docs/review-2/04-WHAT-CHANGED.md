# 04 — What changed since version 0.37.0

The previous review was run at 0.37.0 (Gemini 4 Argon 6.5/10, Kimi K3.1 Pro 5.5/10). This is
the delta. Verify it; do not trust it.

## Size and scope

| Thing | 0.37.0 | 0.97.0 | Evidence |
|---|---:|---:|---|
| Units | 210 | 234 | `npm run check` |
| C1 units | 0 | 24 | `src/content/units/c1-*.ts` |
| C1 projects | 0 | 8 | `src/content/studio/c1-01…08.ts` |
| Words | 1,600 | 1,792 | `npm run check` |
| Exercises | 2,760 | 3,750 | `npm run check` |
| Library texts | 10 (all A1) | 54 (A1–C1) | `src/content/readings.ts` |
| Studio tasks | 6 | 29 | `src/content/studio/index.ts` |
| Speaking tasks | placeholder | 43 | `src/content/speaking.ts` |
| Browser tests | none | 7 + 2 offline | `tests/` |
| Unit words | 8 | 6 in early A1, 8 elsewhere | `src/content/units/` |

## The old criticisms and what happened

| Old criticism | What changed | Where to check |
|---|---|---|
| Answer position bias: most correct answers were A | Fixed **at render time**: deterministic shuffle per exercise id, answer remapped. Source indices are still skewed (audit shows 792/22/8). | `src/lib/options.ts`, `exercises.tsx`, `05-CLAIMS-TO-VERIFY.md` |
| Assemble tasks had too few distractors (517 weak) | Audit now reports 0 assemble tasks with fewer than 2 distractors. | `npm run audit:content` |
| Narrow `accept` lists (349 weak) | Widened where a real synonym exists; contractions expanded; punctuation ignored. 626 single-variant items remain by design. | `src/lib/text.ts`, `matchesAny` |
| 739 duplicate sentences | Removed from exercises; remaining 1,279 hits are mostly word examples reused in derived workshop/dictation exercises. | `audit:content`, `src/content/index.ts` |
| B1–B2 readings too short (87–96 words) | Split kept: unit reading is short lesson material; the library now has 300–384-word B1 and 702–718-word B2 texts (1 per week+). C1 library 901–915. | `src/content/readings.ts`, `check:readings` |
| No real writing | `write` type in every Studio: prompt, minimum words, checklist, model answer, draft, revision, portfolio export. Still not in every unit. | `samples/studio/`, `src/screens/studio/WritingStep.tsx` |
| Speaking was reading aloud | Standalone speaking block with prompts, preparation, recording, replay, self-check; shadowing and minimal pairs. Studio speaking records or skips. No ASR. | `src/content/speaking.ts`, `samples/speaking.json` |
| SRS recognition only, workload unclear | Eight boxes `[0,1,3,7,16,35,75,150]`, wrong answer −2 boxes and 6 h, max 8 new cards, up to 20 due, same-POS distractors. Still cloze recognition, no typed production. | `src/db/db.ts`, `src/lib/srs.ts` |
| Mistakes lived only inside a lesson | Error bank: first-attempt errors in choice/assemble/translate/listen come back at 1/3/7/16/35/75 days, appear on Today and `/errors`, and up to 3 are mixed into a workshop. | `src/db/db.ts`, `src/screens/Errors.tsx` |
| C1 must not be “B2 with rarer grammar” | 24 C1 units (academic lexis, hedging, inversion, fronting, rhetoric, debate, source evaluation, US institutions, capstone) + 8 project tasks. Not the originally planned 60. | `CURRICULUM.md`, `samples/units/c1-14.ts` |
| The validator must check more | It checks structure, IPA, US forms, distractors, answer skew, duplicates, reading length, evidence quotes, heading questions, DB logic. Warnings remain warnings, not errors. | `scripts/validate-content.ts`, `npm run check` |
| Shell strong, learning core weak | The shell was kept; the core was rebuilt: library, Studio, speaking, error bank, portfolio, C1. Judge whether it is now deep enough. | This packet |

## Engine and data changes

- Resume no longer wipes answers; latest and first answers are stored separately; skipped
  exercises are excluded from the score; restart resets the attempt.
- Options are shuffled deterministically for `choice`, `listen`, `read` and standalone listening;
  TFNG stays canonical.
- SRS intervals, wrong-answer penalty, new-card limit and distractor selection were changed as
  above.
- Error bank, portfolio (`writings` store, DB v4), backup including errors and writings, backup
  reminder.
- Library audio is cached on demand, not precached; Studio audio is precached.
- Service worker updates automatically and reloads on `controllerchange`.
- Tests: DB regression tests on `fake-indexeddb`, logic tests, and Playwright flows on desktop
  and Pixel 7, including an offline run against the built PWA.

## UX changes

- Level filters with unread counts in Reading and Listening; default follows the current level.
- “Вернуться” retry list for weak library texts.
- Studio list shows a “Проект” badge for the 8 C1 projects; the task header says “Проект · …”.
- Portfolio: first vs current version, revision count, single-work `.txt` export.
- Backup reminder on Today.
- Settings: en-US voice selection and preview, update button, JSON backup.

## What did not change

- No human teacher or human content review at scale. The owner reads and edits, but there is no
  external examiner.
- No ASR or pronunciation scoring. Speaking is recorded and self-assessed.
- No AI tutor or runtime LLM.
- No IELTS block. It is on hold and not part of this build.
- No gamification, accounts, sync, analytics or notifications.
- Source answer indices remain skewed; single-variant translations remain; unit readings remain
  short at B2; SRS remains recognition-only. These are known trade-offs, not oversights. Judge
  them.
