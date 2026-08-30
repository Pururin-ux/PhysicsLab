import { buildCoverageSections } from "./coverage.ts";
import {
  EXAM_QUESTION_COUNT,
  EXAM_TASKS_PER_TOPIC,
} from "../quiz/generated-quiz-count.ts";
import { getTaskCatalog } from "../server/task-catalog.ts";
import { topics } from "../topics.ts";

export type ExamMixTopic = {
  id: string;
  title: string;
  familyCount: number;
};

export type ExamMissingSection = {
  id: string;
  title: string;
  summary: string;
};

// Длина варианта и число задач на тему живут в generated-quiz-count.ts:
// этот модуль тянет за собой серверный генератор и не годится для клиента.
export { EXAM_QUESTION_COUNT, EXAM_TASKS_PER_TOPIC };

export type ExamMixInfo = {
  // Темы, из которых собирается вариант (по две задачи из каждой).
  sections: readonly ExamMixTopic[];
  // Разделы программы, для которых задач в каталоге пока нет.
  missing: readonly ExamMissingSection[];
  totalTaskTypes: number;
};

// Состав диагностики = состав смешанного микса из API: все открытые темы,
// из каждой по две задачи (при count=10). Описание собирается из каталога,
// чтобы карта покрытия не расходилась с генератором.
export function getExamMixInfo(): ExamMixInfo {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));

  return {
    sections: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      familyCount: entries.filter((entry) => entry.topicId === topic.id).length,
    })),
    missing: coverage
      .filter((section) => section.familyCount === 0)
      .map((section) => ({
        id: section.id,
        title: section.title,
        summary: section.summary,
      })),
    totalTaskTypes: entries.length,
  };
}
