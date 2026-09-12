---
name: frontend-design
description: Design and refine the PhysicsLab web interface while preserving its current product identity, learning model, Mio character contract, and existing visual continuity. Use when the user asks to create or materially redesign a PhysicsLab page, component, interaction, or visual system. Creativity should solve a concrete learning, interaction, composition, or emotional problem rather than invent a new aesthetic direction for every task.
license: Complete terms in LICENSE.txt
---

# PhysicsLab frontend design

This skill is project-specific. It does not define product direction by itself.
Follow `AGENTS.md`, `docs/current/`, and `docs/decisions/` first.

PhysicsLab already has an authored product and visual identity. Do not treat each
frontend task as permission to invent a new style, mascot, theme, information
architecture, or design system.

## Continuity first

Begin from:

- the user request;
- the relevant current contract, using the entry point or fallback in `AGENTS.md`;
- the existing rendered system when rendered evidence is actually needed;
- Mio's current identity from `docs/current/MIO_CHARACTER.md` when she is involved;
- the pedagogical purpose of the affected surface.

Do not revive legacy Nova/cat/cosmic/dark-only directions because old code or
assets still exist.

Creativity should extend a recognizable PhysicsLab language. Break that language
only when the user explicitly asks for exploration or when current evidence
shows that the existing language itself is failing the task.

## Define the design problem before styling

Before coding, state the concrete problem in one or two sentences. Examples:

- the physical relationship is hard to perceive;
- the page reads like a generic electronic textbook;
- the next action is visually ambiguous;
- Mio appears as a sticker instead of participating in the learning event;
- the mobile composition destroys the intended reading order;
- repeated cards flatten distinctions between different kinds of learning.

Do not substitute vague goals such as "make it modern", "make it engaging", or
"make it more premium" for an observable problem.

When the request is exploratory, produce alternatives that differ in structure,
interaction, information hierarchy, or relationship between learner and
content—not merely in colors, gradients, copy, or decoration. Unselected
alternatives are not CANON.

## Design principles

### Purpose before novelty

Memorability should emerge from a specific idea working well, not from visual
stunts added only to look unusual. Do not optimize for surprise at the expense
of legibility, physics, or continuity.

A bold composition is welcome when it serves the lesson. Asymmetry, overlap,
large negative space, illustration, or unusual rhythm are tools, not default
requirements.

### Physics should happen inside the interface

Whenever possible, let the learner see or manipulate the physical relationship
instead of reading an explanation of what the interface is teaching.

Precise formulas, graphs, vectors, scales, instrument marks, units, and
explanatory diagrams should remain deterministic SVG/DOM/KaTeX when accuracy
benefits from it. Do not replace physically meaningful geometry with decorative
raster art.

When artistic assets and physical models coexist, integrate them compositionally
without making the artwork responsible for numerical precision it cannot
reliably provide.

### Mio acts; she does not decorate

When Mio appears, ask:

- what does she believe is happening?
- what is she looking at?
- what action is she taking?
- what changed in her confidence or attention?
- what should the learner notice because of that action?

Prefer a meaningful action, gaze, interruption, note, experiment, correction,
or reaction over another generic named emotion portrait.

Do not add Mio to every surface. Preserve contexts where the product contract
calls for independence, exam realism, or less character presence.

### Typography

Use the existing typographic system first. Do not replace fonts merely because
a generic design rule calls them common or unfashionable.

Change typography when there is a concrete hierarchy, readability, formula,
localization, tone, or consistency problem. Mathematical notation must remain
correct and visually compatible with surrounding text.

### Color and themes

Preserve the current token system and the status of light and dark themes as
first-class surfaces. Do not turn one theme into the "real" identity and the
other into an afterthought unless current product direction changes.

Use accent, contrast, texture, depth, and illustration deliberately. Avoid
uniformly distributing visual effects across every surface.

### Motion

Motion must communicate state, causality, attention, or character action. Do
not add continuous motion, staggered reveals, parallax, hover spectacle, or
other animation solely because animation is available.

When motion is meaningful, keep it smooth and provide an appropriate
reduced-motion behaviour.

### Composition

Prefer composition that reflects the actual learning activity. Avoid converting
every page into a grid of interchangeable rounded cards.

Repeated visual structures should correspond to repeated user behaviour. A
scene, notebook, investigation, worked example, graph, task, and exam surface
may need different spatial logic even when they share tokens and components.

## Avoid generic AI-looking design

Do not fall back to a collection of fashionable effects in place of an idea.
Common failure modes include:

- repeated rounded cards used for unrelated content;
- purple/blue gradients, glow, glass, grain, or noise without a product reason;
- decorative blobs and floating shapes filling empty space;
- oversized marketing headlines inside a learning workflow;
- generic dashboard structure for material that is not a dashboard;
- excessive badges, pills, statistics, streaks, or fake progress;
- illustrations or mascot poses unrelated to the learner's current action;
- copy that explains the pedagogy instead of letting the interaction embody it;
- arbitrary font changes or theme changes introduced only to appear distinctive.

A restrained solution can be more authored than a spectacular one. Distinction
comes from specificity and coherence, not from maximizing decorative novelty.

## Implementation discipline

- Reuse existing components and tokens when they genuinely fit the problem.
- Do not preserve a bad abstraction solely for consistency; explain the concrete problem before changing it.
- Do not introduce a new library, design system, animation framework, or state layer when the existing stack can solve the task cleanly.
- Do not refactor unrelated surfaces as part of a visual change.
- Keep physical and learning logic separate enough from presentation that visual iteration cannot silently change correct behaviour.
- Preserve user data, persistence behaviour, and unrelated worktree changes.

## Verification budget

Design work does not automatically require a full browser or test ritual.
Verification budget is part of task scope.

For routine localized work, use code-level evidence when it is sufficient. Do
not invoke `physicslab-visual-verdict` merely because frontend files changed.

Use a targeted rendered check when the design question genuinely depends on
appearance, responsive layout, crop, browser-only behaviour, or interaction.
Batch coherent edits and inspect the affected surface once afterwards rather
than taking screenshots after every small change.

Use the dedicated `physicslab-visual-verdict` skill only when its opt-in trigger
is satisfied: an explicit visual critique/comparison, a substantial redesign,
a responsive/layout task, or a UI problem that requires browser-observed
evidence.

Automated tests should target an identified failure mode. Do not run visual,
accessibility, E2E, physics, build, or screenshot suites as a default bundle.

## Finish

When reporting the result, separate:

1. what was changed;
2. what was actually verified;
3. what remains a design judgment, hypothesis, or author decision.

Do not claim that a design is "better for students" without participant
evidence. AI review can identify craft problems and generate hypotheses, but it
does not replace the user's authorship or real learner feedback.
