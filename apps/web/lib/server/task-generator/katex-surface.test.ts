import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { generateTasks, templateRegistry } from "./generate.ts";
import type { GeneratedTask } from "./types.ts";

// Формулы в тексте задачи, вариантах ответа и разборе ученик видит через
// KaTeX (QuestionCard и SolutionDisclosure рендерят $...$ как разметку).
// Тест следит, чтобы каждая формула, которая дойдёт до экрана, действительно
// разбиралась: иначе вместо формулы ученик видит исходник с долларами.
function mathFragments(value: string): string[] {
  return [...value.matchAll(/\$([^$]+)\$/g)].map((match) => match[1]);
}

function surfaces(task: GeneratedTask): [string, string][] {
  return [
    ["text", task.text],
    ["explanation", task.explanation ?? ""],
    ...task.options.map(
      (option) => ["option", option.text ?? ""] as [string, string],
    ),
  ];
}

const PER_TEMPLATE = 8;

test("every formula shown to a student is valid KaTeX", () => {
  let checked = 0;

  for (const template of templateRegistry) {
    const tasks = generateTasks(template.id, PER_TEMPLATE, { offset: 0 });

    for (const task of tasks) {
      for (const [field, value] of surfaces(task)) {
        for (const latex of mathFragments(value)) {
          checked += 1;
          assert.doesNotThrow(
            () =>
              katex.renderToString(latex, {
                throwOnError: true,
                strict: "ignore",
              }),
            `${template.id}: формула «${latex}» в поле ${field} не разбирается KaTeX`,
          );
          // Индекс из нескольких символов без фигурных скобок разбирается,
          // но рендерится неверно: $E_max$ даёт «E под m», дальше «ax».
          const badSubscript = latex.match(/_(?:[a-zA-Zа-яА-Я]|\\[a-zA-Z]+){2,}/);
          assert.equal(
            badSubscript,
            null,
            `${template.id}: в формуле «${latex}» индекс без фигурных скобок`,
          );
        }
      }
    }
  }

  assert.ok(checked > 100, `проверено формул: ${checked}`);
});

test("question texts and options use the Russian decimal comma", () => {
  for (const template of templateRegistry) {
    const tasks = generateTasks(template.id, PER_TEMPLATE, { offset: 0 });

    for (const task of tasks) {
      for (const [field, value] of surfaces(task)) {
        // Точка допустима только как разделитель тысяч или в конце предложения.
        const pointDecimal = value.match(/\b\d+\.\d/);
        assert.equal(
          pointDecimal,
          null,
          `${template.id}: «${pointDecimal?.[0]}» в поле ${field} — в русском тексте нужна запятая`,
        );
      }
    }
  }
});

test("answer options stay unique and contain the correct answer", () => {
  for (const template of templateRegistry) {
    const tasks = generateTasks(template.id, PER_TEMPLATE, { offset: 0 });

    for (const task of tasks) {
      const values = task.options.map((option) => option.text);
      assert.equal(
        new Set(values).size,
        values.length,
        `${template.id}: повторяющиеся варианты ответа: ${values.join(" | ")}`,
      );
      assert.ok(
        task.options.some((option) => option.id === task.answer),
        `${template.id}: правильного ответа ${task.answer} нет среди вариантов`,
      );
    }
  }
});
