import { atom } from "nanostores";

export const XP_STORAGE_KEY = "physicslab-v3-xp-v1";

export type XPAward = {
  id: number;
  amount: number;
};

export const $xp = atom<number>(0);
export const $xpAward = atom<XPAward | null>(null);

let xpAwardId = 0;

function canUseStorage() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function saveXP(value: number) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(XP_STORAGE_KEY, String(value));
  } catch {
    // localStorage can be unavailable in private or constrained browser modes.
  }
}

export function hydrateXPFromStorage() {
  if (!canUseStorage()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(XP_STORAGE_KEY);
    const parsed = raw === null ? 0 : Number(raw);

    if (!Number.isFinite(parsed) || parsed < 0) {
      window.localStorage.removeItem(XP_STORAGE_KEY);
      $xp.set(0);
      return;
    }

    $xp.set(Math.floor(parsed));
  } catch {
    // localStorage can be unavailable in private or constrained browser modes.
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

  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(XP_STORAGE_KEY);
}
