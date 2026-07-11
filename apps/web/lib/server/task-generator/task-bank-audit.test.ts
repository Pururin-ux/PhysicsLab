import assert from "node:assert/strict";
import test from "node:test";
import { auditFamily } from "./task-bank-audit.ts";

test("audit uses public content rather than task ids for diversity", () => {
  const row = auditFamily("reflection-angle");
  assert.equal(row.id, "reflection-angle");
  assert.ok(row.raw >= row.valid);
  assert.ok(row.texts <= row.valid);
  assert.ok(row.answers <= row.valid);
  assert.equal(row.duplicateOptions, 0);
});
