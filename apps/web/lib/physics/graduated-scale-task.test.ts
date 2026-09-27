import assert from "node:assert/strict";
import test from "node:test";
import { getGraduatedScaleTask } from "./graduated-scale-task.ts";

test("every valid generated scale has exact endpoints, equal intervals and a meniscus on its tick", () => {
  let validCount = 0;

  for (const lowerMark of [10, 20, 30]) {
    for (const markRange of [20, 30, 40]) {
      for (const markCount of [5, 7, 9, 11]) {
        for (let positionFromLower = 1; positionFromLower <= 9; positionFromLower += 1) {
          const intervalCount = markCount - 1;
          const projection = getGraduatedScaleTask({ lowerMark, markRange, markCount, positionFromLower });
          const allowed = markRange % intervalCount === 0 && positionFromLower < intervalCount;
          if (!allowed) {
            assert.equal(projection, null);
            continue;
          }

          validCount += 1;
          assert.ok(projection);
          assert.equal(projection.lowerMark, lowerMark);
          assert.equal(projection.upperMark, lowerMark + markRange);
          assert.equal(projection.markCount, markCount);
          assert.equal(projection.positionFromLower, positionFromLower);
          assert.equal(projection.intervalCount, intervalCount);
          assert.equal(projection.divisionValue, markRange / intervalCount);
          assert.equal(projection.ticks.length, markCount);
          assert.deepEqual([projection.ticks[0].value, projection.ticks[intervalCount].value],
            [lowerMark, lowerMark + markRange]);
          assert.equal(projection.ticks[0].y, 220);
          assert.equal(projection.ticks[intervalCount].y, 20);
          for (const [index, tick] of projection.ticks.entries()) {
            assert.equal(tick.value, lowerMark + index * (markRange / intervalCount));
            assert.ok(Math.abs(tick.y - (220 - index * 200 / intervalCount)) < 1e-9);
          }
          assert.equal(projection.meniscusY, projection.ticks[positionFromLower].y);
        }
      }
    }
  }

  assert.equal(validCount, 135);
});

test("malformed or out-of-range task parameters have no projection", () => {
  const valid = { lowerMark: 10, markRange: 20, markCount: 5, positionFromLower: 1 };
  for (const params of [
    null,
    [],
    "10",
    {},
    { ...valid, lowerMark: "10" },
    { ...valid, lowerMark: 0 },
    { ...valid, markRange: Number.POSITIVE_INFINITY },
    { ...valid, markRange: 25 },
    { ...valid, markCount: 4 },
    { ...valid, markCount: 7 },
    { ...valid, positionFromLower: 0 },
    { ...valid, positionFromLower: 4 },
    { ...valid, positionFromLower: 1.5 },
  ]) {
    assert.equal(getGraduatedScaleTask(params), null);
  }
});
