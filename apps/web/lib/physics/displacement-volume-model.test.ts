import assert from "node:assert/strict";
import test from "node:test";
import { calculateDisplacementVolume, type DisplacementVolumeInput } from "./displacement-volume-model.ts";

const example: DisplacementVolumeInput = {
  initialReadingMl: 20,
  finalReadingMl: 32,
  divisionMl: 2,
  fullySubmerged: true,
  noSpill: true,
};

test("displacement gives the recorded volume in ml and cm³", () => {
  assert.deepEqual(calculateDisplacementVolume(example), {
    valid: true,
    volumeMl: 12,
    volumeCm3: 12,
    uncertainty: null,
  });
});

test("half-division reading bounds give a conditional conservative difference bound", () => {
  assert.deepEqual(calculateDisplacementVolume({
    ...example,
    assumeHalfDivisionReadingBound: true,
  }), {
    valid: true,
    volumeMl: 12,
    volumeCm3: 12,
    uncertainty: {
      basis: "half-division-per-reading",
      perReadingBoundMl: 1,
      conservativeDifferenceBoundMl: 2,
    },
  });
});

test("physical conditions and non-positive rises do not produce a body volume", () => {
  assert.deepEqual(calculateDisplacementVolume({ ...example, fullySubmerged: false }), {
    valid: false,
    reason: "not-fully-submerged",
  });
  assert.deepEqual(calculateDisplacementVolume({ ...example, noSpill: false }), {
    valid: false,
    reason: "spill",
  });
  for (const finalReadingMl of [20, 19]) {
    assert.deepEqual(calculateDisplacementVolume({ ...example, finalReadingMl }), {
      valid: false,
      reason: "non-positive-displacement",
    });
  }
});

test("invalid readings and division values are rejected", () => {
  for (const initialReadingMl of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateDisplacementVolume({ ...example, initialReadingMl }), RangeError);
  }
  for (const finalReadingMl of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateDisplacementVolume({ ...example, finalReadingMl }), RangeError);
  }
  for (const divisionMl of [0, -2, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateDisplacementVolume({ ...example, divisionMl }), RangeError);
  }
});
