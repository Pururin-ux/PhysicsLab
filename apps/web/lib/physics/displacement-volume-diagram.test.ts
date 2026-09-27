import assert from "node:assert/strict";
import test from "node:test";
import {
  displacementVolumeY,
  isDisplacementVolumeDiagramSpec,
} from "./displacement-volume-diagram.ts";

test("both readings and 2 ml ticks use the same 0–60 ml scale", () => {
  assert.equal(displacementVolumeY(0), 280);
  assert.equal(displacementVolumeY(60), 40);

  for (const [initialReadingMl, finalReadingMl, initialY, finalY] of [
    [20, 32, 200, 152],
    [30, 50, 160, 80],
  ]) {
    assert.equal(isDisplacementVolumeDiagramSpec({ initialReadingMl, finalReadingMl, divisionMl: 2 }), true);
    assert.equal(displacementVolumeY(initialReadingMl), initialY);
    assert.equal(displacementVolumeY(finalReadingMl), finalY);
    assert.equal(initialY - finalY, (finalReadingMl - initialReadingMl) * 4);
  }

  for (let value = 0; value <= 60; value += 2) {
    assert.equal(displacementVolumeY(value), 280 - value * 4);
  }
});

test("diagram guard accepts other aligned readings and rejects invalid scale data", () => {
  const valid = { initialReadingMl: 10, finalReadingMl: 55, divisionMl: 5 };
  assert.equal(isDisplacementVolumeDiagramSpec(valid), true);

  for (const value of [
    null,
    [],
    { ...valid, initialReadingMl: -1 },
    { ...valid, initialReadingMl: 10.5 },
    { ...valid, finalReadingMl: 61 },
    { ...valid, finalReadingMl: 10 },
    { ...valid, divisionMl: 0 },
    { ...valid, divisionMl: Number.POSITIVE_INFINITY },
    { ...valid, divisionMl: 3 },
    { ...valid, divisionMl: 0.1 },
  ]) {
    assert.equal(isDisplacementVolumeDiagramSpec(value), false);
  }
  assert.throws(() => displacementVolumeY(-1), RangeError);
  assert.throws(() => displacementVolumeY(61), RangeError);
});
