import katex from "katex";

interface RenderFormulaOptions {
  displayMode?: boolean;
}

export function renderFormulaToHtml(
  formula: string,
  { displayMode = false }: RenderFormulaOptions = {},
) {
  return katex.renderToString(formula, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: "htmlAndMathml",
  });
}

export function assertFormulaRenders(formula: string) {
  katex.renderToString(formula, {
    displayMode: true,
    throwOnError: true,
    strict: false,
  });
}
