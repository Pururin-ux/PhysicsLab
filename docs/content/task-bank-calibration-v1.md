# Task Bank Calibration v1

## Scope

This pass calibrates the existing 35 generated families. It adds no topic, family, answer format, route, dependency, or persistence field. The bank remains 8 numeric-input and 27 single-choice families across five active topics.

## Difficulty rubric

- **D1:** direct use of one model, normally one operation, no meaningful unit conversion or direction choice; numeric answer is an integer or has one decimal place.
- **D2:** two connected operations, a simple conversion, ratio, graph reading, or sign decision; numeric answer has at most two decimal places.
- **D3:** multiple physical stages, combined laws, geometry/trigonometry, a composite circuit, or a non-trivial direction decision; numeric answer has at most three decimal places.

Precision is a constraint, not the sole classifier. A clean integer does not make multi-stage physics easy, and awkward rounding does not make a direct substitution pedagogically advanced.

## Architecture

`TaskBlueprint.difficulty` remains the backward-compatible fallback. A generated candidate may receive a variant-level classification through the calibrated family policy. Candidate pools can be filtered by D1/D2/D3 and are cached without retries or random loops. Unsupported direct requests fail explicitly.

Standard ten-task topic sessions and mixed training use 5 D1, 3 D2, and 2 D3 tasks. General mixed training also retains exactly two tasks from each active topic. Larger diagnostic requests retain registry coverage instead of forcing the ten-slot ratio.

## Baseline family measurements

The committed `npm run audit:tasks` command enumerates the real parameter/candidate pipeline and samples at least 5000 generated tasks per family. Diversity excludes generated task IDs.

| Family | Group | Format | Raw | Valid | Unique texts | Unique answers | Baseline D1/D2/D3 |
|---|---|---:|---:|---:|---:|---:|---:|
| free-fall | kinematics | choice | 96 | 64 | 64 | 4 | 64/0/0 |
| vt-slope | kinematics | choice | 279 | 243 | 243 | 21 | 0/243/0 |
| vt-area | kinematics | choice | 240 | 239 | 239 | 88 | 0/239/0 |
| relative-velocity-vectors | kinematics | choice | 36 | 36 | 36 | 6 | 0/36/0 |
| average-speed-segments | kinematics | numeric | 6132 | 6087 | 6087 | 657 | 6087/0/0 |
| unit-conversion-speed | kinematics | choice | 468 | 468 | 468 | 81 | 468/0/0 |
| newton-second | dynamics | choice | 4920 | 4591 | 4591 | 643 | 4591/0/0 |
| friction-force | dynamics | choice | 95 | 95 | 95 | 59 | 95/0/0 |
| incline-force | dynamics | choice | 81 | 81 | 81 | 27 | 0/81/0 |
| resultant-force | dynamics | choice | 703 | 674 | 674 | 39 | 674/0/0 |
| resultant-force-2d | dynamics | choice | 24 | 24 | 24 | 6 | 0/24/0 |
| weight-lift | dynamics | choice | 800 | 800 | 800 | 478 | 0/800/0 |
| inelastic-collision-speed | dynamics | choice | 26112 | 22548 | 22548 | 789 | 0/22548/0 |
| kinetic-energy | dynamics | choice | 696 | 648 | 648 | 133 | 648/0/0 |
| work-force-distance | dynamics | numeric | 240 | 240 | 240 | 112 | 240/0/0 |
| ohm-law | electrodynamics | choice | 324 | 294 | 294 | 60 | 294/0/0 |
| resistor-network | electrodynamics | choice | 836 | 836 | 836 | 58 | 0/836/0 |
| source-internal-resistance | electrodynamics | choice | 99 | 85 | 85 | 9 | 0/85/0 |
| capacitor-energy | electrodynamics | choice | 360 | 360 | 360 | 78 | 0/360/0 |
| charge-sharing | electrodynamics | choice | 168 | 138 | 138 | 14 | 0/138/0 |
| electric-power | electrodynamics | numeric | 390 | 390 | 390 | 116 | 390/0/0 |
| density-volume-ratio | dynamics | choice | 2400 | 1520 | 1520 | 163 | 0/1520/0 |
| impulse-momentum | dynamics | choice | 6080 | 4560 | 4560 | 81 | 0/4560/0 |
| ideal-gas-state | thermodynamics | choice | 640 | 560 | 560 | 60 | 0/560/0 |
| heat-amount | thermodynamics | choice | 320 | 284 | 284 | 39 | 284/0/0 |
| phase-change-heat | thermodynamics | choice | 216 | 216 | 216 | 54 | 0/216/0 |
| gas-state-ratio | thermodynamics | choice | 3819 | 3819 | 3819 | 124 | 0/3819/0 |
| heat-balance-simple | thermodynamics | numeric | 330 | 256 | 256 | 59 | 0/256/0 |
| reflection-angle | optics | choice | 48 | 45 | 45 | 15 | 45/0/0 |
| plane-mirror-separation | optics | numeric | 39 | 39 | 39 | 13 | 39/0/0 |
| refractive-index-speed | optics | numeric | 15 | 15 | 15 | 5 | 15/0/0 |
| snell-index-ratio | optics | choice | 12 | 12 | 12 | 6 | 0/12/0 |
| thin-lens-image-distance | optics | numeric | 66 | 66 | 66 | 18 | 0/66/0 |
| lens-optical-power | optics | numeric | 15 | 12 | 12 | 4 | 12/0/0 |
| lens-image-height | optics | choice | 237 | 213 | 213 | 27 | 0/213/0 |

## Calibration decisions

- Perpendicular force composition, composite resistor networks, staged heating/melting, and Snell trigonometry are D3 because of the learning action, not answer formatting.
- Numeric families with variable precision or sign decisions receive candidate-level difficulty.
- D1 numeric candidates never require more than one decimal; D2 never more than two; all generated numeric answers remain capped at three.
- The candidate cache is filterable by actual difficulty and never silently substitutes a different level.
- Curated small-pool improvements: refractive-index speed 15 → 18 valid variants, Snell ratio 12 → 22, and optical power 12 → 18.
- Across 50 batches per mixed endpoint there are no duplicate texts inside a session. Maximum adjacent-session exact-text overlap is 10% (optics); the other measured mixes are 0%.

## Known limitations

The smallest content pools remain `refractive-index-speed`, `lens-optical-power`, and `snell-index-ratio` even after measured expansion. They are curated to avoid false material constants and physically invalid angle pairs. Their repetition ceiling is a real content limitation, not hidden by IDs. Further broadening safely needs additional reviewed contexts and angle/value tables, not arbitrary random numbers.

Difficulty is not persisted historically in v1. It describes the delivered task and badge only. The progress schema remains v3.
