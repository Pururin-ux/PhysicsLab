import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function coolerHeat(params: Params): number {
  return params.heatInput * params.coolerPercent / 100;
}

function efficiency(params: Params): number {
  return 100 - params.coolerPercent;
}

const distractors: DistractorRule[] = [
  { label: "принимаешь долю теплоты холодильника за КПД", compute: p => p.coolerPercent },
  { label: "считаешь, что вся теплота стала работой", compute: () => 100 },
  { label: "делишь полученную теплоту на отданную", compute: p => Number((10000 / p.coolerPercent).toFixed(3)) },
];

export const heatEngineEfficiencyBlueprint: TaskBlueprint = {
  id: "heat-engine-efficiency",
  skill: "Термический КПД теплового двигателя",
  topic: "Термодинамика",
  group: "thermodynamics",
  difficulty: 2,
  params: {
    heatInput: { min: 5, max: 20, step: 1, unit: "кДж" },
    coolerPercent: { min: 55, max: 80, step: 5, unit: "%" },
  },
  formula: "\\eta_{\\text{т}}=\\frac{Q_1-|Q_2|}{Q_1}\\cdot100\\%",
  answerUnit: "%",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: efficiency,
  distractors,
  textTemplate: params =>
    "За один цикл рабочее тело теплового двигателя получает от нагревателя " +
    formatAnswerValue(params.heatInput) + " кДж и отдаёт холодильнику " +
    formatAnswerValue(coolerHeat(params)) +
    " кДж. Найдите термический КПД двигателя в процентах.",
  explanationTemplate: (params, answer) => {
    const output = coolerHeat(params);
    const work = params.heatInput - output;
    return "После полного цикла изменение внутренней энергии рабочего тела равно нулю. " +
      "Его работа $A_{\\text{ц}}=Q_1-|Q_2|=" +
      formatMathValue(params.heatInput) + "-" + formatMathValue(output) + "=" +
      formatMathValue(work) + "$ кДж. Термический КПД " +
      "$\\eta_{\\text{т}}=A_{\\text{ц}}/Q_1\\cdot100\\%=" +
      formatMathValue(work) + "/" + formatMathValue(params.heatInput) +
      "\\cdot100\\%=" + formatMathValue(answer) + "\\%$.";
  },
  trap: "Теплота, отданная холодильнику, не превращается в работу. Вычти её модуль из Q₁.",
  coachLines: {
    correct: () => "Верно. Работа за цикл — разность полученной и отданной теплоты; её доля в Q₁ и есть термический КПД.",
    wrong: (_params, selected, correct) =>
      "Сначала найди работу за цикл: $A_{\\text{ц}}=Q_1-|Q_2|$. КПД равен " +
      formatAnswerValue(correct) + " %, а не " + formatAnswerValue(selected) + " %.",
  },
};
