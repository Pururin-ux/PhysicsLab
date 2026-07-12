# Content Expansion Roadmap

Status: living roadmap, updated after Optics Foundation v1.

This is the current content reality. The product is usable and polished, but it is not yet a complete CE/CT exam trainer. It is a focused slice with a solid generator/help architecture and uneven topic coverage.

## Update: Optics Foundation v1

- Templates: 28 → **35**; optics opened as the fifth active topic with 7 families.
- Answer formats: 27 single choice + 8 numeric input (`answerFormat` is separate from numeric `answerKind`).
- Diagrams: vector, circuit and now **optics** (reflection, plane mirror, refraction, thin lens) with prompt/solution separation — solution elements are absent from DOM before submit.
- Optics v1 scope: plane mirror, reflection, elementary refraction, converging thin lens, optical power, magnification.
- Explicitly out of scope for optics v1: spherical mirrors, diverging lenses, total internal reflection tasks, interference, diffraction, dispersion, wave optics, optical instruments.
- Mixed training now draws 5 groups evenly (2 tasks each at count=10) and remains an honest study mix, not an official ЦТ/ЦЭ variant.
- Progress storage migrated v2 → v3 (optics topic added; old data preserved, same storage key).

## A. Current Coverage

Current generated task templates: **35** (kinematics 6, dynamics 11, electrodynamics 6, thermodynamics 5, optics 7).

Task Family Expansion v1 added: `average-speed-segments`, `unit-conversion-speed`,
`work-force-distance`, `electric-power`, `gas-state-ratio`, and
`heat-balance-simple`.

Active generated topics:

- Kinematics
- Dynamics
- Electrodynamics
- Molecular physics / thermodynamics
- Optics

Visible but not active topics:

- Atomic / quantum / nuclear physics

### Coverage Table

| Topic | Subtopic | Existing template ids | Answer kind | Targeted help | Formula reference | Explanation | CE/CT relevance | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kinematics | free fall / accelerated motion | `free-fall` | numeric choice | yes | yes | yes | medium | good drill, narrow |
| Kinematics | v(t) slope | `vt-slope` | numeric choice | yes | yes | yes | high | good |
| Kinematics | v(t) area | `vt-area` | numeric choice | yes | yes | yes | medium-high | good but needs mixed signed/interval variants |
| Kinematics | relative perpendicular velocities | `relative-velocity-vectors` | numeric choice | yes | no | yes | high | good pilot, formula reference missing |
| Kinematics | average speed on segments | `average-speed-segments` | numeric input | yes | yes | yes | high | good, arithmetic-mean trap covered |
| Kinematics | speed conversion | `unit-conversion-speed` | numeric choice | yes | yes | yes | high | good, mixed-unit comparison covered |
| Dynamics | Newton's second law | `newton-second` | numeric choice | yes | yes | yes | high | weak: too simple vs exam force/friction coupling |
| Dynamics | friction | `friction-force` | numeric choice | yes | yes | yes | high as component | weak standalone drill |
| Dynamics | incline projection | `incline-force` | numeric choice | yes | yes | yes | medium | weak without friction/work variants |
| Dynamics | resultant force, 1D | `resultant-force` | numeric choice | yes | yes | yes | medium | good prerequisite |
| Dynamics | resultant force, 2D | `resultant-force-2d` | numeric choice + vector diagram | yes | no | yes | high | good pilot, formula reference missing |
| Dynamics | weight in lift | `weight-lift` | numeric choice | yes | yes | yes | medium | useful, lower evidence |
| Dynamics | impulse / momentum | `impulse-momentum`, `inelastic-collision-speed` | numeric choice | yes | partial | yes | high | good start |
| Dynamics | kinetic energy | `kinetic-energy` | numeric choice | yes | no | yes | high | good drill, no work-energy transition yet |
| Dynamics | work from force and distance | `work-force-distance` | numeric input | yes | yes | yes | high | good basic work drill |
| Dynamics | density and volume | `density-volume-ratio` | numeric choice | yes | yes | yes | high | good |
| Electrodynamics | Ohm law | `ohm-law` | numeric choice | yes | yes | yes | high | good, needs inverse variants |
| Electrodynamics | electric power | `electric-power` | numeric input | yes | yes | yes | high | good basic power drill |
| Electrodynamics | resistor network | `resistor-network` | numeric choice + circuit diagram | yes | no | yes | high | useful but help is too broad under Ohm law |
| Electrodynamics | full circuit | `source-internal-resistance` | numeric choice + circuit diagram | yes | no | yes | high | good start |
| Electrodynamics | charge sharing | `charge-sharing` | signed numeric choice | yes | yes | yes | high | good |
| Electrodynamics | capacitor energy | `capacitor-energy` | numeric choice | yes | no | yes | medium-high | good, formula reference missing |
| Thermodynamics | ideal gas state | `ideal-gas-state` | numeric choice | yes | no | yes | high | good, formula reference id mismatch |
| Thermodynamics | heat amount | `heat-amount` | numeric choice | yes | yes | yes | medium-high | good |
| Thermodynamics | gas state ratio | `gas-state-ratio` | numeric choice | yes | yes | yes | high | good process-ratio drill |
| Thermodynamics | heat balance | `heat-balance-simple` | numeric input | yes | yes | yes | high | good equilibrium-temperature drill |
| Thermodynamics | heating and melting | `phase-change-heat` | numeric choice | yes | no | yes | high | good, graph variant missing |
| Thermodynamics | p(V), V(T), t(tau) graphs | none | n/a | partial help only | partial formulas | n/a | high | missing |
| Optics | reflection, plane mirror, refraction, converging lens | 7 active families | single choice + numeric input | yes | yes | yes | high | useful v1; no wave optics, TIR family, diverging lenses or instruments |
| Atomic/quantum/nuclear | photoeffect/half-life/reactions/photon | none | n/a | none | none | n/a | medium | missing |
| Exam mode | mixed open sections | generated from active groups | single choice + numeric input | yes per task | partial | yes | high | honest slice, not full exam |
| Profile/progress | local practice state | n/a | n/a | n/a | n/a | n/a | product support | useful but label should probably be Progress |
| Formulas | active + upcoming references | n/a | n/a | n/a | yes | n/a | support | partial, missing generated-family refs |

## B. Missing Coverage

The main gaps are not UI polish. They are content breadth and visual exam grammar.

P0 gaps:

- Atomic/quantum/nuclear has zero task families.
- Thermodynamics has no p(V), V(T), or heating curve graph tasks.
- Dynamics still lacks combined force projection + friction; work/energy transition tasks are still missing.
- Generated answer model supports single choice and numeric input; real CE/CT also includes multiple choice, matching, and unit/formula recognition.
- Formula reference is behind generator coverage for several active families.

P1 gaps:

- Magnetic field / Lorentz / induction are absent.
- Circuit families do not yet cover ideal meters, switch states, power comparison, or changing current.
- Optics v1 remains narrow: no wave optics, diverging lenses, total-internal-reflection family or optical instruments.
- Explanation quality is solid for short numeric drills, but graph/diagram explanations need a stricter pattern.

P2 gaps:

- Hydrostatics with geometry, statics, spring/pulley systems.
- Conceptual wave/sound tasks.
- Matching/instrument tasks.
- Broader exam variant sourcing and OCR of scanned collections.

## C. P0 Task Families

These should be added first, but only through the task-family schema.

Already added after the initial audit: `average-speed-segments`,
`unit-conversion-speed`, `work-force-distance`, `electric-power`,
`gas-state-ratio`, and `heat-balance-simple`.

### Kinematics

1. `relative-motion-linear`
   - Pattern: meeting/overtaking without vector diagram.
   - Trap: add instead of subtract, or vice versa.
   - Needs: can use existing relative-motion help.

2. `graph-area-slope-mixed`
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

1. `pv-graph-work`
   - Pattern: work as area under p(V) or cycle area.
   - Trap: use area for every thermodynamic quantity.
   - Needs: GraphSpec/PhysicsGraph extension.

2. `heating-curve-stage`
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

## E. Optics Backlog

Optics is active with seven v1 families, targeted help, formulas, progress and
semantic ray diagrams. The remaining expansion should focus on diverging
lenses, total internal reflection, wave optics and optical instruments rather
than duplicating the existing foundation.

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

- Do not imply this is a complete CE/CT trainer while atomic/nuclear physics and substantial optics breadth are missing.
- Avoid "real test" phrasing for exam-demo; call it "mixed training from open topics".
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
- Pedagogy risk: single-choice and numeric-input drills still undertrain matching and multiple-choice exam formats.
- Architecture risk: adding atomic/quantum as a sixth topic requires deliberate progress and review semantics.
- Renderer risk: thermodynamics/optics tasks need semantic visuals; text-only versions would train the wrong skill.
- Maintenance risk: formula reference, help mapping, taxonomy, and generator can drift unless tests keep checking 1:1 coverage.

## Next Implementation Recommendation

Do not start with 20 new templates.

Recommended next commit after this audit:

1. Complete formula-reference coverage for active generated families that still need it.
2. Add a visual `graph-area-slope-mixed` family with renderer assertions.
3. Add a coupled-force family such as `friction-with-acceleration`.
4. Keep tests enforcing formula-reference coverage for every active generated family where a reusable formula exists.

Treat atomic/quantum/nuclear as a separate foundation project; optics should be
expanded only where the current v1 coverage is demonstrably insufficient.
