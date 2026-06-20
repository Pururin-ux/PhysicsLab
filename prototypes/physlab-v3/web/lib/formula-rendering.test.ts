import assert from "node:assert/strict";
import test from "node:test";
import {
  assertFormulaRenders,
  renderFormulaToHtml,
} from "./formula-rendering.ts";
import { FORMULAS } from "./physics/formulas.ts";

test("theory formulas render through the shared formula renderer", () => {
  for (const formula of Object.values(FORMULAS)) {
    assert.doesNotThrow(() => assertFormulaRenders(formula));
    assert.match(renderFormulaToHtml(formula), /katex/);
  }
});
