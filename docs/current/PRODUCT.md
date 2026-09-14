# PhysicsLab Web product

Status: `CANON`.

Scope: `apps/web` only.

## Product mission

PhysicsLab is a connected learning platform for Belarusian school students:
textbook explanations, experiments, tasks, tests, school assessment preparation,
and ЦЭ/ЦТ preparation. Practice is one mode, not the whole product.
Current phase: **INTERNAL ALPHA** — connect the existing strong parts into a
coherent learning platform. Motion journey is a **PROVISIONAL reference slice**,
not a public release candidate or a mandatory template for other topics.
Publication is not the next product bottleneck. The current phase and preserved
long-term objective are in `RELEASE_GOAL.md`.

Mio is the approved original anime companion. Her first implemented investigation
is `/practice/average-speed-lesson`: test a hypothesis, vary travel times,
explain the result, solve a new problem, and save a personal explanation.
She can be hidden. This authored interaction is not a generative AI tutor.

The personal notebook at `/profile/notebook` collects explicitly saved lesson
explanations, supports text search, and links back to their lessons. It reads the
same browser drafts included in progress backups; it does not grade personal text.

The textbook at `/learn` currently connects thirty-six chapters for
selected grade 7, grade 8 and grade 9 topics. Grade 8 now connects internal
energy and the three heat-transfer mechanisms to heat amount and melting, then electric current
and reflection of light; grade 9 includes the second law of Newton. Chapters
include interactive models, worked examples and persistent self-checks; existing
staged lessons keep their own drafts. The contents can filter unfinished or
incorrect chapter checks. This is partial coverage, not a complete school textbook.
The progress page also lists completed investigations. An investigation appears
only after the learner reaches its final stage and saves a non-empty conclusion;
an opened page, an intermediate draft, or a personal note is not completion.
The collection is a record of work, not a grade or a claim of topic mastery.
The current content boundary below must not be interpreted as release completeness.

## Product destinations

The visible top-level destinations are defined in
`apps/web/lib/product-routes.ts`:

| Destination | Current URL | Purpose |
| --- | --- | --- |
| Главная | `/` | start or resume from the learner's current state |
| Учиться | `/topics` | find a question and directly open its available explanation, experiment or practice |
| ЦТ/ЦЭ | `/practice/exam-demo` | run a diagnostic over currently available material |
| Прогресс | `/profile` | view practice evidence, return to errors, and manage data |

Formulas and the task catalog are learning tools. Mistakes belong to progress.

## Current content boundary

- Active topics: kinematics, dynamics, electrodynamics, thermodynamics, optics.
- Atomic and quantum material is listed as upcoming and has no active task
  bank.
- The exam flow is a diagnostic over available material. It is not a complete
  exam variant.
- `/exam/program` is checked against the official RIKC 2026 Physics CE/CT
  specification. It shows the official six-section, 30-task distribution,
  separates available PhysicsLab task families from explicit gaps, and links to
  the specification rather than calling it the examination programme. Density
  remains in the product's matter/thermodynamics topic, but appears under
  Mechanics in exam coverage as required by the specification.

## Data boundary

The app has no accounts or server-side learner profile. Progress and active
practice state are stored in the browser; export and restore are available in
the profile.

## Student interface rules (Sasha, 2026-09-08)

- Student pages speak to the student about the task. Audit terms, implementation
  notes, verification reports and teaching-method commentary belong in project
  documentation. Necessary physical assumptions remain available in plain language.
- `/topics` connects available material by question, with search, established
  grade labels, prerequisites and meaningful links between concepts. It does not
  impose a sequence or require a topic landing page before opening a resource.
  `/learn` is the reading contents: search, class filters, self-check states and
  compact chapter rows grouped by the established school unit, with expandable
  prerequisites and related material. A row leads with the learner's question;
  the internal chapter title remains searchable but is not repeated beside the
  same question. Do not restore introductory marketing cards or progress
  disclaimers above navigation.
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
