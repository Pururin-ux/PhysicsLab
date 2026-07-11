import assert from "node:assert/strict";
import test from "node:test";
import { isSessionCompleted, markSessionCompleted } from "./session-completion.ts";

function installSessionStorage() {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    get length() { return data.size; },
  } as Storage;
  (globalThis as { window?: unknown }).window = { sessionStorage: storage };
  return data;
}

test("completion marker is stable and idempotent across hook remounts", () => {
  installSessionStorage();
  try {
    assert.equal(isSessionCompleted("session-a"), false);
    markSessionCompleted("session-a");
    markSessionCompleted("session-a");
    assert.equal(isSessionCompleted("session-a"), true);
    assert.equal(isSessionCompleted("session-b"), false);
  } finally {
    delete (globalThis as { window?: unknown }).window;
  }
});

test("completion marker degrades safely when sessionStorage throws", () => {
  (globalThis as { window?: unknown }).window = {
    get sessionStorage(): Storage { throw new Error("blocked"); },
  };
  try {
    assert.doesNotThrow(() => markSessionCompleted("session-a"));
    assert.equal(isSessionCompleted("session-a"), false);
  } finally {
    delete (globalThis as { window?: unknown }).window;
  }
});
