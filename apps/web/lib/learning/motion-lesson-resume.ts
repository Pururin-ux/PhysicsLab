import { readAverageSpeedResume } from "./average-speed-draft.ts";
import { lessonDraftCodec, readLessonDraft } from "./lesson-draft.ts";
import { roundTripInitial, walkInitial } from "./round-trip.ts";

export function readMotionLessonResumes() {
  const investigation = readAverageSpeedResume();
  const walk = readLessonDraft(lessonDraftCodec("textbook-walk", walkInitial, 3));
  const speed = readLessonDraft(lessonDraftCodec("textbook-round-trip-speed", roundTripInitial, 1));
  const walkResume = walk.ok && walk.value.stage > 0 ? {
    label: "Сохранённая прогулка",
    title: "Путь и перемещение",
    body: walk.value.stage === 1 ? "Мио у скамейки: пройдено 20 м." : "Мио вернулась к двери: путь 40 м, перемещение 0.",
    reason: "Выбранный момент прогулки сохранён в этом браузере.",
    href: "/learn/path-and-displacement",
    cta: "Продолжить прогулку",
    tone: "cyan" as const, mode: "learn" as const,
  } : null;
  const speedResume = speed.ok && [10, 20, 40].includes(speed.value.seconds) &&
    (speed.value.seconds !== roundTripInitial.seconds || speed.value.stop) ? {
      label: "Сохранённый опыт",
      title: "Средняя скорость прогулки",
      body: `Движение — ${speed.value.seconds} с${speed.value.stop ? ", остановка — 10 с" : ""}.`,
      reason: "Выбранное время прогулки сохранено в этом браузере.",
      href: "/learn/average-speed",
      cta: "Продолжить опыт",
      tone: "cyan" as const, mode: "learn" as const,
    } : null;
  // Fixed episode order, not inferred recency: drafts have no visit timestamps.
  return [investigation, speedResume, walkResume].filter(item => item !== null);
}
