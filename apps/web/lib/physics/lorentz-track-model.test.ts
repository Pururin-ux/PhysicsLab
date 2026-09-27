import assert from "node:assert/strict";
import test from "node:test";
import { calculateLorentzTrack } from "./lorentz-track-model.ts";

const electron = {
  chargeCoulombs: -1.6e-19,
  massKilograms: 9.1e-31,
  speedMetresPerSecond: 2e6,
  magneticInductionTeslas: 1e-3,
  fieldDirection: "into-page" as const,
};

test("a perpendicular electron bends without a change of speed in the prescribed field", () => {
  const reading = calculateLorentzTrack(electron);
  assert.equal(reading.bend, "down");
  assert.ok(Math.abs(reading.forceMagnitudeNewtons - 3.2e-16) < 1e-28);
  assert.ok(Math.abs(reading.radiusMetres! - 0.011375) < 1e-12);
  assert.ok(Math.abs(reading.periodSeconds! - 2 * Math.PI * 9.1e-31 / (1.6e-22)) < 1e-18);
  assert.equal(calculateLorentzTrack({ ...electron, fieldDirection: "out-of-page" }).bend, "up");
});

test("more B tightens the turn; more speed widens it but leaves its period unchanged", () => {
  const base = calculateLorentzTrack(electron);
  const strong = calculateLorentzTrack({ ...electron, magneticInductionTeslas: 2e-3 });
  const faster = calculateLorentzTrack({ ...electron, speedMetresPerSecond: 4e6 });
  assert.equal(strong.radiusMetres, base.radiusMetres! / 2);
  assert.equal(strong.periodSeconds, base.periodSeconds! / 2);
  assert.equal(faster.radiusMetres, base.radiusMetres! * 2);
  assert.equal(faster.periodSeconds, base.periodSeconds);
  assert.equal(faster.forceMagnitudeNewtons, base.forceMagnitudeNewtons * 2);
});

test("no magnetic field leaves a straight trace and no magnetic force", () => {
  assert.deepEqual(calculateLorentzTrack({ ...electron, magneticInductionTeslas: 0 }), {
    forceMagnitudeNewtons: 0,
    radiusMetres: null,
    periodSeconds: null,
    bend: "straight",
  });
});

test("invalid charges, speeds and fields cannot make misleading tracks", () => {
  assert.throws(() => calculateLorentzTrack({ ...electron, chargeCoulombs: 0 }), RangeError);
  assert.throws(() => calculateLorentzTrack({ ...electron, speedMetresPerSecond: -1 }), RangeError);
  assert.throws(() => calculateLorentzTrack({ ...electron, magneticInductionTeslas: Number.NaN }), RangeError);
});
