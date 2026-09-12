# ADR 0001: Monorepo Direction

## Status

Accepted as the target direction. No physical folder migration is approved by this ADR.

## Context

PhysicsLab currently contains two intentional code paths:

- the root Astro app, which is the most stable reference for interactive physics labs, physics correctness, graph mapping, visual regression checks, and screenshot workflows;
- `PhysLabProt-main`, an experimental React + FastAPI prototype for a fuller edtech platform with accounts, progress, school/exam tracks, dashboard flows, mascot assets, and CT/CE preparation structure.

The repository is in a transition phase. The goal is not to delete one path or rewrite the other immediately. The goal is to define clear ownership boundaries before any migration work begins.

## Decision

PhysicsLab will use a monorepo as the target architecture.

The intended future shape is:

```text
apps/
  web/          # future React student product app
  api/          # future FastAPI backend
  astro-labs/   # current Astro interactive labs and canonical references
packages/
  physics-core/ # shared formulas, graph mapping, units, validators, tests
  content/      # content schemas, task blueprints, seed fixtures
docs/
  architecture/
  product/
  content-policy/
```

This ADR does not create that structure. It only records the direction and constraints for future migration tasks.

## Rationale

The monorepo direction is chosen because PhysicsLab needs both:

- high-confidence interactive physics labs with strict physics tests and visual parity checks;
- a full edtech platform with authentication, progress tracking, CT/CE practice, analytics, and product flows for Belarusian students.

Keeping these parts in one repository with explicit app/package boundaries reduces duplication and makes shared physics logic testable from both the Astro labs and the React product app.

## Current Boundaries

- The root Astro app remains the canonical reference for interactive physics laboratories.
- `PhysLabProt-main/frontend` is the prototype of the future `apps/web`.
- `PhysLabProt-main/backend` is the prototype of the future `apps/api`.
- Physics logic should eventually move into a future `packages/physics-core`.
- `PhysLabProt-main` remains a prototype area until a separate, explicit migration PR is approved.

## Accelerated Motion Rule

`accelerated-motion` must not be rewritten or replaced until a React version passes:

- the existing physics tests;
- graph mapping checks;
- visual parity against the Astro reference;
- reduced-motion and responsive screenshot checks.

Until then, the Astro implementation is the source of truth for behavior and learning flow.

## Tooling Rule

Lovable, v0, and similar UI generators may be used only for visual prototypes and exploration.

Codex is responsible for engineering integration, repository hygiene, scope control, tests, and preserving physics correctness. Generated UI must not be merged into production structure without an approved integration task.

## Consequences

- No app folders are moved by default.
- No code is copied between Astro and `PhysLabProt-main` without an approved migration task.
- Shared physics code should be extracted deliberately, with tests first.
- Prototype artifacts, local logs, caches, generated reports, and source corpora must not be committed as production code.
- Future work should separate product migration, content migration, physics-core extraction, and visual redesign into separate changes.
