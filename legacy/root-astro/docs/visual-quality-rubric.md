# PhysicsLab Visual Quality Rubric

Дата: 2026-05-18  
Статус: обязательная рубрика для visual review UI-задач.

Этот документ задаёт, как агент и человек оценивают визуальное качество PhysicsLab. Он не заменяет `docs/design-and-learning-rules.md` и `docs/design-generation-workflow.md`; он добавляет практический review-gate, чтобы не принимать UI по принципу "вроде красиво".

## 1. What Good PhysicsLab UI Is

Хороший PhysicsLab UI - это интерактивная учебная сцена, где визуальный стиль помогает понять физическую модель.

Он не должен быть:

- generic dashboard;
- школьным электронным учебником с тёмной темой;
- постером с формулой;
- витриной glow-эффектов;
- набором одинаковых карточек;
- UI-kit showcase.

Он должен быть:

- интерактивной учебной сценой;
- прибором для наблюдения физики;
- визуально связанным набором: ситуация, график, формула, controls, feedback;
- mobile-first, а не desktop, сжатым в 360 px;
- построенным вокруг одного главного физического смысла на экран.

Контрольный вопрос:

```text
Что первым увидит ученик, что он нажмёт, и какую физическую связь он поймёт?
```

Если на вопрос нельзя ответить одной фразой, UI ещё не готов.

## 2. Visual Quality Scorecard

Шкала: 1-5.

- **1:** провал критерия; UI мешает пониманию.
- **3:** рабочий prototype; смысл можно понять, но есть заметные слабые места.
- **5:** production-quality для текущего этапа; визуальное решение поддерживает учебный смысл.

### Summary Table

| Критерий | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Focus | Непонятно, куда смотреть и что нажать | Главный объект есть, но конкурирует с соседними блоками | Один главный смысл виден сразу |
| Hierarchy | Все панели одинаково важные | Есть основной блок, но вторичные элементы шумят | Взгляд идёт по нужному маршруту |
| Physics clarity | Красиво, но физика не считывается | Физика понятна после чтения текста | Связь видна в сцене, графике и формуле |
| Style fit / Dark Anime Lab | Generic SaaS или школьный портал | Есть тёмный стиль и акценты, но без цельности | Узнаваемый PhysicsLab: dark lab, cyan/yellow semantics, приборность |
| Mobile composition | Desktop сжат в mobile, есть перегруз | Работает, но ключевые сцены мелкие | Mobile имеет собственную композицию и крупные действия |
| Visual noise | Glow, borders, частицы и декор везде | Шум есть, но не ломает смысл | Декор дозирован и подчинён физике |
| Typography/formula readability | Текст/формулы ломаются или мельчат | Читаемо, но плотность высокая | Формулы и текст легко читать на desktop/mobile |
| Graph readability | График как картинка без осей/единиц | Оси есть, но иерархия слабая | График читается как прибор с ясными осями и current state |
| Interaction affordance | Controls выглядят default или непонятно | Controls работают, но не выглядят частью сцены | Действия очевидны, доступны и визуально связаны с результатом |
| Production polish | Сырые div-карточки, случайные отступы | Prototype выглядит прилично, но местами грубо | Цельная система, стабильные отступы, states, focus, no overflow |

### 2.1 Focus

| Score | Описание |
| --- | --- |
| 1 | На экране одновременно конкурируют формула, график, маскот, quiz, несколько CTA и декоративный фон. Первый шаг неочевиден. |
| 3 | Главный объект есть, но рядом слишком много равновесных панелей или статусов. Ученик может понять маршрут после чтения. |
| 5 | Первый взгляд попадает в главный учебный прибор или действие. Остальное визуально вторично. |

Плохое решение: первый экран начинается с большого hero, служебных бейджей, FormulaScene, quiz и кнопки запуска ниже fold.  
Хорошее решение: "Нажми Запустить" рядом с точкой, графиком и коротким выводом "скорость меняет наклон".

### 2.2 Hierarchy

| Score | Описание |
| --- | --- |
| 1 | Все блоки имеют одинаковую рамку, glow, размер и контраст. |
| 3 | Main console выделяется, но inner panels всё ещё выглядят как сетка одинаковых карточек. |
| 5 | Есть ясный маршрут: формула/сцена -> движение/график -> controls -> feedback/details. |

Плохое решение: одинаковые cyan borders вокруг каждого блока.  
Хорошее решение: один сильный outer console, мягкие inner panels, тихие bottom panels.

### 2.3 Physics Clarity

| Score | Описание |
| --- | --- |
| 1 | Визуал выглядит эффектно, но не показывает физическую причинность. |
| 3 | Причинность есть, но требует длинного пояснения. |
| 5 | Изменение параметра сразу видно в движении, графике, числах и формуле. |

Плохое решение: график светится, но не видно текущей точки, осей и связи с движением.  
Хорошее решение: ученик меняет `v`, точка едет быстрее, наклон `x(t)` растёт, `vt` подсвечен.

### 2.4 Style Fit / Dark Anime Lab

| Score | Описание |
| --- | --- |
| 1 | UI похож на Bootstrap, Material, shadcn dashboard или школьный портал. |
| 3 | Палитра похожа, но форма и композиция generic. |
| 5 | Это тёмная лаборатория: instrument panels, cyan data, yellow active state, controlled glow, живой учебный тон. |

Плохое решение: белые карточки, стандартные pills, generic SaaS sections.  
Хорошее решение: dark glass console, приборная сетка, yellow current point, cyan graph links.

### 2.5 Mobile Composition

| Score | Описание |
| --- | --- |
| 1 | Desktop layout просто сжат; график мелкий; есть horizontal scroll или пустое поле справа. |
| 3 | Одна колонка работает, но главное действие или результат слишком низко/мелко. |
| 5 | Mobile имеет собственный порядок: hero/action -> scene -> graph -> controls -> feedback/details. |

Плохое решение: три колонки превращены в узкую стену панелей.  
Хорошее решение: на 360/390 px motion track и graph остаются крупными героями.

### 2.6 Visual Noise

| Score | Описание |
| --- | --- |
| 1 | Glow вокруг всего, частицы поверх текста, фон конкурирует с формулой. |
| 3 | Декор местами заметен, но основная физика читается. |
| 5 | Декор работает как атмосфера и hierarchy, не как отдельный слой внимания. |

Плохое решение: звездное поле и кометы поверх подписи графика.  
Хорошее решение: звезды в фоне, приборные линии только вокруг важной сцены.

### 2.7 Typography / Formula Readability

| Score | Описание |
| --- | --- |
| 1 | Формула ломает ширину, текст мелкий, line-height плотный, glow снижает резкость. |
| 3 | Всё читаемо, но формула или вторичный текст требуют напряжения на mobile. |
| 5 | Формула крупная и резкая, переменные читаются, текст дышит, нет overflow. |

Плохое решение: oversized math display с blur и отрицательным tracking.  
Хорошее решение: формула как clear instrument display, `v`/active variable выделены без потери читаемости.

### 2.8 Graph Readability

| Score | Описание |
| --- | --- |
| 1 | График декоративный: нет осей, единиц, current point, ticks или подписи смысла. |
| 3 | Оси и линия есть, но сетка/линия/readout конкурируют или слишком мелкие. |
| 5 | Оси, ticks, единицы, current point и projection lines читаются за секунду. |

Плохое решение: красивая линия без `t`, `x`, units и текущего значения.  
Хорошее решение: instrument graph с cyan base line, yellow current point, readout `t = ...`, `x = ...`.

### 2.9 Interaction Affordance

| Score | Описание |
| --- | --- |
| 1 | Controls выглядят как default HTML или непонятно, что они меняют. |
| 3 | Controls понятны, но визуально отделены от результата. |
| 5 | Действие, изменяемая величина и результат визуально связаны. |

Плохое решение: slider где-то внизу, а результат после прокрутки.  
Хорошее решение: control dock рядом со сценой, active variable подсвечена в формуле и графике.

### 2.10 Production Polish

| Score | Описание |
| --- | --- |
| 1 | Случайные отступы, raw divs, clipped text, no focus states, uneven borders. |
| 3 | Prototype аккуратный, но есть локальные шероховатости и inconsistent states. |
| 5 | Цельная система состояний, отступов, responsive behavior, accessibility basics and no horizontal scroll. |

Плохое решение: кнопки разной высоты, текст вылезает, focus invisible.  
Хорошее решение: stable dimensions, visible focus, consistent radii, no overlap, no console errors.

## 3. PhysicsLab Visual Anti-Patterns

| Anti-pattern | Почему плохо | Что делать вместо |
| --- | --- | --- |
| Много одинаковых cyan borders | Всё становится одинаково важным | Один сильный outer console, quiet inner panels |
| Glow вокруг всего | Glow перестаёт быть сигналом | Glow только для current point, active variable, key graph line |
| График как декоративная картинка | Ученик не учится читать график | Оси, единицы, ticks, current point, readout |
| Controls как default HTML | Сцена выглядит сырой и не PhysicsLab | Control dock с clear action hierarchy |
| Desktop, сжатый в mobile | Mobile становится стеной мелких панелей | Отдельная mobile композиция |
| Mascot рядом с плотной формулой | Маскот конкурирует с главным смыслом | Маскот только для подсказки, ловушки, summary |
| Частицы поверх текста | Ухудшается чтение | Фоновые частицы вне текстового слоя или убрать |
| Формула ради формулы | Формула выглядит как постер | Формула после наблюдения, с variables/units/conditions |
| Карточки вместо единой лабораторной сцены | UI распадается на dashboard | Main lab console как цельный прибор |
| Красный как обычный акцент | Red теряет смысл ошибки | Красный только для trap/error |
| Yellow everywhere | Главный action теряется | Yellow только для action/current focus |
| Hover-only смысл | Mobile и keyboard users теряют информацию | Смысл видим без hover; hover только уточняет |

## 4. Required Visual Review Report

После каждой UI-задачи агент обязан добавить в отчёт visual review section. Это не заменяет changelog.

Минимальный шаблон:

```md
## Visual Review

First thing a student sees:
- ...

Main learning focus:
- ...

Possible visual noise:
- ...

Mobile-specific notes:
- 390 px:
- 360 px:

What does not look like PhysicsLab yet:
- ...

Rubric score:
| Criterion | Score | Notes |
| --- | --- | --- |
| Focus | /5 | |
| Hierarchy | /5 | |
| Physics clarity | /5 | |
| Style fit / Dark Anime Lab | /5 | |
| Mobile composition | /5 | |
| Visual noise | /5 | |
| Typography/formula readability | /5 | |
| Graph readability | /5 | |
| Interaction affordance | /5 | |
| Production polish | /5 | |

Implementation opinion:
- What worked:
- What is still weak:
- What I would change next:
- What may become technical debt:
```

Score must be honest. A visually attractive screen can still score low if physics clarity or mobile composition is weak.

## 5. Screenshot Policy

### Required Viewports

Every UI task that changes visible output must check:

| Viewport | Purpose |
| --- | --- |
| Desktop | Main production composition |
| Tablet | Intermediate layout and dense panels |
| Mobile 390 px | Common modern mobile width |
| Narrow mobile 360 px | Stress test for no horizontal scroll and text fit |

### Required States

Capture or inspect states that matter for the task:

- default/initial;
- primary action started;
- paused/stopped/reset if simulation;
- changed key parameter;
- quiz correct;
- quiz wrong;
- details expanded/collapsed;
- reduced motion;
- focus state when controls changed;
- error/trap state only if the task includes it.

### Generated Screenshots Are Enough When

Generated screenshots from `npm run screenshots` are enough when:

- change is small and local;
- existing screenshot tests cover the page;
- there is no new visual reference image;
- no new interactive state is introduced;
- no high-fidelity visual target is being matched.

### Playwright Visual Baseline Is Needed When

Use Playwright screenshot baselines or stronger regression gates when:

- a primitive becomes shared by 2-3 pages;
- a visual target is accepted as v1;
- UI changes touch main lab console, graph, motion track, formula display or control dock;
- mobile composition is part of the acceptance criteria;
- a bug previously caused horizontal scroll, clipped text or missing controls.

### Reference-vs-Current Visual Diff Is Needed When

Create a visual diff review document when:

- there is an approved reference image;
- user says the implementation is close in structure but not in style;
- the issue is visual system quality, not layout or logic;
- the next pass must be limited to top-priority fixes;
- design-board or high-fidelity prototype is being promoted toward production.

Visual diff should list concrete differences:

- reference behavior/appearance;
- current behavior/appearance;
- why current is worse;
- exact CSS/layout correction.

## 6. Tooling Roadmap

### Phase Now

Use now:

- Playwright screenshots;
- manual/agent rubric review;
- reference-vs-current visual diff;
- browser/manual checks for no horizontal scroll;
- existing `npm run check`, `npm run build`, `npm run screenshots`.

This is enough while PhysicsLab has few pages and primitives are still emerging.

### Phase Later

Add later, after primitives and 2-3 chapters exist:

| Tooling | When to add | Why not now |
| --- | --- | --- |
| Playwright `toHaveScreenshot` baselines | When shared primitives stabilize | Too brittle while layout/visual language is changing |
| axe accessibility checks | When main components stabilize | Useful, but needs scoped rules and false-positive handling |
| Storybook for primitives | After `LabConsole`, `InstrumentGraph`, `ControlDock`, `FormulaCard` exist | Too much setup before real primitives |
| Chromatic / Percy / Argos | After multiple pages depend on same primitives | External workflow overhead is premature for one or two chapters |
| Visual token linting | When design tokens settle | Current visual language still evolving |

Default rule: do not add tooling that creates more maintenance than signal.

## 7. Decision Rule

UI pass is not complete if any of these scores are below 4/5:

- Focus;
- Physics clarity;
- Mobile composition.

This rule holds even if:

- `npm run build` passes;
- screenshots are generated;
- desktop screenshot looks good;
- the component is visually impressive;
- the implementation matches a reference image superficially.

Reason: PhysicsLab UI exists to teach physics. A screen that is beautiful but unfocused, unclear, or broken on mobile is not a successful UI pass.

## 8. Implementation Opinion

### What can be applied now

- The scorecard can be used immediately in final reports for UI tasks.
- The required visual review report can be used without new tooling.
- Screenshot policy fits the current Playwright workflow.
- Reference-vs-current diff is already proven useful for design-board passes.
- The decision rule gives a clear stop condition for "pretty but not accepted".

### What is too early to automate

- Full pixel baselines for every page are premature. The visual system is still moving, so strict baselines would create churn.
- Storybook is premature until primitives are extracted. Otherwise it becomes a gallery of unstable prototypes.
- Chromatic/Percy/Argos are premature before multiple production pages depend on shared visual primitives.
- Automated scoring of focus/physics clarity is not realistic. This needs human/agent judgment.

### Checks that can become brittle

- Pixel-perfect snapshots before layout stabilizes.
- Tests that depend on exact text wrapping or animation frame timing.
- Visual checks that compare glow/blur too strictly.
- DOM selectors tied to implementation details instead of stable data attributes.
- Mobile screenshots taken without checking actual horizontal scroll.

### How not to turn visual QA into bureaucracy

- Use the full rubric only for UI tasks, visual target passes and shared primitives.
- For docs-only or physics-only changes, do not require visual scoring.
- Keep scores short and evidence-based: one sentence per criterion is enough unless a score is below 4.
- Do not block on minor polish if focus, physics clarity and mobile composition are all 4+.
- Use the rubric to choose the next concrete fix, not to write long defensive reports.

The goal is not to make every screen perfect. The goal is to prevent the known failure modes: generic dashboard, poster formula, mobile wall of cards, decorative graph and glow/noise replacing physical meaning.
