# PhysicsLab Execution Roadmap

Дата: 2026-05-18  
Основа: `docs/physicslab-master-plan-v2.md`  
Статус: последовательный план разработки, не новая спецификация UI.

Этот roadmap переводит master plan v2 в порядок работ. Он намеренно не предлагает переписать весь проект сразу. Текущая `/chapters/uniform-motion/` считается **prototype v1**, а не финальным template для всех будущих глав.

Главное инженерное правило:

```text
сначала стабилизируем доказанный прототип -> потом извлекаем только повторяющиеся primitives -> потом строим вторую главу -> потом добавляем exam/unit layer
```

Не делать раньше времени:

- не создавать универсальный `[slug].astro`, пока нет хотя бы 2-3 реально похожих глав;
- не выносить всё в abstractions до второй главы;
- не переписывать `UniformMotionLab` только ради архитектурной чистоты;
- не считать design-board production implementation;
- не добавлять внешние UI/runtime-зависимости без отдельного решения.

## MVP Scope

### Internal MVP: 3 главы

Internal MVP нужен, чтобы проверить архитектуру на нескольких физических сценах, но ещё не обещать публичный курс.

| Порядок | Глава | Зачем нужна |
| --- | --- | --- |
| 1 | Равномерное движение | Зафиксировать current prototype v1, content collection, graph/motion/control patterns |
| 2 | Равноускоренное движение | Проверить, переносится ли visual/physics architecture на новую кинематику |
| 3 | Второй закон Ньютона через тележки | Проверить другую модель: силы, масса, ускорение, векторы |

Internal MVP считается полезным только если каждая из 3 глав имеет:

- misconception-first route;
- интерактивную сцену;
- формулу как compressed model после наблюдения;
- concept check;
- mobile screenshots;
- physics review status.

### Public MVP: 6 глав

Public MVP должен показать ширину PhysicsLab, но не пытаться закрыть весь курс.

| Порядок | Глава | Почему входит |
| --- | --- | --- |
| 1 | Равномерное движение | Базовая связка движение-график-формула |
| 2 | Равноускоренное движение | Ключевой экзаменационный блок кинематики |
| 3 | Второй закон Ньютона через тележки | Динамика и причинность сила -> ускорение |
| 4 | Энергия | Альтернативный способ решения задач без полного анализа сил |
| 5 | Закон Ома | Первая электродинамика и работа со схемой/графиком |
| 6 | Линзы | Сильная визуальная сцена для оптики |

Public MVP не должен ждать pV-диаграммы, индукцию, полный банк задач и маскота во всех состояниях. Эти направления важны, но они увеличивают scope быстрее, чем помогают проверить продукт.

## Phase 1. Stabilize Current Prototype

### Цель

Стабилизировать `/chapters/uniform-motion/` как prototype v1: понятный, тестируемый baseline для следующей разработки. Не превращать его в финальный template.

Фокус этапа:

- зафиксировать поведение текущей лаборатории;
- описать known limitations;
- усилить проверки, которые защищают student-first flow;
- не начинать крупный extraction primitives до второй главы.

### Какие файлы/компоненты трогаем

| Область | Возможные файлы |
| --- | --- |
| Документация статуса | `docs/uniform-motion-*`, новый статусный документ при необходимости |
| Screenshot/e2e tests | `tests/screenshots/uniform-motion.spec.ts`, `tests/screenshots/lab-preview.spec.ts` только если тест защищает текущее поведение |
| Physics tests | `tests/physics/kinematics.test.mjs` |
| Content entry | `src/content/chapters/uniform-motion.json` |
| Minimal page glue | `src/pages/chapters/uniform-motion.astro`, только для content/status wiring |

### Что НЕ трогаем

- Не переписывать `UniformMotionLab` визуально.
- Не переписывать `FormulaScene`.
- Не менять design-board.
- Не добавлять новую chapter architecture.
- Не делать `[slug].astro`.
- Не добавлять новые зависимости.
- Не внедрять exam-task model в этот этап.

### Definition of Done

- `/chapters/uniform-motion/` стабильно открывается на desktop/tablet/mobile/narrow-mobile.
- `data-visual-target="v1"` защищён тестом для production-главы.
- `/lab-preview/` остаётся отдельным preview и не получает production visual marker.
- `UniformMotionLab` проходит сценарии Play/Pause/Reset, ручной time slider, velocity presets, reduced motion.
- В документации явно написано: uniform-motion - prototype v1, не финальный template.
- Все тексты главы, которые уже вынесены в content collection, остаются там.
- Known limitations зафиксированы: нет full prediction, нет exam task, нет structured unit layer, `FormulaScene` не data-driven.

### Проверки

```text
npm run check
npm run test:physics
npm run build
npm run screenshots
```

Для docs-only подзадач допустимо не запускать build, но любые изменения Astro/CSS/TS должны проходить полный набор.

### Риски

| Риск | Что делать |
| --- | --- |
| Стабилизация превращается в бесконечный visual polish | Ограничить изменения тестами, статусом и явными багами |
| Начинается premature abstraction | Запретить extraction до Phase 2 |
| Prototype v1 принимается за production template | Повторять в docs и PR/report: это baseline, не final architecture |
| Screenshot tests становятся хрупкими | Проверять behavior/data attributes, не pixel-perfect DOM details |

### Когда можно переходить дальше

Переход к Phase 2 разрешён, когда:

- текущая глава проходит полный набор проверок;
- есть список только тех primitives, которые реально нужны для второй главы;
- команда согласна, что следующий шаг - extraction минимального набора, а не новый дизайн.

## Phase 2. Extract First Primitives

### Цель

Вытащить первые reusable primitives из `UniformMotionLab` и страницы главы, но только те, которые нужны для `AccelerationScene`.

Правильный критерий extraction:

```text
primitive нужен одновременно для uniform motion и acceleration
```

Если primitive нужен только гипотетически для будущего, его пока не выносить.

### Какие файлы/компоненты трогаем

| Primitive | Возможное место | Зачем |
| --- | --- | --- |
| `LabConsole` styles/component | `src/components/simulations/` или `src/components/ui/` | Общий glass shell для учебной лаборатории |
| `ControlDock` | `src/components/simulations/` | Play/reset/slider/presets как единый паттерн |
| `MotionTrack` visual skin | `src/components/simulations/` | Ось, ticks, point, arrow для 1D motion |
| `InstrumentGraph` | `src/components/learning/` или `src/components/simulations/` | Оси, grid, current point, projections |
| Kinematics helpers | `src/lib/physics/kinematics.ts` | Общие функции для равномерного и равноускоренного движения |
| Tests | `tests/physics/*`, `tests/screenshots/*` | Защитить поведение после extraction |

### Что НЕ трогаем

- Не создавать универсальный renderer глав.
- Не переносить всю главу в content schema.
- Не строить новый design system целиком.
- Не менять учебный порядок `/chapters/uniform-motion/`.
- Не внедрять маскота.
- Не менять старые `pages/`, `css/`, `js/`.
- Не извлекать `FormulaScene` в большой API, если это блокирует acceleration.

### Definition of Done

- `UniformMotionLab` визуально и функционально не регрессирует.
- Появляется минимальный набор primitives, нужный для `AccelerationScene`.
- Primitives имеют понятные boundaries:
  - physics calculations отдельно;
  - SVG/visual rendering отдельно;
  - controls отдельно;
  - content strings не зашиты внутрь общего visual primitive.
- Нет новой runtime-зависимости.
- Mobile 390/360 не ломается.
- Existing screenshot baselines обновлены только если изменение ожидаемо.

### Проверки

```text
npm run check
npm run test:physics
npm run build
npm run screenshots
```

Дополнительно:

- manual/browser check `/chapters/uniform-motion/`;
- manual/browser check `/lab-preview/`, если shared primitive затронул preview;
- reduced-motion smoke test.

### Риски

| Риск | Что делать |
| --- | --- |
| Primitive становится слишком абстрактным | Держать API под 2 главы: uniform + acceleration |
| Визуальный слой ломает accessibility | Проверять labels, focus, touch targets, reduced motion |
| Graph primitive пытается покрыть все будущие графики | Начать с line graph + current point + axes; area/slope probe добавить в Phase 3 |
| Extraction меняет student flow | Тесты должны проверять route и основные тексты |

### Когда можно переходить дальше

Переход к Phase 3 разрешён, когда:

- uniform-motion работает на новых primitives;
- primitives не выглядят как speculative framework;
- есть чистые physics helpers для равноускоренного движения или понятный план их добавить.

## Phase 3. Build Second Chapter: AccelerationScene

### Цель

Построить вторую главу internal MVP: равноускоренное движение. Это не просто новая страница; это проверка, выдержит ли архитектура вторую физическую модель.

Центральная misconception:

```text
ускорение = большая скорость
```

Что должен понять ученик:

- скорость может меняться;
- ускорение показывает, как меняется скорость;
- знак `a` зависит от выбранной оси;
- график `v(t)` имеет наклон;
- площадь под `v(t)` связана с изменением координаты/перемещением в рамках модели.

### Какие файлы/компоненты трогаем

| Область | Возможные файлы |
| --- | --- |
| Новая страница | `src/pages/chapters/accelerated-motion.astro` или выбранное русское slug-имя |
| Content entry | `src/content/chapters/accelerated-motion.json` |
| Physics engine | `src/lib/physics/kinematics.ts` или новый файл рядом, если helpers разрастаются |
| Simulation component | `src/components/simulations/AccelerationScene.astro` |
| Shared primitives | Только primitives из Phase 2 |
| Physics tests | `tests/physics/kinematics.test.mjs` или отдельный acceleration test |
| Screenshot tests | Новый screenshot spec для главы |

### Что НЕ трогаем

- Не переписывать uniform-motion под новый chapter renderer.
- Не делать `[slug].astro`.
- Не добавлять React/Svelte.
- Не добавлять animation library.
- Не подключать full exam layer.
- Не пытаться сразу покрыть все графики движения как отдельную главу.
- Не делать Public MVP на этом этапе.

### Definition of Done

- Глава имеет route и content entry.
- Есть интерактивная сцена с `v₀`, `a`, `t` или другим минимальным набором параметров.
- На первом уровне не больше 1-3 главных контролов.
- Сцена показывает:
  - движение точки/тележки;
  - график `v(t)`;
  - график или readout `x(t)`/`Δx`;
  - текущие значения;
  - понятный вывод про знак и наклон.
- Формулы появляются после наблюдения:
  - `v = v₀ + at`;
  - `x = x₀ + v₀t + at²/2` только если не перегружает первый уровень.
- Есть misconception check про ускорение и скорость.
- Есть reduced-motion fallback.
- Есть mobile layout без horizontal scroll.
- Physics helpers покрыты unit tests.
- Контент помечен `authorReviewRequired`.

### Проверки

```text
npm run check
npm run test:physics
npm run build
npm run screenshots
```

Дополнительно:

- проверить сценарии `a > 0`, `a = 0`, `a < 0`;
- проверить ситуацию `v₀` и `a` разных знаков;
- проверить, что отрицательное ускорение не объясняется как "тело всегда едет назад";
- проверить mobile 390/360;
- проверить reduced motion.

### Риски

| Риск | Что делать |
| --- | --- |
| Ученик перегружается двумя формулами | Первый уровень: `v = v₀ + at`; вторую формулу прятать в details |
| Знак ускорения объяснён неверно | Нужен physics review до публичного статуса |
| Графики становятся слишком мелкими | Mobile-first composition: graph as hero, details ниже |
| Shared primitives не подходят | Исправлять primitive только если нужно двум главам, не ради красоты одной страницы |

### Когда можно переходить дальше

Переход к Phase 4 разрешён, когда:

- две главы используют часть общих primitives без регресса;
- стало ясно, какие проверки задач и единиц повторяются;
- есть минимум один concept check в каждой главе;
- команда готова добавить exam layer без переделки learning flow.

## Phase 4. Add First Exam-Task / Unit-Check Layer

### Цель

Добавить первый слой exam-style задач и проверки единиц, не превращая проект в банк задач и не делая full LMS.

Фокус:

- одна оригинальная задача для равномерного движения;
- одна оригинальная задача для равноускоренного движения;
- unit/rounding check как reusable pattern;
- metadata и review status;
- feedback для типичных ошибок.

### Какие файлы/компоненты трогаем

| Область | Возможные файлы |
| --- | --- |
| Content config | `src/content.config.ts` |
| Tasks collection | `src/content/tasks/*.json` или аналогичная структура |
| Unit helpers | `src/lib/physics/units.ts` или `src/lib/physics/format.ts` |
| Task component | `src/components/learning/ExamTaskCard.astro` |
| Unit component | `src/components/learning/UnitCheck.astro` |
| Chapter pages | `src/pages/chapters/uniform-motion.astro`, acceleration page |
| Tests | physics/unit tests + screenshots |

### Что НЕ трогаем

- Не строить полный task bank.
- Не копировать задания РИКЗ/сборников.
- Не делать аккаунты, прогресс, сохранение ответов.
- Не делать spaced repetition backend.
- Не делать универсальный renderer всей главы.
- Не смешивать exam layer с visual scene state.

### Definition of Done

- Есть минимальная task schema:
  - `id`;
  - `topic`;
  - `skills`;
  - `format`;
  - `answerType`;
  - `units`;
  - `requiresRounding`;
  - `misconceptions`;
  - `source: original`;
  - `authorReviewRequired`;
  - answer and feedback.
- Есть минимум 2 original tasks:
  - равномерное движение;
  - равноускоренное движение.
- Unit check объясняет не только "неверно", а что именно не так:
  - не переведены единицы;
  - неверная размерность;
  - неправильное округление;
  - знак физически не согласован с условием.
- Задачи не ломают student-first flow: сначала интерактив, потом transfer.
- Новые компоненты keyboard-accessible и mobile-readable.

### Проверки

```text
npm run check
npm run test:physics
npm run build
npm run screenshots
```

Дополнительно:

- unit tests для conversions/formatting;
- manual review всех численных ответов;
- physics review checklist;
- copyright/originality review для задач.

### Риски

| Риск | Что делать |
| --- | --- |
| Задачи случайно копируют exam/source pattern | Писать оригинальные сюжеты, фиксировать `source: original` |
| Unit layer становится слишком сложным | Начать с 2-3 common cases: SI conversion, units, rounding |
| Exam block пугает ученика | Формулировать как "проверка без паники", не как наказание |
| Task schema затвердевает слишком рано | Считать schema v0, расширять после 2-3 задач |

### Когда можно переходить дальше

После Phase 4 можно планировать:

- третью главу internal MVP: второй закон Ньютона через тележки;
- первый review pass по physics correctness;
- расширение content model для worked/faded examples;
- только затем обсуждать generic chapter renderer.

Переход дальше запрещён, если:

- задачи не прошли physics review;
- unit check работает только как декоративный блок;
- задачи повторяют чужие формулировки;
- mobile screenshots показывают перегруз.

## Cross-Phase Guardrails

| Guardrail | Почему |
| --- | --- |
| Current uniform-motion is prototype v1 | Нельзя копировать все локальные решения как final pattern |
| No universal renderer yet | До 2-3 глав renderer будет гаданием и создаст лишний API |
| No rewrite-first approach | Переписывание без второй главы не докажет архитектуру |
| Physics before spectacle | Визуальная сцена должна объяснять модель, не украшать страницу |
| One new abstraction per repeated need | Abstraction появляется после повторения, не до |
| Content model grows by usage | Schema расширяется под реальные главы, задачи и checks |
| Tests protect learning behavior | Проверять важные состояния и data markers, не случайный DOM |

## Suggested Work Tickets

| Этап | Ticket | Результат |
| --- | --- | --- |
| Phase 1 | `uniform-motion-v1-stability-audit` | Документ known limitations + тестовые gaps |
| Phase 1 | `uniform-motion-screenshot-hardening` | Более устойчивые checks для главной лаборатории |
| Phase 2 | `extract-control-dock` | Shared control dock без изменения учебной логики |
| Phase 2 | `extract-instrument-graph-v0` | Graph shell для uniform/acceleration |
| Phase 2 | `extract-motion-track-v0` | Motion track без chapter-specific текста |
| Phase 3 | `add-acceleration-physics-helpers` | Чистые функции и тесты |
| Phase 3 | `build-acceleration-scene-prototype` | Вторая интерактивная глава |
| Phase 4 | `add-task-content-schema-v0` | Минимальная collection/schema задач |
| Phase 4 | `add-unit-check-v0` | Первая reusable проверка единиц |

## Implementation Opinion

### Что в задаче удачно

- Правильно выбран порядок: сначала стабилизация, потом primitives, потом вторая глава. Это снижает риск построить абстрактную архитектуру без второго use case.
- Чётко указано, что uniform-motion - prototype v1, не финальный template. Это важно: текущий код уже полезен, но в нём слишком много локальных решений, чтобы копировать его механически.
- Разделение Internal MVP и Public MVP нужно. Без него проект легко перепрыгнет от одной главы сразу к "строим весь курс".
- Запрет на universal renderer сейчас оправдан. Для одной главы и одного будущего кандидата это преждевременная оптимизация.

### Что спорно

- Четырёх этапов достаточно для ближайшей разработки, но недостаточно для полного public MVP. После Phase 4 всё равно понадобится отдельный план на главу "Ньютон через тележки", energy и first public release criteria.
- `AccelerationScene` как этап 3 логичен, но он сложнее, чем кажется. Там есть риск методически неверно объяснить знаки `v`, `a` и движение при противоположных направлениях. Это потребует physics review раньше, чем визуальный review.
- Extract primitives до второй главы - тонкая граница. Можно вынести control/graph слишком рано и получить generic API, который потом придётся ломать.

### Где текущий код мешает

- `UniformMotionLab` уже несёт одновременно физику отображения, UI-state, текст, визуальные панели и quiz. Это нормально для prototype v1, но плохо как foundation для нескольких глав.
- `FormulaScene` пока не data-driven. Она выглядит как отдельная интерактивная сцена, а не как формульный слой, связанный с конкретной лабораторией и content model.
- Content collection пока минимальная. Она хранит базовые тексты, но не хранит misconceptions, formula blocks, unit checks, examples и task metadata.
- Screenshot tests полезны, но часть тестов исторически завязана на конкретные UI состояния. При extraction нужно защищать смысловые markers и behavior, иначе тесты будут мешать нормальной декомпозиции.

### Где промпт был недостаточно точным

- Не указан желаемый уровень детализации roadmap: документ мог быть как на 2 страницы, так и на полноценный execution plan. Я выбрал более подробный вариант, потому что проект уже упирается в архитектурные решения.
- Не уточнено, должен ли roadmap включать конкретные ticket names. Я добавил suggested tickets, потому что без них roadmap останется слишком стратегическим.
- Не задано, запускать ли проверки для docs-only изменения. Я считаю, что для такого изменения проверки не обязательны; для кода они обязательны.
- Формулировка "на основе master plan" не говорит, какие противоречия master plan нужно ужесточить. Я явно усилил запрет на premature renderer и rewrite-first approach.

### Что я бы сделал иначе как разработчик

- Перед extraction primitives я бы сделал короткий "stability audit" current `UniformMotionLab`: какие состояния реально нужно сохранить, какие data markers являются contract, какие CSS parts можно ломать.
- Вторую главу `AccelerationScene` я бы начал с physics helpers и low-fi scene, а не с high-fidelity визуала. Для ускорения главная опасность - не внешний вид, а неверная модель знаков.
- Я бы не стал расширять content model сразу под весь master plan. Лучше добавить `misconceptions` и `formulaBlocks` после Phase 2, а `tasks` отдельной collection только в Phase 4.
- Я бы оставил design-board замороженным как visual reference, но не тянул его CSS напрямую в production. Иначе board станет скрытой дизайн-системой без API.

### Потенциальный технический долг

| Решение | Какой долг может появиться |
| --- | --- |
| Оставить `UniformMotionLab` большим компонентом | Сложнее переиспользовать graph/control/motion в acceleration |
| Слишком рано вынести primitives | Появится API, который не подходит второй/третьей главе |
| Держать quiz logic локально в страницах | Повторение feedback/state/accessibility кода |
| Минимальная content schema без versioning | Позже migration content entries может быть болезненной |
| Считать screenshots достаточной QA | Physics correctness и task originality не покрываются скриншотами |
| Задержать exam/unit layer надолго | PhysicsLab останется красивой лабораторией без подготовки к ЦТ/ЦЭ transfer |

## Final Recommendation

Следующий реальный engineering step: не строить `AccelerationScene` сразу. Сначала выполнить Phase 1 как короткий stabilization pass и зафиксировать boundaries prototype v1. После этого извлекать ровно те primitives, которые нужны для acceleration.

Если начать сразу с новой главы без Phase 1/2, будет быстрый визуальный прогресс, но через 2-3 главы появится дорогой rewrite. Если начать с большого architecture rewrite, проект потеряет темп и будет строить framework вместо продукта.
