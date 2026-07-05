import { atom } from "nanostores";
import { skillMetadata, type TopicId } from "../learning/taxonomy.ts";
import { topics } from "../topics.ts";
import type { AnswerRecord } from "../../components/quiz/quiz-session-store.ts";
import { logPracticeDay } from "./practice-log-store.ts";

export type { TopicId } from "../learning/taxonomy.ts";

export const PROGRESS_STORAGE_KEY = "physicslab-v3-progress-v1";

export type TopicProgress = {
  solved: number;
  correct: number;
  completedSessions: number;
  weakTraps: Record<string, number>;
  weakTrapLastSeenAt: Record<string, string>;
  lastPracticedAt: string | null;
};

export type AppProgress = {
  version: 1;
  topics: Record<TopicId, TopicProgress>;
};

type CompletedSessionInput = {
  topicId: TopicId;
  score: number;
  total: number;
  answers: AnswerRecord[];
};

function createEmptyTopicProgress(): TopicProgress {
  return {
    solved: 0,
    correct: 0,
    completedSessions: 0,
    weakTraps: {},
    weakTrapLastSeenAt: {},
    lastPracticedAt: null,
  };
}

function createDefaultProgress(): AppProgress {
  return {
    version: 1,
    topics: Object.fromEntries(
      topics.map((topic) => [topic.id, createEmptyTopicProgress()]),
    ) as Record<TopicId, TopicProgress>,
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

function normalizeWeakTraps(value: unknown): Record<string, number> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, count]) =>
        key !== "undefined" &&
        key.trim().length > 0 &&
        typeof count === "number" &&
        Number.isFinite(count) &&
        count > 0,
    ).map(([key, count]) => [key, Math.floor(count as number)]),
  );
}

function normalizeWeakTrapLastSeenAt(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, seenAt]) =>
        key !== "undefined" &&
        key.trim().length > 0 &&
        typeof seenAt === "string" &&
        seenAt.trim().length > 0,
    ),
  ) as Record<string, string>;
}

function normalizeTopicProgress(value: unknown): TopicProgress {
  if (!isRecord(value)) {
    return createEmptyTopicProgress();
  }

  return {
    solved: normalizeCount(value.solved),
    correct: normalizeCount(value.correct),
    completedSessions: normalizeCount(value.completedSessions),
    weakTraps: normalizeWeakTraps(value.weakTraps),
    weakTrapLastSeenAt: normalizeWeakTrapLastSeenAt(value.weakTrapLastSeenAt),
    lastPracticedAt:
      typeof value.lastPracticedAt === "string" ? value.lastPracticedAt : null,
  };
}

function normalizeProgress(value: unknown): AppProgress | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.topics)) {
    return null;
  }

  const progress = createDefaultProgress();

  for (const topic of topics) {
    progress.topics[topic.id] = normalizeTopicProgress(value.topics[topic.id]);
  }

  return progress;
}

function saveProgress(progress: AppProgress) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage can be unavailable in private or constrained browser modes.
  }
}

export const $appProgress = atom<AppProgress>(createDefaultProgress());

export function hydrateProgressFromStorage() {
  if (!canUseStorage()) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const progress = normalizeProgress(JSON.parse(raw));
    if (!progress) {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      return;
    }

    $appProgress.set(progress);
  } catch {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  }
}

export function recordCompletedSession({
  topicId,
  score,
  total,
  answers,
}: CompletedSessionInput) {
  const current = $appProgress.get();
  const existing = current.topics[topicId] ?? createEmptyTopicProgress();
  const weakTraps = { ...existing.weakTraps };
  const weakTrapLastSeenAt = { ...existing.weakTrapLastSeenAt };
  const solvedCount = normalizeCount(total);
  const correctCount = Math.min(normalizeCount(score), solvedCount);
  const practicedAt = new Date().toISOString();

  for (const answer of answers) {
    const misconception = answer.selectedMisconception || answer.taskTrap;

    if (!answer.isCorrect && answer.blueprint && misconception) {
      const trapKey = `${answer.blueprint}:${misconception}`;
      weakTraps[trapKey] = (weakTraps[trapKey] || 0) + 1;
      weakTrapLastSeenAt[trapKey] = practicedAt;
    }
  }

  const nextProgress: AppProgress = {
    version: 1,
    topics: {
      ...current.topics,
      [topicId]: {
        solved: existing.solved + solvedCount,
        correct: existing.correct + correctCount,
        completedSessions: existing.completedSessions + 1,
        weakTraps,
        weakTrapLastSeenAt,
        lastPracticedAt: practicedAt,
      },
    },
  };

  $appProgress.set(nextProgress);
  saveProgress(nextProgress);
  logPracticeDay();
}

function topicIdForBlueprint(blueprint: string): TopicId | null {
  const skill =
    blueprint in skillMetadata
      ? skillMetadata[blueprint as keyof typeof skillMetadata]
      : null;

  return skill && skill.topicId in $appProgress.get().topics
    ? skill.topicId
    : null;
}

// Пробный вариант пополняет статистику решённых задач и слабые места тем,
// но не считается отдельной "тренировкой" темы (completedSessions не растёт).
export function recordExamSession(answers: AnswerRecord[]) {
  const current = $appProgress.get();
  const nextTopics = { ...current.topics };
  const practicedAt = new Date().toISOString();

  for (const answer of answers) {
    const topicId = topicIdForBlueprint(answer.blueprint);
    if (!topicId) {
      continue;
    }

    const existing = nextTopics[topicId] ?? createEmptyTopicProgress();
    const weakTraps = { ...existing.weakTraps };
    const weakTrapLastSeenAt = { ...existing.weakTrapLastSeenAt };

    const misconception = answer.selectedMisconception || answer.taskTrap;

    if (!answer.isCorrect && answer.blueprint && misconception) {
      const trapKey = `${answer.blueprint}:${misconception}`;
      weakTraps[trapKey] = (weakTraps[trapKey] || 0) + 1;
      weakTrapLastSeenAt[trapKey] = practicedAt;
    }

    nextTopics[topicId] = {
      ...existing,
      solved: existing.solved + 1,
      correct: existing.correct + (answer.isCorrect ? 1 : 0),
      weakTraps,
      weakTrapLastSeenAt,
      lastPracticedAt: practicedAt,
    };
  }

  const nextProgress: AppProgress = { version: 1, topics: nextTopics };

  $appProgress.set(nextProgress);
  saveProgress(nextProgress);
  logPracticeDay();
}

export function combineWeakTraps(progress: AppProgress): Record<string, number> {
  const combined: Record<string, number> = {};

  for (const topic of topics) {
    const weakTraps = progress.topics[topic.id]?.weakTraps ?? {};
    for (const [key, count] of Object.entries(weakTraps)) {
      combined[key] = (combined[key] ?? 0) + count;
    }
  }

  return combined;
}

export function combineWeakTrapLastSeenAt(progress: AppProgress): Record<string, string> {
  const combined: Record<string, string> = {};

  for (const topic of topics) {
    Object.assign(combined, progress.topics[topic.id]?.weakTrapLastSeenAt ?? {});
  }

  return combined;
}

export function resetProgress() {
  const progress = createDefaultProgress();
  $appProgress.set(progress);

  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

export function getTopicProgress(topicId: TopicId) {
  return $appProgress.get().topics[topicId] ?? createEmptyTopicProgress();
}
