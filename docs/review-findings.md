# Review findings, decisions and project state

This file preserves the independent reviews of the project and the decisions made after them. Read it at the start of a new session, before changing content or architecture. It is the long-term memory for the project.

Last updated: 2026-11-20, version 0.93.0.

## 1. What was reviewed

Two independent reviews were run on the same brief (`docs/review-brief.md`):

- **Gemini 4 Argon** — verdict **6.5/10**: architecture and UX 8.5, pedagogy and B1–B2 content 4.5.
- **Kimi K3.1 Pro** — verdict **5.5/10**.

Both agreed on the main point: the shell is strong, but the learning core at B1–B2 was weaker than it looked. The app could produce a false sense of competence: a learner could finish B2 without writing a paragraph, speaking without a prompt, or reading a text longer than 120 words.

The raw reviews are not stored here; this file keeps every actionable recommendation, the verified facts, and the decisions.

## 2. Verified facts from the audit

The audit was run with `scripts/audit-content.ts` (`npm run audit:content`) across all 210 units.

| Check | Result |
|---|---|
| `choice` correct answer = index 0 | 720 / 750; in 190 / 210 units every `choice` answer was A |
| `listen (choice)` answer = A | 204 / 210 |
| `read` question answer = A | 610 / 630 |
| `assemble` with fewer than 2 distractors | 517 / 540; A2 100/100, B1 180/180, B2 180/180 |
| `translate` with fewer than 2 accepted variants | 349 / 420; B2 120/120 |
| Duplicate sentences inside a unit | 739 |
| Average reading length | A1 53, A2 68, B1 96, B2 87 words |
| Target reading length in `CURRICULUM.md` | A1 100–200, A2 200–400, B1 400–800, B2 700–1000 |
| Standalone reading library | 10 texts, all A1 (at audit time; A2 texts were added later) |

These were content-generation defects, not only UX issues. The position bias was fixed at render time (options are shuffled), but the content itself still has skewed answers, weak distractors, narrow `accept` lists and short texts.

## 3. Engine fixes already shipped

These are done; do not regress them.

- Options are shuffled deterministically in `choice`, `listen`, `read` and standalone listening. The correct index is remapped. TFNG stays in canonical True / False / Not Given order.
- Lesson progress stores latest answers, first answers and skipped exercises (`src/db/db.ts`). `saveResume` no longer wipes answers. Restart resets the current attempt. Skipped exercises are excluded from the score. The result screen says “Итоговая точность” and “Ошибок с первой попытки”.
- SRS: `reviewCard` is called only on the first attempt in a session; intervals are `[0, 1, 3, 7, 16, 35, 75, 150]`; a wrong answer returns after 6 hours; new cards are limited to 8 per session; distractors prefer the same part of speech and level; the cloze finds the exact form or a stem instead of leaving the word visible.
- `speech.ts` selects only `en-US`; the voice can be chosen in Settings and previewed. Studio dialogues use bundled neural audio, not system TTS.
- Internal punctuation is ignored when comparing translations: “Can I have the check please?” equals “Can I have the check, please?”. Decimal points between digits are preserved.
- Studio speaking can be completed after a recording or after “Пропустить речь”; the checklist is optional and does not block completion.
- The validator now warns about answer skew, missing distractors, single accepted translations, duplicate sentences, British spelling/IPA, and short reading texts. Warnings do not fail the build. `npm run audit:content` gives the detailed counts.
- Ten A1 reading texts had tense errors (“Tomorrow we go”, “Today I see”) and were fixed.
- Standalone reading marks a text as done only with at least 60% correct answers (2 of 3, 3 of 4, 3 of 5). A weaker result leaves the text in the library for another attempt. The reading and listening screens show the text level.

## 4. Consensus recommendations from both reviews

These are still the backbone of the roadmap.

1. **Do not mass-produce C1 before fixing the learning design.** Build a vertical slice first. This was done: the Studio format now has reading, listening, writing and speaking in one task.
2. **Fix measurement before adding content.** Answer position, scoring, resume and SRS had to be trustworthy first. This was done.
3. **Add writing as a real task.** The `write` type now exists: prompt, minimum words, checklist, model answer, local draft, revision. It is used in every Studio.
4. **Reading and listening need a real library.** Ten A1 texts are not enough. Texts should be leveled, reusable, and include exam formats: True/False/Not Given, matching headings, evidence, note completion, inference.
5. **Speaking must be production, not reading aloud.** The learner should speak from a prompt, record, self-assess, and re-record. The Studio does this. The standalone “Речь” block on Today is still marked “скоро” and should eventually use the same format.
6. **SRS needs production cards and sane workload.** Recognition-only cloze is not enough. Add typed production, longer intervals, new-card limits, leech handling, and chunks/collocations. FSRS is not necessary now.
7. **Add an error bank and interleaving.** Mistakes currently live only inside a lesson. Save wrong exercises with a due date and mix them into later practice.
8. **The validator must check more than structure.** American English, level fit, naturalness, distractor quality, answer distribution and duplicate sentences all need checks or human review.
9. **Do not treat the C1 plan as “B2 with rarer grammar”.** It needs longer discourse, synthesis, writing, and independent work.
10. **Protect the constraints.** Offline, one user, no accounts, short lessons, 8 words, no gamification, workbook design, TypeScript content, JSON backup.

## 5. Argon’s specific recommendations

- Keep the mandatory lesson at 14 exercises; add an optional +6 practice set rather than lengthening the core.
- Reading library: 36 long texts (8 A2, 10 B1, 12 B2, 6 C1), each used for several tasks.
- SRS: eight boxes `[0, 1, 3, 7, 16, 35, 75, 150]`; on a wrong answer move back two boxes, not always to zero; limit new cards; add leech handling.
- Writing: `prompt`, `minWords`, `targetPhrases`, `checklist`, `modelAnswer`, three phases: draft, compare with model and rubric, revise.
- Speaking: blind recall first (hide the English phrase until after recording), duration/rhythm feedback, simple prosody markup, IELTS Part 2 timed monologue.
- C1: add US undergraduate pragmatics, logical fallacies, US institutions (lease, healthcare, banking, tenant rights), spoken idiomaticity, college composition, connected speech.
- Technical: lazy-load levels, remind the user to export a backup; do not spend time on photos for abstract vocabulary.

## 6. Kimi’s specific recommendations

- Mandatory core 10–12 exercises plus an optional 10–15-minute workshop; do not add more identical `choice`/`assemble` items.
- Reading: start with 12 B1 + 12 B2 texts, reuse each text for several passes, add two new texts per month; use IELTS formats.
- SRS: fix direction and workload first; production-first cards; 8 new cards/day; add 75/180-day intervals; leech handling; review chunks and grammar through error correction, not formula cloze.
- Writing: self-assessment rubric, model answer, revision, portfolio; no automatic IELTS band.
- Speaking: fluency cycle first (prompt → 60–90 sec recording → rubric → re-record), then shadowing and minimal pairs.
- C1 plan:
  - merge `01+08`, `09+47`, `11+17+18`, `13+45`, `22+23`, `30+54`, `31+40`;
  - move `12` (data) to B2, `06` and `19` before `16`, `27` (repair) to B1, `41` (email) earlier;
  - replace `49 Academic job talk` and `59 Mock conference panel` with office hours, group project, research proposal, seminar contribution;
  - add dialogue practice, long lecture notes, multi-source reading, US pragmatics, a real capstone, extensive reading by interest.
- Technical: add regression tests for scoring, skip/resume, SRS intervals and session building; do not prioritize code splitting over learning features.

## 7. Decisions made

- **Engine first.** Fix answer shuffling, scoring, resume, SRS and validator before new content. Done in 0.37.1–0.37.2.
- **Exercise count.** New C1 units should have **12 mandatory exercises + an optional workshop**. Existing A1/A2 keep 12; existing B1/B2 keep 14 until content revision. Do not mechanically cut two exercises from all 210 units: in A1/A2 they carry practice, and in B1/B2 a workshop made from the same examples would be repetition, which both reviews criticized.
- **Studio format.** A separate “Студия” section for long tasks, not inside the 10–15-minute lesson. Each task has reading, listening, writing, speaking. Access from Today; progress and current step persist.
- **Studio count.** 27 tasks total: 4 A1, 5 A2, 6 B1, 6 B2, 6 C1. One per 10-unit block. Completed in 0.38.0–0.49.0.
- **Audio.** Studio dialogues use bundled neural audio (Edge TTS, generated at build time). System TTS remains for words and as a fallback. The user’s phone has only one system voice; this is expected.
- **Voice settings.** The user can choose an en-US system voice for words/fallback; Studio audio is fixed. No Studio voice picker for now.
- **Storage.** Precache is about 17 MB: app shell plus Studio audio. Library audio (54 MP3) is excluded from precache and cached on demand in the `library-audio` Cache Storage bucket when a text is opened. Studio audio stays fully offline from the first launch.
- **Validation semantics (0.59.0).** In-unit readings are short by design: the minimum is A1 40 / A2 55 / B1 70 / B2 60 words, and long reading lives in the library. The duplicate check only compares sentences across exercises, because reusing a word example as an exercise is intended scaffolding. The «all choice answers are A» check was removed: options are shuffled at runtime. Library length targets live in `npm run check:readings`.
- **Current learner level.** The learner is at A1, about 15 of 40 lessons. Do not assume B2. A1-01 is available now; A1-02 after unit 20; A1-03 after 30; A1-04 after 40. A2/B1/B2/C1 are future goals.
- **Next phase.** Content revision A1–B2: assemble banks with fewer than two distractors and single-variant translations. Then the IELTS exam block.

## 8. Current state (0.93.0)

- 230 units: A1 40, A2 50, B1 60, B2 60, C1 20 (hybrid, 24 planned).
- 1,760 words, 3,690 exercises: 12-14 core per unit plus 3 optional workshop exercises generated from unused word examples.
- Workshop flow: after a lesson, the result screen offers «Мастерская»; the workshop screen runs optional exercises without scoring and appends up to 3 due errors from earlier lessons.
- Naturalness pass A1-16…40: fixed calques and mismatches — «ответь на телефон» → «на звонок», «практиковал английский» → «занимался английским», present continuous translated as «носит» → «на ней», `cinema` → `movies`, «собрать чемодан» → «уложить», «делать стирку» → «стирать», «проект был весёлым» → «интересным», «grow up» examples made natural.
- Naturalness pass A1-01…15: removed past tense and present continuous from units where they are not taught yet (01, 03, 04, 08, 09, 10, 12), fixed «университет» → «колледж» and «напиши молоко в список» → «добавь».
- Naturalness pass A2-01…10: «любимый родственник» → «родственница», «организую стол» → «разбираю», «в эти дни» → «в последнее время», «ужасное движение» → «пробки», `cinema` → `movies`, «учится на степень» → «получает высшее образование», `doctor's appointment`.
- Naturalness pass A2-11…20: «занимает деньги» → «берёт в долг», `fall` chosen over `autumn` (both are correct in the US; `fall` is more common), «инженерия» → «инженер по образованию», «хорошие вызовы» → «трудные задачи», «держит обещания» → «сдерживает», `practicing` (real UK/US spelling fix), «разрешают собак» → «пускают с собаками».
- Naturalness pass A2-21…30: «Их результаты были равными» → «одинаковые результаты», «Парк полон дикой природы» → «В парке много диких животных», «Не бойся ошибиться» → «Не бойся провала», «весь юнит» → «всю тему», «указания есть на карте» → «на карте указано, как пройти». «Can you solve this task?» → «this equation»; «give a tip» → «leave a tip»; «nearby park» → «park nearby»; `film` → `movie`; «both apartments are the same as each other in one way» → «have one thing in common»; «never want to break up our friendship» → «lose our friendship»; «unlikely to appear immediately» → «I am unlikely to find one immediately»; «get along at school» → «get along with our classmates»; «people often break up in spring» → «they decided to break up last month»; «Can I take your order?» translated as «Готовы сделать заказ?».
- Naturalness pass A2-31…40: «Хорошая карьера требует терпения» → «требует времени», «Повышение сопровождается более высокой зарплатой» → «означает прибавку к зарплате», «История правдива» → «Эта история — правда», «информация ложная» → «неверна». `stretch` переводится как «делать растяжку», а не «растягиваться»; `works in a small team` → `on a small team`; `please make our guests comfortable` → `help our guests feel at home`; `How do you celebrate New Year?` → `New Year’s`; `Which channel` → `What channel`; `asked a favor of my neighbor` → `asked my neighbor for a favor`; `I wonder if you can help` → `could help`; `He politely agreed` → `He kindly agreed`; `film` → `movie` в a2-37 и a2-40. В a2-39 исправлен сломанный вопрос чтения («Почему отменили занятие» → «Что узнал автор») и `look for` переведён в Present Continuous.
- Naturalness pass A2-41…50: «о истории» → «об истории», «забыл свою подпись» → «забыл поставить подпись», «в конце — вежливо» → «Closing with regards», «Следующая очередь моя» → «Наконец настала моя очередь», «Обслуживание стоит десять процентов» → «Сервисный сбор». `film` → `movie`; `catch a later train` после отмены рейса → `a later flight`; `double room has two beds` → `is bigger`; `service costs ten percent` → `service charge`; `the headache` → `your headache`; `This unit reviews grammar` → `This lesson`; `Она самостоятельный ученик` → `ученица`; `practising` → `practicing` (US).
- Исправлены смысловые ошибки в текстах: в a2-46 «забронировали номер, но свободных номеров нет» → «номер ещё не готов»; в a2-47 медсестра больше не накладывает повязку при температуре (проверяет температуру, вопрос чтения обновлён); в a2-48 вопрос «Когда встреча?» → «Когда менеджер пригласил её?»; в a2-49 гарантия относится к машине, а не к ремонту (пример, формула, сборка, текст и вопрос).
- A2 полностью вычитан (01–50).
- Naturalness pass B1-01…10: `the film` → `the movie` (6 мест в b1-01), `practises` → `practices` (b1-05, включая accept и текст), `Cyber security` → `Cybersecurity`, `Cyber attacks` → `Cyberattacks` (b1-07). Кальки: «Чтение помогает твоему развитию» → «способствует личностному росту», «лидерство строит доверие» → «укрепляет доверие», «сильная академическая база» → «хорошая академическая подготовка», «устойчивые решения» → «экологичные решения», «возобновляема» → «возобновляемый источник». В b1-08: `Carbon is a major cause` → `Carbon dioxide`, `Carbon emission is` → `Carbon emissions are`. В b1-03 текст больше не отправляет человека с трёхлетним опытом на стажировку: `internship` → `a job` с испытательным сроком.
- Naturalness pass B1-11…20: «Сюжет было легко понять» → «За сюжетом было легко следить»; «держи ум активным» → «помогает сохранять ясность ума»; «Чтобы получить право, нужен диплом» → «получить квалификацию»; «сдвиг в сторону удалённой работы» → «переход к удалённой работе»; «сдвиг в политике» → «изменить политику». `at our own speed` → `at our own pace`, `food and transport` → `transportation` (US), `go to university` → `go to college`, `at the desk` → `at your desk`. В b1-15: `A counterargument is` → `One counterargument`, `The best structure` → `The best solution`. В вопросах чтения убраны местоимения «he» там, где пол автора не указан (b1-11, b1-18). В b1-11 компромисс теперь «agreed to decide later».
- Naturalness pass B1-21…30: найден и убран английский текст в русском переводе — «Фестиваль celebrates местное наследие» → «прославляет». Тот же дефект найден сканированием всех юнитов и исправлен заранее в B2: b2-15 «поглощает farmland» → «сельхозугодья», b2-26 «снижают relevance» → «релевантность», b2-27 «Город celebrates мультикультурализм» → «гордится мультикультурализмом». `everything worked` → `worked out` (b1-21, b1-28), `might be used` → `might have been used` (b1-27), `worth paying attention` → `paying attention to`, `three months early` → `in advance`. В b1-25 `Every choice has a consequence` → `consequences` (пример, диктант и перевод), `public transport` → `transportation`. В b1-26 `a forever decision` → `a decision for life`. В b1-22: `The price is a bargain` → `At that price, it is a bargain`, `offers an exchange` → `allows exchanges`, `answered my complaint` → `responded to my complaint`. Кальки: «Будь терпелив к процессу» → «Наберись терпения», «сделали предположение о стоимости» → «предположили, сколько это будет стоить», «недвижимость рядом с парком» → «объект находится рядом с парком», «делают его стоящим просмотра» → «благодаря тонким символам его стоит посмотреть».
- Naturalness pass B1-31…40: «кредиты» в смысле зачётных единиц → «зачётные единицы» (b1-32), «Он хочет карьеру, которая приносит удовлетворение» → «работу», «Было облегчением закончить» → «Закончить было облегчением», «Команда стала устойчивее» → «стойче», «Рассказчик — молодой парень» → «мальчик», «ведёт историю» → «ведёт повествование». `public transport` → `public transportation` (b1-35, пример и сборка; затем ещё 11 вхождений в b2-12, b2-15, b2-24, b2-42, b2-44, b2-53), `Protecting habitat` → `habitats`, `The manuscript was 300 pages` → `pages long`, `the communication was the best part` → `communication`. В b1-37 `The app offers a free subscription` → `The subscription is free for students`, вопросы чтения больше не предполагают пол автора. В b1-38 прямая речь выделена кавычками: `“Life is a journey” is a metaphor`.
- Библиотека чтения: в трёх текстах ещё встречается `public transport`; менять только вместе с перегенерацией MP3 (`python scripts/generate-library-audio.py`), иначе озвучка разойдётся с текстом.
- Naturalness pass B1-41…50: в b1-42 текст переписан целиком — раньше он почти повторял b1-27 (странная операция → блокировка карты → возврат денег). Теперь это история о краже личности через заявку на кредитку, с кредитным рейтингом и PIN; вопросы обновлены. В b1-49 «совпадением было то, что она так ясно помнила» заменено на естественное совпадение (у матери тот же снимок в альбоме). «Jet lag woke me» → «I woke up … because of jet lag» (b1-41). Кальки: «В школе преподают питание» → «основы питания», «придерживается здорового распорядка» вместо «следует оздоровительному режиму», «Проект требует самоотдачи» вместо «приверженности», «снова наладить общение» вместо «сблизиться» (b1-47), «каждые выходные выделяют время друг для друга», «раздаточный материал» вместо «раздатки» и «материала» (b1-50), «Сбавь темп», «доклад вдохновил всех». `The film` → `The movie` (b1-45), «подорвал его доверие» → «доверие к нему». В b1-46 музей теперь «сохраняет историю города и делится ею с посетителями».
- Naturalness pass B1-51…60: «Время показывает время» → «Грамматическое время показывает, когда происходит действие» (b1-54); `Perfect aspect connects two times` → `two points in time`; `The past tense is irregular` → `The past tense of this verb is irregular`. `If I keep consistency` / `If I keep my consistency` → `If I stay consistent` (b1-60, текст и речь), «юнит B2» → «урок B2». Кальки: «вывести значение» → «догадаться о значении», «Шум — частое отвлечение» → «Шум часто отвлекает», «Смотри приложение для деталей» → «Подробности смотри в приложении», «Она чувствует принадлежность» → «чувствует себя частью целого». `at university` → `at college` (b1-53); `a clear regulation` → `clear regulations` (b1-57).
- B1 вычитан полностью (01–60).
- Naturalness pass B2-01…10: `That is the skill IELTS reading tests` → `the skill that IELTS reading tests` (b2-01); `The attitude of the writer` → `The writer’s attitude`; `Attitudes to work` → `Attitudes toward work` (US). В b2-03 убрано противоречие «рос два года и достиг пика в 2019» (2018→2019 — один год). В b2-05 «мелкие ошибки допустимы, если мысль ясная и точная» → «если мысль ясная»; в b2-07 `greenhouse emissions` → `greenhouse gas emissions` (пример, диктант, перевод), `depletes local water` → `local water supplies`, «община» → «местное сообщество». В b2-08 «качество школ не равно» → «сильно различается», вопрос чтения переформулирован. Кальки: «проблемы происходят из» → «коренятся в» (b2-06); `disrupted transport` → `transportation` (b2-09); `The tutorial is in a small group` → `takes place in`.
- Naturalness pass B2-11…20: UK→US — `car park` → `parking lot` (b2-11; затем ещё 6 вхождений в b2-32), `transport plan` → `transportation plan` (b2-13), `better transport` → `transportation`, `transport hubs` → `transit hubs` (b2-15), `transport delay` → `shipping delay` (b2-16), `pay rise` → `pay raise` (b2-19). Кальки и точность: «изучает миграционные модели» → «закономерности миграции», «нагружает ресурсы» → «истощает ресурсы», «упаднические отрасли» → «угасающие отрасли», «строит доверие» → «укрепляет доверие». `We compared the two groups with a control group` → `the results with`; `Qualitative data is rich but small` → `limited`; `Users leave the echo chamber slowly` → `It is hard to leave an echo chamber`; `defended its coverage as a watchdog role` → `as part of its watchdog role`; `The interviewer probed the answer` → `probed deeper`.
- Naturalness pass B2-21…30: в b2-22 исправлены логика и коллокации маршрута — «walk past the reception» → `the reception desk`, «turn left at the corridor» → `into the corridor`, «the roundabout outside is not the right entrance» → `Do not confuse the roundabout outside with the entrance`, абзац с кафе больше не противоречит подвалу (кафе на первом этаже, лаборатория на уровень ниже), `go straight over the roundabout` → `through`. UK→US: `transport` → `transportation` в категориях расходов b2-23. Точность: «Она высоко в образовании» → «занимает высокое место по образованию», «Теоретическая рамка» → «основа», «Vaccination reduced the disease» → `the number of cases`, `longer life does not always mean healthier life` → `a healthier life`, `They telecommute to reduce commuting` → `avoid the daily commute`, `The tool augments the team` → `the team’s work`. «Тайминг» убран из b2-26 и b2-50 — вместо него «умение распределять время»; `Irrelevant details reduce relevance` → `Too many details reduce relevance`, «Один предок воевал» → «Один из предков».
- Naturalness pass B2-31…40: `A supporting detail proves the main idea` → `supports`, «доказывает» → «подкрепляет» (b2-31); `The sediment was layers deep` → `several layers deep` (b2-34); «нагружает пенсии» → «создаёт нагрузку на пенсионную систему», `The demographic is changing` → `The demographic picture is changing` (b2-36); `decarbonize transport` → `transportation` (b2-39). Остальные шесть юнитов блока чистые: b2-32, b2-33, b2-35, b2-37, b2-38, b2-40.
- Naturalness pass B2-41…50: в b2-43 британское `enquiry` заменено на американское `inquiry` во всех 11 местах (слово, id, примеры, сборка, речь, текст), IPA → `ɪnˈkwaɪri`. `A place opened from the waiting list` → `opened up on`, `a cancellation might open a place` → `free up a table`; «доступность ограничена» → «свободных мест мало». b2-44: `Collocation means words that go together` → `A collocation is a group of words that often go together`, `Strong collocation` → `Good collocations`. b2-45: «медицинский провайдер» → «медицинское учреждение / поставщик медицинских услуг» (слово, три примера, речь). b2-48: `Respect matters in cultural appropriation` → `when cultural elements are borrowed`. b2-49: «проверять галлюцинации» → «проверять ответы на галлюцинации». b2-50: «переводится в band» → «в итоговый балл» (пример и перевод). Юниты b2-41, b2-42, b2-46, b2-47 чистые.
- Naturalness pass B2-51…60: `urban transport` → `transportation` (b2-54); «социальный капитал строит доверие» и «взаимность строит сотрудничество» → «укрепляет» (b2-55); «волонтёрит» → «работает волонтёром» (b2-56); «аутрич» → «работа с сообществом» в двух примерах (b2-59); в переводе `scaffolding` убрано английское слово → «поддержка (в обучении)» (b2-60). Юниты b2-51, b2-52, b2-53, b2-57, b2-58 чистые.
- Финальное сканирование по всем юнитам, речи и студиям нашло ещё пять британских `practis-`: a2-15 (текст), a2-20 (сборка и текст — пример был исправлен раньше, а сборка нет) и `speaking.ts`. Все заменены на `practic-` в 0.87.1.
- Naturalness pass finished for all 210 units: A1-01…40, A2-01…50, B1-01…60, B2-01…60.
- Library naturalness pass (0.88.0): all 54 texts checked for UK forms. 32 edits in 16 texts: `public transport` → `public transportation` (reading-34, 40, 46), `bus journeys`/`journeys` → `trips` (reading-30, 34, 46), `travel in transport` → `in transit` (reading-38), `on holiday` → `on vacation` (reading-31, 53), `cinema ticket` → `movie ticket` (reading-39), `marks` → `grades` (reading-42), `loves films` → `movies` (reading-36), `go to university` → `go to college` (reading-28), `timetable` → `schedule` in the school text (reading-35, with the evidence quote), `railway` → `railroad` (reading-44, 48 and two questions), `first lesson` → `the start of the school day` (reading-35, with evidence). Evidence quotes updated where needed; `check:readings` green. MP3 regenerated for the 16 affected texts; the other 38 files are untouched.
- Small Studio fixes without audio impact: `on holiday` → `on vacation` (a2-02 option), `holiday plan` → `vacation plan` (b2-02 option), `labour market` → `labor market` (b2-01 reading), `programme` → `program` in the c1-05 reading. The c1-06 dialogue still says `programme` and needs its studio audio regenerated.
- C1 hybrid started (0.89.0–0.93.0): C1-01…20 written. Each unit: 8 academic words, 4-paragraph reading, 10 authored exercises + 2 derived = 12 mandatory, plus the workshop. C1-01 seminar talk, C1-02 research question, C1-03 academic disagreement, C1-04 reading an abstract, C1-05 lecture structure, C1-06 source paraphrase, C1-07 paragraph claim–evidence–commentary, C1-08 academic collocations, C1-09 methods section, C1-10 data in text, C1-11 distancing and caution, C1-12 source evaluation, C1-13 speech openings, C1-14 inversion, C1-15 fronting and cleft, C1-16 rhetorical devices, C1-17 debate case, C1-18 rebuttal and fallacies, C1-19 speaking under pressure, C1-20 listening between the lines. `LEVEL_INFO` for C1 says 24 lessons + 8 projects and 1,600–1,800 words in cards, with vocabulary breadth coming from reading and projects. `CURRICULUM.md` keeps the 60-topic bank and records the hybrid decision.
- 27 Studio tasks: 4 A1, 5 A2, 6 B1, 6 B2, 6 C1.
- 54 standalone reading texts: 10 A1 (107–118 words), 10 A2 (200–213), 12 B1 (300–384), 12 B2 (702–718), 10 C1 (901–915). All texts are inside their target ranges.
- 27 Studio audio files and 54 library audio files in `public/audio/`.
- Error bank: IndexedDB store `errors` (DB version 3), due errors on Today, practice screen `/errors`. Backup includes errors.
- Speaking block: 40 tasks (30 answers + 10 shadowing) in `src/content/speaking.ts`, screen `/speaking`, 2 per session, progress in `kv`. Fluency cycle: `/fluency`, 60 seconds without preparation, 3 prompts per level, recording and repeat, no checklist.
- Reading retry list: weak results are stored in `kv` (`reading-results`) and shown as «Вернуться» above the level chips; tapping opens that text in repeat mode.
- Studio step and done state live in IndexedDB (`kv` key `studio:<id>`); old localStorage state migrates once.
- `npm run check` also runs `check:db` on `fake-indexeddb`: resume, first-attempt scoring, finish, SRS boxes, error intervals, portfolio, backup and reset.
- Writing portfolio: drafts live in the IndexedDB `writings` store (DB version 4), with the first checked version and the current text; screen `/portfolio`, linked from Progress. Old localStorage drafts migrate on first open. Backup includes writings and does not erase them when an older backup lacks that section. A revision prompt appears after checking, and the detail view marks whether edits exist.
- Backup reminder: Today shows a row after 10 finished lessons when the last export is missing or older than 14 days; exporting stamps `last-backup` in `kv`.
- `npm run check` runs content validation, reading checks and logic checks (normalization, shuffle determinism, cloze, session building).
- Translation matching expands common contractions, so «I'm» and «I am» are both accepted.
- Reading and Listening have a level filter with unread counts and default to the learner’s current level.
- Precache is about 17 MB. Library audio lives in the on-demand `library-audio` cache; Studio audio is precached.
- Live app: https://savchikvibe.github.io/notes-en/
- Repo: `SavchikVibe/notes-en`.
- Version 0.93.0.
- `npm run validate:content` passes with 0 warnings. Assemble banks always contain every answer token plus at least two distractors; dictation picks a sentence not already used in the unit; the IPA check ignores GA diphthongs like /aɪə/ and /ɔɪə/.
- `npm run check:readings` passes: no heading errors, all evidence quotes exact, all texts in range.
- `npm run audit:content` prints the detailed audit table.

## 9. Pending work

Priority order unless the user changes it:

1. **Reading library.** Complete: 54 texts (10 A1, 10 A2, 12 B1, 12 B2, 10 C1) with evidence, TFNG/heading questions and neural audio. Keep `npm run check:readings` passing when texts change. Reading and Listening have level filters; weak results appear in «Вернуться».
2. **Error bank and workshop.** Error bank is done: first-attempt mistakes in `choice`/`assemble`/`translate`/`listen` are stored in IndexedDB (`errors` store), returned the next day and then at 3, 7, 16, 35, 75 days, and practised from Today → «Ошибки». Workshop is done: each unit has 3 optional exercises, reachable from the lesson result, and up to 3 due errors are mixed into it.
3. **Standalone speaking block.** 40 tasks: 30 answers (6 per level) plus 10 shadowing tasks (2 per level). Screen `/speaking`, 2 tasks per session (one answer + one shadow when available). Fluency cycle at `/fluency`: 60 seconds without preparation, record, listen, repeat the same topic. Still open: IELTS Part 2 structure and minimal pairs.
4. **Content revision.** Done: assemble banks always have every answer token plus two distractors, dictation avoids duplicate sentences, validator is clean. Widening `accept` lists continues only where a real synonym exists.
5. **American English audit.** Done for what the validator can see: US spelling (`dialog`), GA IPA false positives fixed. Re-check when new content is added.
6. **Writing portfolio.** Done: IndexedDB `writings` store, first checked version and current text, `/portfolio` screen linked from Progress, backup support, a revision prompt after checking and an «есть правки» marker. Still open: exporting a single work as text.
7. **C1 hybrid.** Decision: 24 short units + 8 project tasks (essay, report, debate, review); the 6 C1 Studios exist. Not started. Apply the review edits: merge, move earlier, replace academic job talk/mock panel, add US pragmatics, logical fallacies, US institutions, spoken idiomaticity, college composition, connected speech, capstone.
8. **Tests.** `npm run check:logic` covers normalization, shuffle determinism, cloze and session building. `npm run check:db` covers IndexedDB: resume, first-attempt scoring, finish, SRS boxes, error intervals, portfolio, backup and reset. Still open: browser-level tests for the full lesson flow.
9. **Backup reminder.** Done: Today shows a reminder after 10 lessons if the last export is missing or older than 14 days.
10. **Lazy loading / code splitting.** Not urgent; do it only if startup time becomes a problem.
11. **Naturalness pass.** Done for all 210 A1–B2 units and all 54 library texts; audio is in sync. Left: `programme` in the c1-06 Studio dialogue (needs that studio's audio regenerated).
12. **C1 hybrid.** Started: 24 short units + 8 projects instead of 60 units. C1-01…20 done; next C1-21…24 (opinion journalism, review and style, US institutions and pragmatics, capstone). Projects should use the Studio format; the 6 C1 Studios already exist and 2 more are planned.

## 10. What not to change

- Offline-first, one user, no accounts, no sync, no payments.
- Short 10–15-minute mandatory lesson.
- 8 words per unit.
- No gamification, hearts, energy, timers or streak pressure.
- Workbook design: paper, ink, one green accent, Lora + Golos Text + Charis SIL, no gradients/emoji.
- TypeScript content files and JSON backup.
- Bundled Studio audio and neural voices.
- The principle that writing and speaking are self-assessed, not auto-graded.

## 11. Commands and key files

```bash
npm run dev
npm run build
npm run validate:content
npm run audit:content
node scripts/deploy-pages.mjs SavchikVibe/notes-en
python scripts/generate-studio-audio.py
python scripts/generate-library-audio.py
npx tsx scripts/export-library-audio.ts
```

- Brief for external reviewers: `docs/review-brief.md`
- This file: `docs/review-findings.md`
- Curriculum: `CURRICULUM.md`
- Content rules: `CONTENT.md`
- Design rules: `DESIGN.md`
- Studio content: `src/content/studio/*.ts`, index in `src/content/studio/index.ts`
- Studio UI: `src/screens/Studio.tsx`, `src/screens/StudioTask.tsx`, `src/screens/studio/*`
- Exercise views: `src/screens/lesson/exercises.tsx`
- Option shuffling: `src/lib/options.ts`
- Speech/TTS: `src/lib/speech.ts`
- Answer normalization: `src/lib/text.ts`
- Progress/SRS: `src/db/db.ts`
- Validator: `scripts/validate-content.ts`
- Audit: `scripts/audit-content.ts`
- Audio source: `scripts/studio-audio.json`

## 12. Reading library plan and remaining roadmap

### Library target

| Level | Texts | Words each | Status |
|---|---:|---|---|
| A1 | 10 | 100–200 | done: 107–118 words |
| A2 | 10 | 200–300 | done: 164–213 words |
| B1 | 12 | 400–600 | done: 271–384 words (short of target, acceptable for B1) |
| B2 | 12 | 700–900 | done: 702–718 words |
| C1 | 10 | 900–1200 | done: 901–915 words |
| **Total** | **54** | | about 30,000 words |

The 27 Studio tasks add about 10,000 words of reading. Together the app will have about 40,000 words of graded reading.

Every library text has 3–7 questions, evidence, and a neural audio version. Library audio is not precached: opening a text downloads its MP3 into the `library-audio` cache, so it plays offline afterwards. Studio audio stays in precache.

### Remaining stages, in recommended order

1. **Reading library polish.** 54 texts pass `npm run check:readings`. Reading now has a level filter with unread counts, defaulting to the learner’s current level. Still open: the same filter for Listening, and a retry list for weak results. Effort S.
2. **Error bank and workshop.** Save wrong exercises across lessons with due dates; mix old errors into optional practice; implement 12-core + workshop for new units. Effort M. Both reviews asked for this.
3. **Standalone speaking block.** Replace the “Речь — скоро” placeholder with the Studio speaking format: prompt, preparation, recording, rubric, re-record. Add fluency cycle, shadowing, minimal pairs, IELTS Part 2. Effort M.
4. **Content revision A1–B2.** Remove 739 duplicate sentences; add distractors to 517 `assemble` items; widen 349 `accept` lists; vary source answer positions; fix level fit; audit American English; review naturalness and translation quality. Effort L.
5. **Writing portfolio.** Move drafts from localStorage to IndexedDB; keep first and final versions; add a revision view. Effort M.
6. **C1 decision and content.** Decision (2026-11-15): hybrid — 24 short units (academic lexis, grammar, linking) plus 8 project tasks in the Studio format (essay, report, debate, review). Not started; do it after the core polish and when the learner is closer to C1. The 6 C1 Studios exist. Apply the review edits: merge, move earlier, replace academic job talk/mock panel, add US pragmatics, logical fallacies, US institutions, spoken idiomaticity, college composition, connected speech, capstone. Effort L/XL.
7. **IELTS exam block.** Timed Reading/Listening sections, Writing tasks, Speaking test, self-assessment against descriptors; no automatic band score. Effort M/L.
8. **Reliability and final QA.** Regression tests for scoring, skip/resume, SRS intervals, session building and cloze; backup reminder; code splitting only if startup becomes slow; full phone test of offline, update and restore. Effort M.

Do not start stage 6 before stages 1–4: the reviews explicitly warned against mass-producing C1 before the learning core and content quality are fixed.

## 13. User preferences and context

- The user speaks Russian; the app UI is Russian, the course is American English.
- The learner is the user’s child, 9th grade, started at A1/A2 with weak reading.
- Goal: confident B2 and IELTS Academic 6.5–7.0 by summer 2028, then C1 for study and life in the US.
- The user is sensitive to quality and checks the app on a Xiaomi Android 13 phone.
- The user does not share passwords; API keys/tokens may be pasted.
- The user prefers 10-unit content batches and does not want unnecessary model/subagent cost.
- The user has plenty of phone storage; 10–20 MB is fine.
- The user wants the Studio dialogues to sound good; bundled neural audio solved this.
- The user wants the reading library expanded after the Studios.
- The user asked for all review advice to be preserved in the repository so it survives context compaction. This file is that record.

## 14. How to update this file

After each major phase, update:
- the version and current state;
- the library counts;
- the completed items in section 3;
- the remaining stages in section 12;
- any decision that changes the plan.

This file is the source of truth for future sessions.
