# PhysicsLab Web product

Status: `CANON`.

Scope: `apps/web` only.

## Product mission

PhysicsLab is a connected learning platform for Belarusian school students:
textbook explanations, experiments, tasks, tests, school assessment preparation,
and ЦЭ/ЦТ preparation. Practice is one mode, not the whole product.
The release objective and acceptance requirements are in `RELEASE_GOAL.md`.

Mio is the approved original anime companion. Her first implemented investigation
is `/practice/average-speed-lesson`: test a hypothesis, vary travel times,
explain the result, solve a new problem, and save a personal explanation.
She can be hidden. This authored interaction is not a generative AI tutor.

The personal notebook at `/profile/notebook` collects explicitly saved lesson
explanations, supports text search, and links back to their lessons. It reads the
same browser drafts included in progress backups; it does not grade personal text.

The textbook at `/learn` currently contains nine connected illustrated chapters
for selected grade 7 and grade 9 topics. Chapters include interactive models,
worked examples and persistent self-checks. The contents can filter unfinished
or incorrect checks. This is partial coverage, not a complete school textbook.
A collection of completed investigations remains planned.
The current content boundary below must not be interpreted as release completeness.

## Product destinations

The visible top-level destinations are defined in
`apps/web/lib/product-routes.ts`:

| Destination | Current URL | Purpose |
| --- | --- | --- |
| Главная | `/` | start or resume from the learner's current state |
| Учиться | `/topics` | choose textbook reading, a Mio investigation, tasks, or a specific lesson |
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

## Student interface rules (Sasha, 2026-09-08)

- Student pages speak to the student about the task. Audit terms, implementation
  notes, verification reports and teaching-method commentary belong in project
  documentation. Necessary physical assumptions remain available in plain language.
- `/topics` is navigation: textbook, tasks, experiments and formulas. `/learn`
  provides search, class filters and compact topic rows. Do not restore introductory
  marketing cards or progress disclaimers above navigation.
- Home uses Mio with transparency and semantic theme colours. There is no special
  dark photographic header in light mode; the header must not cover content.
- Contextual lesson artwork belongs to the article, without another enclosing
  card around illustration, description and experiment. Avoid repeated decorative
  labels and redundant prose before the actual activity.
- Instrument readings must have an unambiguous pointer or reference line and
  readable labels at mobile size. Visual magnification must preserve the value.
- Choose verification using `QUALITY.md` (updated by Sasha, 2026-09-12).
  Group related UI changes and inspect the affected render when the task or a
  concrete risk requires it. Desktop/mobile, light/dark and interaction states
  are selected for that risk, not repeated after every visible edit. Passing
  tests alone never proves visual acceptance.

- Sasha's art direction: do not construct educational visualizations from geometric
  placeholder primitives. Use authored painted assets, carefully reviewed generated
  artwork or appropriate artist tools. Code may position and animate the artwork and
  render readable values; it must not substitute generic shapes for the visual art.
  Existing primitive-based models require replacement, not acceptance as final art.
