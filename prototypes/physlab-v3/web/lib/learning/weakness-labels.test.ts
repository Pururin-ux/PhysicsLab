import assert from "node:assert/strict";
import test from "node:test";
import {
  formatWeakness,
  getTopWeaknesses,
  getTopWeaknessesForTopic,
  parseWeakTrapKey,
} from "./weakness-labels.ts";

test("parseWeakTrapKey parses blueprint and trap text", () => {
  assert.deepEqual(parseWeakTrapKey("vt-slope:Берет отношение v/t"), {
    blueprint: "vt-slope",
    trap: "Берет отношение v/t",
  });
});

test("parseWeakTrapKey handles trap text with colon and uses the first colon only", () => {
  assert.deepEqual(parseWeakTrapKey("vt-area:Ошибка: взял высоту графика"), {
    blueprint: "vt-area",
    trap: "Ошибка: взял высоту графика",
  });
});

test("parseWeakTrapKey returns null for invalid keys", () => {
  assert.equal(parseWeakTrapKey("vt-area"), null);
  assert.equal(parseWeakTrapKey(":нет blueprint"), null);
  assert.equal(parseWeakTrapKey("vt-area:"), null);
  assert.equal(parseWeakTrapKey(""), null);
});

test("getTopWeaknesses sorts by count descending and respects limit", () => {
  const weaknesses = getTopWeaknesses(
    {
      "vt-slope:trap": 2,
      "newton-second:trap": 5,
      "free-fall:trap": 1,
    },
    2,
  );

  assert.deepEqual(
    weaknesses.map((weakness) => weakness.skillId),
    ["newton-second", "vt-slope"],
  );
});

test("getTopWeaknessesForTopic filters out weaknesses from other topics", () => {
  const weaknesses = getTopWeaknessesForTopic(
    {
      "vt-area:trap": 1,
      "newton-second:trap": 10,
      "free-fall:trap": 3,
    },
    "kinematics",
    5,
  );

  assert.deepEqual(
    weaknesses.map((weakness) => weakness.skillId),
    ["free-fall", "vt-area"],
  );
});

test("formatWeakness does not return raw undefined", () => {
  const weakness = formatWeakness("unknown-skill:undefined", 1);

  assert.equal(weakness?.hint, "Повтори разбор задачи.");
  assert.notEqual(weakness?.hint, "undefined");
});

test("unknown blueprint gets fallback display", () => {
  const weakness = formatWeakness("future-skill:не та формула", 2);

  assert.equal(weakness?.skillTitle, "Новая тема");
  assert.equal(weakness?.title, "Типовая ошибка");
  assert.equal(weakness?.hint, "не та формула");
  assert.equal(weakness?.count, 2);
});
