import {
  generateTasks,
  getTemplateIdsByGroup,
  isTemplateId,
  templateRegistry,
  type TemplateId,
} from "../../../lib/server/task-generator/generate.ts";
import type { GeneratedTask } from "../../../lib/server/task-generator/types.ts";
import { formatMathValue } from "../../../lib/server/task-generator/validator.ts";

export const dynamic = "force-dynamic";

const kinematicsTemplates = getTemplateIdsByGroup("kinematics");
const dynamicsTemplates = getTemplateIdsByGroup("dynamics");
const electrodynamicsTemplates = getTemplateIdsByGroup("electrodynamics");
const thermodynamicsTemplates = getTemplateIdsByGroup("thermodynamics");
// Пробный вариант собирается по пропорциям спецификации ЦТ-2026,
// нормированным на открытые разделы: механика ~33%, МКТ/термодинамика ~23%,
// электродинамика ~30% (оптика/квант/ядро пока не открыты). На 10 задач:
// 4 механики (2 кинематика + 2 динамика), 3 электродинамики, 3 термодинамики.
const examQuotas: { templates: readonly TemplateId[]; share: number }[] = [
  { templates: kinematicsTemplates, share: 0.2 },
  { templates: dynamicsTemplates, share: 0.2 },
  { templates: electrodynamicsTemplates, share: 0.3 },
  { templates: thermodynamicsTemplates, share: 0.3 },
];

// Разные batch смещают выбор внутри группы, чтобы новые варианты
// тренировали разные навыки, а не одну и ту же четвёрку шаблонов.
function buildExamMix(count: number, batch: number): TemplateId[] {
  const mix: TemplateId[] = [];

  for (const quota of examQuotas) {
    const slots = Math.round(count * quota.share);
    for (let slot = 0; slot < slots && mix.length < count; slot += 1) {
      mix.push(quota.templates[(batch + slot) % quota.templates.length]);
    }
  }

  // Округление долей может недодать задач — добираем по кругу групп.
  let groupIndex = 0;
  while (mix.length < count) {
    const templates = examQuotas[groupIndex % examQuotas.length].templates;
    mix.push(templates[(batch + mix.length) % templates.length]);
    groupIndex += 1;
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

function withUnit(value: string, unit: string) {
  return `${value} ${unit}`;
}

function toQuizTask(task: GeneratedTask) {
  const unit = task.answerUnit;

  return {
    ...task,
    type: "single_choice" as const,
    graph: task.graph ?? null,
    diagram: task.diagram ?? null,
    options: task.options.map((option) => ({
      id: option.id,
      text: withUnit(option.text, unit),
      value: option.value,
      correct: option.id === task.answer,
      misconception: option.misconception,
    })),
    explanation: task.explanation ?? task.coach_lines.correct,
    explanation_latex: `${task.formula},\\quad ${formatMathValue(task.answerValue)}\\text{ ${unit}}`,
    coach_lines: {
      correct: task.coach_lines.correct,
      wrong: task.coach_lines.wrong,
      hint: task.trap,
    },
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
