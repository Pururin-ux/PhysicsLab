import { radioactiveDecayDistractors } from "../distractors.ts";
import { decayAnswer, halfLives, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatMathValue } from "../validator.ts";

// За каждый период полураспада число нераспавшихся ядер делится пополам:
// сначала считаем число периодов n = t/T, затем делим N₀ на 2ⁿ.
// Вариант 0 — сколько ядер осталось, вариант 1 — сколько распалось.
function isRemainingVariant(p: Params): boolean {
  return variantIndex(p, 2) === 0;
}

function explanationFor(p: Params, answer: number): string {
  const n = halfLives(p);
  const remaining = p.n0 / 2 ** n;

  return (
    `Прошло ${n} ${n === 1 ? "период" : "периода"} полураспада: ` +
    `$n = \\frac{t}{T} = \\frac{${p.elapsed}}{${p.halfLife}} = ${n}$. ` +
    (isRemainingVariant(p)
      ? `Осталось $N = \\frac{N_0}{2^n} = \\frac{${p.n0}}{2^{${n}}} = ${formatMathValue(answer)}$ ядер.`
      : `Распалось $N_0 - \\frac{N_0}{2^n} = ${p.n0} - ${formatMathValue(remaining)} = ${formatMathValue(answer)}$ ядер. ` +
        `Каждый период делит остаток пополам, а не вычитает одно и то же число.`
    )
  );
}

export const radioactiveDecayBlueprint: TaskBlueprint = {
  id: "radioactive-decay",
  skill: "Закон радиоактивного распада",
  topic: "Квантовая физика",
  group: "quantum",
  difficulty: 3,
  params: {
    n0: { min: 80, max: 640, step: 40, unit: "ядер" },
    halfLife: { min: 2, max: 10, step: 2, unit: "сут" },
    elapsed: { min: 2, max: 30, step: 2, unit: "сут" },
  },
  formula: "N=\\frac{N_0}{2^{t/T}}",
  answerUnit: "ядер",
  answerKind: "positive",
  solver: decayAnswer,
  distractors: radioactiveDecayDistractors,
  textTemplate: (p) =>
    isRemainingVariant(p)
      ? `Период полураспада изотопа равен ${p.halfLife} сут. В образце было ${p.n0} ядер этого изотопа. ` +
        `Сколько ядер останется через ${p.elapsed} сут?`
      : `Период полураспада изотопа равен ${p.halfLife} сут. В образце было ${p.n0} ядер этого изотопа. ` +
        `Сколько ядер распадётся за ${p.elapsed} сут?`,
  explanationTemplate: explanationFor,
  trap: "Делит начальное число ядер на удвоенное число периодов вместо степени двойки.",
  coachLines: {
    correct: (p) =>
      `Да. Сначала число периодов: ${p.elapsed} / ${p.halfLife} = ${halfLives(p)}. ` +
      `Затем каждый период делит остаток пополам.`,
    wrong: (p, selected, correct) =>
      `Считай по периодам: за ${halfLives(p)} ${halfLives(p) === 1 ? "период" : "периода"} ` +
      `остаток делится на $2^{${halfLives(p)}}$. Ответ ${correct} ядер, а не ${selected} ядер.`,
  },
  constraints: [
    (p) => p.elapsed % p.halfLife === 0,
    (p) => {
      const n = p.elapsed / p.halfLife;
      // В варианте «сколько осталось» при n = 1 правильный ответ совпал бы
      // с дистрактором «сколько распалось», поэтому такой случай исключён.
      return isRemainingVariant(p) ? n >= 2 && n <= 4 : n >= 1 && n <= 4;
    },
    (p) => Number.isInteger(p.n0 / 2 ** (p.elapsed / p.halfLife)),
    // Варианты ответа — целые числа ядер: и правильный, и дистракторы.
    (p) => p.n0 % (p.elapsed / p.halfLife) === 0,
  ],
  difficultyFor: (p) => (isRemainingVariant(p) ? 3 : 3),
  variantCount: 2,
};
