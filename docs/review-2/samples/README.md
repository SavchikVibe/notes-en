# Samples

Six units, four library texts, two Studio tasks and three speaking tasks, copied from the current
build. They are real content, not examples written for the review.

## Units (`samples/units/`)

| File | Level | Why it is here |
|---|---|---|
| `a1-07.ts` | A1 | Early unit, short word list, basic grammar |
| `a2-23.ts` | A2 | Everyday topic, controlled production |
| `b1-38.ts` | B1 | Longer text, more complex sentences |
| `b2-17.ts` | B2 | Report/exam-style topic |
| `b2-49.ts` | B2 | Abstract topic, collocations |
| `c1-14.ts` | C1 | Academic grammar (inversion), C1 register |

These are the source files. At runtime `src/content/index.ts` merges `extraExamples`, photos and
derived exercises (a dictation and a speak task), so the learner sees slightly more than the file
contains. The derived logic is in `code/content-index.ts`.

## Library (`samples/library/readings.json`)

Four texts with questions, options, answers and evidence:

| Id | Level | Title |
|---|---|---|
| `reading-12` | A2 | The School Trip |
| `reading-31` | B1 | The School Play |
| `reading-40` | B2 | Remote Work and Small Towns |
| `reading-50` | C1 | The Limits of Measurement |

Check the evidence quotes against the paragraphs; that is the main quality claim of the library.

## Studio (`samples/studio/`)

| File | Level | Task |
|---|---|---|
| `a2-03.ts` | A2 | A short four-step task |
| `c1-07.ts` | C1 | A project: analytical report |

Each has reading, listening (dialogue, notes, gist questions, transcript), writing (prompt,
minimum words, checklist, model answer) and speaking (prompt, preparation, recording, checklist).

## Speaking (`samples/speaking.json`)

Three tasks: an A1 answer, a B1 shadowing task, and a B2 minimal-pair drill. They show the three
formats: prompt + preparation + recording, model lines, and word pairs with separate audio.
