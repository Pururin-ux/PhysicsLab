import type { DistractorRule, Params } from "./types.ts";
import { GRAVITY } from "./solver.ts";

function freeFallGtInsteadOfHalfSquare(p: Params): number {
  return GRAVITY * p.t;
}

function freeFallForgotHalf(p: Params): number {
  return GRAVITY * p.t * p.t;
}

function freeFallGtOverTwo(p: Params): number {
  return (GRAVITY * p.t) / 2;
}

function vtSlopeEndVelocityOverEndTime(p: Params): number {
  return p.v2 / p.t2;
}

function vtSlopeVelocityOverStartTime(p: Params): number {
  return p.t1 === 0 ? p.v1 / p.t2 : p.v2 / p.t1;
}

function vtSlopeAverageVelocityOverEndTime(p: Params): number {
  return (p.v1 + p.v2) / p.t2;
}

function vtAreaRectangleOnly(p: Params): number {
  return p.v * (p.t1 + p.t2);
}

function vtAreaFinalVelocityTimesTotalTime(p: Params): number {
  return (p.v + p.dv) * (p.t1 + p.t2);
}

function vtAreaTriangleOnly(p: Params): number {
  return (p.dv * p.t2) / 2;
}

export const freeFallDistractors: DistractorRule[] = [
  {
    label: "gt вместо gt²/2",
    compute: freeFallGtInsteadOfHalfSquare,
  },
  {
    label: "забыл /2",
    compute: freeFallForgotHalf,
  },
  {
    label: "gt/2",
    compute: freeFallGtOverTwo,
  },
];

export const vtSlopeDistractors: DistractorRule[] = [
  {
    label: "v2/t2",
    compute: vtSlopeEndVelocityOverEndTime,
  },
  {
    label: "v1/t1 или v2/t1",
    compute: vtSlopeVelocityOverStartTime,
  },
  {
    label: "(v1+v2)/t2",
    compute: vtSlopeAverageVelocityOverEndTime,
  },
];

export const vtAreaDistractors: DistractorRule[] = [
  {
    label: "только прямоугольник",
    compute: vtAreaRectangleOnly,
  },
  {
    label: "конечная скорость × t",
    compute: vtAreaFinalVelocityTimesTotalTime,
  },
  {
    label: "только треугольник",
    compute: vtAreaTriangleOnly,
  },
];
