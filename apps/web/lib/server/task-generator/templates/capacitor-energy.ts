import { capacitorEnergyDistractors } from "../distractors.ts";
import { capacitorEnergyMilliJoules } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const capacitorContexts = [
  "Плоский конденсатор зарядили от источника постоянного напряжения",
  "В лабораторной цепи конденсатор зарядили до заданного напряжения",
  "Накопительный конденсатор подключили к источнику и затем отключили",
  "Конденсатор в демонстрационной установке зарядили перед опытом",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return capacitorContexts[variant % capacitorContexts.length];
}

export const capacitorEnergyBlueprint: TaskBlueprint = {
  id: "capacitor-energy",
  skill: "Энергия конденсатора",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    C: { min: 20, max: 200, step: 20, unit: "мкФ" },
    U: { min: 20, max: 100, step: 10, unit: "В" },
  },
  formula: "W = \\frac{CU^2}{2}",
  answerUnit: "мДж",
  answerKind: "positive",
  solver: capacitorEnergyMilliJoules,
  distractors: capacitorEnergyDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Электроёмкость конденсатора ${p.C} мкФ, напряжение на нём ${p.U} В. Найдите энергию электрического поля конденсатора.`,
  explanationTemplate: (p, answer) =>
    `Так как $C$ дано в мкФ, удобно считать ответ в мДж: $W = \\frac{CU^2}{2} = \\frac{${p.C}\\cdot${p.U}^2}{2000} = ${formatMathValue(answer)}$ мДж.`,
  trap: "В энергии конденсатора напряжение стоит в квадрате, есть деление на 2 и нужен перевод мкФ → мДж.",
  coachLines: {
    correct: () =>
      "Да. Для конденсатора энергия пропорциональна квадрату напряжения: $W=\\frac{CU^2}{2}$.",
    wrong: (_p, selected, correct) =>
      `Проверь три места: $U^2$, коэффициент $\\frac12$ и микрофарады. Получается ${formatAnswerValue(correct)} мДж, а не ${formatAnswerValue(selected)} мДж.`,
  },
  variantCount: capacitorContexts.length,
};
