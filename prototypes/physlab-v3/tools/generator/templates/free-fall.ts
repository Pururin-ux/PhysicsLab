import { freeFallDistractors } from "../distractors.ts";
import { GRAVITY, GRAVITY_TEXT, freeFallDistance } from "../solver.ts";
import type { Params, TaskBlueprint } from "../types.ts";

const fallContexts = [
  "Небольшой груз отпустили с края лабораторной установки",
  "Металлический шарик начал свободно падать из состояния покоя",
  "Камень отпустили без начальной скорости с балкона",
  "Датчик движения фиксирует падение маленького тела из состояния покоя",
  "Учебный грузик начал падать вертикально вниз без начальной скорости",
  "Шарик отпустили из рук, не сообщая ему начальной скорости",
  "Небольшую шайбу отпустили с высокой платформы",
  "Тело начало свободно падать после отпускания из покоя",
  "Экспериментальный грузик падает вертикально вниз из состояния покоя",
  "Капсулу отпустили с неподвижной опоры",
  "Маленький камешек начал падать без толчка вниз",
  "Стальной шарик отпустили над вертикальной измерительной линейкой",
  "Тело свободно падает после отделения от держателя",
  "Груз начинает движение вниз только под действием тяжести",
  "Шарик в опыте по свободному падению отпустили из состояния покоя",
  "Небольшой предмет начал падать вертикально вниз без начальной скорости",
];

function contextFor(p: Params): string {
  const variant = Math.abs(Math.trunc(p.__variant ?? 0));
  return fallContexts[variant % fallContexts.length];
}

export const freeFallBlueprint: TaskBlueprint = {
  id: "free-fall",
  skill: "Свободное падение из состояния покоя",
  topic: "Кинематика",
  group: "kinematics",
  difficulty: 1,
  params: {
    t: { min: 1, max: 6, step: 1, unit: "с" },
  },
  formula: "h=\\frac{gt^2}{2}",
  answerUnit: "м",
  answerKind: "positive",
  solver: freeFallDistance,
  distractors: freeFallDistractors,
  textTemplate: (p) =>
    `${contextFor(p)}. Сопротивлением воздуха пренебречь, ${GRAVITY_TEXT}. Какой путь пройдёт тело за ${p.t} с?`,
  explanationTemplate: (p, answer) =>
    `Тело падает из покоя, поэтому $h = \\frac{gt^2}{2} = \\frac{${GRAVITY} \\cdot ${p.t}^2}{2} = ${answer}$ м. Частая ошибка: забыть квадрат времени или деление на 2.`,
  trap: "Забывает квадрат времени или деление на 2.",
  coachLines: {
    correct: (p) => `Да. При падении из покоя путь растет как $t^2$, здесь t = ${p.t} с.`,
    wrong: (p, selected, correct) =>
      `Проверь время в формуле: нужно $h = \\frac{gt^2}{2}$. Для t = ${p.t} с получается ${correct} м, а не ${selected} м.`,
  },
  variantCount: fallContexts.length,
};
