# Web architecture

Status: `CANON`.

Scope: `apps/web` only.

## Runtime and packages

- Canonical runtime: Next.js, started and built through root npm scripts.
- Reproducible development/CI environment: Node 22.23.2 (`.nvmrc`) and
  npm 11.11.0 (root `package.json#packageManager`). CI installs that npm pin
  after setting up Node; package engines document the compatible Node 22 line.
- Install dependencies with `npm ci` at the repository root and with
  `npm ci --prefix apps/web` for the application.
- CI is defined in `.github/workflows/ci.yml` and uses those two lockfiles.
- Vite owns Rolldown in the optional adapter toolchain. Rolldown selects native
  bindings through optional dependencies; no OS-specific binding is a direct
  application dependency.
- `apps/web/vite.config.ts`, Vinext, Cloudflare, and `.openai/hosting.json`
  are an optional secondary deployment or preview adapter. They do not define
  routes, product behaviour, or the canonical runtime.

## Product structure

- `app/` contains route composition.
- `components/` contains reusable and route-level UI.
- `lib/product-routes.ts` defines visible destination ownership.
- `lib/learning/` contains learning sequencing, coverage, and recommendations.
- `lib/server/task-generator/` generates deterministic practice tasks.
- `lib/stores/` owns browser persistence and migrations.

## Separate product boundary

`apps/game` uses Godot and follows `docs/game-preproduction/`. It is not an
alternate implementation of the web trainer.

## Optional tooling

`.design-sync/`, `.ds-sync/`, and `apps/web/.ds-*` package selected components
for design-sync previews. They are optional development tooling and must not
set product or design requirements.
