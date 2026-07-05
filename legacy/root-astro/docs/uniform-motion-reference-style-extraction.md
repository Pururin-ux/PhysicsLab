# Uniform Motion Reference Style Extraction

Source of truth: `design-references/uniform-motion/final-reference.png`.

This document extracts reusable visual rules for the production chapter “Равномерное движение”. The goal is not to redesign the learning flow, but to make the existing implementation use the same visual language as the approved reference.

## 1. Colors and Glow

- **Background:** deep navy, nearly black, with a subtle star field and very soft blue atmospheric gradients. Use `#020815`, `#061224`, `#08172b` as the base range.
- **Panel fill:** dark transparent glass, not flat cards. Use layered `rgba(3, 10, 22, 0.72-0.88)` with a faint top highlight.
- **Cyan border:** primary structural line and graph color. Use `#22c9ff`, `#58d8ff`, and low-opacity cyan borders. Cyan glow must be controlled and mostly around major panels, graph lines, axes, and active instrument edges.
- **Yellow active:** action and current-state accent. Use `#ffd44d` / `#ffbf2e` for play buttons, current points, active velocity `v`, and key numeric readouts.
- **Muted text:** secondary text is cool gray-blue, around `#aab8ca` / `#8394ab`. Avoid pure gray.
- **Green:** only for correct quiz feedback or success state. Do not use it for generic decoration.
- **Red:** only for error/trap states, not for normal physics states.

## 2. Panels

- **Main lab console:** one large cyan-outlined glass instrument, not a collection of unrelated cards. It should contain formula, motion track, graph, explanation, and controls as one system.
- **Inner instrument panels:** darker glass modules with thin cyan borders, subtle internal grid, and modest inset depth.
- **Quiz panels:** lower contrast than the main console. They can use green only after a selected correct answer.
- **Details panels:** quiet, secondary, and visually below the lab console. Use the same glass language, but reduce glow and emphasis.

## 3. Header

- Header should feel like transparent glass over the starry scene, not a heavy opaque strip.
- Active navigation has a cyan underline/glow, not a filled pill.
- Right-side score/user pills in the reference are glass capsules with thin borders. If not implemented yet, leave structure simple but keep the same visual direction.
- Brand mark should be compact and bright; header density must stay low.

## 4. Formula

- Formula is large, glowing, and central inside the console.
- `x`, `x₀`, and `t` are bright/cyan-white. `v` is yellow and visually special.
- Tooltip dots near variables are small secondary affordances, not heavy labels.
- No heavy hover rectangles or filled blocks behind formula symbols.
- The formula panel can use a cyan grid/star field behind the math, but the math must remain the visual anchor.

## 5. Motion Track

- Track is a glowing coordinate axis, not a plain slider.
- Include readable ticks and cool text labels.
- Current body point is yellow with a halo and a bright core.
- Direction arrow follows the sign of `v` and reads as motion, not as a button icon.
- Use a dashed vertical marker and compact `x = ...` readout near the point when it helps connect position to coordinate.

## 6. Graph

- Graph should look like an instrument graph: dark panel, fine cyan grid, readable axes, ticks, and labels.
- `x(t)` line is cyan and glowing; current point is yellow with halo.
- Projection lines are dashed and secondary, used to connect current `t` and `x`.
- Readout capsule belongs inside or directly below the graph, with `t` in cyan and `x` in yellow.
- Formula mini-card can sit in the graph area when space allows; it must be subtle and not compete with the main formula.

## 7. Controls

- Controls are one dock, not separate HTML-looking controls.
- Primary play button is yellow, high contrast, and larger than secondary controls.
- Reset and direction presets are dark glass buttons with cyan borders.
- Speed slider uses a cyan-to-yellow instrument track and a glowing yellow thumb.
- Presets (`Назад`, `Стоп`, `Вперёд`) should read as lab-console controls, not generic form buttons.

## 8. Bottom Panels

- Quiz and details are secondary after the main console.
- They should be balanced, quiet glass panels with lower glow.
- Their controls can be compact; the main visual energy should stay in the lab console.

## Shared Primitive Targets

- `LabGlassPanel`: dark glass fill, cyan border, controlled glow, optional internal grid.
- `NeonBorder`: stronger cyan edge for primary consoles.
- `InstrumentGraph`: graph grid, axes, glowing line, projection, current point styling.
- `MotionTrack`: glowing coordinate axis, ticks, point, arrow, compact readout.
- `ControlDock`: cohesive dock for primary/secondary buttons, slider, and presets.
- `QuizConsole`: calm lower-contrast quiz/details panel.

## Rendering Technique Notes

- Reference glow is not a plain card shadow. Use layered panel backgrounds, inset light, and `filter: drop-shadow(...)` on glowing strokes, points, icons, and formula symbols.
- Background atmosphere should come from a dark radial-gradient field plus sparse star points. A small canvas starfield is acceptable for design-board/prototype surfaces when it stays decorative, respects `prefers-reduced-motion`, and never carries educational meaning.
- Formula glow needs multiple `text-shadow` layers: a tight white/cyan halo for readability and a wider yellow halo only on active `v`.
- Motion point and graph point should use a bright core plus a separate halo. In SVG/CSS, this means separate halo circles or `drop-shadow`; in canvas prototypes, use `ctx.shadowBlur` and `ctx.shadowColor`.
- Borders should feel like instrument glass: thin cyan lines, inner highlights, and low-opacity edge glow. Avoid thick filled outlines and generic dashboard cards.
- Decorative comet/orbit elements should be thin, atmospheric, and secondary. They must not compete with the formula, motion track, or graph.

## Current Production Pass Constraint

The current pass should keep the existing learning logic and DOM behavior. It should improve the visual language of `/chapters/uniform-motion/` and `UniformMotionLab`, but it should not add new instructional features or radically reorder the chapter.
