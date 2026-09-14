import { variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const subjects = ["Лабораторная тележка", "Велосипедист", "Робот"] as const;

function target(p: Params) {
  return variantIndex(p, 3);
}

function distance(p: Params) {
  return p.v * p.t;
}

function subjectFor(p: Params) {
  return subjects[Math.abs(Math.trunc(p.v + p.t)) % subjects.length];
}

function answerFor(p: Params) {
  if (target(p) === 1) return distance(p) / p.t;
  if (target(p) === 2) return distance(p) / p.v;
  return distance(p);
}

function answerUnitFor(p: Params) {
  return ["м", "м/с", "с"][target(p)];
}

export const uniformMotionBasicBlueprint: TaskBlueprint = {
  id: "uniform-motion-basic",
  skill: "Равномерное движение: путь, скорость и время",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    v: { min: 3, max: 12, step: 1, unit: "м/с" },
    t: { min: 3, max: 15, step: 1, unit: "с" },
  },
  formula: "v=\\frac{s}{t},\\quad s=vt,\\quad t=\\frac{s}{v}",
  answerUnit: answerUnitFor,
  answerKind: "positive",
  solver: answerFor,
  distractors: [
    {
      label: "не выполнил нужное деление или умножение",
      compute: (p) => (target(p) === 0 ? distance(p) + p.t : distance(p)),
    },
    { label: "удвоил результат", compute: (p) => answerFor(p) * 2 },
    { label: "разделил результат пополам", compute: (p) => answerFor(p) / 2 },
  ],
  textTemplate: (p) => {
    const subject = subjectFor(p);
    const s = distance(p);

    if (target(p) === 1) {
      return `${subject} при равномерном движении проходит ${s} м за ${p.t} с. Какова скорость движения?`;
    }
    if (target(p) === 2) {
      return `${subject} движется равномерно со скоростью ${p.v} м/с. За какое время будет пройден путь ${s} м?`;
    }
    return `${subject} движется равномерно со скоростью ${p.v} м/с в течение ${p.t} с. Какой путь будет пройден за это время?`;
  },
  explanationTemplate: (p, answer) => {
    const s = distance(p);

    if (target(p) === 1) {
      return `Скорость равна пути, делённому на время: $v=\\frac{s}{t}=\\frac{${s}}{${p.t}}=${formatMathValue(answer)}$ м/с.`;
    }
    if (target(p) === 2) {
      return `Время равно пути, делённому на скорость: $t=\\frac{s}{v}=\\frac{${s}}{${p.v}}=${formatMathValue(answer)}$ с.`;
    }
    return `При постоянной скорости путь равен произведению скорости и времени: $s=vt=${p.v}\\cdot${p.t}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Выбирает действие, не определив, какая из трёх величин неизвестна.",
  coachLines: {
    correct: (p) =>
      target(p) === 0
        ? "Верно: при постоянной скорости путь равен скорости, умноженной на время."
        : target(p) === 1
          ? "Верно: скорость показывает, какой путь тело проходит за одну секунду."
          : "Верно: время получили, разделив весь путь на путь за одну секунду.",
    wrong: (p, selected, correct) =>
      `Сначала назови неизвестную величину и вырази её из связи s = vt. Получается ${formatAnswerValue(correct)} ${answerUnitFor(p)}, а не ${formatAnswerValue(selected)} ${answerUnitFor(p)}.`,
  },
  variantCount: 3,
};
