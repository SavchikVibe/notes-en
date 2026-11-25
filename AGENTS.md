# Project instructions for agents

Before changing this project, read **`docs/review-findings.md`**. It preserves the two independent reviews, the verified content audit, the decisions already made, the current state and the pending work. It is the long-term memory for this repository.

Current state: version 0.99.2; 234 units (24 C1); 1,792 words; 3,750 exercises; 29 Studio tasks (4 A1, 5 A2, 6 B1, 6 B2, 8 C1 projects); 54 standalone reading texts, all inside target ranges; error bank with spaced review and workshop mixing; speaking block with 43 tasks (30 answers, 10 shadowing, 3 minimal-pair drills) and a fluency cycle; level filters in reading and listening; weak-text retry list; library audio on demand (precache ~18 MB); writing portfolio with single-work text export; Studio state in IndexedDB; backup reminder; level gates at A1→A2, A2→B1, B1→B2, B2→C1 (Studio + 2 texts + writing + speaking), with the next level locked until passed; every 5th unit has a self-assessed micro-writing task in the workshop; daily plan takes 2 new units (1 on the 90-minute tutor day); `npm run check` includes DB, accept-map, gate and content tests; `npm run test:e2e` covers 14 flows including the full gate A1, lesson, studio, library, backup, errors, resume, listening threshold and a Pixel 7 viewport; `npm run test:e2e:offline` checks the built PWA offline on desktop and mobile; naturalness pass for all 210 A1–B2 units and the 54 library texts done; C1 units and 8 C1 projects written; second independent review of 0.97.0 recorded in `docs/review-2/` (Gemini 7.4, Kimi 6.5), P0 trust fixes in 0.98.0–0.98.5, P2 level gates in 0.99.0, micro-production in 0.99.1 and the 2-unit daily load in 0.99.2.

Next planned phase: P2 step 4 — blind recall in speaking on B1+ (hide the English text until after recording). Daily load shipped in 0.99.2. The IELTS block stays on hold by user request.

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
