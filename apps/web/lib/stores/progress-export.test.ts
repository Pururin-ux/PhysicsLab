import assert from "node:assert/strict";
import test from "node:test";
import {
  EXPORT_FORMAT,
  EXPORT_FORMAT_VERSION,
  buildExportFile,
  parseExportFile,
  summarizeExport,
} from "./progress-export.ts";
import { $appProgress, resetProgress, recordCompletedSession } from "./progress-store.ts";
import { $xp } from "./session-store.ts";

// applyImport пишет в localStorage и в node не проверяется — его покрывает
// e2e (tests/flows.spec.ts). Здесь — построение, разбор и сводка файла.

test("build -> parse -> summarize: круговой прогон с живыми данными", () => {
  resetProgress();
  recordCompletedSession({
    topicId: "kinematics",
    score: 8,
    total: 10,
    answers: [],
  });
  $xp.set(120);

  const file = buildExportFile();
  assert.equal(file.format, EXPORT_FORMAT);
  assert.equal(file.formatVersion, EXPORT_FORMAT_VERSION);

  const reparsed = parseExportFile(JSON.stringify(file));
  assert.ok(reparsed);

  const summary = summarizeExport(reparsed);
  assert.ok(summary);
  assert.equal(summary.solved, 10);
  assert.equal(summary.xp, 120);

  resetProgress();
  $xp.set(0);
});

test("parseExportFile отвергает мусор и чужие форматы", () => {
  assert.equal(parseExportFile("{broken"), null);
  assert.equal(parseExportFile(JSON.stringify({ format: "other", stores: {} })), null);
  assert.equal(
    parseExportFile(JSON.stringify({ format: EXPORT_FORMAT, formatVersion: 99, stores: {} })),
    null,
  );
});

test("summarizeExport без валидного прогресса — null", () => {
  const file = {
    format: EXPORT_FORMAT,
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    stores: {
      "physicslab-v3-progress-v1": { version: 99, data: {} },
    },
  };

  assert.equal(summarizeExport(parseExportFile(JSON.stringify(file))!), null);
});

test("экспорт отражает текущее состояние атомов, а не localStorage", () => {
  resetProgress();
  $xp.set(55);

  const file = buildExportFile();
  const summary = summarizeExport(file);

  assert.ok(summary);
  assert.equal(summary.xp, 55);
  assert.equal(summary.solved, 0);

  $xp.set(0);
});
