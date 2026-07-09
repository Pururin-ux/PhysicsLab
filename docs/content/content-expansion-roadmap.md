# Content Expansion Roadmap

Status: audit draft.

This is the current content reality after PR #5. The product is usable and polished, but it is not yet a complete CE/CT exam trainer. It is a focused slice with a solid generator/help architecture and uneven topic coverage.

## A. Current Coverage

Current generated task templates: **22**.

Active generated topics:

- Kinematics
- Dynamics
- Electrodynamics
- Molecular physics / thermodynamics

Visible but not active topics:

- Optics
- Atomic / quantum / nuclear physics

### Coverage Table

| Topic | Subtopic | Existing template ids | Answer kind | Targeted help | Formula reference | Explanation | CE/CT relevance | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kinematics | free fall / accelerated motion | `free-fall` | numeric choice | yes | yes | yes | medium | good drill, narrow |
| Kinematics | v(t) slope | `vt-slope` | numeric choice | yes | yes | yes | high | good |
| Kinematics | v(t) area | `vt-area` | numeric choice | yes | yes | yes | medium-high | good but needs mixed signed/interval variants |
| Kinematics | relative perpendicular velocities | `relative-velocity-vectors` | numeric choice | yes | no | yes | high | good pilot, formula reference missing |
| Dynamics | Newton's second law | `newton-second` | numeric choice | yes | yes | yes | high | weak: too simple vs exam force/friction coupling |
| Dynamics | friction | `friction-force` | numeric choice | yes | yes | yes | high as component | weak standalone drill |
| Dynamics | incline projection | `incline-force` | numeric choice | yes | yes | yes | medium | weak without friction/work variants |
| Dynamics | resultant force, 1D | `resultant-force` | numeric choice | yes | yes | yes | medium | good prerequisite |
| Dynamics | resultant force, 2D | `resultant-force-2d` | numeric choice + vector diagram | yes | no | yes | high | good pilot, formula reference missing |
| Dynamics | weight in lift | `weight-lift` | numeric choice | yes | yes | yes | medium | useful, lower evidence |
| Dynamics | impulse / momentum | `impulse-momentum`, `inelastic-collision-speed` | numeric choice | yes | partial | yes | high | good start |
| Dynamics | kinetic energy | `kinetic-energy` | numeric choice | yes | no | yes | high | good drill, no work-energy family yet |
| Dynamics | density and volume | `density-volume-ratio` | numeric choice | yes | yes | yes | high | good |
| Electrodynamics | Ohm law | `ohm-law` | numeric choice | yes | yes | yes | high | good, needs inverse variants |
| Electrodynamics | resistor network | `resistor-network` | numeric choice + circuit diagram | yes | no | yes | high | useful but help is too broad under Ohm law |
| Electrodynamics | full circuit | `source-internal-resistance` | numeric choice + circuit diagram | yes | no | yes | high | good start |
| Electrodynamics | charge sharing | `charge-sharing` | signed numeric choice | yes | yes | yes | high | good |
| Electrodynamics | capacitor energy | `capacitor-energy` | numeric choice | yes | no | yes | medium-high | good, formula reference missing |
| Thermodynamics | ideal gas state | `ideal-gas-state` | numeric choice | yes | no | yes | high | good, formula reference id mismatch |
| Thermodynamics | heat amount | `heat-amount` | numeric choice | yes | yes | yes | medium-high | good |
| Thermodynamics | heating and melting | `phase-change-heat` | numeric choice | yes | no | yes | high | good, graph variant missing |
| Thermodynamics | p(V), V(T), t(tau) graphs | none | n/a | partial help only | partial formulas | n/a | high | missing |
| Optics | reflection/refraction/lens/TIR | none | n/a | none | formulas exist | n/a | medium | missing |
| Atomic/quantum/nuclear | photoeffect/half-life/reactions/photon | none | n/a | none | none | n/a | medium | missing |
| Exam mode | mixed open sections | generated from active groups | numeric choice | yes per task | partial | yes | high | honest slice, not full exam |
| Profile/progress | local practice state | n/a | n/a | n/a | n/a | n/a | product support | useful but label should probably be Progress |
| Formulas | active + upcoming references | n/a | n/a | n/a | yes | n/a | support | partial, missing generated-family refs |

## B. Missing Coverage

The main gaps are not UI polish. They are content breadth and visual exam grammar.

P0 gaps:

- Optics has zero task families.
- Atomic/quantum/nuclear has zero task families.
- Thermodynamics has no p(V), V(T), or heating curve graph tasks.
- Kinematics lacks unit conversion and average-speed segment traps.
- Dynamics still lacks combined force projection + friction and work/energy basics.
- Generated answer model is numeric-choice only; real CE/CT includes single choice, multiple choice, numeric input, matching, and unit/formula recognition.
- Formula reference is behind generator coverage for several active families.

P1 gaps:

- Magnetic field / Lorentz / induction are absent.
- Circuit families do not yet cover ideal meters, switch states, power comparison, or changing current.
- Optics formulas exist, but no renderer or task family uses them.
- Explanation quality is solid for short numeric drills, but graph/diagram explanations need a stricter pattern.

P2 gaps:

- Hydrostatics with geometry, statics, spring/pulley systems.
- Conceptual wave/sound tasks.
- Matching/instrument tasks.
- Broader exam variant sourcing and OCR of scanned collections.

## C. P0 Task Families

These should be added first, but only through the task-family schema.

### Kinematics

1. `units-speed-compare`
   - Pattern: compare speeds in mixed units.
   - Why: direct RT A1-style trap.
   - Needs: new `units-conversion` help section.

2. `average-speed-segments`
   - Pattern: two or three path/time segments.
   - Trap: arithmetic mean of speeds.
   - Needs: formula reference already has enough base material, help section exists.

3. `relative-motion-linear`
   - Pattern: meeting/overtaking without vector diagram.
   - Trap: add instead of subtract, or vice versa.
   - Needs: can use existing relative-motion help.

4. `graph-area-slope-mixed`
   - Pattern: same visual asks slope in one case, area in another.
   - Trap: endpoint value vs slope vs area.
   - Needs: current PhysicsGraph can support v(t); add tests before broadening.

### Dynamics

1. `force-projection`
   - Pattern: choose/project force on an axis.
   - Trap: sin/cos swap.
   - Needs: vector/force diagram if visual; text-only pilot possible.

2. `friction-with-acceleration`
   - Pattern: Newton's law plus friction, not standalone friction.
   - Trap: use `N=mg` when angled force or incline changes N.
   - Needs: careful parameter invariants.

3. `incline-with-friction`
   - Pattern: block on incline with/without applied force.
   - Trap: sign and normal force.
   - Needs: diagram before high confidence.

4. `work-energy-basic`
   - Pattern: work, kinetic energy change, speed from energy.
   - Trap: confuse force with work or miss square root.

### Electrodynamics

1. `ohm-law-inverse`
   - Pattern: find U or R, not only I.
   - Trap: algebra inversion.

2. `resistor-network-current-voltage`
   - Pattern: series/parallel current/voltage distribution.
   - Trap: same current vs same voltage.

3. `full-circuit-variant`
   - Pattern: solve for R, r, or EMF from current.
   - Trap: ignore internal resistance.

4. `capacitor-energy-variant`
   - Pattern: solve for C, U, or energy ratio.
   - Trap: lose U squared or 1/2.

### Thermodynamics

1. `gas-process-ratio`
   - Pattern: compare p, V, T in isobaric/isochoric/isothermal process.
   - Trap: Celsius/Kelvin and inverse proportionality.

2. `heat-balance`
   - Pattern: two bodies reach equilibrium temperature.
   - Trap: sign of heat lost/gained.

3. `pv-graph-work`
   - Pattern: work as area under p(V) or cycle area.
   - Trap: use area for every thermodynamic quantity.
   - Needs: GraphSpec/PhysicsGraph extension.

4. `heating-curve-stage`
   - Pattern: t(tau) plateau, melting interval, mass/latent heat.
   - Trap: use full time instead of plateau.
   - Needs: graph extension.

## D. P1 Task Families

- `magnetic-field-wire-direction`
- `lorentz-circular-motion`
- `induction-flux-charge`
- `electric-field-vs-potential`
- `engine-efficiency`
- `spring-pendulum-scaling`
- `pulley-system-force`
- `hydrostatic-vessel-geometry`
- `statics-moment-balance`
- `sound-medium-concept`

## E. Optics Plan

Do not expose optics as a full practice topic until at least three families exist.

Minimum viable optics:

1. `refraction-index-speed`
   - No renderer required.
   - Formula: `n = c/v`.
   - Good first pilot.

2. `thin-lens-equation`
   - Needs simple optics diagram or very constrained text.
   - Formula: `1/F = 1/d + 1/f`.

3. `total-internal-reflection-critical-angle`
   - Needs ray/geometry diagram before release.

4. `image-properties-ray-construction`
   - Postpone until optics renderer exists.

Implementation gate:

- Add `TopicId`/progress/formula/help intentionally, or keep optics in a hidden generator test until topic support exists. Do not half-expose it.

## F. Atomic / Quantum / Nuclear Plan

Do not expose as a full practice topic until at least three families exist.

Minimum viable set:

1. `photon-energy-frequency-wavelength`
   - Formula: `E = h nu = hc/lambda`.
   - No renderer required.

2. `photoelectric-work-function`
   - Formula: `h nu = A + E_k`.
   - Needs eV/J conversion rules.

3. `radioactive-half-life`
   - Formula: `N = N0 / 2^n`.
   - Good numeric family.

4. `nuclear-reaction-conservation`
   - Conceptual/numeric hybrid.
   - Needs answer model beyond numeric-choice for best fit.

5. `isotope-neutron-count`
   - Simple single-choice/numeric.

Implementation gate:

- Add atomic/quantum help sections and formula references first.
- Decide whether product label is "Atomic and quantum" or split "Atomic/nuclear" from "Quantum".

## G. Explanation Quality Plan

Current explanations are mostly short and concrete. Keep that style. New families should follow this pattern:

1. Name the physical model.
2. Write the formula or graph rule.
3. Substitute numbers.
4. State the answer with units.
5. Name only one common mistake.

Avoid:

- generic "think carefully" hints;
- long theory blocks after answer;
- hidden assumptions not shown in the statement;
- multiple formulas when one step is enough.

For graph/diagram tasks, explanations must say what visual element was read:

- axis label;
- slope;
- area;
- plateau;
- state point;
- branch current/voltage;
- vector direction.

## H. Copy Cleanup Plan

Short-term copy fixes should target precision, not personality.

P0:

- Do not imply this is a complete CE/CT trainer while optics and atomic/nuclear are missing.
- Avoid "real test" phrasing for exam-demo; call it "mixed variant from open sections".
- Rename or reframe profile if it remains mainly progress/review.

P1:

- Reduce repeated "honest progress" language.
- Keep Nova mentions out of core educational claims.
- Replace broad hero claims with concrete available coverage.

P2:

- Later polish landing after content breadth improves.

Detailed examples are in `docs/content/copy-audit.md`.

## I. Risks

- Product risk: current UI can look more complete than the content actually is.
- Pedagogy risk: too many numeric-choice drills will undertrain real exam answer formats.
- Architecture risk: adding optics/atomic by forcing them into current four-topic `TopicId` would corrupt progress and review semantics.
- Renderer risk: thermodynamics/optics tasks need semantic visuals; text-only versions would train the wrong skill.
- Maintenance risk: formula reference, help mapping, taxonomy, and generator can drift unless tests keep checking 1:1 coverage.

## Next Implementation Recommendation

Do not start with 20 new templates.

Recommended next commit after this audit:

1. Add missing formula-reference entries for active generated families.
2. Add `units-speed-compare` and `average-speed-segments`.
3. Add `ohm-law-inverse`.
4. Add tests that enforce formula reference coverage for every active generated family where a reusable formula exists.

Leave optics/atomic until the product decides how to expose new topics in progress/navigation.
