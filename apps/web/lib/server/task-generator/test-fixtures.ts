// Reviewed authored bank at checkpoint 908245a. Independent expectations,
// not values derived from the generator under test.
import type { TemplateId } from "./generate.ts";

export const NUMERIC_TEMPLATE_IDS = [
  "archimedes-force", "average-speed-segments", "work-force-distance",
  "electric-power", "heat-balance-simple", "plane-mirror-separation",
  "refractive-index-speed", "thin-lens-image-distance", "lens-optical-power",
  "length-unit-conversion", "graduated-scale-reading", "rectangular-block-volume",
  "irregular-body-volume", "rotation-frequency", "centripetal-acceleration",
  "oscillation-frequency", "spring-oscillation-period", "mathematical-pendulum-period",
  "lc-period", "ac-oscillogram-frequency", "transformer-voltage-ratio",
  "transmission-line-loss", "em-wavelength-vacuum", "induced-emf-magnitude",
  "ampere-force-magnitude", "lorentz-force-magnitude", "self-induction-emf",
  "oscillation-energy", "mechanical-wave-speed", "echo-ranging",
  "resonance-frequency-match", "bohr-transition-radiation", "work-at-angle",
  "source-efficiency", "coulomb-force", "electric-field-strength",
  "electric-field-superposition", "electrostatic-field-work", "point-charge-potential",
  "multi-source-potential", "uniform-field-voltage", "parallel-plate-capacitance",
  "household-load-current", "monoatomic-internal-energy", "isobaric-gas-work",
  "first-law-energy-balance", "heat-engine-efficiency", "conductor-resistance",
] as const satisfies readonly TemplateId[];

// Only these families use the original precision-based calibration.
// Authored tasks can ask for hundredths at D1: difficulty is not an answer
// precision specification (see lib/answer/numeric-answer.ts).
export const PRECISION_CALIBRATED_IDS = [
  "average-speed-segments", "work-force-distance", "electric-power",
  "heat-balance-simple", "plane-mirror-separation", "refractive-index-speed",
  "thin-lens-image-distance", "lens-optical-power",
] as const satisfies readonly TemplateId[];

// Finite pools follow authored case tables and constrained parameter ranges.
// Repetition after exhaustion is allowed; early repetition or pool shrinkage
// is not. The lifecycle test checks the entire pool, not only a lower bound.
export const FINITE_TEXT_POOLS: Partial<Record<TemplateId, number>> = {
  "free-fall": 32,
  "relative-velocity-vectors": 36,
  "length-unit-conversion": 48,
  "projectile-components": 28, // 15 times + 3 heights + 10 valid ranges
  "oscillation-frequency": 4,
  "spring-oscillation-period": 5,
  "mathematical-pendulum-period": 5,
  "lc-period": 5,
  "ac-oscillogram-frequency": 5,
  "transformer-voltage-ratio": 5,
  "transmission-line-loss": 5,
  "em-wavelength-vacuum": 5,
  "ampere-force-magnitude": 8,
  "lorentz-force-magnitude": 27,
  "metal-temperature-current": 6,
  "electrolyte-ion-transport": 6,
  "gas-discharge-conditions": 6,
  "semiconductor-carriers": 6,
  "oscillation-energy": 5,
  "mechanical-wave-speed": 5,
  "echo-ranging": 5,
  "resonance-frequency-match": 5,
  "bohr-transition-radiation": 8,
  "magnetic-field-direction": 4,
  "resultant-force-2d": 24,
  "household-load-current": 15,
  "ideal-gas-isoprocess": 18,
  "solid-structure-properties": 4,
  "liquid-structure-properties": 4,
  "vapor-dynamic-equilibrium": 4,
  "first-law-energy-balance": 12,
  "molecule-count-from-mass": 28,
  "particle-concentration": 19,
  "molecular-kinetic-energy": 12,
  "reflection-angle": 45,
  "plane-mirror-separation": 39,
  "refraction-direction": 4,
  "shadow-and-penumbra": 4,
  "refractive-index-speed": 18,
  "snell-index-ratio": 22,
  "lens-optical-power": 18,
  "lens-image-properties": 5,
  "vision-correction": 4,
  "conductor-resistance": 20,
};
