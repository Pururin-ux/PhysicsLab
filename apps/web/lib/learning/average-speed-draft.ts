import { lessonDraftCodec, readLessonDraft } from "./lesson-draft.ts";

export const averageSpeedInitial = { stage: 0, prediction: "", slowTime: 5, observed: false, reason: "", answer: "", checked: false, attempts: 0, hideMio: false, summaryText: "", summarySaved: false, investigationCompleted: false, personalNote: "" };
export const averageSpeedHeadings = ["Две скорости. Как найти среднюю?", "Измени время — проверь гипотезу", "Что убедило Мио?", "Теперь — другая поездка", "Забери мысль с собой"];

export const averageSpeedDraftCodec = lessonDraftCodec("average-speed", averageSpeedInitial, averageSpeedHeadings.length);

export function readAverageSpeedResume() {
  const result = readLessonDraft(averageSpeedDraftCodec);
  if (!result.ok) return null;
  const draft = result.value;
  const hasWork = draft.stage > 0 || draft.prediction.trim() || draft.observed ||
    draft.slowTime !== averageSpeedInitial.slowTime || draft.reason.trim() ||
    draft.answer.trim() || draft.attempts > 0 || draft.summaryText.trim() || draft.personalNote.trim();
  if (!hasWork) return null;

  return {
    label: "Сохранённый урок",
    title: `Средняя скорость · шаг ${draft.stage + 1} из ${averageSpeedHeadings.length}`,
    body: averageSpeedHeadings[draft.stage],
    reason: "Параметры опыта и ответы сохранены в этом браузере.",
    href: "/practice/average-speed-lesson",
    cta: "Вернуться к уроку",
    tone: "cyan" as const,
    mode: "learn" as const,
  };
}
