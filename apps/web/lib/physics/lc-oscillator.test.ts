import assert from "node:assert/strict";
import test from "node:test";
import { calculateLcOscillator } from "./lc-oscillator.ts";

const circuit = {
  capacitanceMicrofarads: 2,
  inductanceHenrys: 0.5,
  initialVoltageVolts: 10,
};

function assertClose(actual: number, expected: number): void {
  assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-10),
    `expected ${actual} to be close to ${expected}`);
}

test("a charged capacitor transfers its energy to the inductor after a quarter period", () => {
  const start = calculateLcOscillator({ ...circuit, phaseFraction: 0 });
  const quarter = calculateLcOscillator({ ...circuit, phaseFraction: 0.25 });

  assertClose(start.periodSeconds, 2 * Math.PI * 0.001);
  assertClose(start.chargeCoulombs, 20e-6);
  assertClose(start.currentAmperes, 0);
  assertClose(start.initialEnergyJoules, 1e-4);
  assertClose(start.electricEnergyJoules, start.initialEnergyJoules);
  assertClose(start.magneticEnergyJoules, 0);

  assertClose(quarter.chargeCoulombs, 0);
  assertClose(quarter.currentAmperes, 0.02);
  assertClose(quarter.electricEnergyJoules, 0);
  assertClose(quarter.magneticEnergyJoules, start.initialEnergyJoules);
});

test("the charge reverses after half a period and current reverses later", () => {
  const half = calculateLcOscillator({ ...circuit, phaseFraction: 0.5 });
  const threeQuarters = calculateLcOscillator({ ...circuit, phaseFraction: 0.75 });
  const full = calculateLcOscillator({ ...circuit, phaseFraction: 1 });

  assertClose(half.chargeCoulombs, -20e-6);
  assertClose(half.currentAmperes, 0);
  assertClose(half.electricEnergyJoules, half.initialEnergyJoules);
  assertClose(threeQuarters.currentAmperes, -0.02);
  assertClose(full.chargeCoulombs, 20e-6);
  assertClose(full.currentAmperes, 0);
});

test("energy is conserved between turning points and period scales with square root of L and C", () => {
  const phase = 0.137;
  const base = calculateLcOscillator({ ...circuit, phaseFraction: phase });
  const fourTimesL = calculateLcOscillator({ ...circuit, inductanceHenrys: 2, phaseFraction: phase });
  const fourTimesC = calculateLcOscillator({ ...circuit, capacitanceMicrofarads: 8, phaseFraction: phase });

  assertClose(base.electricEnergyJoules + base.magneticEnergyJoules, base.initialEnergyJoules);
  assertClose(fourTimesL.periodSeconds, 2 * base.periodSeconds);
  assertClose(fourTimesC.periodSeconds, 2 * base.periodSeconds);
});

test("the model rejects invalid components, voltage and phase", () => {
  const invalidInputs = [
    { capacitanceMicrofarads: 0 },
    { capacitanceMicrofarads: Number.NaN },
    { inductanceHenrys: -1 },
    { inductanceHenrys: Number.POSITIVE_INFINITY },
    { initialVoltageVolts: 0 },
    { initialVoltageVolts: Number.NaN },
    { phaseFraction: -0.01 },
    { phaseFraction: 1.01 },
    { phaseFraction: Number.NaN },
  ];

  for (const invalidInput of invalidInputs) {
    assert.throws(() => calculateLcOscillator({ ...circuit, phaseFraction: 0, ...invalidInput }), RangeError);
  }
});
