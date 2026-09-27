import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function signedSourceCharge(params: Params): number {
  return params.sourceSign === 1 ? params.sourceCharge : -params.sourceCharge;
}

function potentialVolts(params: Params): number {
  // k≈9·10⁹, Q in nC and r in cm: φ = 900Q/r in volts.
  return 900 * signedSourceCharge(params) / params.distanceCm;
}

const distractors: DistractorRule[] = [
  { label: "теряешь знак заряда-источника", compute: p => -potentialVolts(p) },
  { label: "подставляешь квадрат расстояния как для напряжённости", compute: p => potentialVolts(p) / p.distanceCm },
  { label: "не переводишь сантиметры в метры", compute: p => potentialVolts(p) * 100 },
];

export const pointChargePotentialBlueprint: TaskBlueprint = {
  id: "point-charge-potential",
  skill: "Потенциал поля точечного заряда",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    sourceCharge: { min: 2, max: 10, step: 2, unit: "нКл" },
    sourceSign: { min: 1, max: 2, step: 1, unit: "знак источника" },
    distanceCm: { min: 10, max: 50, step: 10, unit: "см" },
  },
  formula: "\\varphi=k\\frac{Q}{r}",
  answerUnit: "В",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: potentialVolts,
  distractors,
  textTemplate: p => "Неподвижный точечный заряд Q = " +
    (p.sourceSign === 1 ? "+" : "−") + p.sourceCharge +
    " нКл создаёт поле в вакууме. При нуле потенциала на бесконечности найдите потенциал в точке на расстоянии " +
    p.distanceCm + " см от источника. Ответ дайте в вольтах со знаком. Примите k = 9·10⁹ Н·м²/Кл².",
  explanationTemplate: (p, answer) => "При выбранном нуле потенциала $\\varphi=kQ/r$. " +
    "Для Q в нКл и r в см получается $\\varphi=\\frac{900\\cdot(" +
    formatMathValue(signedSourceCharge(p)) + ")}{" + formatMathValue(p.distanceCm) + "}" +
    "=" + formatMathValue(answer) + "$ В. Потенциал — скалярная величина; его знак здесь совпадает со знаком источника.",
  trap: "Потенциал точечного источника зависит от 1/r, а напряжённость — от 1/r². Для φ нужен заряд Q со знаком и выбранный ноль на бесконечности.",
  coachLines: {
    correct: p => "Верно. Потенциал найден по 1/r и имеет знак " +
      (p.sourceSign === 1 ? "положительного" : "отрицательного") + " источника.",
    wrong: (_p, selected, correct) => "Проверь знак Q, перевод сантиметров и зависимость 1/r. Получается " +
      formatAnswerValue(correct) + " В, а не " + formatAnswerValue(selected) + " В.",
  },
};
