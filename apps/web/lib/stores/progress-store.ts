import { atom } from "nanostores";
import {
  clearStore,
  readStore,
  writeStore,
  type StoreCodec,
} from "./storage-envelope.ts";
import {
  allowWriteForKey,
  isWriteBlockedForKey,
  reportReadResult,
  reportWriteResult,
} from "./persistence-status.ts";
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
// v3 → v4: незавершённая ошибка сохраняется сразу и затем без двойного счёта
// переносится в агрегаты при завершении сессии.
// v4 → v5: pending-запись хранит точный внутренний маршрут незавершённой
// сессии, чтобы «Продолжить задачу» не подменяло её пятью похожими.
// v5 → v6: first-try ответ в unlabelled-сессии хранит отдельные доказательства
// переноса и повторного воспроизведения после паузы.
export const PROGRESS_VERSION = 6;

export const DELAYED_RECALL_MIN_MS = 24 * 60 * 60 * 1000;

export type SkillEvidence = {
  transferPassedAt: string;
  delayedRecallPassedAt: string | null;
};

export type TopicProgress = {
  solved: number;
  correct: number;
  completedSessions: number;
  weakTraps: Record<string, number>;
  weakTrapLastSeenAt: Record<string, string>;
  skillEvidence: Record<string, SkillEvidence>;
  lastPracticedAt: string | null;
};

export type PendingMistake = {
  sessionId: string;
  taskId: string;
  topicId: TopicId;
  blueprint: string;
  misconception: string;
  recordedAt: string;
  resumeHref: string | null;
};

export type AppProgress = {
  version: typeof PROGRESS_VERSION;
  topics: Record<TopicId, TopicProgress>;
  pendingMistakes: Record<string, PendingMistake>;
};

type CompletedSessionInput = {
  topicId: TopicId;
  score: number;
  total: number;
  answers: AnswerRecord[];
  sessionId?: string;
  evidenceMode?: "guided" | "transfer";
  completedAt?: string;
};

function createEmptyTopicProgress(): TopicProgress {
  return {
    solved: 0,
    correct: 0,
    completedSessions: 0,
    weakTraps: {},
    weakTrapLastSeenAt: {},
    skillEvidence: {},
    lastPracticedAt: null,
  };
}

function createDefaultProgress(): AppProgress {
  return {
    version: PROGRESS_VERSION,
    topics: Object.fromEntries(
      topics.map((topic) => [topic.id, createEmptyTopicProgress()]),
    ) as Record<TopicId, TopicProgress>,
    pendingMistakes: {},
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

function normalizeSkillEvidence(value: unknown): Record<string, SkillEvidence> {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).flatMap(([blueprint, candidate]) => {
      if (
        blueprint.trim().length === 0 ||
        !isRecord(candidate) ||
        typeof candidate.transferPassedAt !== "string" ||
        candidate.transferPassedAt.trim().length === 0
      ) {
        return [];
      }

      return [[
        blueprint,
        {
          transferPassedAt: candidate.transferPassedAt,
          delayedRecallPassedAt:
            typeof candidate.delayedRecallPassedAt === "string" &&
            candidate.delayedRecallPassedAt.trim().length > 0
              ? candidate.delayedRecallPassedAt
              : null,
        } satisfies SkillEvidence,
      ]];
    }),
  );
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
    skillEvidence: normalizeSkillEvidence(value.skillEvidence),
    lastPracticedAt:
      typeof value.lastPracticedAt === "string" ? value.lastPracticedAt : null,
  };
}

function isTopicId(value: unknown): value is TopicId {
  return typeof value === "string" && topics.some((topic) => topic.id === value);
}

function normalizeResumeHref(value: unknown): string | null {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : null;
}

function normalizePendingMistakes(value: unknown): Record<string, PendingMistake> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, candidate]) => {
      if (
        key.trim().length === 0 ||
        !isRecord(candidate) ||
        typeof candidate.sessionId !== "string" ||
        candidate.sessionId.trim().length === 0 ||
        typeof candidate.taskId !== "string" ||
        candidate.taskId.trim().length === 0 ||
        !isTopicId(candidate.topicId) ||
        typeof candidate.blueprint !== "string" ||
        candidate.blueprint.trim().length === 0 ||
        typeof candidate.misconception !== "string" ||
        candidate.misconception.trim().length === 0 ||
        typeof candidate.recordedAt !== "string" ||
        candidate.recordedAt.trim().length === 0
      ) {
        return [];
      }

      return [[
        key,
        {
          sessionId: candidate.sessionId,
          taskId: candidate.taskId,
          topicId: candidate.topicId,
          blueprint: candidate.blueprint,
          misconception: candidate.misconception,
          recordedAt: candidate.recordedAt,
          resumeHref: normalizeResumeHref(candidate.resumeHref),
        } satisfies PendingMistake,
      ]];
    }),
  );
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
  // v1–v3 не содержали pendingMistakes и получают пустую очередь. v4 pending
  // записи не содержали resumeHref — normalizer добавляет null. v1–v5 не
  // содержали skillEvidence — normalizeTopicProgress добавляет пустую карту.
  if (
    value.version !== 1 &&
    value.version !== 2 &&
    value.version !== 3 &&
    value.version !== 4 &&
    value.version !== 5 &&
    value.version !== PROGRESS_VERSION
  ) {
    return null;
  }

  const progress = createDefaultProgress();

  for (const topic of topics) {
    progress.topics[topic.id] = normalizeTopicProgress(value.topics[topic.id]);
  }
  progress.pendingMistakes = normalizePendingMistakes(value.pendingMistakes);

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
  // Future-version данные не затираем: текущая версия работает с временным
  // in-memory состоянием, запись в этот ключ заблокирована.
  if (isWriteBlockedForKey(progressCodec.key)) {
    return;
  }
  reportWriteResult(writeStore(progressCodec, progress));
}

export const $appProgress = atom<AppProgress>(createDefaultProgress());

export function hydrateProgressFromStorage() {
  const result = readStore(progressCodec);
  reportReadResult(progressCodec.key, result);
  if (!result.ok) {
    return;
  }

  $appProgress.set(result.value);
  if (result.migrated) {
    // Смигрированное состояние сразу пишем обратно уже в текущем формате.
    saveProgress(result.value);
  }
}

function pendingMistakeKey(sessionId: string, taskId: string) {
  return `${sessionId}::${taskId}`;
}

function clearResolvedPendingForSkill(
  pendingMistakes: Record<string, PendingMistake>,
  topicId: TopicId,
  answer: AnswerRecord,
  weakTraps: Record<string, number>,
  weakTrapLastSeenAt: Record<string, string>,
) {
  if (!answer.isCorrect || answer.attempt !== 1 || !answer.blueprint) return;

  for (const [key, pending] of Object.entries(pendingMistakes)) {
    if (pending.topicId === topicId && pending.blueprint === answer.blueprint) {
      const trapKey = `${pending.blueprint}:${pending.misconception}`;
      weakTraps[trapKey] = (weakTraps[trapKey] ?? 0) + 1;
      weakTrapLastSeenAt[trapKey] = pending.recordedAt;
      delete pendingMistakes[key];
    }
  }
}

export function recordMistakeImmediately({
  sessionId,
  topicId,
  answer,
  resumeHref,
}: {
  sessionId: string;
  topicId?: TopicId;
  answer: AnswerRecord;
  resumeHref?: string;
}) {
  if ((answer.isCorrect && answer.attempt === 1) || !sessionId) {
    return false;
  }

  const resolvedTopicId = topicId ?? topicIdForBlueprint(answer.blueprint);
  const misconception = answer.selectedMisconception || answer.taskTrap;
  if (!resolvedTopicId || !answer.blueprint || !misconception) {
    return false;
  }

  const current = $appProgress.get();
  const key = pendingMistakeKey(sessionId, answer.taskId);
  const normalizedResumeHref = normalizeResumeHref(resumeHref);
  const existingPending = current.pendingMistakes[key];
  if (existingPending?.resumeHref || !normalizedResumeHref) {
    return false;
  }

  const nextProgress: AppProgress = {
    ...current,
    pendingMistakes: {
      ...current.pendingMistakes,
      [key]: existingPending
        ? { ...existingPending, resumeHref: normalizedResumeHref }
        : {
            sessionId,
            taskId: answer.taskId,
            topicId: resolvedTopicId,
            blueprint: answer.blueprint,
            misconception,
            recordedAt: new Date().toISOString(),
            resumeHref: normalizedResumeHref,
          },
    },
  };

  $appProgress.set(nextProgress);
  saveProgress(nextProgress);
  return true;
}

export function recordCompletedSession({
  topicId,
  score,
  total,
  answers,
  sessionId,
  evidenceMode = "guided",
  completedAt,
}: CompletedSessionInput) {
  const current = $appProgress.get();
  const existing = current.topics[topicId] ?? createEmptyTopicProgress();
  const weakTraps = { ...existing.weakTraps };
  const weakTrapLastSeenAt = { ...existing.weakTrapLastSeenAt };
  const skillEvidence = { ...existing.skillEvidence };
  const pendingMistakes = { ...current.pendingMistakes };
  const solvedCount = normalizeCount(total);
  const correctCount = Math.min(normalizeCount(score), solvedCount);
  const practicedAt = completedAt ?? new Date().toISOString();

  for (const answer of answers) {
    const misconception = answer.selectedMisconception || answer.taskTrap;

    if ((!answer.isCorrect || answer.attempt > 1) && answer.blueprint && misconception) {
      const trapKey = `${answer.blueprint}:${misconception}`;
      weakTraps[trapKey] = (weakTraps[trapKey] || 0) + 1;
      weakTrapLastSeenAt[trapKey] = practicedAt;
      if (sessionId) {
        delete pendingMistakes[pendingMistakeKey(sessionId, answer.taskId)];
      }
    }

    clearResolvedPendingForSkill(
      pendingMistakes,
      topicId,
      answer,
      weakTraps,
      weakTrapLastSeenAt,
    );

    if (
      evidenceMode === "transfer" &&
      answer.isCorrect &&
      answer.attempt === 1 &&
      answer.blueprint
    ) {
      const previous = skillEvidence[answer.blueprint];
      const elapsed = previous
        ? Date.parse(practicedAt) - Date.parse(previous.transferPassedAt)
        : 0;

      if (!previous) {
        skillEvidence[answer.blueprint] = {
          transferPassedAt: practicedAt,
          delayedRecallPassedAt: null,
        };
      } else if (
        !previous.delayedRecallPassedAt &&
        Number.isFinite(elapsed) &&
        elapsed >= DELAYED_RECALL_MIN_MS
      ) {
        skillEvidence[answer.blueprint] = {
          ...previous,
          delayedRecallPassedAt: practicedAt,
        };
      }
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
        skillEvidence,
        lastPracticedAt: practicedAt,
      },
    },
    pendingMistakes,
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

// Смешанная сессия пополняет статистику решённых задач и слабые места каждой
// затронутой темы, но не считается отдельной тренировкой одной темы.
// Это общее поведение для стартовой диагностики и открытой части ЦТ/ЦЭ.
export function recordCrossTopicSession(answers: AnswerRecord[], sessionId?: string) {
  const current = $appProgress.get();
  const nextTopics = { ...current.topics };
  const pendingMistakes = { ...current.pendingMistakes };
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

    if ((!answer.isCorrect || answer.attempt > 1) && answer.blueprint && misconception) {
      const trapKey = `${answer.blueprint}:${misconception}`;
      weakTraps[trapKey] = (weakTraps[trapKey] || 0) + 1;
      weakTrapLastSeenAt[trapKey] = practicedAt;
      if (sessionId) {
        delete pendingMistakes[pendingMistakeKey(sessionId, answer.taskId)];
      }
    }


    clearResolvedPendingForSkill(
      pendingMistakes,
      topicId,
      answer,
      weakTraps,
      weakTrapLastSeenAt,
    );

    nextTopics[topicId] = {
      ...existing,
      solved: existing.solved + 1,
      // Исправленный после подсказки ответ остаётся полезной коррекцией, но
      // не считается самостоятельным first-try success в диагностике.
      correct: existing.correct + (answer.isCorrect && answer.attempt === 1 ? 1 : 0),
      weakTraps,
      weakTrapLastSeenAt,
      lastPracticedAt: practicedAt,
    };
  }

  const nextProgress: AppProgress = {
    version: PROGRESS_VERSION,
    topics: nextTopics,
    pendingMistakes,
  };

  $appProgress.set(nextProgress);
  saveProgress(nextProgress);
  logPracticeDay();
}

// Сохраняем публичное имя для существующих импортов и файлов переноса.
export const recordExamSession = recordCrossTopicSession;

export function combineWeakTraps(progress: AppProgress): Record<string, number> {
  const combined: Record<string, number> = {};

  for (const topic of topics) {
    const weakTraps = progress.topics[topic.id]?.weakTraps ?? {};
    for (const [key, count] of Object.entries(weakTraps)) {
      combined[key] = (combined[key] ?? 0) + count;
    }
  }

  for (const pending of Object.values(progress.pendingMistakes)) {
    const key = `${pending.blueprint}:${pending.misconception}`;
    combined[key] = (combined[key] ?? 0) + 1;
  }

  return combined;
}

export function combineWeakTrapLastSeenAt(progress: AppProgress): Record<string, string> {
  const combined: Record<string, string> = {};

  for (const topic of topics) {
    Object.assign(combined, progress.topics[topic.id]?.weakTrapLastSeenAt ?? {});
  }

  for (const pending of Object.values(progress.pendingMistakes)) {
    const key = `${pending.blueprint}:${pending.misconception}`;
    const previous = combined[key];
    if (!previous || pending.recordedAt > previous) {
      combined[key] = pending.recordedAt;
    }
  }

  return combined;
}

export function resetProgress() {
  allowWriteForKey(progressCodec.key);
  const progress = createDefaultProgress();
  $appProgress.set(progress);
  clearStore(progressCodec);
}

export function getTopicProgress(topicId: TopicId) {
  return $appProgress.get().topics[topicId] ?? createEmptyTopicProgress();
}
