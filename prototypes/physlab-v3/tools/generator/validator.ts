import katex from "katex";
import type {
  GeneratedTask,
  Params,
  TaskBlueprint,
  ValidationIssue,
  ValidationResult,
} from "./types.ts";

const formulaCache = new Map<string, ValidationIssue | null>();

function issue(code: string, message: string): ValidationIssue {
  return { code, message };
}

export function normalizeAnswerValue(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Number(value.toFixed(3));
}

export function formatAnswerValue(value: number): string {
  const normalized = normalizeAnswerValue(value);
  if (!Number.isFinite(normalized)) {
    return String(normalized);
  }

  return String(normalized).replace(".", ",");
}

function numbersEqual(left: number, right: number): boolean {
  return Math.abs(normalizeAnswerValue(left) - normalizeAnswerValue(right)) < 1e-9;
}

function validateFormula(formula: string): ValidationIssue | null {
  if (formulaCache.has(formula)) {
    return formulaCache.get(formula) ?? null;
  }

  try {
    katex.renderToString(formula, {
      displayMode: true,
      throwOnError: true,
      strict: false,
    });
    formulaCache.set(formula, null);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const validationIssue = issue("formula_katex", `KaTeX не разобрал формулу: ${message}`);
    formulaCache.set(formula, validationIssue);
    return validationIssue;
  }
}

function validatePhysicalRanges(params: Params): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (key.startsWith("__")) {
      continue;
    }

    if (!Number.isFinite(value)) {
      issues.push(issue("param_finite", `Параметр ${key} должен быть конечным числом.`));
      continue;
    }

    if (/^t\d*$/.test(key) && (value < 0 || value >= 30)) {
      issues.push(issue("time_range", `Время ${key}=${value} вне диапазона 0 <= t < 30 с.`));
    }

    if ((/^v\d*$/.test(key) || key === "dv") && Math.abs(value) >= 100) {
      issues.push(issue("velocity_range", `Скорость ${key}=${value} вне диапазона |v| < 100 м/с.`));
    }

    if (/^a\d*$/.test(key) && Math.abs(value) >= 50) {
      issues.push(issue("acceleration_range", `Ускорение ${key}=${value} вне диапазона |a| < 50 м/с².`));
    }
  }

  return issues;
}

export function validateGeneratedTask(
  task: GeneratedTask,
  blueprint: TaskBlueprint,
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const answer = normalizeAnswerValue(blueprint.solver(task.params));
  const distractors = blueprint.distractors.map((rule) => ({
    label: rule.label,
    value: normalizeAnswerValue(rule.compute(task.params)),
  }));

  issues.push(...validatePhysicalRanges(task.params));

  if (!Number.isFinite(answer)) {
    issues.push(issue("answer_finite", "Правильный ответ должен быть конечным числом."));
  }

  if (answer <= 0) {
    issues.push(issue("answer_positive", `Правильный ответ должен быть > 0, получено ${answer}.`));
  }

  for (const distractor of distractors) {
    if (!Number.isFinite(distractor.value)) {
      issues.push(
        issue("distractor_finite", `Дистрактор "${distractor.label}" вернул нечисловое значение.`),
      );
      continue;
    }

    if (numbersEqual(answer, distractor.value)) {
      issues.push(
        issue(
          "answer_equals_distractor",
          `Ответ ${answer} совпал с дистрактором "${distractor.label}".`,
        ),
      );
    }
  }

  if (task.options.length !== 4) {
    issues.push(issue("option_count", `Ожидалось 4 варианта, получено ${task.options.length}.`));
  }

  const optionValues = task.options.map((option) => normalizeAnswerValue(option.value));
  const uniqueOptionValues = new Set(optionValues);
  if (uniqueOptionValues.size !== task.options.length) {
    issues.push(issue("options_unique", "Все 4 варианта должны быть уникальными."));
  }

  if (!task.options.some((option) => option.id === task.answer && numbersEqual(option.value, answer))) {
    issues.push(issue("answer_option", "Поле answer должно указывать на вариант с правильным ответом."));
  }

  const formulaIssue = validateFormula(task.formula);
  if (formulaIssue) {
    issues.push(formulaIssue);
  }

  if (typeof task.text !== "string" || task.text.trim().length === 0) {
    issues.push(issue("text_string", "textTemplate должен вернуть непустую строку."));
  }

  if (task.text.includes("[object Object]")) {
    issues.push(issue("text_object", "textTemplate вернул строку с [object Object]."));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertValidGeneratedTask(task: GeneratedTask, blueprint: TaskBlueprint): void {
  const result = validateGeneratedTask(task, blueprint);
  if (!result.valid) {
    const details = result.issues.map((validationIssue) => validationIssue.message).join("\n");
    throw new Error(`Generated task ${task.id} is invalid:\n${details}`);
  }
}
