import { topics } from "../topics.ts";
import { topicHelpSections, type TopicHelpSection } from "./topic-help.ts";
import { getTopicLesson, type TopicLesson } from "./topic-lessons.ts";
import { getTaskCatalog } from "../server/task-catalog.ts";
import { skillMetadata, type SkillId, type TopicId } from "./taxonomy.ts";
import { getFormulaEntriesForSkill } from "./learning-links.ts";
import type { TaskTypeCatalogEntry } from "./task-catalog.ts";

// Сборка страницы урока из уже существующих источников данных: описание
// темы — из lib/topics, рамка урока — из topic-lessons, формулы и ловушки —
// из topic-help, типы задач — из каталога. Нового «второго реестра» здесь нет.
export type TopicLessonEntry = {
  topicId: TopicId;
  topic: (typeof topics)[number];
  lesson: TopicLesson;
  ideas: readonly TopicHelpSection[];
  taskTypes: readonly TaskTypeCatalogEntry[];
  // Первая формула темы: ссылка ведёт на справочник с открытой строкой.
  formulaId: string | null;
  skills: readonly { id: SkillId; title: string; description: string }[];
};

function skillsOfTopic(topicId: TopicId) {
  return (Object.values(skillMetadata) as (typeof skillMetadata)[SkillId][])
    .filter((skill) => skill.topicId === topicId)
    .map((skill) => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
    }));
}

export function getTaskLessonData(topicId: TopicId): TopicLessonEntry {
  const topic = topics.find((entry) => entry.id === topicId);

  if (!topic) {
    throw new Error(`Unknown topic "${topicId}".`);
  }

  const skills = skillsOfTopic(topicId);
  const taskTypes = getTaskCatalog().filter((entry) => entry.topicId === topicId);
  const formulaId =
    skills.flatMap((skill) => getFormulaEntriesForSkill(skill.id)).find(Boolean)?.id ?? null;

  return {
    topicId,
    topic,
    lesson: getTopicLesson(topicId),
    ideas: topicHelpSections[topicId],
    taskTypes,
    formulaId,
    skills,
  };
}
