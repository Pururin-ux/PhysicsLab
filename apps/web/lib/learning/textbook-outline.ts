import type { TextbookChapter } from "./textbook.ts";
import type { TextbookCheckDefinition } from "./textbook-check-state.ts";
import type { LearningEntry } from "./learning-entry.ts";

export type TextbookOutlineChapter = Pick<
  TextbookChapter,
  "id" | "grade" | "unit" | "title" | "prerequisite"
> & {
  check: TextbookCheckDefinition;
};

export type TextbookContentsEntry = Pick<
  LearningEntry,
  "id" | "title" | "question" | "grade" | "group" | "unit" | "prerequisite" | "resources" | "connection"
>;

export type TextbookContentsItem = {
  id: string;
  grade: number;
  unit: string;
  title: string;
  question: string;
  prerequisite: string;
  href: string;
  resources: TextbookContentsEntry["resources"];
  connection?: TextbookContentsEntry["connection"];
  check?: TextbookCheckDefinition;
};

export function projectTextbookOutline(chapter: TextbookChapter): TextbookOutlineChapter {
  return {
    id: chapter.id,
    grade: chapter.grade,
    unit: chapter.unit,
    title: chapter.title,
    prerequisite: chapter.prerequisite,
    check: {
      question: chapter.check.question,
      options: chapter.check.options,
      correct: chapter.check.correct,
    },
  };
}

export function projectTextbookContentsEntry(entry: LearningEntry): TextbookContentsEntry {
  return {
    id: entry.id,
    title: entry.title,
    question: entry.question,
    grade: entry.grade,
    group: entry.group,
    unit: entry.unit,
    prerequisite: entry.prerequisite,
    resources: entry.resources,
    connection: entry.connection,
  };
}

export function projectTextbookContents(
  chapters: readonly TextbookOutlineChapter[],
  entries: readonly TextbookContentsEntry[],
): TextbookContentsItem[] {
  const entryById = new Map<string, TextbookContentsEntry>();
  for (const entry of entries) if (!entryById.has(entry.id)) entryById.set(entry.id, entry);
  const chapterIds = new Set(chapters.map(chapter => chapter.id));
  return [
    ...chapters.map(chapter => {
      const entry = entryById.get(chapter.id);
      return {
        ...chapter,
        unit: chapter.unit ?? "Основы движения",
        question: entry?.question ?? chapter.title,
        href: "/learn/" + chapter.id,
        resources: entry?.resources ?? [],
        connection: entry?.connection,
      };
    }),
    ...entries
      .filter((entry): entry is TextbookContentsEntry & { grade: number } =>
        entry.grade !== undefined && !chapterIds.has(entry.id) && entry.resources.length > 0)
      .map(entry => ({
        id: entry.id,
        grade: entry.grade,
        unit: entry.unit ?? entry.group,
        title: entry.title,
        question: entry.question,
        prerequisite: entry.prerequisite,
        href: entry.resources[0].href,
        resources: entry.resources,
        connection: entry.connection,
      })),
  ];
}
