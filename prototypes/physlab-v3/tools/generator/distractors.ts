import type { DistractorRule, Params } from "./types.ts";
import { GAS_CONSTANT, GRAVITY, WATER_SPECIFIC_HEAT_KJ, variantIndex } from "./solver.ts";

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

function newtonInvertedRatio(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
      return p.a / force;
    case 2:
      return p.m / force;
    default:
      return p.a / p.m;
  }
}

function newtonAddsGivenValues(p: Params): number {
  const force = p.m * p.a;

  switch (variantIndex(p, 3)) {
    case 1:
      return force + p.a;
    case 2:
      return force + p.m;
    default:
      return p.m + p.a;
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
    label: "умножил вместо деления или разделил данные в неверном порядке",
    compute: newtonWrongOperation,
  },
  {
    label: "перевернул отношение величин",
    compute: newtonInvertedRatio,
  },
  {
    label: "сложил данные вместо применения второго закона Ньютона",
    compute: newtonAddsGivenValues,
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

function ohmWrongOperation(p: Params): number {
  const voltage = p.i * p.r;

  switch (variantIndex(p, 3)) {
    case 1:
      return p.i / p.r;
    case 2:
      return voltage * p.i;
    default:
      return voltage * p.r;
  }
}

function ohmInvertedRatio(p: Params): number {
  switch (variantIndex(p, 3)) {
    case 1:
      return p.r / p.i;
    case 2:
      return 1 / p.r;
    default:
      return 1 / p.i;
  }
}

function ohmAddsGivenValues(p: Params): number {
  const voltage = p.i * p.r;

  switch (variantIndex(p, 3)) {
    case 1:
      return p.i + p.r;
    case 2:
      return voltage + p.i;
    default:
      return voltage + p.r;
  }
}

export const ohmLawDistractors: DistractorRule[] = [
  {
    label: "умножил вместо деления или наоборот",
    compute: ohmWrongOperation,
  },
  {
    label: "перевернул отношение величин",
    compute: ohmInvertedRatio,
  },
  {
    label: "сложил данные вместо закона Ома",
    compute: ohmAddsGivenValues,
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

function densityRatioEdgeInsteadOfVolume(p: Params): number {
  return (p.rho1 * p.a1) / (p.rho2 * p.a2);
}

function densityRatioSquaredEdge(p: Params): number {
  return (p.rho1 * p.a1 ** 2) / (p.rho2 * p.a2 ** 2);
}

function densityRatioInverted(p: Params): number {
  return (p.rho2 * p.a2 ** 3) / (p.rho1 * p.a1 ** 3);
}

export const densityVolumeRatioDistractors: DistractorRule[] = [
  {
    label: "сравнил рёбра вместо объёмов",
    compute: densityRatioEdgeInsteadOfVolume,
  },
  {
    label: "возвёл ребро в квадрат вместо куба",
    compute: densityRatioSquaredEdge,
  },
  {
    label: "перепутал, что через что делить",
    compute: densityRatioInverted,
  },
];

function impulseUsesDecoyMassMultiplied(p: Params): number {
  return p.F * p.dt * p.m;
}

function impulseUsesDecoyMassDivided(p: Params): number {
  return (p.F * p.dt) / p.m;
}

function impulseWrongOperation(p: Params): number {
  return p.F / p.dt;
}

export const impulseFromForceTimeDistractors: DistractorRule[] = [
  {
    label: "умножил на лишнюю массу",
    compute: impulseUsesDecoyMassMultiplied,
  },
  {
    label: "разделил на лишнюю массу",
    compute: impulseUsesDecoyMassDivided,
  },
  {
    label: "разделил силу на время вместо умножения",
    compute: impulseWrongOperation,
  },
];

function chargeUsesSumInsteadOfAverage(p: Params): number {
  return p.q1 + p.q2;
}

function chargeKeepsLargerUnchanged(p: Params): number {
  return Math.abs(p.q1) >= Math.abs(p.q2) ? p.q1 : p.q2;
}

function chargeSubtractsInsteadOfAdds(p: Params): number {
  return (p.q1 - p.q2) / 2;
}

export const chargeSharingDistractors: DistractorRule[] = [
  {
    label: "не поделил заряд пополам",
    compute: chargeUsesSumInsteadOfAverage,
  },
  {
    label: "решил, что заряд не меняется",
    compute: chargeKeepsLargerUnchanged,
  },
  {
    label: "вычел вместо сложения",
    compute: chargeSubtractsInsteadOfAdds,
  },
];

function idealGasUsesCelsiusDirectly(p: Params): number {
  return (p.n * GAS_CONSTANT * p.tCelsius) / p.V;
}

function idealGasForgotMoles(p: Params): number {
  return (GAS_CONSTANT * (p.tCelsius + 273)) / p.V;
}

function idealGasMultipliesByVolume(p: Params): number {
  return p.n * GAS_CONSTANT * (p.tCelsius + 273) * p.V;
}

export const idealGasPressureDistractors: DistractorRule[] = [
  {
    label: "использовал температуру в °C вместо кельвинов",
    compute: idealGasUsesCelsiusDirectly,
  },
  {
    label: "забыл количество вещества",
    compute: idealGasForgotMoles,
  },
  {
    label: "умножил на объём вместо деления",
    compute: idealGasMultipliesByVolume,
  },
];

function heatForgotMass(p: Params): number {
  return WATER_SPECIFIC_HEAT_KJ * p.dT;
}

function heatForgotDeltaT(p: Params): number {
  return WATER_SPECIFIC_HEAT_KJ * p.m;
}

function heatForgotSpecificHeat(p: Params): number {
  return p.m * p.dT;
}

export const heatAmountDistractors: DistractorRule[] = [
  {
    label: "забыл массу",
    compute: heatForgotMass,
  },
  {
    label: "забыл изменение температуры",
    compute: heatForgotDeltaT,
  },
  {
    label: "забыл удельную теплоёмкость",
    compute: heatForgotSpecificHeat,
  },
];
