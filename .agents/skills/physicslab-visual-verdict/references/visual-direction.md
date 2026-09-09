# PhysicsLab visual direction

This file records visual taste and anti-slop heuristics for review. It does not
replace `docs/current/DESIGN_DIRECTION.md`, `PRODUCT.md`, or
`MIO_CHARACTER.md`.

## The real scene

A Belarusian student roughly 14–18 opens PhysicsLab after school, during
homework, before a lesson, or while preparing for ЦТ/ЦЭ. The product should feel
companionable, intelligent and visually generous without becoming a game for
small children, a strict electronic textbook, a SaaS dashboard, or a theatrical
"mission control" interface.

Physics is the subject. Do not use stars, grids, glass, laboratory chrome,
particles or neon merely to signal "science".

## The recognizable world

- Think **living laboratory notebook / after-school physics**, not a mandatory
  dark fantasy/cosmic skin. Light and dark themes should both feel intentional.
- Mio is the current approved web companion. Her identity, voice and visual
  invariants are defined only in `docs/current/MIO_CHARACTER.md`.
- Do not revive Nova as a second product guide. Legacy Nova assets/components
  may remain as technical debt until a scoped migration verifies their imports.
- Side characters (including cats) are not required identity elements. Introduce
  one only when it has a concrete learning or narrative role approved by the
  current product direction.
- Character/scene art should be authored painted work, carefully reviewed
  generated raster art, or suitable artist-tool output. Accurate formulas,
  vectors, diagrams, graphs and instrument markings remain deterministic.
- Background atmosphere needs a physical or narrative reason: a desk after
  school, a classroom object, a window, a notebook, a trolleybus, a light
  experiment. Generic cosmic fog is not identity.

## Composition

- Prefer one clear scene or focal relationship per viewport.
- Use asymmetry, overlap, cropping and negative space intentionally. Empty space may remain empty.
- Compose image and interface together. A character should look toward, point to, hold, illuminate, measure, write about, or otherwise relate to the important content.
- Avoid pages assembled from equal rounded cards. Repetition is appropriate only when it matches repeated student behavior, such as task/formula lists.
- Alternate quiet and dense passages. Learning pages need breathing room; exam pages may be denser without becoming a control panel.
- On mobile, recompose rather than merely shrink. Protect faces, hands, relevant objects, formulas and useful negative space.

## Typography and mathematics

- UI typography should feel contemporary and friendly to a teenager, not corporate, toy-like or editorial for its own sake.
- Mathematical notation uses a real math font/KaTeX metrics. Prose, variables, units, indices, fractions and diagram labels must coexist coherently.
- A formula surface belongs to the surrounding composition. A worksheet-like white surface is valid only when it is deliberately established as physical paper, not as an accidental theme break.
- Headings should sound like useful destinations, not labels from a design presentation. Avoid decorative metadata and numbered scaffolding that communicates no real state.

## Learning and exam preparation

The distinction should be felt before it is explained.

**Learning** can be slower and more spacious: observable situation, prediction or question when useful, experiment/model/diagram, explanation, independent transfer and a next action. Mio may participate when her action has a learning purpose.

**ЦТ/ЦЭ preparation** is focused and compact. Task, given data, answer and explanation need stable rhythm. Navigation/progress should orient without theatrical countdowns, fake statistics, stress language or gamified pressure. Mio does not intervene inside the exam flow.

Do not separate modes with paragraphs about methodology; the difference should appear in composition, density, interaction, imagery and tempo.

## Language on the surface

- Write natural Russian suitable for a Belarusian secondary-school student and use Belarusian school terminology for ЦТ/ЦЭ, formulas, units, tasks and topic names.
- Explain unfamiliar symbols, projections, signs and indices where they first matter.
- Avoid institutional lecturing, repeated reassurance, motivational filler and AI-tutor clichés.
- Do not narrate internal pedagogy, route names or implementation details to the student.

## Material and detail

- Borders, glow, blur and shadows are not decoration to apply everywhere.
- Small details may come from physics and school life: pencil marks, a folded page corner, a ruler, graph paper, a bus ticket, a prism reflection, apparatus notes. Use them only when they belong to the scene.
- Motion may reveal a physical relationship or acknowledge an action. Constant floating, pulsing, orbiting and particles make the site tiring and generic.

## Cultural credibility

- Prefer plausible Belarusian classrooms, homes, clothing, stationery, public transport, weather and school routines over vague American campus imagery or fantasy laboratories.
- Avoid invented official symbols, inaccurate exam paperwork and stereotyped national decoration.
- A teacher should be able to show the page in class without apologizing for terminology, diagram or tone.

## What must not creep back in

- Nova as a current web guide or an unexplained dual-mascot system;
- dark-only identity imposed on all themes;
- station/mission/forecast/cockpit/laboratory-dashboard/quest framing;
- equal card grids as default page grammar;
- tiny characters stranded in corners;
- inconsistent generated character identity, lighting or anatomy;
- generic purple space gradients, glass panels, glow, decorative particles and over-rounding;
- paragraphs that announce the vibe/method instead of demonstrating it;
- repeated `step 1 / step 2 / step 3` labels without a genuine ordered procedure;
- generic geometric placeholder art standing in for finished contextual illustration.
