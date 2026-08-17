import assert from "node:assert/strict";
import test from "node:test";
import {
  assertFormulaRenders,
  renderFormulaToHtml,
} from "./formula-rendering.ts";
import { topicHelpSections } from "./learning/topic-help.ts";
import { formulaReference } from "./physics/formula-reference.ts";
import { FORMULAS } from "./physics/formulas.ts";
import {
  blueprints,
  generateTasks,
  templateRegistry,
} from "./server/task-generator/generate.ts";

type FormulaSample = {
  label: string;
  formula: string;
};

function inlineFormulas(label: string, text: string | undefined): FormulaSample[] {
  if (!text) return [];

  return Array.from(text.matchAll(/\$([^$]+)\$/g), (match, index) => ({
    label: `${label} inline formula ${index + 1}`,
    formula: match[1],
  }));
}

function authoredFormulaSamples(): FormulaSample[] {
  return [
    ...Object.entries(FORMULAS).map(([key, formula]) => ({
      label: `FORMULAS.${key}`,
      formula,
    })),
    ...formulaReference.flatMap((group) =>
      group.entries.flatMap((entry) => [
        { label: `formulaReference.${group.id}.${entry.id}`, formula: entry.formula },
        ...entry.symbols.map((symbol) => ({
          label: `formulaReference.${group.id}.${entry.id} symbol ${symbol.latex}`,
          formula: symbol.latex,
        })),
        ...inlineFormulas(
          `formulaReference.${group.id}.${entry.id} caption`,
          entry.caption,
        ),
        ...inlineFormulas(
          `formulaReference.${group.id}.${entry.id} limitation`,
          entry.limitation,
        ),
      ]),
    ),
    ...Object.entries(topicHelpSections).flatMap(([topicId, sections]) =>
      sections.flatMap((section) => [
        ...(section.formula
          ? [{ label: `topicHelp.${topicId}.${section.id}`, formula: section.formula }]
          : []),
        ...inlineFormulas(
          `topicHelp.${topicId}.${section.id} hint`,
          section.shortHint,
        ),
        ...inlineFormulas(
          `topicHelp.${topicId}.${section.id} mistake`,
          section.mistake,
        ),
      ]),
    ),
    ...Object.entries(blueprints).map(([templateId, blueprint]) => ({
      label: `blueprint.${templateId}`,
      formula: blueprint.formula,
    })),
  ];
}

function generatedInlineFormulaSamples(): FormulaSample[] {
  return templateRegistry.flatMap(({ id }) =>
    generateTasks(id, 5).flatMap((task) => [
      ...inlineFormulas(`${task.id} statement`, task.text),
      ...inlineFormulas(`${task.id} explanation`, task.explanation),
      ...inlineFormulas(`${task.id} trap`, task.trap),
      ...inlineFormulas(`${task.id} correct coach line`, task.coach_lines.correct),
      ...inlineFormulas(`${task.id} wrong coach line`, task.coach_lines.wrong),
    ]),
  );
}

test("theory formulas render through the shared formula renderer", () => {
  for (const formula of Object.values(FORMULAS)) {
    assert.doesNotThrow(() => assertFormulaRenders(formula));
    assert.match(renderFormulaToHtml(formula), /katex/);
  }
});

test("all authored and generated formula surfaces parse as KaTeX", () => {
  const samples = [...authoredFormulaSamples(), ...generatedInlineFormulaSamples()];

  for (const { label, formula } of samples) {
    assert.doesNotThrow(
      () => assertFormulaRenders(formula),
      `${label} failed to render: ${formula}`,
    );
    assert.doesNotMatch(
      renderFormulaToHtml(formula),
      /katex-error/,
      `${label} rendered an error node: ${formula}`,
    );
  }
});

test("shared formula renderer includes accessible MathML", () => {
  const html = renderFormulaToHtml("E_k=\\frac{mv^2}{2}");

  assert.match(html, /<math/);
  assert.match(html, /class="katex-mathml"/);
});
