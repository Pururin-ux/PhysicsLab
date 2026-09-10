---
name: physicslab-visual-verdict
description: Perform a deliberate rendered visual and interaction review of PhysicsLab. Use when the user explicitly asks to inspect, critique, compare, or visually verify the interface; after a substantial redesign; when responsive/layout behaviour is the task; or when browser-observed evidence is necessary to resolve a suspected UI problem. Do not invoke for routine copy changes, localized CSS edits, content updates, or as an automatic completion requirement for frontend work.
---

# PhysicsLab visual verdict

> This is optional development tooling. For current web requirements, follow
> `AGENTS.md`, `docs/current/`, and `docs/decisions/`; this skill and its
> references do not independently define product direction.

Treat the rendered product as evidence of current behaviour, not as authority
for product direction. Preserve the current canonical identity and contracts
from `docs/current/`. At present the approved web companion is **Mio**; do not
revive Nova, a dark-only visual identity, cats, cosmic framing, or other legacy
motifs merely because old components/assets still exist.

## When to use this skill

Rendered review is deliberate, not a default frontend ritual.

Use this skill when the task materially depends on what is actually rendered:
visual hierarchy, composition, responsive layout, browser-only behaviour,
interaction state, screenshot comparison, or an explicit visual verdict.

Do not launch this workflow merely because frontend files changed. Routine copy,
content, design-token, CSS, or localized code changes should use the smallest
relevant code-level verification unless the result cannot be judged reliably
without rendering.

Verification budget is part of task scope. Do not broaden browser or test work
merely to increase confidence. Each additional check should correspond to an
identified failure mode it can realistically detect.

## Load the acceptance contract

Read [references/acceptance-contract.md](references/acceptance-contract.md) only
after a deliberate rendered review has been selected. It defines route/state
evidence for that review and is not a default completion checklist for ordinary
frontend edits.

For requests about beauty, taste, composition, atmosphere, originality, visual
realism, or whether the site feels AI-generated, also read
[references/visual-direction.md](references/visual-direction.md) and
[references/aesthetic-rubric.md](references/aesthetic-rubric.md). For Mio-specific
identity, read `docs/current/MIO_CHARACTER.md`; do not restate or override her
canonical invariants in this skill.

When the claim concerns how real students perceive the site, whether it feels
childish, trustworthy, memorable, or worth returning to, read
[references/student-perception-test.md](references/student-perception-test.md).
Do not substitute an AI aesthetic score for student evidence.

## Browser contract

Browser work is targeted and evidence-driven.

1. Use the Browser plugin when rendered evidence is actually needed, and keep one persistent session.
2. Do not capture before/after screenshots after every edit. Batch coherent changes and inspect the affected surface once afterwards unless an intermediate capture is needed to diagnose a specific failure.
3. Use one primary viewport by default, chosen for the task. Add mobile when responsive behaviour is relevant. Add further viewport, theme, or state combinations only for a specific identified risk or an explicit review requirement.
4. Capture a pre-edit state only when comparison matters: a redesign, suspected regression, reference match, or other before/after claim. Do not create comparison evidence for trivial edits merely to satisfy process.
5. Before a screenshot, wait for `document.fonts.ready`, visible images, settled layout, and the intended interactive state. Emulate reduced motion when animation is not under review.
6. Inspect only the runtime evidence relevant to the failure mode. Screenshot/geometry matter for layout; DOM/ARIA/focus for accessibility or interaction; console/network for suspected runtime failures. Do not collect every evidence type by default.
7. Do not update screenshot baselines merely to make a failure green. Review the diff visually first.

Technical checks are supporting evidence, not an aesthetic verdict. A page can
pass every automated check and still be generic, emotionally flat,
compositionally awkward, or visually unbelievable.

## Project checks

Do not run these checks as a default bundle. Choose only the narrowest check
that can detect the regression relevant to the current change.

- `npm run check` — when the change creates meaningful TypeScript/interface/import risk.
- `npm run test:visual -- --project=desktop --project=mobile-390` — for deliberate visual-regression work; narrow projects further when possible.
- `npm run test:a11y -- --project=desktop --project=mobile-390` — when accessibility, keyboard/focus, semantics, or interaction behaviour is under review.
- `npm run test:physics` — when formulas, tasks, graphs, diagrams, or learning content changed and a broader physics check is justified; prefer a directly related test file for localized changes when practical.

Pixel baselines are opt-in. On PowerShell, set
`$env:VISUAL_SNAPSHOTS='1'` for an approved baseline comparison run, then remove
the variable. Never regenerate baselines without visually reviewing the
before/after pair.

Use production performance measurements for performance claims. Do not treat
warm Next.js development timings as production evidence.

## Visual decisions

- Reuse existing tokens/components when they fit the current contract; do not preserve stale vocabulary just because it exists.
- Prefer an open composition, a scene, a note, or one real interactive surface over repeated generic cards.
- Keep supporting prose short and readable; the interface must not narrate its own pedagogy or implementation process.
- For finished character/scene art, use authored painted assets, carefully reviewed generated raster art, or appropriate artist tools. Do not substitute generic geometric placeholders for visual art.
- Precise formulas, graphs, vectors, instrument marks and explanatory diagrams may and often should remain deterministic SVG/DOM/KaTeX when accuracy requires it.
- Verify image crop and subject placement when the review concerns those properties. Do not multiply viewport checks without a responsive risk.
- Keep KaTeX fonts and metrics intact. Never judge formula correctness from appearance alone; pair visual review with a relevant physics check when correctness changed.
- Motion must communicate state, remain smooth, and have a reduced-motion alternative when motion is part of the task.
- Preserve user data, quiz persistence, and unrelated worktree changes.

## Agent use

When the user authorizes parallel work, separate responsibilities:

- one implementation owner edits the UI;
- one fresh-context reviewer inspects screenshots and interactions without editing the same files;
- one content reviewer checks physics and Belarusian school terminology when content changed.

Do not let multiple agents concurrently redesign the same surface. Return
concrete findings and image evidence to the implementation owner.

## Rendered review completion bar

This is the completion bar for a deliberate rendered review, not for ordinary
frontend work.

A rendered review is complete when the specific claim under review has enough
evidence to support or reject it. Check the target interaction and required
viewport(s), inspect the relevant final render, and report unresolved
limitations plainly. Console, network, focus, accessibility, extra viewports,
before/after screenshots, or automated suites are required only when they are
relevant to the stated risk or explicitly requested.

Do not keep expanding verification after the question has been answered.
