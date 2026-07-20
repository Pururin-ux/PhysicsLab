import {
  generateTasks,
  getBlueprint,
  getTemplateIdsByGroup,
  supportsDifficulty,
  isTemplateId,
  templateRegistry,
  type TemplateId,
} from "../../../lib/server/task-generator/generate.ts";
import type { Difficulty, GeneratedTask } from "../../../lib/server/task-generator/types.ts";
import { formatMathValue } from "../../../lib/server/task-generator/validator.ts";
import {
  decimalsOf,
  toleranceFor,
} from "../../../lib/answer/numeric-answer.ts";

export const dynamic = "force-dynamic";

const kinematicsTemplates = getTemplateIdsByGroup("kinematics");
const dynamicsTemplates = getTemplateIdsByGroup("dynamics");
const electrodynamicsTemplates = getTemplateIdsByGroup("electrodynamics");
const thermodynamicsTemplates = getTemplateIdsByGroup("thermodynamics");
const opticsTemplates = getTemplateIdsByGroup("optics");
// Смешанная тренировка — сбалансированное покрытие пяти открытых разделов
// поровну (это учебный микс, а не официальный вариант ЦТ/ЦЭ). Слоты
// раздаются по кругу групп: для count=10 каждая группа получает ровно 2
// задачи, для других count распределение отличается не более чем на 1.
const examGroups: readonly (readonly TemplateId[])[] = [
  kinematicsTemplates,
  dynamicsTemplates,
  electrodynamicsTemplates,
  thermodynamicsTemplates,
  opticsTemplates,
];
const difficultyPattern: readonly Difficulty[] = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3];

function difficultyForSlot(slot: number, batch: number): Difficulty {
  return difficultyPattern[(slot + batch * 3) % difficultyPattern.length];
}

// Порядок деградации, если в группе нет шаблона запрошенной сложности:
// сначала соседняя ступень вниз, потом вверх. Сессия не должна падать в 500
// из-за эволюции банка (так случилось, когда средняя скорость перешла на
// целые ответы и у кинематики исчезла «сложность 3»).
const difficultyFallback: Record<Difficulty, readonly Difficulty[]> = {
  1: [1, 2, 3],
  2: [2, 1, 3],
  3: [3, 2, 1],
};

function templateForDifficulty(
  templates: readonly TemplateId[],
  difficulty: Difficulty,
  offset: number,
): TemplateId {
  for (const candidateDifficulty of difficultyFallback[difficulty]) {
    const supported = templates.filter((template) =>
      supportsDifficulty(template, candidateDifficulty),
    );
    if (supported.length === 0) {
      continue;
    }
    const native = supported.filter(
      (template) => getBlueprint(template).difficulty === candidateDifficulty,
    );
    const candidates = native.length > 0 ? native : supported;
    return candidates[offset % candidates.length];
  }

  throw new Error(`No template in group supports any difficulty near ${difficulty}.`);
}

// Для выбранного шаблона возвращает ближайшую поддерживаемую сложность по
// той же лестнице деградации, что и выбор шаблона.
function resolveDifficultyFor(template: TemplateId, difficulty: Difficulty): Difficulty {
  for (const candidateDifficulty of difficultyFallback[difficulty]) {
    if (supportsDifficulty(template, candidateDifficulty)) {
      return candidateDifficulty;
    }
  }
  return difficulty;
}

// Разные batch смещают выбор внутри группы, чтобы новые варианты
// тренировали разные навыки, а не одну и ту же пятёрку шаблонов.
function buildExamMix(count: number, batch: number): TemplateId[] {
  const mix: TemplateId[] = [];

  // Точное распределение без независимого округления долей: слот i идёт
  // группе i mod 5 — ни лишних слотов, ни выпавшей последней группы.
  for (let slot = 0; slot < count; slot += 1) {
    const templates = examGroups[slot % examGroups.length];
    const withinGroup = Math.floor(slot / examGroups.length);
    const difficulty = difficultyForSlot(slot, batch);
    mix.push(templateForDifficulty(templates, difficulty, batch + withinGroup));
  }

  return mix;
}

function buildTopicMix(templates: readonly TemplateId[], count: number, batch: number): TemplateId[] {
  if (count !== 10) {
    return Array.from({ length: count }, (_, slot) => templates[(batch + slot) % templates.length]);
  }
  const occurrences: Record<Difficulty, number> = { 1: 0, 2: 0, 3: 0 };
  return Array.from({ length: count }, (_, slot) => {
    const difficulty = difficultyForSlot(slot, batch);
    const occurrence = occurrences[difficulty]++;
    return templateForDifficulty(templates, difficulty, batch + occurrence);
  });
}
const supportedTemplates = templateRegistry.map((entry) => entry.id);

function normalizeCount(value: string | null) {
  const parsed = Number.parseInt(value ?? "10", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 10;
  }

  return Math.min(parsed, 20);
}

function normalizeBatch(value: string | null) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }

  return Date.now();
}

function normalizeDifficulty(value: string | null): Difficulty | undefined | null {
  if (value === null) return undefined;
  const parsed = Number(value);
  return parsed === 1 || parsed === 2 || parsed === 3 ? parsed : null;
}

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

// Безразмерные ответы (unit === "") не получают хвостового пробела.
function withUnit(value: string, unit: string) {
  return unit ? `${value} ${unit}` : value;
}

function toQuizTask(task: GeneratedTask) {
  const unit = task.answerUnit;
  const shared = {
    graph: task.graph ?? null,
    diagram: task.diagram ?? null,
    explanation: task.explanation ?? task.coach_lines.correct,
    explanation_latex: unit
      ? `${task.formula},\\quad ${formatMathValue(task.answerValue)}\\text{ ${unit}}`
      : `${task.formula},\\quad ${formatMathValue(task.answerValue)}`,
    coach_lines: {
      correct: task.coach_lines.correct,
      wrong: task.coach_lines.wrong,
      hint: task.trap,
    },
  };

  if (task.answerFormat === "numeric_input") {
    // Числовой формат: не отдаём клиенту варианты и не кладём answerValue в
    // верхнеуровневое поле. Спецификация ответа (value/допуск) нужна клиенту
    // для проверки — проверка идёт на клиенте, как и correct-флаги у
    // single_choice. Значения дистракторов идут отдельным списком: по ним
    // после submit подбирается реальный misconception, они не рендерятся до
    // ответа. options/answer/answerValue из ответа исключаем.
    const { options, answer, answerValue, ...rest } = task;
    const blueprint = getBlueprint(task.blueprint);

    return {
      ...rest,
      ...shared,
      type: "numeric_input" as const,
      answer: {
        value: answerValue,
        unit,
        decimals: decimalsOf(answerValue),
        tolerance: toleranceFor(answerValue),
        sign: blueprint.answerKind ?? "positive",
      },
      misconceptions: options
        .filter((option) => option.id !== answer && option.misconception)
        .map((option) => ({ value: option.value, label: option.misconception as string })),
    };
  }

  return {
    ...task,
    ...shared,
    type: "single_choice" as const,
    options: task.options.map((option) => ({
      id: option.id,
      text: withUnit(option.text, unit),
      value: option.value,
      correct: option.id === task.answer,
      misconception: option.misconception,
    })),
  };
}

function generateRandomizedTasks(
  template: TemplateId,
  count: number,
  batch: number,
  difficulty?: Difficulty,
) {
  const baseOffset = hashSeed(`direct:${template}`) % 97;
  const offset = baseOffset + batch * count;

  return generateTasks(template, count, { offset, difficulty });
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const shuffled = [...items];
  let state = seed >>> 0;

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (1664525 * state + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function generateExamTasks(count: number, batch: number) {
  const tasks = generateMixedTasks(buildExamMix(count, batch), "exam", count, batch, true);

  // На экзамене навыки не идут блоками по темам — порядок задач перемешан,
  // но детерминирован для одного и того же batch.
  return seededShuffle(tasks, hashSeed(`exam-order:${batch}`));
}

function generateMixedTasks(
  templates: readonly TemplateId[],
  groupId: string,
  count: number,
  batch: number,
  balancedDifficulty = false,
) {
  // Счётчик вхождений вместо floor(index/length): exam-микс может содержать
  // один шаблон дважды, и повторное вхождение обязано получить другой offset,
  // иначе в вариант попадут две одинаковые задачи.
  const occurrences = new Map<TemplateId, number>();

  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const occurrence = occurrences.get(template) ?? 0;
    occurrences.set(template, occurrence + 1);
    const baseOffset = hashSeed(`${groupId}:${template}`) % 97;
    const offset = baseOffset + batch * count + occurrence;
    const difficulty = balancedDifficulty
      ? resolveDifficultyFor(template, difficultyForSlot(index, batch))
      : undefined;
    const task = generateTasks(template, 1, { offset, difficulty })[0];

    if (!task) {
      throw new Error(`Template "${template}" produced no task.`);
    }

    return {
      ...task,
      id: `${groupId}-${index + 1}-${task.id}`,
    };
  });
}

// Стабильный error envelope: { error, code, retryable }. Поле error остаётся
// для обратной совместимости с существующими потребителями/тестами.
// Cache-Control: no-store — задачи не должны кэшироваться промежуточными
// прокси (batch задаёт детерминизм явно).
const JSON_HEADERS = { "Cache-Control": "no-store" } as const;

function jsonError(
  status: number,
  code: string,
  message: string,
  retryable: boolean,
): Response {
  return Response.json(
    { error: message, code, retryable },
    { status, headers: JSON_HEADERS },
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") ?? "free-fall";
  const count = normalizeCount(searchParams.get("count"));
  const batch = normalizeBatch(searchParams.get("batch"));
  const difficulty = normalizeDifficulty(searchParams.get("difficulty"));

  if (difficulty === null) {
    return jsonError(400, "INVALID_DIFFICULTY", "Difficulty must be 1, 2 or 3.", false);
  }
  if (difficulty && isTemplateId(template) && !supportsDifficulty(template, difficulty)) {
    return jsonError(
      400,
      "UNSUPPORTED_DIFFICULTY",
      `Template does not support difficulty ${difficulty}.`,
      false,
    );
  }

  try {
    const generatedTasks =
      template === "mixed"
        ? generateMixedTasks(buildTopicMix(kinematicsTemplates, count, batch), "mixed", count, batch, count === 10)
        : template === "dynamics-mixed"
          ? generateMixedTasks(buildTopicMix(dynamicsTemplates, count, batch), "dynamics-mixed", count, batch, count === 10)
        : template === "electro-mixed"
          ? generateMixedTasks(buildTopicMix(electrodynamicsTemplates, count, batch), "electro-mixed", count, batch, count === 10)
        : template === "thermo-mixed"
          ? generateMixedTasks(buildTopicMix(thermodynamicsTemplates, count, batch), "thermo-mixed", count, batch, count === 10)
        : template === "optics-mixed"
          ? generateMixedTasks(buildTopicMix(opticsTemplates, count, batch), "optics-mixed", count, batch, count === 10)
        : template === "exam"
          ? generateExamTasks(count, batch)
        : isTemplateId(template)
          ? generateRandomizedTasks(template, count, batch, difficulty ?? undefined)
          : null;

    if (!generatedTasks) {
      return jsonError(
        400,
        "UNKNOWN_TEMPLATE",
        `Unknown template "${template}". Available templates: ${[
          ...supportedTemplates,
          "mixed",
          "dynamics-mixed",
          "electro-mixed",
          "thermo-mixed",
          "optics-mixed",
          "exam",
        ].join(", ")}.`,
        false,
      );
    }

    // Guard целостности: пустой результат или дубли id — внутренний сбой,
    // который не должен уходить клиенту как success.
    if (generatedTasks.length === 0) {
      return jsonError(500, "EMPTY_GENERATION", "Task generation failed.", true);
    }
    const ids = new Set(generatedTasks.map((task) => task.id));
    if (ids.size !== generatedTasks.length) {
      return jsonError(500, "DUPLICATE_TASK_IDS", "Task generation failed.", true);
    }

    return Response.json(
      { tasks: generatedTasks.map(toQuizTask) },
      { headers: JSON_HEADERS },
    );
  } catch (error) {
    // Внутренние сообщения (пути, имена шаблонов, стеки) наружу не уходят.
    if (process.env.NODE_ENV !== "production") {
      console.error("[api/tasks]", error);
    }
    return jsonError(500, "TASK_GENERATION_FAILED", "Task generation failed.", true);
  }
}
