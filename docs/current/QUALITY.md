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
| `npm run verify` | standard local verification for a completed scoped implementation |
| `npm run verify:full` | PR/release-level integration verification |

GitHub CI runs these layers in separate jobs for pushes and pull requests to
`main`.

## Rules

- `npm run check` is not a full verification command.
- Use the smallest relevant check for a scoped change. The full CI sequence is
  for integration, pull requests, and release confidence.
- Before declaring a scoped implementation complete, run `npm run verify`
  unless the change is documentation-only or the task explicitly defines a
  narrower gate.
- Use `npm run verify:full` for PR-ready integration confidence, not after
  every small local edit.
- Classify a visual or end-to-end failure before changing locators, contracts,
  or screenshot baselines.
- Build and dev must not share `.next` concurrently.
