import { atom } from "nanostores";
import {
  clearStore,
  readStore,
  writeStore,
  type StoreCodec,
} from "./storage-envelope.ts";

export const XP_STORAGE_KEY = "physicslab-v3-xp-v1";

export type XPAward = {
  id: number;
  amount: number;
};

export const $xp = atom<number>(0);
export const $xpAward = atom<XPAward | null>(null);

let xpAwardId = 0;

function normalizeXP(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

// Ловушка legacy-формата: XP исторически хранился сырой строкой ("140"),
// а "140" — это ещё и валидный JSON-число. Оба пути ведут в один сниффер.
export const xpCodec: StoreCodec<number> = {
  key: XP_STORAGE_KEY,
  currentVersion: 1,
  sniffLegacy: (raw, parsed) => {
    const candidate = typeof parsed === "number" ? parsed : Number(raw);
    return normalizeXP(candidate) !== null ? { version: 1, data: candidate } : null;
  },
  migrate: (data) => normalizeXP(data),
};

function saveXP(value: number) {
  writeStore(xpCodec, value);
}

export function hydrateXPFromStorage() {
  const result = readStore(xpCodec);
  if (!result.ok) {
    if (result.reason === "corrupt") {
      $xp.set(0);
    }
    return;
  }

  $xp.set(result.value);
  if (result.migrated) {
    writeStore(xpCodec, result.value);
  }
}

export function addXP(amount: number) {
  if (amount <= 0) return;

  const nextXP = $xp.get() + amount;
  $xp.set(nextXP);
  saveXP(nextXP);
  xpAwardId += 1;
  $xpAward.set({ id: xpAwardId, amount });
}

export function resetSessionProgress() {
  $xpAward.set(null);
  xpAwardId = 0;
}

export function resetStoredXP() {
  $xp.set(0);
  $xpAward.set(null);
  xpAwardId = 0;
  clearStore(xpCodec);
}
