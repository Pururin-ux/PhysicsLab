import { variantIndex } from "../solver.ts";
import type { GraphSpec, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function target(p: Params) {
  return variantIndex(p, 3);
}

function distance(p: Params) {
  return p.v * p.t;
}

function answerFor(p: Params) {
  return target(p) === 1 ? p.v : distance(p);
}

function answerUnitFor(p: Params) {
  return target(p) === 1 ? "м/с" : "м";
}

function graphFor(p: Params): GraphSpec {
  const s = distance(p);

  if (target(p) === 2) {
    return {
      type: "vt",
      series: [
        { t: 0, v: p.v },
        { t: p.t, v: p.v, label: `${p.v} м/с в течение ${p.t} с` },
      ],
      xLabel: "t, с",
      yLabel: "v, м/с",
      xRange: [0, p.t],
      yRange: [0, p.v + 2],
      showArea: true,
    };
  }

  return {
    type: "xt",
    series: [
      { t: 0, x: 0 },
      { t: p.t, x: s, label: `${s} м за ${p.t} с` },
    ],
    xLabel: "t, с",
    yLabel: "s, м",
    xRange: [0, p.t],
    yRange: [0, s + Math.max(2, p.v)],
  };
}

export const uniformMotionGraphsBlueprint: TaskBlueprint = {
  id: "uniform-motion-graphs",
  skill: "Графики равномерного движения",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    v: { min: 2, max: 10, step: 1, unit: "м/с" },
    t: { min: 3, max: 10, step: 1, unit: "с" },
  },
  graph: graphFor,
  formula: "v=\\frac{s}{t},\\quad s=vt",
  answerUnit: answerUnitFor,
  answerKind: "positive",
  solver: answerFor,
  distractors: [
    {
      label: "прочитал с другой оси или не выполнил деление",
      compute: (p) => (target(p) === 1 ? distance(p) : distance(p) + p.v),
    },
    { label: "удвоил результат", compute: (p) => answerFor(p) * 2 },
    { label: "разделил результат пополам", compute: (p) => answerFor(p) / 2 },
  ],
  textTemplate: (p) => {
    if (target(p) === 0) {
      return `График пути s(t) проходит через отмеченную точку (${p.t} с; ${distance(p)} м). Какой путь пройден к моменту ${p.t} с?`;
    }
    if (target(p) === 1) {
      return `График пути s(t) проходит через начало координат и точку (${p.t} с; ${distance(p)} м). Найдите скорость равномерного движения.`;
    }
    return `На графике v(t) скорость ${p.v} м/с остаётся постоянной. Какой путь пройден за ${p.t} с?`;
  },
  explanationTemplate: (p, answer) => {
    const s = distance(p);

    if (target(p) === 0) {
      return `По горизонтальной оси находим ${p.t} с, затем читаем путь по вертикальной оси: $s=${formatMathValue(answer)}$ м.`;
    }
    if (target(p) === 1) {
      return `Наклон графика пути задаёт скорость: $v=\\frac{s}{t}=\\frac{${s}}{${p.t}}=${formatMathValue(answer)}$ м/с.`;
    }
    return `На графике v(t) путь численно равен площади прямоугольника под линией скорости: $s=vt=${p.v}\\cdot${p.t}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Читает число с графика, не проверив оси, или путает наклон s(t) с высотой v(t).",
  coachLines: {
    correct: (p) =>
      target(p) === 0
        ? "Верно: момент времени нашли на горизонтальной оси, путь — на вертикальной."
        : target(p) === 1
          ? "Верно: чем круче растёт график пути, тем больше скорость."
          : "Верно: постоянная скорость образует под графиком прямоугольник со сторонами v и t.",
    wrong: (p, selected, correct) =>
      `Сначала прочитай подписи обеих осей и выбери связь между их величинами. Получается ${formatAnswerValue(correct)} ${answerUnitFor(p)}, а не ${formatAnswerValue(selected)} ${answerUnitFor(p)}.`,
  },
  variantCount: 3,
};
