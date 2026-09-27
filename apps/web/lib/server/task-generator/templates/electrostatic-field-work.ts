import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

function signedCharge(params: Params): number {
  return params.chargeSign === 1 ? params.chargeMicroC : -params.chargeMicroC;
}

function signedDisplacementCm(params: Params): number {
  return params.direction === 1 ? params.distanceCm : -params.distanceCm;
}

function workMicrojoules(params: Params): number {
  // µC · (N/C) · m = µJ. The field points to the right.
  return signedCharge(params) * params.fieldNPerC * signedDisplacementCm(params) / 100;
}

function requestedValue(params: Params): number {
  const work = workMicrojoules(params);
  return params.asked === 1 ? work : -work;
}

const distractors: DistractorRule[] = [
  { label: "меняешь знак работы или изменения энергии", compute: p => -requestedValue(p) },
  { label: "не переводишь сантиметры в метры", compute: p => requestedValue(p) * 100 },
  { label: "считаешь удвоенную проекцию вместо смещения A–B", compute: p => requestedValue(p) * 2 },
];

export const electrostaticFieldWorkBlueprint: TaskBlueprint = {
  id: "electrostatic-field-work",
  skill: "Работа однородного электростатического поля",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 2,
  params: {
    chargeMicroC: { min: 1, max: 3, step: 1, unit: "мкКл" },
    chargeSign: { min: 1, max: 2, step: 1, unit: "знак заряда" },
    fieldNPerC: { min: 100, max: 300, step: 100, unit: "Н/Кл" },
    distanceCm: { min: 10, max: 30, step: 10, unit: "см" },
    direction: { min: 1, max: 2, step: 1, unit: "направление смещения" },
    asked: { min: 1, max: 2, step: 1, unit: "искомая величина" },
  },
  formula: "A=qE\\Delta x,\\quad \\Delta W_{\\text{п}}=-A",
  answerUnit: "мкДж",
  answerKind: "signed",
  answerFormat: "numeric_input",
  solver: requestedValue,
  distractors,
  textTemplate: p => {
    const charge = (p.chargeSign === 1 ? "+" : "−") + p.chargeMicroC;
    const side = p.direction === 1 ? "правее" : "левее";
    const request = p.asked === 1
      ? "Какую работу совершила сила электростатического поля?"
      : "Найдите изменение потенциальной энергии заряда Wп2 − Wп1.";
    return "В центральной области между большими пластинами однородное поле напряжённостью " +
      p.fieldNPerC + " Н/Кл направлено вправо. Заряд q = " + charge +
      " мкКл переместили из точки A в точку B; B на " + p.distanceCm + " см " +
      side + " A. " + request + " Ответ дайте в мкДж со знаком.";
  },
  explanationTemplate: (p, answer) => {
    const dx = signedDisplacementCm(p) / 100;
    const work = workMicrojoules(p);
    const prefix = "Ось направлена вдоль E: $q=" + formatMathValue(signedCharge(p)) +
      "$ мкКл, $\\Delta x=" + formatMathValue(dx) + "$ м. " +
      "В микроджоулях $A=qE\\Delta x=" + formatMathValue(signedCharge(p)) +
      "\\cdot" + formatMathValue(p.fieldNPerC) + "\\cdot(" +
      formatMathValue(dx) + ")=" + formatMathValue(work) + "$ мкДж. ";
    return prefix + (p.asked === 1
      ? "Работа силы поля равна " + formatAnswerValue(answer) + " мкДж. Длина возможного обходного пути не входит в расчёт."
      : "$\\Delta W_{\\text{п}}=-A=" + formatMathValue(answer) + "$ мкДж. Здесь спрашивали изменение энергии, а не работу внешней силы.");
  },
  trap: "Выбери ось по E. Знак q и направление смещения задают знак A; изменение потенциальной энергии равно −A. Переведи сантиметры в метры.",
  coachLines: {
    correct: p => p.asked === 1
      ? "Верно. Работа поля найдена по проекции перемещения со знаком."
      : "Верно. Изменение потенциальной энергии противоположно работе силы поля.",
    wrong: (_p, selected, correct) => "Проверь знак заряда, направление A→B и перевод сантиметров. Получается " +
      formatAnswerValue(correct) + " мкДж, а не " + formatAnswerValue(selected) + " мкДж.",
  },
};
