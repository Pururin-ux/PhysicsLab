import assert from "node:assert/strict";
import test from "node:test";
import { decodeStoredValue, type StoreCodec } from "./storage-envelope.ts";
import { examLogCodec } from "./exam-log-store.ts";
import { practiceLogCodec } from "./practice-log-store.ts";
import { progressCodec, PROGRESS_VERSION } from "./progress-store.ts";
import { xpCodec } from "./session-store.ts";

// decodeStoredValue — чистая функция (без window), поэтому все сценарии
// чтения проверяются в node без моков localStorage.

const numberCodec: StoreCodec<number> = {
  key: "test-number",
  currentVersion: 2,
  sniffLegacy: (_raw, parsed) =>
    typeof parsed === "number" ? { version: 1, data: parsed } : null,
  migrate: (data, version) => {
    if (typeof data !== "number" || !Number.isFinite(data)) {
      return null;
    }
    // v1 хранил значение в сотых долях.
    return version === 1 ? Math.round(data / 100) : data;
  },
};

test("конверт текущей версии читается без миграции", () => {
  const result = decodeStoredValue(numberCodec, JSON.stringify({ version: 2, data: 7 }));
  assert.deepEqual(result, { ok: true, value: 7, migrated: false });
});

test("конверт старой версии мигрирует и помечается migrated", () => {
  const result = decodeStoredValue(numberCodec, JSON.stringify({ version: 1, data: 700 }));
  assert.deepEqual(result, { ok: true, value: 7, migrated: true });
});

test("legacy-форма без конверта распознаётся сниффером", () => {
  const result = decodeStoredValue(numberCodec, "700");
  assert.deepEqual(result, { ok: true, value: 7, migrated: true });
});

test("версия из будущего не читается и не считается мусором", () => {
  const result = decodeStoredValue(numberCodec, JSON.stringify({ version: 99, data: 7 }));
  assert.deepEqual(result, { ok: false, reason: "future-version" });
});

test("мусор даёт corrupt", () => {
  assert.deepEqual(decodeStoredValue(numberCodec, "{broken"), { ok: false, reason: "corrupt" });
  assert.deepEqual(decodeStoredValue(numberCodec, '"строка"'), { ok: false, reason: "corrupt" });
});

test("xp: сырая строка и JSON-число дают одно значение", () => {
  const fromRaw = decodeStoredValue(xpCodec, "140");
  assert.equal(fromRaw.ok && fromRaw.value, 140);
  assert.equal(fromRaw.ok && fromRaw.migrated, true);

  const fromEnvelope = decodeStoredValue(xpCodec, JSON.stringify({ version: 1, data: 140 }));
  assert.equal(fromEnvelope.ok && fromEnvelope.value, 140);
  assert.equal(fromEnvelope.ok && fromEnvelope.migrated, false);

  assert.deepEqual(decodeStoredValue(xpCodec, "abc"), { ok: false, reason: "corrupt" });
  assert.deepEqual(decodeStoredValue(xpCodec, "-5"), { ok: false, reason: "corrupt" });
});

test("exam-log: legacy-массив попыток мигрирует в конверт", () => {
  const legacy = JSON.stringify([
    { completedAt: "2026-07-01T10:00:00.000Z", score: 7, total: 10 },
    { completedAt: "2026-07-02T10:00:00.000Z", score: 999, total: 10 },
    "мусор",
  ]);
  const result = decodeStoredValue(examLogCodec, legacy);

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.migrated, true);
    assert.equal(result.value.length, 2);
    assert.equal(result.value[1].score, 10, "score обрезается до total");
  }
});

test("practice-log: legacy-массив дней сортируется и дедуплицируется", () => {
  const result = decodeStoredValue(
    practiceLogCodec,
    JSON.stringify(["2026-07-02", "2026-07-01", "2026-07-02", "не-дата"]),
  );

  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.value, ["2026-07-01", "2026-07-02"]);
  }
});

test("progress: inline v1 и inline v2 читаются, конверт v2 — без миграции", () => {
  const topicsPayload = {
    kinematics: {
      solved: 5,
      correct: 4,
      completedSessions: 1,
      weakTraps: {},
      lastPracticedAt: null,
    },
  };

  const inlineV1 = decodeStoredValue(
    progressCodec,
    JSON.stringify({ version: 1, topics: topicsPayload }),
  );
  assert.equal(inlineV1.ok, true);
  if (inlineV1.ok) {
    assert.equal(inlineV1.migrated, true);
    assert.equal(inlineV1.value.version, PROGRESS_VERSION);
    assert.equal(inlineV1.value.topics.kinematics.solved, 5);
    assert.deepEqual(inlineV1.value.topics.kinematics.weakTrapLastSeenAt, {});
  }

  const inlineV2 = decodeStoredValue(
    progressCodec,
    JSON.stringify({ version: 2, topics: topicsPayload }),
  );
  assert.equal(inlineV2.ok && inlineV2.migrated, true, "inline v2 пересохраняется конвертом");

  const envelopeV2 = decodeStoredValue(
    progressCodec,
    JSON.stringify({
      version: 2,
      data: { version: 2, topics: topicsPayload },
    }),
  );
  assert.equal(envelopeV2.ok && !envelopeV2.migrated, true);
});
