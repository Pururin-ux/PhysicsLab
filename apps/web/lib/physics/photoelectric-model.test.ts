import assert from "node:assert/strict";
import test from "node:test";
import { getPhotoelectricResult } from "./photoelectric-model.ts";

test("photon energy uses the textbook values of h and the elementary charge", () => {
  const result = getPhotoelectricResult("sodium", 8, 1);

  assert.ok(Math.abs(result.photonEnergyEv - 3.315) < 1e-12);
  assert.ok(Math.abs(result.maximumKineticEnergyEv - 0.9945) < 1e-12);
  assert.equal(result.stoppingPotentialV, result.maximumKineticEnergyEv);
});

test("at fixed frequency, greater intensity raises relative saturation current, not electron energy", () => {
  const dim = getPhotoelectricResult("sodium", 8, 1);
  const bright = getPhotoelectricResult("sodium", 8, 3);

  assert.equal(bright.maximumKineticEnergyEv, dim.maximumKineticEnergyEv);
  assert.equal(bright.photonEnergyEv, dim.photonEnergyEv);
  assert.equal(bright.relativeSaturationCurrent, 3 * dim.relativeSaturationCurrent);
});

test("below the red boundary, increasing intensity still produces no photoelectrons", () => {
  const result = getPhotoelectricResult("sodium", 5.5, 3);

  assert.equal(result.emissionPossible, false);
  assert.equal(result.maximumKineticEnergyEv, 0);
  assert.equal(result.stoppingPotentialV, 0);
  assert.equal(result.relativeSaturationCurrent, 0);
});

test("at the red boundary, maximum kinetic energy and stopping potential are zero", () => {
  const result = getPhotoelectricResult("sodium", 5.6, 2);

  assert.equal(result.emissionPossible, true);
  assert.equal(result.maximumKineticEnergyEv, 0);
  assert.equal(result.stoppingPotentialV, 0);
  assert.equal(result.relativeSaturationCurrent, 2);
});

test("above threshold, maximum kinetic energy grows linearly with frequency", () => {
  const lower = getPhotoelectricResult("zinc", 10, 1);
  const higher = getPhotoelectricResult("zinc", 11, 1);

  assert.ok(Math.abs((higher.maximumKineticEnergyEv - lower.maximumKineticEnergyEv) - 0.414375) < 1e-12);
});
