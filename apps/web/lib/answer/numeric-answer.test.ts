import assert from "node:assert/strict";
import test from "node:test";
import {
  decimalsOf,
  formatNumericValue,
  getNumericMisconception,
  isNumericAnswerCorrect,
  parseNumericAnswer,
  toleranceFor,
} from "./numeric-answer.ts";

test("parseNumericAnswer принимает точку и запятую как разделитель", () => {
  assert.deepEqual(parseNumericAnswer("3.2"), { ok: true, value: 3.2 });
  assert.deepEqual(parseNumericAnswer("3,2"), { ok: true, value: 3.2 });
});

test("parseNumericAnswer принимает целые, минус и пробелы по краям", () => {
  assert.deepEqual(parseNumericAnswer("24"), { ok: true, value: 24 });
  assert.deepEqual(parseNumericAnswer("0"), { ok: true, value: 0 });
  assert.deepEqual(parseNumericAnswer("  -120 "), { ok: true, value: -120 });
  assert.deepEqual(parseNumericAnswer("-3,5"), { ok: true, value: -3.5 });

  const negativeZero = parseNumericAnswer("-0");
  assert.equal(negativeZero.ok, true);
  assert.equal(negativeZero.ok && Object.is(negativeZero.value, -0), true);
});

test("parseNumericAnswer отклоняет пустой и некорректный ввод", () => {
  for (const raw of [
    "",
    "   ",
    "abc",
    "2+2",
    "1.2.3",
    "1,,2",
    "1 000",
    "Infinity",
    "NaN",
    "м/с",
    "3x",
    "+3.2",
    ".5",
    "3.",
  ]) {
    assert.deepEqual(parseNumericAnswer(raw), { ok: false }, `должно отклонить "${raw}"`);
  }
});

test("parseNumericAnswer явно не поддерживает scientific notation", () => {
  for (const raw of ["1e3", "1E3", "-2e-2"]) {
    assert.deepEqual(parseNumericAnswer(raw), { ok: false });
  }
});

test("decimalsOf считает знаки после запятой в пределах 3", () => {
  assert.equal(decimalsOf(24), 0);
  assert.equal(decimalsOf(3.2), 1);
  assert.equal(decimalsOf(3.25), 2);
  assert.equal(decimalsOf(-120), 0);
});

test("toleranceFor: целые получают половину десятой, дробные — половину разряда", () => {
  assert.equal(toleranceFor(24), 0.05);
  assert.equal(toleranceFor(3.2), 0.05);
  assert.equal(toleranceFor(3.25), 0.005);
});

test("isNumericAnswerCorrect: точное значение и граница допуска", () => {
  const spec = { value: 24, tolerance: toleranceFor(24) };
  assert.equal(isNumericAnswerCorrect(24, spec), true);
  assert.equal(isNumericAnswerCorrect(24.05, spec), true); // ровно на границе
  assert.equal(isNumericAnswerCorrect(23.95, spec), true);
});

test("isNumericAnswerCorrect: чуть за границей допуска — неверно", () => {
  const spec = { value: 24, tolerance: toleranceFor(24) };
  assert.equal(isNumericAnswerCorrect(24.2, spec), false);
  assert.equal(isNumericAnswerCorrect(23.6, spec), false);
  assert.equal(isNumericAnswerCorrect(48, spec), false);
});

test("isNumericAnswerCorrect: сразу за границей с учётом floating-point — неверно", () => {
  const spec = { value: 24, tolerance: toleranceFor(24) };

  assert.equal(isNumericAnswerCorrect(24.050_01, spec), false);
  assert.equal(isNumericAnswerCorrect(23.949_99, spec), false);
});

test("isNumericAnswerCorrect: дробный ответ с запятой-вводом", () => {
  const spec = { value: 3.2, tolerance: toleranceFor(3.2) };
  assert.equal(isNumericAnswerCorrect(parseNumericAnswerValue("3,2"), spec), true);
  assert.equal(isNumericAnswerCorrect(3.24, spec), true);
  assert.equal(isNumericAnswerCorrect(3.3, spec), false);
});

test("isNumericAnswerCorrect отклоняет нечисловое", () => {
  assert.equal(isNumericAnswerCorrect(Number.NaN, { value: 5, tolerance: 0.05 }), false);
  assert.equal(isNumericAnswerCorrect(Number.POSITIVE_INFINITY, { value: 5, tolerance: 0.05 }), false);
});

test("isNumericAnswerCorrect: отрицательный (signed) ответ", () => {
  const spec = { value: -120, tolerance: toleranceFor(-120) };
  assert.equal(isNumericAnswerCorrect(-120, spec), true);
  assert.equal(isNumericAnswerCorrect(120, spec), false);
});

test("isNumericAnswerCorrect: ноль, большие и малые значения", () => {
  assert.equal(isNumericAnswerCorrect(-0, { value: 0, tolerance: toleranceFor(0) }), true);
  assert.equal(
    isNumericAnswerCorrect(1_000_000.05, {
      value: 1_000_000,
      tolerance: toleranceFor(1_000_000),
    }),
    true,
  );
  assert.equal(
    isNumericAnswerCorrect(1_000_000.051, {
      value: 1_000_000,
      tolerance: toleranceFor(1_000_000),
    }),
    false,
  );
  assert.equal(
    isNumericAnswerCorrect(0.0015, { value: 0.001, tolerance: toleranceFor(0.001) }),
    true,
  );
  assert.equal(
    isNumericAnswerCorrect(0.001_51, { value: 0.001, tolerance: toleranceFor(0.001) }),
    false,
  );
});

test("getNumericMisconception возвращает метку только при реальном совпадении", () => {
  const misconceptions = [
    { value: 12, label: "усреднил без учёта времени" },
    { value: 48, label: "не поделил на общую массу" },
  ];
  const tolerance = toleranceFor(24);

  assert.equal(getNumericMisconception(12, misconceptions, tolerance), "усреднил без учёта времени");
  assert.equal(getNumericMisconception(48.03, misconceptions, tolerance), "не поделил на общую массу");
});

test("getNumericMisconception не выдумывает причину для чужого числа", () => {
  const misconceptions = [{ value: 12, label: "усреднил" }];
  assert.equal(getNumericMisconception(30, misconceptions, toleranceFor(24)), undefined);
  assert.equal(getNumericMisconception(24, [], 0.05), undefined);
});

test("formatNumericValue показывает десятичную запятую", () => {
  assert.equal(formatNumericValue(3.2, 1), "3,2");
  assert.equal(formatNumericValue(24, 0), "24");
  assert.equal(formatNumericValue(-120, 0), "-120");
  assert.equal(formatNumericValue(3.2), "3,2");
});

// Хелпер: парсит и разворачивает значение (в тестах ввод всегда валиден).
function parseNumericAnswerValue(raw: string): number {
  const parsed = parseNumericAnswer(raw);
  if (!parsed.ok) {
    throw new Error(`ожидался валидный ввод: ${raw}`);
  }
  return parsed.value;
}
