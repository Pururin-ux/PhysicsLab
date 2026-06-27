import { newtonSecondDistractors } from "../distractors.ts";
import { newtonSecondAnswer } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

type NewtonTarget = "force" | "mass" | "acceleration";

function targetFor(p: Params): NewtonTarget {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0)) % 3;
  return ["force", "mass", "acceleration"][variant] as NewtonTarget;
}

function forceFor(p: Params): number {
  return p.m * p.a;
}

function questionFor(p: Params): string {
  const force = forceFor(p);

  switch (targetFor(p)) {
    case "mass":
      return `На тело действует равнодействующая сила ${force} Н, сообщая ему ускорение ${p.a} м/с². Найдите массу тела.`;
    case "acceleration":
      return `На тело массой ${p.m} кг действует равнодействующая сила ${force} Н. Найдите ускорение тела.`;
    default:
      return `Тело массой ${p.m} кг движется с ускорением ${p.a} м/с². Найдите равнодействующую сил, действующих на тело.`;
  }
}

function correctCoachLine(p: Params): string {
  switch (targetFor(p)) {
    case "mass":
      return `Да. Из F = ma получаем m = F/a = ${forceFor(p)}/${p.a}.`;
    case "acceleration":
      return `Да. Из F = ma получаем a = F/m = ${forceFor(p)}/${p.m}.`;
    default:
      return `Да. По второму закону Ньютона F = ma = ${p.m} · ${p.a}.`;
  }
}

function wrongCoachLine(p: Params, selected: number, correct: number): string {
  const target = targetFor(p);
  const relation =
    target === "mass" ? "m = F/a" : target === "acceleration" ? "a = F/m" : "F = ma";
  return `Сначала реши, что ищем: силу, массу или ускорение. Здесь нужно ${relation}. Получается ${correct}, а не ${selected}.`;
}

function explanationFor(p: Params, answer: number): string {
  const force = forceFor(p);

  switch (targetFor(p)) {
    case "mass":
      return `Выражаем массу из F = ma: m = F/a = ${force}/${p.a} = ${answer} кг. Умножать F на a здесь не нужно.`;
    case "acceleration":
      return `Выражаем ускорение: a = F/m = ${force}/${p.m} = ${answer} м/с². Вариант F · m получается при неверном выборе действия.`;
    default:
      return `Равнодействующая задаёт ускорение: F = ma = ${p.m} · ${p.a} = ${answer} Н. Отношения m/a и a/m здесь не описывают силу.`;
  }
}

export const newtonSecondBlueprint: TaskBlueprint = {
  id: "newton-second",
  skill: "Второй закон Ньютона",
  topic: "Динамика",
  group: "dynamics",
  difficulty: 1,
  params: {
    m: { min: 1, max: 100, step: 1, unit: "кг" },
    a: { min: 0.5, max: 10, step: 0.5, unit: "м/с²" },
  },
  formula: "F=ma",
  answerUnit: (p) => {
    switch (targetFor(p)) {
      case "mass":
        return "кг";
      case "acceleration":
        return "м/с²";
      default:
        return "Н";
    }
  },
  answerKind: "positive",
  solver: newtonSecondAnswer,
  distractors: newtonSecondDistractors,
  textTemplate: questionFor,
  explanationTemplate: explanationFor,
  trap: "Не выражает нужную величину из F = ma.",
  coachLines: {
    correct: correctCoachLine,
    wrong: wrongCoachLine,
  },
  constraints: [(p) => forceFor(p) >= 5 && forceFor(p) <= 500],
  variantCount: 3,
};
