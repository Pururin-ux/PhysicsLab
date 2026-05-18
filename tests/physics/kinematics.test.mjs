import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const outputDir = path.join(root, "artifacts/physics-tests");

await mkdir(outputDir, { recursive: true });

const physics = await importPhysicsModule("kinematics");
const accelerated = await importPhysicsModule("acceleratedMotion");
const graphView = await importPhysicsModule("graphView");

assert.equal(physics.uniformPosition(0, 2, 3), 6);
assert.equal(physics.uniformPosition(5, 0, 10), 5);
assert.equal(physics.uniformPosition(-2, -3, 4), -14);
assert.equal(physics.uniformVelocity(3.5), 3.5);
assert.equal(physics.normalizeUniformMotionTime(3, 8), 3);
assert.equal(physics.normalizeUniformMotionTime(-2, 8), 0);
assert.equal(physics.normalizeUniformMotionTime(12, 8), 8);
assert.equal(physics.normalizeUniformMotionTime(2, Number.NaN), 0);
assert.equal(physics.getUniformMotionDirection(2), "forward");
assert.equal(physics.getUniformMotionDirection(-0.5), "backward");
assert.equal(physics.getUniformMotionDirection(0), "still");
assert.deepEqual(physics.generateUniformVelocitySeries({ x0: 0, v: -2, tMax: 1 }), [
  { t: 0, v: -2 },
  { t: 0.5, v: -2 },
  { t: 1, v: -2 }
]);
assert.deepEqual(
  physics.generatePartialUniformMotionSeries({
    x0: 2,
    v: 3,
    t: 1.25,
    tMax: 8,
    step: 0.5
  }),
  [
    { t: 0, x: 2 },
    { t: 0.5, x: 3.5 },
    { t: 1, x: 5 },
    { t: 1.25, x: 5.75 }
  ]
);
assert.deepEqual(
  physics.generatePartialUniformVelocitySeries({
    x0: 0,
    v: 2,
    t: 4,
    tMax: 2,
    step: 1
  }),
  [
    { t: 0, v: 2 },
    { t: 1, v: 2 },
    { t: 2, v: 2 }
  ]
);

assert.equal(accelerated.velocityAt(3, 2, 4), 14);
assert.equal(accelerated.velocityAt(5, 8, -2), -2);
assert.equal(accelerated.positionAt(3, 1, 2, 4), 25);
assert.equal(accelerated.positionAt(4, 5, 3, 0), physics.uniformPosition(5, 3, 4));
assert.equal(accelerated.velocityAt(4, 3, 0), physics.uniformVelocity(3));
assert.equal(accelerated.accelerationMotionDirection(1, 4, -2), "forward");
assert.equal(accelerated.accelerationMotionDirection(2, 4, -2), "still");
assert.equal(accelerated.accelerationMotionDirection(3, 4, -2), "backward");
assert.deepEqual(
  accelerated.generateVelocitySeries({
    v0: 1,
    a: 2,
    tMax: 1,
    step: 0.5
  }),
  [
    { t: 0, v: 1 },
    { t: 0.5, v: 2 },
    { t: 1, v: 3 }
  ]
);
assert.deepEqual(
  accelerated.generatePositionSeries({
    x0: 0,
    v0: 2,
    a: -1,
    tMax: 1,
    step: 0.5
  }),
  [
    { t: 0, x: 0 },
    { t: 0.5, x: 0.875 },
    { t: 1, x: 1.5 }
  ]
);

for (const point of accelerated.generatePositionSeries({
  x0: Number.NaN,
  v0: Number.POSITIVE_INFINITY,
  a: Number.NEGATIVE_INFINITY,
  tMax: Number.NaN
})) {
  assert.equal(Number.isFinite(point.t), true);
  assert.equal(Number.isFinite(point.x), true);
}

for (const point of accelerated.generateVelocitySeries({
  v0: Number.NaN,
  a: Number.POSITIVE_INFINITY,
  tMax: Number.NaN
})) {
  assert.equal(Number.isFinite(point.t), true);
  assert.equal(Number.isFinite(point.v), true);
}

assert.deepEqual(
  graphView.mapToGraphPoint(0, -10, {
    xMin: 0,
    xMax: 8,
    yMin: -10,
    yMax: 10
  }),
  { x: 42, y: 188 }
);
assert.deepEqual(
  graphView.mapToGraphPoint(8, 10, {
    xMin: 0,
    xMax: 8,
    yMin: -10,
    yMax: 10
  }),
  { x: 302, y: 18 }
);
assert.deepEqual(
  graphView.mapToGraphPoint(12, -14, {
    xMin: 0,
    xMax: 8,
    yMin: -10,
    yMax: 10
  }),
  { x: 302, y: 188 }
);
assert.equal(
  graphView.seriesToPolyline(
    [
      { t: 0, x: Number.NaN },
      { t: Number.POSITIVE_INFINITY, x: 10 }
    ],
    (point) => graphView.mapToGraphPoint(point.t, point.x, {
      xMin: 0,
      xMax: 8,
      yMin: -10,
      yMax: 10
    })
  ),
  "42,188 42,18"
);
assert.deepEqual(
  graphView.createTicks(0, 8, 5, (value) => `${value} s`),
  [
    { value: 0, label: "0 s" },
    { value: 2, label: "2 s" },
    { value: 4, label: "4 s" },
    { value: 6, label: "6 s" },
    { value: 8, label: "8 s" }
  ]
);

console.log("Physics kinematics checks passed.");

async function importPhysicsModule(name) {
  const sourcePath = path.join(root, `src/lib/physics/${name}.ts`);
  const outputPath = path.join(outputDir, `${name}.mjs`);
  const source = await readFile(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      strict: true
    }
  });

  await writeFile(outputPath, transpiled.outputText, "utf8");
  return import(`${pathToFileURL(outputPath).href}?t=${Date.now()}`);
}
