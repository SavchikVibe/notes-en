# Project instructions for agents

Before changing this project, read **`docs/review-findings.md`**. It preserves the two independent reviews, the verified content audit, the decisions already made, the current state and the pending work. It is the long-term memory for this repository.

Current state: version 0.81.0; 210 units; 1,600 words; 3,390 exercises (12–14 core + 3 workshop per unit); 27 Studio tasks (4 A1, 5 A2, 6 B1, 6 B2, 6 C1); 54 standalone reading texts, all inside target ranges; error bank with spaced review and workshop mixing; speaking block with 40 tasks and a fluency cycle; level filters in reading and listening; weak-text retry list; library audio on demand (precache ~17 MB); writing portfolio and Studio state in IndexedDB; backup reminder; `npm run check` includes DB tests; naturalness pass for A1, A2 and all of B1 done.

Next planned phase: naturalness pass B2-01…10, then the rest of B2, then the C1 hybrid (24 units + 8 projects). IELTS is on hold by user request.

Hard constraints: offline-first PWA for one user; no accounts, payments or sync; short 10–15-minute lessons; American English; workbook design; no gamification; TypeScript content; JSON backup.

Useful commands:

```bash
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
```
