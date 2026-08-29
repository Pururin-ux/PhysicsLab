import { lorentzForceDistractors } from "../distractors.ts";
import { lorentzForce } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

// Заряд в мкКл, скорость в 10⁶ м/с: степени десятки сокращаются
// (10⁻⁶ · 10⁶ = 1), поэтому ответ в ньютонах равен q · v · B.
function explanationFor(p: Params, answer: number): string {
  return (
    `Заряд летит перпендикулярно полю, поэтому $F_{\\text{Л}} = qvB = ` +
    `${p.q}\\cdot 10^{-6} \\cdot ${p.v}\\cdot 10^{6} \\cdot ${formatMathValue(p.B)} = ` +
    `${formatMathValue(answer)}$ Н. Степени десятки сокращаются: ` +
    `$10^{-6} \\cdot 10^{6} = 1$.`
  );
}

export const lorentzForceBlueprint: TaskBlueprint = {
  id: "lorentz-force",
  skill: "Сила Лоренца",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    q: { min: 2, max: 9, step: 1, unit: "мкКл" },
    v: { min: 2, max: 9, step: 1, unit: "10⁶ м/с" },
    B: { min: 0.1, max: 1, step: 0.1, unit: "Тл" },
  },
  formula: "F_{\\text{Л}}=qvB\\sin\\alpha",
  answerUnit: "Н",
  answerKind: "positive",
  solver: lorentzForce,
  distractors: lorentzForceDistractors,
  textTemplate: (p) =>
    `Заряженная частица с зарядом ${p.q} мкКл влетела в однородное магнитное поле индукцией ` +
    `${formatAnswerValue(p.B)} Тл со скоростью ${p.v}·10⁶ м/с перпендикулярно линиям индукции. ` +
    `Найдите модуль силы Лоренца, действующей на частицу.`,
  explanationTemplate: explanationFor,
  trap: "Теряет множитель в формуле или не сокращает степени десятки при переводе единиц.",
  coachLines: {
    correct: () =>
      "Да. Сила Лоренца: заряд, скорость и индукция перемножаются; при перпендикулярном влёте sin α = 1.",
    wrong: (p, selected, correct) =>
      `Проверь формулу $F = qvB$ и единицы: ${p.q} мкКл · ${p.v}·10⁶ м/с · ${formatAnswerValue(p.B)} Тл = ` +
      `${formatAnswerValue(correct)} Н, а не ${formatAnswerValue(selected)} Н.`,
  },
  difficultyFor: (_p, answer) => (Number.isInteger(answer) ? 2 : 3),
};
