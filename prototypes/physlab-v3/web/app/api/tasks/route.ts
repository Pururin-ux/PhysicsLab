import {
  generateTasks,
  getTemplateIdsByGroup,
  isTemplateId,
  templateRegistry,
  type TemplateId,
} from "../../../../tools/generator/generate.ts";
import type { GeneratedTask } from "../../../../tools/generator/types.ts";

export const dynamic = "force-dynamic";

const kinematicsTemplates = getTemplateIdsByGroup("kinematics");
const dynamicsTemplates = getTemplateIdsByGroup("dynamics");
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
    options: task.options.map((option) => ({
      id: option.id,
      text: withUnit(option.text, unit),
      value: option.value,
      correct: option.id === task.answer,
    })),
    explanation: task.explanation ?? task.coach_lines.correct,
    explanation_latex: `${task.formula},\\quad ${task.answerValue}\\text{ ${unit}}`,
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
