import type { AnswerFormat } from "../answer/numeric-answer.ts";
import type { Difficulty } from "../server/task-generator/types.ts";
import type { TemplateId } from "../server/task-generator/generate.ts";
import type { TopicId } from "./taxonomy.ts";

export type ExamSectionId =
  | "mechanics"
  | "mkt-thermodynamics"
  | "electrodynamics"
  | "optics-srt";

export type TaskVisualKind = "graph" | "diagram";

export type TaskTypeCatalogEntry = {
  id: TemplateId;
  slug: TemplateId;
  title: string;
  shortDescription: string;
  topicId: TopicId;
  topicLabel: string;
  examSection: ExamSectionId;
  skillLabel: string;
  searchTerms: string[];
  formulaAliases: string[];
  answerFormat: AnswerFormat;
  difficultyRange: {
    min: Difficulty;
    max: Difficulty;
  };
  visualKinds: TaskVisualKind[];
  trainingPoints: string[];
};

export type TaskCatalogTopicFilter = "all" | TopicId;

export function normalizeCatalogSearch(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .replace(/[−–—]/g, "-")
    .replace(/\s*([=+*/^()-])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function filterTaskCatalog(
  entries: readonly TaskTypeCatalogEntry[],
  query: string,
  topic: TaskCatalogTopicFilter = "all",
): TaskTypeCatalogEntry[] {
  const normalizedQuery = normalizeCatalogSearch(query);
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  return entries.filter((entry) => {
    if (topic !== "all" && entry.topicId !== topic) {
      return false;
    }

    if (tokens.length === 0) {
      return true;
    }

    const haystack = normalizeCatalogSearch(
      [
        entry.title,
        entry.shortDescription,
        entry.skillLabel,
        ...entry.searchTerms,
        ...entry.formulaAliases,
      ].join(" "),
    );

    return tokens.every((token) => haystack.includes(token));
  });
}
