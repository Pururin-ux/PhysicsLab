import assert from "node:assert/strict";
import test from "node:test";
import { calculateAmpereForce } from "./ampere-force-model.ts";

const base = { magneticInductionTeslas: 0.4, currentAmperes: 2, conductorLengthMetres: 0.5 };

test("force on a perpendicular segment equals BIl, while a parallel segment has none", () => {
  assert.equal(calculateAmpereForce({ ...base, angleDegrees: 90 }).forceNewtons, 0.4);
  assert.equal(calculateAmpereForce({ ...base, angleDegrees: 0 }).forceNewtons, 0);
  assert.equal(calculateAmpereForce({ ...base, angleDegrees: 180 }).forceNewtons, 0);
});

test("force changes with the sine of the angle, not with a change of external B", () => {
  const at30 = calculateAmpereForce({ ...base, angleDegrees: 30 });
  const at150 = calculateAmpereForce({ ...base, angleDegrees: 150 });
  assert.ok(Math.abs(at30.forceNewtons - 0.2) < 1e-12);
  assert.ok(Math.abs(at150.forceNewtons - 0.2) < 1e-12);
  assert.equal(at30.maximumForceNewtons, 0.4);
  assert.equal(calculateAmpereForce({ ...base, currentAmperes: 4, angleDegrees: 90 }).forceNewtons, 0.8);
});

test("invalid or non-finite laboratory conditions are rejected", () => {
  assert.throws(() => calculateAmpereForce({ ...base, angleDegrees: 181 }), RangeError);
  assert.throws(() => calculateAmpereForce({ ...base, magneticInductionTeslas: -1, angleDegrees: 90 }), RangeError);
  assert.throws(() => calculateAmpereForce({ ...base, currentAmperes: Number.POSITIVE_INFINITY, angleDegrees: 90 }), RangeError);
});
