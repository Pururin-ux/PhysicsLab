import { expect, test } from "@playwright/test";

test("current V3 product shell renders the main learning routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("link", { name: "К задачам", exact: true }),
  ).toBeVisible();

  await page.goto("/topics", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /темы/i })).toBeVisible();
  await expect(page.locator('main a[href="/practice/kinematics-demo"]').first()).toBeVisible();

  await page.goto("/practice/kinematics-demo", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("button").first()).toBeVisible();
});
