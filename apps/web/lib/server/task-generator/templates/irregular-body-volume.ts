import { calculateDisplacementVolume } from "../../../physics/displacement-volume-model.ts";
import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function bodyVolumeCm3(params: Params): number {
  const result = calculateDisplacementVolume({
    initialReadingMl: params.initialReadingMl,
    finalReadingMl: params.finalReadingMl,
    divisionMl: 2,
    fullySubmerged: true,
    noSpill: true,
  });
  if (!result.valid) throw new RangeError("Generated readings must show a positive displacement");
  return result.volumeCm3;
}

const distractors: DistractorRule[] = [
  { label: "принимаешь второе показание за объём тела", compute: p => p.finalReadingMl },
  { label: "складываешь оба показания", compute: p => p.initialReadingMl + p.finalReadingMl },
  { label: "принимаешь начальный объём воды за объём тела", compute: p => p.initialReadingMl },
];

export const irregularBodyVolumeBlueprint: TaskBlueprint = {
  id: "irregular-body-volume",
  skill: "Объём тела неправильной формы по двум отсчётам мензурки",
  topic: "Измерения",
  group: "measurements",
  difficulty: 1,
  params: {
    initialReadingMl: { min: 10, max: 30, step: 2, unit: "мл" },
    finalReadingMl: { min: 18, max: 50, step: 2, unit: "мл" },
  },
  formula: "V=V_2-V_1,\\quad 1\\,\\text{мл}=1\\,\\text{см}^3",
  answerUnit: "см³",
  answerKind: "positive",
  answerFormat: "numeric_input",
  diagram: p => ({
    kind: "displacement-volume",
    spec: {
      initialReadingMl: p.initialReadingMl,
      finalReadingMl: p.finalReadingMl,
      divisionMl: 2,
    },
  }),
  solver: bodyVolumeCm3,
  distractors,
  constraints: [
    p => p.finalReadingMl - p.initialReadingMl >= 4,
    p => p.finalReadingMl - p.initialReadingMl <= 20,
    // Otherwise the initial reading would equal the correct answer.
    p => p.finalReadingMl !== 2 * p.initialReadingMl,
  ],
  textTemplate: p =>
    `В мензурке сначала V₁ = ${formatMathValue(p.initialReadingMl)} мл воды. Мио полностью погрузила камешек: V₂ = ${formatMathValue(p.finalReadingMl)} мл. Цена деления — 2 мл. Вода не пролилась, пузырьков воздуха нет. Каков объём камешка? Ответ дай числом в см³.`,
  explanationTemplate: (p, answer) =>
    `Первое показание — объём воды, второе включает воду и полностью погружённый камешек. Так как вода не пролилась и пузырьков нет, прирост показания равен объёму камешка: $V=V_2-V_1=${formatMathValue(p.finalReadingMl)}-${formatMathValue(p.initialReadingMl)}=${formatMathValue(answer)}\\,\\text{мл}=${formatMathValue(answer)}\\,\\text{см}^3$. Это результат вычитания двух измеренных показаний, а не утверждение о точности реального измерения.`,
  trap: "Второе показание включает воду и камешек. Вычти первое показание из второго и запиши объём в см³.",
  coachLines: {
    correct: () => "Верно: разность двух показаний даёт объём полностью погружённого камешка.",
    wrong: (p, selected, correct) =>
      `После погружения мензурка показывает воду вместе с камешком. Вычти ${formatAnswerValue(p.initialReadingMl)} мл из ${formatAnswerValue(p.finalReadingMl)} мл: получишь ${formatAnswerValue(correct)} см³. Твой ответ — ${formatAnswerValue(selected)} см³.`,
  },
};
