import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

const sine = (params: Params) => params.angleCase === 1 ? 0.5 : 1;
const angle = (params: Params) => params.angleCase === 1 ? 30 : 90;
const force = (params: Params) =>
  (params.inductionMilliTeslas / 1000) * params.currentAmperes *
  (params.lengthCentimetres / 100) * sine(params);

const distractors: DistractorRule[] = [
  { label: "не учитываешь угол между током и полем", compute: params => force(params) / sine(params) },
  { label: "не переводишь сантиметры в метры", compute: params => force(params) * 100 },
  { label: "не переводишь миллитеслы в теслы", compute: params => force(params) * 1000 },
];

export const ampereForceMagnitudeBlueprint: TaskBlueprint = {
  id: "ampere-force-magnitude",
  skill: "Модуль силы Ампера в однородном поле",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    inductionMilliTeslas: { min: 200, max: 400, step: 200, unit: "мТл" },
    currentAmperes: { min: 2, max: 4, step: 2, unit: "А" },
    lengthCentimetres: { min: 25, max: 50, step: 25, unit: "см" },
    angleCase: { min: 1, max: 2, step: 1, unit: "угол" },
  },
  formula: "F_{\\text{А}}=BI\\ell\\sin\\alpha",
  answerUnit: "Н",
  answerKind: "magnitude",
  answerFormat: "numeric_input",
  solver: force,
  distractors,
  textTemplate: params =>
    `Прямолинейный участок проводника длиной ${params.lengthCentimetres} см полностью находится в однородном магнитном поле индукции ${params.inductionMilliTeslas} мТл. По нему проходит ток ${params.currentAmperes} А. Угол между направлением тока и индукции равен ${angle(params)}°. Найди модуль силы Ампера в ньютонах.`,
  explanationTemplate: (params, answer) =>
    `В однородном поле $F_{\\text{А}}=BI\\ell\\sin\\alpha$. Переведём $B=${formatMathValue(params.inductionMilliTeslas)}\\,\\text{мТл}=${formatMathValue(params.inductionMilliTeslas / 1000)}\\,\\text{Тл}$ и $\\ell=${formatMathValue(params.lengthCentimetres)}\\,\\text{см}=${formatMathValue(params.lengthCentimetres / 100)}\\,\\text{м}$. При $\\alpha=${angle(params)}^\\circ$ синус равен ${formatMathValue(sine(params))}. Тогда $F_{\\text{А}}=${formatMathValue(params.inductionMilliTeslas / 1000)}\\cdot${formatMathValue(params.currentAmperes)}\\cdot${formatMathValue(params.lengthCentimetres / 100)}\\cdot${formatMathValue(sine(params))}=${formatMathValue(answer)}\\,\\text{Н}$. Направление силы по одному модулю не определяют.`,
  trap: "Индукция B относится к внешнему полю и не меняется от перестановки пробного проводника. В формулу входит только длина в поле и синус угла между током и B.",
  coachLines: {
    correct: () => "Верно. Учитываются индукция поля, ток, длина участка в поле и угол между током и полем.",
    wrong: params => `Проверь единицы: ${params.inductionMilliTeslas} мТл = ${formatMathValue(params.inductionMilliTeslas / 1000)} Тл, ${params.lengthCentimetres} см = ${formatMathValue(params.lengthCentimetres / 100)} м. При ${angle(params)}° синус равен ${formatMathValue(sine(params))}.`,
  },
};
