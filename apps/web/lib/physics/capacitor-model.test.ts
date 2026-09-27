import assert from "node:assert/strict";
import test from "node:test";
import { capacitancePf, disconnectedVoltageV } from "./capacitor-model.ts";

test("disconnected plate capacitor changes voltage through geometry while charge stays fixed", () => {
  const initial = capacitancePf({ overlapCm2: 100, gapMm: 2, relativePermittivity: 1 });
  const initialVoltage = disconnectedVoltageV(initial);
  assert.equal(initial, 44.25);
  assert.equal(capacitancePf({ overlapCm2: 50, gapMm: 2, relativePermittivity: 1 }), initial / 2);
  assert.equal(capacitancePf({ overlapCm2: 100, gapMm: 4, relativePermittivity: 1 }), initial / 2);
  assert.equal(capacitancePf({ overlapCm2: 100, gapMm: 2, relativePermittivity: 2 }), initial * 2);
  assert.equal(disconnectedVoltageV(initial / 2), initialVoltage * 2);
  assert.equal(disconnectedVoltageV(initial * 2), initialVoltage / 2);
});

test("capacitor model rejects nonphysical area and gap", () => {
  assert.throws(() => capacitancePf({ overlapCm2: 0, gapMm: 2, relativePermittivity: 1 }), RangeError);
  assert.throws(() => capacitancePf({ overlapCm2: 100, gapMm: 0, relativePermittivity: 1 }), RangeError);
  assert.throws(() => disconnectedVoltageV(0), RangeError);
});
