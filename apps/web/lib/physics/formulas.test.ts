import assert from "node:assert/strict";
import test from "node:test";
import katex from "katex";
import { FORMULAS } from "./formulas.ts";

test("all physics formula constants render without KaTeX errors", () => {
  for (const [key, formula] of Object.entries(FORMULAS)) {
    assert.doesNotThrow(
      () =>
        katex.renderToString(formula, {
          displayMode: true,
          throwOnError: true,
          strict: false,
        }),
      `Formula "${key}" failed: ${formula}`,
    );
  }
});
