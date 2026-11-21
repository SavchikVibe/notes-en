# 02 — How the app works

This is the mechanics a reviewer needs. It describes the current build (0.97.0), not plans.

## Screens and navigation

Bottom tabs: **Сегодня** (Today), **Путь** (Path), **Словарь** (Vocabulary), **Прогресс**
(Progress). Settings is the gear in the Today header. Other screens are opened from these:
lesson, review, errors, reading, listening, studio, studio task, speaking, fluency, portfolio,
workshop.

### Today

Answers “what should I do now?”. Shows the date, the total planned minutes for the day, and
blocks: course, listening, reading, speaking, SRS. The block split depends on the day's available
minutes (90/120/150/180): for 120 minutes it is 45 course, 25 listening, 30 reading, 10 speaking,
10 SRS. The course block picks the next 1–5 unfinished units. A resume link appears if a lesson
was started. Due errors and due SRS cards are shown as rows. A backup reminder appears after 10
finished lessons if the last export is missing or older than 14 days.

### Path

Units grouped by level, in order, with status and score. 234 units: A1 40, A2 50, B1 60, B2 60,
C1 24. Opening a unit starts a lesson.

### Lesson

A unit has a title, goal, 3–4 formula cards, 8 words (6 in early A1), and 12 or 14 mandatory
exercises plus 3 optional workshop exercises. The reading exercise is moved to the end of the
queue. A wrong answer is appended to the end of the queue once and marked “Повторение ошибки”.
Only the first attempt counts. A skipped exercise is excluded from the denominator. The result
screen shows accuracy, first-attempt mistakes, and the unit's words with IPA and translation.
Progress is saved per exercise, so a resumed lesson skips answered exercises. If every exercise
is answered but the lesson was not finished, it restarts.

### Exercise types

| Kind | Learner does | Checked by | Notes |
|---|---|---|---|
| `choice` | Picks one option to fill a blank | Exact option index after deterministic shuffle | Recognition, 3 options |
| `assemble` | Builds a sentence from a shuffled bank with 2+ distractors | Exact token sequence | Tells the learner not all words are needed |
| `translate` | Translates a Russian sentence into English | Normalized exact match against an `accept` list (`matchesAny`) | No fuzzy matching; contractions expanded; internal punctuation ignored |
| `listen` | Hears a sentence and chooses or types it | Exact match / option index | System TTS for words and unit dictation; neural audio in Studio |
| `speak` | Records the phrase, listens to the model, compares | Always correct; can be skipped | No ASR, no pronunciation score |
| `read` | Reads 3–4 short paragraphs and answers 3 questions | All questions must be correct for the exercise to count | Unit reading is short by design; long reading is in the library |
| `write` | Writes a draft to a prompt, checks against a checklist and a model answer | Self-assessed; minimum word count gates “check” | Used in Studio; drafts go to the portfolio |

Options for `choice`, `listen` and `read` are shuffled deterministically at render time (by
exercise id); the correct index is remapped. True/False/Not Given stays in canonical order. This
is why the source content's answer indices can be skewed without the learner seeing it; see
`05-CLAIMS-TO-VERIFY.md`.

### Workshop

After a lesson result, “Мастерская” opens the 3 optional exercises of the unit without scoring.
Up to 3 errors that are due from earlier lessons are mixed in. The purpose is extra retrieval,
not a second grade.

### Error bank

First-attempt mistakes in `choice`, `assemble`, `translate` and `listen` are saved in IndexedDB
(`errors`). They return the next day, then at 1, 3, 7, 16, 35 and 75 days. A wrong review resets
the box. Due errors appear on Today and on `/errors`; up to 3 are mixed into a workshop.

### SRS (Vocabulary)

Words from finished units become cards. Eight boxes with intervals 0, 1, 3, 7, 16, 35, 75 and
150 days. A correct answer moves one box forward; a wrong answer moves two boxes back and
returns in 6 hours. The review session takes up to 20 due cards and limits new cards to 8. A card
is a cloze from the word's example with 4 options; distractors prefer the same part of speech and
level. This is recognition, not typed production. The word's audio is available.

### Reading library

54 standalone texts: 10 A1 (107–118 words), 10 A2 (200–213), 12 B1 (300–384), 12 B2 (702–718),
10 C1 (901–915). Each has 3–5 questions: multiple choice, True/False/Not Given, and matching
headings in the higher levels. After checking, the correct option and an evidence quote from the
text are shown. A text counts as done only with at least 60% correct; a weaker result keeps it in
the library and adds it to “Вернуться” (retry list). Level chips filter by level and show unread
counts; the default level follows the current course level. Each text has neural audio, cached on
first open for offline use.

### Listening

The same 54 library texts, used in three steps: gist questions, dictation of two short sentences,
and shadowing. Neural audio of the text; level filter and unread counts like Reading. This is
listening comprehension over written texts, not separate dialogue lessons; Studio has the
dialogues.

### Studio

29 long tasks: 4 A1, 5 A2, 6 B1, 6 B2, 8 C1. Each is a four-step cycle:

1. Reading: a longer text with questions and evidence.
2. Listening: a dialogue with neural audio, gap-fill notes, gist questions, transcript after
   checking.
3. Writing: prompt, minimum words, checklist, model answer, draft saved to the portfolio.
4. Speaking: preparation timer, recording, replay, self-check list, or “Пропустить речь”.

Step and completion state persist in IndexedDB (`kv`, key `studio:<id>`). The 8 C1 tasks are
marked as projects (a `kind` badge, “Проект” in the list and header): essay, report, debate,
review, data report, cultural review, etc. There is no separate “projects” section: a project is
a Studio task with a project role.

### Speaking block

43 tasks: 30 answer tasks (6 per level), 10 shadowing tasks (2 per level), and 3 minimal-pair
drills (A2, B1, B2). A session takes 2 tasks, preferring one answer and one shadow. The learner
gets a prompt, preparation time, recording, replay, and a self-check list. Shadowing gives model
lines with play buttons. Pairs give two words with separate play buttons. No ASR, no score.

### Fluency

60 seconds without preparation, 3 prompts per level, record, listen, repeat the same topic. No
checklist.

### Portfolio

Writing drafts from lessons and Studio live in IndexedDB (`writings`) with the first checked text
and the current text, revision count, and dates. The screen lists works, shows first vs current,
and exports one work as a `.txt` file with the prompt, date and current text.

### Settings

Available minutes per weekday, tutor day (90 minutes), en-US voice selection and preview, JSON
backup export/import, reset, and “Проверить обновление”. Backup includes settings, progress,
days, SRS, errors and writings. Import replaces the current data; old backups without a section
do not erase it.

## Offline and updates

- `vite-plugin-pwa` (generateSW). Precache is about 18 MB / 184 entries: app shell, fonts,
  Studio audio (29 MP3). Library audio (54 MP3) is excluded from precache and cached on demand in
  the `library-audio` Cache Storage bucket.
- The service worker updates automatically and reloads the app on `controllerchange`.
- Data is IndexedDB database `english`, version 4, stores: `progress`, `days`, `kv`, `srs`,
  `errors`, `writings`.

## Glossary

| Term | Meaning |
|---|---|
| Unit / lesson | One topic: formulas, 8 words, 12–14 exercises, 10–15 minutes |
| Session | The daily plan assembled from blocks to fit the available minutes |
| Block | Course, listening, reading, speaking or SRS within a session |
| Studio | A long four-step task (reading, listening, writing, speaking) |
| Project | A C1 Studio task with a project role (essay, report, debate, review) |
| Workshop | Optional unscored practice after a lesson, with due errors mixed in |
| Error bank | Wrong first attempts scheduled to return at increasing intervals |
| SRS | Spaced repetition of words, eight boxes, cloze recognition |
| Fluency | 60-second unprepared speech on a topic, recorded and repeated |
| Portfolio | Saved writing drafts with first and current versions |
