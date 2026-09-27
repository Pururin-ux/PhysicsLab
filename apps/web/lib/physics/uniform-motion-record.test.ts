import assert from "node:assert/strict";
import test from "node:test";
import { motionRecords, summarizeMotionRecord } from "./uniform-motion-record.ts";

test("two simulated journeys have the same total path and mean speed, but different sampled intervals", () => {
  const [steady, changing] = motionRecords.map(summarizeMotionRecord);

  assert.deepEqual(steady.intervalsM, [3, 3, 3]);
  assert.deepEqual(changing.intervalsM, [2, 3, 4]);
  assert.equal(steady.equalSampledIntervals, true);
  assert.equal(changing.equalSampledIntervals, false);
  assert.equal(steady.totalPathM, 9);
  assert.equal(changing.totalPathM, steady.totalPathM);
  assert.equal(steady.totalTimeS, 3);
  assert.equal(changing.totalTimeS, steady.totalTimeS);
  assert.equal(steady.meanSpeedMPerS, 3);
  assert.equal(changing.meanSpeedMPerS, steady.meanSpeedMPerS);
});

test("the four positions describe consistent marks at 0, 1, 2, and 3 seconds", () => {
  assert.deepEqual(motionRecords.map((record) => record.id), ["steady", "changing"]);
  for (const record of motionRecords) {
    assert.equal(record.stepSeconds, 1);
    assert.deepEqual(record.positionsM.map((_, index) => index * record.stepSeconds), [0, 1, 2, 3]);
    assert.equal(record.positionsM[0], 0);
    assert.equal(record.positionsM.at(-1), 9);
    assert.ok(record.positionsM.every((position) => position >= 0 && position <= 9));
    assert.ok(record.positionsM.every((position, index) => index === 0 || position >= record.positionsM[index - 1]));
    assert.equal(summarizeMotionRecord(record).intervalsM.reduce((sum, path) => sum + path, 0), 9);
  }
});
