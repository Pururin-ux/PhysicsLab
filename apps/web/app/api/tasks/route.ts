import {
  generateTasks,
  getBlueprint,
  getTemplateIdsByGroup,
  isTemplateId,
  templateRegistry,
  type TemplateId,
} from "../../../lib/server/task-generator/generate.ts";
import type { GeneratedTask } from "../../../lib/server/task-generator/types.ts";
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

// Разные batch смещают выбор внутри группы, чтобы новые варианты
// тренировали разные навыки, а не одну и ту же пятёрку шаблонов.
function buildExamMix(count: number, batch: number): TemplateId[] {
  const mix: TemplateId[] = [];

  // Точное распределение без независимого округления долей: слот i идёт
  // группе i mod 5 — ни лишних слотов, ни выпавшей последней группы.
  for (let slot = 0; slot < count; slot += 1) {
    const templates = examGroups[slot % examGroups.length];
    const withinGroup = Math.floor(slot / examGroups.length);
    mix.push(templates[(batch + withinGroup) % templates.length]);
  }

  return mix;
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

function generateRandomizedTasks(template: TemplateId, count: number, batch: number) {
  const baseOffset = hashSeed(`direct:${template}`) % 97;
  const offset = baseOffset + batch * count;

  return generateTasks(template, count, { offset });
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
  const tasks = generateMixedTasks(buildExamMix(count, batch), "exam", count, batch);

  // На экзамене навыки не идут блоками по темам — порядок задач перемешан,
  // но детерминирован для одного и того же batch.
  return seededShuffle(tasks, hashSeed(`exam-order:${batch}`));
}

function generateMixedTasks(
  templates: readonly TemplateId[],
  groupId: string,
  count: number,
  batch: number,
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
    const task = generateTasks(template, 1, { offset })[0];

    if (!task) {
      throw new Error(`Template "${template}" produced no task.`);
    }

    return {
      ...task,
      id: `${groupId}-${index + 1}-${task.id}`,
    };
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get("template") ?? "free-fall";
  const count = normalizeCount(searchParams.get("count"));
  const batch = normalizeBatch(searchParams.get("batch"));

  try {
    const generatedTasks =
      template === "mixed"
        ? generateMixedTasks(kinematicsTemplates, "mixed", count, batch)
        : template === "dynamics-mixed"
          ? generateMixedTasks(dynamicsTemplates, "dynamics-mixed", count, batch)
        : template === "electro-mixed"
          ? generateMixedTasks(electrodynamicsTemplates, "electro-mixed", count, batch)
        : template === "thermo-mixed"
          ? generateMixedTasks(thermodynamicsTemplates, "thermo-mixed", count, batch)
        : template === "optics-mixed"
          ? generateMixedTasks(opticsTemplates, "optics-mixed", count, batch)
        : template === "exam"
          ? generateExamTasks(count, batch)
        : isTemplateId(template)
          ? generateRandomizedTasks(template, count, batch)
          : null;

    if (!generatedTasks) {
      return Response.json(
        {
          error: `Unknown template "${template}". Available templates: ${[
            ...supportedTemplates,
            "mixed",
            "dynamics-mixed",
            "electro-mixed",
            "thermo-mixed",
            "optics-mixed",
            "exam",
          ].join(", ")}.`,
        },
        { status: 400 },
      );
    }

    return Response.json({ tasks: generatedTasks.map(toQuizTask) });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Task generation failed.",
      },
      { status: 400 },
    );
  }
}
