import test from "node:test";
import assert from "node:assert/strict";
import { readMotionLessonResumes } from "./motion-lesson-resume.ts";
import { walkInitial, roundTripInitial } from "./round-trip.ts";

test("home offers only changed motion episodes, preserving every original draft", () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: () => { throw new Error("Resume must be read-only"); },
    removeItem: () => { throw new Error("Resume must preserve drafts"); },
  } } });
  const store = (id: string, value: unknown, version = 1) => data.set(`physicslab-lesson-draft-${id}`, JSON.stringify({ version, data: value }));
  try {
    assert.deepEqual(readMotionLessonResumes(), []);
    store("textbook-walk", walkInitial);
    store("textbook-round-trip-speed", roundTripInitial);
    assert.deepEqual(readMotionLessonResumes(), []);
    store("textbook-walk", { ...walkInitial, stage: 1 });
    assert.equal(readMotionLessonResumes()[0]?.href, "/learn/path-and-displacement");
    store("textbook-round-trip-speed", { ...roundTripInitial, seconds: 40 });
    assert.deepEqual(readMotionLessonResumes().map(item => item.href), ["/learn/average-speed", "/learn/path-and-displacement"]);
    store("textbook-walk", { ...walkInitial, stage: 2 });
    assert.equal(readMotionLessonResumes()[0]?.href, "/learn/average-speed", "ordering is not inferred from writes or visits");
    store("textbook-round-trip-speed", { ...roundTripInitial, stop: true });
    assert.match(readMotionLessonResumes()[0]!.body, /остановка/);
    for (const version of [1, 99]) {
      store("textbook-walk", { ...walkInitial, stage: 3 }, version);
      store("textbook-round-trip-speed", { ...roundTripInitial, seconds: 99 }, version);
      const before = [...data];
      assert.deepEqual(readMotionLessonResumes(), []);
      assert.deepEqual([...data], before);
    }
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
