import { variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const G = 10;

function target(p: Params) {
  return variantIndex(p, 3);
}

function flightTime(p: Params) {
  return (2 * p.vy) / G;
}

function answerFor(p: Params) {
  if (target(p) === 0) return flightTime(p);
  if (target(p) === 1) return (p.vy * p.vy) / (2 * G);
  return p.vx * flightTime(p);
}

function answerUnitFor(p: Params) {
  return target(p) === 0 ? "с" : "м";
}

export const projectileComponentsBlueprint: TaskBlueprint = {
  id: "projectile-components",
  skill: "Бросок под углом: движение по осям",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    vx: { min: 4, max: 12, step: 2, unit: "м/с" },
    vy: { min: 5, max: 15, step: 5, unit: "м/с" },
  },
  formula: "t_{\\text{пол}}=\\frac{2v_{0y}}{g},\\quad H=\\frac{v_{0y}^2}{2g},\\quad L=v_{0x}t_{\\text{пол}}",
  answerUnit: answerUnitFor,
  answerKind: "positive",
  solver: answerFor,
  distractors: [
    { label: "взял время подъёма вместо полного времени", compute: p => answerFor(p) / 2 },
    { label: "удвоил искомую величину", compute: p => answerFor(p) * 2 },
    { label: "смешал горизонтальную и вертикальную составляющие", compute: p => answerFor(p) + p.vx },
  ],
  textTemplate: p => {
    if (target(p) === 0) {
      return `Тело бросили под углом к горизонту. Проекции начальной скорости равны v₀ₓ = ${p.vx} м/с и v₀ᵧ = ${p.vy} м/с. Тело вернулось на высоту бросания. Найдите полное время полёта; g = ${G} м/с².`;
    }
    if (target(p) === 1) {
      return `Тело бросили под углом к горизонту. Вертикальная составляющая начальной скорости v₀ᵧ = ${p.vy} м/с. Найдите максимальную высоту над точкой бросания; сопротивлением воздуха пренебречь, g = ${G} м/с².`;
    }
    return `Тело бросили под углом к горизонту с компонентами v₀ₓ = ${p.vx} м/с и v₀ᵧ = ${p.vy} м/с. Оно приземлилось на высоте бросания. Найдите дальность полёта; g = ${G} м/с².`;
  },
  explanationTemplate: (p, answer) => {
    if (target(p) === 0) {
      return `Подъём и спуск до той же высоты занимают одинаковое время: $t_{\\text{пол}}=\\frac{2v_{0y}}{g}=\\frac{2\\cdot${p.vy}}{${G}}=${formatMathValue(answer)}$ с.`;
    }
    if (target(p) === 1) {
      return `Высоту определяет только вертикальная составляющая: $H=\\frac{v_{0y}^2}{2g}=\\frac{${p.vy}^2}{2\\cdot${G}}=${formatMathValue(answer)}$ м.`;
    }
    return `Сначала находим время полёта: $t_{\\text{пол}}=2v_{0y}/g=${formatMathValue(flightTime(p))}$ с. По горизонтали движение равномерное: $L=v_{0x}t_{\\text{пол}}=${p.vx}\\cdot${formatMathValue(flightTime(p))}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Подставляет полный модуль скорости вместо нужной проекции или использует время подъёма как полное время полёта.",
  coachLines: {
    correct: p => target(p) === 2
      ? "Верно: время задаёт вертикальное движение, а дальность — горизонтальная скорость за это время."
      : "Верно: вертикальная составляющая определяет время подъёма и максимальную высоту.",
    wrong: (p, selected, correct) => `Раздели движение по осям: по x скорость постоянна, по y действует ускорение −g. Получается ${formatAnswerValue(correct)} ${answerUnitFor(p)}, а не ${formatAnswerValue(selected)} ${answerUnitFor(p)}.`,
  },
  variantCount: 3,
};
