# Fix route after the second review (0.97.0)

This is the working roadmap agreed on 2026-11-21. It follows the two independent reviews
(`results/kimi-k3.1-pro.md`, `results/gemini-4-argon.md`) and the synthesis (`SYNTHESIS.md`).
Order is by dependency: trust first, content second, depth third. IELTS stays on hold.

## Stage 0 — Safety net (0.5 day) — done

- [x] Add DB checks for first-attempt scoring, error retry and backup `kv`.
- [x] Add e2e helpers that read and write IndexedDB stores (`errors`, `progress`).
- [x] Record the green baseline: `check`, `tsc`, e2e, offline.

Done when: each P0 bug can be reproduced by a test, and the suite is not left red. **Shipped.**

## Stage 1 — P0 trust (1–2 days) — done in 0.98.0

### 1.1 Honest lesson score

- [x] `Lesson.tsx`: compute the final `correct`/`mistakes` from `firstAnswers`, not the latest
      `answers`; keep a local first-answer map and load it on resume.
- [x] Test: wrong first answer → repeat correct → result is not 100%, mistakes = 1.

### 1.2 Resume after skip

- [x] `Lesson.tsx`: ignore skipped exercises when finding the first unanswered one; do not re-show
      answered exercises; handle the "all answered/skipped" case with an explicit finish screen.
- [x] Test: answer some, skip speaking, leave and return; position and score are preserved.

### 1.3 Error bank retry

- [x] `Errors.tsx`: call `reviewError` only on the first attempt; an immediate retry must not move
      the card from +1 day to +3 days.
- [x] Test: wrong → +1 day; immediate correct → still +1 day.

### 1.4 Answer normalization

- [x] `text.ts`: strip all quote characters (`" “ ” « »`), handle `'s` as `is`/`has` and `'d` as
      `would`/`had`, compare variants; update `matchesAny`, `Listening` dictation and the validator.
- [x] Tests: `a2-16-ex-07` (`She's been...`), quoted dictation, `he'd gone`.

### 1.5 Complete backup

- [x] `db.ts`: backup version 2 with `kv` (studio steps, speaking history, reading results,
      `last-backup`); import accepts v1 and v2; v1 must not erase current `kv`.
- [x] Tests: export → reset → import restores studio step, speaking history and retry list;
      old v1 backup still imports.

### 1.6 Listening correctness

- [x] `Listening.tsx`: do not shuffle TFNG; exclude `type: 'heading'` from blind audio; require 60%
      to mark the text done, otherwise show "не засчитано" and keep it in the queue.
- [x] Test: wrong gist/dictation → text is not marked done.

### 1.7 Studio and speaking

- [x] Studio steps pass real sub-scores; `finishLesson` gets the actual score, not `1`;
      the result screen says "Студия завершена" and shows reading/listening/writing/speaking
      statuses ("черновик", "пропущена", "записана").
- [x] `SpeakView`: microphone error must not enable "Проверить"; use the explicit skip.
- [x] Test: Studio with wrong reading and skipped speech does not show 100%.

### Stage 1 exit

- [x] `npm run check`, `tsc --noEmit`, `npm run test:e2e` (12), `npm run test:e2e:offline` (2).
- [x] Version 0.98.0 in the 5 places, build, deploy, commit, update memory.

## Stage 2 — P1a content correctness (2–3 days, in progress)

- [x] `studio-c1-07`: remove invented figures from the model or add them to the briefing; add a
      checklist item "every figure is in the source"; audit the other 28 Studio models.
      `c1-02`, `c1-06`, `c1-03`, `b1-01` models also aligned; all 29 models now meet their word range.
- [x] Ambiguous items: `a2-23-ex-02`, `b2-17-ex-04`, `c1-14-ex-02`, the `Not only` explanation,
      `b1-38` ending.
- [x] Known `accept` false negatives: `c1-14-ex-08`, `b2-17-ex-09`, `b2-49-ex-09`,
      `b1-38-ex-09`, plus 10 obvious B2 paraphrases.
- [x] Full `accept` pass: 241 of 252 B2/C1 translations now have 2–4 curated variants; the 11
      intentionally single items are listed in `docs/review-2/ACCEPT-PASS.md` (0.98.3).
- [x] `buildWorkshop` takes examples from different words; `withDistractors` skips meta-terms;
      `c1-14-ex-04` no longer offers `barely` as a valid alternative.
- [ ] Authored distractors for B1–C1 instead of runtime padding; validator checks raw sources.
- [x] Evidence quotes: `reading-31`, `reading-40`, `reading-50`.

### Stage 2 exit

- [ ] Version 0.99.0, full checks, deploy, commit, memory. Part 1 shipped in 0.98.1; exit waits
      for the full `accept` pass and authored distractors.

## Stage 3 — P1b B2 depth (3–5 days, in progress)

- [ ] Replace A1/A2 grammar inside B1–B2 (`can / can to / is can`, `may / may to / is may`) with
      B2 syntax: complex passive, hedging, conditionals, relative/participial clauses.
      Done for `b2-01`, `b2-17`, `b2-18`, `b2-34`, `b2-46`, `b2-49` in 0.98.2; the rest needs
      a systematic pass.
- [ ] Close the formula leak: do not repeat `formulas.note` verbatim in `choice`, or collapse the
      formula while answering.
- [ ] Optional external audit of 20–30 random units and 5–6 Studio tasks.

## Stage 4 — P2 depth and load (1–2 weeks, needs owner decisions)

- [ ] Level gates every 10 units: Studio + 2 library texts + short production.
- [ ] Micro-production in units: 1–2 own sentences, saved to the portfolio, every 5th unit / B1+.
- [ ] Daily load: 1–2 new units, the rest library/Studio/SRS; Studio replaces blocks.
- [ ] Blind recall in speaking on B1+: hide the English text until after recording.
- [ ] Tutor export: one weekly `.txt`/`.md` with writings, top errors and topics.
- [ ] Retry list for Listening.

## Stage 5 — IELTS (on hold)

- [ ] Separate `kind: 'exam'` block: timed Reading/Listening, Writing Task 1/2, Speaking Parts 1–3,
      self-assessment against descriptors, no automatic band.
- [ ] Do not start before the owner unpauses it.

## Conventions

- Each fix lands with its regression test; do not commit a red suite.
- After each stage: `check` → `tsc` → e2e → offline → version → build → deploy → commit → memory.
- No gamification, accounts, sync, analytics, push, AI tutor, fuzzy matching or fake scores.
- No new units before the P0 engine fixes.

## Open decisions

1. Studio: "attempt completed" vs "full cycle mastered" — P0 implements the honest attempt;
   the mastery gate is P2.
2. Daily load: 1–2 new units instead of 3–4 — P2.
3. `accept` target: 2–4 curated variants for 90% of B2/C1 — P1a.
4. Level gates: Studio + 2 texts per 10 units — P2.
