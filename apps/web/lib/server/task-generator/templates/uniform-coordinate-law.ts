import { variantIndex } from "../solver.ts";
import type { GraphSpec, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function target(p: Params) {
  return variantIndex(p, 3);
}

function signedVelocity(p: Params) {
  return target(p) === 0 || target(p) === 2 ? -p.v : p.v;
}

function finalCoordinate(p: Params) {
  return p.x0 + signedVelocity(p) * p.t;
}

function answerFor(p: Params) {
  if (target(p) === 1) return (finalCoordinate(p) - p.x0) / p.t;
  if (target(p) === 2) return finalCoordinate(p) - signedVelocity(p) * p.t;
  return finalCoordinate(p);
}

function answerUnitFor(p: Params) {
  return target(p) === 1 ? "м/с" : "м";
}

function graphFor(p: Params): GraphSpec {
  const x1 = finalCoordinate(p);
  const min = Math.min(0, p.x0, x1) - 2;
  const max = Math.max(0, p.x0, x1) + 2;

  return {
    type: "xt",
    series: [
      { t: 0, x: p.x0, label: `x₀ = ${p.x0} м` },
      { t: p.t, x: x1, label: `x = ${x1} м при t = ${p.t} с` },
    ],
    xLabel: "t, с",
    yLabel: "x, м",
    xRange: [0, p.t],
    yRange: [min, max],
  };
}

export const uniformCoordinateLawBlueprint: TaskBlueprint = {
  id: "uniform-coordinate-law",
  skill: "Координатный закон равномерного движения",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    x0: { min: 6, max: 20, step: 1, unit: "м" },
    v: { min: 1, max: 5, step: 1, unit: "м/с" },
    t: { min: 2, max: 6, step: 1, unit: "с" },
  },
  graph: graphFor,
  formula: "x=x_0+v_xt",
  answerUnit: answerUnitFor,
  answerKind: "signed",
  solver: answerFor,
  distractors: [
    { label: "потерял знак проекции скорости", compute: (p) => p.x0 + p.v * p.t },
    { label: "нашёл перемещение вместо координаты", compute: (p) => signedVelocity(p) * p.t },
    { label: "перепутал начальную и конечную координаты", compute: (p) => -answerFor(p) },
  ],
  textTemplate: (p) => {
    const vx = signedVelocity(p);
    const x = finalCoordinate(p);
    if (target(p) === 1) {
      return `Координата тела изменилась от ${p.x0} м до ${x} м за ${p.t} с. Движение равномерное и прямолинейное. Найдите проекцию скорости vₓ.`;
    }
    if (target(p) === 2) {
      return `Тело движется равномерно с проекцией скорости ${vx} м/с. Через ${p.t} с его координата равна ${x} м. Найдите начальную координату x₀.`;
    }
    return `Тело начинает движение из точки x₀ = ${p.x0} м и движется равномерно с проекцией скорости ${vx} м/с. Найдите координату через ${p.t} с.`;
  },
  explanationTemplate: (p, answer) => {
    const vx = signedVelocity(p);
    const x = finalCoordinate(p);
    if (target(p) === 1) {
      return `Проекция скорости равна наклону графика координаты: $v_x=\\frac{x-x_0}{t}=\\frac{${x}-${p.x0}}{${p.t}}=${formatMathValue(answer)}$ м/с.`;
    }
    if (target(p) === 2) {
      return `Из $x=x_0+v_xt$ получаем $x_0=x-v_xt=${x}-(${vx})\\cdot${p.t}=${formatMathValue(answer)}$ м.`;
    }
    return `Подставляем проекцию скорости со знаком: $x=x_0+v_xt=${p.x0}+(${vx})\\cdot${p.t}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Подставляет модуль скорости вместо проекции или принимает перемещение за координату.",
  coachLines: {
    correct: (p) => target(p) === 1
      ? "Верно: знак наклона x(t) совпадает со знаком проекции скорости."
      : "Верно: начальная координата и перемещение сложены с учётом знака.",
    wrong: (p, selected, correct) => `Сначала выбери положительное направление оси и сохрани знак vₓ в формуле x = x₀ + vₓt. Получается ${formatAnswerValue(correct)} ${answerUnitFor(p)}, а не ${formatAnswerValue(selected)} ${answerUnitFor(p)}.`,
  },
  constraints: [(p) => p.x0 !== p.v * p.t],
  variantCount: 3,
};
