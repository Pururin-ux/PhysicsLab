import assert from "node:assert/strict";
import test from "node:test";
import { calculateSelfInduction } from "./self-induction-model.ts";

test("the same endpoint current stores the same energy, while a faster rise induces more EMF", () => {
  const conditions = { inductanceHenries: 0.4, initialCurrentAmperes: 1, finalCurrentAmperes: 3 };
  const slow = calculateSelfInduction({ ...conditions, durationSeconds: 2 });
  const fast = calculateSelfInduction({ ...conditions, durationSeconds: 0.5 });
  assert.equal(slow.averageSelfEmfVolts, -0.4);
  assert.equal(fast.averageSelfEmfVolts, -1.6);
  assert.equal(fast.finalMagneticEnergyJoules, 1.8);
  assert.equal(slow.finalMagneticEnergyJoules, fast.finalMagneticEnergyJoules);
});

test("a falling current reverses the self-EMF and releases stored field energy", () => {
  const reading = calculateSelfInduction({ inductanceHenries: 0.4, initialCurrentAmperes: 3, finalCurrentAmperes: 1, durationSeconds: 1 });
  assert.equal(reading.averageSelfEmfVolts, 0.8);
  assert.equal(reading.magneticEnergyChangeJoules, -1.6);
});

test("a steady current has stored energy but no self-EMF", () => {
  const reading = calculateSelfInduction({ inductanceHenries: 0.4, initialCurrentAmperes: 3, finalCurrentAmperes: 3, durationSeconds: 1 });
  assert.equal(reading.averageSelfEmfVolts, 0);
  assert.equal(reading.finalMagneticEnergyJoules, 1.8);
});

test("rejects unphysical inputs", () => {
  assert.throws(() => calculateSelfInduction({ inductanceHenries: 0, initialCurrentAmperes: 0, finalCurrentAmperes: 1, durationSeconds: 1 }), RangeError);
  assert.throws(() => calculateSelfInduction({ inductanceHenries: 0.4, initialCurrentAmperes: 0, finalCurrentAmperes: 1, durationSeconds: 0 }), RangeError);
});
