import { topics } from "../topics.ts";
import {
  combineWeakTraps,
  type AppProgress,
} from "../stores/progress-store.ts";
import {
  buildReviewPlan,
  type ReviewPlanItem,
  type ReviewUrgency,
} from "./review-plan.ts";
import { skillMetadata, type TopicId } from "./taxonomy.ts";

export type ReviewTopicTone = "neutral" | "cyan" | "gold";

export type ReviewTopicInsight = {
  topicId: TopicId;
  topicTitle: string;
  href: string;
  statusLabel: string;
  summary: string;
  tone: ReviewTopicTone;
  totalWeaknesses: number;
  totalAttempts: number;
  dueToday: number;
  nextSession: number;
  later: number;
  skillCoverageLabel: string;
  topSkillTitles: string[];
  intensity: number;
};

export type ReviewDashboard = {
  plan: ReviewPlanItem[];
  totalWeaknesses: number;
  totalAttempts: number;
  dueToday: number;
  nextSession: number;
  later: number;
  activeTopics: number;
  primaryAction: ReviewPlanItem | null;
  recoveryLabel: string;
  recoveryNote: string;
  topicInsights: ReviewTopicInsight[];
};

const topicSkillCount = Object.values(skillMetadata).reduce(
  (counts, skill) => {
    counts[skill.topicId] = (counts[skill.topicId] ?? 0) + 1;
    return counts;
  },
  {} as Record<TopicId, number>,
);

function countByUrgency(plan: ReviewPlanItem[], urgency: ReviewUrgency) {
  return plan.filter((item) => item.urgency === urgency).length;
}

function topicSummary(
  topicWeaknesses: number,
  dueToday: number,
  nextSession: number,
) {
  if (topicWeaknesses === 0) {
    return "Активных ловушек нет";
  }

  if (dueToday > 0) {
    return `${dueToday} нужно вернуть сегодня`;
  }

  if (nextSession > 0) {
    return `${nextSession} оставить на следующую сессию`;
  }

  return "Только одиночные свежие ошибки";
}

function topicStatus(
  topicWeaknesses: number,
  dueToday: number,
): Pick<ReviewTopicInsight, "statusLabel" | "tone"> {
  if (topicWeaknesses === 0) {
    return { statusLabel: "Чисто", tone: "neutral" };
  }

  if (dueToday > 0) {
    return { statusLabel: "В фокусе", tone: "gold" };
  }

  return { statusLabel: "Под контролем", tone: "cyan" };
}

function uniqueSkillTitles(plan: ReviewPlanItem[]) {
  return Array.from(new Set(plan.map((item) => item.skillTitle))).slice(0, 3);
}

function buildRecoveryCopy(plan: ReviewPlanItem[]) {
  if (plan.length === 0) {
    return {
      recoveryLabel: "Нет активных ловушек",
      recoveryNote:
        "После тренировки здесь появится очередь повторения с конкретными темами и ловушками.",
    };
  }

  const dueToday = countByUrgency(plan, "today");
  const nextSession = countByUrgency(plan, "next-session");
  const first = plan[0];

  if (dueToday > 0) {
    return {
      recoveryLabel: `${dueToday} в фокусе сегодня`,
      recoveryNote: `Начни с «${first.skillTitle}»: это самая срочная ловушка по повторяемости и давности.`,
    };
  }

  if (nextSession > 0) {
    return {
      recoveryLabel: `${nextSession} на следующую сессию`,
      recoveryNote: `Главный кандидат на повторение — «${first.skillTitle}», но его можно вернуть после текущей тренировки.`,
    };
  }

  return {
    recoveryLabel: "Есть свежие одиночные ошибки",
    recoveryNote:
      "Они пока не требуют срочного возврата, но уже показывают, какие навыки стоит держать на радаре.",
  };
}

export function buildReviewDashboard(
  progress: AppProgress,
  now = new Date(),
): ReviewDashboard {
  const weakTraps = combineWeakTraps(progress);
  const totalWeaknesses = Object.keys(weakTraps).length;
  const totalAttempts = Object.values(weakTraps).reduce(
    (sum, count) => sum + count,
    0,
  );
  const plan = buildReviewPlan(progress, Math.max(totalWeaknesses, 1), now);
  const dueToday = countByUrgency(plan, "today");
  const nextSession = countByUrgency(plan, "next-session");
  const later = countByUrgency(plan, "later");
  const copy = buildRecoveryCopy(plan);

  const topicInsights = topics.map((topic): ReviewTopicInsight => {
    const topicPlan = plan.filter((item) => item.topicId === topic.id);
    const topicWeaknesses = topicPlan.length;
    const topicAttempts = topicPlan.reduce((sum, item) => sum + item.count, 0);
    const topicDueToday = countByUrgency(topicPlan, "today");
    const topicNextSession = countByUrgency(topicPlan, "next-session");
    const topicLater = countByUrgency(topicPlan, "later");
    const status = topicStatus(topicWeaknesses, topicDueToday);
    const skillsCount = topicSkillCount[topic.id] ?? topic.skillsCount;
    const intensity =
      topicWeaknesses === 0
        ? 0
        : Math.min(1, (topicAttempts + topicDueToday * 2) / 8);

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      href: topic.href,
      ...status,
      totalWeaknesses: topicWeaknesses,
      totalAttempts: topicAttempts,
      dueToday: topicDueToday,
      nextSession: topicNextSession,
      later: topicLater,
      skillCoverageLabel: `${topicWeaknesses}/${skillsCount}`,
      topSkillTitles: uniqueSkillTitles(topicPlan),
      summary: topicSummary(topicWeaknesses, topicDueToday, topicNextSession),
      intensity,
    };
  });

  return {
    plan,
    totalWeaknesses,
    totalAttempts,
    dueToday,
    nextSession,
    later,
    activeTopics: topicInsights.filter((topic) => topic.totalWeaknesses > 0).length,
    primaryAction: plan[0] ?? null,
    topicInsights,
    ...copy,
  };
}
