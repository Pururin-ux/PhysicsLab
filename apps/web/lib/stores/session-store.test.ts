import assert from "node:assert/strict";
import test from "node:test";
import {
  $xp,
  $xpAward,
  addXP,
  resetSessionProgress,
  resetStoredXP,
} from "./session-store.ts";

test("XP store adds positive awards and exposes the latest award", () => {
  resetStoredXP();
  addXP(10);

  assert.equal($xp.get(), 10);
  assert.deepEqual($xpAward.get(), { id: 1, amount: 10 });
});

test("XP store ignores non-positive awards and keeps accumulated XP on session reset", () => {
  resetStoredXP();
  addXP(0);
  assert.equal($xp.get(), 0);
  assert.equal($xpAward.get(), null);

  addXP(5);
  resetSessionProgress();
  assert.equal($xp.get(), 5);
  assert.equal($xpAward.get(), null);
});
