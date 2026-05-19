# Accelerated Motion Production Readiness Audit

Date: 2026-05-19  
Scope: `/chapters/accelerated-motion/`  
Status: audit-only; no UI, component, physics, style, test, or package changes.

## Pre-State Snapshot

### Current Learning Flow Sections

Evidence: `src/pages/chapters/accelerated-motion.astro`.

| Step | Current evidence | Current state |
| --- | --- | --- |
| Predict | `navItems` includes `#predict`; section `id="predict"`; `data-acceleration-predict`; prompt `v₀ > 0, но a < 0. Что сначала будет с телом?` | Active prediction exists before the lab. |
| Manipulate | section `id="lab"` renders `<AccelerationScene />`; scene uses `ControlDock` with sliders `v0` and `a` | Learner can play/reset and change `v₀` / `a`. |
| Observe | `AccelerationScene.astro` renders `MotionTrack`, `InstrumentGraph` for `v(t)` and `x(t)`, readouts `t/v/x`, and dynamic `data-guidance` | Motion, graph and text update together. |
| Explain | section `id="formula"` has two formula cards, variable chips, units, and condition `Формулы подходят, если ускорение a постоянно.` | Explanation exists after observation. |
| Transfer | section `id="check"` has `data-acceleration-check`, question about `v(t)` below zero, and feedback | One transfer check exists. |

### Current Components Used

Evidence: `src/pages/chapters/accelerated-motion.astro`, `src/components/simulations/AccelerationScene.astro`.

- Page shell: `BaseLayout`, `Badge`, `SurfaceCard`.
- Simulation primitives: `AccelerationScene`, `MotionTrack`, `InstrumentGraph`, `ControlDock`.
- No dedicated `FormulaCard`, `PredictionPrompt`, `MiniQuiz`, `UnitCheck`, `ExamTaskCard`, or `LabConsole` component is used on this page.
- Prediction and transfer choice logic is local in `accelerated-motion.astro` via `setupChoiceBlock`.

### Current Physics Helpers Used

Evidence: `src/components/simulations/AccelerationScene.astro`, `src/lib/physics/acceleratedMotion.ts`, `src/lib/physics/graphView.ts`.

- `velocityAt(t, v0, a)` implements `v = v₀ + at`.
- `positionAt(t, x0, v0, a)` implements `x = x₀ + v₀t + at²/2`.
- `accelerationMotionDirection(t, v0, a)` derives direction from current velocity sign.
- `generateVelocitySeries` and `generatePositionSeries` feed graph polylines.
- `mapToGraphPoint`, `seriesToPolyline`, and ticks from `graphView.ts` map physical values into the SVG viewport.
- Scene-local mode logic in `getAccelerationMode`, `getGuidance`, `getVelocityNote`, and `getPositionNote` explains `a = 0`, `a < 0`, sign crossing, and turning point states.

### Current Tests Covering the Chapter

Evidence: `tests/screenshots/accelerated-motion.spec.ts`, `tests/physics/kinematics.test.mjs`.

- Route opens at `/chapters/accelerated-motion/`.
- Prototype and `authorReviewRequired` badges are visible.
- Prediction interaction checks correct and wrong feedback.
- Scene root `[data-acceleration-scene]` exists.
- Controls `[data-input="v0"]`, `[data-input="a"]`, `[data-play-toggle]`, `[data-reset]` exist and work.
- Play increases `data-current-time`; reset returns `t` to `0`.
- Changing `a` changes `data-current-a`, `v(t)` polyline, and guidance.
- `a = 0` enters `data-acceleration-mode="uniform"` and keeps velocity constant.
- Reduced motion uses step mode and does not auto-run.
- No horizontal scroll is checked for desktop/tablet/mobile/narrow-mobile.
- Physics unit tests cover `velocityAt`, `positionAt`, `a = 0` equivalence with uniform motion, direction crossing, finite series output, graph mapping and polyline helpers.

### Current Status Markers

Evidence: `src/pages/chapters/accelerated-motion.astro`, `src/components/simulations/AccelerationScene.astro`.

- Visible status badges: `prototype v0`, `authorReviewRequired`.
- Chapter marker: `data-accelerated-motion-chapter`.
- Prediction marker: `data-acceleration-predict`.
- Scene marker: `data-acceleration-scene`.
- Scene state: `data-current-time`, `data-current-x`, `data-current-v`, `data-current-a`, `data-motion-direction`, `data-acceleration-mode`, `data-playing`, `data-animation-state`.
- Graph markers: `data-polyline`, `data-current-polyline`, `data-point`, `data-graph-note`.
- Transfer marker: `data-acceleration-check`.

### Obvious Prototype / Production Gaps

- Content is explicitly not reviewed: visible `authorReviewRequired` remains.
- No content collection entry for accelerated motion yet; the page is inline-heavy.
- No structured misconception model; prediction and transfer are local markup.
- No worked example, faded example, exam A/B metadata, unit conversion check, or rounding check.
- Formula section is inline cards, not a shared formula primitive with reviewable metadata.
- Graphs are readable, but graph accessibility is mostly an SVG `aria-label`; dynamic graph states are not deeply described for screen readers.
- Performance has not been measured; current confidence comes from passing Playwright behavior/screenshot tests, not Lighthouse or runtime profiling.

## Production Readiness Summary

`/chapters/accelerated-motion/` is a strong prototype v0, not a production chapter.

It already demonstrates the core PhysicsLab route:

```text
predict -> manipulate -> observe -> explain -> transfer
```

The main blocker is not that the page is broken. The blocker is that it lacks production-grade review and exam-training layers:

- physics/content still needs author review;
- formulas and checks are not yet structured content;
- no original exam-style task or unit/rounding layer exists;
- accessibility for graphs and dynamic simulation meaning is incomplete;
- performance is unmeasured;
- page-local quiz/formula logic will duplicate if the next chapter repeats it.

## Student Flow Audit

### Predict

Evidence: `src/pages/chapters/accelerated-motion.astro`, section `#predict`.

What exists now:

- A real interactive prediction question appears before the lab.
- The misconception is targeted: `a < 0` does not mean the body instantly moves backward.
- Feedback differentiates correct and wrong answers using `data-feedback-correct` and `data-feedback-wrong`.
- The hint says: `Теперь выставь a < 0 и смотри, когда v(t) пересечёт ноль.`

Strong:

- This is a real action, not passive text.
- The prompt is short and concrete.
- Feedback points to `v(t)`, which is the right representation for this misconception.

Weak:

- The page does not help the learner set up the promised scenario automatically. There is no preset for `v₀ > 0, a < 0`.
- The prediction result is not connected to the lab state except by text.
- There is no record of the learner's prediction beside the later observation.

Production requirement:

- Add a small `a < 0` scenario/preset or one-click setup for the prediction case.
- Keep it local and bounded; do not create a universal prediction framework yet.

### Manipulate

Evidence: `AccelerationScene.astro`, `ControlDock` props `v0` and `a`.

What exists now:

- Play/reset controls exist.
- Sliders for `Начальная скорость v₀` and `Ускорение a` have units and aria labels.
- `ControlDock` unifies the controls with the uniform-motion scene.

Strong:

- `v₀` and `a` are physically meaningful controls.
- `a` is labelled as “На сколько меняется v за 1 секунду.”
- Reduced motion changes play into step mode.

Weak:

- There is no manual time slider; for learning sign crossing, stepping may be enough, but production may need more direct time inspection.
- The controls do not include a scenario for the common misconception state.
- `x₀` is fixed at zero and invisible; acceptable for prototype, but should be explicitly stated if production keeps it fixed.

Production requirement:

- Either add a small scenario setup or explain fixed `x₀ = 0` near the formula/scene.
- Do not expand controls beyond the main misconception unless a production review demands it.

### Observe

Evidence: `AccelerationScene.astro`, `MotionTrack`, `InstrumentGraph`.

What exists now:

- Motion track, live velocity arrow, live coordinate label, readouts, `v(t)` graph, and `x(t)` graph update together.
- `data-guidance` changes when `a = 0`, when the object slows while still moving forward, and when velocity becomes negative.
- Graph notes explain that slope of `v(t)` is acceleration and that `x(t)` becomes curved because speed changes.

Strong:

- The scene teaches more than it decorates.
- `a -> v(t) -> motion -> x(t)` is visible in the causality strip.
- Tests cover the important negative acceleration case and `a = 0`.

Weak:

- The motion track is `aria-hidden="true"` in `MotionTrack.astro`; screen reader users rely on separate readouts and guidance.
- The graph SVG has labels, but dynamic graph state is not accessible beyond notes/readouts.
- The relation between area under `v(t)` and coordinate change is absent, even though master plan v2 flags it for accelerated motion.

Production requirement:

- Improve accessible text for current graph/motion state.
- Decide whether area under `v(t)` belongs in this chapter's production v1 or a later graph-skills chapter.

### Explain

Evidence: `src/pages/chapters/accelerated-motion.astro`, section `#formula`.

What exists now:

- Formula cards:
  - `v = v₀ + at`
  - `x = x₀ + v₀t + at²/2`
- Meaning text is present.
- Variables and SI units are present.
- Condition is present: constant acceleration.
- Typical mistake note is present: sign of `a` is not always direction.

Strong:

- The formula appears after observation, matching master plan v2.
- Variables and units are now visible.
- The text avoids saying “negative acceleration means moving backward.”

Weak:

- No worked numerical substitution exists.
- No “when not to use” beyond constant acceleration.
- The formula layer is inline and not content-model driven, so review and reuse will be harder.
- There is no formal distinction between coordinate/displacement/path in the formula block.

Production requirement:

- Add one small worked substitution and a “do not use when acceleration changes” note.
- Later move formula content into a shared reviewed formula model, but that is not a must-do before the next small production pass.

### Transfer

Evidence: `src/pages/chapters/accelerated-motion.astro`, section `#check`.

What exists now:

- Question: `v(t) пересекла ноль и стала ниже оси. Что теперь делает тело?`
- Correct answer checks that the learner transfers graph sign into motion direction.
- Wrong feedback explains that direction is set by `v`, not by initial velocity.

Strong:

- It is not a duplicate of the prediction question.
- Feedback names the physical principle.
- It targets a real graph-reading misconception.

Weak:

- It is still a concept check, not CT/CE-style exam practice.
- No units, numeric answer, rounding, or original task metadata.
- No persistent score/progress; acceptable for prototype.

Production requirement:

- Add one original exam-style micro-task or unit/sign check after this concept check.

## Physics Correctness and Review Status

### Formulas

Evidence:

- `src/lib/physics/acceleratedMotion.ts`: `velocityAt`, `positionAt`.
- `src/pages/chapters/accelerated-motion.astro`: formula section.

Current formulas are standard for 1D motion with constant acceleration:

- `v = v₀ + at`
- `x = x₀ + v₀t + at²/2`

The page states the applicability condition: `Формулы подходят, если ускорение a постоянно.`

Residual issue:

- Page text should eventually state the axis/sign convention explicitly: signs are projections on a chosen axis.

### Units

Evidence: `variable-chip` entries in `accelerated-motion.astro`.

Units are present:

- `v`, `v₀`: `м/с`
- `a`: `м/с²`
- `t`: `с`
- `x`, `x₀`: `м`

Residual issue:

- No unit conversion or dimensional check task exists.

### Sign Conventions

Evidence:

- `accelerationMotionDirection` uses current velocity sign.
- `getGuidance` says: `a отрицательное, но тело ещё едет вправо`.
- Formula condition says: `Знак a не всегда задаёт направление. Направление задаёт знак скорости v.`

Strong:

- The main misconception is handled correctly in current wording.

Residual issue:

- The coordinate axis convention is implicit. Production should say “we chose right as positive” or equivalent.

### Graph Interpretation

Evidence:

- `InstrumentGraph` axis labels `t, с`, `v, м/с`, `x, м`.
- `getVelocityNote` says slope of `v(t)` is acceleration.
- `getPositionNote` says `x(t)` curve changes slope because velocity changes.

Strong:

- Axes, units, ticks, and current points exist.

Residual issue:

- Area under `v(t)` is not explained. That is acceptable for prototype v0, but production kinematics likely needs it or a deliberate note that it is for a later chapter.

### Edge Cases

Evidence: `tests/physics/kinematics.test.mjs`, `tests/screenshots/accelerated-motion.spec.ts`.

Covered:

- `a = 0` behaves like uniform motion.
- `a < 0` with positive `v₀` can still move forward first.
- Velocity crossing zero produces forward/still/backward direction states.
- Series generation avoids `NaN` / `Infinity`.

Not fully covered:

- Extreme slider combinations in browser beyond one negative `a` and `a = 0` test.
- Manual inspection around the exact turning point in UI.

### Review Status

The chapter must not be called production-ready yet.

Evidence: `src/pages/chapters/accelerated-motion.astro` visibly renders badges `prototype v0` and `authorReviewRequired`.

## Formula Layer Audit

Against `docs/content-rules.md` Formula Rules:

| Requirement | Current state | Evidence | Production gap |
| --- | --- | --- | --- |
| Formula | Present | `v = v₀ + at`; `x = x₀ + v₀t + at²/2` | None. |
| Meaning | Present | Formula card paragraphs | Could be more explicit about projections. |
| Variables | Present | `.variable-grid` | Inline, not content model. |
| SI units | Present | `variable-chip` units | No unit conversion exercise. |
| Conditions | Present | `Формулы подходят, если ускорение a постоянно.` | Need “one-dimensional motion / chosen axis” wording. |
| Not for | Partial | Constant acceleration condition implies limitation | Needs explicit “not if acceleration changes during motion.” |
| Short example | Missing | No numerical substitution | Add one small worked substitution. |
| Typical mistake | Present | `Знак a не всегда задаёт направление...` | Good, but needs author review. |

Conclusion:

- The formula layer is production-adjacent but not production complete.
- It should not become a big shared formula framework immediately.
- A small formula completeness pass is higher value than a refactor.

## Simulation / Scene Quality Audit

Evidence: `src/components/simulations/AccelerationScene.astro`.

### Visual Clarity

The scene has a coherent main structure:

- header/readouts;
- motion panel;
- graph stack;
- control dock.

The strongest visual teaching link is the causality strip:

```text
a меняет v(t) -> v двигает точку -> x попадает на x(t)
```

Weakness:

- Still prototype-grade density. On mobile, the page is long and the learner must scroll through prediction, lab, formulas, and transfer.

### Graph Readability

Strong:

- `InstrumentGraph` now has explicit domain/ticks/tick labels.
- Tests check polyline and current point markers.
- `v(t)` and `x(t)` both have notes explaining physical meaning.

Weak:

- No slope probe or area probe.
- Graphs are accessible only at a basic `role="img"` + `aria-label` level.

### Motion Track Relation to Graphs

Strong:

- The motion point, velocity arrow, `x` label, readouts, and graphs are synchronized from the same scene state.
- `getGuidance` bridges motion direction and graph interpretation.

Weak:

- `MotionTrack` is visual-only (`aria-hidden="true"`), so non-visual users need stronger text readouts.
- Motion track range is hardcoded to `-32 м` / `48 м` and the domain is local in `AccelerationScene`; acceptable now, but watch if it spreads.

### Controls Clarity

Strong:

- `ControlDock` is now shared.
- `v₀` and `a` have labels, descriptions, units and aria labels.

Weak:

- No scenario preset for the exact prediction case.
- No manual time scrubber; step mode exists only under reduced motion.

### Reduced Motion

Evidence:

- `AccelerationScene.astro` checks `prefers-reduced-motion`.
- Screenshot test expects `data-mode="step"` and verifies time does not auto-advance.

This is a production-strength behavior pattern.

### Does It Teach or Only Visualize?

It teaches. Evidence:

- prediction before lab;
- guidance and graph notes change with physical state;
- formula follows observation;
- transfer check tests graph sign.

It is not yet a production chapter because it lacks review, worked example, unit/exam task, and stronger accessibility.

## Component Architecture Audit

### ControlDock

Evidence: `src/components/simulations/ControlDock.astro`.

Current state:

- Supports play/reset, sliders, readouts, scenarios and hint.
- Used by uniform and accelerated scenes.

Risk:

- CSS now contains scene-specific selectors for `.uniform-lab[data-visual-target="v1"]` and `.acceleration-scene`.
- This is acceptable for v0, but if a third scene adds another large block, `ControlDock` will become a style switchboard.

Recommendation:

- Do not expand `ControlDock` again until a third real use case appears.
- Next controls work should be small behavior or accessibility hardening, not API expansion.

### InstrumentGraph

Evidence: `src/components/simulations/InstrumentGraph.astro`.

Current state:

- Good v0 primitive for line graphs with domain, ticks, zero line, projection and notes.
- Used by uniform and accelerated scenes.

Risk:

- It is not yet a graph pedagogy primitive. It draws axes and lines, but does not handle slope probes, area probes, graph accessibility descriptions, or linked graph annotations.

Recommendation:

- Add slope/area features only when needed by a focused ticket.

### MotionTrack

Evidence: `src/components/simulations/MotionTrack.astro`.

Current state:

- Lightweight visual primitive for 1D axis, ticks, point, velocity arrow and coordinate label.

Risk:

- Domain mapping and dynamic state remain in parent scenes.
- Track is `aria-hidden`.

Recommendation:

- Keep it visual for now; add an accessibility companion/readout in the scene rather than bloating `MotionTrack`.

### Page-Local Logic

Evidence: `src/pages/chapters/accelerated-motion.astro`, script `setupChoiceBlock`.

Risk:

- Prediction and transfer checks duplicate a pattern likely needed in every chapter.
- The page is inline-heavy: content, quiz state, formula cards and styles live together.

Recommendation:

- Do not build a universal quiz framework yet.
- One small `ChoiceBlock` or `PredictionPrompt` primitive becomes justified after one more chapter repeats this pattern.

### Does Current Architecture Help Adding the Next Chapter?

Partly.

Helpful:

- `ControlDock`, `InstrumentGraph`, `MotionTrack`, and physics helpers are now separated enough to build a third scene faster.

Still blocking:

- Formula and quiz layers are not reusable.
- Review status and content metadata are not structured for accelerated motion.
- Scene controller logic remains local and fairly large.

## Mobile Performance Risks

No performance measurement was run for this audit. The following are risks / needs measurement.

| Risk | Evidence | Assessment |
| --- | --- | --- |
| Client JS grows with inline page scripts and scene scripts | `accelerated-motion.astro` has `setupChoiceBlock`; `AccelerationScene.astro` has RAF/controller logic | Acceptable now, but should be measured before public release. |
| SVG graph cost | Two `InstrumentGraph` SVGs update polylines each frame | Likely fine for current simple polylines, but needs mobile profiling. |
| Long-page mobile scroll | Page includes hero, prediction, lab, formula, check | Educationally acceptable, but production should keep primary result near action. |
| Background canvas | `accelerated-motion.astro` forces `#lab-background-canvas` width | If animated globally, it needs performance verification. |
| Range input usability | `ControlDock` uses full-width range inputs and tests mobile no-scroll | Looks acceptable from screenshots/tests, but touch ergonomics should be manually checked. |
| Layout shift | Dynamic feedback/hints and play text changes | Existing tests do not measure CLS; risk is low but unmeasured. |
| KaTeX/formula cost | Current formula section is plain text, no KaTeX | No current risk. |

## Accessibility Risks

| Area | Current evidence | Risk |
| --- | --- | --- |
| Keyboard access | Buttons and range inputs are native; focus styles exist in page and `ControlDock` | Good baseline. Needs keyboard walkthrough before production. |
| Focus state | `.chapter-answer-row button:focus-visible`, `ControlDock` focus styles | Good baseline. |
| Aria labels | Graph SVGs have `ariaLabel`; sliders have `ariaLabel`; scene has labelled root | Good, but dynamic state is not fully described. |
| Aria-live feedback | Prediction and check feedback use `aria-live="polite"` | Good. |
| Reduced motion | Scene switches to step mode | Strong. |
| Color-only meaning | Correct/wrong also changes text feedback and `aria-pressed`; variable colors have labels | Mostly acceptable. |
| Graph accessibility | SVG `role="img"` with static aria labels; dynamic point/line state is visual | Needs improvement before production. |
| Motion accessibility | `MotionTrack` is `aria-hidden="true"` | Acceptable only because readouts/guidance exist; stronger live summary needed. |

## Tests and QA Audit

### What Tests Protect

Evidence: `tests/screenshots/accelerated-motion.spec.ts`, `tests/physics/kinematics.test.mjs`.

- Route, headings and review badges.
- Prediction interaction and feedback.
- Scene presence and stable markers.
- Play/reset behavior.
- `a < 0` misconception behavior.
- `a = 0` uniform behavior.
- Graph polyline/current point existence.
- Formula variables/units condition.
- Transfer feedback.
- No horizontal scroll across four viewports.
- Reduced motion step mode.
- Physics helper correctness and finite graph mapping.

### Test Gaps

- No axe/accessibility tests.
- No visual baseline comparison.
- No production review-status gate beyond visible badge expectation.
- No performance/Lighthouse/mobile CPU test.
- No content schema validation because accelerated motion is not in content collections.
- No test for one-click scenario/preset because it does not exist.
- No test for graph accessibility text beyond static labels.
- No test for exact turning-point UI behavior except physics helper and general guidance.

### QA Conclusion

Tests are strong for a prototype and good enough to continue small tickets. They are not enough to declare production readiness.

## Product Readiness Score

Scale: 1 = broken/misleading; 3 = working prototype with meaningful gaps; 5 = production-ready with no known meaningful flaws.

| Area | Score | Why not higher | Evidence | What raises by +1 |
| --- | ---: | --- | --- | --- |
| Student flow | 4 | Full route exists, but prediction is not mechanically connected to the lab setup. | `#predict`, `<AccelerationScene />`, `#formula`, `#check` in `accelerated-motion.astro` | Add a one-click/preset setup for the prediction case. |
| Physics clarity | 4 | Main misconception is handled, but axis/sign convention and displacement/path distinctions need author review. | `getGuidance`, `getVelocityNote`, formula condition text | Add explicit axis convention and author physics review notes. |
| Formula completeness | 3 | Formula + variables + units + condition exist, but no worked substitution and no explicit not-for case. | Formula section in `accelerated-motion.astro` | Add small worked substitution and not-for note. |
| Simulation clarity | 4 | Scene teaches with synced motion/graphs, but no area/slope probe and no scenario preset. | `AccelerationScene.astro`, `InstrumentGraph` usage | Add focused preset or graph probe, not both at once. |
| Mobile composition | 4 | Tests show no horizontal scroll and mobile layout is readable, but page is long and primary lab still takes substantial scroll. | `accelerated-motion.spec.ts` viewports; mobile screenshot artifacts | Do one mobile-first compression pass around predict-to-lab transition. |
| Accessibility | 3 | Native controls and aria-live exist, but graph/motion dynamic state is weak for screen readers. | `MotionTrack aria-hidden`, SVG `role="img"` | Add a live textual scene summary and graph state descriptions. |
| Performance confidence | 2 | It likely performs fine, but no measurement has been done. | No Lighthouse/profiling artifacts; only Playwright tests | Run a scoped mobile performance smoke audit and document results. |
| Component architecture | 3 | First primitives are useful, but formula/prediction/quiz remain inline and `ControlDock` has scene-specific style branches. | `ControlDock`, page-local `setupChoiceBlock` | Extract one small repeated choice/formula primitive only after another use case or as production hardening. |
| Test coverage | 4 | Behavior/screenshot/physics tests are strong, but no a11y/perf/content schema gates. | `accelerated-motion.spec.ts`, `kinematics.test.mjs` | Add accessibility smoke checks or review-status/content checks. |
| Production polish | 3 | Looks coherent for v0 but still marked prototype and lacks review/exam/unit layer. | Visible `prototype v0`, `authorReviewRequired` | Complete must-do tickets and author review before changing status. |

Overall readiness: **prototype v0+ / not production-ready**.

## Prioritized Next Tickets

### Must-Do Before Production

#### 1. `accelerated-motion-physics-review-notes-v0`

- Goal: add explicit review notes and resolve wording around axis, signs, displacement/coordinate, and constant acceleration.
- Why now: current chapter is visibly `authorReviewRequired`; production cannot proceed without physics review clarity.
- Allowed write scope: `src/pages/chapters/accelerated-motion.astro`, optional `docs/audits/*` review note.
- Anti-goals: no UI redesign, no new primitives, no formula framework.
- Expected impact: raises Physics clarity from 4 to 5 only after human author review.
- Risk level: low.
- Estimated size: small.
- Priority: must-do.

#### 2. `accelerated-motion-accessible-graph-summary-v0`

- Goal: add a concise live text summary for current `t`, `v`, `x`, `a`, direction, and graph meaning that screen readers can use.
- Why now: `MotionTrack` is `aria-hidden` and SVG graphs have mostly static labels.
- Allowed write scope: `src/components/simulations/AccelerationScene.astro`, `tests/screenshots/accelerated-motion.spec.ts`.
- Anti-goals: no graph API change, no visual redesign, no axe dependency unless explicitly approved.
- Expected impact: raises Accessibility from 3 to 4.
- Risk level: low-medium.
- Estimated size: small.
- Priority: must-do.

#### 3. `accelerated-motion-formula-completeness-v0`

- Goal: add one compact worked substitution and explicit “not for changing acceleration” note.
- Why now: content rules require formula + meaning + variables + units + conditions + typical mistake + example/not-for.
- Allowed write scope: `src/pages/chapters/accelerated-motion.astro`, `tests/screenshots/accelerated-motion.spec.ts` if selectors/text need updating.
- Anti-goals: no shared `FormulaCard` refactor, no content collection migration.
- Expected impact: raises Formula completeness from 3 to 4.
- Risk level: low.
- Estimated size: small.
- Priority: must-do.

#### 4. `accelerated-motion-prediction-preset-v0`

- Goal: add a small preset/action for the exact prediction case: `v₀ > 0`, `a < 0`, then observe `v(t)` crossing zero.
- Why now: prediction currently relies on text to connect to the lab.
- Allowed write scope: `src/components/simulations/AccelerationScene.astro`, maybe `src/pages/chapters/accelerated-motion.astro`, screenshot test.
- Anti-goals: no universal preset framework, no major ControlDock API expansion.
- Expected impact: raises Student flow and Simulation clarity.
- Risk level: medium because it touches scene state.
- Estimated size: medium.
- Priority: must-do.

#### 5. `accelerated-motion-original-exam-mini-task-v0`

- Goal: add one original CT/CE-style micro-task or unit/sign check after the concept transfer.
- Why now: master plan requires transfer toward exam skill; current check is conceptual only.
- Allowed write scope: page only, optional tests.
- Anti-goals: no task collection, no full `ExamTaskCard`, no copied external tasks.
- Expected impact: raises Production polish and exam relevance.
- Risk level: medium due to physics/content review.
- Estimated size: medium.
- Priority: must-do.

### Should-Do Soon

#### 6. `accelerated-motion-mobile-scroll-compression-v0`

- Goal: reduce vertical friction between prediction and lab without removing learning steps.
- Why now: mobile is readable but long.
- Allowed write scope: `src/pages/chapters/accelerated-motion.astro`, `src/components/simulations/AccelerationScene.astro`.
- Anti-goals: no high-fi redesign, no global CSS changes.
- Expected impact: improves mobile composition and production polish.
- Risk level: low.
- Estimated size: small.
- Priority: should-do.

#### 7. `accelerated-motion-performance-smoke-audit-v0`

- Goal: measure mobile JS/layout/render basics and document whether SVG/RAF/background are safe enough.
- Why now: Performance confidence is the lowest score because it is unmeasured.
- Allowed write scope: docs-only report, optionally no code.
- Anti-goals: no optimization until measurement shows a problem.
- Expected impact: raises Performance confidence from 2 to 3 or 4 depending on results.
- Risk level: low.
- Estimated size: small.
- Priority: should-do.

#### 8. `choice-block-pattern-audit-v0`

- Goal: compare prediction/check logic in uniform and accelerated chapters and decide whether a tiny `ChoiceBlock` primitive is justified.
- Why now: page-local `setupChoiceBlock` will duplicate across chapters.
- Allowed write scope: docs-only or one small component if approved later.
- Anti-goals: no universal quiz framework.
- Expected impact: prevents duplicate quiz state code.
- Risk level: low.
- Estimated size: small.
- Priority: should-do.

### Nice-to-Have Later

#### 9. `acceleration-graph-area-preview-v0`

- Goal: prototype a small visual hint that area under `v(t)` relates to coordinate change.
- Why later: important for kinematics, but can overload the current chapter if added before formula/accessibility/review work.
- Allowed write scope: `AccelerationScene`, `InstrumentGraph` only if a clear API need appears.
- Anti-goals: no full graph-skills chapter.
- Expected impact: improves deeper graph understanding.
- Risk level: medium.
- Estimated size: medium.
- Priority: nice-to-have.

#### 10. `accelerated-motion-content-model-pass-v0`

- Goal: move stable chapter text/status/formula metadata into content collection.
- Why later: current production blockers are review, accessibility, formula completeness and exam transfer; content migration should not block them.
- Allowed write scope: content config, content entry, page wiring.
- Anti-goals: no universal `[slug].astro`.
- Expected impact: improves maintainability.
- Risk level: medium.
- Estimated size: medium.
- Priority: nice-to-have.

## Anti-Goal Audit

| Constraint | Result | Evidence |
| --- | --- | --- |
| Did NOT modify UI/components/styles/tests | Passed | Only this markdown file should be changed. |
| Did NOT change physics logic | Passed | `src/lib/physics/*` unchanged by this audit. |
| Did NOT add dependencies | Passed | `package.json` unchanged by this audit. |
| Did NOT create new primitive/framework | Passed | No new `src/components` files. |
| Did NOT mark chapter production-ready | Passed | Audit explicitly keeps status as prototype; page still has `prototype v0` / `authorReviewRequired`. |

## Checks

No npm checks were run for this audit.

Reason: this ticket is documentation-only and explicitly forbids code, component, physics, test, style, or package changes. Running the full screenshot suite would not add meaningful signal to the audit document itself. Existing current coverage was inspected from `tests/screenshots/accelerated-motion.spec.ts` and `tests/physics/kinematics.test.mjs`.

## Skeptic Pass

1. Weakest part of this audit: performance assessment is risk-based, not measured. The score is intentionally low because no profiling evidence exists.
2. What might be wrong because nothing was measured: mobile runtime cost from RAF/SVG/background canvas could be better or worse than estimated.
3. Most uncertain recommendation: `accelerated-motion-prediction-preset-v0`; it is pedagogically useful, but it may require scene-state wiring that should stay small.
4. What was not inspected deeply: generated screenshot images and browser runtime logs were not re-reviewed in this audit, because the task requested file-based readiness evaluation and no code changes.
5. Risk of over-planning: yes, if all tickets are treated as blockers for internal iteration. Only the must-do list should gate production status; should-do/nice-to-have should not block learning.
6. Tickets too large or vague: no. Large ideas were split into small passes: review notes, accessibility summary, formula completeness, prediction preset, exam mini-task, performance audit.

## Bottom Line

Do not promote `/chapters/accelerated-motion/` to production yet.

The next highest-value production path is:

```text
physics review notes -> accessible graph/motion summary -> formula completeness -> prediction preset -> one original exam/unit transfer
```

That path improves learner safety and production confidence without turning the project into a multi-week refactor.
