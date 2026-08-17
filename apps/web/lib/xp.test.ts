import assert from "node:assert/strict";
import test from "node:test";
import { calcXP } from "./xp.ts";

test("XP is not awarded for a wrong answer", () => {
  assert.equal(calcXP({ correct: false, attempt: 1, streak: 1 }), 0);
});

test("first-attempt correct answer awards base XP", () => {
  assert.equal(calcXP({ correct: true, attempt: 1, streak: 1 }), 10);
});

test("second-attempt correct answer awards reduced XP", () => {
  assert.equal(calcXP({ correct: true, attempt: 2, streak: 1 }), 5);
});

test("third and fifth streak thresholds add one-time bonuses", () => {
  assert.equal(calcXP({ correct: true, attempt: 1, streak: 3 }), 25);
  assert.equal(calcXP({ correct: true, attempt: 1, streak: 5 }), 35);
});
