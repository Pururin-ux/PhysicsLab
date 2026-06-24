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

function variantIndex(p: Params, count: number): number {
  return Math.abs(Math.trunc(p.__variant ?? 0)) % count;
}

function newtonWrongOperation(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
      return force * p.a;
    case 2:
      return force * p.m;
    default:
      return p.m / p.a;
  }
}

function newtonExtraDivision(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
      return force / (p.a * p.a);
    case 2:
      return force / (p.m * p.m);
    default:
      return p.m + p.a;
  }
}

function newtonUsesGravity(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
    case 2:
      return force / GRAVITY;
    default:
      return p.m * GRAVITY;
  }
}

function frictionForgotGravity(p: Params): number {
  return p.mu * p.m;
}

function frictionEqualsNormalForce(p: Params): number {
  return p.m * GRAVITY;
}

function frictionAddsMassAndGravity(p: Params): number {
  return p.mu * (p.m + GRAVITY);
}

function inclineUsesWrongTrigFunction(p: Params): number {
  if (p.angle === 45) {
    return p.m * GRAVITY * 0.5;
  }

  return p.m * GRAVITY * Math.cos((p.angle * Math.PI) / 180);
}

function inclineIgnoresAngle(p: Params): number {
  return p.m * GRAVITY;
}

function inclineForgetsGravity(p: Params): number {
  return p.m * Math.sin((p.angle * Math.PI) / 180);
}

function resultantUsesWrongSign(p: Params): number {
  return variantIndex(p, 2) === 0 ? Math.abs(p.f1 - p.f2) : p.f1 + p.f2;
}

function resultantIgnoresSmallerForce(p: Params): number {
  return Math.max(p.f1, p.f2);
}

function resultantUsesHalfResult(p: Params): number {
  const result = variantIndex(p, 2) === 0 ? p.f1 + p.f2 : Math.abs(p.f1 - p.f2);
  return result / 2;
}

function weightUsesOppositeDirection(p: Params): number {
  const direction = variantIndex(p, 2) === 0 ? -1 : 1;
  return p.m * (GRAVITY + direction * p.a);
}

function weightIgnoresAcceleration(p: Params): number {
  return p.m * GRAVITY;
}

function weightDoublesAcceleration(p: Params): number {
  const direction = variantIndex(p, 2) === 0 ? 1 : -1;
  return p.m * (GRAVITY + direction * 2 * p.a);
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

export const newtonSecondDistractors: DistractorRule[] = [
  {
    label: "выбрал обратное действие",
    compute: newtonWrongOperation,
  },
  {
    label: "лишний раз разделил или сложил величины",
    compute: newtonExtraDivision,
  },
  {
    label: "подставил g вместо заданного ускорения",
    compute: newtonUsesGravity,
  },
];

export const frictionForceDistractors: DistractorRule[] = [
  {
    label: "забыл множитель g",
    compute: frictionForgotGravity,
  },
  {
    label: "принял силу трения равной реакции опоры",
    compute: frictionEqualsNormalForce,
  },
  {
    label: "сложил m и g вместо умножения",
    compute: frictionAddsMassAndGravity,
  },
];

export const inclineForceDistractors: DistractorRule[] = [
  {
    label: "перепутал sin и cos",
    compute: inclineUsesWrongTrigFunction,
  },
  {
    label: "взял всю силу тяжести",
    compute: inclineIgnoresAngle,
  },
  {
    label: "забыл множитель g",
    compute: inclineForgetsGravity,
  },
];

export const resultantForceDistractors: DistractorRule[] = [
  {
    label: "неверно учел направления сил",
    compute: resultantUsesWrongSign,
  },
  {
    label: "учел только большую силу",
    compute: resultantIgnoresSmallerForce,
  },
  {
    label: "разделил равнодействующую пополам",
    compute: resultantUsesHalfResult,
  },
];

export const weightLiftDistractors: DistractorRule[] = [
  {
    label: "перепутал знак ускорения лифта",
    compute: weightUsesOppositeDirection,
  },
  {
    label: "не учел ускорение лифта",
    compute: weightIgnoresAcceleration,
  },
  {
    label: "дважды учел ускорение лифта",
    compute: weightDoublesAcceleration,
  },
];
