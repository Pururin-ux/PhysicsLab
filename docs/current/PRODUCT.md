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

The grade 7 SI-units explanation links to focused numeric practice that
converts kilometres, decimetres, centimetres and millimetres to metres. The
grade 7 volume chapter links to practice that computes a rectangular block's
volume from three measured edges, including an edge given in millimetres. The
grade 7 scale-reading chapter now links to generated practice that reads a
meniscus from labelled marks by distinguishing tick marks from intervals
before applying the scale's division value. The following irregular-body-volume
chapter compares two readings of the same cylinder and links to focused
subtraction practice; scale reading remains an optional recap. These four task
families belong to a separate Measurements topic rather than Kinematics;
their exam placement remains unconfirmed.

Focused practice summaries for unit conversion, block volume and scale reading
can optionally lead to the next related question. The heat-amount and simple
heat-balance summaries offer the same bounded handoff toward balance practice
and fuel respectively.
Repeat and explanation remain available. This is a provisional connection,
not a required sequence or a mastery claim.

The textbook at `/learn` currently connects 129 chapters for
selected grade 7, grade 8, grade 9, grade 10 and grade 11 topics. Grade 11 now has
seven connected but partial chapters on mechanical oscillations and waves, with
focused practice for cycle frequency, spring-pendulum period,
mathematical-pendulum period, energy conversion during harmonic oscillations,
resonance frequency and wave speed. The sound chapter compares frequency and
amplitude, illustrates how weaker overtones add to a discrete spectrum and
change timbre, and links echo ranging to focused depth-calculation practice.
This is an entry point, not coverage of the XI mechanics-and-waves unit.
A first chapter of the next XI unit, `/learn/lc-oscillations` (§ 7), compares
charge, current and electric/magnetic energy at quarter-period moments in an
ideal circuit. `lc-period` practices Thomson's period formula with explicit
henry and microfarad units. The connected X-class `/learn/self-induction`
chapter now offers an optional foundation for inductance and magnetic-field
energy; the XI explanation still introduces what it needs, without a
progression gate. The optional next question leads to `/learn/alternating-current`, a
partial § 8 investigation: a rotating frame provides periodic external EMF,
while the earlier LC circuit has no connected source. A signed oscillogram
relates half-turns to current reversal for a resistive load; only in that
bounded case are current and voltage shown in phase. Focused practice
`ac-oscillogram-frequency` gives the times of two neighbouring positive
maxima in words and asks for the period and frequency; its task does not
display a graph. The Grade X induction chapter is an optional foundation,
not an assumed completed prerequisite. The optional next question now reaches
the transformer in § 9: Mio compares two separate windings on one closed core,
while the page gives the ideal turn and voltage ratios in text. The result is
initially hidden for prediction. A focused numeric family checks the
secondary-to-primary ratio with effective AC voltages; the worked example
treats power only with an active load and explicit ideal-loss assumption.
The contextual illustration is not a calibrated winding diagram. An optional
question then reaches the partial § 10 energy-transmission chapter. Mio's
classroom observation leads to a comparison of the same resistive line at
fixed active power entering the line: higher voltage gives lower current,
and heating falls with the square of that current. The result disclosure
shows 10 W versus 0.4 W of line loss for the stated model, while the focused
numeric family checks other input powers, voltages and resistances. The art
does not provide measurements. A further optional § 11 question distinguishes
thermal, hydro, nuclear and wind energy paths and their different environmental
questions. Mio compares contextual photographs, while the DOM explanation
and exact self-check reject the inference that lower line loss erases every
production impact. The photos are not measurements or Belarus-specific sites.
An independent partial § 12 question now compares two frequencies over the
same 6 m in vacuum. A graph of one electric-field component makes the
frequency–wavelength relationship visible; focused practice converts MHz to Hz
and finds the wavelength with c = λν. The graph is not the path of a particle
or a complete picture of both fields. Effects of electromagnetic radiation,
real-grid effects, quantitative ecological assessment, reactive loads and
broader energy/graph practice remain open.
Two further partial grade 11 chapters connect photoelectric effect (§§ 27–28)
with light pressure and wave-particle duality (§ 29). Their explanations and
models are linked; light-pressure comparison is qualitative and does not add a
separate task family. `/learn/rutherford-scattering` is a partial chapter that
compares the Thomson-model prediction with the qualitative observation of
Rutherford scattering in § 30 and infers a compact positive nucleus.
`/learn/bohr-transitions` continues that question with Bohr's hydrogen levels,
emission/absorption and a worked Hα example; `bohr-transition-radiation` adds a
linked frequency/wavelength task family for downward Balmer transitions.
`/learn/laser-amplification` follows with a qualitative account of pumping,
stimulated emission and resonator feedback (§ 34). This is still partial
coverage: other transitions, spectra and nuclear physics remain open.
Grade 8 now connects internal
energy and the three heat-transfer mechanisms to heat amount, fuel combustion, melting,
evaporation and boiling, then electrostatics, electric current, conductor resistance, circuit connections, electric work, power, safety and magnetic phenomena, followed by sources and straight-line propagation of light, shadows, reflection, the plane mirror, qualitative refraction, lenses, image construction, the eye and optical correction; grade 9
starts by choosing a material-point or rigid-body model, then introduces reference frames, coordinates and vector projections. It connects acceleration to velocity and displacement for uniformly accelerated motion, then adds circular motion, angular and linear speeds, period, frequency and centripetal acceleration before presenting interaction, inertia, mass, the three Newton laws, elastic deformation, friction, motion under gravity, universal gravitation, weight, weightlessness and overload as one sequence. Statics continues with force moments, equilibrium, levers, pulleys, the inclined plane, efficiency, the centre of gravity, stability, buoyancy and ships. The sequence then connects momentum, collisions and reactive motion to work, power, potential, kinetic, mechanical, internal and conserved energy.
The grade 8 heat-balance chapter links a worked water-mixture calculation to focused practice under an explicit negligible-vessel-heat-capacity assumption. The household-electricity chapter links to practice that checks the numerical total current of two parallel appliances; comparison with a conditional 10 A limit appears in feedback and is not separately assessed or presented as real wiring guidance.
The first twenty-four grade 10 chapters separate the three statements of molecular-kinetic
theory from the observations that support them, distinguish a tracked Brownian
particle from the molecules of the surrounding medium, and connect sample mass,
amount of substance and particle count through the Avogadro constant. They then
connect gas pressure to concentration and average molecular kinetic energy, then
distinguish thermal equilibrium from equality of every state variable and connect
absolute temperature with average translational kinetic energy. They then connect
pressure, volume, absolute temperature and amount of gas through the Clapeyron and
Mendeleev-Clapeyron equations, including the fixed-gas condition and model limits.
They continue with the three isoprocesses, their laws and exact graph distinctions.
The next chapter connects crystalline order, grain orientation and amorphous
structure with anisotropy, isotropy and the observed character of melting.
Liquid structure then connects close molecular spacing and temporary equilibrium
positions with flow, while the asymmetric surface layer explains the tendency to
reduce free-surface area.
The next chapter treats evaporation and condensation as simultaneous molecular
flows, explains evaporative cooling, and distinguishes saturated vapor in dynamic
equilibrium from unsaturated vapor and an ideal gas of fixed mass.
The humidity chapter then separates absolute and relative humidity, compares
water vapor with saturation at the same temperature, connects cooling with the
dew point, and shows how a psychrometer turns evaporative cooling into a reading.
The next chapter opens thermodynamics by defining the system boundary, treating
internal energy as a state function, and deriving the temperature dependence
of a fixed amount of monatomic ideal gas. The next chapter compares two paths
between the same gas states: the change in internal energy stays the same while
the work depends on the area under the $p(V)$ graph. Its isobaric task practices
$A=p\Delta V$ with an explicit volume change and the sign of expansion.
The following chapter compares equal heat transfer into equal masses of different
substances, distinguishes transferred heat from stored internal energy, and
reuses the grade 8 explanations of heating and phase changes where they remain
the right foundation. The first-law chapter then combines heat transfer and
work of the gas in one signed energy balance, with separate isochoric,
isothermal and isobaric examples and focused practice. The next chapter follows
one full heat-engine cycle: energy from the heater becomes work and heat delivered
to the cooler. It distinguishes thermal efficiency from the effective efficiency
of an entire fuel-powered installation. These chapters cover the core sequence
of the textbook's thermodynamics unit, but do not yet provide its full practice,
laboratory work or evidence of durable understanding.
The next chapter opens electrostatics with electron transfer, discrete charge and
conservation of the signed total for an electrically isolated pair. The existing
equal-sphere task applies that law under an explicit symmetry assumption; the
grade 8 charge chapter remains the prerequisite.
The following Coulomb-law chapter uses the point-charge model only when body
size is negligible relative to separation. It distinguishes the magnitude of
the force from attraction or repulsion, demonstrates the inverse-square
distance law for fixed charges in vacuum, and introduces the homogeneous
dielectric correction with its limits. Its focused practice asks for the
force magnitude, not a full vector superposition problem.
Two following chapters separate the source's electrostatic field from the
small test charge used to reveal it, then define field strength as a property
of the field at a point. Their shared scene keeps the source fixed while the
test charge is removed, doubled or reversed; the field strength stays the same
at a fixed point while the force changes. Focused practice calculates the
magnitude of field strength for one point source and the signed one-dimensional
vector sum for two sources. Two-dimensional vector components and field-line
construction from multiple sources remain open.
The next chapter treats field lines as a conventional representation rather
than visible particle paths. Its scene compares one positive or negative
point source with the central approximately uniform region between large
oppositely charged plates. It does not yet provide a solved task family for
multi-source field-line construction.
The following chapter compares a direct route and a detour between the same
points in a uniform electrostatic field. Moving the endpoint changes the
signed projection, work of the field, and potential-energy change without
attributing work to the route length. It then introduces potential as an
energy-per-charge quantity and the point-source formula. Separate focused
families check signed field work and potential-energy change in a uniform
field, signed potential of one point source, and the algebraic sum of the
potentials of two sources in vacuum. Two-dimensional vector superposition and
construction of multi-source field lines remain open.
The following chapter distinguishes the potential at a point from the voltage
between ordered points. Its scene changes their separation along a uniform
field and shifts the potential reference for both points together: the
individual potentials change, while their difference does not. Focused
practice checks signed voltage from field strength and oriented separation.
The scene and practice do not cover nonuniform fields or arbitrary paths.
The next chapter introduces capacitors and capacitance from the fixed charge
on isolated plates. Its scene changes overlap area, gap and dielectric while
showing how capacitance and voltage respond; focused practice checks the
proportional and inverse relationships for a parallel-plate capacitor. The
following chapter connects the energy of its electric field with charge,
capacitance and voltage. Its notebook compares a larger plate gap at fixed
charge and at fixed source voltage; focused practice calculates stored energy.
Both capacitor chapters use the ideal parallel-plate model and do not model
edge fields.
The partial chapter `/learn/full-circuit-ohms-law` connects §§ 25–26 of the
official Grade X textbook to the existing `source-internal-resistance` practice
family. It distinguishes EMF, internal voltage drop and terminal voltage,
derives Ohm's law for the complete circuit, and introduces source efficiency
and the short-circuit limit. Its lazy-loaded model compares an open and closed
source. Learners record the open-circuit voltage U₀, then capture voltage and
current readings for different loads and compare estimates of internal
resistance. The displayed estimate interval reflects rounding to the model's
0.1-unit readings, not the uncertainty of real instruments. The prescribed
physical lab is not simulated. For each saved reading, the notebook also
estimates useful load power from `UI` and source power from `U₀I`, then shows
their approximate ratio; the open-circuit reading remains a measured proxy
for EMF. A linked `source-efficiency` family practises the same distinction;
dedicated practice for source power remains open.
The partial Grade X `/learn/magnetic-field-and-ampere-force` chapter connects
the Grade VIII field observation with textbook §§ 27–29. It separates the
external field induction from the force on a straight current-carrying segment,
shows the angle dependence on a fixed-scale graph, and links exact-family
practice for the force magnitude. It describes, but does not simulate, the
interaction of two currents or the rotation of a frame. Direction requires a
separate rule and is not inferred from the magnitude graph.
The partial Grade X § 30 chapter at
`/learn/lorentz-force-and-charge-motion` connects that magnetic field to a
moving charge. A fixed-scale calculated electron trace compares field-off,
field direction, induction and initial speed. It separates a changing direction
from a constant speed magnitude and reads radius and period in the ideal
perpendicular-entry model. `lorentz-force-magnitude` adds focused numeric
practice with explicit units. It does not show a real electron-beam apparatus,
helical entry, electric acceleration or collisions.
The partial Grade X `/learn/electromagnetic-induction` chapter covers textbook
§§ 31–32: a fixed coil in a changing uniform field connects flux through one
turn to average Faraday EMF and Lenz's direction. Opening the circuit separates
EMF from an induced current; focused practice calculates the EMF magnitude
from a stated flux change. Its optional next question leads to
`/learn/self-induction` (§ 33), which distinguishes the coil's own changing
field from an external field. A prescribed linear current change compares
opposing average self-EMF with the energy stored at each endpoint; changing
only the duration changes the EMF but not the final energy. Focused practice
calculates the self-EMF magnitude. The chapter leads optionally to the Grade XI
ideal LC circuit. It does not simulate a real RL transient or a lamp flash.
Nonuniform fields, oblique charge motion, field superposition tasks,
direction tasks for the Ampere force and full magnetic-field coverage remain open.
The first Grade X chapter on current in different media,
`/learn/electric-current-in-metals`, covers textbook § 34. Its stated
ordinary-metal model compares resistance and current as temperature changes
while voltage stays fixed; a separate qualitative task family distinguishes
fixed voltage from fixed current. The calculated readings are not laboratory
measurements. Electron carriers and superconductivity are explained, while
electrolytes, gases and semiconductors remain uncovered by this chapter.
The following Grade X `/learn/electric-current-in-electrolytes` chapter covers
textbook § 35 through a controlled qualitative comparison: distilled water,
sugar solution and copper(II) chloride solution in the same circuit. Mio records
the setup before the result; native disclosures reveal the three observations
without adding a client runtime. The text distinguishes ion transport in the
solution from electron transport in the metal wires, identifies the new cathode
after polarity reversal and limits the conductivity conclusion to the observed
lamp. `electrolyte-ion-transport` practices those distinctions. The authored
illustration is contextual, not a measured experiment or a visualization of
individual ions. The next Grade X chapter, `/learn/electric-current-in-gases`,
uses § 36 and a teacher-led plate-gap demonstration to distinguish external
ionization from a discharge that can sustain itself under other field conditions.
Mio records the changed electrometer reading; the image does not depict visible
ions, a spark, measured current or a safe home experiment. Its qualitative
`gas-discharge-conditions` practice checks carriers, ionizer removal and plasma.
The linked /learn/electric-current-in-semiconductors chapter covers § 37
through a qualitative photoresistor observation at unchanged voltage, then
distinguishes intrinsic electrons and holes from impurity n- and p-type
conductivity using the textbook's Ge–As and Ge–In examples. Its separate
semiconductor-carriers family checks the light/temperature conditions, the
hole model and majority carriers. Mio lifts the shade in contextual artwork;
the image supplies neither a numerical reading nor a lattice diagram.
The end of this chapter compares carriers in the four media in concise rows,
with direct returns to the metal, electrolyte and gas explanations. It replaces
a repeated prose list; it is not a new required course gate.
Real laboratory demonstrations and broader grade 10 coverage remain open.
This remains partial grade 10 coverage. Chapters
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

- Active practice topics: measurements, kinematics, dynamics, electrodynamics,
  thermodynamics, optics and atomic transitions.
- Grade X magnetism and induction currently cover a straight segment in a
  prescribed uniform field, a fixed coil with controlled magnetic-flux change,
  and self-induction under a prescribed current change, each with focused
  magnitude practice. This is not the complete magnetism-and-induction unit.
- Grade XI electromagnetic oscillations currently have a partial ideal
  LC-circuit chapter and a partial alternating-current chapter with focused
  period and oscillogram task families. Neither covers the full § 8 or the
  electromagnetic-waves unit.
- Grade XI quantum/atomic learning has partial chapters for the photoelectric
  effect (§§ 27–28), light pressure / wave-particle duality (§ 29), Rutherford
  scattering (§ 30), Bohr transitions (§ 31), and laser amplification (§ 34)
  of the 2021 textbook. A linked task family calculates photon frequency or
  wavelength for selected hydrogen Balmer transitions. Other spectra and
  transitions, and nuclear physics remain open; these fragments do not amount
  to full topic coverage.
- The exam flow is a diagnostic over available material. It is not a complete
  exam variant. Measurement-only task families are available as practice but
  are not counted toward an official exam section without source evidence.
- `/exam/program` is checked against the official RIKC 2026 Physics CE/CT
  specification. It shows the official six-section, 30-task distribution,
  separates available PhysicsLab task families from explicit gaps, and links to
  the specification rather than calling it the examination programme. Density
  remains in the product's matter/thermodynamics topic, but appears under
  Mechanics in exam coverage as required by the specification.

## Data boundary

The app has no accounts or server-side learner profile. Progress and active
practice state are stored in the browser; export and restore are available in
the profile. When older progress is loaded, exact measurement-specific mistakes
and skill evidence move to Measurements. Old aggregate Kinematics counts stay
intact because their individual task history cannot be reconstructed; the
profile marks this possible overlap for affected saves.

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
