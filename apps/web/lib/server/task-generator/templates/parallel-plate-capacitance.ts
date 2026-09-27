import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function changedCapacitance(params: Params): number {
  return params.changeKind === 2
    ? params.initialCapacitancePf / params.factor
    : params.initialCapacitancePf * params.factor;
}

const distractors: DistractorRule[] = [
  { label: "меняешь прямую и обратную пропорциональность", compute: p => p.changeKind === 2 ? p.initialCapacitancePf * p.factor : p.initialCapacitancePf / p.factor },
  { label: "считаешь ёмкость неизменной при изменении конструкции", compute: p => p.initialCapacitancePf },
  { label: "возводишь множитель изменения в квадрат", compute: p => p.changeKind === 2 ? p.initialCapacitancePf * p.factor * p.factor : p.initialCapacitancePf / (p.factor * p.factor) },
];

const changes: Record<number, { condition: string; relation: string }> = {
  1: { condition: "Площадь взаимного перекрытия обкладок увеличили", relation: "прямо пропорциональна площади перекрытия" },
  2: { condition: "Расстояние между обкладками увеличили", relation: "обратно пропорциональна расстоянию между обкладками" },
  3: { condition: "Относительную диэлектрическую проницаемость среды между обкладками увеличили", relation: "прямо пропорциональна диэлектрической проницаемости" },
};

export const parallelPlateCapacitanceBlueprint: TaskBlueprint = {
  id: "parallel-plate-capacitance",
  skill: "Как меняется ёмкость плоского конденсатора",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    initialCapacitancePf: { min: 24, max: 60, step: 3, unit: "пФ" },
    factor: { min: 2, max: 3, step: 1, unit: "раз" },
    changeKind: { min: 1, max: 3, step: 1, unit: "изменяемый параметр" },
  },
  formula: "C=\\varepsilon\\varepsilon_0\\frac{S}{d}",
  answerUnit: "пФ",
  answerKind: "positive",
  answerFormat: "numeric_input",
  solver: changedCapacitance,
  distractors,
  textTemplate: p => "Плоский конденсатор имел электроёмкость " + p.initialCapacitancePf +
    " пФ. " + changes[p.changeKind].condition + " в " + p.factor +
    " раза; остальные параметры не изменились. Какой стала электроёмкость? Ответ дайте в пФ.",
  explanationTemplate: (p, answer) => {
    const calculation = p.changeKind === 2
      ? "\\frac{" + formatMathValue(p.initialCapacitancePf) + "}{" + formatMathValue(p.factor) + "}"
      : formatMathValue(p.initialCapacitancePf) + "\\cdot" + formatMathValue(p.factor);
    return "Для плоского конденсатора $C=\\varepsilon\\varepsilon_0\\frac{S}{d}$. " +
      "При неизменных остальных параметрах ёмкость " + changes[p.changeKind].relation +
      ". Поэтому $C_2=" + calculation + "=" + formatMathValue(answer) +
      "$ пФ. Отдельная подстановка заряда и напряжения здесь не нужна.";
  },
  trap: "У плоского конденсатора C пропорциональна площади S и проницаемости ε, но обратно пропорциональна расстоянию d. Заряд и напряжение не задают C, если конструкция неизменна.",
  coachLines: {
    correct: () => "Верно. Ёмкость определяет конструкция и среда, а не само значение накопленного заряда.",
    wrong: (_p, selected, correct) => "Проверь, стоит изменённый параметр в числителе или знаменателе формулы. Получается " +
      formatAnswerValue(correct) + " пФ, а не " + formatAnswerValue(selected) + " пФ.",
  },
};
