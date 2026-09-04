export const LESSON_STAGE_IDS = [
  "context",
  "prediction",
  "observation",
  "causal-explanation",
  "representation",
  "worked-example",
  "faded-example",
  "independent-practice",
  "transfer",
  "summary",
] as const;

export type LessonStageId = (typeof LESSON_STAGE_IDS)[number];
export type LessonStageGate = "continue" | "commit" | "complete";

export type LessonStageDefinition = {
  id: LessonStageId;
  order: number;
  label: string;
  purpose: string;
  gate: LessonStageGate;
};

export const lessonStageDefinitions = [
  {
    id: "context",
    order: 10,
    label: "Ситуация",
    purpose: "Увидеть знакомое явление и величины до появления нового термина или формулы.",
    gate: "continue",
  },
  {
    id: "prediction",
    order: 20,
    label: "Прогноз",
    purpose: "Зафиксировать ожидаемый результат до раскрытия наблюдения.",
    gate: "commit",
  },
  {
    id: "observation",
    order: 30,
    label: "Наблюдение",
    purpose: "Сопоставить прогноз с видимым или измеримым результатом.",
    gate: "continue",
  },
  {
    id: "causal-explanation",
    order: 40,
    label: "Почему так",
    purpose: "Сформулировать причинную связь словами до символической записи.",
    gate: "continue",
  },
  {
    id: "representation",
    order: 50,
    label: "Схема и формула",
    purpose: "Связать словесный вывод со схемой, графиком или формулой и границами модели.",
    gate: "continue",
  },
  {
    id: "worked-example",
    order: 60,
    label: "Разбор",
    purpose: "Проследить полное решение с моделью, единицами и проверкой ответа.",
    gate: "continue",
  },
  {
    id: "faded-example",
    order: 70,
    label: "Дополни решение",
    purpose: "Выполнить скрытый шаг с адресной обратной связью.",
    gate: "complete",
  },
  {
    id: "independent-practice",
    order: 80,
    label: "Реши сам",
    purpose: "Применить модель без показанного решения.",
    gate: "complete",
  },
  {
    id: "transfer",
    order: 90,
    label: "Перенос",
    purpose: "Распознать ту же физическую идею в новой ситуации.",
    gate: "complete",
  },
  {
    id: "summary",
    order: 100,
    label: "Итог",
    purpose: "Сформулировать физический вывод своими словами и выбрать следующее действие.",
    gate: "complete",
  },
] as const satisfies readonly LessonStageDefinition[];

const lessonStageDefinitionById = Object.fromEntries(
  lessonStageDefinitions.map((definition) => [definition.id, definition]),
) as Record<LessonStageId, LessonStageDefinition>;

export function getLessonStageDefinition(id: LessonStageId): LessonStageDefinition {
  return lessonStageDefinitionById[id];
}

export type LessonStageSequenceItem = {
  id: LessonStageId;
  nextAction?: string;
};

/**
 * A lesson cannot enter the product with a shortened or reordered learning arc.
 * The runtime assertion also protects JS consumers and future data-driven lessons,
 * while `satisfies` at each call site keeps stage ids typed.
 */
export function defineLessonStageSequence<const T extends readonly LessonStageSequenceItem[]>(
  sequence: T,
): T {
  const actual = sequence.map((stage) => stage.id);
  const invalid =
    actual.length !== LESSON_STAGE_IDS.length ||
    LESSON_STAGE_IDS.some((requiredId, index) => actual[index] !== requiredId);

  if (invalid) {
    throw new Error(
      `Lesson stage sequence must be exactly: ${LESSON_STAGE_IDS.join(" -> ")}. Received: ${actual.join(" -> ")}.`,
    );
  }

  return sequence;
}
