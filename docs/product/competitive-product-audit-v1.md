# Competitive Product & Cognitive Load Audit v1

Date checked: 2026-07-12

Repository baseline: `6257fcb508e57a49eae6eaa571994e82b19402c5`

Scope: product, pedagogy, information architecture, cognitive load, and competitive position. No implementation changes.

## 1. Executive Verdict

PhysicsLab is a credible **learning-oriented drill prototype**, not a complete CE/CT physics trainer.

The strongest part is the loop inside a task:

1. the learner sees a task immediately;
2. an incorrect option can be tied to a named misconception;
3. feedback stays compact until the learner requests the solution;
4. contextual help opens a relevant subsection;
5. completed work contributes to a local weakness model.

The weakest part is everything before and around that loop. A learner cannot reliably ask for a specific skill such as Ohm's law, choose a particular task type, inspect the available task bank, or run a full specification-aligned exam. The interface repeatedly presents broad topics, progress furniture, XP, decorative cards, and support surfaces, while the underlying content remains 35 generated families across five active topics.

The product currently looks broader than it is. The UI communicates a finished trainer; the content model is still a curated slice.

**Recommended product model: C, Hybrid CT Trainer.** PhysicsLab should combine:

- a searchable CT task-type catalog with reference solutions and similar generated variants;
- a short adaptive drill that selects the next useful family from actual mistakes;
- a clearly separated full-variant mode only when specification coverage is sufficiently complete.

Do not choose pure Model A. The current weakness-driven loop is useful but cannot satisfy learners who know exactly what they need or want to prepare by exam task type. Do not choose pure Model B. A static bank would discard PhysicsLab's main differentiation: generated variants, misconception-aware feedback, and targeted help.

## 2. Audit Method

### Product inspection

The following current routes and states were inspected in the running application at desktop `1440x900` and mobile `390x844`; practice was also checked at the `360x800` layout level:

- `/`
- `/topics`
- `/practice/kinematics-demo`
- practice before answer, wrong answer, expanded solution, and contextual help
- `/practice/exam-demo`
- `/mistakes`
- `/formulas`
- `/profile`
- session-summary implementation and associated copy

The route implementation, AppShell navigation, generator registry, learning metadata, progress/review stores, formula reference, tests, and existing content audits were read.

### Competitor inspection

No competitor task, explanation, image, or proprietary taxonomy was copied. The audit records navigation and interaction patterns only.

Competitor pages were checked on 2026-07-12:

- [РЕШУ ЦТ и ЦЭ, physics catalog](https://phys_ct.sdamgia.ru/prob_catalog)
- [РЕШУ ЦТ, Ohm-law category](https://phys_ct.sdamgia.ru/test?filter=all&category_id=26)
- [Adukar, CE/CT online](https://adukar.com/by/ct-online)
- [Adukar, physics tests](https://adukar.com/by/test/ct-fizika)
- [RIKZ, official 2026 specifications](https://rikc.by/cctesting/49-specifikacii-jekzamenacionnyh-testovyh-rabot-po-uchebnym-predmetam-dlja-provedenija-centralizovannogo-jekzamena-i-centralizovannogo-testirovanija-v-2026-godu.html)
- [RIKZ, official physics PDF](https://rikc.by/ru/specification/2026/03.pdf)

The in-app browser could not load the legacy `reshuct.by` certificate, so the current working physics host `phys_ct.sdamgia.ru` was inspected directly. This is disclosed because it affects reproducibility, not the product conclusion.

### Observation ledger

These references make every competitor claim traceable without reproducing copyrighted task content.

| Ref | URL | Checked | Exact observed screen description |
| --- | --- | --- | --- |
| R1 | [Physics task catalog](https://phys_ct.sdamgia.ru/prob_catalog) | 2026-07-12 | Desktop catalog headed “Каталог заданий по типам”; narrow categories are grouped under mechanics, electricity, thermodynamics, optics, nuclear physics and other sections. Each row shows a task count and `Перейти`. The page also has global task-number/text search and separate top-level `Каталог заданий` / `Варианты` navigation. |
| R2 | [Ohm-law category](https://phys_ct.sdamgia.ru/test?filter=all&category_id=26) | 2026-07-12 | Page headed `Электричество. Закон Ома`; shows 43 tasks, a sorting control, actions for 10 or all tasks, and a long list of numbered tasks. Rows show source, task body, answer controls where applicable, and a collapsible `Решение`. |
| R3 | [Example current physics variant](https://phys_ct.sdamgia.ru/test?id=47958) | 2026-07-12 | Variant page instructions explain short-answer grammar, comma decimals and omission of units; tasks are presented as one continuous exam-oriented work rather than a guided one-task flow. |
| A1 | [CE/CT online subjects](https://adukar.com/by/ct-online) | 2026-07-12 | Public subject grid headed “Выбирай предметы…”; each subject card shows counts of tests, lessons and recent learners. Physics showed 21 tests and 7 lessons at inspection time. |
| A2 | [Physics tests](https://adukar.com/by/test/ct-fizika) | 2026-07-12 | Physics page starts with recent 80+ score activity, then separates new tests, free dated variants (2016–2025), and seven broad thematic tests: acoustics, nuclear, mechanics, optics/SRT, quantum, MKT/thermodynamics, and electrodynamics. |
| A3 | [Electrodynamics test start](https://adukar.com/by/test/start/tst928) | 2026-07-12 | Instead of a task, the unauthenticated screen shows “Войди и пользуйся сервисом” and sign-in/registration options. |
| K1 | [RIKZ specifications index](https://rikc.by/cctesting/49-specifikacii-jekzamenacionnyh-testovyh-rabot-po-uchebnym-predmetam-dlja-provedenija-centralizovannogo-jekzamena-i-centralizovannogo-testirovanija-v-2026-godu.html) | 2026-07-12 | Official page published 2025-11-05 lists subject PDFs, including Physics. |
| K2 | [RIKZ physics specification PDF](https://rikc.by/ru/specification/2026/03.pdf) | 2026-07-12 | Official specification states 30 tasks, Part A/Part B formats, six section weights, five difficulty levels, 210 minutes and the permitted calculator class. |

## 3. Product Reality Map

### 3.1 Current capability

| Surface | Current reality | Product value | Limitation |
| --- | --- | --- | --- |
| Active topics | Kinematics, dynamics, electrodynamics, thermodynamics, optics | Covers major introductory areas | Atomic/quantum/nuclear absent; large gaps inside active topics |
| Task bank | 35 generated families | Deterministic variants and reusable QA | A family is not a broad bank of authentic task types |
| Answer formats | 27 single choice, 8 numeric input | Better than choice-only | No multiple-answer or matching; numeric policy is learning-oriented |
| Topic session | 10 tasks | Short and approachable | User cannot choose a subtopic/family |
| Mixed session | 10 tasks, two per active topic | Honest cross-topic practice | Not a 30-task specification-aligned variant |
| Feedback | Misconception line, optional solution, targeted help | Best current differentiator | Expanded state repeats formula and becomes visually heavy |
| Mistakes | Aggregated weakness traps and review plan | Useful adaptive seed | Not a saved-task history; empty state uses product jargon |
| Formula reference | Searchable, grouped, compact accordions | Useful lookup surface | Long, disconnected from task types and similar practice |
| Progress | Local solved/correct/session/weakness data | Honest local evidence | Called Profile; many metrics compete before data is meaningful |
| Persistence | LocalStorage progress, sessionStorage active session | Works without account | No cloud sync or cross-device continuity |

### 3.2 Topic-family distribution

Current families are concentrated as follows:

| Topic | Families | Main strengths | Major missing exam material |
| --- | ---: | --- | --- |
| Kinematics | 6 | Free fall, v(t) slope/area, average speed, units, relative vectors | Circular motion depth, projectile motion, broader graph grammar |
| Dynamics | 11 | Newton, forces, friction, incline, momentum, energy/work | Statics, hydrostatics, oscillations/waves, coupled multi-law problems |
| Electrodynamics | 6 | Ohm, resistor network, full circuit, capacitor, power, charge sharing | Electrostatics depth, magnetism, induction, AC/oscillatory circuit |
| Thermodynamics | 5 | Ideal gas, ratios, heating, phase change, heat balance | First law, processes/cycles, p(V)/V(T), humidity, engines |
| Optics | 7 | Reflection, refraction, mirror and converging-lens basics | Interference, diffraction, TIR depth, vision, SRT |

The count `35` is technically correct but pedagogically misleading if presented without this distribution. It means 35 parameterized skills, not 35 complete CT sections and not a representative exam corpus.

## 4. Official Exam Gap

The current official RIKZ physics specification for CE/CT 2026 states [K1, K2]:

- 30 tasks total;
- Part A: 10 closed tasks, with one or two or more correct choices from five;
- Part B: 20 open tasks with an integer answer in specified units;
- 210 minutes;
- six content sections;
- difficulty levels I through V.

Official section distribution:

| RIKZ section | Tasks | Share | PhysicsLab state |
| --- | ---: | ---: | --- |
| Mechanics | 10 | 33.3% | Partially covered; several large subsections absent |
| MKT and thermodynamics | 7 | 23.4% | Narrow numeric subset |
| Electrodynamics | 9 | 30.0% | Mostly DC circuits; magnetism/induction absent |
| Optics and SRT | 2 | 6.7% | Geometric-optics foundation only |
| Quantum physics | 1 | 3.3% | Absent |
| Atomic nucleus and particles | 1 | 3.3% | Absent |

PhysicsLab's mixed 10-task mode is therefore correctly labeled as mixed training, but it is not an exam simulation. Its two-per-topic balance intentionally differs from the official distribution, has no level IV/V task architecture, and cannot exercise the official closed multi-answer format.

The largest content deficit is not merely two missing final sections. Mechanics lacks pressure/hydrostatics, oscillations, waves, much of statics, and more complex energy systems. Electrodynamics lacks most of electrostatics, magnetism, induction, electromagnetic oscillations, and waves. Thermodynamics lacks process and cycle literacy. Optics lacks wave optics and SRT.

## 5. Same-Scenario Competitive Review

Legend:

- **Fact**: observed in the page or current source.
- **Inference**: product interpretation based on the observed behavior.

### Scenario 1: learner is weak in Ohm's law and wants several tasks only on it

#### PhysicsLab

**Fact:** The learner can open Electrodynamics, but the 10-task batch mixes six electrodynamics families. There is no public family/subtopic catalog or Ohm-only CTA. The help drawer contains an Ohm section, but help selection does not select the next task family.

**Inference:** A learner with a known gap has to accept randomness. PhysicsLab can diagnose a mistake after it occurs, but cannot honor explicit learner intent before practice.

#### РЕШУ ЦТ

**Fact [R1, R2]:** The physics catalog exposes `Электричество → Закон Ома`, shows `43` tasks, offers sorting, and provides direct actions for 10 tasks or all tasks. Individual catalog rows show source, difficulty, task number, and a collapsible solution.

**Inference:** This is substantially better for targeted deliberate practice and teacher-directed homework. Its weakness is a dense, dated interface and limited pedagogical sequencing.

#### Adukar

**Fact [A2, A3]:** The public physics page exposes seven broad thematic tests, including Electrodynamics, but not a visible Ohm-only catalog. Test launch redirects to login.

**Inference:** Better than PhysicsLab for broad section-level selection, worse than РЕШУ ЦТ for a known narrow weakness.

**Winner:** РЕШУ ЦТ.

**PhysicsLab opportunity:** combine an Ohm-law catalog entry with generated “similar task” practice and misconception-aware feedback.

### Scenario 2: learner wants a full exam-like CT variant

#### PhysicsLab

**Fact:** The gate explicitly says that the 10-task mixed session is not a full CE/CT variant. It contains two tasks from each of five active topics and supports resume/new attempt.

**Inference:** Honesty is good, but the user goal is unserved. Resume UX improves continuity, not exam fidelity.

#### РЕШУ ЦТ

**Fact [R1, R3]:** The service has a separate “Варианты” area, historical exam variants, random/teacher-built variants, timer behavior in variant pages, and 100-point prediction/statistics described on its about page.

**Inference:** It owns the exam-simulation job because its corpus and IA are organized around exam tasks, even though its UI is less focused.

#### Adukar

**Fact [A1, A2, A3]:** The physics page lists dated variants from 2016 through 2025 and distinguishes new/free tests. The public list shows 21 physics tests; launching requires an account.

**Inference:** It offers recognizable historical exam practice, with a stronger commercial/account funnel and less transparent task-level browsing.

**Winner:** РЕШУ ЦТ for breadth and configurability; Adukar for a curated historical-variant list.

**PhysicsLab opportunity:** do not relabel mixed training. Build full variant mode only after content and answer-format gates are met.

### Scenario 3: learner answers incorrectly and wants to understand the mistake

#### PhysicsLab

**Fact:** Wrong-answer feedback can name the selected misconception, keeps the full solution collapsed, links directly to the relevant help subsection, and records a weak trap. Expanded solution includes formula/substitution and a typical mistake.

**Inference:** This is the clearest differentiated strength. It reduces the “why was I wrong?” gap better than a generic solution link.

#### РЕШУ ЦТ

**Fact [R2]:** Every inspected catalog task has a “Решение” control and source/difficulty metadata. Solutions are task-specific but the catalog view is long and the learner must self-diagnose the error.

**Inference:** Excellent reference corpus, weaker metacognitive feedback.

#### Adukar

**Fact [A2, A3]:** Public pages expose tests and scores, but the unauthenticated audit could not inspect post-answer explanation because test start requires login.

**Inference:** No claim should be made about explanation quality from the public surface alone.

**Winner:** PhysicsLab for immediate learning feedback, provided the selected misconception is genuinely matched.

### Scenario 4: learner returns after one week and wants the next useful action

#### PhysicsLab

**Fact:** Progress stores last-practiced dates and weak-trap timestamps. The next-step/review logic can elevate an aged or repeated weakness and link to Mistakes. Active mixed attempts can be resumed from the gate. Data is browser-local.

**Inference:** The adaptive seed is real, but the recommendation lacks a direct task-family destination and disappears across devices or cleared storage.

#### РЕШУ ЦТ

**Fact [R1, R2]:** Registration enables statistics and recommendations; task rows expose solved state. The service's public description explicitly describes topic statistics and preparation recommendations.

**Inference:** Account-backed continuity is stronger, but the recommendation quality was not independently evaluated.

#### Adukar

**Fact [A1, A2, A3]:** Account login is required to start tests; the public page shows recent high scores and active learner counts.

**Inference:** Account continuity likely exists, but the public surface does not prove a precise next-action recommender.

**Winner:** No decisive winner on recommendation quality. РЕШУ ЦТ wins cross-session infrastructure; PhysicsLab has a more transparent weakness heuristic but only local persistence.

### Scenario 5: learner wants a specific task or task type

#### PhysicsLab

**Fact:** There is no task-number search, family list, saved task entity, or public URL per task type. Formula search is the only substantial search UI.

**Inference:** This is a P0 product gap. The generator is hidden behind random batches, so content work is not discoverable.

#### РЕШУ ЦТ

**Fact [R1, R2]:** Global search accepts number/text/attribute. The catalog drills into narrow categories, each task has a stable number and page, and tasks can be added to a variant.

**Inference:** It supports students, tutors, and teachers speaking the same task language.

#### Adukar

**Fact [A2]:** The public physics page lists named variants and seven topic tests, but no visible task-number or fine-grained family search.

**Winner:** РЕШУ ЦТ by a wide margin.

## 6. Competitive Pattern Matrix

| Capability | PhysicsLab | РЕШУ ЦТ | Adukar |
| --- | --- | --- | --- |
| Start a broad topic | Strong | Strong | Strong |
| Select a narrow task type | Missing | Strong | Weak/publicly absent |
| See available task depth | Hidden | Counts per category | Counts of tests/lessons |
| Similar generated task | Strong internally, not user-addressable | Large bank, not parameterized UX | Not verified |
| Reference solution | Good after answer | Strong per task | Not verified unauthenticated |
| Misconception-specific feedback | Strong | Weak | Not verified |
| Full historical variants | Missing | Strong | Strong list |
| Specification fidelity | Explicitly incomplete | High corpus alignment | Claims analogous difficulty |
| Return recommendation | Local heuristic | Account statistics/recommendations | Account required; quality unknown |
| Visual clarity | Modern but over-signaled | Dense and dated | Conventional content portal |
| Low-friction access | No account | No account for catalog | Login required to start |

### What to borrow

From РЕШУ ЦТ:

- narrow task-type catalog;
- visible task counts;
- stable task-type and task URLs;
- “10 from this type” action;
- source/difficulty metadata where provenance is legitimate;
- build-a-variant mental model.

From Adukar:

- clear separation between dated variants and topic tests;
- public statement of how many tests/lessons exist;
- simple subject-level catalog before the user enters a test.

### What not to borrow

- РЕШУ ЦТ's dense all-at-once catalog rows and legacy navigation overload;
- Adukar's mandatory login before the learner can sample a test;
- social score widgets as the dominant proof of value;
- exam-similarity claims unsupported by transparent coverage.

## 7. Cognitive Load Audit

Scale:

- `0`: task-relevant and quiet;
- `1`: minor friction;
- `2`: meaningful competition for attention or working memory;
- `3`: obstructs the learner's primary job.

Dimensions:

- **Visual**: number and intensity of competing objects.
- **Choice**: number/ambiguity of actions.
- **Memory**: information learner must retain across separated UI.
- **Feedback**: amount/placement of response information.

| Screen/state | Visual | Choice | Memory | Feedback | Main finding |
| --- | ---: | ---: | ---: | ---: | --- |
| Landing | 2 | 1 | 1 | 0 | Hero and Nova dominate; actual warm-up is below first desktop viewport |
| Topics | 3 | 2 | 1 | 1 | Five large equal cards, repeated sidebar topics, next-step card, mixed card, future card |
| Practice before answer | 2 | 1 | 1 | 0 | Good task-first core; metadata, quickbar, card borders and closed help header add chrome |
| Practice after feedback | 3 | 2 | 2 | 3 | Option states, Nova, status, help CTA, solution CTA and next CTA compete simultaneously |
| Expanded solution | 3 | 1 | 2 | 3 | Formula appears inline and again in a separate box; long card pushes task context away |
| Targeted help | 3 | 2 | 3 | 2 | Accurate content but below answer/feedback/next; learner must scroll away from task |
| Session summary | 2 | 2 | 1 | 2 | Score, motivational copy, progress bar, weaknesses and two CTAs share one elevated card |
| Mixed-training gate | 1 | 1 | 1 | 0 | Honest and focused; resume state adds two clear actions without redesign |
| Mistakes empty | 2 | 1 | 1 | 1 | “Review Intelligence” jargon and explanatory empty-state copy overstate a simple queue |
| Mistakes populated | 2 | 2 | 2 | 2 | Useful prioritization, but task history and weakness aggregates are conflated conceptually |
| Formulas | 3 | 1 | 2 | 0 | Search helps; page remains very long and disconnected from practice destinations |
| Profile/Progress | 3 | 3 | 2 | 2 | Empty dashboard shows many equal metrics, recommendation, topic cards and data controls |

### Highest-cost moments

1. **Topics page duplication.** The sidebar already exposes every active topic, while the page repeats them as large cards and adds a recommendation, mixed training, and unavailable future content.
2. **Post-answer accent collision.** Wrong/selected/correct option colors, Nova, feedback tone, help action, solution action and next action all seek priority.
3. **Help displacement.** Targeted help is contextually correct but spatially distant. On desktop it behaves like an appended page section rather than an adjacent aid.
4. **Progress before evidence.** Profile shows a dashboard architecture even when the learner has no meaningful data.
5. **Decorative completion signal.** Glows, multiple accent colors, animated stars/Nova and layered cards imply breadth and gamification that the content bank cannot yet support.

## 8. UX and Visual-System Review

### What is genuinely good

- Consistent typography and math rendering.
- Task-first practice avoids theory walls.
- Correct/wrong states include text, not only color.
- Mobile safe area and fixed navigation have explicit spacing support.
- Cards use restrained radii and stable dimensions.
- The dark theme is coherent and physics diagrams are semantic rather than decorative screenshots.

### What weakens the product

#### Too many surfaces have card status

Cards frame topics, task prompts, each answer, feedback, help, summary, progress metrics, topic progress and data management. The hierarchy becomes “card inside a field of cards” rather than task, evidence, action.

#### Color encodes product sections, not only meaning

Cyan, gold, blue and ember identify topics and states, while feedback introduces additional correct/wrong emphasis. On the topics page this creates five equally loud products. During practice it makes semantic state harder to distinguish from topic decoration.

#### Nova is not always instructional

Nova works when a line identifies a specific misconception. It is decorative on the landing and redundant when the same feedback can be expressed by a compact status line. The mascot should not become a second narrator.

#### The persistent desktop sidebar is too literal

It exposes all five topics, a disabled future topic, mixed training, mistakes, formulas, profile and XP on every route. This is closer to a finished course platform than the product's current depth. It duplicates `/topics` and advertises unavailable quantum physics.

#### Motion does not solve an information problem

Starfield cursor connections, Nova floating, aura/orbits, option shake/pop and graph drawing are individually modest. Together they increase ambient motion without helping selection, solving, or review. Reduced-motion support is good, but the default still spends attention on atmosphere.

## 9. Product Model Decision

### Model A: Adaptive Drill Coach

**Fit:** High for the current engine. Generated tasks, weakness traps, review urgency and targeted help already support it.

**Failure mode:** The system controls what appears. A student cannot select “Ohm's law”, “series circuits”, or a known CT task type. Content gaps remain hidden. Teachers cannot assign a stable type.

**Verdict:** Necessary capability, insufficient product model.

### Model B: CT Task Library with Solutions

**Fit:** Strong user demand and competitor proof. It directly serves search, known weaknesses, historical variants and teacher references.

**Failure mode:** A library alone is undifferentiated against РЕШУ ЦТ, whose corpus is much larger. PhysicsLab would lose the value of generated variants and error diagnosis.

**Verdict:** Necessary IA layer, weak standalone strategy.

### Model C: Hybrid CT Trainer

**Definition:** A task-type catalog is the stable map; generated drills are the practice engine; weakness data chooses recommendations; full variants are a separate fidelity-gated mode.

**Why it wins:**

- makes the existing 35 families discoverable;
- lets learner intent override adaptation;
- preserves misconception-aware feedback;
- enables “reference solution → similar task”;
- allows honest incremental expansion by specification section;
- creates a path to full variants without pretending they exist today.

**Verdict:** Choose Model C.

## 10. Catalog Model Comparison

| Catalog option | Learner intent | Strength | Risk | Verdict |
| --- | --- | --- | --- | --- |
| By school topic | “I need electricity” | Familiar, low learning cost | Too broad; current `/topics` already does this | Keep as top level only |
| By CT task number | “I need task B12” | Strong exam alignment | Numbers can change and require a complete blueprint map | Add after official blueprint mapping |
| By narrow skill/family | “Only Ohm's law” | Matches current generator and known weaknesses | Internal IDs need student-friendly labels | P0 catalog layer |
| By formula | “Tasks using U=IR” | Good bridge from reference | One task may require several models; encourages formula matching | Secondary filter, not primary IA |
| By mistake | “I keep dividing the wrong way” | Differentiated and adaptive | Requires enough observed answers | Keep under Mistakes/recommendations |
| By difficulty | “Start easy” | Useful within a chosen type | Current D1/D2/D3 is product calibration, not official I–V | Filter with honest label |

### Recommended task-type entity

Each public task type should expose:

- student-facing title;
- parent section and narrow skill;
- available generated variants or an honest “many variants” label;
- answer format;
- calibrated difficulty range;
- one compact reference solution/model;
- typical mistakes;
- `Решить 5 похожих` primary action;
- `Открыть пример` secondary action;
- stable URL.

Do not expose internal template IDs or parameter counts as learner copy.

### Special model: task type → reference solution → similar task

This should become the signature loop:

1. Learner opens `Закон Ома: найти силу тока`.
2. Sees one representative problem pattern and a compact four-step solution.
3. Clicks `Решить похожую`.
4. Receives the same physical model with new parameters and possibly new wording.
5. An incorrect response maps to a specific misconception.
6. The next variant changes values and, where supported, asks for another unknown.

This is materially better than copying a large bank: it teaches transfer while preserving a stable reference.

## 11. Priority Findings

### P0: product identity and discoverability

1. No narrow task-type catalog.
2. No complete exam mode matching official structure.
3. No atomic/quantum/nuclear content; large active-section gaps.
4. Product claim and visual completion exceed learning coverage.
5. Existing generated families are hidden behind random batches.

### P1: learning-loop friction

1. Targeted help is accurate but spatially disconnected from the task.
2. Expanded feedback duplicates formulas and carries too many actions.
3. Recommendation links to a broad page/weakness list, not directly to a task family.
4. Task family and reference formula are separate entities without bidirectional navigation.
5. No saved/stable task-type reference for tutor-student communication.

### P2: interface simplification

1. Remove unavailable quantum topic from persistent navigation.
2. Reduce topic duplication between sidebar and `/topics`.
3. Rename Profile to Progress and defer data-management controls.
4. Reduce ambient motion and non-instructional Nova usage.
5. Flatten repeated cards and reduce simultaneous accents.

## 12. Evidence Boundaries

- Adukar post-answer behavior was not evaluated because the public test launch required authentication. No claim is made about its explanation quality.
- РЕШУ ЦТ observations refer to the current `phys_ct.sdamgia.ru` physics service reached from the requested ecosystem, not the certificate-failing legacy host.
- Official exam facts come from the RIKZ 2026 physics specification published 2025-11-05. No 2027 physics specification was found or assumed.
- PhysicsLab counts are code facts at the audited baseline, not marketing estimates.
