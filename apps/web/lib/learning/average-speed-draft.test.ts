import test from "node:test";
import assert from "node:assert/strict";
import { averageSpeedDraftCodec, averageSpeedInitial, readAverageSpeedResume } from "./average-speed-draft.ts";

test("home resumes actual lesson work without changing stored drafts", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  let raw: string | null = null;
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem: (key: string) => { assert.equal(key, averageSpeedDraftCodec.key); return raw; },
    setItem: () => { throw new Error("Home must not write a draft"); },
    removeItem: () => { throw new Error("Home must not delete a draft"); },
  } } });
  const store = (patch: Partial<typeof averageSpeedInitial>, version = 1) => {
    raw = JSON.stringify({ version, data: { ...averageSpeedInitial, ...patch } });
  };
  try {
    assert.equal(readAverageSpeedResume(), null);
    store({});
    assert.equal(readAverageSpeedResume(), null);
    store({ hideMio: true });
    assert.equal(readAverageSpeedResume(), null);
    store({ prediction: "Пока не знаю — хочу проверить" });
    assert.equal(readAverageSpeedResume()?.title, "Средняя скорость · шаг 1 из 5");
    store({ stage: 3, answer: "4,5", attempts: 1 });
    const before = raw;
    assert.equal(readAverageSpeedResume()?.href, "/practice/average-speed-lesson");
    assert.equal(readAverageSpeedResume()?.body, "Теперь — другая поездка");
    assert.equal(raw, before);
    store({ summaryText: "Моя незаконченная мысль", summarySaved: false });
    assert.ok(readAverageSpeedResume());
    for (const patch of [{ stage: 5 }, { stage: -1 }, { stage: 1.5 }]) {
      store(patch);
      assert.equal(readAverageSpeedResume(), null);
    }
    store({ stage: 2 }, 2);
    const future = raw;
    assert.equal(readAverageSpeedResume(), null);
    assert.equal(raw, future);
    raw = "{broken personal draft";
    assert.equal(readAverageSpeedResume(), null);
    assert.equal(raw, "{broken personal draft");
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("unavailable storage does not create a resume promise", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    get localStorage() { throw new Error("Storage disabled"); },
  } });
  try { assert.equal(readAverageSpeedResume(), null); }
  finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
