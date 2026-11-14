# Review brief — personal English-learning PWA

This document is for an independent review of the project. Read it first, then inspect the listed files. Do not modify any files. The review is read-only.

## 0. What this is

A personal, offline-first English-learning PWA for one learner. It is not a startup, not a social product and not a commercial course. It is a working textbook on a phone: short lessons, vocabulary with spaced repetition, reading, listening, speaking practice, and a visible path from A1 to C1.

The project is built iteratively by an AI coding agent for a single household. Content is authored with AI assistance and checked by a structural validator, not by a human teacher at scale. The learner is a 9th-grade student who started at A1/A2 with weak reading. The app already contains content up to B2; the actual progress is stored locally and is not visible to reviewers.

The target is confident B2 and IELTS Academic 6.5–7.0 by summer 2028, then C1 for study and life in the US. The course teaches American English.

## 1. Hard constraints

- One user, one device (Xiaomi 13 Ultra, Android 13, Chrome). No accounts, payments, sync or social features.
- Offline is the normal mode. Content ships in the bundle. Progress lives in IndexedDB.
- Installable PWA on the home screen.
- A lesson is 10–15 minutes. A daily session is longer (90–180 minutes) and is assembled from blocks.
- No retention mechanics: no hearts, energy, timers, loot boxes, streak pressure or premium lives. A streak is displayed, but it is not used to gate anything.
- Design is a “paper workbook”: warm paper, ink, one green accent, Lora for headings, Golos Text for UI, Charis SIL for IPA. No gradients, glass, glow, emoji, uppercase tracked labels or “AI-looking” UI.
- American English: General American IPA, US spelling and vocabulary. This is a requirement, not a preference.
- Photos are used only for concrete words; abstract words rely on typography. One “Photos — Unsplash” credit line in Settings, no per-card attribution.
- The app must stay maintainable by one agent and one human. Content is TypeScript files, not a CMS.

## 2. Current state (version 0.37.0)

| Level | Units | Status |
|---|---:|---|
| A1 | 40 | complete |
| A2 | 50 | complete |
| B1 | 60 | complete |
| B2 | 60 | complete |
| C1 | 60 planned | not started |

Totals: 210 units, 1,600 words, 2,760 exercises. C1 is planned as 60 units, which would bring the course to 270 units, about 2,080 words and about 3,600 exercises.

A1/A2 units have 12 exercises. B1/B2 units have 14: 12 authored exercises plus 2 derived at build time (a dictation from the shortest 3–6-word example, and a speak task from a translate sample). B units have 8 words, each with 3 examples. The third example is stored separately in `src/content/extra-examples.ts` and merged at build time.

The live app is at https://savchikvibe.github.io/notes-en/. The repository is public but contains no personal progress data.

## 3. Architecture

- Vite 8 + React 19 + TypeScript + Tailwind 4.
- `HashRouter` so GitHub Pages serves every route with HTTP 200. `base` is `/notes-en/`.
- PWA via `vite-plugin-pwa` (`generateSW`). The service worker reloads the app on `controllerchange`, so updates arrive without manual cache clearing.
- IndexedDB via `idb`, database `english`, stores: `progress`, `days`, `kv`, `srs`.
- No backend, no API keys in the client, no analytics, no telemetry.
- Deploy: `node scripts/deploy-pages.mjs SavchikVibe/notes-en`, which builds, pushes `dist` to `gh-pages`, and enables Pages. A token lives in `.env` and is gitignored.
- `robots.txt` and `noindex` are set.
- Build size at 0.37.0: about 1.88 MB JS (482 KB gzip), 35 KB CSS, precache 4.66 MB. All content is imported eagerly in `src/content/index.ts`; there is no code splitting or lazy loading.

## 4. Learning design as implemented

### 4.1 Unit anatomy

Each unit has: title, subtitle, goal, 3–4 formula cards, 8 words, and 12 or 14 exercises. The formula card is shown above the exercise and can be collapsed. The reading exercise is moved to the end of the queue. The result screen shows the score, the number of first-attempt mistakes, and the unit’s words with IPA and translations.

### 4.2 Exercise types

| Type | What the learner does | How it is checked | Main weakness |
|---|---|---|---|
| `choice` | Picks one option to fill a blank | Exact index | Recognition only; guessing possible |
| `assemble` | Builds a sentence from a shuffled word bank with distractors | Exact token sequence | Penalizes legitimate variants; heavily scaffolded |
| `translate` | Translates a Russian sentence into English | Exact normalized string match against an `accept` list | Narrow accept lists; no typo/synonym tolerance |
| `listen` | Hears TTS and chooses an option or types the sentence | Exact match | TTS only, one voice, no accents or connected speech |
| `speak` | Records the phrase, listens to the model, compares | Always marked correct; can be skipped | No ASR, no pronunciation feedback, self-assessed |
| `read` | Reads 4 short paragraphs and answers 3 MCQs | All 3 must be correct for one point | Short texts; often explanatory rather than exam-like |

`translate` normalization: lowercase, curly quotes normalized, trailing punctuation removed, whitespace collapsed. It is still an exact match, not fuzzy.

`assemble` shuffles the bank deterministically by exercise id, includes extra words, and tells the learner “Not all words are needed.”

`read` is one exercise with three questions. If one answer is wrong, the whole exercise is wrong. Feedback highlights the correct options but does not explain why.

### 4.3 Lesson flow and scoring

- The queue contains all exercises in order. A wrong answer is appended to the end of the queue once. The learner sees “Повторение ошибки.”
- Only the first attempt counts toward the score. A correct repeat does not erase the first mistake; a wrong repeat does not add a second mistake.
- The result score is `correct first attempts / total exercises`. The result screen reports “Ошибок с первой попытки.”
- Progress is saved per exercise id, so a resumed lesson skips already answered exercises. If every exercise is answered but the lesson was not finished, it starts from the beginning.
- Study time is counted only while the page is visible. It is flushed on visibility change and on unmount.
- Finishing a lesson adds its words to SRS.

### 4.4 Spaced repetition

- Six boxes with intervals `[0, 1, 3, 7, 16, 35]` days.
- Correct answer: move to the next box. Wrong answer: reset to box 0 and schedule tomorrow.
- The review screen takes up to 20 due cards, shows a cloze from the word’s last example, and offers 4 options. A wrong card is requeued once in the same session.
- Cards are created only from completed units. There is no separate “new word” queue, no daily new-card limit, no leech handling, no production card, and no grammar or chunk review.
- The cloze is recognition, not production.

### 4.5 Daily session

`src/lib/session.ts` builds a session from the weekday target:

| Day | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|---|---:|---:|---:|---:|---:|---:|---:|
| Minutes | 120 | 90 | 120 | 120 | 120 | 180 | 150 |

A tutor day overrides the target to 90 minutes. The session is split into course, listening, reading, speaking and SRS. The course block picks up to 5 next undone units, about 12 minutes each. Listening and reading blocks point to the standalone library. The speaking block is marked “soon” in the Today screen even though speak exercises exist inside lessons. The SRS block is active when cards are due.

### 4.6 Standalone reading and listening

- `src/content/readings.ts` contains 10 shared texts. The Reading screen serves them as 3-question MCQs. The Listening screen uses the same texts in three steps: gist questions, dictation of 2 short sentences, and shadowing. Shadowing is ungraded.
- This means reading and listening content is much smaller than the course content: 10 texts for 210 units.

### 4.7 Speaking

- `MediaRecorder` records the learner, plays back the recording, and plays the TTS model before the recording for comparison.
- There is no speech recognition, no pronunciation score, no rhythm or stress feedback. The exercise always counts as correct if the learner records or skips.

### 4.8 Progress and backup

- Progress screen: percent of units done, streak, words in SRS, minutes over the last 7 days.
- Backup is a single JSON with settings, lesson progress, day logs and SRS. Import replaces the database.
- Clearing site data erases progress. There is no cloud sync by design.

## 5. Content pipeline and QA

- Content is TypeScript: one file per unit in `src/content/units/`, imported into `src/content/index.ts`.
- `npm run validate:content` checks structure: unique unit and word ids, 12–14 exercises, 3–4 examples per word, IPA without brackets, non-empty fields, assemble bank contains the answer, choice answers in range, read has paragraphs and questions.
- The validator also requires every example to contain the exact term as a substring. This catches some errors but also forces awkward examples when the natural form is inflected.
- The validator does not check: American vs British spelling, IPA dialect, naturalness, collocation quality, CEFR fit, translation quality, distractor quality, ambiguity, reading-question validity, TTS pronounceability, or semantic duplication of words.
- Duplicate word ids are caught. Synonyms, different senses of the same word, and near-duplicates are not.
- The content is generated in batches of 10 units. The human reviews it by reading, but there is no external teacher or item-analysis loop.

## 6. Design and UX

- Four tabs: Today, Path, Vocabulary, Progress. Settings is an icon in the Today header.
- Today answers “what do I do for the next 2 hours”, not “what lessons exist”.
- The unit screen is a player: formula, exercise, feedback, next. The bottom button is sticky.
- Tap targets are at least 44px; body text is 17px; the app is designed for one-handed phone use.
- The design explicitly avoids the usual AI-generated look: no purple gradients, no glass, no emoji labels, no “New ✨” badges, no identical rounded cards with shadows.
- Dark theme follows the system setting.

## 7. Known gaps, tensions and spec drift

These are real, current issues. Do not treat them as surprises.

1. **No writing exercise type.** C1 needs paragraphs, essays, synthesis and editing. The current types cannot assess free writing. A `write` type (prompt, checklist, word count, local draft, self-review) is planned but postponed.
2. **Speaking is self-assessed.** Recording and comparison are useful, but the exercise always counts as correct. There is no pronunciation, fluency or grammar feedback.
3. **Listening is TTS-only.** One voice, one accent, no natural connected speech, no long exam-style audio. Offline quality depends on the device voice pack.
4. **Reading is short.** Unit texts are 4 paragraphs; the standalone library has only 10 texts. There is no timed practice, no full IELTS-length passage, no matching-headings/TFNG/YNNG set at the standalone level, and no note-taking.
5. **SRS is word-only and recognition-only.** No production cards, no chunks/collocations, no grammar review, no leech handling, no daily new-card limit, no interleaving with lessons.
6. **The exercise mix is heavily scaffolded.** Many `assemble` and `translate` items, few free-production tasks. The learner is often choosing or arranging, not composing.
7. **Content QA is structural, not pedagogical.** Unnatural collocations, translationese, British spellings or IPA, and ambiguous answers can pass the validator.
8. **No error bank.** Mistakes are requeued within a lesson, but there is no cross-lesson mistake history or personalized review set.
9. **No grammar mastery tracking.** Grammar is presented in formula cards and practiced per unit, but not scheduled or re-tested later.
10. **No in-app level check or IELTS simulation.** The B2 units practice exam formats, but there is no timed full test, no band descriptors, no writing/speaking examiner.
11. **Spec drift.** `SPEC.md` still says Cloudflare Pages, 5–8 exercises per unit, and a 37/21/21/13/8 session split; the code uses GitHub Pages, 12–14 exercises, and different splits. `SPEC.md` also lists stage 4 as not done, while progress and backup exist. `Progress.tsx` still says SRS will arrive “at stage 2”, although it is implemented. The Today screen says speaking is “soon” although speak exercises exist. These are copy and documentation inconsistencies, not hidden bugs, but they affect trust.
12. **Session builder is time-based, not performance-based.** It does not react to mistakes, energy, or how long the learner actually takes. It also does not mix review into the course block.
13. **Content size and bundle size.** All units are imported eagerly. At 270 units the JS bundle will grow further; there is no lazy loading or per-level chunk.
14. **Single device, manual backup.** Clearing site data loses progress. There is no sync, by design, but the backup is only as good as the learner’s discipline.
15. **No automated tests.** Only `tsc` and the content validator. UI behavior is checked manually.

## 8. Questions for the review

Answer these directly. Be concrete and prioritize by impact.

1. Is 8 words and 14 exercises per unit the right density for a 10–15-minute lesson? What mix of recognition, controlled production and free production would you use at A2, B1, B2 and C1?
2. The learner wants more practice per unit without making the mandatory lesson longer. Would you add optional practice sets, adaptive review, interleaving, or something else? What exactly?
3. What is the minimum viable `write` exercise type for C1 that works offline and without a teacher? How should it give feedback: checklist, model answer, self-assessment rubric, peer-free scoring?
4. How can speaking be improved without cloud ASR: shadowing, minimal pairs, self-assessment rubric, recording comparison, fluency prompts? What would you build first?
5. Is the six-box SRS adequate for this use case? Would you move to FSRS or a simpler production-first schedule? How should chunks and grammar be reviewed?
6. How would you enforce American English consistency at scale: spelling, IPA, vocabulary, TTS voice, dates, currency, punctuation? What checks belong in the validator?
7. How would you make reading and listening more academic and exam-like without multiplying content cost? What text types and task types matter most for IELTS 6.5–7.0 and C1?
8. Given no gamification, what weekly and monthly review loop would keep a 9th-grade learner from plateauing or dropping out? What should the app show, and what should it deliberately not show?
9. Which current features would you cut or simplify to protect the core? Where is the project over-engineered for one user?
10. Critique the planned C1 map in `CURRICULUM.md`. Which units would you merge, cut, move earlier or add? What is missing for real academic and professional C1?

## 9. Files to read (priority order)

Read these, not all 210 unit files.

1. `docs/review-brief.md` — this file.
2. `SPEC.md`, `CONTENT.md`, `DESIGN.md` — product, content and design rules.
3. `CURRICULUM.md` — full A1–C1 map, including the detailed 60-unit C1 plan.
4. `src/content/types.ts` — the schema.
5. `src/content/index.ts` — how units, derived exercises, extra examples and photos are assembled.
6. `scripts/validate-content.ts` — what QA actually checks.
7. `src/screens/Lesson.tsx` — queue, scoring, requeue, resume, result.
8. `src/screens/lesson/exercises.tsx` — all six exercise views.
9. `src/db/db.ts` — progress, SRS boxes, backup.
10. `src/lib/srs.ts`, `src/lib/session.ts`, `src/lib/speech.ts`, `src/lib/text.ts` — cloze, session split, TTS, answer matching.
11. `src/screens/Today.tsx`, `src/screens/Review.tsx`, `src/screens/Progress.tsx` — daily plan, review loop, progress.
12. `src/screens/Reading.tsx`, `src/screens/Listening.tsx`, `src/content/readings.ts` — standalone library.
13. Sample units, one per level: `src/content/units/a1-01.ts`, `a2-10.ts`, `b1-30.ts`, `b2-60.ts`.
14. `package.json`, `vite.config.ts`, `README.md` — stack, PWA, deployment.

Do not read all unit files. Do not modify anything. Do not run the app.

## 10. Output format

Write the review in Russian, with English examples and terminology where useful. Keep it concrete. Use this structure:

1. **Verdict** — score 1–10 and one paragraph explaining it.
2. **What works** — at most 7 points, each with a reason.
3. **What to change** — ranked by impact. For each: problem → concrete change → effort (S/M/L) → expected effect. At least 10 items, at most 15.
4. **Answers to the 10 questions** — one by one, no evasion.
5. **C1 plan critique** — what to keep, merge, cut, move, add.
6. **Next two weeks** — the three changes you would make first, and why.
7. **What not to change** — things that are already right and should be protected.

Rules:

- No generic advice such as “use spaced repetition” or “practice more speaking”. Say exactly what to change in this app.
- Cite files or line numbers when you refer to implementation.
- If you think a constraint is wrong, say so and explain the trade-off. Do not silently ignore it.
- Distinguish “this is broken” from “this is a deliberate trade-off”.
- Do not rewrite the content. Review the design.
- Do not propose cloud services, accounts or sync unless you explain why the offline constraint should be broken.
