import assert from "node:assert/strict";
import test from "node:test";
import { calculateInductionChange, orientedMagneticFluxWebers } from "./induction-model.ts";

function near(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1e-15, Math.abs(expected) * 1e-12),
    `${actual} should be close to ${expected}`);
}

const setup = {
  loopAreaSquareMetres: 0.02,
  turnCount: 10,
  durationSeconds: 0.1,
} as const;

test("oriented flux changes sign with the field angle and vanishes at a right angle", () => {
  near(orientedMagneticFluxWebers({ magneticFieldTeslas: 0.5, normalAngleRadians: 0 }, 0.02), 0.01);
  assert.equal(orientedMagneticFluxWebers({ magneticFieldTeslas: 0.5, normalAngleRadians: Math.PI / 2 }, 0.02), 0);
  near(orientedMagneticFluxWebers({ magneticFieldTeslas: 0.5, normalAngleRadians: Math.PI }, 0.02), -0.01);
  assert.equal(orientedMagneticFluxWebers({ magneticFieldTeslas: 0, normalAngleRadians: 0 }, 0.02), 0);
});

test("increasing positive flux gives negative average EMF and an opposing induced field", () => {
  const reading = calculateInductionChange({
    ...setup,
    initial: { magneticFieldTeslas: 0.2, normalAngleRadians: 0 },
    final: { magneticFieldTeslas: 0.5, normalAngleRadians: 0 },
  });

  near(reading.initialFluxWebers, 0.004);
  near(reading.finalFluxWebers, 0.01);
  near(reading.fluxChangeWebers, 0.006);
  near(reading.averageEmfVolts, -0.6); // 10 turns × 0.006 Wb / 0.1 s = 0.6 V.
  near(reading.averageEmfMagnitudeVolts, 0.6);
  assert.equal(reading.inducedFieldDirection, "opposite-normal");
  assert.equal(reading.closedLoopCurrentSense, "clockwise");
});

test("decreasing flux reverses the Lenz direction; unchanged flux produces no EMF", () => {
  const initial = { magneticFieldTeslas: 0.5, normalAngleRadians: 0 };
  const final = { magneticFieldTeslas: 0.2, normalAngleRadians: 0 };
  const decreasing = calculateInductionChange({ ...setup, initial, final });
  near(decreasing.averageEmfVolts, 0.6);
  assert.equal(decreasing.inducedFieldDirection, "along-normal");
  assert.equal(decreasing.closedLoopCurrentSense, "counterclockwise");

  const unchanged = calculateInductionChange({ ...setup, initial, final: initial });
  assert.equal(unchanged.fluxChangeWebers, 0);
  assert.equal(unchanged.averageEmfVolts, 0);
  assert.equal(unchanged.inducedFieldDirection, "none");
  assert.equal(unchanged.closedLoopCurrentSense, "none");
});

test("rotation through a perpendicular position follows flux change, not field magnitude", () => {
  const reading = calculateInductionChange({
    ...setup,
    initial: { magneticFieldTeslas: 0.5, normalAngleRadians: 0 },
    final: { magneticFieldTeslas: 0.5, normalAngleRadians: Math.PI / 2 },
  });
  near(reading.averageEmfVolts, 1);
  assert.equal(reading.closedLoopCurrentSense, "counterclockwise");
});

test("invalid geometry, time and turns are rejected", () => {
  const input = {
    ...setup,
    initial: { magneticFieldTeslas: 0.5, normalAngleRadians: 0 },
    final: { magneticFieldTeslas: 0.2, normalAngleRadians: 0 },
  };
  for (const bad of [
    { loopAreaSquareMetres: 0 }, { loopAreaSquareMetres: Infinity },
    { turnCount: 0 }, { turnCount: 1.5 }, { durationSeconds: 0 },
    { durationSeconds: Number.NaN },
    { initial: { ...input.initial, magneticFieldTeslas: -0.1 } },
    { final: { ...input.final, normalAngleRadians: Math.PI + 0.1 } },
  ]) assert.throws(() => calculateInductionChange({ ...input, ...bad }), RangeError);
});
