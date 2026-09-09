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
export type LessonStageIdentity = string;

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
  /** Stable technical identity used for navigation, keys and focus recovery. */
  id: LessonStageIdentity;
  /** Learner-facing name supplied by this lesson, rather than the catalog. */
  label: string;
  nextAction?: string;
  /** Optional reference to the current pedagogical catalog. */
  pedagogicalStageId?: LessonStageId;
};

/**
 * Checks only what the shared engine needs from a lesson-defined sequence.
 * Pedagogical plans remain an optional authoring convention, not an admission
 * condition for a lesson.
 */
export function defineLessonStageSequence<const T extends readonly LessonStageSequenceItem[]>(
  sequence: T,
): T {
  if (!Array.isArray(sequence) || sequence.length === 0) {
    throw new Error("Lesson stage sequence must contain at least one stage.");
  }

  const identities = new Set<string>();
  for (const stage of sequence) {
    if (!stage || typeof stage !== "object") {
      throw new Error("Each lesson stage must be an object.");
    }
    if (typeof stage.id !== "string" || stage.id.trim().length === 0) {
      throw new Error("Each lesson stage needs a non-empty string id.");
    }
    if (typeof stage.label !== "string" || stage.label.trim().length === 0) {
      throw new Error(`Lesson stage "${stage.id}" needs a non-empty label.`);
    }
    if (stage.nextAction !== undefined && typeof stage.nextAction !== "string") {
      throw new Error(`Lesson stage "${stage.id}" has an invalid next action.`);
    }
    if (
      stage.pedagogicalStageId !== undefined &&
      !LESSON_STAGE_IDS.includes(stage.pedagogicalStageId)
    ) {
      throw new Error(`Lesson stage "${stage.id}" has an unknown pedagogical stage id.`);
    }
    if (identities.has(stage.id)) {
      throw new Error(`Lesson stage id "${stage.id}" is declared more than once.`);
    }
    identities.add(stage.id);
  }

  return sequence;
}
