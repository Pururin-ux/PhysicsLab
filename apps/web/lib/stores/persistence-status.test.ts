import assert from "node:assert/strict";
import test from "node:test";
import { writeStore, type StoreCodec } from "./storage-envelope.ts";
import {
  $persistenceStatus,
  allowWriteForKey,
  isWriteBlockedForKey,
  reportReadResult,
  reportWriteResult,
  resetPersistenceStatusForTests,
} from "./persistence-status.ts";

const codec: StoreCodec<number> = {
  key: "physicslab-test-key",
  currentVersion: 1,
  sniffLegacy: () => null,
  migrate: (data) => (typeof data === "number" ? data : null),
};

function installLocalStorage(overrides: Partial<Storage> = {}) {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    get length() {
      return data.size;
    },
    ...overrides,
  } as Storage;
  (globalThis as { window?: unknown }).window = { localStorage: storage };
  return data;
}

function uninstall() {
  delete (globalThis as { window?: unknown }).window;
}

class QuotaError extends DOMException {
  constructor() {
    super("quota", "QuotaExceededError");
  }
}

test("writeStore: success / quota / error / no-storage", () => {
  installLocalStorage();
  try {
    assert.equal(writeStore(codec, 5), "success");
  } finally {
    uninstall();
  }

  installLocalStorage({
    setItem: () => {
      throw new QuotaError();
    },
  });
  try {
    assert.equal(writeStore(codec, 5), "quota");
  } finally {
    uninstall();
  }

  installLocalStorage({
    setItem: () => {
      throw new Error("random failure");
    },
  });
  try {
    assert.equal(writeStore(codec, 5), "error");
  } finally {
    uninstall();
  }

  // Без window вовсе.
  assert.equal(writeStore(codec, 5), "no-storage");
});

test("writeStore: недоступное свойство localStorage — no-storage, не crash", () => {
  (globalThis as { window?: unknown }).window = {
    get localStorage(): Storage {
      throw new Error("SecurityError");
    },
  };
  try {
    assert.equal(writeStore(codec, 5), "no-storage");
  } finally {
    uninstall();
  }
});

test("статус эскалируется и не понижается", () => {
  resetPersistenceStatusForTests();
  reportWriteResult("success");
  assert.equal($persistenceStatus.get(), "available");
  reportReadResult("k", { ok: false, reason: "corrupt" });
  assert.equal($persistenceStatus.get(), "recovered-corrupt");
  reportWriteResult("quota");
  assert.equal($persistenceStatus.get(), "quota");
  reportWriteResult("success");
  assert.equal($persistenceStatus.get(), "quota", "успешная запись не скрывает квоту");
  reportWriteResult("no-storage");
  assert.equal($persistenceStatus.get(), "unavailable");
  resetPersistenceStatusForTests();
});

test("future-version блокирует запись только своего ключа", () => {
  resetPersistenceStatusForTests();
  reportReadResult("physicslab-v3-progress-v1", { ok: false, reason: "future-version" });
  assert.equal($persistenceStatus.get(), "future-version");
  assert.equal(isWriteBlockedForKey("physicslab-v3-progress-v1"), true);
  assert.equal(isWriteBlockedForKey("physicslab-v3-xp-v1"), false);
  allowWriteForKey("physicslab-v3-progress-v1");
  assert.equal(isWriteBlockedForKey("physicslab-v3-progress-v1"), false);
  resetPersistenceStatusForTests();
  assert.equal(isWriteBlockedForKey("physicslab-v3-progress-v1"), false);
});
