# Product Simplification Blueprint v1

Date: 2026-07-12

Input: `competitive-product-audit-v1.md`

Status: decision blueprint, not an implementation specification.

## 1. Product Definition

PhysicsLab should become a **hybrid CE/CT physics trainer**:

- a transparent catalog of task types is the map;
- generated similar tasks are the practice engine;
- misconception-aware feedback is the learning advantage;
- weakness data recommends, but never prevents explicit selection;
- a full variant is a separate mode with a strict specification-coverage gate.

### One-sentence promise

> Find the physics task type you need, understand one reference solution, and solve similar variants until the method is stable.

This is more defensible than “prepare for CE/CT by understanding, not memorizing” because it describes an observable workflow.

## 2. Non-goals

The next product layer should not:

- imitate a complete learning management system;
- make XP the primary reason to return;
- expose unavailable topics to imply future breadth;
- call a 10-task balanced drill a full CT variant;
- replace generated tasks with a handwritten dump;
- copy competitor tasks, solutions, taxonomies, or assets;
- add a large theory course before the task catalog works;
- require an account before the learner can try a task.

## 3. Target Information Architecture

### Desktop primary navigation

1. **Сегодня** — current recommendation, resume, recent work.
2. **Задачи** — section/topic/task-type catalog and search.
3. **Варианты** — mixed practice now; full CT variants only after readiness gate.
4. **Ошибки** — observed misconceptions and repeat actions.
5. **Прогресс** — evidence over time and local data controls.

Secondary/reference access:

- **Формулы** inside `Задачи` and contextual help, with a direct route retained for lookup.
- Topic list belongs inside `Задачи`, not permanently expanded in the global sidebar.

### Mobile bottom navigation

Use four destinations:

1. Сегодня
2. Задачи
3. Ошибки
4. Прогресс

Formula lookup is available from task catalog search and a compact secondary menu. Mixed/full variants live under `Задачи` or a visible card on `Сегодня`; they do not need a fifth permanent icon.

### Proposed route model

| Route concept | Job |
| --- | --- |
| `/` or `/today` | Resume or perform one recommended action |
| `/tasks` | Search and browse exam sections/topics/task types |
| `/tasks/[family]` | Reference pattern, solution, mistakes, similar-practice CTA |
| `/practice/[family]` | Deterministic family-focused drill |
| `/practice/topic/[topic]` | Current broad 10-task topic mix |
| `/variants` | Mixed training and, later, full official variants |
| `/mistakes` | Prioritized misconception review |
| `/progress` | Learning evidence, history and data management |
| `/formulas` | Retained reference route, linked bidirectionally to task types |

Route names are conceptual. A migration plan should preserve current deep links until redirects and tests exist.

## 4. Primary Journeys

### Journey A: known weakness

1. Open `Задачи`.
2. Select `Электродинамика`.
3. Select `Закон Ома`.
4. Choose a task type such as “find current”.
5. Inspect a compact reference example if needed.
6. Start five similar generated tasks.
7. See misconception-specific feedback.
8. Continue the same type or move to an inverse variant.

Target: first relevant task in three selections or one search.

### Journey B: learner does not know what to choose

1. Open `Сегодня`.
2. See exactly one primary recommendation based on actual data.
3. Start a 5–10 task drill.
4. At completion, choose one next action: repeat weakness or stop.

Target: no dashboard scan required.

### Journey C: wrong answer

1. Answer remains visible.
2. Inline feedback names the mistake in one sentence.
3. Primary post-answer action is `Следующая`.
4. Secondary `Разобрать` expands a four-step solution in place.
5. `Справка` opens adjacent/overlay context without duplicating the formula.

Target: one semantic accent for outcome, one primary next action.

### Journey D: full exam intent

1. Open `Варианты`.
2. See two clearly separated products:
   - `Смешанная тренировка по открытым темам`;
   - later, `Полный вариант ЦТ` with year/specification label.
3. Incomplete coverage never appears as a full exam.

Target: no ambiguity between practice balance and official blueprint.

### Journey E: return after a week

1. `Сегодня` shows resume first if an active session exists.
2. Otherwise shows one aged/repeated weakness with a direct family drill.
3. If no weakness is due, shows the least-practiced active task group.
4. “All statistics” remains secondary.

Target: one decision, not a dashboard.

## 5. Catalog Architecture

### Level 1: official section

- Mechanics
- MKT and thermodynamics
- Electrodynamics
- Optics and SRT
- Quantum physics
- Atomic nucleus and particles

Unavailable sections should exist in a coverage/status view, not as disabled primary-navigation links. Use plain honest labels such as `Нет задач` or omit them from the default actionable list.

### Level 2: school topic

Examples:

- Mechanics → Kinematics, dynamics, conservation laws, statics/hydrostatics, oscillations/waves.
- Electrodynamics → Electrostatics, DC circuits, magnetism, induction, oscillations/waves.

### Level 3: task type

Examples:

- DC circuits → Ohm's law: find current.
- DC circuits → Series/parallel equivalent resistance.
- Kinematics → Area under v(t).
- Thermodynamics → Gas-state ratio.

### Filters

P0:

- search by student-facing title/formula term;
- active topic;
- task format;
- difficulty range;
- “my mistakes”.

Later:

- official task-number/blueprint mapping;
- source/year where licensed and verified;
- visual/graph tasks;
- completed/not completed.

Do not add a large multi-filter panel to mobile. Search plus topic chips is enough for v1.

## 6. Task-Type Page

### Above the fold

- Breadcrumb: section → topic.
- Task-type title.
- One-sentence skill definition.
- `Решить 5 похожих` primary CTA.
- Compact metadata: format and honest calibrated difficulty.

### Reference pattern

Collapsed by default for returning users; visible on first visit if no progress exists.

1. **Model/law** — one sentence.
2. **Formula/relationship** — one expression.
3. **Substitution** — one line.
4. **Answer** — with units.
5. **Typical mistake** — one item.

### Related actions

- Similar task with new numbers.
- Inverse version of the same law, if available.
- Formula reference.
- Add to a custom drill, later.

## 7. Practice Surface Simplification

### Before answer

Keep:

- topic/task-type context;
- task number;
- prompt/diagram;
- answer control;
- one compact help action.

Remove or demote:

- `Один ответ` when the control already makes format obvious;
- difficulty badge from the primary row unless the learner selected a difficulty;
- persistent closed help card below answers;
- duplicated `Задачи / Справка` segmented control when only one panel is toggleable;
- decorative Nova presence.

### After answer

Use this hierarchy:

1. outcome: `Верно` or `Не совсем`;
2. one misconception-specific sentence;
3. primary `Следующая задача`;
4. secondary `Показать решение`;
5. tertiary contextual help link.

Do not show formula in both the question and feedback. The solution owns the post-answer formula. Help owns the general rule. Each expression has one home per state.

### Desktop help placement

Preferred behavior:

- wide desktop: a right-side contextual panel aligned with the task, not a decorative card column;
- tablet/mobile: bottom sheet or inline accordion immediately after feedback;
- closing help restores focus to the invoking control;
- only the active subsection renders initially.

The current targeted mapping should be preserved. The change is placement and hierarchy, not help content expansion.

## 8. Reduction Matrix

| Current element | Decision | Reason | Target behavior |
| --- | --- | --- | --- |
| Sidebar list of all topics | MERGE | Duplicates Topics page and overstates course breadth | Collapse under `Задачи`; show recent/pinned later |
| Disabled quantum topic | REMOVE | Advertises unavailable work in every screen | Show only in coverage roadmap, not primary nav |
| Mobile bottom nav | SIMPLIFY | Four current items are reasonable, but labels map poorly to target IA | Today, Tasks, Mistakes, Progress |
| XP badge | HIDE | Weak pedagogical meaning and competes with evidence | Remove from global shell; retain data only if needed |
| Nova on landing | HIDE | Decorative before product value is demonstrated | Use no mascot in first viewport |
| Nova in wrong feedback | SIMPLIFY | Useful only when tied to a specific misconception | Inline icon/name at most; no separate avatar block |
| Mistakes route | KEEP | Real differentiated learning value | Direct links to focused family drills |
| Formula reference | KEEP | Valuable lookup job | Link entries to applicable task types |
| Profile route | MOVE/RENAME | It is progress and data management, not identity | `Прогресс`; data controls in secondary section |
| Mixed training | KEEP | Useful broad practice | Keep explicit “open topics”, separate from variants |
| Full exam claim | REMOVE | Unsupported by coverage | Add later only after readiness gate |
| Help drawer | SIMPLIFY | Accurate but distant and duplicated | One contextual trigger; adjacent desktop panel |
| Practice focus card/header | SIMPLIFY | Too many labels before the task | Title + one line; task starts immediately |
| Difficulty badge | HIDE | Internal calibration is not official difficulty | Show only when user filters/selects it |
| Progress badge `1/10` | KEEP | Essential session orientation | Integrate into one quiet header line |
| Streak | HIDE | Low-value metric, especially with sparse use | Secondary progress detail, not global card |
| Solution feedback | KEEP/SIMPLIFY | Core learning value | Four-step structure, no duplicate formula |
| Topic cards | MERGE | Equal large cards plus sidebar duplicate selection | Compact catalog rows with family counts |
| Next-step recommendation | KEEP/SIMPLIFY | Useful return action | One primary action on Today, direct to family |
| Warm-up task on landing | MOVE | Real product is below a marketing hero | Make task or catalog the first viewport |
| Animated starfield | SIMPLIFY | Ambient motion adds no learning value | Static subtle background; no cursor connections |
| Data export/import | KEEP/MOVE | Valuable for local-only storage | Secondary `Данные` area under Progress |
| “Review Intelligence” label | REMOVE | Internal jargon | Plain `Повторить` or no eyebrow |

## 9. MVP Definition

### Hybrid Trainer MVP

The next credible product milestone is not more polish. It is:

1. A public catalog exposing all 35 current families with student-facing labels.
2. A stable task-type page for every family.
3. Family-focused practice reachable without random selection.
4. Reference solution → similar generated task loop.
5. Direct links from mistakes and formulas to relevant task types.
6. Simplified navigation that does not advertise unavailable content.
7. Honest coverage page against the six RIKZ sections.

### MVP acceptance outcomes

A new user can:

- find Ohm's law and start only that family in under 30 seconds;
- find a graph task by search;
- open a representative solution before practice;
- solve a similar variant with new parameters;
- return from a mistake directly to the matching family;
- understand that mixed training is not a full CT variant;
- see which official sections are not yet covered.

### Not required for this MVP

- authentication;
- cloud sync;
- full 30-task exam;
- atomic/quantum implementation;
- new answer formats;
- teacher assignment system;
- social leaderboards;
- AI chat tutor.

## 10. Readiness Gate for Full CT Variants

Do not expose a “full CT variant” until all conditions are met:

1. All six official sections have released task families.
2. Each major official subsection has at least one family or is explicitly excluded by a published scope.
3. Closed multi-answer tasks are supported.
4. Open integer-answer rules match official units and answer grammar.
5. Variant builder supports 30 tasks and official section distribution.
6. Difficulty coverage includes official levels beyond current D1/D2/D3 calibration.
7. Variant scoring and timing are explicitly modeled.
8. Content samples are reviewed against legitimate official/historical patterns.
9. Product copy names the specification year.

Until then, retain `Смешанная тренировка по открытым темам`.

## 11. Visual Simplification Rules

1. One dominant action per screen state.
2. One semantic accent per outcome; topic color must not compete with correctness.
3. Page sections are unframed; cards are for tasks, repeated items, or genuinely bounded tools.
4. Remove non-actionable disabled navigation.
5. Mascot appears only when it contributes instruction.
6. Animation must explain change, not decorate idle time.
7. On desktop, use available width to preserve task/help context instead of centering a narrow stack.
8. On mobile, reserve viewport space for task and answer controls, not duplicated headers.
9. Empty states state the next action in one sentence.
10. Progress is evidence, not decoration: do not show five metrics when all are zero.

## 12. Measurement Plan

Track later, only after a privacy/product decision:

- time from entry to first submitted answer;
- percentage of sessions started from explicit family vs recommendation;
- solution-open rate after wrong answer;
- second-attempt correctness on the same family;
- return-to-family rate from Mistakes;
- catalog search success/no-result rate;
- completion rate by family and broad topic;
- percentage of users who understand mixed vs full variant in usability testing.

Do not optimize XP or streak before these learning metrics exist.

## 13. Proposed PR Sequence

Maximum four PRs; each must remain independently reviewable.

### PR 1 — Task catalog foundation

Goal: expose current content without changing generator physics.

- define student-facing task-type metadata;
- add compact `/tasks` catalog with search/topic filters;
- show honest family counts;
- stable links for every current family;
- no new task families.

Risk: metadata drift. Mitigate with registry-to-catalog consistency tests.

### PR 2 — Reference solution and focused drill

Goal: implement the signature loop.

- task-type detail page;
- representative reference solution using existing formula/help/explanation data;
- `Решить 5 похожих` direct family batch;
- deterministic E2E for Ohm, graph and numeric examples.

Risk: a generated explanation may not be a good reference. Require curated compact reference metadata per family rather than selecting a random generated variant.

### PR 3 — Navigation and practice hierarchy simplification

Goal: align shell and practice with the catalog model.

- collapse topic list under Tasks;
- remove disabled quantum and global XP;
- rename Profile to Progress;
- remove duplicated practice controls/formula display;
- place targeted help adjacent on desktop;
- reduce non-instructional Nova and motion.

Risk: broad visual regression. Keep behavior and data contracts unchanged; verify desktop/mobile visual baselines deliberately.

### PR 4 — Bidirectional learning links and honest coverage

Goal: connect explicit and adaptive practice.

- Mistakes → focused family drill;
- formula entry → related task types;
- Today recommendation → family, not broad page;
- coverage view mapped to the six RIKZ sections;
- separate mixed training from future full variants.

Risk: taxonomy mismatch. Use one shared task-type entity and coverage mapping rather than route-specific dictionaries.

## 14. Decisions Required Before Implementation

1. Accept Model C as product direction.
2. Accept that the next milestone is discoverability of existing content, not more families.
3. Decide whether `Сегодня` replaces the current landing or becomes the authenticated-style return surface without authentication.
4. Approve removal of disabled quantum and global XP from primary navigation.
5. Approve `Профиль` → `Прогресс` as a semantic rename.
6. Define whether official task-number mapping is deferred until a complete, sourced blueprint exists. Recommended: defer.

## 15. Residual Risks

- A better catalog will make content gaps more visible. That is desirable, but it may make the product feel smaller before it becomes more complete.
- Generated variation can still be shallow if only numbers change. Reference pages must disclose the skill boundary and later add inverse/combined variants.
- Local-only progress limits the return journey across devices. Do not solve this in the catalog PR.
- Full CT readiness remains a content and answer-architecture program, not a navigation change.
- The official specification may change by year. Store specification year and source explicitly when full variant work begins.
