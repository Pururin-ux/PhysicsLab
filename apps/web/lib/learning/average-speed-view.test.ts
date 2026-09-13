import test from "node:test";
import assert from "node:assert/strict";
import { speedTapes, speedTapeScale } from "./average-speed-view.ts";

test("one second per tape segment; a fixed metre scale across slider states", () => {
  for (const [seconds, distances] of [[1, [2, 72]], [5, [10, 40]], [8, [16, 16]], [9, [18, 8]]] as const) {
    const tapes = speedTapes(seconds);
    assert.equal(tapes[0].seconds + tapes[1].seconds, 10);
    assert.deepEqual(tapes.map(tape => tape.distance), distances);
    for (const tape of tapes) {
      assert.equal(tape.widthPercent / 100 * speedTapeScale, tape.distance);
      assert.equal(tape.widthPercent / tape.seconds, tape.speed / speedTapeScale * 100);
      assert.ok(tape.widthPercent > 0 && tape.widthPercent <= 100);
    }
    assert.equal(tapes[1].widthPercent / tapes[1].seconds, 4 * tapes[0].widthPercent / tapes[0].seconds);
  }
  assert.equal(speedTapes(8)[0].widthPercent, speedTapes(8)[1].widthPercent);
});
