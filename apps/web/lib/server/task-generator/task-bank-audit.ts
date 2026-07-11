import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  blueprints,
  enumerateBlueprintParams,
  generateTasks,
  getCandidateParams,
  getDifficultyCounts,
  templateRegistry,
  type TemplateId,
} from "./generate.ts";
import { decimalPlaces } from "./difficulty.ts";
import { GET } from "../../../app/api/tasks/route.ts";

export interface FamilyAudit {
  id: TemplateId;
  group: string;
  format: string;
  raw: number;
  valid: number;
  rejectionRate: number;
  variants: number;
  texts: number;
  answers: number;
  optionSets: number;
  precision: Record<string, number>;
  answerMin: number;
  answerMax: number;
  maxTextFrequency: number;
  maxAnswerFrequency: number;
  misconceptions: number;
  duplicateOptions: number;
  difficulties: Record<string, number>;
  generationMs: number;
}

export interface SessionAudit {
  template: string;
  batches: number;
  duplicateTextSessions: number;
  maxAdjacentTextOverlap: number;
  coveredFamilies: number;
  difficultyCounts: Record<string, number>;
  formatCounts: Record<string, number>;
}

function maxFrequency(values: readonly string[]): number {
  const frequencies = new Map<string, number>();
  for (const value of values) frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  return Math.max(0, ...frequencies.values());
}

export function auditFamily(id: TemplateId): FamilyAudit {
  const started = performance.now();
  const blueprint = blueprints[id];
  const raw = enumerateBlueprintParams(blueprint).length;
  const valid = getCandidateParams(id).length;
  const sampleCount = Math.max(5000, valid);
  const tasks = generateTasks(id, sampleCount);
  const answers = tasks.map((task) => task.answerValue);
  const precision: Record<string, number> = { integer: 0, d1: 0, d2: 0, d3: 0 };
  let duplicateOptions = 0;
  for (const task of tasks) {
    const places = Math.min(3, decimalPlaces(task.answerValue));
    precision[places === 0 ? "integer" : `d${places}`] += 1;
    if (new Set(task.options.map((option) => option.value)).size !== task.options.length) {
      duplicateOptions += 1;
    }
  }

  return {
    id,
    group: blueprint.group,
    format: blueprint.answerFormat ?? "single_choice",
    raw,
    valid,
    rejectionRate: raw === 0 ? 0 : Number(((raw - valid) / raw).toFixed(4)),
    variants: blueprint.variantCount ?? 1,
    texts: new Set(tasks.map((task) => task.text)).size,
    answers: new Set(answers).size,
    optionSets: new Set(tasks.map((task) => task.options.map((option) => option.text).join("|"))).size,
    precision,
    answerMin: Math.min(...answers),
    answerMax: Math.max(...answers),
    maxTextFrequency: maxFrequency(tasks.map((task) => task.text)),
    maxAnswerFrequency: maxFrequency(answers.map(String)),
    misconceptions: new Set(tasks.flatMap((task) => task.options.flatMap((option) => option.misconception ?? []))).size,
    duplicateOptions,
    difficulties: getDifficultyCounts(id),
    generationMs: Number((performance.now() - started).toFixed(2)),
  };
}

export function auditTaskBank(): FamilyAudit[] {
  return templateRegistry.map((entry) => auditFamily(entry.id));
}

export async function auditSessions(): Promise<SessionAudit[]> {
  const templates = ["mixed", "dynamics-mixed", "electro-mixed", "thermo-mixed", "optics-mixed", "exam"];
  return Promise.all(templates.map(async (template) => {
    let previousTexts = new Set<string>();
    let maxAdjacentTextOverlap = 0;
    let duplicateTextSessions = 0;
    const families = new Set<string>();
    const difficultyCounts: Record<string, number> = { 1: 0, 2: 0, 3: 0 };
    const formatCounts: Record<string, number> = { single_choice: 0, numeric_input: 0 };
    for (let batch = 0; batch < 50; batch += 1) {
      const response = await GET(new Request(
        `http://localhost/api/tasks?template=${template}&count=10&batch=${batch}`,
      ));
      if (!response.ok) throw new Error(`${template} batch ${batch} failed audit`);
      const tasks = (await response.json()).tasks as Array<{
        blueprint: string; text: string; difficulty: number; type: string;
      }>;
      const texts = new Set(tasks.map((task) => task.text));
      if (texts.size !== tasks.length) duplicateTextSessions += 1;
      if (previousTexts.size > 0) {
        const overlap = [...texts].filter((text) => previousTexts.has(text)).length / tasks.length;
        maxAdjacentTextOverlap = Math.max(maxAdjacentTextOverlap, overlap);
      }
      previousTexts = texts;
      for (const task of tasks) {
        families.add(task.blueprint);
        difficultyCounts[task.difficulty] = (difficultyCounts[task.difficulty] ?? 0) + 1;
        formatCounts[task.type] = (formatCounts[task.type] ?? 0) + 1;
      }
    }
    return {
      template,
      batches: 50,
      duplicateTextSessions,
      maxAdjacentTextOverlap: Number(maxAdjacentTextOverlap.toFixed(2)),
      coveredFamilies: families.size,
      difficultyCounts,
      formatCounts,
    };
  }));
}

function printTable(rows: FamilyAudit[]): void {
  console.table(rows.map((row) => ({
    id: row.id,
    group: row.group,
    format: row.format,
    raw: row.raw,
    valid: row.valid,
    reject: `${Math.round(row.rejectionRate * 100)}%`,
    texts: row.texts,
    answers: row.answers,
    difficulty: `${row.difficulties[1]}/${row.difficulties[2]}/${row.difficulties[3]}`,
    ms: row.generationMs,
  })));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rows = auditTaskBank();
  const sessions = await auditSessions();
  const hardFailures = rows.filter((row) => row.valid === 0 || row.duplicateOptions > 0);
  const jsonIndex = process.argv.indexOf("--json");
  if (jsonIndex >= 0) {
    const target = process.argv[jsonIndex + 1];
    if (!target) throw new Error("--json requires an output path");
    await writeFile(target, `${JSON.stringify({ families: rows, sessions }, null, 2)}\n`, "utf8");
  } else {
    printTable(rows);
    console.table(sessions);
  }
  if (hardFailures.length > 0 || sessions.some((row) => row.duplicateTextSessions > 0)) {
    process.exitCode = 1;
  }
}
