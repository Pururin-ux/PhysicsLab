import assert from "node:assert/strict";
import test from "node:test";
import { isValidAttemptId, newAttemptId } from "./attempt-id.ts";
import {
  isSessionCompleted,
  markSessionCompleted,
} from "./session-completion.ts";

function installSessionStorage() {
  const data = new Map<string, string>();
  (globalThis as { window?: unknown }).window = {
    sessionStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
      removeItem: (key: string) => void data.delete(key),
    },
  };
  return data;
}

function uninstall() {
  delete (globalThis as { window?: unknown }).window;
}

test("две fresh-попытки получают разные валидные attemptId", () => {
  const first = newAttemptId();
  const second = newAttemptId();

  assert.notEqual(first, second);
  assert.equal(isValidAttemptId(first), true);
  assert.equal(isValidAttemptId(second), true);

  // Массовая проверка уникальности (fallback-ветка тоже не должна коллидировать).
  const bulk = new Set(Array.from({ length: 200 }, () => newAttemptId()));
  assert.equal(bulk.size, 200);
});

test("isValidAttemptId отклоняет мусор", () => {
  for (const bad of ["", "short", 42, null, undefined, "x".repeat(200)]) {
    assert.equal(isValidAttemptId(bad), false, `должен отклонить ${JSON.stringify(bad)}`);
  }
});

test("идемпотентность по попытке: одна попытка — одна запись, вторая попытка того же batch — записывается", () => {
  installSessionStorage();
  try {
    const template = "mixed";
    const batch = 0;
    const attemptA = newAttemptId();
    const attemptB = newAttemptId();
    const idA = `${template}:${batch}:${attemptA}`;
    const idB = `${template}:${batch}:${attemptB}`;

    // Попытка A: до записи — не завершена; после — завершена (двойной вызов
    // upstream-гарда упрётся в этот маркер).
    assert.equal(isSessionCompleted(idA), false);
    markSessionCompleted(idA);
    assert.equal(isSessionCompleted(idA), true);
    markSessionCompleted(idA);
    assert.equal(isSessionCompleted(idA), true, "повторный mark не ломает состояние");

    // Попытка B того же template/batch НЕ заблокирована маркером A —
    // повторное честное прохождение batch=0 записывается.
    assert.equal(isSessionCompleted(idB), false);
    markSessionCompleted(idB);
    assert.equal(isSessionCompleted(idB), true);
  } finally {
    uninstall();
  }
});
