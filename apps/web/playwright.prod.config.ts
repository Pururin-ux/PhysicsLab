import { defineConfig } from "@playwright/test";

// Смок против production-сборки: next start на 3100 (не 3000, чтобы не
// столкнуться с локальным dev). Перед запуском обязан быть выполнен
// npm run build; локально dev-сервер должен быть остановлен — build и dev
// делят .next (см. README, «известные грабли»).
export default defineConfig({
  testDir: "./tests",
  testMatch: "prod-smoke.spec.ts",
  fullyParallel: false,
  timeout: 60000,
  workers: 1,
  reporter: [["list"]],
  outputDir: "../../artifacts/playwright-prod-results",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  projects: [{ name: "prod-desktop", use: { viewport: { width: 1440, height: 960 } } }],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/",
    // В CI сервер всегда свой; локально переиспользование запрещено тоже —
    // на 3100 мог остаться посторонний процесс, и смок прошёл бы не по сборке.
    reuseExistingServer: false,
    timeout: 60000,
  },
});
