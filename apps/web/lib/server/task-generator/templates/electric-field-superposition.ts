import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function chargeSign(value: number): number {
  return value === 1 ? 1 : -1;
}

function fieldMagnitude(charge: number, distanceCm: number): number {
  // k≈9·10⁹; Q in nC and r in cm give E in N/C.
  return 90_000 * charge / distanceCm ** 2;
}

function components(params: Params) {
  const left = fieldMagnitude(params.leftCharge, params.leftDistanceCm);
  const right = fieldMagnitude(params.rightCharge, params.rightDistanceCm);
  return {
    left,
    right,
    leftDirection: chargeSign(params.leftSign),
    rightDirection: -chargeSign(params.rightSign),
  };
}

function resultant(params: Params): number {
  const field = components(params);
  return field.leftDirection * field.left + field.rightDirection * field.right;
}

const distractors: DistractorRule[] = [
  {
    label: "считаешь, что правый источник расположен слева от точки P",
    compute: params => {
      const field = components(params);
      return field.leftDirection * field.left + chargeSign(params.rightSign) * field.right;
    },
  },
  {
    label: "разворачиваешь результирующее поле, как силу для отрицательного пробного заряда",
    compute: params => -resultant(params),
  },
  {
    label: "неверно определяешь направление поля левого источника",
    compute: params => {
      const field = components(params);
      return -field.leftDirection * field.left + field.rightDirection * field.right;
    },
  },
];

export const electricFieldSuperpositionBlueprint: TaskBlueprint = {
  id: "electric-field-superposition",
  skill: "Суперпозиция электрических полей на одной прямой",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    leftCharge: { min: 2, max: 8, step: 2, unit: "нКл" },
    leftSign: { min: 1, max: 2, step: 1, unit: "знак левого заряда" },
    leftDistanceCm: { min: 10, max: 30, step: 10, unit: "см" },
    rightCharge: { min: 2, max: 8, step: 2, unit: "нКл" },
    rightSign: { min: 1, max: 2, step: 1, unit: "знак правого заряда" },
    rightDistanceCm: { min: 10, max: 30, step: 10, unit: "см" },
  },
  formula: "E_x=E_{1x}+E_{2x}",
  answerUnit: "Н/Кл",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: resultant,
  distractors,
  textTemplate: params => {
    const leftSign = params.leftSign === 1 ? "+" : "−";
    const rightSign = params.rightSign === 1 ? "+" : "−";
    return "На одной прямой слева направо расположены заряд A = " + leftSign + params.leftCharge +
      " нКл, точка P и заряд B = " + rightSign + params.rightCharge +
      " нКл. Расстояние от A до P равно " +
      params.leftDistanceCm + " см, от P до B — " + params.rightDistanceCm +
      " см. Найдите проекцию результирующей напряжённости в точке P на ось, направленную вправо. " +
      "Ответ дайте в Н/Кл: знак «+» означает направление вправо, «−» — влево. Примите k = 9·10⁹ Н·м²/Кл².";
  },
  explanationTemplate: (params, answer) => {
    const field = components(params);
    const leftArrow = field.leftDirection > 0 ? "→" : "←";
    const rightArrow = field.rightDirection > 0 ? "→" : "←";
    const leftSigned = field.leftDirection * field.left;
    const rightSigned = field.rightDirection * field.right;
    const resultDirection = answer > 0 ? "вправо" : "влево";
    return "Сначала найдём модули полей в точке P: $E_A=90000\\cdot" +
      formatMathValue(params.leftCharge) + "/" + formatMathValue(params.leftDistanceCm) +
      "^2=" + formatMathValue(field.left) + "$ Н/Кл и $E_B=90000\\cdot" +
      formatMathValue(params.rightCharge) + "/" + formatMathValue(params.rightDistanceCm) +
      "^2=" + formatMathValue(field.right) + "$ Н/Кл. Поле положительного источника направлено от него, отрицательного — к нему: $E_{Ax}=" +
      formatMathValue(leftSigned) + "$ Н/Кл (" + leftArrow + "), $E_{Bx}=" +
      formatMathValue(rightSigned) + "$ Н/Кл (" + rightArrow + "). По принципу суперпозиции $E_x=E_{Ax}+E_{Bx}=" +
      formatMathValue(leftSigned) + "+(" + formatMathValue(rightSigned) + ")=" +
      formatMathValue(answer) + "$ Н/Кл; результирующее поле направлено " + resultDirection + ".";
  },
  trap: "Направление поля каждого источника определяется его знаком и положением точки P. Складывай проекции со знаками, а не модули автоматически.",
  coachLines: {
    correct: params => "Верно: ты определил направление каждого поля в точке P, а затем сложил проекции на выбранную ось.",
    wrong: (_params, selected, correct) => "Проверь направление поля каждого источника относительно точки P и сложи проекции со знаками. Получается " +
      formatAnswerValue(correct) + " Н/Кл, а не " + formatAnswerValue(selected) + " Н/Кл.",
  },
  // Не допускаем взаимной компенсации модулей: она даёт E=0 и сливает
  // несколько распространённых направленческих ошибок в один вариант ответа.
  constraints: [params => {
    const field = components(params);
    return Math.abs(field.left - field.right) > 1e-9;
  }],
};
