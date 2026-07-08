import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Buffer } from "node:buffer";
import ts from "typescript";

async function loadModule(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  }).outputText;

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(moduleUrl);
}

const {
  computeVectorEndpoints,
  computeResultant,
  resolveAngleMark,
  buildAngleArcPath,
} = await loadModule("./vector-diagram-geometry.ts");

test("concurrent layout: every vector starts at the origin", () => {
  const endpoints = computeVectorEndpoints({
    layout: "concurrent",
    vectors: [
      { id: "f1", dx: 3, dy: 0 },
      { id: "f2", dx: 0, dy: 2 },
    ],
  });

  assert.deepEqual(endpoints.get("f1"), { start: { x: 0, y: 0 }, end: { x: 3, y: 0 } });
  assert.deepEqual(endpoints.get("f2"), { start: { x: 0, y: 0 }, end: { x: 0, y: 2 } });
});

test("chain layout: each vector starts where the previous one ended", () => {
  const endpoints = computeVectorEndpoints({
    layout: "chain",
    vectors: [
      { id: "v1", dx: 4, dy: 0 },
      { id: "v2", dx: 0, dy: -3 },
    ],
  });

  assert.deepEqual(endpoints.get("v1"), { start: { x: 0, y: 0 }, end: { x: 4, y: 0 } });
  assert.deepEqual(endpoints.get("v2"), { start: { x: 4, y: 0 }, end: { x: 4, y: -3 } });
});

test("resultant sums every vector's components", () => {
  const resultant = computeResultant([
    { id: "a", dx: 2, dy: 1 },
    { id: "b", dx: -1, dy: 3 },
  ]);

  assert.deepEqual(resultant, { dx: 1, dy: 4 });
});

test("resolveAngleMark finds the shared origin for concurrent vectors", () => {
  const endpoints = computeVectorEndpoints({
    layout: "concurrent",
    vectors: [
      { id: "f1", dx: 3, dy: 0 },
      { id: "f2", dx: 0, dy: 3 },
    ],
  });

  const mark = resolveAngleMark("f1", "f2", endpoints);
  assert.deepEqual(mark.center, { x: 0, y: 0 });
  assert.deepEqual(mark.dirA, { x: 3, y: 0 });
  assert.deepEqual(mark.dirB, { x: 0, y: 3 });
});

test("resolveAngleMark finds the joint between chained vectors", () => {
  const endpoints = computeVectorEndpoints({
    layout: "chain",
    vectors: [
      { id: "v1", dx: 4, dy: 0 },
      { id: "v2", dx: 0, dy: 3 },
    ],
  });

  const mark = resolveAngleMark("v1", "v2", endpoints);
  assert.deepEqual(mark.center, { x: 4, y: 0 });
  // v1 идёт в узел стыка -> луч смотрит назад вдоль v1
  assert.deepEqual(mark.dirA, { x: -4, y: 0 });
  assert.deepEqual(mark.dirB, { x: 0, y: 3 });
});

test("buildAngleArcPath measures a right angle as 90 degrees", () => {
  const arc = buildAngleArcPath({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, 20);
  assert.equal(arc.deltaDeg, 90);
  assert.match(arc.path, /^M /);
});

test("buildAngleArcPath picks the minor arc regardless of winding order", () => {
  const forward = buildAngleArcPath({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, 20);
  const backward = buildAngleArcPath({ x: 0, y: 0 }, { x: -1, y: 1 }, { x: 1, y: 0 }, 20);
  assert.equal(forward.deltaDeg, backward.deltaDeg);
});
