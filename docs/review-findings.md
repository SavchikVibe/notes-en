# Review findings, decisions and project state

This file preserves the independent reviews of the project and the decisions made after them. Read it at the start of a new session, before changing content or architecture. It is the long-term memory for the project.

Last updated: 2026-11-15, version 0.50.0.

## 1. What was reviewed

Two independent reviews were run on the same brief (`docs/review-brief.md`):

- **Gemini 4 Argon** — verdict **6.5/10**: architecture and UX 8.5, pedagogy and B1–B2 content 4.5.
- **Kimi K3.1 Pro** — verdict **5.5/10**.

Both agreed on the main point: the shell is strong, but the learning core at B1–B2 was weaker than it looked. The app could produce a false sense of competence: a learner could finish B2 without writing a paragraph, speaking without a prompt, or reading a text longer than 120 words.

The raw reviews are not stored here; this file keeps every actionable recommendation, the verified facts, and the decisions.

## 2. Verified facts from the audit

The audit was run with `scripts/audit-content.ts` (`npm run audit:content`) across all 210 units.

| Check | Result |
|---|---|
| `choice` correct answer = index 0 | 720 / 750; in 190 / 210 units every `choice` answer was A |
| `listen (choice)` answer = A | 204 / 210 |
| `read` question answer = A | 610 / 630 |
| `assemble` with fewer than 2 distractors | 517 / 540; A2 100/100, B1 180/180, B2 180/180 |
| `translate` with fewer than 2 accepted variants | 349 / 420; B2 120/120 |
| Duplicate sentences inside a unit | 739 |
| Average reading length | A1 53, A2 68, B1 96, B2 87 words |
| Target reading length in `CURRICULUM.md` | A1 100–200, A2 200–400, B1 400–800, B2 700–1000 |
| Standalone reading library | 10 texts, all A1 (at audit time; A2 texts were added later) |

These were content-generation defects, not only UX issues. The position bias was fixed at render time (options are shuffled), but the content itself still has skewed answers, weak distractors, narrow `accept` lists and short texts.

## 3. Engine fixes already shipped

These are done; do not regress them.

- Options are shuffled deterministically in `choice`, `listen`, `read` and standalone listening. The correct index is remapped. TFNG stays in canonical True / False / Not Given order.
- Lesson progress stores latest answers, first answers and skipped exercises (`src/db/db.ts`). `saveResume` no longer wipes answers. Restart resets the current attempt. Skipped exercises are excluded from the score. The result screen says “Итоговая точность” and “Ошибок с первой попытки”.
- SRS: `reviewCard` is called only on the first attempt in a session; intervals are `[0, 1, 3, 7, 16, 35, 75, 150]`; a wrong answer returns after 6 hours; new cards are limited to 8 per session; distractors prefer the same part of speech and level; the cloze finds the exact form or a stem instead of leaving the word visible.
- `speech.ts` selects only `en-US`; the voice can be chosen in Settings and previewed. Studio dialogues use bundled neural audio, not system TTS.
- Internal punctuation is ignored when comparing translations: “Can I have the check please?” equals “Can I have the check, please?”. Decimal points between digits are preserved.
- Studio speaking can be completed after a recording or after “Пропустить речь”; the checklist is optional and does not block completion.
- The validator now warns about answer skew, missing distractors, single accepted translations, duplicate sentences, British spelling/IPA, and short reading texts. Warnings do not fail the build. `npm run audit:content` gives the detailed counts.
- Ten A1 reading texts had tense errors (“Tomorrow we go”, “Today I see”) and were fixed.
- Standalone reading marks a text as done only with at least 2 of 3 correct answers. A weaker result leaves the text in the library for another attempt. The reading and listening screens show the text level.

## 4. Consensus recommendations from both reviews

These are still the backbone of the roadmap.

1. **Do not mass-produce C1 before fixing the learning design.** Build a vertical slice first. This was done: the Studio format now has reading, listening, writing and speaking in one task.
2. **Fix measurement before adding content.** Answer position, scoring, resume and SRS had to be trustworthy first. This was done.
3. **Add writing as a real task.** The `write` type now exists: prompt, minimum words, checklist, model answer, local draft, revision. It is used in every Studio.
4. **Reading and listening need a real library.** Ten A1 texts are not enough. Texts should be leveled, reusable, and include exam formats: True/False/Not Given, matching headings, evidence, note completion, inference.
5. **Speaking must be production, not reading aloud.** The learner should speak from a prompt, record, self-assess, and re-record. The Studio does this. The standalone “Речь” block on Today is still marked “скоро” and should eventually use the same format.
6. **SRS needs production cards and sane workload.** Recognition-only cloze is not enough. Add typed production, longer intervals, new-card limits, leech handling, and chunks/collocations. FSRS is not necessary now.
7. **Add an error bank and interleaving.** Mistakes currently live only inside a lesson. Save wrong exercises with a due date and mix them into later practice.
8. **The validator must check more than structure.** American English, level fit, naturalness, distractor quality, answer distribution and duplicate sentences all need checks or human review.
9. **Do not treat the C1 plan as “B2 with rarer grammar”.** It needs longer discourse, synthesis, writing, and independent work.
10. **Protect the constraints.** Offline, one user, no accounts, short lessons, 8 words, no gamification, workbook design, TypeScript content, JSON backup.

## 5. Argon’s specific recommendations

- Keep the mandatory lesson at 14 exercises; add an optional +6 practice set rather than lengthening the core.
- Reading library: 36 long texts (8 A2, 10 B1, 12 B2, 6 C1), each used for several tasks.
- SRS: eight boxes `[0, 1, 3, 7, 16, 35, 75, 150]`; on a wrong answer move back two boxes, not always to zero; limit new cards; add leech handling.
- Writing: `prompt`, `minWords`, `targetPhrases`, `checklist`, `modelAnswer`, three phases: draft, compare with model and rubric, revise.
- Speaking: blind recall first (hide the English phrase until after recording), duration/rhythm feedback, simple prosody markup, IELTS Part 2 timed monologue.
- C1: add US undergraduate pragmatics, logical fallacies, US institutions (lease, healthcare, banking, tenant rights), spoken idiomaticity, college composition, connected speech.
- Technical: lazy-load levels, remind the user to export a backup; do not spend time on photos for abstract vocabulary.

## 6. Kimi’s specific recommendations

- Mandatory core 10–12 exercises plus an optional 10–15-minute workshop; do not add more identical `choice`/`assemble` items.
- Reading: start with 12 B1 + 12 B2 texts, reuse each text for several passes, add two new texts per month; use IELTS formats.
- SRS: fix direction and workload first; production-first cards; 8 new cards/day; add 75/180-day intervals; leech handling; review chunks and grammar through error correction, not formula cloze.
- Writing: self-assessment rubric, model answer, revision, portfolio; no automatic IELTS band.
- Speaking: fluency cycle first (prompt → 60–90 sec recording → rubric → re-record), then shadowing and minimal pairs.
- C1 plan:
  - merge `01+08`, `09+47`, `11+17+18`, `13+45`, `22+23`, `30+54`, `31+40`;
  - move `12` (data) to B2, `06` and `19` before `16`, `27` (repair) to B1, `41` (email) earlier;
  - replace `49 Academic job talk` and `59 Mock conference panel` with office hours, group project, research proposal, seminar contribution;
  - add dialogue practice, long lecture notes, multi-source reading, US pragmatics, a real capstone, extensive reading by interest.
- Technical: add regression tests for scoring, skip/resume, SRS intervals and session building; do not prioritize code splitting over learning features.

## 7. Decisions made

- **Engine first.** Fix answer shuffling, scoring, resume, SRS and validator before new content. Done in 0.37.1–0.37.2.
- **Exercise count.** New C1 units should have **12 mandatory exercises + an optional workshop**. Existing A1/A2 keep 12; existing B1/B2 keep 14 until content revision. Do not mechanically cut two exercises from all 210 units: in A1/A2 they carry practice, and in B1/B2 a workshop made from the same examples would be repetition, which both reviews criticized.
- **Studio format.** A separate “Студия” section for long tasks, not inside the 10–15-minute lesson. Each task has reading, listening, writing, speaking. Access from Today; progress and current step persist.
- **Studio count.** 27 tasks total: 4 A1, 5 A2, 6 B1, 6 B2, 6 C1. One per 10-unit block. Completed in 0.38.0–0.49.0.
- **Audio.** Studio dialogues use bundled neural audio (Edge TTS, generated at build time). System TTS remains for words and as a fallback. The user’s phone has only one system voice; this is expected.
- **Voice settings.** The user can choose an en-US system voice for words/fallback; Studio audio is fixed. No Studio voice picker for now.
- **Storage.** The user has plenty of free space; do not split the precache yet. Current precache is about 16.8 MB.
- **Current learner level.** The learner is at A1, about 15 of 40 lessons. Do not assume B2. A1-01 is available now; A1-02 after unit 20; A1-03 after 30; A1-04 after 40. A2/B1/B2/C1 are future goals.
- **Next phase.** Expand the reading library: A2 first, then B1, B2, C1. Reuse the existing Reading/Listening screens; add exam-style questions and evidence.

## 8. Current state (0.50.0)

- 210 units: A1 40, A2 50, B1 60, B2 60.
- 1,600 words, 2,760 exercises.
- 27 Studio tasks: 4 A1, 5 A2, 6 B1, 6 B2, 6 C1.
- 18 standalone reading texts: 10 A1, 8 A2.
- 27 Studio audio files in `public/audio/`.
- Live app: https://savchikvibe.github.io/notes-en/
- Repo: `SavchikVibe/notes-en`.
- Version 0.50.0.
- `npm run validate:content` passes with 1,504 warnings. Warnings are content debt, not build failures.
- `npm run audit:content` prints the detailed audit table.

## 9. Pending work

Priority order unless the user changes it:

1. **Reading library expansion.** A2 is done (8 texts). Next: B1 10–12, B2 10–12, C1 8–10. Include TFNG, headings, evidence, inference, note completion. Reuse texts across skills.
2. **Error bank and workshop.** Save wrong exercises with due dates; mix old errors into optional practice; add the 12-core + workshop flow for new units.
3. **Standalone speaking block.** Today still says “Речь — скоро”. Use the Studio speaking format: prompt, preparation, recording, rubric, re-record.
4. **Content revision B1/B2.** Remove duplicate sentences, add distractors, widen `accept` lists, vary answer positions, lengthen reading, check level fit.
5. **American English audit.** Fix British spellings/IPA flagged by the validator; keep US spelling and General American IPA.
6. **Writing portfolio.** Move Studio drafts from localStorage to IndexedDB, keep first and final versions, add a revision view.
7. **C1 60-unit map revision.** Apply the merge/move/replace/add recommendations from section 6; the 6 C1 Studios are built, but the full 60-unit C1 map still needs the review edits.
8. **Tests.** Add regression tests for first-attempt scoring, skip/resume, SRS intervals, session building and cloze.
9. **Backup reminder.** Remind the user to export JSON after a number of lessons or days.
10. **Lazy loading / code splitting.** Not urgent; do it only if startup time becomes a problem.

## 10. What not to change

- Offline-first, one user, no accounts, no sync, no payments.
- Short 10–15-minute mandatory lesson.
- 8 words per unit.
- No gamification, hearts, energy, timers or streak pressure.
- Workbook design: paper, ink, one green accent, Lora + Golos Text + Charis SIL, no gradients/emoji.
- TypeScript content files and JSON backup.
- Bundled Studio audio and neural voices.
- The principle that writing and speaking are self-assessed, not auto-graded.

## 11. Commands and key files

```bash
npm run dev
npm run build
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
```

- Brief for external reviewers: `docs/review-brief.md`
- This file: `docs/review-findings.md`
- Curriculum: `CURRICULUM.md`
- Content rules: `CONTENT.md`
- Design rules: `DESIGN.md`
- Studio content: `src/content/studio/*.ts`, index in `src/content/studio/index.ts`
- Studio UI: `src/screens/Studio.tsx`, `src/screens/StudioTask.tsx`, `src/screens/studio/*`
- Exercise views: `src/screens/lesson/exercises.tsx`
- Option shuffling: `src/lib/options.ts`
- Speech/TTS: `src/lib/speech.ts`
- Answer normalization: `src/lib/text.ts`
- Progress/SRS: `src/db/db.ts`
- Validator: `scripts/validate-content.ts`
- Audit: `scripts/audit-content.ts`
- Audio source: `scripts/studio-audio.json`

## 12. User preferences and context

- The user speaks Russian; the app UI is Russian, the course is American English.
- The learner is the user’s child, 9th grade, started at A1/A2 with weak reading.
- Goal: confident B2 and IELTS Academic 6.5–7.0 by summer 2028, then C1 for study and life in the US.
- The user is sensitive to quality and checks the app on a Xiaomi Android 13 phone.
- The user does not share passwords; API keys/tokens may be pasted.
- The user prefers 10-unit content batches and does not want unnecessary model/subagent cost.
- The user has plenty of phone storage; 10–20 MB is fine.
- The user wants the Studio dialogues to sound good; bundled neural audio solved this.
- The user wants the reading library expanded after the Studios.
- The user asked for all review advice to be preserved in the repository so it survives context compaction. This file is that record.
