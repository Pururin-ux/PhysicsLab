import { lessonDraftExportCodecs, readLessonDraft } from "./lesson-draft.ts";

export const notebookLessons = [
  { id: "average-speed", title: "Средняя путевая скорость", href: "/practice/average-speed-lesson", completionKey: "stage", completionIndex: 4 },
  { id: "acceleration", title: "Что такое ускорение", href: "/practice/kinematics-lesson", completionKey: "screen", completionIndex: 9 },
  { id: "dynamics", title: "Сила и изменение движения", href: "/practice/dynamics-lesson", completionKey: "step", completionIndex: 9 },
  { id: "electro", title: "Ток, напряжение и сопротивление", href: "/practice/electro-lesson", completionKey: "stage", completionIndex: 9 },
  { id: "density", title: "Масса, объём и плотность", href: "/practice/density-lesson", completionKey: "stage", completionIndex: 9 },
  { id: "optics", title: "Свет и отражение", href: "/practice/optics-lesson", completionKey: "stage", completionIndex: 9 },
] as const;

export type NotebookNote = { id: string; title: string; href: string; text: string; kind: "explanation" | "personal" };
export type InvestigationRecord = { id: string; title: string; href: string; text: string };

export function readNotebook(): { notes: NotebookNote[]; investigations: InvestigationRecord[]; unavailable: number } {
  const notes: NotebookNote[] = [];
  const investigations: InvestigationRecord[] = [];
  let unavailable = 0;
  for (const lesson of notebookLessons) {
    const codec = lessonDraftExportCodecs.find((item) => item.key === `physicslab-lesson-draft-${lesson.id}`)!;
    const result = readLessonDraft(codec);
    if (!result.ok) { if (result.reason !== "empty") unavailable++; continue; }
    const { summaryText, summarySaved, personalNote } = result.value;
    if ((summarySaved === true || lesson.id === "average-speed") && typeof summaryText === "string" && summaryText.trim()) {
      notes.push({ id: lesson.id, title: lesson.title, href: lesson.href, text: summaryText, kind: "explanation" });
    }
    if (
      summarySaved === true &&
      typeof summaryText === "string" &&
      summaryText.trim() &&
      (result.value.investigationCompleted === true ||
        result.value[lesson.completionKey] === lesson.completionIndex)
    ) {
      investigations.push({ id: lesson.id, title: lesson.title, href: lesson.href, text: summaryText });
    }
    if (lesson.id === "average-speed" && typeof personalNote === "string" && personalNote.trim()) {
      notes.push({ id: `${lesson.id}-personal`, title: lesson.title, href: lesson.href, text: personalNote, kind: "personal" });
    }
  }
  return { notes, investigations, unavailable };
}

export function filterNotebook(notes: NotebookNote[], query: string) {
  const normalize = (value: string) => value.toLocaleLowerCase("ru-RU").replaceAll("ё", "е").trim();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return notes.filter((note) => words.every((word) => normalize(`${note.title} ${note.text}`).includes(word)));
}
