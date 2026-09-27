import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function chargeSign(value: number): number {
  return value === 1 ? 1 : -1;
}

function sourcePotential(charge: number, sign: number, distanceCm: number): number {
  // k≈9·10⁹; Q in nC and r in cm give φ in volts: φ = 900·Q/r.
  return 900 * chargeSign(sign) * charge / distanceCm;
}

function components(params: Params) {
  return {
    left: sourcePotential(params.leftCharge, params.leftSign, params.leftDistanceCm),
    right: sourcePotential(params.rightCharge, params.rightSign, params.rightDistanceCm),
  };
}

function resultant(params: Params): number {
  const potential = components(params);
  return potential.left + potential.right;
}

const distractors: DistractorRule[] = [
  {
    label: "учитываешь потенциал только левого источника",
    compute: params => components(params).left,
  },
  {
    label: "учитываешь потенциал только правого источника",
    compute: params => components(params).right,
  },
  {
    label: "вычитаешь потенциал правого источника вместо алгебраического сложения",
    compute: params => {
      const potential = components(params);
      return potential.left - potential.right;
    },
  },
];

export const multiSourcePotentialBlueprint: TaskBlueprint = {
  id: "multi-source-potential",
  skill: "Потенциал поля нескольких точечных зарядов",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    leftCharge: { min: 2, max: 10, step: 2, unit: "нКл" },
    leftSign: { min: 1, max: 2, step: 1, unit: "знак левого заряда" },
    leftDistanceCm: { min: 10, max: 50, step: 10, unit: "см" },
    rightCharge: { min: 2, max: 10, step: 2, unit: "нКл" },
    rightSign: { min: 1, max: 2, step: 1, unit: "знак правого заряда" },
    rightDistanceCm: { min: 10, max: 50, step: 10, unit: "см" },
  },
  formula: "\\varphi_P=\\varphi_A+\\varphi_B",
  answerUnit: "В",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: resultant,
  distractors,
  textTemplate: params => {
    const leftSign = params.leftSign === 1 ? "+" : "−";
    const rightSign = params.rightSign === 1 ? "+" : "−";
    return "В вакууме неподвижные точечные заряды A = " + leftSign + params.leftCharge +
      " нКл и B = " + rightSign + params.rightCharge +
      " нКл находятся на расстояниях " + params.leftDistanceCm + " см и " +
      params.rightDistanceCm + " см от точки P соответственно. Потенциал на бесконечности принят равным нулю. " +
      "Найдите потенциал в точке P. Ответ дайте в вольтах со знаком. Примите k = 9·10⁹ Н·м²/Кл².";
  },
  explanationTemplate: (params, answer) => {
    const potential = components(params);
    const leftCharge = chargeSign(params.leftSign) * params.leftCharge;
    const rightCharge = chargeSign(params.rightSign) * params.rightCharge;
    return "Для каждого источника используем $\\varphi=kQ/r$. При Q в нКл и r в см: $\\varphi_A=900\\cdot(" +
      formatMathValue(leftCharge) + ")/" + formatMathValue(params.leftDistanceCm) + "=" +
      formatMathValue(potential.left) + "$ В; $\\varphi_B=900\\cdot(" +
      formatMathValue(rightCharge) + ")/" + formatMathValue(params.rightDistanceCm) + "=" +
      formatMathValue(potential.right) + "$ В. Потенциал — скалярная величина, поэтому складываем значения со знаками: $\\varphi_P=\\varphi_A+\\varphi_B=" +
      formatMathValue(potential.left) + "+(" + formatMathValue(potential.right) + ")=" +
      formatMathValue(answer) + "$ В. Знак каждого слагаемого задаёт знак соответствующего заряда, а не его положение относительно P.";
  },
  trap: "Потенциал — скалярная величина: положение источника не задаёт направление, а знак слагаемого задаёт заряд. Потенциалы складываются алгебраически.",
  coachLines: {
    correct: () => "Верно. Ты нашёл потенциал от каждого источника и сложил скалярные значения со знаками.",
    wrong: (_params, selected, correct) => "Проверь знак каждого заряда и сложи потенциалы алгебраически; положение источника не меняет знак φ. Получается " +
      formatAnswerValue(correct) + " В, а не " + formatAnswerValue(selected) + " В.",
  },
  // Исключаем только наборы, в которых типичные ошибки дают одинаковые
  // варианты ответа. Нулевой потенциал оставляем как физически значимый случай.
  constraints: [params => {
    const potential = components(params);
    const answer = potential.left + potential.right;
    const wrong = [potential.left, potential.right, potential.left - potential.right];
    return new Set([answer, ...wrong]).size === 4;
  }],
};
