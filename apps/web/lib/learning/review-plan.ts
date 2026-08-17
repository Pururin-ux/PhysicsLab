import { topics } from "../topics.ts";
import {
  combineWeakTrapLastSeenAt,
  combineWeakTraps,
  type AppProgress,
} from "../stores/progress-store.ts";
import { skillMetadata, type SkillId, type TopicId } from "./taxonomy.ts";
import { getTopWeaknesses, type WeaknessDisplay } from "./weakness-labels.ts";
import { getLearningDestination } from "./learning-links.ts";
import type { TemplateId } from "../server/task-generator/generate.ts";

export type ReviewUrgency = "today" | "next-session" | "later";

export type ReviewPlanItem = WeaknessDisplay & {
  urgency: ReviewUrgency;
  dueLabel: string;
  reason: string;
  topicId: TopicId | null;
  topicTitle: string | null;
  familyId: TemplateId | null;
  taskHref: string | null;
  practiceHref: string | null;
  fallbackHref: string;
  hasReferenceSolution: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const topicById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

function isSkillId(value: string): value is SkillId {
  return value in skillMetadata;
}

function daysSince(iso: string | null | undefined, now: Date): number | null {
  if (!iso) {
    return null;
  }

  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return null;
  }

  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / DAY_MS));
}

function getTopicIdForWeakness(weakness: WeaknessDisplay): TopicId | null {
  if (!isSkillId(weakness.skillId)) {
    return null;
  }

  return skillMetadata[weakness.skillId].topicId;
}

function getUrgency(count: number, ageDays: number | null): ReviewUrgency {
  if (count >= 3 || (count >= 1 && ageDays !== null && ageDays >= 1)) {
    return "today";
  }

  if (count >= 2) {
    return "next-session";
  }

  return "later";
}

function getDueCopy(urgency: ReviewUrgency, ageDays: number | null) {
  if (urgency === "today") {
    return {
      dueLabel: "Повторить сегодня",
      reason:
        ageDays !== null && ageDays >= 1
          ? "ошибка уже ждёт следующего возвращения"
          : "ловушка повторилась несколько раз",
    };
  }

  if (urgency === "next-session") {
    return {
      dueLabel: "Вернуть в следующей сессии",
      reason: "ошибка повторяется, но ещё свежая",
    };
  }

  return {
    dueLabel: "Можно позже",
    reason: "пока это одиночная ошибка",
  };
}

function urgencyWeight(urgency: ReviewUrgency) {
  if (urgency === "today") return 0;
  if (urgency === "next-session") return 1;
  return 2;
}

export function buildReviewPlan(
  progress: AppProgress,
  limit = 5,
  now = new Date(),
): ReviewPlanItem[] {
  if (limit <= 0) {
    return [];
  }

  const lastSeenByWeakTrap = combineWeakTrapLastSeenAt(progress);

  return getTopWeaknesses(combineWeakTraps(progress), limit)
    .map((weakness) => {
      const topicId = getTopicIdForWeakness(weakness);
      const topic = topicId ? topicById[topicId] : null;
      const destination = getLearningDestination(weakness.skillId);
      const lastSeenAt =
        lastSeenByWeakTrap[weakness.key] ??
        (topicId ? progress.topics[topicId]?.lastPracticedAt : null);
      const ageDays = daysSince(lastSeenAt, now);
      const urgency = getUrgency(weakness.count, ageDays);
      const copy = getDueCopy(urgency, ageDays);

      return {
        ...weakness,
        ...copy,
        urgency,
        topicId,
        topicTitle: topic?.title ?? null,
        familyId: destination?.familyId ?? null,
        taskHref: destination?.taskHref ?? null,
        practiceHref: destination?.practiceHref ?? null,
        fallbackHref: destination?.taskHref ?? "/tasks",
        hasReferenceSolution: destination?.hasReferenceSolution ?? false,
      };
    })
    .sort((left, right) => {
      const byUrgency = urgencyWeight(left.urgency) - urgencyWeight(right.urgency);
      if (byUrgency !== 0) return byUrgency;
      if (right.count !== left.count) return right.count - left.count;
      return left.skillTitle.localeCompare(right.skillTitle, "ru");
    });
}

export function countDueReviews(progress: AppProgress) {
  return buildReviewPlan(progress, 20).filter((item) => item.urgency === "today").length;
}
