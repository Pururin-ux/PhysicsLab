import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

const forceMicroNewtons = (params: Params) =>
  params.chargeMicroCoulombs * params.speedMetresPerSecond * params.inductionMilliTeslas / 1000;

const distractors: DistractorRule[] = [
  { label: "не переводишь миллитеслы в теслы", compute: params => forceMicroNewtons(params) * 1000 },
  { label: "делишь на скорость вместо умножения", compute: params => forceMicroNewtons(params) / params.speedMetresPerSecond },
  { label: "подставляешь половину индукции", compute: params => forceMicroNewtons(params) / 2 },
];

export const lorentzForceMagnitudeBlueprint: TaskBlueprint = {
  id: "lorentz-force-magnitude",
  skill: "Модуль силы Лоренца для перпендикулярного влёта",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    chargeMicroCoulombs: { min: 1, max: 3, step: 1, unit: "мкКл" },
    speedMetresPerSecond: { min: 100, max: 300, step: 100, unit: "м/с" },
    inductionMilliTeslas: { min: 100, max: 300, step: 100, unit: "мТл" },
  },
  formula: "F_{\\text{Л}}=|q|vB",
  answerUnit: "мкН",
  answerKind: "magnitude",
  answerFormat: "numeric_input",
  solver: forceMicroNewtons,
  distractors,
  textTemplate: params =>
    `Заряженная частица с модулем заряда ${params.chargeMicroCoulombs} мкКл движется со скоростью ${params.speedMetresPerSecond} м/с перпендикулярно линиям однородного магнитного поля индукции ${params.inductionMilliTeslas} мТл. Найди модуль магнитной силы Лоренца в микроньютонах. Других сил в задаче не учитывай.`,
  explanationTemplate: (params, answer) =>
    `При движении поперёк поля $\\sin90^\\circ=1$, поэтому $F_{\\text{Л}}=|q|vB$. Индукция $B=${formatMathValue(params.inductionMilliTeslas)}\\,\\text{мТл}=${formatMathValue(params.inductionMilliTeslas / 1000)}\\,\\text{Тл}$. Если заряд задан в мкКл, то произведение $|q|vB$ сразу даёт силу в мкН: $F_{\\text{Л}}=${formatMathValue(params.chargeMicroCoulombs)}\\cdot${formatMathValue(params.speedMetresPerSecond)}\\cdot${formatMathValue(params.inductionMilliTeslas / 1000)}=${formatMathValue(answer)}\\,\\text{мкН}$. Знак заряда меняет направление отклонения, а не модуль силы.`,
  trap: "Используй модуль заряда; знак определяет направление, а не величину силы. Для мкКл и мкН множитель 10⁻⁶ сокращается, но мТл всё равно надо перевести в Тл.",
  coachLines: {
    correct: () => "Верно. При перпендикулярном влёте модуль силы равен |q|vB.",
    wrong: params => `Проверь единицы: ${params.inductionMilliTeslas} мТл = ${formatMathValue(params.inductionMilliTeslas / 1000)} Тл. В задаче скорость перпендикулярна полю, поэтому sin 90° = 1.`,
  },
};
