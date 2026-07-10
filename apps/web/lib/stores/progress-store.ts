import { atom } from "nanostores";
import {
  clearStore,
  readStore,
  writeStore,
  type StoreCodec,
} from "./storage-envelope.ts";
import { skillMetadata, type TopicId } from "../learning/taxonomy.ts";
import { topics } from "../topics.ts";
import type { AnswerRecord } from "../../components/quiz/quiz-session-store.ts";
import { logPracticeDay } from "./practice-log-store.ts";

export type { TopicId } from "../learning/taxonomy.ts";

export const PROGRESS_STORAGE_KEY = "physicslab-v3-progress-v1";

// Контракт версионирования: любое изменение формы TopicProgress/AppProgress —
// это bump PROGRESS_VERSION плюс ветка в migrateStoredProgress. Ключ
// хранилища не меняем, чтобы прогресс учеников переживал обновления.
// v1 → v2: добавлено поле weakTrapLastSeenAt (даты последней встречи ловушки).
// v2 → v3: открыта тема optics — в topics появился новый ключ; старые данные
// дополняются пустым прогрессом оптики, остальные темы сохраняются как есть.
export const PROGRESS_VERSION = 3;

export type TopicProgress = {
  solved: number;
  correct: number;
  completedSessions: number;
  weakTraps: Record<string, number>;
  weakTrapLastSeenAt: Record<string, string>;
  lastPracticedAt: string | null;
};

export type AppProgress = {
  version: typeof PROGRESS_VERSION;
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
    version: PROGRESS_VERSION,
    topics: Object.fromEntries(
      topics.map((topic) => [topic.id, createEmptyTopicProgress()]),
    ) as Record<TopicId, TopicProgress>,
  };
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

// Понимает текущую и все прошлые версии; незнакомая версия -> null (сброс).
// Экспортирована ради тестов миграции — в UI используйте hydrateProgressFromStorage.
export function migrateStoredProgress(value: unknown): AppProgress | null {
  if (!isRecord(value) || !isRecord(value.topics)) {
    return null;
  }

  // v1: не было weakTrapLastSeenAt — normalizeTopicProgress дополняет его
  // пустым словарём. v2: не было темы optics — цикл по актуальному списку
  // topics создаёт для неё пустой прогресс, не трогая существующие темы.
  if (value.version !== 1 && value.version !== 2 && value.version !== PROGRESS_VERSION) {
    return null;
  }

  const progress = createDefaultProgress();

  for (const topic of topics) {
    progress.topics[topic.id] = normalizeTopicProgress(value.topics[topic.id]);
  }

  return progress;
}

// Конверт хранит AppProgress целиком: его внутренний version дублирует
// version конверта — это цена нулевой переделки migrateStoredProgress,
// который обязан продолжать понимать и старый inline-формат.
export const progressCodec: StoreCodec<AppProgress> = {
  key: PROGRESS_STORAGE_KEY,
  currentVersion: PROGRESS_VERSION,
  sniffLegacy: (_raw, parsed) =>
    isRecord(parsed) && isRecord(parsed.topics)
      ? { version: typeof parsed.version === "number" ? parsed.version : 0, data: parsed }
      : null,
  migrate: (data) => migrateStoredProgress(data),
};

function saveProgress(progress: AppProgress) {
  writeStore(progressCodec, progress);
}

export const $appProgress = atom<AppProgress>(createDefaultProgress());

export function hydrateProgressFromStorage() {
  const result = readStore(progressCodec);
  if (!result.ok) {
    return;
  }

  $appProgress.set(result.value);
  if (result.migrated) {
    // Смигрированное состояние сразу пишем обратно уже в текущем формате.
    saveProgress(result.value);
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
    version: PROGRESS_VERSION,
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

  const nextProgress: AppProgress = { version: PROGRESS_VERSION, topics: nextTopics };

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
  clearStore(progressCodec);
}

export function getTopicProgress(topicId: TopicId) {
  return $appProgress.get().topics[topicId] ?? createEmptyTopicProgress();
}
