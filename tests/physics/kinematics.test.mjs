import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const sourcePath = path.join(root, "src/lib/physics/kinematics.ts");
const outputDir = path.join(root, "artifacts/physics-tests");
const outputPath = path.join(outputDir, "kinematics.mjs");

const source = await readFile(sourcePath, "utf8");
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
    strict: true
  }
});

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, transpiled.outputText, "utf8");

const physics = await import(`${pathToFileURL(outputPath).href}?t=${Date.now()}`);

assert.equal(physics.uniformPosition(0, 2, 3), 6);
assert.equal(physics.uniformPosition(5, 0, 10), 5);
assert.equal(physics.uniformPosition(-2, -3, 4), -14);
assert.equal(physics.uniformVelocity(3.5), 3.5);
assert.deepEqual(physics.generateUniformVelocitySeries({ x0: 0, v: -2, tMax: 1 }), [
  { t: 0, v: -2 },
  { t: 0.5, v: -2 },
  { t: 1, v: -2 }
]);

console.log("Physics kinematics checks passed.");

