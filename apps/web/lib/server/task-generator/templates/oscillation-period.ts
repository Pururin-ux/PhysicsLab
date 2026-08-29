import { oscillationPeriodDistractors } from "../distractors.ts";
import { oscillationAnswer, variantIndex } from "../solver.ts";
import { decimalPlaces } from "../difficulty.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Вариант 0 — ищем период T = t/N, вариант 1 — частоту ν = N/t.
function isPeriodVariant(p: Params): boolean {
  return variantIndex(p, 2) === 0;
}

function answerUnitFor(p: Params): string {
  return isPeriodVariant(p) ? "с" : "Гц";
}

function explanationFor(p: Params, answer: number): string {
  return isPeriodVariant(p)
    ? `Период — время одного колебания: $T = \\frac{t}{N} = \\frac{${p.t}}{${p.N}} = ${formatMathValue(answer)}$ с. ` +
        `Число колебаний стоит в знаменателе.`
    : `Частота — число колебаний в секунду: $\\nu = \\frac{N}{t} = \\frac{${p.N}}{${p.t}} = ${formatMathValue(answer)}$ Гц. ` +
        `Время стоит в знаменателе.`;
}

export const oscillationPeriodBlueprint: TaskBlueprint = {
  id: "oscillation-period",
  skill: "Период и частота колебаний",
  topic: "Колебания и волны",
  group: "oscillations",
  difficulty: 1,
  params: {
    N: { min: 10, max: 60, step: 5, unit: "колебаний" },
    t: { min: 4, max: 24, step: 1, unit: "с" },
  },
  formula: "T=\\frac{t}{N},\\qquad \\nu=\\frac{N}{t}",
  answerUnit: answerUnitFor,
  answerKind: "positive",
  solver: oscillationAnswer,
  distractors: oscillationPeriodDistractors,
  textTemplate: (p) =>
    isPeriodVariant(p)
      ? `Маятник совершил ${p.N} колебаний за ${p.t} с. Найдите период колебаний маятника.`
      : `Маятник совершил ${p.N} колебаний за ${p.t} с. Найдите частоту колебаний маятника.`,
  explanationTemplate: explanationFor,
  trap: "Перепутал период и частоту: делит не в ту сторону.",
  coachLines: {
    correct: (p) =>
      isPeriodVariant(p)
        ? "Да. Период — сколько секунд приходится на одно колебание: время делим на число колебаний."
        : "Да. Частота — сколько колебаний в одну секунду: число колебаний делим на время.",
    wrong: (p, selected, correct) => {
      const unit = answerUnitFor(p);
      const relation = isPeriodVariant(p) ? "$T = \\frac{t}{N}$" : "$\\nu = \\frac{N}{t}$";
      return (
        `Сначала назови, что ищешь: ${relation}. ` +
        `Получается ${formatAnswerValue(correct)} ${unit}, а не ${formatAnswerValue(selected)} ${unit}.`
      );
    },
  },
  constraints: [(p) => decimalPlaces(oscillationAnswer(p)) <= 2],
  difficultyFor: (p, answer) => {
    if (isPeriodVariant(p)) {
      return p.t % p.N === 0 || decimalPlaces(answer) <= 1 ? 1 : 2;
    }
    return decimalPlaces(answer) <= 1 ? 2 : 3;
  },
  variantCount: 2,
};
