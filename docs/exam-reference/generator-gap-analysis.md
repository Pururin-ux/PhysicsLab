# Generator Gap Analysis

Current generator templates:

- `free-fall`
- `vt-slope`
- `vt-area`
- `newton-second`
- `friction-force`
- `incline-force`
- `resultant-force`
- `weight-lift`

Reference baseline:

- Full-text РТ-2024/2025 stage III variant 1: 30 analyzable tasks.
- Visual sample ЦЭ/ЦТ 2025 variant 1: 30 visually inspected tasks.
- Official 2026 structure: mechanics 10, MKT/thermo 7, electrodynamics 9, optics/STO 2, quantum 1, nuclear 1.

## Current Template Fit

| Template | Real-task match | Fit quality | What is missing | Recommended adjustment |
| --- | --- | --- | --- | --- |
| `free-fall` | No direct match in the analyzed РТ variant; free fall is in the official mechanics scope. | Medium | Exam tasks more often combine vertical/horizontal motion, impulse, or graph interpretation. | Keep, but add variants with thrown body, time interval, and answer units in part-B numeric style. |
| `vt-slope` | Direct match: РТ В1 asks acceleration from v(t). | High | Current graph family is too narrow; exam also uses x(t), v_x(s), p(t), V(T), p(V). | Keep as priority 1. Extend graph renderer before adding many graph types. |
| `vt-area` | Not directly present in full-text РТ, but common and already in PhysicsLab kinematics ladder. | Medium | Need mixed signed area, interval selection, and distractors from graph-axis confusion. | Keep, but do not over-prioritize before relative velocity and impulse. |
| `newton-second` | Related match: РТ В5 uses `ΣF=ma` with angle and friction; ЦЭ sample В4 uses resultant force plus friction. | Medium-high | Current `F=ma` target switching is simpler than exam tasks. | Add force diagram variants and friction/angle coupling. |
| `friction-force` | Partial match: РТ В5 and ЦЭ sample В4 require friction, but not standalone `Fтр=μmg`. | Medium | Real tasks use friction inside Newton's second law. | Keep as prerequisite drill; pair with applied dynamics templates. |
| `incline-force` | No direct match in analyzed РТ/ЦЭ sample, but official scope includes inclined plane/simple mechanisms. | Medium | Exam likely combines components, friction, or work/energy. | Keep, but avoid presenting as high-frequency until more sources confirm. |
| `resultant-force` | Related match: ЦЭ sample В4 requires vector resultant with grid directions and friction. | Medium | Current same/opposite direction template misses 2D vectors. | Add 2D force grid variant. |
| `weight-lift` | No direct match in analyzed sources. Official scope includes weight, overload, weightlessness. | Low-medium | Needs elevator/accelerating support context with sign convention. | Keep as concept template, not near-term exam-frequency priority. |

## Missing Templates By Exam Value

Priority 1 missing templates:

1. `relative-velocity-vectors`
   - Evidence: РТ А2; ЦЭ sample В2.
   - Renderer need: vector grid / trajectory diagram.
   - Trap: add speeds instead of subtracting vectors; forget reference frame.

2. `impulse-force-time`
   - Evidence: РТ В2.
   - Renderer need: none.
   - Trap: use whole time from start, not interval.

3. `density-volume-ratio`
   - Evidence: РТ В3; ЦЭ sample В1.
   - Renderer need: optional shape diagram.
   - Trap: use linear scale instead of volume.

4. `ideal-gas-state`
   - Evidence: РТ В9; ЦЭ sample В9.
   - Renderer need: none for basic version.
   - Trap: Celsius in gas law; molar mass unit conversion.

5. `pv-graph-work-heat`
   - Evidence: РТ В10; ЦЭ sample В10/В12.
   - Renderer need: p(V) graph with state labels, area, arrows.
   - Trap: use area for the wrong quantity.

6. `charge-sharing`
   - Evidence: РТ В13; ЦЭ sample В13.
   - Renderer need: optional two-sphere diagram.
   - Trap: confuse final charge with charge change.

7. `circuit-ohm-source`
   - Evidence: РТ А7, В15; ЦЭ sample А7, В16.
   - Renderer need: circuit diagram.
   - Trap: ideal meter/switch misunderstanding.

Priority 2 missing templates:

- `phase-change-heat`: РТ В11; ЦЭ sample В11.
- `engine-efficiency`: РТ В12.
- `capacitor-energy`: РТ В14.
- `resistor-network-power`: РТ В16.
- `lorentz-circular-motion`: РТ В17.
- `magnetic-field-wire`: РТ А8; ЦЭ sample А8.
- `spring-pendulum-scaling`: РТ В7; ЦЭ sample В7.
- `pulley-system-force`: ЦЭ sample В6.
- `inelastic-collision-speed`: ЦЭ sample В5.
- `emf-work-charge`: ЦЭ sample В15.
- `induction-flux-charge`: ЦЭ sample В18.

Priority 3 missing templates:

- `alpha-decay-recognition`: РТ А10.
- `isotope-neutron-count`: ЦЭ sample А10.
- `photoelectric-work-function`: РТ В19.
- `photoeffect-capacitor-charge`: ЦЭ sample В20.
- `thin-lens-moving-source`: РТ В20.
- `total-internal-reflection-geometry`: ЦЭ sample В19.
- `phenomenon-device-matching`: ЦЭ sample А9.

## Answer Model Gaps

Current generator is numeric-first. Real exam formats need:

- single-choice with one answer;
- multiple-choice from five options;
- numeric part B answer with no units in the answer field;
- matching tasks;
- formula selection;
- unit recognition.

Recommended type expansion:

```ts
answerKind:
  | "single-choice"
  | "multiple-choice"
  | "numeric"
  | "matching"
```

Do not overload current `AnswerKind = "positive" | "magnitude" | "signed"` for UI answer format. That type is about numeric sign semantics, not exam answer shape.

## Distractor Strategy Gaps

Current distractors are mostly deterministic arithmetic mistakes. Real tasks show more categories:

- unit conversion mistakes;
- graph-axis confusion;
- wrong physical quantity from same visual: area vs slope vs endpoint;
- scalar/vector confusion;
- Celsius/Kelvin confusion;
- normal reaction mistake under angled force;
- ideal meter/switch misconception;
- final quantity vs change in quantity;
- use of final current as constant when current changes.

Recommended generator layer:

```ts
type DistractorRule = {
  label: string
  misconception: string
  compute?: (p: Params) => number
  optionText?: (p: Params) => string
}
```

This supports both numeric and conceptual/multiple-choice distractors.

## Graph / Diagram Gaps

Current `GraphSpec` only handles kinematics-like `xt/vt/at`.

High-value additions before new templates:

1. `PhysicsGraph` custom SVG for p(V), V(T), t(τ), x(t), v(t), signed axes.
2. `VectorDiagram` for arrows on grids and force projections.
3. `CircuitDiagram` for fixed families: series/parallel, switch, meter, source.
4. `MechanicsDiagram` for block, pulley, rod, vessel.
5. `OpticsDiagram` later for lens/TIR.

## What To Build First

Best next sprint if implementation resumes:

1. Add `PhysicsGraph` v1 custom SVG with `xt`, `vt`, `pv`, `vT`, `tTau`.
2. Add generator templates:
   - `ideal-gas-state`;
   - `pv-graph-work-heat`;
   - `charge-sharing`;
   - `relative-velocity-vectors` if vector renderer is ready;
   - `impulse-force-time` because it needs no renderer.
3. Extend generated task type to separate numeric sign semantics from exam answer shape.

Do not add 20 templates before the graph/diagram foundation. The real exam format depends heavily on compact visuals, and text-only clones would train the wrong skill.
