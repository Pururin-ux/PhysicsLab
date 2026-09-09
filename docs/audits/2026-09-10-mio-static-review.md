# Mio implementation review — 2026-09-10

Status: audit evidence and proposed follow-up, NOT CANON or a replacement backlog.
Inspected baseline: `92d72e0aeec87c5f8ce63f7adc47b8d35423b1c7` on `snapshot/astra-2026-09-09`.
Changes from this review are isolated on `audit/mio-2026-09-10`.

## Evidence boundary

Repository files were read through the GitHub connector. A full clone, dependency installation, application server and fresh browser screenshots could not be obtained in this sandbox because external downloads failed. No full TypeScript, unit, E2E, accessibility, build or performance suite was run. Historical artwork/screenshot inspection must not be promoted to current-commit runtime evidence. Existing agent checkpoint reports are not independent verification.

Separately executed under Node 22.16.0: npm's installed platform validator with the platform metadata below, and arithmetic/geometry reproductions transcribed from the baseline. These are isolated checks, not application tests.

## Confirmed findings

### P1 — Required Windows-only development dependency

`apps/web/package.json` and the root package entry of `apps/web/package-lock.json` directly require `@rolldown/binding-win32-x64-msvc@1.0.1` in devDependencies. Its lock entry has `os: [win32]`, `cpu: [x64]` and no `optional: true`. CI uses Ubuntu and ordinary `npm ci --prefix apps/web`.

An isolated call to npm-install-checks/checkPlatform rejects these constraints for linux/x64 with `EBADPLATFORM`; the win32/x64 control passes. This is a reproducible platform incompatibility, not a claim that the entire CI pipeline was run here.

Proposed repair: remove the direct platform binding requirement, let its parent tool resolve platform-specific optional bindings, regenerate package-lock with npm, and validate a clean Linux install. Do not change only package.json or bypass the check using --force. This repair was NOT applied in this audit because the lockfile could not be regenerated and tested here.

### P2 — Remaining old identity inside the review rubric

`.agents/skills/physicslab-visual-verdict/references/aesthetic-rubric.md` still asked reviewers whether Nova and cats act as recurring characters. This was missed by the previous documentation pass. The audit branch replaces that assumption with Mio/current approved characters, removes the dark-only example, and explicitly separates simulated student reactions from actual participant evidence. Screenshot provenance is now requested.

### P2 — Finished art and acting are not the same as current interaction scaffolding

`AverageSpeedLab.tsx` chooses static portrait assets, including skeptical-v2 and other v1 states. `AverageSpeedLab.module.css` animates the whole raster on arrival/celebration. It does not implement facial or layered character acting. Mobile portrait width is 88 CSS pixels. Perceptual distinguishability at that size needs a real render, not labels in a state enum.

`TextbookScene.tsx` combines an authored contextual illustration with a separate interactive model. Its current `InertiaModel.tsx` uses SVG rectangles, circles and an ellipse, not a painted cart/puck asset. `WalkModel` represents Mio by a labelled circle. These remain unfinished artwork integration relative to PRODUCT/MIO_CHARACTER, not grounds to delete accurate SVG scales, vectors or graphs.

### P2 — Preserve the distinction between implemented and validated

The average-speed lesson implements prediction, variable conditions, a causal explanation, a separate transfer problem and draft saving. These are real code paths. They do not establish educational effectiveness with pupils or release completeness. Do not mark all of them validated merely by changing a status sentence in documentation.

### P3 — Generated local process state committed

`apps/web/.vinext/dev/lock.json` contains a local PID, port, start time and Windows working directory. Removed on the audit branch. Optional adapter configuration and font files were not removed; no claim was made that the adapter was fully tested.

## Arithmetic and geometry checked separately

- Average-speed slider: all integer slow-time values 1..9, with speeds 2 and 8 m/s over 10 s. The average stays between both speeds; their arithmetic mean applies only for equal times.
- Independent transfer: (3*6 + 6*3)/(6+3) = 4 m/s.
- Inertia: x_cart=4t-t^2, x_puck=4t, t=0,1,2. Relative displacement is t^2. Both cameras preserve it. With the actual base offsets and ellipse radius, the puck remains within the drawn platform at every displayed moment. No off-platform defect is established in THIS SVG implementation.
- Measurement: the quadratic Bezier meniscus bottoms are y=164 in the main view and y=168 in the magnifier. The corresponding scales both encode 32 ml: (260-164)/3 = (360-168)/6 = 32. The control point is not the curve's bottom. Browser readability is not proven by this arithmetic.

## Things deliberately not deleted or silently corrected

- Nova-named modules/assets: names alone do not prove dead code. A complete import/asset reachability pass and build/browser checks remain required.
- `Новая папка/`: three small HTML/CSS/JS prototype files, 15,775 bytes in total; not a large dependency cache. It is a classification/archive question, not an urgent storage cleanup.
- `apps/game`, PhysicsChannelOutput and PhysicsChannelKit: separate work, not automatically garbage.
- `.vinext/fonts` and optional adapter code: generated-looking contents alone do not establish all consumers.
- The textbook object labelled grade 9 points to a URL with `8kl` in its filename. The PDF contents were not verified, so this is an unresolved source-label check, not proof the book is wrong and not permission to invent a replacement URL.
- Global Codex settings and local skills outside the repository were not inspected.

## Next verification order

1. Repair and verify the clean cross-platform install.
2. Run the existing type/unit/physics checks and isolate build output from dev.
3. Capture /, /learn, /learn/reading-scales, /learn/inertia and /practice/average-speed-lesson on desktop/mobile, light/dark, and with reduced motion where appropriate.
4. In the Mio lesson exercise wrong answer, corrected answer, changed time, hidden character, refresh restoration, save failure, backup/restore and notebook return.
5. Verify current portrait alpha/crop and emotional readability, then improve one authored interaction without changing the approved character identity.
6. Remove legacy code/assets only after determining reachability. Do not rewrite all lessons into one template merely to reduce file count.
