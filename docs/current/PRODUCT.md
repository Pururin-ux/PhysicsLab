# PhysicsLab Web product

Status: `CANON`.

Scope: `apps/web` only.

## Product destinations

The visible top-level destinations are defined in
`apps/web/lib/product-routes.ts`:

| Destination | Current URL | Purpose |
| --- | --- | --- |
| Главная | `/` | start or resume from the learner's current state |
| Учиться | `/topics` | choose a topic, open a lesson, or practise a skill |
| ЦТ/ЦЭ | `/practice/exam-demo` | run a diagnostic over currently available material |
| Прогресс | `/profile` | view practice evidence, return to errors, and manage data |

Formulas and the task catalog are learning tools. Mistakes belong to progress.

## Current content boundary

- Active topics: kinematics, dynamics, electrodynamics, thermodynamics, optics.
- Atomic and quantum material is listed as upcoming and has no active task
  bank.
- The exam flow is a diagnostic over available material. It is not a complete
  exam variant.

## Data boundary

The app has no accounts or server-side learner profile. Progress and active
practice state are stored in the browser; export and restore are available in
the profile.
