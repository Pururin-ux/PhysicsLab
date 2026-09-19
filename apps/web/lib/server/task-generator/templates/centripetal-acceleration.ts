import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function centripetalAcceleration(p: Params): number {
  return p.v ** 2 / p.R;
}

const distractors: DistractorRule[] = [
  { label: "забыл квадрат скорости", compute: (p) => p.v / p.R },
  { label: "умножил на радиус", compute: (p) => p.v ** 2 * p.R },
  { label: "лишний коэффициент два", compute: (p) => p.v ** 2 / (2 * p.R) },
];

export const centripetalAccelerationBlueprint: TaskBlueprint = {
  id: "centripetal-acceleration",
  skill: "Центростремительное ускорение",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 2,
  params: {
    v: { min: 2, max: 24, step: 2, unit: "м/с" },
    R: { min: 1, max: 12, step: 1, unit: "м" },
  },
  formula: "a=\\frac{v^2}{R}",
  answerUnit: "м/с²",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: centripetalAcceleration,
  distractors,
  textTemplate: (p) =>
    `Тело движется по окружности радиусом ${p.R} м с постоянным модулем скорости ${p.v} м/с. Найдите модуль центростремительного ускорения.`,
  explanationTemplate: (p, answer) =>
    `Ускорение направлено к центру, а его модуль равен $a=\\frac{v^2}{R}=\\frac{${p.v}^2}{${p.R}}=${formatMathValue(answer)}$ м/с².`,
  trap: "Использует скорость без квадрата или переносит радиус в числитель.",
  coachLines: {
    correct: () => "Да. Направление скорости меняется, а её модуль входит в формулу ускорения в квадрате.",
    wrong: (p, selected, correct) =>
      `Сначала возведи ${p.v} м/с в квадрат, затем раздели на радиус ${p.R} м. Получается ${formatAnswerValue(correct)} м/с², а не ${formatAnswerValue(selected)} м/с².`,
  },
};
