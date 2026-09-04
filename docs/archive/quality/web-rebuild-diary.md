> **HISTORICAL — not a current requirement.** Preserved implementation diary and its point-in-time evidence.

# PhysicsLab web rebuild diary

This is the working record for coherent product decisions. It is not learner-facing copy and must not be rendered on the site.

## 2026-08-26 — Dynamics lesson and mixed practice entry

### Scope

- `/practice/dynamics-lesson`
- `/practice/exam-demo`
- shared learning pattern in `TopicPrimer`
- repeated terminology, illustration, crop, and interaction patterns across `apps/web`

### Observed evidence

- At 698 × 698, the mixed-practice image crop showed only the cat's paws; the subject and action were lost.
- The mixed-practice explanation was three equal bordered rectangles plus defensive copy about what the set was not.
- The dynamics lesson opened with unexplained notation and an experiment, without a familiar-language introduction.
- Carts crossed the track too quickly to compare comfortably.
- “Равнодействующая”, `Σ`, axes, projections, and “modules” appeared before the lesson established those ideas.
- Cart labels “A/B” read like letters inside prose instead of names of physical bodies.
- The force sketch did not follow the school workflow of drawing the body, attaching force arrows, naming the forces, and only then writing equations.
- The worked example lacked the drawing used in Belarusian school solutions.
- A free-text “explain in your own words” gate appeared after an automatically checked step and did not affect feedback.
- The braking scene mixed a generated image with floating vector overlays that were not physically anchored to the depicted body.
- Learner-facing copy used design jargon and AI-like wording: “контекст”, “перенос”, “райдер”, and “Сначала уже…”.

### Source evidence

- The Belarusian grade-9 textbook introduces acceleration experimentally: first varies force at fixed mass, then varies mass at fixed force, then names the resulting relationship.
- Its worked solution begins with “Сделаем рисунок к задаче”, draws the forces on the body, and only afterward writes the second-law equations.
- The textbook uses `F` for the resultant force in the main explanation; the current interface's `ΣF` notation is therefore optional shorthand and must be explained before use.

### Decisions

- Rebuild the dynamics route as a prerequisite-safe sequence: familiar question -> prediction -> slow observation -> force diagram -> named resultant force -> formula -> complete worked example -> two-value faded task -> independent task -> braking transfer.
- Use “Тележка 1” and “Тележка 2”, not A/B.
- Keep axes and signed projections out of the novice sequence. Introduce the direction in words; introduce `ΣF` only as optional shorthand after `F_рез` is understood.
- Replace the generated braking scene with a functional school-style diagram. It must show the velocity and braking force anchored to the same body.
- Remove free-text self-explanation gates site-wide. Preserve active processing through prediction, required numerical steps, targeted feedback, and gradual fading.
- Replace the exam's equal fact cards with one visual route through ten tasks and show the full meaningful cat-and-paper composition without destructive cropping.
- Search shared components and all routes for the same meta-language and prerequisite leaks before calling either page fixed.

### Expected consequence

- A student should understand what is being compared before seeing notation, and every later problem should require only concepts already named and demonstrated.
- The lesson should read as one authored physical story rather than a sequence of unrelated interface panels.
- The exam entry should feel like a focused practice session, not a disclaimer followed by generic cards.

### Open risks

- The global removal of free-text self-explanation changes several topic primers; each affected route needs a live interaction check.
- A code-rendered physics diagram can become sterile if treated as decoration. It must stay functional, conventional, and visually integrated with the learning step.
- The existing image library still contains assets whose anatomy, expressions, or crop may fail the same credibility bar; their review remains a separate project-wide pass.

### Verification required

- Same-state live-browser checks at 1440 × 1000, 698 × 698, and 390 × 844.
- Full dynamics interaction from introduction through braking.
- Mixed-practice entry crop and route composition at desktop and mobile.
- No horizontal overflow, clipped text/formulas, broken images, hidden controls, or mobile-navigation overlap.
- Console and request checks as supporting evidence; tests are secondary and cannot substitute for visual judgment.

### Implementation record

- Dynamics now starts with a familiar-language introduction before any notation.
- The mass comparison uses “Тележка 1 / Тележка 2”, an observable 2.35-second motion, and reveals the numerical acceleration only after the motion finishes.
- The force stage now uses one conventional body diagram with arrows applied to the body. The direction of each force is visible before the term “результирующая сила” appears.
- The formula stage starts from `F_рез = ma`; `Σ` is introduced afterward as optional shorthand and explained in words.
- The worked example now follows the school order: drawing -> “Дано” -> resultant force -> acceleration -> direction.
- Both practice problems require the learner to enter the resultant force and acceleration. A correct final quotient cannot bypass the missing first step.
- The braking task uses a functional diagram instead of the generated character scene and asks for the acceleration magnitude in words, without an unexplained axis or signed answer.
- The mixed-practice entry uses a full, contained cat-and-paper image and a five-part route instead of equal explanatory cards and defensive scope copy.
- The free-text self-explanation gate was removed from DynamicsLesson, AccelerationLesson, and the shared TopicPrimer used by electricity, density, and optics.
- During the cross-site pass, “Версия”, “Сцена”, “Новый случай”, “Перенос”, and “Граница модели” were identified as repeated interface/report language. The shared visible labels were changed to “Прогноз”, “Наблюдение”, “Ещё задача”, “Теперь торможение”, and “Когда это работает”.

### Live verification completed

- `/practice/dynamics-lesson`: full interaction completed at 698 × 698 from introduction through braking. Prediction gates the experiment; the 2.35-second motion completes before the result is revealed; both practice stages require two correct values; the final answer reveals links to second-law and friction practice.
- `/practice/dynamics-lesson`: inspected at 1440 × 1000 and 390 × 844. No horizontal overflow. At 390 × 844 the lesson action ends at y = 758 while the fixed navigation starts at y = 791, leaving a visible safe gap.
- `/practice/exam-demo`: inspected at 1440 × 1000, 698 × 698, and 390 × 844. The image uses `object-fit: contain`, loads successfully, and shows the cat, paper, and pencil at every checked viewport. No horizontal overflow.
- `/practice/exam-demo`: “Начать тренировку” opened a real ten-task session at 390 × 844.
- `/practice/electro-lesson`: reached the faded example, entered the correct value, received targeted feedback, and continued without a textarea or ungraded text gate.
- Browser console warnings and errors for the final inspected route: none.
- Physics checks: 134 passed. This is supporting evidence only; the visual and interaction observations above are the acceptance evidence.
- TypeScript check remains blocked by stale generated `.next/types/validator.ts` imports (`AppRoutes`, `LayoutRoutes`, `ParamMap`, `AppRouteHandlerRoutes`). The live Next.js server compiled all inspected routes without an overlay.

### Remaining project-wide risks

- Existing raster art outside these two surfaces still needs a separate face/expression/anatomy/crop pass against the Pinterest references. This pass did not claim those assets are approved.
- The three TopicPrimer lessons still share a fairly rigid seven-stage visual shell. Their terminology is cleaner and the dead text gate is gone, but their composition needs a later route-by-route art-direction pass rather than one global restyle.
- The sticky “Назад” control belongs to the shared page shell. It no longer covers the tested headings after adding scroll margins, but its relationship to long diagrams should be checked again whenever another lesson changes its scroll target.

## 2026-08-26 — Opposing forces and shared lesson system

### Trigger

- The force stage showed `6 Н − 2 Н = 4 Н` before a novice had learned why the leftward force receives a minus sign.
- Coordinate axes and signed projections are a later model. Introducing their notation inside the first resultant-force explanation would add a second new idea at the exact moment the learner is trying to understand the first.

### Project-wide findings

- The same prerequisite leak appeared in the final acceleration task: it asked for `−3 м/с²` after only a one-line statement that the x-axis points right.
- The shared electricity, density, and optics primer displayed a tiny seven-item stage directory and repeated administrative labels such as “Сцена”, “Условие”, and “Без показанного решения”. This made the lessons read like generated reports rather than authored explanations.
- The electricity worked example justified plausibility by numerically comparing voltage and resistance. That comparison is dimensionally invalid; the answer must instead be checked by the inverse relation `IR = U`.
- The density prediction reused the completed mass-volume graph, so the visual disclosed the answer before the learner committed to a prediction.
- Observation explanations were hidden inside a collapsed disclosure even though the next stage could be opened without reading them.
- At 640–767 px the fixed bottom navigation and the sticky contextual “Назад” control were both active. During scripted progression the sticky control covered the next heading and could intercept interaction.

### Decisions

- Keep coordinate axes and signed projections out of introductory dynamics and acceleration. At this level, ask for magnitude and direction separately.
- Explain opposing collinear forces by matching equal parts: 2 N of friction cancels an equal 2 N part of the 6 N pull, leaving 4 N in the direction of the stronger force.
- Preserve `F_рез = 6 − 2 = 4 Н` only after that visual and verbal explanation. The subtraction records the cancellation; it is not introduced as “left means minus”.
- Replace shared process language with task-specific actions and keep only one quiet stage label plus progress.
- Never reveal the measured relationship on a prediction screen. Prediction visuals may show setup and known quantities, while observation visuals reveal results.
- Observation and comparison with the learner's prediction stay visible; they are not optional collapsed content.

### Implementation

- Added an animated cancellation figure to the force stage: `2 Н ←` and `2 Н →` visibly cancel, then `4 Н →` remains.
- Reworded the worked, faded, and independent dynamics tasks around “what remains” before naming the resultant force in the equation.
- Rebuilt the acceleration braking answer as two controls: magnitude `3 м/с²` and direction “влево, против движения”. Removed the unexplained axis and signed-answer gate.
- Simplified the shared primer header, removed the seven-column mini-directory and “Условие” label, reduced oversized headings, added staged example motion, and changed generic footer actions to meaningful next actions.
- Corrected the Ohm-law check to `3 А · 4 Ом = 12 В`.
- Added a separate density prediction chart that shows volumes while keeping masses unknown; the completed mass-volume plot appears only after commitment.
- Made observation conclusions and prediction comparison visible by default.
- At widths below 768 px, hid the sticky contextual back control so it no longer competes with the fixed bottom navigation. Added bottom safe space to the acceleration lesson.

### Live verification

- Dynamics force stage completed and inspected at 698 × 698 and 390 × 844. The cancellation sequence is legible, has no horizontal overflow, and the remaining 4 N points right.
- Acceleration lesson completed through the final braking task at 698 × 698. The route remained stable, the correct magnitude-plus-direction answer was accepted, and no coordinate sign was required.
- Ohm-law primer completed from prediction through resistance transfer at 698 × 698. Every gated answer worked, the inverse-unit check rendered correctly, and the practice link appeared.
- Shared primer initial states inspected at 1440 × 1000 and 390 × 844. Density and optics were also inspected at 1440 × 1000 with no horizontal overflow.
- Density prediction and observation were compared in the same desktop viewport: masses were unknown before commitment, then the full measured relationship and explanation appeared after the choice.
- The live Next server compiled all edited routes. The only 404 in the log came from the auditor's mistaken `/practice/acceleration-lesson` URL; the product's real `/practice/kinematics-lesson` route returned 200 and was used for verification.

### Remaining risks

- Generated character art outside this pass remains unapproved until each asset is checked for expression, anatomy, crop, and physical relevance in its actual viewport.
- Coordinate axes, projections, and signed vector components still need their own prerequisite-safe lesson before later task families can assume that notation.
- The shared primer now has a coherent shell, but each topic still needs a future content-specific illustration pass; functional diagrams were kept where they explain the physics better than decorative character art.

## 2026-08-26 — Follow-up audit: task entry points and legacy routes

### Findings

- The task-type landing page for Newton's second law still told a beginner to choose an axis and signs before offering any route into the concept.
- The shared task help and mistake summaries repeated the same axis-first language, so the earlier lesson fix did not cover every entry point.
- The legacy topic practice routes remained reachable and the dynamics route still introduced projection notation in its first help surface.
- The thermodynamics practice header linked to the density lesson while calling the link a full topic explanation; that is too broad for the current lesson scope.
- The home heading had no whitespace in its accessibility name because the visual line break is made from adjacent spans.

### Decisions and implementation

- Task pages now offer a quiet, visible route to the matching lesson before the formula block, so a learner can choose explanation before practice.
- Newton and resultant-force hints now start with arrows, comparison, and cancellation; axes and signs are explicitly deferred to a later level.
- The first dynamics diagram shows only the horizontal forces needed for the decision. Normal force and weight appear only in the complete worked example, where their cancellation is captioned.
- Legacy topic practice headers now expose the matching lesson. The thermodynamics link is labelled honestly as “Начать с основы: плотность”.
- Formula rows hide vertical overflow so KaTeX cannot expose an accidental vertical scrollbar beside a compact equation.
- The home heading keeps the visual art direction but supplies the full Russian accessible name.

### Live verification

- `/tasks/newton-second` and `/practice/family/newton-second` inspected at 390 × 844; the new lesson link and the updated help drawer both render without overlap.
- `/practice/dynamics-demo`, `/practice/kinematics-demo`, `/practice/electro-demo`, `/practice/thermo-demo`, and `/practice/acceleration-focus` inspected at 390 × 844; each legacy route exposes an honest learning path and stays within the viewport.
- `/practice/dynamics-lesson` re-run through the force choice and complete worked example at 390 × 844; the horizontal novice diagram and full school-style example both remain legible.
- A live sweep of home, topics, formulas, tasks, progress, mistakes, all five current lessons, and mixed practice found no broken images or horizontal overflow at the available 698 × 698 browser viewport. Mobile checks were repeated at 390 × 844 for the main task, lesson, topics, density, optics, home, mistakes, and acceleration routes.

### Remaining risks

- The available in-app browser panel caps the wide check at 698 px, so a true 1440 px render still needs a later external-browser pass.
- Generated raster art remains a separate asset-approval queue; code-level crop and relevance fixes do not make an AI-looking illustration final.
- The broad thermodynamics catalog still contains gas and heat task families while the authored lesson currently starts with density; a dedicated temperature/heat lesson is still needed before that category can claim full coverage.

## 2026-08-26 — Final follow-up decisions in this pass

- The legacy dynamics help surface now uses `F_рез = ma` and the same cancellation language as the authored lesson; the first legacy force illustration hides vertical forces until the worked example needs them.
- All legacy topic practice headers now lead to an authored lesson. The thermodynamics header deliberately says “Начать с основы: плотность” because the current authored route does not yet cover gas and heat.
- The home heading keeps its two-line visual treatment but now exposes a complete accessible name (“Почему доска замедляется?”).
- The current live browser is left on `/practice/dynamics-lesson` at the force stage, with the horizontal diagram and cancellation visual in view at 390 × 844.

## 2026-08-27 — Three-surface composition pass from external critique

### Trigger and scope

- The new critique correctly shifted the question from “is the style understood?” to “can the product grammar be executed consistently?”.
- Scope was deliberately limited to three representative surfaces: home discovery, formula reference, and the dynamics lesson. No global redesign or palette change.

### Primary object, action and hierarchy

- Home: primary object is the board-and-acceleration scene; primary action is checking a version or choosing another question. The scene stays atmospheric, while the chapter list is now framed as concrete questions to check.
- Formulas: primary object is the searchable formula relationship; primary action is finding a formula. Search moved into the opening composition so retrieval starts before the first scroll.
- Dynamics lesson: primary object is the two-cart comparison; primary action is making a prediction. On narrow screens the prediction and choices come before the compact experiment preview, making the learning order and the action visible together.

### Decisions and implementation

- Added shared page tokens for content measure and display/title/body/meta type levels. Home, formulas, and dynamics now use the same grid width and typographic rhythm while retaining different surface jobs.
- Reduced decorative heading scale and excess vertical padding where it pushed the task below the fold.
- Kept the home hero as a discovery surface; did not force every page to become a simulator.
- Kept formula and task surfaces utility-oriented; their repeated rows remain intentional, but their primary actions now appear earlier.
- Added a compact prediction-only presentation of the existing two-cart model on mobile; no new physics or answer logic was introduced.

### Live verification

- Home, formulas, and dynamics were inspected at the available 1425 × 1000 wide viewport and at the narrow browser state. Home now brings the next question section into the wide first screen; formulas show title, search, and section navigation together; dynamics shows the opening action and the prediction choices without bottom-nav obstruction.
- The prediction screen was exercised through navigation and inspected after the animation settled. All three choices remain keyboard/touch targets; the experiment preview follows the choice on narrow screens.
- TypeScript check has no source-level errors from this pass; `npm run check` still reports only stale generated `.next/types/validator.ts` route imports (`AppRoutes`, `LayoutRoutes`, `ParamMap`, `AppRouteHandlerRoutes`).

### Open risks

- The wide capture is 1425 × 1000 in the in-app browser, not a literal 1440 CSS viewport; the remaining difference is environmental, not inferred away.
- The mobile prediction screen keeps the “Запустить опыт” footer sticky above the fixed navigation after a choice; the action and the compact experiment now share the safe area without overlap.
- Raster character art was intentionally untouched. Its AI-slop and physical-relevance review remains a separate asset gate.

### Final control notes

- At 390 × 844, the dynamics footer action remains above the navigation both before and after a prediction; the compact experiment ends before the sticky action begins.
- The formula search now accepts the natural stem in Russian: “трение” finds “Сила трения скольжения” instead of reporting zero matches.
- The 698 px check is rendered as a 683 px document viewport inside the browser panel; no horizontal overflow was observed on any of the three selected surfaces.
