import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function signedDisplacementCm(params: Params): number {
  return params.direction === 1 ? params.distanceCm : -params.distanceCm;
}

function voltageVolts(params: Params): number {
  // The x-axis follows E, so U_AB = φ_A − φ_B = E(x_B − x_A).
  return params.fieldVPerM * signedDisplacementCm(params) / 100;
}

const distractors: DistractorRule[] = [
  { label: "меняешь местами начальную и конечную точки", compute: p => -voltageVolts(p) },
  { label: "не переводишь сантиметры в метры", compute: p => voltageVolts(p) * 100 },
  { label: "удваиваешь перемещение между точками", compute: p => voltageVolts(p) * 2 },
];

export const uniformFieldVoltageBlueprint: TaskBlueprint = {
  id: "uniform-field-voltage",
  skill: "Напряжение между точками однородного поля",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    fieldVPerM: { min: 100, max: 500, step: 100, unit: "В/м" },
    distanceCm: { min: 10, max: 60, step: 10, unit: "см" },
    direction: { min: 1, max: 2, step: 1, unit: "порядок точек вдоль E" },
  },
  formula: "U_{AB}=\\varphi_A-\\varphi_B=E\\Delta x",
  answerUnit: "В",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: voltageVolts,
  distractors,
  textTemplate: p => "В центральной области между большими пластинами однородное электростатическое поле напряжённостью " +
    p.fieldVPerM + " В/м направлено вправо. Точка B находится на " + p.distanceCm +
    " см " + (p.direction === 1 ? "правее" : "левее") +
    " точки A. Найдите напряжение от A к B: UAB = φA − φB. Ответ дайте в вольтах со знаком.",
  explanationTemplate: (p, answer) => {
    const dx = signedDisplacementCm(p) / 100;
    return "Ось направлена вдоль E, поэтому $\\Delta x=" + formatMathValue(dx) +
      "$ м. Напряжение от A к B: $U_{AB}=E\\Delta x=" +
      formatMathValue(p.fieldVPerM) + "\\cdot(" + formatMathValue(dx) +
      ")=" + formatMathValue(answer) + "$ В. При перестановке A и B знак напряжения изменится; выбранный ноль потенциала на ответ не влияет.";
  },
  trap: "Сначала задай положительное направление по E. UAB = φA − φB = EΔx; при перестановке A и B знак меняется. Сантиметры переведи в метры.",
  coachLines: {
    correct: () => "Верно. Напряжение определено для порядка A→B и не зависит от общего нуля потенциала.",
    wrong: (_p, selected, correct) => "Проверь порядок A и B, знак проекции и перевод сантиметров. Получается " +
      formatAnswerValue(correct) + " В, а не " + formatAnswerValue(selected) + " В.",
  },
};
