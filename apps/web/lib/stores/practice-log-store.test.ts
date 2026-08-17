import assert from "node:assert/strict";
import test from "node:test";
import {
  $practiceLog,
  calcStreak,
  getLastDays,
  logPracticeDay,
  resetPracticeLog,
  toDayKey,
} from "./practice-log-store.ts";

test("calcStreak: пустой журнал даёт 0", () => {
  assert.equal(calcStreak([], "2026-07-03"), 0);
});

test("calcStreak: серия заканчивается сегодня", () => {
  assert.equal(
    calcStreak(["2026-07-01", "2026-07-02", "2026-07-03"], "2026-07-03"),
    3,
  );
});

test("calcStreak: вчерашняя серия ещё не потеряна", () => {
  assert.equal(calcStreak(["2026-07-01", "2026-07-02"], "2026-07-03"), 2);
});

test("calcStreak: разрыв в два дня обнуляет серию", () => {
  assert.equal(calcStreak(["2026-06-30", "2026-07-01"], "2026-07-03"), 0);
});

test("calcStreak: пропуск внутри серии останавливает счёт", () => {
  assert.equal(
    calcStreak(["2026-06-29", "2026-07-01", "2026-07-02", "2026-07-03"], "2026-07-03"),
    3,
  );
});

test("calcStreak: корректно переходит через границу месяца", () => {
  assert.equal(
    calcStreak(["2026-06-29", "2026-06-30", "2026-07-01"], "2026-07-01"),
    3,
  );
});

test("getLastDays: возвращает последние N дней в хронологическом порядке", () => {
  const days = getLastDays(["2026-07-01", "2026-07-03"], "2026-07-03", 3);

  assert.deepEqual(days, [
    { key: "2026-07-01", practiced: true },
    { key: "2026-07-02", practiced: false },
    { key: "2026-07-03", practiced: true },
  ]);
});

test("logPracticeDay: не дублирует один и тот же день", () => {
  resetPracticeLog();

  const date = new Date(2026, 6, 3);
  logPracticeDay(date);
  logPracticeDay(date);

  assert.deepEqual($practiceLog.get(), [toDayKey(date)]);

  resetPracticeLog();
});

test("logPracticeDay: держит журнал отсортированным", () => {
  resetPracticeLog();

  logPracticeDay(new Date(2026, 6, 3));
  logPracticeDay(new Date(2026, 6, 1));

  assert.deepEqual($practiceLog.get(), ["2026-07-01", "2026-07-03"]);

  resetPracticeLog();
});
