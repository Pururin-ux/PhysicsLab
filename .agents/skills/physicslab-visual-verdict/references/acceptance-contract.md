# PhysicsLab acceptance contract

## Canonical surfaces

| Surface | Route | Required states |
| --- | --- | --- |
| Home | `/` | hero; physics sections; keyboard focus on primary links |
| Topics | `/topics` | continuation link; asymmetric topic composition; mobile stacking |
| Learning | `/practice/kinematics-demo` | opening explanation; answer state; explanation revealed |
| Exam preparation | `/practice/exam-demo` | entry; active task; restored session when available |
| Formulas | `/formulas` | loaded list; first formula open; search/filter when changed |

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
- the sticky mobile header stays visible without covering the focused control;
- interactive targets remain usable by keyboard and touch;
- no relevant console warning/error, framework overlay, or failed application request exists.

## Product-specific visual invariants

- Learning and CT/CE preparation are immediately distinguishable without long explanatory copy.
- Nova and cats support the content; they do not cover formulas, questions, controls, or essential diagrams.
- Repeated cards do not become the dominant page structure. Visual repetition must correspond to repeated user behavior.
- Formula surfaces use the site palette and `KaTeX_Main`; indices, fractions, roots, and units remain legible.
- Graph axes, labels, units, plotted values, and explanatory text agree.
- Decorative effects do not reduce contrast or create constant movement.
- Desktop and mobile crops preserve the subject, useful negative space, and intended reading order.
- Visible text avoids developer-facing labels, fake progress, invented statistics, and prose explaining how the interface is teaching.

## Evidence packet

Keep the final evidence small and useful:

- the unedited three-second visual reaction recorded before source inspection;
- the observed route of the eye and the strongest AI-slop credibility signal;
- one before/after comparison for each materially changed surface;
- final desktop and mobile screenshots for the core flow;
- the exact interaction exercised and observed state change;
- console, overflow, visible-image, focus, and test results;
- unresolved limitations stated plainly.

Pixel diffs are debugging evidence, not an aesthetic verdict. A human visual review remains required for hierarchy, crop, rhythm, density, character placement, and emotional tone.
