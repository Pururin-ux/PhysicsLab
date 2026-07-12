// Уникальный идентификатор ПОПЫТКИ прохождения сессии. Отличает две честные
// попытки одного и того же детерминированного набора задач (template+batch
// одинаковы, ученик решает второй раз) — идемпотентность записи прогресса
// строится вокруг попытки, а не вокруг набора задач.

export function newAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback без зависимостей: время + два случайных суффикса. Не
  // криптографический, но для идемпотентности маркеров этого достаточно.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function isValidAttemptId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 128;
}
