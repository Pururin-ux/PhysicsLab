import { topics } from "../topics";
import { combineWeakTraps, type AppProgress } from "../stores/progress-store";
import { getTopWeaknesses } from "./weakness-labels";

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
  const topWeakness = getTopWeaknesses(combineWeakTraps(progress), 1)[0] ?? null;

  if (topWeakness && topWeakness.count >= 2) {
    return {
      label: "Главное на сегодня",
      title: `Разобрать: ${topWeakness.skillTitle}`,
      body: topWeakness.hint,
      href: "/mistakes",
      cta: "Разобрать",
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
          ? "Кинематика даст основу: скорость, ускорение, перемещение и чтение графиков. После неё легче решать динамику."
          : `${firstUnstartedTopic.description} Пройди короткую тренировку, чтобы увидеть, где появляются ошибки.`,
      href: firstUnstartedTopic.href,
      cta: "Начать",
      tone: "cyan",
    };
  }

  if (!hasBestExam) {
    return {
      label: "Пора смешать темы",
      title: "Попробуй вариант по механике",
      body: "После отдельных тренировок важно проверить перенос: графики, силы и формулы идут вперемешку, как в реальном тесте.",
      href: "/practice/exam-demo",
      cta: "Начать вариант",
      tone: "gold",
    };
  }

  return {
    label: "Поддержи форму",
    title: "Вернись к смешанным задачам",
    body: "Когда отдельные темы уже пройдены, лучше чередовать задачи: так быстрее видно, какую идею применять в новом условии.",
    href: "/practice/exam-demo",
    cta: "Ещё вариант",
    tone: "cyan",
  };
}
