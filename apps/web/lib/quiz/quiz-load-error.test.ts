import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyFetchFailure,
  classifyHttpError,
  emptyPayloadError,
  integrityError,
  invalidPayloadError,
} from "./quiz-load-error.ts";

test("HTTP: 5xx и 429 — retryable, 4xx — нет", () => {
  assert.deepEqual(
    [classifyHttpError(500).kind, classifyHttpError(500).retryable, classifyHttpError(500).status],
    ["http", true, 500],
  );
  assert.equal(classifyHttpError(503).retryable, true);
  assert.equal(classifyHttpError(429).retryable, true);
  assert.equal(classifyHttpError(400).retryable, false);
  assert.equal(classifyHttpError(404).retryable, false);
});

test("сообщения не содержат internals", () => {
  for (const error of [
    classifyHttpError(500),
    classifyHttpError(400),
    invalidPayloadError(),
    emptyPayloadError(),
    integrityError(),
    classifyFetchFailure(true),
    classifyFetchFailure(false),
  ]) {
    assert.ok(error.userMessage.length > 0);
    assert.doesNotMatch(error.userMessage, /stack|error:|exception|undefined|null/i);
  }
});

test("timeout отличается от network", () => {
  assert.equal(classifyFetchFailure(true).kind, "timeout");
  // Node имеет глобальный navigator без onLine → не offline.
  assert.equal(classifyFetchFailure(false).kind, "network");

  // navigator в Node — getter-only global: подменяем через defineProperty.
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    value: { onLine: false },
    configurable: true,
  });
  try {
    assert.equal(classifyFetchFailure(false).kind, "offline");
  } finally {
    if (original) {
      Object.defineProperty(globalThis, "navigator", original);
    } else {
      delete (globalThis as { navigator?: unknown }).navigator;
    }
  }
});

test("все ошибки payload retryable (тот же batch)", () => {
  assert.equal(invalidPayloadError().retryable, true);
  assert.equal(emptyPayloadError().retryable, true);
  assert.equal(integrityError().retryable, true);
});
