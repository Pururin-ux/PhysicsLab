# Web quality contract

Status: `CANON`.

Scope: `apps/web` and its CI.

## Commands

| Command | Current role |
| --- | --- |
| `npm run check` | TypeScript only |
| `npm run test:physics` | physics, diagram, and generator contracts |
| `npm test` | unit tests |
| `npm run test:e2e` | browser flows against dev runtime |
| `npm run test:a11y` | axe browser checks |
| `npm run test:visual` | visual layout and optional snapshot checks |
| `npm run build` + `npm run assert:routes` + `npm run smoke` | production build and smoke path |
| `npm run verify` | optional combined TypeScript and physics checks when both risks are in scope |
| `npm run verify:full` | PR/release-level integration verification |

GitHub CI runs these layers in separate jobs for pushes and pull requests to
`main`.

## Rules

Verification budget is part of task scope (Sasha, 2026-09-12). This command
catalog is not a required sequence for each edit.

- `npm run check` is not a full verification command.
- Use the smallest relevant check for a scoped change. The full CI sequence is
  for integration, pull requests, and release confidence.
- Tie each additional check to a concrete failure mode. Routine text, style,
  or localized code changes do not automatically require a browser, screenshots,
  visual/a11y/E2E suites, build, full unit suite, or `npm run verify`.
- Rendered inspection is evidence, not a mandatory ritual. Use it for an explicit
  visual review or when appearance, responsive layout, browser-only behaviour,
  or a critical interaction cannot be judged reliably from code.
- Group coherent UI edits, then perform one targeted rendered check if needed.
  Choose viewport, theme, state and evidence types for the identified risk;
  do not repeat a successful check unless related code or conditions changed.
- Documentation-only changes normally need content and diff checks, not
  application tests. Report what was actually verified and its limits.
- Use `npm run verify:full` for PR-ready integration confidence, not after
  every small local edit.
- Classify a visual or end-to-end failure before changing locators, contracts,
  or screenshot baselines.
- Build and dev must not share `.next` concurrently.
