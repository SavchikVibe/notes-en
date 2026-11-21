# Independent review packet — English PWA, version 0.97.0

Date: 2026-11-21. This is a read-only review. The only file you may write is your report in
`docs/review-2/results/`.

You are reviewing a **personal, offline-first English course for one learner**. It is not a
startup, not a commercial product, and not a demo. It is a working textbook on a phone, built
iteratively by an AI coding agent for one household, with content checked by scripts and by the
owner, not by a school.

## What changed since the previous review

The previous independent reviews were run at version 0.37.0 (`docs/review-brief.md`):
Gemini 4 Argon scored 6.5/10, Kimi K3.1 Pro scored 5.5/10. The main criticism was that the
B1–B2 learning core was weaker than the shell: short readings, recognition-only exercises, no
real writing, no speaking production, weak distractors. Since then the course has been rebuilt
substantially: 234 units, a 54-text reading library, 29 Studio tasks, a 43-task speaking block,
an error bank, a writing portfolio, C1 units and projects, and browser tests.

`04-WHAT-CHANGED.md` lists the delta claim by claim. `05-CLAIMS-TO-VERIFY.md` lists the old
criticisms and what happened to them. **Verify both yourself; do not take them on trust.**

## Scope

In scope:

- learning design and progression A1 → C1;
- quality of the actual content (units, readings, Studio tasks, speaking tasks);
- assessment, error handling and feedback;
- phone UX and the workbook design;
- technical reliability: offline, persistence, resume, scoring, backup;
- maintainability by one agent and one human.

Out of scope (deliberate decisions, do not score as missing):

- **The IELTS block is not built.** It is on hold at the owner's request and is planned after
  this review. Comment on what it would need, but do not mark the course down for not having it.
- **No gamification.** No streaks, hearts, XP, badges, levels, loot, social features, push
  notifications or retention mechanics. The owner does not want them and the previous reviews
  agreed. Do not recommend them.
- No accounts, payments, sync, backend, analytics or telemetry. One user, one phone, local data.
- No AI tutor, no LLM calls in the app. The app must work with the network off.
- No human teacher in the loop. Self-assessment is the model.

## Read order

1. `01-PRODUCT.md` — who the learner is, constraints, what success means.
2. `02-HOW-IT-WORKS.md` — screens, flows, glossary, learning mechanics.
3. `03-STATE-0.97.md` — verified numbers and evidence.
4. `06-RUBRIC.md` — how to score.
5. `07-QUESTIONS.md` — the questions the owner wants answered.
6. `04-WHAT-CHANGED.md` and `05-CLAIMS-TO-VERIFY.md` — delta and old criticisms.
7. Samples: `samples/` (6 units, 4 library texts, 2 Studio tasks, 3 speaking tasks).
8. Code: `code/ARCHITECTURE.md` and the 8 key files. Do not read the whole `src/` tree unless
   a specific claim requires it.
9. Screenshots: `screens/` (11 phone screens).
10. `EVIDENCE.md` — raw command output and measurements.

**Do not read `docs/review-findings.md` before you have formed your own verdict.** It contains
the project's own conclusions and the previous scores. You may read it after drafting your
report and note where you disagree with the owner's decisions.

You may run read-only commands (`npm run check`, `npm run audit:content`, `npm run test:e2e`,
`npm run test:e2e:offline`) if the environment allows it. Do not run `npm install`, do not
deploy, do not modify app code, content or configuration.

## Review protocol

1. Read the product and mechanics. Write down what you think the course claims to do.
2. Inspect the six sample units against their levels. For each: is the English natural, is the
   level right, are the distractors plausible, are the translations correct, does the reading
   hold together, does the feedback teach anything?
3. Inspect the four library texts and their questions. Check evidence quotes against the text.
4. Inspect the two Studio tasks end to end (A2 and C1 project): reading, listening, writing
   prompt, checklist, model answer, speaking task.
5. Inspect the code paths that carry trust: resume, first-attempt scoring, SRS, error bank,
   backup. Look for ways the learner can be marked wrong when right, or right when wrong.
6. Form a verdict, then read `04` and `05` and check whether the claimed fixes are real.
7. Answer the seven questions.
8. Write the report.

## Deliverable

Write the full report to `docs/review-2/results/<your-model-name>.md`, in Russian or English
(owner reads both; Russian is preferred for the final summary). Then reply with a short version
(no more than 15 lines) containing the overall score and the top three fixes.

Required structure:

```markdown
# Review — <model>, version 0.97.0

## Verdict
One paragraph: what this is, what it does well, what it does not.

## Scores
| Dimension | Score (1–10) | One-line reason |
| Learning design and progression | | |
| Content quality | | |
| Assessment and feedback | | |
| Phone UX and design | | |
| Reliability and offline | | |
| Maintainability | | |
| **Overall** | | |

State the scale you used (1 = broken, 5 = usable but shallow, 7 = good, 9 = excellent,
10 = exceptional). The previous scores were 5.5 and 6.5 on the same 10-point scale.

## Strong sides
Five specific things, with evidence (`file:line`, unit id, or screenshot).

## Weak sides
Five specific things, each with evidence and a concrete failure scenario. Distinguish
"the learner is misled" from "the material is shallow" from "the code can break".

## Content audit of the sample
Per unit: level fit, naturalness, translation, distractors, reading logic, one concrete flaw
or "clean". Do not skip units.

## Answers to the seven questions
Numbered, one or two paragraphs each.

## What would raise the score by one point
Three to five items, each with effort S (< 1 day), M (1–3 days), L (> 3 days) for one agent.

## What not to do
Things that look tempting but would hurt this product or violate its constraints.

## Optional ideas
Anything outside the constraints, clearly marked optional. No gamification, accounts or sync.

## Confidence and limits
What you could not verify; what would change your mind.
```

Rules for evidence: every criticism must point to a file, a unit id, a screenshot, or a command
output. "Feels shallow" is not evidence. If you cannot verify something, say so.

## A note on scoring

Score **the current build 0.97.0**, not the roadmap and not the previous version. The learner is
currently at A1 (about 15 of 40 A1 lessons); B2 and C1 content is prepared material, not yet
used. Do not judge by usage analytics; there are none by design. Judge the material and the
machine, and say explicitly when your score is limited by not having a real learner to observe.
