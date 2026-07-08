# Exam Task Taxonomy

Analyzed sources:

- Full-text: РТ-2024/2025, этап III, вариант 1: 30 tasks.
- Visual sample: ЦЭ/ЦТ 2025 scanned collection, variant 1 pages: 30 tasks inspected visually, not OCR-cataloged.
- Official structure check: RИКЗ physics specification 2026: 30 tasks, A=10, B=20.

Frequency counts below are exact only for the full-text РТ source. Visual sample is used to validate formats, not to increase statistical counts.

## 1. Механика

Count in full-text РТ: 10 / 30.

Concrete formats found:

- Unit comparison: choose the greatest speed among values in m/s, km/h, m/min, km/s, cm/h.
- Relative motion / vector addition: swimmer trajectory in river current; boat relative velocity in visual sample.
- Wave concept: sound propagation in media.
- v(t) graph: read acceleration as slope.
- Density and volume: mass ratio of cubes with different densities and edge lengths.
- Hydrostatics with geometry: conical vessel partially filled, pressure force on bottom.
- Newton's second law with friction and angled pull: use kinematics first, then projections and friction.
- Statics: bent rod with attached mass, moment balance.
- Spring pendulum: period/frequency changes with mass.
- Impulse: change of momentum under gravity over a time interval.

Actions required:

- Convert units before comparing.
- Choose reference frame and add/subtract vectors.
- Read graph axes before using a formula.
- Distinguish path, displacement, coordinate, velocity, and acceleration.
- Build force diagrams and choose axes.
- Use geometry/similarity before physics in hydrostatics and statics tasks.

Typical traps:

- Compare numeric values without unit conversion.
- Use velocity of one body instead of relative velocity.
- Treat a graph of one quantity as another: visual sample has `v_x(s)`, not `v(t)`.
- Use `N=mg` when another force changes normal reaction.
- Use edge ratio instead of volume ratio.
- Count periods linearly instead of using `T^2 ∝ m`.

Generator implications:

- Current `vt-slope`, `newton-second`, `friction-force`, `resultant-force`, `weight-lift` cover only a narrow subset.
- Priority missing mechanics templates: relative velocity vectors, impulse, density/volume ratios, hydrostatics with vessel geometry, torque equilibrium, spring pendulum scaling, pulley systems, inelastic collision, work/energy.
- Mechanics needs both `PhysicsGraph` and diagram renderers: vectors on grids, force diagrams, blocks/pulleys, vessels, rods, simple optical-like ray geometry for later topics.

MVP caution:

- Avoid freehand complex statics diagrams until a reusable diagram grammar exists.
- Do not fake scanned-style diagrams with decorative SVG. Make semantic SVG primitives: point, vector, line, arc, force arrow, support, block, pulley, vessel.

## 2. Молекулярная физика / термодинамика

Count in full-text РТ: 7 / 30.

Concrete formats found:

- Formula recognition: internal energy of ideal monatomic gas.
- Heat proportionality: compare heating/cooling intervals.
- Gas mixture mass from molar quantities.
- Ideal gas pressure from density, temperature, molar mass.
- p(V) cycle: use area as cycle work and first law for one segment.
- Multi-stage heat: warm ice, melt, warm water.
- Heat engine efficiency with fuel consumption, speed, distance, and power.

Visual sample adds:

- V(T) process graph with isobaric/isochoric interpretation.
- p(V) transition and p(V) cycle.
- Heating/melting curve `t(τ)` with plateau.

Actions required:

- Convert mass, molar mass, volume, fuel volume, and energy units.
- Use Kelvin in gas laws, not Celsius.
- Identify process type from graph axes.
- Separate work, heat, and internal energy.
- Read plateau intervals on phase-change graphs.

Typical traps:

- Use Celsius directly in gas laws.
- Skip one heat stage in melting tasks.
- Treat p(V) area as every requested thermodynamic quantity.
- Forget that p(V) graph geometry can encode both work and temperature via `pV`.

Generator implications:

- High-value missing templates: ideal gas state equation, isobaric/isochoric/isothermal graph reading, p(V) work/heat/internal-energy tasks, phase-change heat, engine efficiency.
- `PhysicsGraph` v1 should not be only kinematics. It needs p(V), V(T), t(τ), possibly marked states and shaded cycle area.

MVP caution:

- Thermodynamics graphs are exam-relevant but require precise axes, state labels, and area highlighting.

## 3. Электродинамика

Count in full-text РТ: 9 / 30.

Concrete formats found:

- Electrostatic field direction from several point charges.
- Circuit reasoning with a switch and shorted lamp.
- Magnetic field direction near a straight current-carrying wire.
- Charge sharing between identical metal spheres.
- Capacitor energy with dielectric and unit conversion.
- Source internal resistance from two current/voltage measurements.
- Resistor network power comparison.
- Lorentz force in circular motion.
- AC angular frequency to frequency.

Visual sample adds:

- Unit recognition for farad.
- Voltage comparison in a resistor network.
- Magnetic field component signs.
- Potential of two equal charges at different points.
- EMF from work per charge.
- Joule heat with linearly changing current.
- Induction charge from magnetic flux change.

Actions required:

- Distinguish scalar potential from vector field.
- Analyze circuits with ideal meters and switches.
- Reduce series/parallel resistor networks.
- Use right-hand rule for magnetic-field direction.
- Convert prefixes: pC/nC, mΩ, μJ, μT, mT, cm²/mm².
- Integrate or average correctly when current changes with time.

Typical traps:

- Add electric field vectors as if they were potentials, or vice versa.
- Treat ideal voltmeter/ammeter incorrectly in circuit diagrams.
- Use final current as constant in Joule heat.
- Ignore internal resistance of source.
- Lose sign/direction in magnetic field tasks.

Generator implications:

- Current generator has no electrodynamics. This is a large gap because exam structure reserves about 9/30 tasks for this section.
- Priority missing templates: charge sharing, capacitor energy/capacitance, source internal resistance, resistor network ratios, magnetic field near wire, Lorentz circular motion, induction by flux change, AC frequency conversion.
- Diagram renderer must support circuit graphs, switches, meters, nodes, equal resistors, and labeled branches.

MVP caution:

- Circuit renderer can start with fixed pattern families, not a full SPICE-like solver.

## 4. Оптика

Count in full-text РТ: 2 / 30 if including refractive index and thin lens.

Concrete formats found:

- Refractive index from light speed in medium.
- Thin lens with moving source and image speed.

Visual sample adds:

- Total internal reflection geometry under a square oil slick.

Actions required:

- Use ratios and geometric relations.
- Read optical diagram distances carefully.
- Distinguish object distance, image distance, and focal distance.

Typical traps:

- Use `v/c` instead of `c/v`.
- Treat focal distance and image distance as the same.
- Apply circular light-cone geometry incorrectly to a square boundary.

Generator implications:

- Missing templates: refractive index, thin-lens formula, total internal reflection, mirrors/lenses image construction.
- Needs optics diagram renderer: optical axis, lens, focus, object/image, ray cone.

MVP caution:

- Good optics tasks are diagram-heavy; postpone hard ones until diagram primitives exist.

## 5. Квантовая / атомная / ядерная физика

Count in full-text РТ: 2 / 30:

- A10: alpha decay recognition.
- B19: photoelectric work function.

Visual sample adds:

- Lithium isotope neutron count.
- Photoelectric charging of capacitor by monochromatic light.

Actions required:

- Recognize nuclear reaction type.
- Convert photon/work energy to eV.
- Count protons/neutrons from isotope notation.
- Combine quantum energy with capacitor voltage in multi-step tasks.

Typical traps:

- Confuse alpha and beta decay.
- Count atoms instead of neutrons.
- Use full photon energy instead of excess above work function.
- Forget joule/eV conversion.

Generator implications:

- Missing templates: isotope composition, alpha/beta/gamma decay, photoelectric threshold/work function, photoeffect stopping voltage, de Broglie/basic photon energy.

MVP caution:

- These are lower frequency but good for broad exam coverage after mechanics/thermo/electro foundations.

## 6. Экспериментальные / табличные / смешанные задачи

Count in full-text РТ: 0 explicit experiment tasks, but several tasks use tables/diagrams.

Visual sample includes:

- Matching phenomenon to instrument in a table.
- Constants and prefixes page in exam instructions.
- Several tasks where the main difficulty is interpreting a diagram, not computing.

Actions required:

- Match a phenomenon to a device/principle.
- Read table-like options and multi-answer instructions.
- Use provided constants without writing units into answer where instruction says not to.

Typical traps:

- Treat matching as a memorization-only task and miss the physical principle.
- Include units in part B answers when the exam instruction says to write only the number.

Generator implications:

- Need a non-numeric template family: matching, concept selection, formula recognition, unit recognition.
- `GeneratedTask` currently mostly assumes numeric answers. Future generator should support `answerKind: single-choice | multiple-choice | numeric | matching`.

## Cross-Section Observations

- The official 2026 structure and the analyzed РТ variant align: mechanics 10, MKT/thermo 7, electrodynamics 9, optics 2, quantum 1, nuclear 1.
- Part A is not only easy recall. It includes diagrams, multi-select, graph matching, and formula recognition.
- Part B numeric tasks often require 2-3 steps and unit conversion.
- Exam visuals are compact, monochrome, grid-heavy, and semantically dense. PhysicsLab visuals should prioritize clarity over decorative polish.
