import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { variantIndex } from "../solver.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

const unitVariants = [
  { symbol: "км", inputPerMeter: 0.001, relation: "умножить на 1000" },
  { symbol: "дм", inputPerMeter: 10, relation: "разделить на 10" },
  { symbol: "см", inputPerMeter: 100, relation: "разделить на 100" },
  { symbol: "мм", inputPerMeter: 1000, relation: "разделить на 1000" },
] as const;

function unitFor(params: Params) {
  return unitVariants[variantIndex(params, unitVariants.length)];
}

const distractors: DistractorRule[] = [
  { label: "сдвигаешь запятую на неверное число разрядов", compute: p => p.lengthM / 10 },
  { label: "сдвигаешь запятую на неверное число разрядов", compute: p => p.lengthM * 10 },
  { label: "путаешь множитель перевода", compute: p => p.lengthM / 100 },
];

export const lengthUnitConversionBlueprint: TaskBlueprint = {
  id: "length-unit-conversion",
  skill: "Перевод длины в метры",
  topic: "Измерения",
  group: "measurements",
  difficulty: 1,
  params: {
    lengthM: { min: 10, max: 120, step: 10, unit: "м" },
  },
  formula: String.raw`\begin{aligned}
    1\,\text{км}&=1000\,\text{м}\\
    1\,\text{дм}&=0{,}1\,\text{м}\\
    1\,\text{см}&=0{,}01\,\text{м}\\
    1\,\text{мм}&=0{,}001\,\text{м}
  \end{aligned}`,
  answerUnit: "м",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: p => p.lengthM,
  distractors,
  textTemplate: p => {
    const unit = unitFor(p);
    const measuredLength = p.lengthM * unit.inputPerMeter;
    return `Длина равна ${formatAnswerValue(measuredLength)} ${unit.symbol}. Вырази эту же длину в метрах. Ответ дай числом.`;
  },
  explanationTemplate: (p, answer) => {
    const unit = unitFor(p);
    const measuredLength = p.lengthM * unit.inputPerMeter;
    return `При переводе ${unit.symbol} в метры нужно ${unit.relation}. Поэтому $${formatMathValue(measuredLength)}\\,\\text{${unit.symbol}}=${formatMathValue(answer)}\\,\\text{м}$. Единица стала крупнее или мельче, но сама длина не изменилась.`;
  },
  trap: "Сначала сравни единицы: если переходишь к более крупной единице, числовое значение уменьшается; к более мелкой — увеличивается.",
  coachLines: {
    correct: () => "Верно. Изменились единица и число, а длина осталась прежней.",
    wrong: (p, selected, correct) => {
      const unit = unitFor(p);
      const measuredLength = p.lengthM * unit.inputPerMeter;
      return `${formatMathValue(measuredLength)} ${unit.symbol} = ${formatAnswerValue(correct)} м. Проверь направление перевода и на сколько разрядов меняется число; твой ответ — ${formatAnswerValue(selected)} м.`;
    },
  },
  variantCount: unitVariants.length,
};
