# 05 — Claims to verify, and where we are least confident

The owner's claims are below. Check each one against the packet and the code; the status is what
the project believes, not a fact you must accept. If you disagree, say so with evidence.

## Claim 1 — The learning core was rebuilt, not just the shell

**Our position:** yes. Library, Studio, speaking, error bank, portfolio and C1 were added after
the previous review. The unit lesson itself is still 12–14 exercises and still recognition-heavy.

**Verify:** read the six sample units in order A1 → C1. Ask what a learner can actually do after
each one. Read the two Studio tasks. Look at the screenshots.

**Where we may be wrong:** the daily unit is still a quiz. Translation and assemble are
controlled production, but there is no free writing in the 234 units; free writing exists only in
the 29 Studio tasks. If a learner does one Studio per week, that may be too little.

## Claim 2 — Answer-position bias is solved

**Our position:** for the learner, yes: options are shuffled deterministically at render and the
correct index is remapped. For the source content, no: 96% of `choice` answers are still index 0.

**Verify:** `src/lib/options.ts` (shuffle and remap), `exercises.tsx` (`prepared` arrays),
`npm run audit:content`. Run the lesson test and inspect which option is displayed.

**Where we may be wrong:** if the shuffle key is unstable, options could reshuffle between
renders and the learner could lose a selection; if the remap is wrong, the app marks the wrong
option. The tests cover the happy path, not every exercise. A deterministic source cleanup would
be safer but was not done.

## Claim 3 — Distractors are adequate

**Our position:** every `assemble` bank contains all answer tokens plus at least two distractors;
audit reports 0 weak items.

**Verify:** pick three `assemble` exercises from the samples and check whether the distractors are
plausible (same part of speech, same semantic field) or random.

**Where we may be wrong:** “two distractors” is a structural rule, not a quality rule. Some
distractors may be implausible, making the task easier than it looks.

## Claim 4 — Translation checking is fair

**Our position:** normalized exact match plus an `accept` list, contractions expanded, internal
punctuation ignored, trailing punctuation optional. Variants added where a real synonym exists.

**Verify:** `src/lib/text.ts`, `matchesAny`, a few `translate` exercises in the samples. Try
natural alternatives that are not in `accept`.

**Where we may be wrong:** 626 translations have a single accepted string. A correct paraphrase
(“He works at a bank” vs “He works for a bank”) can be marked wrong. This is the most likely
source of unfair “Неверно” in the course. The owner chose precision over recall; judge whether
that is the right trade-off at A1–B2.

## Claim 5 — Duplicate sentences were removed

**Our position:** accidental duplicates inside exercises were removed. The audit still reports
1,279 hits, mostly because a word's example sentence is reused as a derived workshop translate or
dictation exercise.

**Verify:** open a unit and its workshop; compare the word examples with the derived exercises.
Decide whether the reuse is useful retrieval or filler.

**Where we may be wrong:** reuse can make a workshop feel like repetition of the lesson, which is
exactly what the previous review criticized. The counter-argument is that retrieval of the same
sentence in a new format is deliberate practice.

## Claim 6 — Reading depth is enough because of the library

**Our position:** unit readings are short by design (53–141 words depending on level); the
library carries long reading: A2 200–213, B1 300–384, B2 702–718, C1 901–915 words. The library
has 54 texts with exam-style questions and evidence quotes.

**Verify:** read `samples/library/readings.json` (A2, B1, B2, C1). Check question quality and
whether the evidence quote really supports the answer. Compare weekly reading volume implied by
the session split (30–45 minutes of reading per day) with what a B2 learner needs.

**Where we may be wrong:** a learner can avoid the library and still finish units; the session
plan includes reading, but the library is a separate screen. In-unit reading at B2 is still
87 words on average, so a learner who only does lessons reads very little.

## Claim 7 — Writing is a real task

**Our position:** yes, in Studio: prompt, minimum words, checklist, model answer, saved draft,
revision, portfolio. Not in every unit.

**Verify:** `samples/studio/a2-03.ts` and `c1-07.ts`, `WritingStep.tsx`, `WriteView` in
`code/exercises.tsx`, and the portfolio screenshot.

**Where we may be wrong:** feedback is a checklist and a model answer, not correction. A learner
can satisfy the word count with poor English and still “pass”. There is no teacher and no LLM
feedback by design. This may be the weakest link in the claim of real writing.

## Claim 8 — Speaking is production, not reading aloud

**Our position:** the standalone block gives a prompt, preparation, recording, replay and a
self-check list; shadowing and minimal pairs are separate; Studio speaking records or skips.

**Verify:** `samples/speaking.json`, `Speaking.tsx`, `SpeakingStep.tsx`, screenshot 09.

**Where we may be wrong:** without ASR, the learner's self-assessment is the only feedback. At A2
a learner may not hear their own errors. The block does not force a minimum length or a retake.

## Claim 9 — SRS is sane

**Our position:** eight boxes, 0/1/3/7/16/35/75/150 days, wrong answer −2 boxes and 6 hours, 8 new
cards per session, up to 20 due, same-POS distractors, cloze from the word's example.

**Verify:** `src/db/db.ts`, `src/lib/srs.ts`, `Review.tsx`.

**Where we may be wrong:** it is recognition only. A learner can recognize “negotiate” in a
cloze and still not produce it. There is no typed production, no leech handling beyond the box
reset, and the 8-new-card limit may be too high or too low for a 2-hour day.

## Claim 10 — C1 is not “B2 with rarer grammar”

**Our position:** 24 units cover academic lexis, hedging, inversion, fronting and cleft,
rhetorical devices, debate and fallacies, source evaluation, US institutions and pragmatics,
connected speech, and a capstone; 8 projects require essay/report/debate/review.

**Verify:** `samples/units/c1-14.ts`, `samples/studio/c1-07.ts`, `CURRICULUM.md`.

**Where we may be wrong:** C1 is 24 units, not 60; it is a bridge, not a full C1 course. The
content was written by an AI and has not been tested with a C1 learner. Academic register may
drift.

## Claim 11 — Progress and scoring are trustworthy

**Our position:** resume skips answered exercises; first attempt counts; skipped exercises are
excluded; wrong answers repeat once at the end without changing the score; DB tests cover resume,
scoring, SRS, errors, portfolio and backup.

**Verify:** `code/db.ts`, `code/session.ts`, `code/Lesson.tsx`, `scripts/check-db.ts`,
`03-STATE-0.97.md`. Try to construct a case where a right answer is marked wrong or progress is
lost.

**Where we may be wrong:** the tests cover the modelled paths, not every UI state. The e2e lesson
test always answers correctly, so the wrong-answer repeat path is not covered end to end.

## Where we are least confident

These are the places where a sharp reviewer can help most:

1. **Assessment validity.** Finishing a unit mostly proves recognition and controlled production.
   Does the course ever prove that the learner can use the language freely?
2. **Writing feedback without a teacher.** Checklist + model answer may be enough for revision,
   or it may teach the learner to copy the model.
3. **Speaking self-assessment.** Without ASR, the learner is the judge. Is the checklist enough?
4. **C1 without a C1 learner.** The material is prepared, not tested in use.
5. **Reuse in derived exercises.** Useful retrieval or filler? The audit cannot tell.
6. **Single-variant translations.** Precision vs fairness. Where is the right line?
7. **The unit-vs-library split.** Does the library actually get used, or is it a separate island?
8. **Update and restore in the real world.** Automated tests cover the happy path; a real version
   swap on a phone is verified by hand at deploy.
