import { resistorNetworkDistractors } from "../distractors.ts";
import { equivalentResistance, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

// Вариант 0 — последовательное соединение, вариант 1 — параллельное.
function isParallelVariant(p: Params): boolean {
  return variantIndex(p, 2) === 1;
}

// Для параллельного соединения ответ обязан быть целым; для
// последовательного сумма целая всегда.
function answerIsClean(p: Params): boolean {
  if (!isParallelVariant(p)) {
    return true;
  }

  return Number.isInteger((p.r1 * p.r2) / (p.r1 + p.r2));
}

export const resistorNetworkBlueprint: TaskBlueprint = {
  id: "resistor-network",
  skill: "Последовательное и параллельное соединение",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    r1: { min: 2, max: 30, step: 1, unit: "Ом" },
    r2: { min: 2, max: 30, step: 1, unit: "Ом" },
  },
  formula: "R_{\\text{посл}}=R_1+R_2,\\qquad R_{\\text{пар}}=\\frac{R_1 R_2}{R_1+R_2}",
  answerUnit: "Ом",
  answerKind: "positive",
  solver: equivalentResistance,
  distractors: resistorNetworkDistractors,
  diagram: (p) => ({
    kind: "circuit",
    spec: {
      id: "resistor-network-task",
      topology: isParallelVariant(p) ? "parallel" : "series",
      sourceLabel: "U",
      resistorLabels: ["R₁", "R₂"],
      tone: "blue",
    },
  }),
  textTemplate: (p) =>
    isParallelVariant(p)
      ? `Резисторы сопротивлением ${p.r1} Ом и ${p.r2} Ом соединены параллельно. Найдите сопротивление участка.`
      : `Резисторы сопротивлением ${p.r1} Ом и ${p.r2} Ом соединены последовательно. Найдите сопротивление участка.`,
  explanationTemplate: (p, answer) =>
    isParallelVariant(p)
      ? `При параллельном соединении складываются проводимости, поэтому общее сопротивление меньше меньшего: R = R₁R₂/(R₁+R₂) = ${p.r1}·${p.r2}/(${p.r1}+${p.r2}) = ${answer} Ом.`
      : `При последовательном соединении ток один и тот же, а напряжения складываются, поэтому складываются и сопротивления: R = ${p.r1} + ${p.r2} = ${answer} Ом.`,
  trap: "Путает формулы последовательного и параллельного соединения.",
  coachLines: {
    correct: (p) =>
      isParallelVariant(p)
        ? "Да. Параллельно — общее сопротивление всегда меньше меньшего из двух."
        : "Да. Последовательно — сопротивления просто складываются.",
    wrong: (p, selected, correct) =>
      isParallelVariant(p)
        ? `Проверь себя: при параллельном соединении общее сопротивление меньше меньшего из R₁ и R₂. Здесь R = ${correct} Ом, а не ${selected} Ом.`
        : `Последовательное соединение — это сумма: R = ${p.r1} + ${p.r2} = ${correct} Ом, а не ${selected} Ом.`,
  },
  constraints: [answerIsClean, (p) => p.r1 !== p.r2],
  variantCount: 2,
};
