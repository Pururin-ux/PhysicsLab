# Task Family Schema

Status: draft for content expansion.

This document defines the unit of growth for PhysicsLab tasks. A task family is not a single handwritten problem. It is a small deterministic generator with a solver, distractors, metadata, help mapping, and tests.

## Why This Exists

PhysicsLab V3 currently has a working generated-task core, but the content surface is still a polished slice. Adding isolated tasks would make the product larger without making it reliable. New content should enter through task families so every task can be checked, explained, mapped to help, and extended safely.

## Required Fields

| Field | Meaning | Required |
| --- | --- | --- |
| `id` | Stable generator/template id, kebab-case. | yes |
| `topic` | Product topic: kinematics, dynamics, electrodynamics, thermodynamics, optics, atomic/quantum. | yes |
| `subtopic` | Narrow school skill, e.g. `average speed with segments`. | yes |
| `sourceInspiration` | Exam/source pattern that justifies this family. | yes |
| `answerKind` | UI/exam answer shape: `single-choice`, `multiple-choice`, `numeric`, `matching`; keep separate from numeric sign semantics. | yes |
| `numericSemantics` | Current generator semantics: `positive`, `magnitude`, `signed`; only for numeric generated values. | when numeric |
| `parameterRanges` | Bounded ranges with units and step. | yes |
| `invariants` | Conditions that must always hold for generated variants. | yes |
| `statementTemplates` | 2-4 wording variants. | yes |
| `solverFormula` | Deterministic formula and unit conversions. | yes |
| `distractorStrategy` | Named mistakes, not random wrong numbers. | yes |
| `explanationSteps` | Short solution sequence shown after answer. | yes |
| `commonMistakes` | Misconception ids or labels. | yes |
| `helpSectionId` | Targeted help section id. | yes |
| `formulaReferences` | Formula reference ids required by `/formulas`. | when applicable |
| `visualSpec` | `PhysicsGraph`, `VectorDiagram`, `CircuitDiagram`, or planned renderer. | when visual |
| `validationTests` | Unit/e2e expectations required before release. | yes |

## Minimum Contract

Every task family must satisfy:

- The correct answer is produced only by deterministic code.
- All answer options are unique after formatting.
- Distractors correspond to named student mistakes.
- The generated explanation contains the core formula or reasoning step.
- `taskLearningMetadataByTemplateId[id]` exists.
- `topicHelpSections[topic]` contains `helpSectionId`.
- `skillMetadata[id]` exists if the family is exposed in topic progress.
- Formula reference exists when the family depends on a reusable formula.
- Tests cover at least one normal case and one trap case.

## Recommended Template

```md
## `family-id`

Topic:
Subtopic:
Exam pattern:
Priority:

Answer kind:
Numeric semantics:

Parameter ranges:
- `x`: min/max/step/unit

Invariants:
- ...

Statement templates:
- ...

Solver:
- Formula:
- Unit conversions:
- Rounding/formatting:

Distractors:
- `mistake-id`: description and computation

Explanation:
1. ...
2. ...
3. ...

Targeted help:
- `helpSectionId`:
- compact card title:
- formula:
- mistake:

Formula reference:
- ids:

Tests:
- generator produces valid unique options
- solver value matches known fixture
- metadata/help mapping exists
- targeted help opens correct section
- renderer assertions, if visual
```

## Example: `units-speed-compare`

Topic: kinematics.
Subtopic: unit conversion traps.
Exam pattern: RT A1 speed comparison with m/s, km/h, m/min, km/s, cm/h.
Priority: P0.

Answer kind: single-choice.
Numeric semantics: positive.

Parameter ranges:
- Speeds are generated in mixed units but normalize to m/s.
- Values must avoid ties after conversion.

Invariants:
- Exactly one greatest normalized speed.
- At least three different units appear.
- No option should require advanced math beyond unit conversion.

Solver:
- Convert every option to m/s.
- Choose the greatest normalized value.

Distractors:
- `compare-raw-numbers`: chooses largest written number.
- `kmh-to-ms-inverted`: multiplies/divides by 3.6 in the wrong direction.
- `prefix-missed`: treats cm or min as base units.

Explanation:
1. Convert all speeds to m/s.
2. Compare converted values.
3. The greatest converted value gives the answer.

Targeted help:
- `helpSectionId`: `units-conversion` (new kinematics help section).
- Formula: `1 м/с = 3.6 км/ч`, `1 мин = 60 с`, `1 м = 100 см`.
- Mistake: compare units only after conversion.

Formula reference:
- Add compact unit conversion row, not a full textbook page.

Tests:
- Fixture where raw largest number is not the largest speed.
- Metadata/help exists.
- Options unique.

## Do Not Accept

- A task family without a source or exam-pattern rationale.
- A generated family whose solver is just copied from explanation text.
- Distractors that are arbitrary offsets like `answer + 1`.
- Visual exam tasks converted to text-only tasks when the visual skill is the point.
- A new topic exposed in navigation before progress, help, formulas, and tests can support it.
