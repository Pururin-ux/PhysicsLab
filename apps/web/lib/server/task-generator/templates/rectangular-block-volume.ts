import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { variantIndex } from "../solver.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function hasMillimetreEdge(params: Params) {
  return variantIndex(params, 2) === 1;
}

const distractors: DistractorRule[] = [
  { label: "умножаешь только два ребра и получаешь площадь", compute: p => p.aCm * p.bCm },
  { label: "складываешь площадь основания с высотой", compute: p => p.aCm * p.bCm + p.cCm },
  { label: "складываешь три ребра вместо перемножения", compute: p => p.aCm + p.bCm + p.cCm },
];

export const rectangularBlockVolumeBlueprint: TaskBlueprint = {
  id: "rectangular-block-volume",
  skill: "Объём прямоугольного бруска по измеренным рёбрам",
  topic: "Измерения",
  group: "measurements",
  difficulty: 1,
  difficultyFor: params => hasMillimetreEdge(params) ? 2 : 1,
  params: {
    aCm: { min: 3, max: 8, step: 1, unit: "см" },
    bCm: { min: 3, max: 7, step: 1, unit: "см" },
    cCm: { min: 2, max: 6, step: 1, unit: "см" },
  },
  formula: "V=abc,\\qquad 10\\,\\text{мм}=1\\,\\text{см}",
  answerUnit: "см³",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: params => params.aCm * params.bCm * params.cCm,
  distractors,
  constraints: [params => params.aCm * params.bCm !== params.aCm + params.bCm + params.cCm],
  textTemplate: params => {
    const firstEdge = hasMillimetreEdge(params)
      ? `${formatAnswerValue(params.aCm * 10)} мм`
      : `${formatAnswerValue(params.aCm)} см`;
    return `Линейкой измерили три ребра прямоугольного бруска: a = ${firstEdge}, b = ${formatAnswerValue(params.bCm)} см, c = ${formatAnswerValue(params.cCm)} см. Вычисли объём бруска. Ответ дай числом в см³.`;
  },
  explanationTemplate: (params, answer) => {
    const conversion = hasMillimetreEdge(params)
      ? `Сначала выразим первое ребро в сантиметрах: $a=${formatMathValue(params.aCm * 10)}\\,\\text{мм}=${formatMathValue(params.aCm)}\\,\\text{см}$. `
      : "Все три ребра уже выражены в сантиметрах. ";
    return `${conversion}По измеренным рёбрам вычисляем объём косвенно: $V=abc=${formatMathValue(params.aCm)}\\cdot${formatMathValue(params.bCm)}\\cdot${formatMathValue(params.cCm)}=${formatMathValue(answer)}\\,\\text{см}^3$. Кубическая единица получается при умножении трёх длин.`;
  },
  trap: "Сначала вырази все три ребра в сантиметрах. Для объёма перемножь три длины; результат запиши в см³.",
  coachLines: {
    correct: () => "Верно: три измеренных ребра дают объём в кубических сантиметрах.",
    wrong: (params, selected, correct) => {
      const conversion = hasMillimetreEdge(params)
        ? `${formatAnswerValue(params.aCm * 10)} мм = ${formatAnswerValue(params.aCm)} см. `
        : "Все рёбра заданы в сантиметрах. ";
      return `${conversion}Перемножь три длины: ${formatAnswerValue(params.aCm)} · ${formatAnswerValue(params.bCm)} · ${formatAnswerValue(params.cCm)} = ${formatAnswerValue(correct)} см³. Твой ответ — ${formatAnswerValue(selected)} см³.`;
    },
  },
  variantCount: 2,
};
