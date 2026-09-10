# PhysicsLab repository guide

## Scope

- `apps/web` is the PhysicsLab web learning platform. Its canonical runtime is Next.js.
- `apps/game` is a separate Godot product. Its active context is
  `docs/game-preproduction/CONTEXT.md`.
- `PhysicsChannelKit` and `PhysicsChannelOutput` belong to a separate physics
  content/Telegram production workflow. They are not web runtime or web product
  requirements.
- Do not transfer product, design, learning, technical, character, or quality
  requirements between these scopes without an explicit user request.

## Start here

For any `apps/web` task, read `docs/current/START_HERE.md` first, then the
relevant current documents and the affected route/code. Do not reconstruct the
product direction from repository-wide grep results, old asset names, archived
screenshots, or whichever prototype has the most files.

## Sources of truth

For `apps/web`, use this order when sources disagree:

1. an explicit user instruction;
2. `docs/current/`;
3. a `CANON` decision in `docs/decisions/`;
4. current code and CI configuration for observable behaviour;
5. `docs/archive/` and `legacy/` only as historical evidence.

`docs/current/*` and `CANON` decisions must not contradict each other. A
conflict between them is a repository-state error: report it explicitly rather
than choosing one source silently.

Archived documents are not current requirements. Do not restore old UI,
routes, copy, characters, tests, or product assumptions merely because they
appear there.

Current approved web companion identity is defined in
`docs/current/MIO_CHARACTER.md`. Legacy `Nova*` components and `public/mascot*`
assets do not override it. Before deleting legacy-named code, verify active
imports; before adding new character work, follow the current Mio contract.

Project-local skills under `.agents/` are implementation/review aids. They must
follow this hierarchy and may not independently redefine product direction.

## Working conventions

- Use npm. CI installs `package-lock.json` at the repository root and in
  `apps/web` separately.
- The standard web runtime is `npm run dev`, `npm run build`, and `npm run
  preview` from the root. Do not run a Next build while its dev server shares
  the same `.next` directory.
- Sites/Vinext is an optional deployment or preview adapter, not a product
  architecture source. Design-sync is optional development tooling, not a
  design-direction source.
- Preserve visual baselines until a visible regression has been classified.
  Do not regenerate them solely to make a test pass.
- Rendered inspection is evidence, not a mandatory ritual. Inspect the affected
  rendered route when the task materially depends on visual appearance,
  responsive layout, browser-only behaviour, or a critical interaction, or
  when the user explicitly requests visual verification.
- For routine copy, content, design-token, CSS, or localized code changes, do
  not launch a browser merely to satisfy process. Use code-level verification
  unless the result cannot be judged reliably without rendering.
- Batch coherent UI changes and perform one targeted rendered review at the end
  rather than repeating browser capture after every edit.
- Keep browser-observed facts separate from code inference.

## Verification budget

Verification budget is part of task scope.

- Prefer no browser run when code-level evidence is sufficient.
- Prefer one targeted browser run when rendering is genuinely relevant.
- Prefer a broad visual audit only when explicitly requested or when the task
  itself is a substantial visual/interaction review.
- Do not broaden verification merely to increase confidence. An additional
  check should have an identified failure mode that it can realistically
  detect.
- Use the narrowest relevant automated check. Do not run a full test suite,
  visual suite, E2E suite, screenshots, or production build by default after a
  localized change.
- When physics, mathematics, generated tasks, graphs, or diagrams change, use
  the narrowest relevant correctness check and expand only if the change spans
  multiple areas.
- Do not repeat a successful check unless related code changed after it.

## Change discipline

- Do not expand task scope silently.
- Separate observation, hypothesis, and proposed change.
- Do not refactor unrelated code while implementing a feature.
- Do not split a module because of line count alone; identify independent
  reasons to change first.
- For product or design changes, state the concrete user problem before
  proposing a solution.
- When exploration is requested, alternatives must differ structurally, not
  only in styling or copy.
- Do not turn one successful lesson, page, interaction, or illustration into a
  universal template without evidence.
- When a `CANON` decision changes, update the relevant current document or
  decision record.
