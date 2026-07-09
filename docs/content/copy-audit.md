# Copy Audit

Status: inventory only. No app copy changed in this pass.

Goal: keep PhysicsLab direct and tutor-like. The product should not sound like marketing, a motivational app, or a chatbot wrapper. It should sound like a good physics tutor who gets to the task quickly.

## Voice Rules

- Short.
- Concrete.
- Name the physical action: convert, project, compare, read the axis, take area, choose signs.
- No "magic".
- No fake motivation.
- No marketing slogans.
- No "изучи материал" as a vague command.
- No "уникальный путь".
- No claims that imply complete exam coverage before optics and atomic/nuclear exist.
- Nova can comment on an answer, but product claims should stand without Nova.

## P0: Actively Confusing Or Overclaiming

| Surface | Current issue | Why it matters | Recommendation |
| --- | --- | --- | --- |
| Landing hero | Says CE/CT preparation and "понимать, а не зубрить" while content still misses optics and atomic/nuclear tasks. | Sets expectation of a full trainer. | Keep CE/CT context but add "open sections" or make the primary claim about practice on available topics. |
| Exam demo copy | Phrases like "как на реальном тесте" can overstate fidelity. | Current exam variant uses only open generated sections and numeric-choice UI. | Use "mixed variant from open sections". |
| Profile readiness | "Уверенная база", "Середина пути" can feel like readiness labels with too little data. | The model is local and narrow. | Keep explicit disclaimer near labels; consider "Прогресс" naming. |
| Topics upcoming | Optics/quantum appear as disabled soon items, but no roadmap is visible to user. | User may assume they are nearly ready. | Keep "скоро" but avoid implying complete exam readiness. |

## P1: Too Marketing / Too Broad

| Surface | Example pattern | Problem | Recommendation |
| --- | --- | --- | --- |
| Landing | "честный прогресс" repeated | Sounds like positioning copy, not task flow. | Use once or replace with concrete "решено / точность / ошибки". |
| Landing Nova line | "Nova разбирает каждый ответ" | Makes the mascot part of the product promise. | Prefer "После ответа показываем короткий разбор". |
| Profile next step | "Одна короткая тренировка — и видно..." | Good intent, slightly promotional. | "Сделай 10 задач, чтобы появились слабые места." |
| Session summary | "Ты уверенно работаешь..." | Can overpraise after a tiny sample. | Tie to data: "В этой тренировке хорошо пошли..." |

## P2: Polish Later

| Surface | Issue | Recommendation |
| --- | --- | --- |
| Formula page | "скоро задачи" is acceptable but could be more specific. | Later show which task families are planned. |
| AppShell labels | "Профиль" may be weaker than "Прогресс". | Audit after profile purpose is decided. |
| Nova comments | Mostly concrete now. | Keep Nova short and post-answer only. |

## Profile / Navigation Audit

Why profile exists now:

- It stores local progress, XP, practice streak, exam attempts, review plan, per-topic stats, export/import, and reset.
- It is not a social profile or account page.
- It is currently a progress/review cockpit.

Name:

- "Профиль" is technically understandable but semantically weak.
- "Прогресс" is more accurate for the current feature set.
- "Профиль" would make more sense only after accounts, personalization, or settings exist.

Placement:

- It should not live under "Справка" conceptually. Formulas are reference; profile/progress is learning state.
- On desktop it can stay in the lower utility group for now to avoid nav churn.
- On mobile it deserves a bottom-nav slot only if review/progress is a primary loop. It currently has enough functionality to justify that slot.

Minimal recommended change:

- Rename visible label from "Профиль" to "Прогресс" in navigation and page title later.
- Do not redesign the page yet.
- Keep export/import inside this page.

## Copy Rules For New Task Families

Task statement:

- One situation.
- All data visible.
- One requested value.
- Unit in answer options unless numeric-input mode explicitly says otherwise.

Wrong answer feedback:

- First sentence: what went wrong.
- Second sentence: what to do.
- Avoid "ты просто..." or blame.

Help card:

- Title = active subtopic.
- One formula or model.
- One hint.
- One typical mistake.

Landing:

- Say what exists now.
- Do not promise full exam coverage until optics and atomic/nuclear are active.
