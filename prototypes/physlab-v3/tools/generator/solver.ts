import type { Params } from "./types.ts";

export const GRAVITY = 10;

export function freeFallDistance(p: Params): number {
  return (GRAVITY * p.t * p.t) / 2;
}

export function vtSlopeAcceleration(p: Params): number {
  return (p.v2 - p.v1) / (p.t2 - p.t1);
}

export function vtAreaDisplacement(p: Params): number {
  return p.v * (p.t1 + p.t2) + (p.dv * p.t2) / 2;
}
