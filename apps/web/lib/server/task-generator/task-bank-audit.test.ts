import assert from "node:assert/strict";
import test from "node:test";
import { auditFamily, auditSessions } from "./task-bank-audit.ts";

test("audit uses public content rather than task ids for diversity", () => {
  const row = auditFamily("reflection-angle");
  assert.equal(row.id, "reflection-angle");
  assert.ok(row.raw >= row.valid);
  assert.ok(row.texts <= row.valid);
  assert.ok(row.answers <= row.valid);
  assert.equal(row.duplicateOptions, 0);
});

test("session audit covers 50 batches without duplicate text", async () => {
  const rows = await auditSessions();
  assert.equal(rows.length, 6);
  assert.ok(rows.every((row) => row.batches === 50));
  assert.ok(rows.every((row) => row.duplicateTextSessions === 0));
  assert.ok(rows.every((row) => row.difficultyCounts[1] === 250));
  assert.ok(rows.every((row) => row.difficultyCounts[2] === 150));
  assert.ok(rows.every((row) => row.difficultyCounts[3] === 100));
});
