# B2 grammar audit

Date: 2026-11-26. Scope: all 60 B2 units, 240 `choice` exercises and the `assemble` banks.
The review said B2 vocabulary was B2 but some exercises still tested A1/A2 grammar.

## What was replaced

39 `choice` items were rewritten. The criterion was the **grammar target**, not the topic:
bare-infinitive-after-modal, simple agreement/tense, basic prepositions and first conditional
were replaced when they were the main point of the item.

The replacements use B2 structures:

- passive and modal passive (`is supported`, `must be heated`, `can be prevented`);
- perfect passives (`had been replicated`, `has been redeveloped`, `will have been extended`);
- passive reporting (`is expected to`, `is said to have been trained`, `is projected to`);
- second conditional (`If trade fell…`, `If trust were low…`);
- participial and relative clauses (`the story framed as a crisis`, `people who move`);
- gerund subject (`Addressing inequality remains…`);
- nominal relative (`what I remember most`);
- hedging/discourse (`the evidence appears to support`, `Generally speaking`);
- verb collocations (`rise/raise`, `give rise to`, `rest on`).

Units touched include `b2-01`, `02`, `03`, `05`, `06`, `07`, `09`, `10`, `11`, `13`, `14`,
`15`, `16`, `17`, `18`, `19`, `20`, `21`, `23`, `25`, `26`, `27`, `28`, `29`, `32`, `36`,
`37`, `39`, `45`, `46`, `47`, `48`, `49`, `51`, `52`, `55`, `58`, `60`.

## What was deliberately left

- **Lexical word-form items** (`stance/stances`, `criteria/criterion`, `bibliography`): these
  test B2 vocabulary, not elementary grammar.
- **Preposition/collocation items** that are B2 lexis (`accounts for`, `rests on`,
  `in order to`): short, but the target is the collocation.
- **Short `assemble` sentences** (`The benefits outweigh the risks`): controlled word-order
  practice, not a claim of B2 syntax.
- **Reading and writing tasks** already use longer B2 discourse; the audit was about `choice`.

The formula card is collapsed by default (`0.98.4`), so the replaced items no longer sit under
an open answer key.

## Guard

`npm run check:grammar` fails if a B2 `choice` still offers a modal + `to` pattern
(`can to`, `may to`, `must to`, `should to`, `might to`) or `is + modal`. It also prints the
number of remaining short/simple `choice` items as information, not a failure.

## What remains optional

A stricter pass could rewrite the lexical/preposition items and longer `assemble` banks too.
That is a separate content project; the current pass removes the explicit elementary grammar
targets the reviewers named.
