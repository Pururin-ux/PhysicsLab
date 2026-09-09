---
name: physicslab-visual-verdict
description: Verify and refine the rendered PhysicsLab interface against its current visual and learning contracts. Use for changes to PhysicsLab pages, components, typography, formulas, graphs, illustrations, navigation, responsive layout, loading behavior, or visible copy; for screenshot comparisons; and before declaring frontend work complete.
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

## Load the acceptance contract

Read [references/acceptance-contract.md](references/acceptance-contract.md) before browser work. It defines the current route/state evidence expected for this project.

For requests about beauty, taste, composition, atmosphere, originality, visual realism, or whether the site feels AI-generated, also read [references/visual-direction.md](references/visual-direction.md) and [references/aesthetic-rubric.md](references/aesthetic-rubric.md). For Mio-specific identity, read `docs/current/MIO_CHARACTER.md`; do not restate or override her canonical invariants in this skill.

When the claim concerns how real students perceive the site, whether it feels childish, trustworthy, memorable, or worth returning to, read [references/student-perception-test.md](references/student-perception-test.md). Do not substitute an AI aesthetic score for student evidence.

## Browser contract

1. Use the Browser plugin first when available and keep one persistent session.
2. Capture the current state before editing. When a reference exists, place reference and rendered screenshots in one comparison image before judging differences.
3. Validate at 1440x1000 and 390x844. Add 360x800 when navigation, dense formulas, or long labels changed.
4. Before every screenshot, wait for `document.fonts.ready`, all visible images, settled layout, and the intended interactive state. Emulate reduced motion when animation is not under review.
5. Inspect both pixels and structure: screenshot, DOM/ARIA, console warnings/errors, failed requests, focus behavior, and measured geometry.
6. Change one coherent surface at a time. Reload the same page and repeat the same evidence after each edit.
7. Do not update screenshot baselines merely to make a failure green. Review the diff visually first.

Technical checks are supporting evidence, not an aesthetic verdict. A page can pass every automated check and still be generic, emotionally flat, compositionally awkward, or visually unbelievable.

## Project checks

Run the narrowest relevant checks from `apps/web`:

- `npm run check`
- `npm run test:visual -- --project=desktop --project=mobile-390`
- `npm run test:a11y -- --project=desktop --project=mobile-390`
- `npm run test:physics` when formulas, tasks, graphs, diagrams, or learning content changed

Pixel baselines are opt-in. On PowerShell, set `$env:VISUAL_SNAPSHOTS='1'` for the approved baseline comparison run, then remove the variable. Never regenerate baselines without visually reviewing the before/after pair.

Use production performance measurements for performance claims. Do not treat warm Next.js development timings as production evidence.

## Visual decisions

- Reuse existing tokens/components when they fit the current contract; do not preserve stale vocabulary just because it exists.
- Prefer an open composition, a scene, a note, or one real interactive surface over repeated generic cards.
- Keep supporting prose short and readable; the interface must not narrate its own pedagogy or implementation process.
- For finished character/scene art, use authored painted assets, carefully reviewed generated raster art, or appropriate artist tools. Do not substitute generic geometric placeholders for visual art.
- Precise formulas, graphs, vectors, instrument marks and explanatory diagrams may and often should remain deterministic SVG/DOM/KaTeX when accuracy requires it.
- Verify image crop and subject placement at each viewport. A technically loaded image can still be compositionally wrong.
- Keep KaTeX fonts and metrics intact. Never judge formula correctness from appearance alone; pair visual checks with physics tests.
- Motion must communicate state, remain smooth, and have a reduced-motion alternative.
- Preserve user data, quiz persistence, and unrelated worktree changes.

## Agent use

When the user authorizes parallel work, separate responsibilities:

- one implementation owner edits the UI;
- one fresh-context reviewer inspects screenshots and interactions without editing the same files;
- one content reviewer checks physics and Belarusian school terminology when content changed.

Do not let multiple agents concurrently redesign the same surface. Return concrete findings and image evidence to the implementation owner.

## Completion bar

Frontend work is complete only when the target interaction works, the required viewports pass, visible images are loaded and well cropped, console output is clean, keyboard focus is visible, no horizontal overflow exists, and the final screenshots have been inspected rather than merely generated.
