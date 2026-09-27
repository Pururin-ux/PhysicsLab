import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function fieldStrength(params: Params): number {
  // k≈9·10⁹, Q in nC, r in cm → E in N/C.
  return Number((90_000 * params.sourceCharge / (params.epsilon * params.distanceCm ** 2)).toFixed(1));
}

const distractors: DistractorRule[] = [
  { label: "делишь на расстояние вместо квадрата", compute: p => fieldStrength(p) * p.distanceCm },
  { label: "ошибаешься в переводе сантиметров", compute: p => fieldStrength(p) * 100 },
  { label: "делишь на модуль заряда-источника повторно", compute: p => fieldStrength(p) / p.sourceCharge },
];

export const electricFieldStrengthBlueprint: TaskBlueprint = {
  id: "electric-field-strength",
  skill: "Напряжённость поля точечного заряда",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    sourceCharge: { min: 2, max: 8, step: 2, unit: "нКл" },
    distanceCm: { min: 10, max: 40, step: 10, unit: "см" },
    epsilon: { min: 1, max: 2, step: 1, unit: "относительная диэлектрическая проницаемость" },
    sourceSign: { min: 1, max: 2, step: 1, unit: "знак заряда-источника" },
  },
  formula: "E=k\\frac{|Q|}{\\varepsilon r^2}",
  answerUnit: "Н/Кл",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: fieldStrength,
  distractors,
  textTemplate: params => {
    const medium = params.epsilon === 1
      ? "в вакууме"
      : "в однородном диэлектрике с относительной проницаемостью ε = 2";
    const sign = params.sourceSign === 1 ? "+" : "−";
    return "Неподвижный точечный заряд " + sign + params.sourceCharge +
      " нКл создаёт электростатическое поле " + medium + ". Найдите модуль напряжённости поля на расстоянии " +
      params.distanceCm + " см от заряда в Н/Кл. Примите k = 9·10⁹ Н·м²/Кл².";
  },
  explanationTemplate: (params, answer) => {
    const direction = params.sourceSign === 1 ? "от положительного источника" : "к отрицательному источнику";
    return "Для модуля напряжённости используем $E=k|Q|/(\\varepsilon r^2)$. " +
      "При Q в нКл и r в см получаем $E=90000\\cdot" + formatMathValue(params.sourceCharge) +
      "/(" + formatMathValue(params.epsilon) + "\\cdot" + formatMathValue(params.distanceCm) +
      "^2)\\approx" + formatMathValue(answer) + "$ Н/Кл. " +
      "Направление поля — " + direction + "; знак источника не делает модуль отрицательным.";
  },
  trap: "Напряжённость характеризует поле источника в выбранной точке, а не величину пробного заряда. Расстояние стоит в квадрате.",
  coachLines: {
    correct: params => "Верно. Модуль найден по 1/r²; поле направлено " +
      (params.sourceSign === 1 ? "от источника." : "к источнику."),
    wrong: (_params, selected, correct) => "Проверь квадрат расстояния, проницаемость среды и единицы. Получается " +
      formatAnswerValue(correct) + " Н/Кл, а не " + formatAnswerValue(selected) + " Н/Кл.",
  },
};
