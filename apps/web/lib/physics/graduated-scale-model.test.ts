import assert from "node:assert/strict";
import test from "node:test";
import {
  GRADUATED_SCALE_ACTUAL_VOLUME_ML,
  GRADUATED_SCALE_BOTTOM_Y,
  GRADUATED_SCALE_MAX_ML,
  GRADUATED_SCALE_MIN_ML,
  GRADUATED_SCALE_TOP_Y,
  GRADUATED_SCALE_UNIT,
  getGraduatedScale,
  graduatedScaleY,
} from "./graduated-scale-model.ts";

test("two graduations read one fixed water level with the correct division and unit", () => {
  const coarse = getGraduatedScale("coarse");
  const fine = getGraduatedScale("fine");

  assert.equal(GRADUATED_SCALE_UNIT, "мл");
  assert.equal(GRADUATED_SCALE_ACTUAL_VOLUME_ML, 32);
  assert.equal(graduatedScaleY(GRADUATED_SCALE_MIN_ML), GRADUATED_SCALE_BOTTOM_Y);
  assert.equal(graduatedScaleY(GRADUATED_SCALE_MAX_ML), GRADUATED_SCALE_TOP_Y);
  assert.equal(coarse.meniscusY, graduatedScaleY(32));
  assert.equal(fine.meniscusY, coarse.meniscusY);
  assert.equal(coarse.meniscusY, 100);

  assert.deepEqual(coarse.ticks.map(tick => tick.value), [20, 30, 40]);
  assert.deepEqual(fine.ticks.map(tick => tick.value), [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]);
  assert.equal(coarse.intervals, 2);
  assert.equal(fine.intervals, 10);
  assert.equal(coarse.ticks.find(tick => tick.value === 30)?.y, fine.ticks.find(tick => tick.value === 30)?.y);
  assert.deepEqual(fine.ticks.filter(tick => tick.label).map(tick => tick.value), [20, 30, 40]);

  assert.deepEqual([coarse.step, coarse.reading, coarse.uncertainty], [10, 30, 5]);
  assert.deepEqual([fine.step, fine.reading, fine.uncertainty], [2, 32, 1]);
  assert.equal(fine.ticks.find(tick => tick.value === 32)?.y, fine.meniscusY);
});
