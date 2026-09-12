import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

// В JSX значение атрибута в кавычках — это литеральный текст, а не строка JS:
// text="$a=6\\div2=$" доедет до KaTeX как «\\» (перенос строки) плюс слово
// «div2». На уроке динамики из-за этого вместо «a = 6 ÷ 2» стояли две строки.
// Формулы с обратным слэшем нужно передавать выражением: text={"...\\div..."}.
const ROOTS = ["app", "components"];
const ATTRIBUTE_WITH_ESCAPE = /\s(?:text|formula|latex|caption|label)="[^"]*\\\\/;

const here = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(here, "..", "..");

function collectTsx(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectTsx(full));
    else if (entry.name.endsWith(".tsx")) files.push(full);
  }
  return files;
}

test("latex in JSX attributes is passed as an expression, not a quoted string", () => {
  const offenders: string[] = [];

  for (const root of ROOTS) {
    for (const file of collectTsx(path.join(webRoot, root))) {
      readFileSync(file, "utf8")
        .split(/\r?\n/)
        .forEach((line, index) => {
          if (ATTRIBUTE_WITH_ESCAPE.test(line)) {
            offenders.push(`${path.relative(webRoot, file)}:${index + 1}: ${line.trim()}`);
          }
        });
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `Формулу с «\\\\» нужно передавать выражением text={"..."}, иначе KaTeX получит перенос строки:\n${offenders.join("\n")}`,
  );
});
