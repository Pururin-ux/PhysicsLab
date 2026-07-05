import type { Params } from "./types.ts";

export const GRAVITY = 10;

// Единственный источник фразы про g в текстах задач: смена конвенции
// (например, 9,8 для другого экзамена) не должна требовать правки шаблонов.
export const GRAVITY_TEXT = `g = ${GRAVITY} м/с²`;

export function variantIndex(p: Params, count: number): number {
  return Math.abs(Math.trunc(p.__variant ?? 0)) % count;
}

export function freeFallDistance(p: Params): number {
  return (GRAVITY * p.t * p.t) / 2;
}

export function vtSlopeAcceleration(p: Params): number {
  return (p.v2 - p.v1) / (p.t2 - p.t1);
}

export function vtAreaDisplacement(p: Params): number {
  return p.v * (p.t1 + p.t2) + (p.dv * p.t2) / 2;
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

export function ohmAnswer(p: Params): number {
  const voltage = p.i * p.r;

  switch (variantIndex(p, 3)) {
    case 1:
      return voltage;
    case 2:
      return p.r;
    default:
      return p.i;
  }
}

// Плотность/объём: во сколько раз масса первого кубика больше второго.
export function densityVolumeRatio(p: Params): number {
  return (p.rho1 * p.a1 ** 3) / (p.rho2 * p.a2 ** 3);
}

// Импульс силы: Δp = FΔt. Масса m в параметрах — намеренная приманка,
// формула её не использует.
export function impulseFromForceTime(p: Params): number {
  return p.F * p.dt;
}

// Заряд делится поровну между одинаковыми проводящими шариками после контакта.
export function chargeAfterContact(p: Params): number {
  return (p.q1 + p.q2) / 2;
}

export const GAS_CONSTANT = 8.31;

// pV = nRT, давление в кПа при объёме в литрах (кПа·л = Дж — сокращает шаг
// перевода единиц, температура переведена из °C в кельвины внутри формулы).
export function idealGasPressure(p: Params): number {
  return (p.n * GAS_CONSTANT * (p.tCelsius + 273)) / p.V;
}

export const WATER_SPECIFIC_HEAT_KJ = 4.2;

// Q = cmΔT, количество теплоты в кДж для нагрева воды.
export function heatAmount(p: Params): number {
  return WATER_SPECIFIC_HEAT_KJ * p.m * p.dT;
}
