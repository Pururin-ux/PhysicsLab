import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const cases = [
  { sentWatts: 120, inputVolts: 24, lineOhms: 0.4 },
  { sentWatts: 120, inputVolts: 60, lineOhms: 0.4 },
  { sentWatts: 96, inputVolts: 24, lineOhms: 0.5 },
  { sentWatts: 96, inputVolts: 48, lineOhms: 0.5 },
  { sentWatts: 60, inputVolts: 30, lineOhms: 0.25 },
] as const;

function values(params: Params) {
  return cases[params.caseId - 1] ?? cases[0];
}

function lineCurrent(params: Params) {
  const { sentWatts, inputVolts } = values(params);
  return sentWatts / inputVolts;
}

function heatingWatts(params: Params) {
  return lineCurrent(params) ** 2 * values(params).lineOhms;
}

const distractors: DistractorRule[] = [
  { label: "забываешь квадрат тока", compute: params => lineCurrent(params) * values(params).lineOhms },
  { label: "делишь на сопротивление вместо умножения", compute: params => lineCurrent(params) ** 2 / values(params).lineOhms },
  { label: "находишь дошедшую мощность вместо потери", compute: params => values(params).sentWatts - heatingWatts(params) },
];

export const transmissionLineLossBlueprint: TaskBlueprint = {
  id: "transmission-line-loss",
  skill: "Нагрев линии при передаче энергии",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: { caseId: { min: 1, max: cases.length, step: 1, unit: "случай" } },
  formula: "P_{\\text{наг}}=\\left(\\frac{P_{\\text{вх}}}{U_{\\text{вх}}}\\right)^2 R_{\\text{л}}",
  answerUnit: "Вт",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: heatingWatts,
  distractors,
  textTemplate: params => {
    const { sentWatts, inputVolts, lineOhms } = values(params);
    return "В учебной модели источник отдаёт на вход одной линии " + formatAnswerValue(sentWatts) +
      " Вт активной мощности при напряжении " + formatAnswerValue(inputVolts) +
      " В. Линия имеет только активное сопротивление " + formatAnswerValue(lineOhms) +
      " Ом. Найди мощность, которая выделяется в проводе как тепло, в ваттах.";
  },
  explanationTemplate: (params, answer) => {
    const { sentWatts, inputVolts, lineOhms } = values(params);
    const current = lineCurrent(params);
    return "Сначала найдём ток на входе линии: $I=P_{\\text{вх}}/U_{\\text{вх}}=" +
      formatMathValue(sentWatts) + "/" + formatMathValue(inputVolts) + "=" +
      formatMathValue(current) + "\\,\\text{А}$. В линии с активным сопротивлением " +
      "$P_{\\text{наг}}=I^2R_{\\text{л}}=" + formatMathValue(current) +
      "^2\\cdot" + formatMathValue(lineOhms) + "=" + formatMathValue(answer) +
      "\\,\\text{Вт}$. Это потеря на нагрев, а не вся мощность источника.";
  },
  trap: "При той же мощности на входе линии большее напряжение даёт меньший ток. Нагрев провода пропорционален квадрату тока.",
  coachLines: {
    correct: () => "Верно. Ты отделил мощность источника от той её части, которая нагревает линию.",
    wrong: (params, selected, correct) =>
      "Найди ток " + formatAnswerValue(lineCurrent(params)) + " А и возведи его в квадрат перед умножением на сопротивление. Тогда потеря — " +
      formatAnswerValue(correct) + " Вт; твой ответ — " + formatAnswerValue(selected) + " Вт.",
  },
  variantCount: cases.length,
};
