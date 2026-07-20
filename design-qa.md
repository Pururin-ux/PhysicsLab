# Design QA — PhysicsLab

Дата финального визуального прогона: 16.07.2026.

## Источники и проверяемая сборка

- Основной визуальный референс: `C:\Users\lalad\AppData\Local\Temp\codex-clipboard-daedd266-c72f-447a-b822-f1c956d2a13e.png`.
- Дополнительные доски элементов: `codex-clipboard-12d4defe-a318-4602-b0de-d0fd8445151d.png` и `codex-clipboard-f8245bb2-7318-4f2c-87eb-4b5f6e7181db.png`.
- Предыдущие кадры продукта: `C:\Users\lalad\.codex\visualizations\2026\07\13\019f5d62-e840-77a3-b19b-b975652529ec\final-screens-viewport-2026-07-16`.
- Финальная локальная сборка: `http://localhost:3000/`.
- Финальные кадры: `C:\Users\lalad\.codex\visualizations\2026\07\16\physicslab-design-qa`.
- Сводные листы: `00-desktop-overview.png` и `00-mobile-overview.png`.
- Попарные сравнения при одинаковом viewport: папка `comparisons` внутри каталога финальных кадров.

## Что проверено визуально

- Главная, интерактив, темы, задачи, прогресс первого визита, пустые ошибки, формулы и тренировка при 1440×1024.
- Главная, интерактив до и после ответа, темы, задачи, тренировка и ошибки при 390×844.
- Источник и реализация открывались вместе в одном before/after-изображении. Отдельно проверены композиция, плотность, контраст, кропы арта, ритм карточек, состояния пустого профиля и мобильная шапка.
- Скриншоты сделаны после загрузки клиентских данных; служебный dev-overlay отсутствует.

## Исправления по аудиту

- Индиго/голубой закреплён за действиями, фокусом и hover; розовый оставлен брендовым акцентом, золото и спектральные цвета — данными и темами.
- Тёмная lofi-тема стала темой по умолчанию; светлая тема сохранена для формул, задач и работы в классе.
- Светлые поверхности получили более выраженную разницу фона, карточек и вариантов ответа.
- Обещание интерактива закрыто рабочим опытом свободного падения: прогноз → проверка → параметры → сцена → график → формула → объяснение.
- Кинематика и динамика больше не используют один сюжет. Для динамики создана отдельная иллюстрация с пружинным динамометром и наклонной плоскостью.
- Цветовое кодирование тем синхронизировано в маршруте, каталоге задач и проводнике по формулам.
- Карточки задач уплотнены: метаданные и действие собраны в одну строку, мёртвый нижний хвост убран.
- «Следующий шаг» перестроен в компактный блок без пустоты между текстом и кнопкой.
- Первый визит в прогресс показывает onboarding вместо пяти нулевых карточек.
- Пустые «Ошибки» получили полноценную сцену и прямой следующий шаг.
- Нулевые значения больше не используют перечёркнутый моноширинный глиф.
- Повышен контраст микролейблов; исправлены светлые контурные действия и якорь интерактива под липкой мобильной шапкой.
- Навигация корректно отмечает «Задачи» внутри тренировки и сохраняет семантику на desktop/tablet/mobile.

## Проверенные взаимодействия

- В интерактиве выбран прогноз «Скорость вырастет», получена корректная обратная связь, график и формула обновились.
- Переключатель темы проверен на тёмном и светлом состояниях.
- Каталог задач, фильтры, ссылки открытия, первый визит профиля и пустое состояние ошибок отрисованы в реальном браузере.
- Тренировка дождалась загрузки задания и показала четыре интерактивных варианта.
- В проверенных финальных вкладках нет recoverable/hydration overlay.

## Автоматические проверки

- `npm run check` — passed.
- `npm run build` — passed.
- `npm run test:a11y` — 79/80 в полном прогоне; единственный оставшийся tablet navigation selector исправлен, его точечный повторный прогон passed. Итоговый набор: 80/80 без serious/critical axe-нарушений.
- `git diff --check` — только существующие предупреждения о CRLF, ошибок whitespace нет.

## Итог

При сравнении финальных кадров с предыдущей версией не осталось блокирующих P0/P1/P2 визуальных дефектов. Оставшиеся различия — намеренные: тёмная тема по умолчанию, более нейтральная индиго-палитра, реальный интерактив вместо обещания и новые художественные состояния.

## Cozy cats visual pass

- The visual-only variant keeps the current information architecture, routes, simulation logic, formulas, copy, progress store, and light theme unchanged.
- Hero verified at 1440×1024 and 390×844: text remains on a quiet gradient, the character's face stays clear, and the mobile crop uses a separate portrait composition.
- Topic art verified at 1440×1024 in both rows: the cat and the defining apparatus stay visible inside each 158 px card crop.
- Physics/art checks: photogate beam unobstructed; spring scale inline with one block; electricity shows an open switch with the bulb off; optics uses one source, prism and screen; the thermal cat stays outside the heated setup.
- Rejected intermediate electricity renders with loose leads or a lit bulb behind an open switch were not copied into `public/`.
- The earlier serious art remains available under the original filenames and in `artifacts/art-production/rollback/`.
- Current delta: `npm run check` passed; `npm run build` passed.
- Screenshots: `artifacts/art-production/final/home-cozy-cats-1440x1024-final.png`, `home-cozy-cats-390x844.png`, `topics-cozy-cats-1440x1024-final.png`, and `topics-cozy-cats-lower-1440x1024.png`.

## Formula curators and formula-sheet pass

- Source visual truth: `artifacts/art-production/final/formulas-1440x1024.png` plus the accepted cozy topic art in `apps/web/public/art/production/topic-*-cozy.png`.
- Implementation screenshots: `artifacts/art-production/final/formulas-curators-1440x1024.png`, `formulas-curators-lower-1440x1024.png`, `formulas-curator-electricity-1440x1024.png`, `formulas-curator-thermodynamics-1440x1024.png`, `formulas-curator-optics-1440x1024.png`, `formulas-curators-390x844.png`, `formulas-curators-cards-390x844.png`, `formulas-curators-open-390x844.png`, and `formulas-curators-light-1440x1024.png`.
- Viewports and states: dark 1440×1024, dark 390×844, one expanded formula card on mobile, and light 1440×1024.
- Full-view comparison evidence: `artifacts/art-production/final/formulas-before-after-2880x1024.png` places the prior and revised dark desktop views in one same-size comparison.
- Focused evidence: the mobile closed-card and expanded-card screenshots verify equation scale, caption wrapping, symbol rows, condition block, cat crop and sticky navigation. The electricity anchor screenshot verifies a second curator, cyan topic coding and a multi-line equation card.
- Fonts and typography: the existing Manrope hierarchy is unchanged; KaTeX is larger and remains the mathematical source of truth. Formula captions use the UI face at 11–12 px with sufficient line height.
- Spacing and rhythm: curator headers form clear section breaks; cards retain the dense three-column desktop grid and switch to one column without horizontal overflow on mobile.
- Colors and tokens: each group keeps its existing spectral topic color. The warm paper equation surface creates figure/ground separation in both themes without changing the global action-color rule.
- Image quality: four separate 1254×1254 masters were inspected at source size and in 86–104 px browser crops. No duplicate limbs, fused paws, malformed eyes, pseudo-text, or broken props remain. The rejected electricity state with an open switch and glowing lamp was not integrated.
- Copy: section notes are direct checks tied to problem solving; no mascot lore or atmosphere explanation was added.
- Interactions tested: formula accordion opens and reports `aria-expanded=true`; section anchors load the matching curator; the theme switch preserves readability; mobile document width equals the client width.
- Automated delta: `npm run check` passed, `npm run build` passed, `npm run test:physics` passed 133/133, and the focused formula accessibility run passed 4/4 at desktop, tablet, 390 px and 360 px with no serious/critical axe violations.
- Comparison history: initial browser capture loaded the new component markup with a stale development stylesheet; the development server was restarted, the computed styles were rechecked, and the post-fix captures above show the intended header, paper formula surfaces and responsive layout.
- Remaining P3: the mechanics curator is intentionally reused for both kinematics and dynamics because they are one large section; their check text and accent color distinguish the two subsections.

final result: passed
