# PhysicsLab acceptance contract

This reference is a review checklist. Product routes and ownership come from
`docs/current/PRODUCT.md` and `apps/web/lib/product-routes.ts`.

This contract applies only when a deliberate rendered review has been selected.
It is not a default completion checklist for ordinary frontend edits.

## Canonical surfaces

Choose the affected surface; do not run every route without a reason.

| Surface | Route | Required states when relevant |
| --- | --- | --- |
| Home | `/` | new/returning learner; primary actions; Mio crop; keyboard focus |
| Learn hub | `/topics` | navigation to textbook, tasks, experiments/lessons and formulas; mobile stacking |
| Textbook | `/learn` and affected chapter | contents/filter; chapter reading; worked example/model/self-check where changed |
| Mio investigation | `/practice/average-speed-lesson` | hypothesis; changed condition/observation; explanation; independent transfer; save/restore when changed |
| Task practice | `/tasks` or affected family | browse/search; active task; feedback/help/next action |
| Exam preparation | `/practice/exam-demo` | entry; active task; restored session when available; no Mio intervention in the exam |
| Progress | `/profile` | observed evidence; review links; data export/restore when changed |
| Formulas | `/formulas` | loaded list; details; search/filter when changed |

Add the exact route and states affected by the current request. Do not broaden the run to every page without a reason.

## Stable capture

Before capture:

- wait for `domcontentloaded`, the meaningful page landmark, `document.fonts.ready`, and all visible images;
- prefer a deterministic API fixture for generated tasks;
- use `prefers-reduced-motion: reduce` unless motion is the subject;
- disable or mask only genuinely nondeterministic pixels, never the component under review;
- keep the same viewport, theme, data, scroll position, and state for before/after images.

## Geometry and runtime

For each required viewport, verify:

- `document.documentElement.scrollWidth <= innerWidth + 1`;
- the main landmark has a positive visible bounding box inside the viewport;
- no visible image has `naturalWidth === 0`;
- no heading, formula, option, or action is clipped;
- the mobile header stays usable without covering the focused control when mobile is in scope;
- interactive targets remain usable by keyboard and touch when those interaction modes are in scope;
- no relevant console warning/error, framework overlay, or failed application request exists when runtime behaviour is part of the review.

## Product-specific visual invariants

- Learning and ЦТ/ЦЭ preparation are immediately distinguishable without long explanatory copy.
- Mio supports authored learning scenes without covering formulas, questions, controls, or essential diagrams; she can be hidden where the product contract allows it.
- Former Nova/cat assets are not visual invariants and must not be restored as product identity by default.
- Light and dark themes are both first-class surfaces; do not force a dark-only identity onto light mode.
- Repeated cards do not become the dominant page structure. Visual repetition must correspond to repeated user behavior.
- Formula surfaces use correct math typography; indices, fractions, roots, units and labels remain legible.
- Graph axes, labels, units, plotted values, instrument pointers and explanatory text agree physically.
- Decorative effects do not reduce contrast or create constant movement.
- Desktop and mobile crops preserve the subject, useful negative space, and intended reading order when those viewports are in scope.
- Visible text avoids developer-facing labels, fake progress, invented statistics, and prose explaining how the interface is teaching.

## Evidence packet

Keep the final evidence small and useful. Include only evidence relevant to the selected review:

- the unedited first visual reaction recorded before source inspection when an aesthetic verdict is requested;
- the observed route of the eye and the strongest credibility/AI-slop signal when visual quality is under review;
- a before/after comparison for materially changed surfaces when comparison is necessary to support the claim;
- final screenshot(s) for the required viewport(s); include both desktop and mobile only when responsive behaviour is relevant or the review explicitly calls for both;
- the exact interaction exercised and observed state change when interaction is under review;
- console, overflow, visible-image, focus, accessibility, or test results only when they address an identified risk;
- unresolved limitations stated plainly.

Pixel diffs are debugging evidence, not an aesthetic verdict. A human visual review remains required for hierarchy, crop, rhythm, density, character placement, and emotional tone when those qualities are the subject of the review.
