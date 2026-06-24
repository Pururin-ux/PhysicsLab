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

function variantIndex(p: Params, count: number): number {
  return Math.abs(Math.trunc(p.__variant ?? 0)) % count;
}

export function newtonSecondAnswer(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
      return force / p.a;
    case 2:
      return force / p.m;
    default:
      return force;
  }
}

export function frictionForce(p: Params): number {
  return p.mu * p.m * GRAVITY;
}

export function inclineForce(p: Params): number {
  return p.m * GRAVITY * Math.sin((p.angle * Math.PI) / 180);
}

export function resultantForce(p: Params): number {
  return variantIndex(p, 2) === 0 ? p.f1 + p.f2 : Math.abs(p.f1 - p.f2);
}

export function apparentWeight(p: Params): number {
  const direction = variantIndex(p, 2) === 0 ? 1 : -1;
  return p.m * (GRAVITY + direction * p.a);
}
