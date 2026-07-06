# Wave A: отложенные пункты (RFC-ready)

Ядро Wave A реализовано: prod-smoke CI, манифест-ассерт, envelope-хранилище,
экспорт/импорт, root-playwright cleanup. Два пункта отложены сознательно —
ниже всё, что нужно для их запуска без повторного проектирования.

## A11y baseline (W6 из RFC)

1. `npm i -D @axe-core/playwright` (в apps/web).
2. Создать `apps/web/tests/a11y.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/topics", "/practice/kinematics-demo", "/mistakes", "/profile", "/formulas"];

for (const route of routes) {
  test(`a11y: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // включить после токен-миграции
      .analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
}
```

3. Контраст чинить токенами, не точечно (роли из RFC): ink `/92`,
   ink-secondary `/72`, ink-muted `/60` (минимум для содержательного текста),
   ink-faint `/45` (только декоративное). Кандидаты: `grep -rn "text-white/[345]" components app`.
4. После миграции токенов убрать `disableRules(["color-contrast"])`.

## Visual regression (W7 из RFC)

- Экраны: `/`, `/topics`, карточка вопроса kinematics (batch=0 детерминирован), `/formulas`.
- Viewports: 1440×960 и 390×844 → 8 базлайнов.
- Анти-flake: `animations: "disabled"`, маска `canvas` (StarField),
  `await page.evaluate(() => document.fonts.ready)`.
- Снапшоты платформозависимы: генерить ТОЛЬКО в CI (linux), локально skip
  через `test.skip(!process.env.CI, "базлайны только linux")`.
- Обновление базлайнов: workflow_dispatch job c `--update-snapshots`,
  артефакт скачать и закоммитить отдельным коммитом с причиной изменения.
