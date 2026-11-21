# 01 — Product, learner and constraints

## The learner

- One person: a 9th-grade student (born 2011), Russian speaker, living in Russia.
- Started at A1/A2 with weak reading. EF SET in November 2026: 20/100 overall, reading 10,
  listening 30. At the time of this review about 15 of 40 A1 lessons are done.
- Goal: confident B2 and IELTS Academic 6.5–7.0 by summer 2028, then applications to US
  universities (November 2028 / January 2029), then C1 for study and life in the US.
- Time: about 2 hours on weekdays, 3 hours on weekends, roughly 14–15 hours a week. One day a
  week is shorter (90 minutes) because of a tutor.
- Device: Xiaomi 13 Ultra, Android 13, Chrome. The app is installed on the home screen and used
  as a PWA. Offline is the normal mode, not an emergency mode.

## What the product is

A personal English course that answers one question: **what should I do in the next two hours?**
It is a workbook on a phone: a visible path from A1 to C1, short lessons, vocabulary with spaced
repetition, a reading library, listening, speaking practice, long Studio tasks, and a daily
session assembled from blocks to fit the available time.

The design is a paper workbook: warm paper, ink, one green accent, serif headings, no gradients,
no glass, no glow, no emoji, no “AI-looking” UI. The full design rules are in `DESIGN.md` in the
repository root.

## Hard constraints

- **One user, one device.** No accounts, no login, no payments, no sync, no social features, no
  multi-user data model.
- **Offline-first.** Content ships in the bundle. Progress lives in IndexedDB. Library audio is
  cached on demand. The app must open and a lesson must work with the network off.
- **No gamification.** No hearts, energy, XP, badges, levels, loot boxes, streak pressure,
  premium lives, confetti or retention notifications. A streak exists as information only and
  gates nothing. The owner explicitly does not want these mechanics, and the previous reviews
  agreed with that decision. Do not recommend them.
- **Short lessons, long sessions.** A unit is 10–15 minutes. A daily session is 90–180 minutes
  and is assembled from course, listening, reading, speaking and SRS blocks.
- **American English.** US spelling, US vocabulary, General American IPA. This is a requirement,
  not a preference.
- **No AI in the runtime.** No LLM calls, no API keys in the client, no telemetry. The content is
  authored with AI assistance offline and checked by scripts and the owner.
- **Maintainable by one agent and one human.** Content is TypeScript files, not a CMS. No
  backend. A JSON backup must restore everything.

## What success means

The owner will judge the course by these outcomes, not by engagement metrics:

1. **No false competence.** A learner who finishes A1 can do A1 things; finishing B2 means being
   able to read a real B2 text, write a paragraph, and speak for a minute without a script. The
   previous review's central criticism was that the app could produce a false sense of
   competence; this is the main thing to test.
2. **A lesson is finishable.** 10–15 minutes, no padding, no repeated filler.
3. **The English is natural and correct.** No calques, no British forms, no textbook nonsense,
   no mismatched translations.
4. **Progress is never lost.** Resume works, scoring is honest, backup and restore work.
5. **The course can grow.** One agent can add a unit without breaking the validator, the path or
   the tests.

## What the product is not

- Not a startup or a commercial course. There is no growth, retention or monetisation goal.
- Not a school LMS. There are no classes, teachers, assignments or grades.
- Not an IELTS course yet. The IELTS block is intentionally absent and on hold at the owner's
  request; it will be discussed after this review. Do not treat its absence as a defect.
- Not a Duolingo clone. There is no gamification and no bite-sized dopamine loop.
- Not an AI tutor. The app cannot answer open questions; it is a structured course.
- Not a social product. Nothing is shared, ranked or compared.

## Why the owner is asking for a review now

The previous review (version 0.37.0) produced two low scores: 6.5 and 5.5 out of 10. A large
amount of work has happened since: content was rewritten, the reading library was built, C1 was
written, writing and speaking became real tasks, the error bank and portfolio were added, and
browser tests were introduced. The owner wants an honest second opinion on the **current** build,
not a validation exercise. If the course is still shallow, say where and why. If the previous
criticisms are fixed, say that too, with evidence.
