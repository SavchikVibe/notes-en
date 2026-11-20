# Project instructions for agents

Before changing this project, read **`docs/review-findings.md`**. It preserves the two independent reviews, the verified content audit, the decisions already made, the current state and the pending work. It is the long-term memory for this repository.

Current state: version 0.94.0; 234 units (24 C1, all C1 units written); 1,792 words; 3,750 exercises; 27 Studio tasks (4 A1, 5 A2, 6 B1, 6 B2, 6 C1); 54 standalone reading texts, all inside target ranges; error bank with spaced review and workshop mixing; speaking block with 40 tasks and a fluency cycle; level filters in reading and listening; weak-text retry list; library audio on demand (precache ~17 MB); writing portfolio and Studio state in IndexedDB; backup reminder; `npm run check` includes DB tests; naturalness pass for all 210 A1–B2 units and the 54 library texts done, C1-01…24 written.

Next planned phase: the C1 project half of the hybrid (8 projects). The 6 C1 Studios exist; they can be mapped to 6 of the 8 projects, leaving 2 new ones (research proposal and capstone) to write. IELTS is on hold by user request.

Hard constraints: offline-first PWA for one user; no accounts, payments or sync; short 10–15-minute lessons; American English; workbook design; no gamification; TypeScript content; JSON backup.

Useful commands:

```bash
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
```
