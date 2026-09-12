---
name: PhysicsLab
version: 1
---

# PhysicsLab Design Memory

PhysicsLab is a dark, dense, interactive physics-learning instrument. It is not a SaaS landing page, not an Awwwards portfolio, and not a generic EdTech card stack.

The interface should help a tired student see the physical relationship quickly: what to change, what moves, what graph responds, and what formula explains it.

## Visual Parameters

- DESIGN_VARIANCE: 4
- MOTION_INTENSITY: 2
- VISUAL_DENSITY: 7

## Product Identity

PhysicsLab UI should feel like a beautiful educational instrument:

- clear;
- dense enough;
- responsive;
- physically meaningful;
- non-generic;
- not decorative for its own sake.

Dark Anime Lab is the visual language, but the learning model is the priority. Visual style supports prediction, manipulation, observation, explanation, and transfer.

## Lab Scene Rules

A lab scene is an instrument console, not a vertical article.

- Controls and observation must be close.
- Avoid one huge card per viewport.
- Avoid luxury whitespace in simulations.
- Avoid a giant-accessibility-font feeling in normal lab screens.
- More meaningful lab context should be visible in one viewport.
- Do not solve composition problems only by reducing padding, gap, or font-size.
- Change layout and composition when needed.
- Primary graph can be visually dominant.
- Secondary graph can be lower priority.
- Motion panel should not be an oversized empty aquarium.
- Mobile must show more than one meaningful lab element per viewport.
- Keep graphs readable.
- Keep touch targets usable.
- Avoid sticky controls unless explicitly requested.

## Motion Rules

Motion should explain physics, not decorate the page.

- Use motion to show current time, current position, current graph segment, and feedback state.
- Keep MOTION_INTENSITY low by default.
- Respect reduced motion.
- Avoid particles, flashes, and ambient animation near dense reading.
- Do not add animation that competes with graphs or formulas.

## Composition Rules

Every screen should have one dominant learning idea.

- Action should appear before observation when a student is asked to run or manipulate a scene.
- Formula should explain what the student has already observed.
- Graphs are instruments, not decorative illustrations.
- UI density should reveal relationships, not create clutter.
- If a layout feels like stacked cards, restructure the scene before adding more borders or glow.

## Mobile Rules

Mobile is not a shrunken desktop.

- Show the title, current state, controls, and start of observation close together.
- Avoid one card filling almost the whole viewport.
- Keep range controls usable.
- Keep graph labels and current points readable.
- Prefer compact, meaningful groups over long vertical piles.

## Visual Review Requirements

Agents must not self-grade visual quality as accepted.

For visual tickets, report:

- screenshot paths;
- first viewport contents;
- relevant element bounding boxes;
- what appears above and below the fold;
- what changed in composition;
- known tradeoffs and remaining visual risks.

Human reviewer decides whether visual quality is acceptable.

## Tooling Boundaries

Use frontend-design or Taste-style guidance only as a visual-quality helper, not as a replacement for the PhysicsLab learning model.

Do not import generic component-library aesthetics without adapting them to PhysicsLab. Do not install heavy visual tooling unless a separate ticket explicitly asks for it.
