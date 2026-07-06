# Wave A: статус доп. слоёв (a11y / visual)

Оба слоя РЕАЛИЗОВАНЫ (см. `apps/web/tests/a11y.spec.ts` и `visual.spec.ts`,
CI job `e2e-dev`). Этот файл описывает границы покрытия и единственный
оставшийся шаг.

## A11y — реализовано

- `npm run test:a11y`: axe на 6 маршрутах (`/`, `/topics`, `/profile`,
  `/formulas`, `/practice/kinematics-demo`, `/practice/exam-demo`)
  во всех 4 viewport-проектах (24 проверки). Порог: ноль serious/critical.
- Единственное исключение: `.exclude("canvas")` — декоративный звёздный
  фон с aria-hidden, ложные срабатывания контраста на наложении.
- Исправлено по итогам первого прогона: контраст eyebrow-подписей
  (`/40`,`/45` → `/60`), текст принципов лендинга (`/62` → `/70`),
  `role="listitem"` в OptionList, `tablist` → `group` в переключателях
  режимов практики (кнопки — toggle, не табы).

## Visual — реализовано в два слоя

- Слой 1 (кроссплатформенный, гоняется и в CI): layout-assertions —
  нет горизонтального скролла, main в пределах viewport, мобильная
  навигация прижата к низу. 6 маршрутов × 4 viewport.
- Слой 2 (пиксельный): `VISUAL_SNAPSHOTS=1 npm run test:visual` сравнивает
  скриншоты main-региона (канвас замаскирован) с базлайнами в
  `tests/visual.spec.ts-snapshots/`. В репо — win32-базлайны
  (desktop + mobile-390, 12 снимков, ~0.8 МБ).

## Оставшийся шаг: linux-базлайны для пиксельного слоя в CI

Рендеринг шрифтов платформозависим, поэтому пиксельный слой в CI
сейчас не активен (идёт только layout-слой). Включение:

1. Разово прогнать в GitHub Actions:
   `VISUAL_SNAPSHOTS=1 npx playwright test --grep @visual --update-snapshots`
   (workflow_dispatch), выгрузить снапшоты артефактом.
2. Закоммитить `*-linux.png` рядом с win32.
3. В шаг «Visual layout assertions» добавить `VISUAL_SNAPSHOTS: "1"`.

Обновление любых базлайнов — только отдельным коммитом с причиной
(«намеренное визуальное изменение: <что>»), не как побочный эффект.
