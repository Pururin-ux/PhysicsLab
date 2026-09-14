import { variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const subjects = ["Автобус", "Турист", "Велосипедист"] as const;

function totalPath(p: Params) {
  return p.v1 * p.t1 + p.v2 * p.t2;
}

function totalTime(p: Params) {
  return p.t1 + p.stop + p.t2;
}

function answerFor(p: Params) {
  return totalPath(p) / totalTime(p);
}

function hasGradeSevenPrecision(p: Params) {
  const answer = answerFor(p);
  return Number.isFinite(answer) && Math.abs(answer * 10 - Math.round(answer * 10)) < 1e-9;
}

export const averageSpeedWithStopBlueprint: TaskBlueprint = {
  id: "average-speed-with-stop",
  skill: "Средняя скорость неравномерного движения",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    v1: { min: 2, max: 8, step: 1, unit: "м/с" },
    t1: { min: 3, max: 9, step: 1, unit: "с" },
    v2: { min: 2, max: 8, step: 1, unit: "м/с" },
    t2: { min: 3, max: 9, step: 1, unit: "с" },
    stop: { min: 2, max: 8, step: 1, unit: "с" },
  },
  formula: "v_{\\text{ср}}=\\frac{s_{\\text{весь}}}{t_{\\text{всё}}}",
  answerUnit: "м/с",
  answerKind: "positive",
  solver: answerFor,
  distractors: [
    {
      label: "не включил остановку во всё время",
      compute: (p) => totalPath(p) / (p.t1 + p.t2),
    },
    {
      label: "усреднил скорости двух участков",
      compute: (p) => (p.v1 + p.v2) / 2,
    },
    {
      label: "разделил весь путь только на время первого участка",
      compute: (p) => totalPath(p) / p.t1,
    },
  ],
  textTemplate: (p) => {
    const subject = subjects[variantIndex(p, subjects.length)];
    const s1 = p.v1 * p.t1;
    const s2 = p.v2 * p.t2;
    return `${subject} прошёл ${s1} м за ${p.t1} с, остановился на ${p.stop} с, затем прошёл ещё ${s2} м за ${p.t2} с. Найдите среднюю скорость за весь промежуток.`;
  },
  explanationTemplate: (p, answer) => {
    const s1 = p.v1 * p.t1;
    const s2 = p.v2 * p.t2;
    return `Весь путь: $s=${s1}+${s2}=${totalPath(p)}$ м. Всё время включает остановку: $t=${p.t1}+${p.stop}+${p.t2}=${totalTime(p)}$ с. Поэтому $v_{\\text{ср}}=\\frac{s}{t}=\\frac{${totalPath(p)}}{${totalTime(p)}}=${formatMathValue(answer)}$ м/с.`;
  },
  trap: "Исключает остановку из времени или усредняет скорости участков вместо деления всего пути на всё время.",
  coachLines: {
    correct: () => "Верно: остановка не добавила пути, но вошла во всё затраченное время.",
    wrong: (p, selected, correct) =>
      `Сложи оба пути и все три промежутка времени, включая остановку. Получается ${formatAnswerValue(correct)} м/с, а не ${formatAnswerValue(selected)} м/с.`,
  },
  constraints: [
    (p) => p.v1 !== p.v2,
    hasGradeSevenPrecision,
  ],
  variantCount: subjects.length,
};
