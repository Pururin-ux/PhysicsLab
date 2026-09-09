# PhysicsLab Web — start here

Status: operational index. Scope: `apps/web`.

This file is a map of the current repository state, not a new source of product
requirements. When details matter, the linked `CANON` documents and decisions
win.

## Current product in one minute

PhysicsLab Web is a connected learning platform for Belarusian school students,
not only a ЦТ/ЦЭ trainer. The product combines textbook explanations,
investigations/experiments, task practice, tests/diagnostics, error review,
progress evidence and exam preparation.

The approved web companion is **Mio**. Her character and visual invariants live
in `MIO_CHARACTER.md`. The first implemented authored Mio investigation is
`/practice/average-speed-lesson`. Mio is not a free-form AI tutor and does not
intervene inside the exam flow.

Current implementation is intentionally partial: five active broad topics, a
nine-chapter illustrated textbook for selected grade 7/9 material, deterministic
practice families, a diagnostic over available material, browser persistence,
progress export/restore, lesson drafts and a personal notebook. Do not present
this as complete Belarusian curriculum or complete ЦТ/ЦЭ coverage.

## Read these, in this order

- `PRODUCT.md` — what the web product is and what is currently implemented.
- `RELEASE_GOAL.md` — what counts as the active completion target.
- `LEARNING_MODEL.md` — current learning behaviour and boundaries.
- `DESIGN_DIRECTION.md` — decision rules, not a visual moodboard.
- `MIO_CHARACTER.md` — current approved companion identity and behaviour.
- `ARCHITECTURE.md` — runtime and code ownership.
- `QUALITY.md` — verification contract.
- `ROADMAP.md` — unresolved questions only; it is not a backlog.
- `../decisions/` — durable `CANON` decisions.

## Repository zones that often confuse agents

| Zone | Meaning | Rule |
| --- | --- | --- |
| `apps/web` | Current web product | Work here for PhysicsLab Web |
| `docs/current` | Current web requirements | Canonical after explicit user instructions |
| `docs/decisions` | Durable decisions | `CANON` unless superseded explicitly |
| `docs/archive`, `legacy` | Historical evidence | Never restore by default |
| `apps/game` | Separate Godot product | Use only for game work |
| `docs/game-preproduction` | Game context | Never import into web automatically |
| `PhysicsChannelKit`, `PhysicsChannelOutput` | Separate content/Telegram workflow | Not web product direction |
| `.design-sync`, `.ds-*`, Vinext, `.vinext` | Optional tooling/adapter state | Not architecture or design authority |
| `.agents/skills/*` | Review/implementation helpers | Must defer to current docs |
| `Новая папка/` | Unclassified old residue | Ignore as requirements; verify before cleanup |

## Known legacy/debt inside the current web tree

- `apps/web/components/coach/Nova*`, `CoachAvatar`, `NovaStage`, `NOVA.md` and
  `apps/web/public/mascot*` are legacy-named character work. The product identity
  is Mio. Do not add new Nova behaviour or infer a dual-character strategy from
  these files. Before deletion or migration, check active imports and tests.
- Old production art and visual snapshots can be useful regression evidence but
  are not product identity by themselves.
- Some primitive-based educational models remain implementation debt: current
  product direction requires replacing generic placeholder geometry with
  authored/appropriate visual material when a scoped redesign reaches that
  surface, while keeping physical diagrams precise and testable.

## Latest durable web changes

Decision 0004 (2026-09-08) made lesson drafts persistent, included them in data
backup/reset, and required independent transfer problems to use their own
values, attempts and feedback. Saving a lesson is not mastery evidence.

## Protocol for a new agent

1. Translate the user request into the smallest affected product surface.
2. Read this index plus only the relevant current documents/decisions.
3. Inspect the actual rendered route/state before a visible change.
4. Label findings as observation, inference/hypothesis, or proposed change.
5. Do not universalize one page pattern or resurrect archived direction.
6. Preserve physics correctness, data persistence and unrelated work.
7. After visible changes, inspect desktop/mobile and light/dark plus the affected
   interaction; passing tests alone is not visual acceptance.
8. Update current docs/decisions only when the durable contract actually changes.
