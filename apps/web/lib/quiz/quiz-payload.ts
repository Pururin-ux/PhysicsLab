// Pure runtime-валидатор клиентского контракта /api/tasks. Не решает физику
// заново — проверяет форму данных, чтобы malformed payload превращался в
// восстановимую ошибку, а не в падение рендера. Без внешних зависимостей;
// импортирует только типы (стираются при компиляции).

import type {
  NumericInputQuizTask,
  QuizTask,
  SingleChoiceQuizTask,
} from "../../components/quiz/quiz-session-store";

export type QuizPayloadIssue = {
  code:
    | "not_object"
    | "tasks_missing"
    | "tasks_empty"
    | "count_mismatch"
    | "task_invalid"
    | "duplicate_ids";
  // Техническая деталь для dev-логов; пользователю не показывается.
  detail: string;
};

export type QuizPayloadResult =
  | { ok: true; tasks: QuizTask[] }
  | { ok: false; issue: QuizPayloadIssue };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isDifficulty(value: unknown): value is 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3;
}

function hasValidCoachLines(value: unknown): boolean {
  return (
    isRecord(value) &&
    isNonEmptyString(value.correct) &&
    isNonEmptyString(value.wrong) &&
    typeof value.hint === "string"
  );
}

// Диаграмма/график: проверяем только discriminant и наличие spec —
// глубокая геометрия проверяется генератором на сервере.
function hasValidVisuals(task: Record<string, unknown>): boolean {
  const { graph, diagram } = task;

  if (graph !== undefined && graph !== null) {
    if (!isRecord(graph)) return false;
    if (!["vt", "xt", "at"].includes(graph.type as string)) return false;
    if (!Array.isArray(graph.series)) return false;
  }

  if (diagram !== undefined && diagram !== null) {
    if (!isRecord(diagram)) return false;
    if (!["vector", "circuit", "optics"].includes(diagram.kind as string)) return false;
    if (!isRecord(diagram.spec)) return false;
  }

  return true;
}

function validateSharedFields(task: Record<string, unknown>): string | null {
  if (!isNonEmptyString(task.id)) return "id";
  if (!isNonEmptyString(task.blueprint)) return "blueprint";
  if (!isNonEmptyString(task.topic)) return "topic";
  if (!isNonEmptyString(task.text)) return "text";
  if (!isNonEmptyString(task.formula)) return "formula";
  if (!isDifficulty(task.difficulty)) return "difficulty";
  if (!isNonEmptyString(task.explanation)) return "explanation";
  if (!hasValidCoachLines(task.coach_lines)) return "coach_lines";
  if (!hasValidVisuals(task)) return "graph/diagram";
  return null;
}

function validateSingleChoice(task: Record<string, unknown>): string | null {
  // Числовой answer-объект вместо options — перепутанный формат.
  if (isRecord(task.answer)) return "answer: object in single_choice";
  if (!isNonEmptyString(task.answer)) return "answer";
  if (!Array.isArray(task.options)) return "options";
  if (task.options.length !== 4) return `options.length=${task.options.length}`;

  const ids = new Set<string>();
  const values = new Set<number>();
  let correctCount = 0;

  for (const option of task.options) {
    if (!isRecord(option)) return "option: not object";
    if (!isNonEmptyString(option.id)) return "option.id";
    if (!isNonEmptyString(option.text)) return "option.text";
    if (option.misconception !== undefined && typeof option.misconception !== "string") {
      return "option.misconception";
    }
    if (ids.has(option.id)) return `option.id duplicate: ${option.id}`;
    ids.add(option.id);
    if (!isFiniteNumber(option.value)) return "option.value";
    if (values.has(option.value)) return `option.value duplicate: ${option.value}`;
    values.add(option.value);
    if (option.correct === true) correctCount += 1;
  }

  if (correctCount !== 1) return `correct options: ${correctCount}`;
  if (!ids.has(task.answer)) return "answer not among options";
  return null;
}

function validateNumeric(task: Record<string, unknown>): string | null {
  if (Array.isArray(task.options)) return "options present in numeric_input";
  if (!isRecord(task.answer)) return "answer";

  const answer = task.answer;
  if (!isFiniteNumber(answer.value)) return "answer.value";
  if (typeof answer.unit !== "string") return "answer.unit";
  if (
    !isFiniteNumber(answer.decimals) ||
    !Number.isInteger(answer.decimals) ||
    answer.decimals < 0 ||
    answer.decimals > 3
  ) {
    return "answer.decimals";
  }
  if (!isFiniteNumber(answer.tolerance) || answer.tolerance < 0) return "answer.tolerance";
  if (!["positive", "magnitude", "signed"].includes(answer.sign as string)) {
    return "answer.sign";
  }

  if (!Array.isArray(task.misconceptions)) return "misconceptions";
  for (const misconception of task.misconceptions) {
    if (!isRecord(misconception)) return "misconception: not object";
    if (!isFiniteNumber(misconception.value)) return "misconception.value";
    if (!isNonEmptyString(misconception.label)) return "misconception.label";
  }

  return null;
}

function validateTask(value: unknown, index: number): string | null {
  if (!isRecord(value)) return `task[${index}]: not object`;

  const shared = validateSharedFields(value);
  if (shared) return `task[${index}].${shared}`;

  if (value.type === "single_choice") {
    const issue = validateSingleChoice(value);
    return issue ? `task[${index}] (${String(value.id)}): ${issue}` : null;
  }

  if (value.type === "numeric_input") {
    const issue = validateNumeric(value);
    return issue ? `task[${index}] (${String(value.id)}): ${issue}` : null;
  }

  return `task[${index}].type: ${String(value.type)}`;
}

export function parseQuizTasksPayload(
  payload: unknown,
  options: { expectedCount?: number } = {},
): QuizPayloadResult {
  if (!isRecord(payload)) {
    return { ok: false, issue: { code: "not_object", detail: typeof payload } };
  }

  const { tasks } = payload;
  if (!Array.isArray(tasks)) {
    return { ok: false, issue: { code: "tasks_missing", detail: typeof tasks } };
  }

  if (tasks.length === 0) {
    return { ok: false, issue: { code: "tasks_empty", detail: "0 tasks" } };
  }

  if (options.expectedCount !== undefined && tasks.length !== options.expectedCount) {
    return {
      ok: false,
      issue: {
        code: "count_mismatch",
        detail: `expected ${options.expectedCount}, got ${tasks.length}`,
      },
    };
  }

  const ids = new Set<string>();
  for (const [index, task] of tasks.entries()) {
    const issue = validateTask(task, index);
    if (issue) {
      return { ok: false, issue: { code: "task_invalid", detail: issue } };
    }

    const id = (task as { id: string }).id;
    if (ids.has(id)) {
      return { ok: false, issue: { code: "duplicate_ids", detail: id } };
    }
    ids.add(id);
  }

  return { ok: true, tasks: tasks as QuizTask[] };
}
