import { topics } from "../topics";
import type { AppProgress } from "../stores/progress-store";
import { buildReviewPlan } from "./review-plan";

export type LearningNextStep = {
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  tone: "cyan" | "gold";
};

export function getLearningNextStep(
  progress: AppProgress,
  hasBestExam: boolean,
): LearningNextStep {
  const topReview = buildReviewPlan(progress, 1)[0] ?? null;

  if (topReview?.familyId && topReview.practiceHref && topReview.urgency !== "later") {
    return {
      label: topReview.dueLabel,
      title: `Повтори: ${topReview.skillTitle}`,
      body: `${topReview.hint} ${topReview.reason}.`,
      href: topReview.practiceHref,
      cta: "Решить 5 похожих",
      tone: "gold",
    };
  }

  const firstUnstartedTopic = topics.find((topic) => {
    const topicProgress = progress.topics[topic.id];

    return (
      !topicProgress ||
      (topicProgress.completedSessions === 0 && topicProgress.solved === 0)
    );
  });

  if (firstUnstartedTopic) {
    return {
      label: "Следующий шаг",
      title:
        firstUnstartedTopic.id === "kinematics"
          ? "Начни с движения и графиков"
          : `Открой тему: ${firstUnstartedTopic.title}`,
      body:
        firstUnstartedTopic.id === "kinematics"
          ? "Скорость, ускорение и графики — основа для всего остального. Начни отсюда."
          : `${firstUnstartedTopic.description} Одна короткая тренировка — и видно, где слабые места.`,
      href: firstUnstartedTopic.href,
      cta: "Начать",
      tone: "cyan",
    };
  }

  if (!hasBestExam) {
    return {
      label: "Пора смешать темы",
      title: "Смешанная тренировка",
      body: "10 задач из открытых тем вперемешку. Это не полный вариант ЦТ/ЦЭ.",
      href: "/practice/exam-demo",
      cta: "Начать тренировку",
      tone: "gold",
    };
  }

  return {
    label: "Поддержи форму",
    title: "Вернись к смешанной тренировке",
    body: "Темы пройдены — держи форму на смешанных задачах.",
    href: "/practice/exam-demo",
    cta: "Ещё 10 задач",
    tone: "cyan",
  };
}
