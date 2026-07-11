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
  const hardFailures = rows.filter((row) => row.valid === 0 || row.duplicateOptions > 0);
  const jsonIndex = process.argv.indexOf("--json");
  if (jsonIndex >= 0) {
    const target = process.argv[jsonIndex + 1];
    if (!target) throw new Error("--json requires an output path");
    await writeFile(target, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  } else {
    printTable(rows);
  }
  if (hardFailures.length > 0) process.exitCode = 1;
}
