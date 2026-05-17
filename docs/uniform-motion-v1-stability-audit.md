# Uniform Motion v1 Stability Audit

Дата: 2026-05-18  
Статус: Phase 1 audit для `uniform-motion-v1-stability-audit` из `docs/physicslab-execution-roadmap.md`.  
Объект: `/chapters/uniform-motion/` и связанный `UniformMotionLab`.

Этот документ фиксирует текущую главу как **prototype v1**. Это рабочий baseline, но не финальный template для будущих глав. Цель аудита - отделить контракт поведения от временной реализации перед Phase 2 extraction.

## 1. Current Behavior Contract

### 1.1 Действия ученика, которые должны работать

| Действие | Обязательное поведение |
| --- | --- |
| Нажать `Запустить` | В обычном motion mode время `t` плавно растёт через `requestAnimationFrame`, точка движется, графики и формула синхронно обновляются. |
| Нажать `Пауза` | Анимация останавливается, `data-current-time` перестаёт заметно расти, текущее состояние сохраняется. |
| Нажать `Сбросить` | Состояние возвращается к сценарию `forward`: `x₀ = 0`, `v = 2`, `t = 0`; quiz feedback сбрасывается. |
| Изменить скорость `v` | Меняются направление/длина стрелки, наклон `x(t)`, график `v(t)`, численные значения, `Δx = vt`, подсветка `v` и `vt`. |
| Изменить время `t` вручную в details | Анимация ставится на паузу, текущее состояние пересчитывается без рассинхрона. |
| Изменить `x₀` в details | Линия `x(t)` сдвигается, координата и подстановка обновляются, подсветка относится к `x₀`. |
| Выбрать сценарий `вперёд` | `x₀ = 0`, `v = 2`, `t = 0`; после запуска точка едет вправо, линия `x(t)` идёт вверх. |
| Выбрать сценарий `стоит` | `x₀ = 2`, `v = 0`, `t = 0`; точка стоит, `v(t)` лежит на нуле, `x(t)` горизонтален. |
| Выбрать сценарий `назад` | `x₀ = 4`, `v = -2`, `t = 0`; точка едет назад, `x(t)` идёт вниз. |
| Открыть `Показать подробнее` | Появляются Formula/details controls, ручной `t`, `x₀`, `v(t)`, точные значения и подстановка. |
| Ответить на проверку внутри лаборатории | Correct/wrong feedback объясняет связь скорости и наклона, а не просто показывает статус. |
| Ответить на нижнюю проверку главы | Feedback закрепляет, что `x(t)` - не дорога по карте. |
| Включить `prefers-reduced-motion: reduce` | Авто-анимация не запускается; кнопка работает как `Шаг вперёд`, ручные controls продолжают обновлять сцену. |

### 1.2 Обязательные состояния лаборатории

| State | Contract |
| --- | --- |
| Initial | `forward`, `x₀ = 0`, `v = 2`, `t = 0`; guidance: `Нажми «Запустить»...`. |
| Playing | `data-playing="true"`, `data-animation-state="running"`, play button text `Пауза`. |
| Paused | `data-playing="false"`, `data-animation-state="paused"`, play button text `Запустить` unless reduced motion. |
| End of timeline | При достижении `T_MAX = 8` animation stops. При новом запуске с конца `t` возвращается к `0`. |
| Reduced motion | `playButton.dataset.mode = "step"`, button label `Шаг вперёд по времени`, RAF не должен идти. |
| Details collapsed | `[data-details-panel]` hidden, button `Показать подробнее`. |
| Details expanded | `[data-details-panel]` visible, button `Скрыть подробности`, `aria-expanded="true"`. |
| Scenario selected | Соответствующая кнопка `[data-scenario]` имеет `aria-pressed="true"`. |
| Manual slider input | Active scenario сбрасывается, данные пересчитываются сразу. |
| Quiz correct/wrong | Button получает `is-correct` или `is-wrong`; feedback меняет текст и `data-state`. |

### 1.3 Data markers, которые являются контрактом

Эти markers уже используются тестами или являются полезным boundary для Phase 2. Их нельзя удалять без замены тестового контракта.

| Marker | Назначение |
| --- | --- |
| `[data-uniform-motion-lab]` | Root лаборатории и стабильная точка для tests/behavior. |
| `data-visual-target="v1"` | Production chapter visual marker; должен быть только на `/chapters/uniform-motion/`. |
| `data-current-time` | Текущее время для проверки animation/pause/reduced motion. |
| `data-current-x` | Текущая координата для проверки синхронизации и будущего extraction. |
| `data-motion-direction` | `forward/backward/still`; useful contract для стрелки, текста и scenarios. |
| `[data-play-toggle]`, `[data-reset]` | Основные controls. |
| `[data-input="v"]`, `[data-input="x0"]`, `[data-input="t"]` | Главные параметры модели. |
| `[data-output]`, `[data-value]`, `[data-substitution]` | Численные значения, details и formula substitution. |
| `[data-polyline="x"]`, `[data-current-polyline="x"]`, `[data-point="x"]` | Base/current layer графика `x(t)`. |
| `[data-polyline="v"]`, `[data-current-polyline="v"]`, `[data-point="v"]` | Base/current layer графика `v(t)`. |
| `[data-motion-point]`, `[data-velocity-arrow]`, `[data-motion-x-label]` | Motion track state. |
| `[data-projection="x"]`, `[data-projection-line]` | Projection layer на `x(t)`. |
| `[data-graph-note="x"]`, `[data-graph-note="v"]` | Текстовое объяснение графиков. |
| `[data-guidance]`, `[data-observation]` | Student-facing live guidance. |
| `[data-details-toggle]`, `[data-details-panel]` | Progressive disclosure. |
| `[data-scenario]` | Presets `forward/still/backward`. |
| `[data-answer]`, `[data-feedback]` | Проверка внутри лаборатории. |
| `[data-formula-token]`, `[data-formula-highlight]` | Подсветка `x₀`, `v`, `t`, `vt`. |

### 1.4 VisualTarget checks

Обязательный contract:

- `/chapters/uniform-motion/` должен содержать `[data-uniform-motion-lab][data-visual-target="v1"]`.
- `/lab-preview/` не должен содержать `data-visual-target="v1"`.
- `visualTarget` - не просто CSS флаг. Это marker того, что production-глава использует текущий visual target v1.
- `lab-preview` остаётся preview/demo surface и не должен автоматически наследовать production visual target.

### 1.5 Разделение `/chapters/uniform-motion/` и `/lab-preview/`

| Поверхность | Contract |
| --- | --- |
| `/chapters/uniform-motion/` | Student-first chapter route. Сначала лаборатория, потом FormulaScene, потом misconception/summary/check. Использует content collection и `UniformMotionLab visualTarget`. |
| `/lab-preview/` | Demo/preview page для общей Astro-основы и компонентного showcase. Использует `UniformMotionLab` без `visualTarget`. |

Нельзя в Phase 2 случайно сделать так, чтобы preview стал production-главой или production marker попал в preview.

## 2. Learning Flow Contract

### 2.1 Порядок главы

Контракт текущей главы:

1. Intro с главной мыслью.
2. `#lab`: живая лаборатория как первое действие.
3. `#formula`: `FormulaScene` как объяснение уже увиденного движения.
4. Misconception/summary.
5. `#check`: нижняя проверка про график `x(t)` как не-дорогу.

Этот порядок нельзя менять в Phase 2 extraction. Если extraction меняет DOM layout, student route должен остаться тем же.

### 2.2 Физическая формулировка `vt`

Контракт формулировок:

- `vt = Δx` в смысле изменения координаты за время `t`.
- `vt` не называть путём `S`.
- Для `v < 0` `Δx` может быть отрицательным.
- Допустимые student-friendly формулировки:
  - `изменение координаты за время t`;
  - `насколько координата изменилась`;
  - `что добавилось к стартовой координате`.

Опасные формулировки:

- `сколько метров точка проехала`;
- `путь S`;
- `расстояние`, если речь идёт о signed `Δx`.

### 2.3 График `x(t)` не дорога

Контракт должен сохраняться в трёх местах:

- motion card: `Это не дорога на карте...`;
- misconception block: график `x(t)` - не карта пути;
- нижняя проверка: вопрос именно про то, почему `x(t)` не дорога по карте.

В Phase 2 нельзя заменить это на декоративный graph-only visual без текстовой защиты misconception.

### 2.4 Проверки не дублируют друг друга

| Проверка | Что проверяет |
| --- | --- |
| Внутри лаборатории | `скорость = наклон графика x(t)`: если увеличить скорость, линия становится круче. |
| Нижняя проверка главы | `график x(t) - не дорога`: он показывает изменение координаты во времени. |

Если будущий `MiniQuiz` будет extracted, нужно сохранить разные учебные роли этих двух проверок.

### 2.5 Формула после движения

`FormulaScene` должна продолжать звучать как объяснение уже увиденного:

- заголовок: `Формула записывает то, что ты увидел`;
- текст: старт `x₀` плюс изменение координаты `Δx`;
- `FormulaScene` не должна снова становиться первым главным действием главы.

## 3. Technical Boundaries

### 3.1 Что сейчас находится в `UniformMotionLab`

`UniformMotionLab.astro` сейчас включает:

- markup всей лабораторной консоли;
- visualTarget branching;
- основной motion track;
- SVG-график `x(t)`;
- speed/control dock;
- сценарии `forward/still/backward`;
- quiz внутри лаборатории;
- details panel;
- formula/substitution block;
- `x₀` и `t` sliders;
- SVG-график `v(t)`;
- DOM queries через `mustFind`;
- local state `{ x0, v, t }`;
- `requestAnimationFrame` loop;
- reduced-motion handling;
- update/render logic для точек, линий, стрелки, notes, guidance;
- text copy для observation/guidance/feedback;
- local CSS visual system для v1.

Это приемлемо для prototype v1, но не является final architecture.

### 3.2 Что пока допустимо держать внутри

До Phase 2 допустимо не выносить:

- локальный RAF playback loop;
- local DOM sync для одной лаборатории;
- сценарии `forward/still/backward`;
- конкретные тексты guidance/feedback;
- details panel;
- локальную CSS-реализацию visualTarget v1;
- quiz внутри лаборатории.

Причина: extraction до второго use case может создать speculative API.

### 3.3 Кандидаты на extraction в Phase 2

| Кандидат | Почему выносить |
| --- | --- |
| `ControlDock` | Play/reset/slider/presets понадобятся в `AccelerationScene`. |
| `MotionTrack` visual skin | Ось, точка, стрелка, readout нужны для 1D motion scenes. |
| `InstrumentGraph` | `x(t)`, `v(t)` и будущий `v(t)` acceleration graph требуют общей graph grammar. |
| Graph mapping helpers | `mapPoint`, `toPolyline`, projection/current point logic частично повторятся. |
| `LabConsole` shell | Main lab console должен быть общим visual primitive. |
| Formula highlight/substitution pattern | `x₀/v/t/vt` сегодня локальные, но принцип active term нужен в acceleration. |
| `MiniQuiz` shell | Feedback/accessibility повторятся в каждой главе. |

### 3.4 Что нельзя считать final architecture

- `UniformMotionLab` как монолитный all-in-one component.
- `visualTarget` CSS внутри конкретной лаборатории как единственная design system.
- `FormulaScene` без props/content data.
- Quiz logic внутри страницы/компонента без общей schema.
- Content collection, которая хранит только базовые тексты.
- Graph SVG, завязанный только на один размер и один набор data selectors.
- Text copy внутри simulation script.
- Локальные CSS-классы `.pl-*` как уже готовые primitives без API и documented contract.

### 3.5 Где смешаны physics, DOM, animation, content strings и styles

| Слой | Сейчас где смешан |
| --- | --- |
| Physics | Чистые функции есть в `kinematics.ts`, но `delta = state.v * state.t`, domains, scale mapping и graph rendering живут в компоненте. |
| DOM | `mustFind`, event listeners, `dataset`, SVG attributes и text updates находятся в одном script. |
| Animation | RAF, playback state, reduced-motion step и visual class/data state находятся рядом с business logic. |
| Content strings | Guidance, feedback, observation, graph notes зашиты в component script. |
| Visual styles | Main console, graph, track, controls, details и v1 target CSS живут внутри `UniformMotionLab.astro`. |

Это не ошибка для prototype v1. Это boundary, который нужно учитывать перед extraction.

## 4. Test Gaps

### 4.1 Что уже покрыто

| Test file | Что покрывает |
| --- | --- |
| `tests/physics/kinematics.test.mjs` | `uniformPosition`, `uniformVelocity`, `normalizeUniformMotionTime`, direction, full/partial series. |
| `tests/screenshots/uniform-motion.spec.ts` | Глава открывается на 4 viewports, есть FormulaScene, lab, `visualTarget=v1`, no horizontal scroll, FormulaScene click states, нижняя проверка. |
| `tests/screenshots/lab-preview.spec.ts` | Preview screenshots, no horizontal scroll, `visualTarget=v1` отсутствует, Play/Pause, time grows, pause stops, details, manual `t`, `v` changes, formula highlight, lab quiz, reduced motion step. |

### 4.2 Хрупкие проверки

| Проверка | Почему хрупкая |
| --- | --- |
| `getByText("prototype/demo")`, `authorReviewRequired` | Текст статуса может быть перенесён в author/dev UI без изменения учебного контракта. |
| `.track-tick` count = 3 | Это visual implementation detail, а не learning behavior. |
| `.graph-tick-labels` | Конкретный class может измениться при `InstrumentGraph` extraction. |
| `page.getByRole("button", { name: /Пауза/ })` сразу после click | Может быть чувствительно к timing и reduced-motion/media conditions. |
| `data-scene-graph="slope-family"` | FormulaScene internal graph implementation detail. |
| Exact feedback snippets | Нужны для content contract, но могут мешать нормальному wording pass. Лучше проверять смысловые ключи аккуратно. |

### 4.3 Чего не хватает перед extraction

| Missing check | Зачем нужен |
| --- | --- |
| `/chapters/uniform-motion/` Play/Pause/Reset behavior | Сейчас behavior сильнее покрыт на `/lab-preview/`, но production route тоже должен защищаться. |
| Scenario checks на production route | `forward/still/backward` должны быть contract до extraction. |
| Manual time slider pause check на production route | Важный синхронизационный contract. |
| Reduced motion на production route | Сейчас reduced motion покрыт preview. Production route тоже зависит от same lab, но marker route стоит проверить. |
| `v < 0` graph/observation checks | Нужно зафиксировать negative velocity semantics до acceleration work. |
| `v = 0` v(t) zero-line check | Важно, чтобы line не "пропадала". |
| Details toggle accessibility check | `aria-expanded`, `hidden`, focus order. |
| Console errors check | Перед extraction полезно ловить runtime errors на all viewports. |
| Content wording guard | Проверка, что `vt` не называется `путь S`, может быть docs/content lint позже. |

### 4.4 Как тесты должны защищать смысл

Перед Phase 2 тесты лучше ориентировать на смысловые contracts:

- current time changes while playing and stops while paused;
- `v > 0`, `v = 0`, `v < 0` produce different direction/notes;
- graph layers exist and update, not exact pixel positions;
- `data-visual-target` separated between chapter and preview;
- no horizontal scroll on required viewports;
- reduced motion preserves manual/step interaction;
- `vt`/`Δx` wording remains physically accurate;
- first learning route remains lab before formula.

Не стоит делать tests слишком зависимыми от:

- class names for visual internals;
- exact SVG coordinates;
- exact number of decorative ticks;
- exact glow/panel structure;
- exact text wrapping.

## 5. Known Limitations

| Limitation | Current status | Why it matters |
| --- | --- | --- |
| Нет полноценного prediction step | Есть guidance и action-contract, но ученик не фиксирует предсказание перед изменением `v`. | Master plan v2 требует prediction before manipulation. |
| Нет exam task | Есть conceptual checks, но нет original CT/CE-style task. | Нет transfer в экзаменационный формат. |
| Нет `UnitCheck` | Единицы показываются, но не проверяются интерактивно. | Ошибки СИ/округления не тренируются. |
| `FormulaScene` не data-driven | Компонент standalone, без props/content binding. | Трудно переиспользовать для acceleration. |
| Нет structured misconception model | Misconception есть текстом, но не schema. | Нельзя системно строить главы вокруг ловушек. |
| `FormulaScene` не связана statefully с лабораторией | Ученик видит близкий смысл, но state не общий. | Формула не отражает live state лаборатории. |
| Нет task/quiz collection | Нижняя проверка хранится в chapter content, lab quiz внутри component. | Feedback/task architecture будет дублироваться. |
| Possible mobile risks | Сейчас screenshots проходят, но extraction может уменьшить graph/motion or create card wall. | Mobile - главный risk при primitives. |
| Possible a11y risks | Есть labels/aria-live/focus basics, но нет axe/pass и нет full keyboard flow audit. | Extraction может сломать accessibility незаметно. |
| VisualTarget v1 локален | v1 styles живут внутри `UniformMotionLab`. | Если второй chapter скопирует CSS, появится drift. |

## 6. Visual Risk Review

UI не менялся, поэтому полный score по `docs/visual-quality-rubric.md` не ставится. Ниже - risk review текущего состояния.

### 6.1 Visual risks в текущей главе

| Risk | Where | Why it matters |
| --- | --- | --- |
| Inner panel weight может снова стать равным | `UniformMotionLab` details, graph, speed, quiz panels | При extraction легко вернуть "много одинаковых cyan cards". |
| VisualTarget styles локальные | `.uniform-lab[data-visual-target="v1"]` | Второй chapter может начать копировать styles вместо primitive. |
| FormulaScene и lab оба визуально сильные | `/chapters/uniform-motion/` после lab идет FormulaScene | Если hierarchy ослабнет, ученик снова увидит две конкурирующие сцены. |
| Status badges в hero | `prototype/demo`, `authorReviewRequired` | Для ученика это не главный смысл; для production/student UI стоит отделить author status. |
| Details panel может стать стеной controls | `Показать подробнее` | При добавлении UnitCheck/exam layer нельзя превращать первый экран в cockpit. |

### 6.2 Где возможен generic/dashboard drift

- Если `LabConsole` будет extracted как generic card shell вместо instrument scene.
- Если `ControlDock` станет просто row of buttons/sliders без связи с graph/motion.
- Если `InstrumentGraph` потеряет current point, units и projection layer.
- Если bottom panels получат одинаковые borders/glow с main console.
- Если UI primitives будут названы/сделаны как generic dashboard components, а не physics learning instruments.

### 6.3 Где mobile может стать слабым местом при extraction

- Graph and motion panels могут уменьшиться, если primitive получит desktop-first fixed aspect.
- Details controls могут подняться выше результата действия.
- Control dock может стать списком отдельных кнопок.
- `FormulaScene` plus lab может снова создать длинную стену панелей.
- Hidden details and expanded details need separate mobile screenshots, not only default state.

### 6.4 Что важно не ухудшить

- Первый meaningful action: лаборатория идёт до формулы.
- Motion track and `x(t)` graph remain main objects.
- Yellow current point and active variable remain meaningful, not decorative.
- Graph `x(t)` keeps axes, units, current point and explanation.
- Play/Pause/Reset remain visually and keyboard accessible.
- No horizontal scroll on 390/360.
- `/lab-preview/` remains separate from production visual target.

## 7. Implementation Opinion

### 7.1 Что в текущей реализации реально нравится

- `UniformMotionLab` уже доказывает product direction: один parameter change синхронно меняет движение, график, numbers and formula hints.
- `requestAnimationFrame` behavior is understandable and bounded: `t` grows to `T_MAX`, then stops; restart from end returns to `0`.
- Reduced motion не является afterthought: есть step mode, ручные controls продолжают работать.
- Data markers уже дают хорошую основу для behavior tests before extraction.
- `kinematics.ts` отделяет базовую физику от DOM, и это правильное ядро для Phase 2/3.
- Student flow был исправлен: сначала действие/лаборатория, потом formula explanation.

### 7.2 Что мешает разработке

- `UniformMotionLab.astro` слишком большой: markup, script, text copy, SVG rendering, quiz, details and visual styles находятся в одном файле.
- Локальные visualTarget styles трудно переиспользовать без копирования.
- Text strings внутри component script не проходят через content model.
- FormulaScene не получает данные из главы и не может синхронизироваться с lab state.
- Тесты частично проверяют implementation details, которые будут мешать extraction.

### 7.3 Что опасно трогать перед Phase 2

- RAF/playback logic: трогать только при явном bug, иначе легко сломать sync.
- Reduced-motion behavior: оно уже покрыто тестом, но может сломаться при refactor controls.
- `data-visual-target` separation: нельзя случайно распространить v1 marker на preview.
- Graph SVG mapping: без нового shared graph helper лучше не менять coordinates/padding.
- Student learning order: не возвращать FormulaScene перед lab.

### 7.4 Micro-fixes перед extraction

Эти fixes не обязательны для текущего docs-only аудита, но полезны как маленький ticket до Phase 2:

1. Добавить production-route behavior checks для Play/Pause/Reset, scenarios and reduced motion. Сейчас часть поведения защищена через `/lab-preview/`, но extraction будет затрагивать production route.
2. Ослабить тестовую зависимость от `.track-tick` count and `.graph-tick-labels`, заменить на смысловые checks: axis/labels/current point exist and no horizontal scroll.
3. Зафиксировать content wording guard для `vt = Δx`, чтобы будущие wording passes не вернули `путь S`.

### 7.5 Самый безопасный следующий ticket

Самый безопасный следующий ticket: `uniform-motion-screenshot-hardening`.

Причина:

- он продолжает Phase 1, а не начинает extraction;
- он уменьшит риск сломать student flow при Phase 2;
- он не требует нового UI;
- он позволит заменить хрупкие проверки на behavior/data-marker contracts;
- он даст более чистую основу для `extract-control-dock` и `extract-instrument-graph-v0`.

## 8. Phase 2 Readiness Summary

Phase 2 можно начинать только после того, как команда принимает эти boundaries:

- uniform-motion v1 - baseline, не final template;
- extraction должен быть минимальным и driven by acceleration needs;
- first primitives: `ControlDock`, `InstrumentGraph`, `MotionTrack`, maybe `LabConsole`;
- no universal renderer yet;
- no new visual polish while extracting;
- tests should guard learning behavior, not exact local DOM.

Если эти boundaries не приняты, Phase 2 с высокой вероятностью превратится либо в большой rewrite, либо в копирование `UniformMotionLab` под новую главу.
