import { topics } from "../topics.ts";
import {
  DELAYED_RECALL_MIN_MS,
  type AppProgress,
} from "../stores/progress-store.ts";
import { buildReviewPlan } from "./review-plan.ts";
import type { ReviewResumeCandidate } from "./review-resume.ts";
import type { TextbookCheckActivityItem } from "./use-textbook-check-activity.ts";
import { skillMetadata, type SkillId } from "./taxonomy.ts";
import { mixedPracticeHrefByTopic } from "./topic-practice-routes.ts";

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
        href: topic.id === "measurements"
          ? `/practice/family/${skill.id}`
          : mixedPracticeHrefByTopic[topic.id],
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
  resumeCandidates: readonly ReviewResumeCandidate[] = [],
  textbookChecks: readonly TextbookCheckActivityItem[] = [],
): LearningNextStep {
  const reviewPlan = buildReviewPlan(progress, 3, now, resumeCandidates);
  const pendingReview = reviewPlan.find((item) => item.isPending) ?? null;
  const topReview = reviewPlan.find((item) => !item.isPending) ?? null;

  if (
    pendingReview?.familyId &&
    pendingReview.practiceHref
  ) {
    return {
      label: "Повторение",
      title: `Вернуться к ошибке: ${pendingReview.skillTitle}`,
      body: pendingReview.hint,
      reason: "Ответ есть в черновике. Открой сохранённую попытку, чтобы продолжить.",
      href: pendingReview.practiceHref,
      cta: "Открыть попытку",
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

  const textbookRetry = textbookChecks.find((item) => item.status === "retry" && item.title);
  if (textbookRetry) {
    return {
      label: "Самопроверка",
      title: `Вернуться к вопросу: ${textbookRetry.title}`,
      body: "Ты проверил ответ. Разбери объяснение и попробуй тот же вопрос ещё раз.",
      reason: "Это возможность вернуться к трудному месту, а не оценка всей темы.",
      href: textbookRetry.href,
      cta: "Открыть вопрос",
      tone: "gold",
      mode: "learn",
    };
  }

  const textbookDraft = textbookChecks.find((item) => item.status === "draft" && item.title);
  if (textbookDraft) {
    return {
      label: "Незаконченная самопроверка",
      title: `Продолжить: ${textbookDraft.title}`,
      body: "Ответ выбран, но ещё не проверен.",
      reason: "Вернись к этому вопросу, когда будешь готов проверить свой выбор.",
      href: textbookDraft.href,
      cta: "Вернуться к вопросу",
      tone: "cyan",
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

  const textbookCorrect = textbookChecks.find((item) => item.status === "correct" && item.grade);
  if (nothingStarted && textbookCorrect) {
    return {
      label: "После самопроверки",
      title: "Выбрать следующий вопрос",
      body: `Ты проверил ответ в учебнике ${textbookCorrect.grade} класса. Что разберёшь дальше?`,
      reason: "Один верный ответ не означает, что вся тема уже освоена.",
      href: `/topics?grade=${textbookCorrect.grade}`,
      cta: "Выбрать вопрос",
      tone: "cyan",
      mode: "learn",
    };
  }

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

  // A measurement-only start does not establish a grade or mastery. Offer a
  // choice within the same school material instead of jumping to acceleration.
  const measurements = progress.topics.measurements;
  const onlyMeasurementsStarted =
    !hasBestExam &&
    Boolean(measurements && (measurements.solved > 0 || measurements.completedSessions > 0)) &&
    topics.every((topic) => {
      if (topic.id === "measurements") return true;
      const topicProgress = progress.topics[topic.id];
      return !topicProgress || (topicProgress.solved === 0 && topicProgress.completedSessions === 0);
    });

  if (onlyMeasurementsStarted) {
    return {
      label: "Следующий вопрос",
      title: "Что ещё разобрать в 7 классе?",
      body: "Ты начал с измерений. Рядом — другие вопросы о веществах и движении.",
      reason: "Выбери интересный вопрос; решённые задачи не означают, что всю тему ты уже освоил.",
      href: "/topics?grade=7",
      cta: "Выбрать вопрос",
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
      label: "Новая тема",
      title:
        firstUnstartedTopic.id === "kinematics"
          ? "Движение и графики"
          : firstUnstartedTopic.title,
      body:
        firstUnstartedTopic.id === "kinematics"
          ? "Скорость, ускорение и графики движения."
          : firstUnstartedTopic.description,
      reason: "Эту тему ты ещё не пробовал. Можно открыть её сейчас или выбрать другую ниже.",
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
