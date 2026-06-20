import { atom } from "nanostores";

export type XPAward = {
  id: number;
  amount: number;
};

export const $xp = atom<number>(0);
export const $xpAward = atom<XPAward | null>(null);

let xpAwardId = 0;

export function addXP(amount: number) {
  if (amount <= 0) return;

  $xp.set($xp.get() + amount);
  xpAwardId += 1;
  $xpAward.set({ id: xpAwardId, amount });
}

export function resetSessionProgress() {
  $xp.set(0);
  $xpAward.set(null);
  xpAwardId = 0;
}
