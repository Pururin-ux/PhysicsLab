// Страж класса багов «build прошёл, рантайм отдаёт 404»: реальный случай —
// next build --turbopack записывал неполный app-paths-manifest, и после
// next start жили только "/" и "/api/tasks". Скрипт читает манифест
// прод-сборки и сверяет его со списком обязательных маршрутов.
//
// Запуск: node scripts/assert-routes-manifest.mjs (после npm run build, cwd = apps/web)

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifestPath = resolve(".next", "app-path-routes-manifest.json");
const routesPath = resolve("tests", "required-routes.json");

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  console.error(
    `[assert-routes-manifest] Не удалось прочитать ${manifestPath}: ${error.message}\n` +
      "Отсутствие или нечитаемость манифеста — сама по себе поломка сборки.",
  );
  process.exit(1);
}

const { required, devOnly } = JSON.parse(readFileSync(routesPath, "utf8"));

// Проверяем только значения (готовые route-пути) — структура ключей
// манифеста может меняться между версиями Next, значения стабильнее.
const routes = new Set(Object.values(manifest));

const missing = required.filter((route) => !routes.has(route));
const leakedDev = [...routes].filter((route) => route.startsWith("/dev"));

if (missing.length > 0) {
  console.error(
    `[assert-routes-manifest] В прод-манифесте отсутствуют обязательные маршруты:\n  ${missing.join("\n  ")}\n` +
      `Всего маршрутов в манифесте: ${routes.size}.`,
  );
  process.exit(1);
}

if (leakedDev.length > 0) {
  console.error(
    `[assert-routes-manifest] Дев-маршруты попали в прод-сборку:\n  ${leakedDev.join("\n  ")}\n` +
      "Проверь pageExtensions в next.config.ts и имена файлов page.dev.tsx.",
  );
  process.exit(1);
}

console.log(
  `[assert-routes-manifest] OK: ${required.length} обязательных маршрутов на месте, ` +
    `дев-маршрутов нет (известные dev-only: ${devOnly.join(", ")}).`,
);
