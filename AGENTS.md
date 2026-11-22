# Project instructions for agents

Before changing this project, read **`docs/review-findings.md`**. It preserves the two independent reviews, the verified content audit, the decisions already made, the current state and the pending work. It is the long-term memory for this repository.

Current state: version 0.98.4; 234 units (24 C1); 1,792 words; 3,750 exercises; 29 Studio tasks (4 A1, 5 A2, 6 B1, 6 B2, 8 C1 projects); 54 standalone reading texts, all inside target ranges; error bank with spaced review and workshop mixing; speaking block with 43 tasks (30 answers, 10 shadowing, 3 minimal-pair drills) and a fluency cycle; level filters in reading and listening; weak-text retry list; library audio on demand (precache ~18 MB); writing portfolio with single-work text export; Studio state in IndexedDB; backup reminder; `npm run check` includes DB, accept-map and content tests; `npm run test:e2e` covers the full lesson flow, the full studio flow, the reading library, a backup round-trip, error retry, resume, listening threshold and a Pixel 7 viewport; `npm run test:e2e:offline` checks the built PWA offline on desktop and mobile; naturalness pass for all 210 A1–B2 units and the 54 library texts done; C1 units and 8 C1 projects written; second independent review of 0.97.0 recorded in `docs/review-2/` (Gemini 7.4, Kimi 6.5), P0 trust fixes in 0.98.0, P1a content part 1 in 0.98.1, P1b B2-grammar part 1 in 0.98.2, full B2/C1 accept pass in 0.98.3, formula-leak and B2 modal cleanup in 0.98.4.

Next planned phase: P2 design decisions (level gates, micro-production, daily load) — not started. Remaining P1 content, if the owner wants it: full authored distractors for 422 B1–C1 banks, optional B1/A2/A1 accept pass, and a broader B2 grammar audit. The IELTS block stays on hold by user request.

Hard constraints: offline-first PWA for one user; no accounts, payments or sync; short 10–15-minute lessons; American English; workbook design; no gamification; TypeScript content; JSON backup.

Useful commands:

```bash
npm run check
npm run test:e2e
npm run test:e2e:offline           # builds, then checks the PWA offline
npx playwright install chromium   # once per machine, before test:e2e
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
```

`npm run test:e2e` starts the dev server on port 4173 itself and runs the desktop suite plus a Pixel 7 project (lesson and studio flows, viewport checks). `npm run test:e2e:offline` builds the app, serves `dist` on port 4174 and checks offline startup and a lesson on desktop and mobile. `test-results/` and `playwright-report/` are gitignored.
