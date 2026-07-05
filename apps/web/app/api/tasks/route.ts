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
// Пробный вариант: сначала кинематика, потом динамика — затем порядок перемешивается.
const examTemplates = [...kinematicsTemplates, ...dynamicsTemplates];
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
  const tasks = generateMixedTasks(examTemplates, "exam", count, batch);

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
  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const occurrence = Math.floor(index / templates.length);
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
