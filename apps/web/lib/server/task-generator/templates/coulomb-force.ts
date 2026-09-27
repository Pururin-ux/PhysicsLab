import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function forceMicroNewtons(params: Params): number {
  return Number((90 * params.q1 * params.q2 / (params.epsilon * params.rCm ** 2)).toFixed(1));
}

const distractors: DistractorRule[] = [
  { label: "делишь на расстояние вместо его квадрата", compute: p => forceMicroNewtons(p) * p.rCm },
  { label: "путаешь микро- и миллиньютоны", compute: p => forceMicroNewtons(p) * 1000 },
  { label: "забываешь модуль второго заряда", compute: p => forceMicroNewtons(p) / p.q2 },
];

function interaction(params: Params): string {
  return params.sign === 1 ? "отталкиваются" : "притягиваются";
}

export const coulombForceBlueprint: TaskBlueprint = {
  id: "coulomb-force",
  skill: "Сила взаимодействия точечных зарядов",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    q1: { min: 2, max: 8, step: 2, unit: "нКл" },
    q2: { min: 2, max: 8, step: 2, unit: "нКл" },
    rCm: { min: 10, max: 40, step: 10, unit: "см" },
    epsilon: { min: 1, max: 2, step: 1, unit: "относительная диэлектрическая проницаемость" },
    sign: { min: 1, max: 2, step: 1, unit: "знак второго заряда" },
  },
  formula: "F=k\\frac{|q_1q_2|}{\\varepsilon r^2}",
  answerUnit: "мкН",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: forceMicroNewtons,
  distractors,
  textTemplate: params => {
    const medium = params.epsilon === 1
      ? "в вакууме"
      : "в однородной диэлектрической среде с относительной проницаемостью ε = 2";
    const secondSign = params.sign === 1 ? "+" : "−";
    return "Два неподвижных точечных заряда +" + params.q1 + " нКл и " +
      secondSign + params.q2 + " нКл находятся " + medium +
      " на расстоянии " + params.rCm +
      " см. Найдите модуль силы их взаимодействия в микроньютонах, округлив до десятых. Примите k = 9·10⁹ Н·м²/Кл².";
  },
  explanationTemplate: (params, answer) => {
    const medium = params.epsilon === 1 ? "вакууме" : "среде с ε=2";
    return "Заряды " + interaction(params) + ", но знак не меняет модуль силы. В " +
      medium + " используем $F=k|q_1q_2|/(\\varepsilon r^2)$. " +
      "При зарядах в нКл и расстоянии в см результат в мкН равен " +
      "$F=90\\cdot" + formatMathValue(params.q1) + "\\cdot" +
      formatMathValue(params.q2) + "/(" + formatMathValue(params.epsilon) +
      "\\cdot" + formatMathValue(params.rCm) + "^2)\\approx" +
      formatMathValue(answer) + "$ мкН.";
  },
  trap: "В формуле стоят модули зарядов и квадрат расстояния. Знаки определяют направление сил, а проницаемость среды уменьшает модуль.",
  coachLines: {
    correct: params => "Верно. Сила убывает как 1/r²; заряды " + interaction(params) + ".",
    wrong: (_params, selected, correct) =>
      "Проверь квадрат расстояния, проницаемость среды и перевод в микроньютоны. Получается " +
      formatAnswerValue(correct) + " мкН, а не " + formatAnswerValue(selected) + " мкН.",
  },
};
