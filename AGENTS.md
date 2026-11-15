# Project instructions for agents

Before changing this project, read **`docs/review-findings.md`**. It preserves the two independent reviews, the verified content audit, the decisions already made, the current state and the pending work. It is the long-term memory for this repository.

Current state: version 0.58.0; 210 units; 1,600 words; 2,760 exercises; 27 Studio tasks (4 A1, 5 A2, 6 B1, 6 B2, 6 C1); 54 standalone reading texts (10 A1 at 107–118 words, 10 A2, 12 B1, 12 B2 at 700–718 words, 10 C1 at 901–915 words); error bank with spaced review; standalone speaking block with 30 tasks.

Next planned phase: A1–B2 content revision (duplicate sentences, weak distractors, single accept lists), then the IELTS exam block.

Hard constraints: offline-first PWA for one user; no accounts, payments or sync; short 10–15-minute lessons; American English; workbook design; no gamification; TypeScript content; JSON backup.

Useful commands:

```bash
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
```
