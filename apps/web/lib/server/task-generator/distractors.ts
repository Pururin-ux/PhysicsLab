import type { DistractorRule, Params } from "./types.ts";
import {
  GAS_CONSTANT,
  GRAVITY,
  ICE_FUSION_HEAT_KJ,
  ICE_SPECIFIC_HEAT_KJ,
  WATER_SPECIFIC_HEAT_KJ,
  variantIndex,
} from "./solver.ts";

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

function relativeVelocityAddsModules(p: Params): number {
  return p.v1 + p.v2;
}

function relativeVelocitySubtractsModules(p: Params): number {
  return Math.abs(p.v2 - p.v1);
}

function relativeVelocityIgnoresCurrent(p: Params): number {
  return p.v1;
}

export const relativeVelocityVectorsDistractors: DistractorRule[] = [
  {
    label: "сложил модули перпендикулярных скоростей",
    compute: relativeVelocityAddsModules,
  },
  {
    label: "вычел модули вместо векторного сложения",
    compute: relativeVelocitySubtractsModules,
  },
  {
    label: "не учёл течение",
    compute: relativeVelocityIgnoresCurrent,
  },
];

function perpendicularForcesAddModules(p: Params): number {
  return p.f1 + p.f2;
}

function perpendicularForcesSubtractModules(p: Params): number {
  return Math.abs(p.f1 - p.f2);
}

function perpendicularForcesKeepLarger(p: Params): number {
  return Math.max(p.f1, p.f2);
}

export const resultantForce2dDistractors: DistractorRule[] = [
  {
    label: "сложил модули перпендикулярных сил",
    compute: perpendicularForcesAddModules,
  },
  {
    label: "вычел модули вместо векторного сложения",
    compute: perpendicularForcesSubtractModules,
  },
  {
    label: "взял только большую силу",
    compute: perpendicularForcesKeepLarger,
  },
];

function resistanceOppositeTopology(p: Params): number {
  return variantIndex(p, 2) === 0
    ? (p.r1 * p.r2) / (p.r1 + p.r2)
    : p.r1 + p.r2;
}

function resistanceAverages(p: Params): number {
  return (p.r1 + p.r2) / 2;
}

function resistanceKeepsLarger(p: Params): number {
  return Math.max(p.r1, p.r2);
}

export const resistorNetworkDistractors: DistractorRule[] = [
  {
    label: "перепутал формулы последовательного и параллельного соединения",
    compute: resistanceOppositeTopology,
  },
  {
    label: "усреднил сопротивления",
    compute: resistanceAverages,
  },
  {
    label: "взял большее сопротивление",
    compute: resistanceKeepsLarger,
  },
];

function circuitIgnoresInternalResistance(p: Params): number {
  return p.emf / p.R;
}

function circuitSubtractsInternalResistance(p: Params): number {
  return p.emf / (p.R - p.r);
}

function circuitDividesByInternalOnly(p: Params): number {
  return p.emf / p.r;
}

export const sourceInternalResistanceDistractors: DistractorRule[] = [
  {
    label: "не учёл внутреннее сопротивление",
    compute: circuitIgnoresInternalResistance,
  },
  {
    label: "вычел r вместо сложения",
    compute: circuitSubtractsInternalResistance,
  },
  {
    label: "поделил только на r",
    compute: circuitDividesByInternalOnly,
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

function collisionAveragesSpeeds(p: Params): number {
  return (p.v1 + p.v2) / 2;
}

function collisionForgetsTotalMass(p: Params): number {
  return p.m1 * p.v1 + p.m2 * p.v2;
}

function collisionIgnoresSecondCartMomentum(p: Params): number {
  return (p.m1 * p.v1) / (p.m1 + p.m2);
}

export const inelasticCollisionSpeedDistractors: DistractorRule[] = [
  {
    label: "усреднил скорости без учёта масс",
    compute: collisionAveragesSpeeds,
  },
  {
    label: "нашёл суммарный импульс, но не поделил на общую массу",
    compute: collisionForgetsTotalMass,
  },
  {
    label: "учёл импульс только первой тележки",
    compute: collisionIgnoresSecondCartMomentum,
  },
];

function kineticEnergyForgetsHalf(p: Params): number {
  return p.m * p.v * p.v;
}

function kineticEnergyUsesMomentum(p: Params): number {
  return p.m * p.v;
}

function kineticEnergyForgetsSquare(p: Params): number {
  return (p.m * p.v) / 2;
}

export const kineticEnergyDistractors: DistractorRule[] = [
  {
    label: "забыл коэффициент 1/2",
    compute: kineticEnergyForgetsHalf,
  },
  {
    label: "нашёл импульс вместо энергии",
    compute: kineticEnergyUsesMomentum,
  },
  {
    label: "не возвёл скорость в квадрат",
    compute: kineticEnergyForgetsSquare,
  },
];

function capacitorEnergyForgetsHalf(p: Params): number {
  return (p.C * p.U * p.U) / 1000;
}

function capacitorEnergyForgetsVoltageSquare(p: Params): number {
  return (p.C * p.U) / 2000;
}

function capacitorEnergyTreatsMicrofaradsAsFarads(p: Params): number {
  return (p.C * p.U * p.U) / 2;
}

export const capacitorEnergyDistractors: DistractorRule[] = [
  {
    label: "забыл коэффициент 1/2",
    compute: capacitorEnergyForgetsHalf,
  },
  {
    label: "подставил U вместо U²",
    compute: capacitorEnergyForgetsVoltageSquare,
  },
  {
    label: "не учёл, что ёмкость дана в микрофарадах",
    compute: capacitorEnergyTreatsMicrofaradsAsFarads,
  },
];

function phaseHeatMeltingOnly(p: Params): number {
  return p.m * ICE_FUSION_HEAT_KJ;
}

function phaseHeatWarmingOnly(p: Params): number {
  return p.m * ICE_SPECIFIC_HEAT_KJ * Math.abs(p.temp0);
}

function phaseHeatForgetsMass(p: Params): number {
  return ICE_SPECIFIC_HEAT_KJ * Math.abs(p.temp0) + ICE_FUSION_HEAT_KJ;
}

export const phaseChangeHeatDistractors: DistractorRule[] = [
  {
    label: "учёл только плавление",
    compute: phaseHeatMeltingOnly,
  },
  {
    label: "учёл только нагрев льда до 0 °C",
    compute: phaseHeatWarmingOnly,
  },
  {
    label: "забыл умножить обе стадии на массу",
    compute: phaseHeatForgetsMass,
  },
];
