import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Прод-смок гоняется отдельным конфигом против next start (см.
  // playwright.prod.config.ts) — в dev-прогоне он давал бы ложную зелень.
  testIgnore: "prod-smoke.spec.ts",
  fullyParallel: false,
  timeout: 60000,
  workers: 1,
  reporter: [["list"]],
  outputDir: "../../artifacts/playwright-results",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 960 } },
    },
    {
      name: "tablet",
      use: { viewport: { width: 834, height: 1194 }, hasTouch: true },
    },
    {
      name: "mobile-390",
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
    {
      name: "mobile-360",
      use: { viewport: { width: 360, height: 740 }, isMobile: true },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/",
    // По умолчанию тесты поднимают сервер из текущего рабочего дерева. Явный
    // opt-in оставлен для ручной отладки, но stale dev server больше не может
    // дать ложную красную/зелёную проверку после изменения кода.
    reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "1",
    timeout: 120000,
  },
});
