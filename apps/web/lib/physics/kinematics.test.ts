import assert from "node:assert/strict";
import test from "node:test";
import {
  acceleratedMotion,
  nthSecondDisplacement,
  uniformMotion,
} from "./kinematics.ts";

test("uniformMotion keeps velocity constant and advances coordinate linearly", () => {
  assert.deepEqual(uniformMotion({ x0: 30, v: -4, t: 5 }), {
    x: 10,
    displacement: -20,
    v: -4,
  });
});

test("acceleratedMotion returns coordinate, displacement, and final velocity", () => {
  assert.deepEqual(acceleratedMotion({ x0: 5, v0: 2, a: 3, t: 4 }), {
    x: 37,
    displacement: 32,
    v: 14,
  });
});

test("nthSecondDisplacement isolates one second from cumulative displacement", () => {
  assert.equal(nthSecondDisplacement({ a: 2, n: 3 }), 5);
});

test("motion helpers reject invalid time intervals", () => {
  assert.throws(() => uniformMotion({ v: 2, t: -1 }), RangeError);
  assert.throws(() => acceleratedMotion({ a: 2, t: -1 }), RangeError);
  assert.throws(() => nthSecondDisplacement({ a: 2, n: 0 }), RangeError);
});
