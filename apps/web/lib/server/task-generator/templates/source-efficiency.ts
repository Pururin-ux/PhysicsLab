import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function efficiencyPercent(params: Params): number {
  return Math.round((100 * params.R) / (params.R + params.r));
}

const distractors: DistractorRule[] = [
  {
    label: "принимаешь долю внутренних потерь за КПД",
    compute: params => Math.round((100 * params.r) / (params.R + params.r)),
  },
  {
    label: "делишь внешнее сопротивление на внутреннее",
    compute: params => Math.round((100 * params.R) / params.r),
  },
  { label: "считаешь, что на нагрузку поступает вся мощность", compute: () => 100 },
];

export const sourceEfficiencyBlueprint: TaskBlueprint = {
  id: "source-efficiency",
  skill: "КПД источника тока",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    r: { min: 1, max: 4, step: 1, unit: "Ом" },
    R: { min: 2, max: 18, step: 1, unit: "Ом" },
  },
  formula: "\\eta=\\frac{R}{R+r}\\cdot100\\%",
  answerUnit: "%",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: efficiencyPercent,
  diagram: () => ({
    kind: "circuit",
    spec: {
      id: "source-efficiency-task",
      topology: "source-internal",
      sourceLabel: "ε",
      internalResistanceLabel: "r",
      resistorLabels: ["R"],
      tone: "gold",
    },
  }),
  distractors,
  textTemplate: params =>
    `Источник с внутренним сопротивлением ${params.r} Ом подключили к резистору ${params.R} Ом. Какой процент мощности источника получает нагрузка? Ответ округли до целого процента.`,
  explanationTemplate: (params, answer) =>
    `Мощность на нагрузке $P_R=I^2R$, мощность источника $P_{\\text{ист}}=I^2(R+r)$. Поэтому $\\eta=\\frac{P_R}{P_{\\text{ист}}}\\cdot100\\%=\\frac{R}{R+r}\\cdot100\\%=\\frac{${formatMathValue(params.R)}}{${formatMathValue(params.R)}+${formatMathValue(params.r)}}\\cdot100\\%\\approx${formatMathValue(answer)}\\%$.`,
  trap: "КПД — доля мощности, поступившая во внешнюю нагрузку; нагрев внутреннего сопротивления не является полезной мощностью.",
  coachLines: {
    correct: () => "Верно. Внешнее сопротивление определяет полезную долю мощности, а внутреннее — потери в источнике.",
    wrong: (_params, selected, correct) =>
      `Сравни мощность нагрузки с полной мощностью источника: КПД равен ${formatAnswerValue(correct)} %, а не ${formatAnswerValue(selected)} %.`,
  },
  constraints: [params => params.R > params.r],
};
