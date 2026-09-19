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

## PROVISIONAL interactive scene layer

Interactive lesson scenes remain part of the current Next.js application. DOM
owns text, mathematics, controls, focus and accessibility. SVG is preferred for
small vectors, plots, scales and annotations; Canvas or WebGL is introduced only
when a measured scene requirement cannot be met efficiently with DOM and SVG.
The physical model must stay testable independently from its renderer.

Scene code and assets load with the lesson that uses them. Avoid a shared heavy
runtime, continuous background animation and duplicate layout systems. C++,
WASM, CanvasKit or a general-purpose scene graph require a demonstrated visual
or computational need, a bundle budget and evidence that the same abstraction
serves more than one scene. Reduced-motion behaviour, responsive composition
and stable keyboard interaction are part of the scene contract.

## Separate product boundary

`apps/game` uses Godot and follows `docs/game-preproduction/`. It is not an
alternate implementation of the web trainer.

## Optional tooling

`.design-sync/`, `.ds-sync/`, and `apps/web/.ds-*` package selected components
for design-sync previews. They are optional development tooling and must not
set product or design requirements.
