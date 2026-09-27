import assert from "node:assert/strict";
import test from "node:test";
import { AC_GENERATOR_SETUP, calculateAcGenerator } from "./ac-generator.ts";

const read = (phaseFraction: number, frequencyHz = 1) =>
  calculateAcGenerator({ ...AC_GENERATOR_SETUP, phaseFraction, frequencyHz });

function near(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-10),
    `${actual} should be close to ${expected}`);
}

test("coil flux, induced emf and resistive current agree at quarter turns", () => {
  const start = read(0);
  const quarter = read(0.25);
  const half = read(0.5);
  const threeQuarters = read(0.75);
  const full = read(1);

  near(start.fluxWebers, 0.02);
  near(start.emfVolts, 0);
  near(start.currentAmperes, 0);
  near(quarter.fluxWebers, 0);
  near(quarter.emfVolts, quarter.peakEmfVolts);
  near(quarter.currentAmperes, quarter.peakCurrentAmperes);
  near(half.fluxWebers, -0.02);
  near(half.currentAmperes, 0);
  near(threeQuarters.currentAmperes, -threeQuarters.peakCurrentAmperes);
  near(full.fluxWebers, start.fluxWebers);
  near(full.currentAmperes, 0);
});

test("doubling rotation frequency halves the period and doubles the emf and current amplitude", () => {
  const slow = read(0.25, 1);
  const fast = read(0.25, 2);
  near(slow.periodSeconds, 1);
  near(fast.periodSeconds, 0.5);
  near(fast.fluxWebers, slow.fluxWebers);
  near(fast.peakEmfVolts, 2 * slow.peakEmfVolts);
  near(fast.peakCurrentAmperes, 2 * slow.peakCurrentAmperes);
  near(fast.currentAmperes, fast.emfVolts / AC_GENERATOR_SETUP.resistanceOhms);
});

test("invalid phase or apparatus parameters are rejected", () => {
  for (const input of [
    { frequencyHz: 0 }, { frequencyHz: Number.NaN }, { phaseFraction: -0.1 },
    { phaseFraction: 1.1 }, { phaseFraction: Number.NaN }, { magneticFieldTeslas: 0 },
    { loopAreaSquareMetres: -1 }, { turnCount: Infinity }, { resistanceOhms: 0 },
  ]) {
    assert.throws(() => calculateAcGenerator({ ...AC_GENERATOR_SETUP, frequencyHz: 1, phaseFraction: 0, ...input }), RangeError);
  }
});
