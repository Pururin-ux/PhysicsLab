import { ohmLawDistractors } from "../distractors.ts";
import { ohmAnswer, variantIndex } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";
import { formatAnswerValue, formatMathValue } from "../validator.ts";

type OhmTarget = "current" | "voltage" | "resistance";

// Контексты нейтральны к тому, какая величина ищется.
const circuitContexts = [
  "В схеме настольной лампы измерили параметры участка цепи",
  "На лабораторном стенде собрали цепь с одним резистором",
  "В самодельном фонарике проверяют участок цепи",
  "Датчик мультиметра подключили к элементу цепи",
  "В модели электросети измеряют характеристики нагрузки",
  "На макетной плате проверяют работу нагревательного элемента",
];

function targetFor(p: Params): OhmTarget {
  return ["current", "voltage", "resistance"][variantIndex(p, 3)] as OhmTarget;
}

// Контекст детерминированно зависит от параметров и варианта, чтобы
// одинаковые формулировки не шли подряд без взрывного роста variantCount.
function contextFor(p: Params): string {
  const seed = Math.abs(Math.trunc(p.i * 2 + p.r + (p.__variant ?? 0)));
  return circuitContexts[seed % circuitContexts.length];
}

function voltageFor(p: Params): number {
  return p.i * p.r;
}

function answerUnitFor(p: Params): string {
  switch (targetFor(p)) {
    case "voltage":
      return "В";
    case "resistance":
      return "Ом";
    default:
      return "А";
  }
}

function questionFor(p: Params): string {
  const voltage = formatAnswerValue(voltageFor(p));
  const current = formatAnswerValue(p.i);

  switch (targetFor(p)) {
    case "voltage":
      return `${contextFor(p)}. Через сопротивление ${p.r} Ом идёт ток ${current} А. Найдите напряжение на этом участке.`;
    case "resistance":
      return `${contextFor(p)}. При напряжении ${voltage} В через участок идёт ток ${current} А. Найдите сопротивление участка.`;
    default:
      return `${contextFor(p)}. К участку с сопротивлением ${p.r} Ом приложено напряжение ${voltage} В. Найдите силу тока.`;
  }
}

function explanationFor(p: Params, answer: number): string {
  const voltage = formatMathValue(voltageFor(p));
  const current = formatMathValue(p.i);
  const formattedAnswer = formatMathValue(answer);

  switch (targetFor(p)) {
    case "voltage":
      return `По закону Ома напряжение $U = IR = ${current} \\cdot ${p.r} = ${formattedAnswer}$ В. Делить ток на сопротивление здесь не нужно.`;
    case "resistance":
      return `Выражаем сопротивление: $R = \\frac{U}{I} = \\frac{${voltage}}{${current}} = ${formattedAnswer}$ Ом. Произведение U · I даёт мощность, а не сопротивление.`;
    default:
      return `По закону Ома $I = \\frac{U}{R} = \\frac{${voltage}}{${p.r}} = ${formattedAnswer}$ А. Умножение U на R не имеет физического смысла.`;
  }
}

function correctCoachLine(p: Params): string {
  switch (targetFor(p)) {
    case "voltage":
      return "Да. Напряжение — произведение тока и сопротивления: U = IR.";
    case "resistance":
      return `Да. $R = \\frac{U}{I}$: чем меньше ток при том же напряжении, тем больше сопротивление.`;
    default:
      return `Да. $I = \\frac{U}{R}$: ток тем больше, чем больше напряжение и меньше сопротивление.`;
  }
}

function wrongCoachLine(p: Params, selected: number, correct: number): string {
  const target = targetFor(p);
  const relation =
    target === "voltage"
      ? "U = IR"
      : target === "resistance"
        ? "$R = \\frac{U}{I}$"
        : "$I = \\frac{U}{R}$";
  const unit = answerUnitFor(p);

  return `Сначала запиши закон Ома и вырази нужную величину: ${relation}. Получается ${formatAnswerValue(correct)} ${unit}, а не ${formatAnswerValue(selected)} ${unit}.`;
}

export const ohmLawBlueprint: TaskBlueprint = {
  id: "ohm-law",
  skill: "Закон Ома для участка цепи",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: {
    i: { min: 1, max: 6, step: 0.5, unit: "А" },
    r: { min: 2, max: 20, step: 2, unit: "Ом" },
  },
  formula: "I=\\frac{U}{R}",
  answerUnit: answerUnitFor,
  answerKind: "positive",
  solver: ohmAnswer,
  distractors: ohmLawDistractors,
  textTemplate: questionFor,
  explanationTemplate: explanationFor,
  trap: "Путает, что на что делить в законе Ома.",
  coachLines: {
    correct: correctCoachLine,
    wrong: wrongCoachLine,
  },
  constraints: [(p) => voltageFor(p) >= 4 && voltageFor(p) <= 240],
  variantCount: 3,
};
