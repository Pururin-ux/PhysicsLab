import { expect, test } from "@playwright/test";

const routes = [
  { name: "home", path: "/" },
  { name: "topics", path: "/topics" },
  { name: "kinematics-practice", path: "/practice/kinematics-demo" },
] as const;

for (const route of routes) {
  test(`${route.name} renders without layout-level failures`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("body")).not.toHaveText(/Unhandled Runtime Error|Application error/i);

    await page.screenshot({
      animations: "disabled",
      fullPage: true,
      path: testInfo.outputPath(`${route.name}.png`),
    });
  });
}
