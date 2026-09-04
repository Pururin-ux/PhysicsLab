import { topics } from "../topics";
import {
  DELAYED_RECALL_MIN_MS,
  type AppProgress,
} from "../stores/progress-store";
import { buildReviewPlan } from "./review-plan";
import { skillMetadata, type SkillId } from "./taxonomy";
import { mixedPracticeHrefByTopic } from "./topic-practice-routes";

export type LearningNextStep = {
  label: string;
  title: string;
  body: string;
  reason: string;
  href: string;
  cta: string;
  tone: "cyan" | "gold";
  mode: "learn" | "exam";
};

export type DueDelayedRecall = {
  skillId: SkillId;
  skillTitle: string;
  description: string;
  topicId: keyof typeof mixedPracticeHrefByTopic;
  href: string;
  transferPassedAt: string;
};

export function getDueDelayedRecall(
  progress: AppProgress,
  now = new Date(),
): DueDelayedRecall | null {
  const nowMs = now.getTime();
  const due: DueDelayedRecall[] = [];

  for (const topic of topics) {
    const evidenceBySkill = progress.topics[topic.id]?.skillEvidence ?? {};

    for (const [blueprint, evidence] of Object.entries(evidenceBySkill)) {
      if (evidence.delayedRecallPassedAt || !(blueprint in skillMetadata)) continue;

      const transferMs = Date.parse(evidence.transferPassedAt);
      const skill = skillMetadata[blueprint as SkillId];
      if (
        !Number.isFinite(transferMs) ||
        nowMs - transferMs < DELAYED_RECALL_MIN_MS ||
        skill.topicId !== topic.id
      ) {
        continue;
      }

      due.push({
        skillId: skill.id,
        skillTitle: skill.shortTitle,
        description: skill.description,
        topicId: topic.id,
        href: mixedPracticeHrefByTopic[topic.id],
        transferPassedAt: evidence.transferPassedAt,
      });
    }
  }

  return due.sort((left, right) =>
    left.transferPassedAt.localeCompare(right.transferPassedAt),
  )[0] ?? null;
}

export function getLearningNextStep(
  progress: AppProgress,
  hasBestExam: boolean,
  now = new Date(),
): LearningNextStep {
  const reviewPlan = buildReviewPlan(progress, 3, now);
  const pendingReview = reviewPlan.find((item) => item.isPending) ?? null;
  const topReview = reviewPlan.find((item) => !item.isPending) ?? null;
  const hasPendingMistake = Object.keys(progress.pendingMistakes).length > 0;

  if (
    hasPendingMistake &&
    pendingReview?.familyId &&
    pendingReview.practiceHref
  ) {
    return {
      label: "Повторение",
      title: `Вернуться к ошибке: ${pendingReview.skillTitle}`,
      body: pendingReview.hint,
      reason: "Ответ уже сохранён — можно продолжить с места, где он сбился.",
      href: pendingReview.practiceHref,
      cta: "Продолжить задачу",
      tone: "gold",
      mode: "learn",
    };
  }

  const dueRecall = getDueDelayedRecall(progress, now);
  if (dueRecall) {
    return {
      label: "Проверка после паузы",
      title: `Вспомнить: ${dueRecall.skillTitle}`,
      body: dueRecall.description,
      reason: "Перенос без подсказки уже получился. Прошли сутки — теперь можно проверить, удержался ли ход решения.",
      href: dueRecall.href,
      cta: "Проверить без подсказки",
      tone: "cyan",
      mode: "learn",
    };
  }

  if (
    topReview?.familyId &&
    topReview.practiceHref &&
    topReview.urgency !== "later"
  ) {
    return {
      label: "Повторение",
      title: `Повтори: ${topReview.skillTitle}`,
      body: topReview.hint,
      reason: `${topReview.dueLabel}: ${topReview.reason}.`,
      href: topReview.practiceHref,
      cta: "Решить 5 похожих",
      tone: "gold",
      mode: "learn",
    };
  }

  // Новому ученику даём короткую выборку разных тем без служебного языка.
  const nothingStarted =
    !hasBestExam &&
    topics.every((topic) => {
      const topicProgress = progress.topics[topic.id];
      return (
        !topicProgress ||
        (topicProgress.completedSessions === 0 && topicProgress.solved === 0)
      );
    });

  if (nothingStarted) {
    return {
      label: "Первый урок",
      title: "Скорость и ускорение",
      body: "Как меняется движение и что показывает график скорости.",
      reason: "Для начала понадобятся только скорость, время и простой график.",
      href: "/practice/kinematics-lesson",
      cta: "Открыть тему",
      tone: "cyan",
      mode: "learn",
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
      label: "Тема",
      title:
        firstUnstartedTopic.id === "kinematics"
          ? "Движение и графики"
          : firstUnstartedTopic.title,
      body:
        firstUnstartedTopic.id === "kinematics"
          ? "Скорость, ускорение и графики движения."
          : firstUnstartedTopic.description,
      reason: "Эта тема продолжает уже начатую работу без скачка в более сложный материал.",
      href: firstUnstartedTopic.href,
      cta: "Открыть тему",
      tone: "cyan",
      mode: "learn",
    };
  }

  if (!hasBestExam) {
    return {
      label: "Задачи",
      title: "Смешанная тренировка",
      body: "10 задач из знакомых тем. Черновик рядом.",
      reason: "Все открытые темы уже начаты — теперь полезно увидеть их вместе.",
      href: "/practice/exam-demo",
      cta: "Начать тренировку",
      tone: "gold",
      mode: "exam",
    };
  }

  return {
    label: "Задачи",
    title: "Смешанная тренировка",
    body: "10 задач из знакомых тем в одном наборе.",
    reason: "После первой диагностики смешанный набор покажет, что удержалось.",
    href: "/practice/exam-demo",
    cta: "Открыть задачи",
    tone: "gold",
    mode: "exam",
  };
}
