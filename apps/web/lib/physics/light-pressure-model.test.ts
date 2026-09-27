import assert from "node:assert/strict";
import test from "node:test";
import { getLightPressureState } from "./light-pressure-model.ts";

test("an absorbing surface receives the incoming photon momentum", () => {
  const result = getLightPressureState("absorbed");

  assert.equal(result.outgoingLightMomentumUnits, 0);
  assert.equal(result.lightMomentumChangeUnits, -1);
  assert.equal(result.plateImpulseUnits, 1);
  assert.equal(result.relativePressure, 1);
});

test("an ideal mirror reverses photon momentum and doubles the plate impulse", () => {
  const result = getLightPressureState("reflected");

  assert.equal(result.outgoingLightMomentumUnits, -1);
  assert.equal(result.lightMomentumChangeUnits, -2);
  assert.equal(result.plateImpulseUnits, 2);
  assert.equal(result.relativePressure / getLightPressureState("absorbed").relativePressure, 2);
});
