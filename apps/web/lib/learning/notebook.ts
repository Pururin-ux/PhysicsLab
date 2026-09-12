import { lessonDraftExportCodecs, readLessonDraft } from "./lesson-draft.ts";

export const notebookLessons = [
  { id: "average-speed", title: "Средняя путевая скорость", href: "/practice/average-speed-lesson" },
  { id: "acceleration", title: "Что такое ускорение", href: "/practice/kinematics-lesson" },
  { id: "dynamics", title: "Сила и изменение движения", href: "/practice/dynamics-lesson" },
  { id: "electro", title: "Ток, напряжение и сопротивление", href: "/practice/electro-lesson" },
  { id: "density", title: "Масса, объём и плотность", href: "/practice/density-lesson" },
  { id: "optics", title: "Свет и отражение", href: "/practice/optics-lesson" },
] as const;

export type NotebookNote = { id: string; title: string; href: string; text: string };

export function readNotebook(): { notes: NotebookNote[]; unavailable: number } {
  const notes: NotebookNote[] = [];
  let unavailable = 0;
  for (const lesson of notebookLessons) {
    const codec = lessonDraftExportCodecs.find((item) => item.key === `physicslab-lesson-draft-${lesson.id}`)!;
    const result = readLessonDraft(codec);
    if (!result.ok) { if (result.reason !== "empty") unavailable++; continue; }
    const { summaryText, summarySaved } = result.value;
    if (summarySaved === true && typeof summaryText === "string" && summaryText.trim()) {
      notes.push({ ...lesson, text: summaryText });
    }
  }
  return { notes, unavailable };
}

export function filterNotebook(notes: NotebookNote[], query: string) {
  const normalize = (value: string) => value.toLocaleLowerCase("ru-RU").replaceAll("ё", "е").trim();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return notes.filter((note) => words.every((word) => normalize(`${note.title} ${note.text}`).includes(word)));
}
