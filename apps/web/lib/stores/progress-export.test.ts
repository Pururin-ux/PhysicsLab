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

test("summarizeExport rejects a file with any corrupt present store", () => {
  resetProgress();
  recordCompletedSession({
    topicId: "kinematics",
    score: 8,
    total: 10,
    answers: [],
  });
  $xp.set(120);

  const file = buildExportFile();
  file.stores["physicslab-v3-xp-v1"] = { version: 1, data: "not-a-number" };

  assert.equal(summarizeExport(file), null);

  resetProgress();
  $xp.set(0);
});

// Контракт импорта, прибитый гвоздями: отсутствующий необязательный стор —
// допустим (частичный/старый экспорт), присутствующий-но-нечитаемый —
// отклоняет весь файл. Никакой тихой замены битых данных на [] или 0.
test("adversarial: каждый битый присутствующий стор отклоняет весь файл", () => {
  resetProgress();
  recordCompletedSession({ topicId: "kinematics", score: 8, total: 10, answers: [] });

  const corruptions: [string, unknown][] = [
    ["physicslab-v3-exam-log-v1", { version: 1, data: "не-массив" }],
    ["physicslab-v3-practice-log-v1", { version: 1, data: { нет: "массива" } }],
    ["physicslab-v3-xp-v1", { version: 1, data: -5 }],
    // null на месте конверта — нечитаем (JSON никогда не даёт undefined,
    // а null не проходит ни конверт, ни один сниффер).
    ["physicslab-v3-xp-v1", null],
    // Конверт из будущего: отклоняем файл целиком, а не молча теряем стор.
    ["physicslab-v3-exam-log-v1", { version: 99, data: [] }],
    // Кривая форма конверта: версия строкой.
    ["physicslab-v3-practice-log-v1", { version: "1", data: [] }],
  ];

  for (const [key, value] of corruptions) {
    const file = buildExportFile();
    (file.stores as Record<string, unknown>)[key] = value;
    assert.equal(
      summarizeExport(file),
      null,
      `битый стор "${key}" (${JSON.stringify(value)}) обязан отклонить файл`,
    );
  }

  resetProgress();
});

test("adversarial: отсутствующие необязательные сторы и лишние ключи допустимы", () => {
  resetProgress();
  recordCompletedSession({ topicId: "kinematics", score: 8, total: 10, answers: [] });

  const file = buildExportFile();
  delete file.stores["physicslab-v3-exam-log-v1"];
  delete file.stores["physicslab-v3-practice-log-v1"];
  delete file.stores["physicslab-v3-xp-v1"];
  (file.stores as Record<string, unknown>)["будущий-неизвестный-стор"] = { version: 7, data: {} };

  const summary = summarizeExport(file);
  assert.ok(summary, "файл только с прогрессом — валиден");
  assert.equal(summary.solved, 10);
  assert.equal(summary.xp, 0);
  assert.equal(summary.examAttempts, 0);
  assert.equal(summary.practicedDays, 0);

  resetProgress();
});

test("adversarial: голый массив вместо конверта принимается как legacy-форма", () => {
  // Симметрия с чтением localStorage: до-конвертные формы — валидный вход.
  // Это осознанный контракт, тест фиксирует его от случайной поломки.
  resetProgress();
  recordCompletedSession({ topicId: "kinematics", score: 8, total: 10, answers: [] });

  const file = buildExportFile();
  (file.stores as Record<string, unknown>)["physicslab-v3-practice-log-v1"] = [
    "2026-07-01",
    "2026-07-02",
  ];

  const summary = summarizeExport(file);
  assert.ok(summary);
  assert.equal(summary.practicedDays, 2);

  resetProgress();
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
