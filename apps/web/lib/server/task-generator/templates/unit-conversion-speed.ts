import { unitConversionSpeedDistractors } from "../distractors.ts";
import { distanceFromKmhAndMinutes, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const subjects = [
  "автомобиль",
  "электропоезд",
  "велосипедист",
];

function subjectFor(p: Params): string {
  return subjects[variantIndex(p, subjects.length)];
}

export const unitConversionSpeedBlueprint: TaskBlueprint = {
  id: "unit-conversion-speed",
  skill: "Перевод скорости км/ч в м/с",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    vKmh: { min: 18, max: 90, step: 6, unit: "км/ч" },
    tMin: { min: 1, max: 12, step: 1, unit: "мин" },
  },
  formula: "s=vt,\\quad 1\\ \\mathrm{km/h}=\\frac{1}{3.6}\\ \\mathrm{m/s}",
  answerUnit: "м",
  answerKind: "positive",
  solver: distanceFromKmhAndMinutes,
  distractors: unitConversionSpeedDistractors,
  textTemplate: (p) =>
    `${subjectFor(p)} движется со скоростью ${p.vKmh} км/ч в течение ${p.tMin} мин. Какой путь он пройдет за это время? Ответ дайте в метрах.`,
  explanationTemplate: (p, answer) => {
    const vMs = p.vKmh / 3.6;
    const seconds = p.tMin * 60;

    return `Переведём единицы: ${p.vKmh} км/ч = ${formatMathValue(vMs)} м/с, ${p.tMin} мин = ${seconds} с. Тогда $s=vt=${formatMathValue(vMs)}\\cdot${seconds}=${formatMathValue(answer)}$ м.`;
  },
  trap: "Перед расчетом пути переведи и скорость, и время: км/ч в м/с, минуты в секунды.",
  coachLines: {
    correct: () =>
      "Да. Здесь главное — привести скорость и время к одним единицам.",
    wrong: (_p, selected, correct) =>
      `Единицы нужно привести до умножения. Получается ${formatAnswerValue(correct)} м, а не ${formatAnswerValue(selected)} м.`,
  },
  variantCount: subjects.length,
};
