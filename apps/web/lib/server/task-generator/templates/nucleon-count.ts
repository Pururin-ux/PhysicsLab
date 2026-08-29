import { nucleonCountDistractors } from "../distractors.ts";
import { neutronCount } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

// Число нейтронов: N = A − Z. Названия элементов превращают сухую арифметику
// в задачу про конкретный изотоп — так её и формулируют в школе.
const elementByCharge: Record<number, string> = {
  1: "водород",
  2: "гелий",
  3: "литий",
  4: "бериллий",
  5: "бор",
  6: "углерод",
  7: "азот",
  8: "кислород",
  9: "фтор",
  10: "неон",
  11: "натрий",
  12: "магний",
  13: "алюминий",
  14: "кремний",
  15: "фосфор",
  16: "сера",
  17: "хлор",
  18: "аргон",
  19: "калий",
  20: "кальций",
  21: "скандий",
  22: "титан",
  23: "ванадий",
  24: "хром",
  25: "марганец",
  26: "железо",
  27: "кобальт",
  28: "никель",
  29: "медь",
  30: "цинк",
};

function elementName(p: Params): string {
  return elementByCharge[p.Z] ?? `элемент №${p.Z}`;
}

// «1 протон, 2 протона, 5 протонов» — в условии не должно быть «21 протонов».
function protonWord(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return "протонов";
  if (mod10 === 1) return "протон";
  if (mod10 >= 2 && mod10 <= 4) return "протона";
  return "протонов";
}

function explanationFor(p: Params, answer: number): string {
  return (
    `Массовое число — это сумма протонов и нейтронов: $A = Z + N$. Отсюда ` +
    `$N = A - Z = ${p.A} - ${p.Z} = ${formatMathValue(answer)}$ нейтронов. ` +
    `Зарядовое число равно числу протонов, а не нейтронов.`
  );
}

export const nucleonCountBlueprint: TaskBlueprint = {
  id: "nucleon-count",
  skill: "Состав атомного ядра",
  topic: "Квантовая физика",
  group: "quantum",
  difficulty: 1,
  params: {
    A: { min: 10, max: 60, step: 2, unit: "а.е.м." },
    Z: { min: 5, max: 28, step: 1, unit: "протонов" },
  },
  formula: "N=A-Z",
  // Ответ — просто число нейтронов: единица не нужна, её задаёт вопрос.
  answerUnit: "",
  answerKind: "positive",
  solver: neutronCount,
  distractors: nucleonCountDistractors,
  textTemplate: (p) =>
    `Ядро изотопа ${elementName(p)} с массовым числом ${p.A} содержит ${p.Z} ` +
    `${protonWord(p.Z)}. Сколько нейтронов в этом ядре?`,
  explanationTemplate: explanationFor,
  trap: "Называет массовое или зарядовое число вместо числа нейтронов.",
  coachLines: {
    correct: (p) =>
      `Да. В ядре ${p.Z} протонов и ${p.A} нуклонов всего, значит нейтронов $A - Z$.`,
    wrong: (p, selected, correct) =>
      `Массовое число — это протоны плюс нейтроны: ${p.A} = ${p.Z} + N. ` +
      `Ответ ${correct}, а не ${selected}.`,
  },
  // Только физически правдоподобные изотопы: лёгкие ядра держат N ≈ Z,
  // тяжёлые уходят в избыток нейтронов. Иначе получается «скандий-24».
  constraints: [(p) => p.A >= 2 * p.Z, (p) => p.A <= Math.floor(2.6 * p.Z)],
};
