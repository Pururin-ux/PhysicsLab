import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/web/tests",
  fullyParallel: false,
  reporter: [["list"]],
  outputDir: "artifacts/playwright-results",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm --prefix apps/web run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/",
    reuseExistingServer: true,
    timeout: 120000
  }
});
