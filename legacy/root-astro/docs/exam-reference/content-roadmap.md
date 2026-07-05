# Content Roadmap From Exam Reference Audit

Priority is based on:

- exam relevance in the analyzed РТ source and ЦЭ/ЦТ visual sample;
- official section weight in RИКЗ 2026 specification;
- educational value for PhysicsLab;
- implementation feasibility in the current V3 generator/UI.

## Priority 1: ближайшие 1-2 спринта

| Topic / template | Why important | Frequency estimate | Implementation difficulty | Needs graph renderer | Needs diagram renderer | Generator template | Recommended priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `PhysicsGraph` v1: x(t), v(t), p(V), V(T), t(τ) | Graph reading appears in mechanics and thermodynamics; current renderer is kinematics-only. | high | medium | yes | no | enables many | P1-foundation |
| `ideal-gas-state` | РТ В9 and ЦЭ sample В9; official thermodynamics weight is 7/30. | high | low | no | no | yes | P1 |
| `pv-graph-work-heat` | РТ В10 and ЦЭ sample В10/В12; high educational value. | high | medium | yes | no | yes | P1 |
| `impulse-force-time` | РТ В2; simple numeric template without renderer dependency. | medium | low | no | no | yes | P1 |
| `charge-sharing` | РТ В13 and ЦЭ sample В13; good electrodynamics entry point. | medium-high | low | no | optional | yes | P1 |
| `density-volume-ratio` | РТ В3 and ЦЭ sample В1; common unit/geometry trap. | medium | low | no | optional | yes | P1 |
| `phase-change-heat` | РТ В11 and ЦЭ sample В11; reinforces multi-stage reasoning. | medium-high | low-medium | optional for t(τ) | no | yes | P1 |
| Answer-shape expansion | Real exam uses single, multiple, numeric, matching; current generator is numeric-choice oriented. | high | medium | no | no | foundation | P1 |

## Priority 2: after graph / diagram foundation

| Topic / template | Why important | Frequency estimate | Implementation difficulty | Needs graph renderer | Needs diagram renderer | Generator template | Recommended priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `relative-velocity-vectors` | РТ А2 and ЦЭ sample В2; core mechanics misconception. | medium-high | medium | no | yes | yes | P2 |
| `newton-force-angle-friction` | РТ В5; current dynamics templates are too simple. | medium-high | medium | no | yes | yes | P2 |
| `resistor-network-power` / `source-internal-resistance` | РТ А7/В15/В16 and ЦЭ sample A7/B16; electrodynamics has 9/30 tasks. | high | high | no | yes, circuit | yes | P2 |
| `magnetic-field-wire` | РТ А8 and ЦЭ sample А8. | medium | medium | no | yes | yes | P2 |
| `lorentz-circular-motion` | РТ В17; good formula+unit task. | medium | low-medium | no | optional | yes | P2 |
| `spring-pendulum-scaling` | РТ В7 and ЦЭ sample В7. | medium | low | no | no | yes | P2 |
| `pulley-system-force` | ЦЭ sample В6; important mechanics diagram skill. | medium | medium | no | yes | yes | P2 |
| `engine-efficiency` | РТ В12; multi-unit realistic context. | medium | low-medium | no | no | yes | P2 |
| `capacitor-energy` | РТ В14. | medium | low-medium | no | optional | yes | P2 |
| `induction-flux-charge` | ЦЭ sample В18. | medium | medium | no | optional | yes | P2 |

## Priority 3: later breadth and specialized visuals

| Topic / template | Why important | Frequency estimate | Implementation difficulty | Needs graph renderer | Needs diagram renderer | Generator template | Recommended priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `thin-lens-moving-source` | РТ В20; optics is lower frequency but diagram-heavy. | low-medium | high | no | yes, optics | yes | P3 |
| `total-internal-reflection-geometry` | ЦЭ sample В19; good but geometry-heavy. | low-medium | high | no | yes, optics | yes | P3 |
| `photoelectric-work-function` | РТ В19; quantum section is small but predictable. | low-medium | low | no | no | yes | P3 |
| `photoeffect-capacitor-charge` | ЦЭ sample В20; multi-step quantum+electricity. | low | medium | no | optional | yes | P3 |
| `alpha-decay-recognition` | РТ А10; simple conceptual breadth. | low | low | no | no | yes | P3 |
| `isotope-neutron-count` | ЦЭ sample А10. | low | low | no | no | yes | P3 |
| `phenomenon-device-matching` | ЦЭ sample А9; covers matching format. | unknown | medium | no | no | yes | P3 |

## Practical Sprint Sequence

Sprint A: Graph foundation

- Implement semantic `PhysicsGraph` custom SVG.
- Support `xt`, `vt`, `pv`, `vT`, `tTau`.
- Add renderer tests for axis labels, ticks, state labels, shaded area.
- Do not add many new templates until graph rendering is stable.

Sprint B: Thermodynamics + simple electrodynamics

- Add `ideal-gas-state`.
- Add `phase-change-heat`.
- Add `pv-graph-work-heat`.
- Add `charge-sharing`.
- Extend validator to support non-kinematic graph types.

Sprint C: Answer formats and diagrams

- Split numeric sign semantics from exam answer shape.
- Add multiple-choice and matching support.
- Add `VectorDiagram` primitives.
- Add `relative-velocity-vectors` and 2D force-resultant tasks.

Sprint D: Circuits

- Add fixed-family `CircuitDiagram`.
- Add source/internal resistance and resistor network templates.
- Add common ideal meter/switch traps.

Sprint E: Breadth

- Add optics and quantum templates after graph/circuit/vector basics.

## What Not To Do Next

- Do not expand only mechanics while ignoring electrodynamics: official structure gives electrodynamics 9/30.
- Do not hand-code SVG per task. Build semantic renderers.
- Do not generate text-only versions of diagram-heavy exam tasks and call them equivalent.
- Do not use LLM to verify arithmetic; keep solvers deterministic.
- Do not use the scanned 2025 collection as full statistical evidence until OCR is available.
