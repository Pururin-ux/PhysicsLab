import type { DistractorRule, Params, TaskBlueprint } from "../types.ts";

const prompts = [
  "Если смотреть на левый торец катушки, ток в витках идёт против часовой стрелки. Какой это полюс?",
  "Если смотреть на левый торец катушки, ток в витках идёт по часовой стрелке. Какой это полюс?",
  "Направление тока в катушке изменили на противоположное. Что произойдёт с её магнитными полюсами?",
  "Полосовой магнит разрезали поперёк на две части. Что получится?",
];

const optionLabels: Record<number, readonly string[]> = {
  1: ["Левый торец — N", "Левый торец — S", "Магнитного поля нет", "Полюс не зависит от тока"],
  2: ["Левый торец — N", "Левый торец — S", "Магнитного поля нет", "Полюс не зависит от тока"],
  3: ["Исчезнет только северный полюс", "Поле сохранит прежнее направление", "Полюсы поменяются местами", "Катушка станет постоянным магнитом"],
  4: ["Отдельный N и отдельный S", "Два немагнитных куска", "Один магнит и один немагнитный кусок", "Два магнита, у каждого есть N и S"],
};

const answers: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4 };

function answerFor(params: Params): number {
  return answers[params.caseId] ?? 1;
}

function otherAnswer(offset: number): DistractorRule {
  return {
    label: `выбран неверный вывод ${offset}`,
    compute: params => ((answerFor(params) - 1 + offset) % 4) + 1,
  };
}

function explanation(params: Params): string {
  if (params.caseId === 1) return "По правилу правой руки четыре пальца направляем против часовой стрелки — по току. Большой палец направлен к наблюдателю, из левого торца: это полюс N.";
  if (params.caseId === 2) return "При токе по часовой стрелке большой палец правой руки направлен внутрь катушки, от левого торца. Значит, левый торец — S, а правый — N.";
  if (params.caseId === 3) return "Направление магнитного поля определяется направлением тока. При развороте тока поле разворачивается, поэтому северный и южный торцы меняются местами.";
  return "Магнитные полюсы неразделимы. После разрезания каждая часть становится меньшим магнитом со своими полюсами N и S.";
}

export const magneticFieldDirectionBlueprint: TaskBlueprint = {
  id: "magnetic-field-direction",
  skill: "Направление магнитного поля",
  topic: "Электродинамика",
  group: "electrodynamics",
  difficulty: 1,
  params: { caseId: { min: 1, max: 4, step: 1, unit: "сценарий" } },
  formula: "I\\;\\Longrightarrow\\;\\vec B",
  answerUnit: "",
  answerKind: "positive",
  solver: answerFor,
  distractors: [otherAnswer(1), otherAnswer(2), otherAnswer(3)],
  optionText: (value, params) => optionLabels[params.caseId]?.[value - 1] ?? String(value),
  textTemplate: params => prompts[params.caseId - 1] ?? prompts[0],
  explanationTemplate: params => explanation(params),
  trap: "Направление поля устанавливают по действию на северный конец стрелки или по правилу правой руки. Магнитные полюсы не существуют поодиночке.",
  coachLines: {
    correct: params => params.caseId === 4
      ? "Верно. Разрезание не отделяет магнитные полюсы: каждая часть снова имеет N и S."
      : "Верно. Направление тока и правило правой руки согласованы с направлением магнитного поля.",
    wrong: params => `Вернись к направлению тока и правилу правой руки. ${explanation(params)}`,
  },
};
