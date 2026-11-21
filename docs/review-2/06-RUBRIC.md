# 06 — Rubric

Score the current build **0.97.0**. The previous review scores (6.5 and 5.5) were holistic; the
weighted score below is intended to make the second review comparable and less dependent on
mood. Give both: dimension scores and one holistic overall.

## Dimensions

| # | Dimension | Weight | What it covers |
|---|---|---:|---|
| 1 | Learning design and progression | 25% | Does the path A1→C1 make sense? Is there a vertical slice? Does each level add the right skill? Is 10–15 minutes enough? Is the session plan coherent? |
| 2 | Content quality | 25% | Natural English, level fit, translation accuracy, distractor quality, reading logic, register, US English, C1 academic depth |
| 3 | Assessment and feedback | 15% | Does the app know what the learner can do? First-attempt scoring, error bank, SRS, writing and speaking feedback, false-competence risk |
| 4 | Phone UX and design | 15% | Workbook design, readability, tap targets, sticky actions, navigation, empty/loading/error states, density, offline affordances |
| 5 | Reliability and offline | 10% | Resume, persistence, backup/restore, service worker, updates, scoring correctness, data loss risks |
| 6 | Maintainability | 10% | Content schema, validator, tests, module boundaries, ability of one agent to add a unit without breaking things |

Weighted overall = Σ(dimension score × weight) / 100. Also give a holistic score; if it differs
from the weighted one, explain why.

## Scale

Use the same 10-point scale for dimensions and overall:

| Score | Meaning |
|---:|---|
| 1–2 | Broken or misleading; cannot be used for its purpose |
| 3–4 | Major gaps; usable only with substantial outside help |
| 5 | Usable but shallow; the shell works, the learning core does not yet carry the claims (the previous 5.5 verdict was here) |
| 6 | Above average for a personal project; clear gaps that limit outcomes |
| 7 | Good: a motivated learner can make real progress; weaknesses are known and bounded (the previous 6.5 verdict was here) |
| 8 | Very good: assessment and feedback are credible; false-competence risk is low |
| 9 | Excellent: would survive an external teacher's audit and real learner use |
| 10 | Exceptional for this purpose; no material weakness found |

Anti-inflation rule: if you are torn between `n` and `n+1`, choose `n` and state what evidence
would move it up. Do not give 8+ for “good effort” or “impressive for an AI project”; score the
product against its own claims.

## Calibration for this product

A **7** means: the learner can follow the path, the English is mostly natural, the library and
Studio add real reading/writing/speaking, but assessment still leans on recognition and the
writing/speaking feedback is self-assessed.

An **8** additionally needs: evidence that the learner cannot pass a level without producing the
level's skills; writing feedback that catches more than word count; speaking feedback that is not
only self-report; content that has been sampled and found clean beyond the six examples.

A **9** additionally needs: real learner evidence over months, external content review, and a
credible answer to “how do you know the learner is B2?”.

## What to score, not what to praise

- Do not reward the amount of content. 234 units of shallow material is worse than 60 good ones.
- Do not reward the design system in itself; it is a constraint, not an achievement.
- Do not penalise the absence of gamification, accounts, sync, analytics, AI tutor or IELTS.
- Do penalise anything that could make the learner believe they are better than they are.
- Do penalise content that is wrong, unnatural, or at the wrong level, even if it is rare.
- Do penalise data-loss and scoring bugs more than visual imperfections.

## Evidence rules

- Every dimension score needs at least one concrete evidence item.
- Every weak side needs a failure scenario: what happens to the learner, in which screen, with
  which content.
- Separate “this is wrong” (bug, bad English, incorrect answer) from “this is a trade-off I would
  decide differently” (short unit readings, single-variant translations, no ASR).
- If you could not inspect something (for example, real phone performance), say so and do not
  let it inflate the score.
