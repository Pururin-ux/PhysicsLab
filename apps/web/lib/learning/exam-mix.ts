import { buildCoverageSections } from "./coverage.ts";
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

export type ExamMixInfo = {
  // Темы, из которых собирается вариант (по две задачи из каждой).
  sections: readonly ExamMixTopic[];
  // Разделы программы, для которых задач в каталоге пока нет.
  missing: readonly ExamMissingSection[];
  totalTaskTypes: number;
};

// Состав диагностики = состав смешанного микса из API: пять открытых тем,
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
