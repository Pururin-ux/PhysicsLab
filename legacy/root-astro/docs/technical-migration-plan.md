# PhysicsLab Technical Audit and Migration Plan

Дата аудита: 2026-05-15

Цель документа: описать текущую структуру PhysicsLab, найти повторяющиеся UI и learning-блоки, определить что можно временно оставить на HTML/CSS/JS, и разложить будущий переход на Astro + MDX + Tailwind + TypeScript на маленькие безопасные этапы.

Ограничение текущей задачи: существующие страницы, стили, скрипты и ассеты не меняются.

## 1. Текущая структура проекта

```text
PhysicsLab/
  .gitattributes
  index.html
  PhysicsLab_research_report.pdf
  assets/
    manga-girl.png
    space-cat.jpg
  css/
    style.css
  docs/
    agent-instructions.md
    asset-policy.md
    content-rules.md
    design-and-learning-rules.md
    physics-review-checklist.md
    roadmap.md
    technical-migration-plan.md
  js/
    mechanics.js
  pages/
    index.html
    mechanics-menu.html
    mechanics.html
```

### 1.1 Root

- `index.html` - корневой редирект на `pages/index.html`. Это техническая точка входа для открытия проекта из корня.
- `.gitattributes` - включает автоопределение текстовых файлов и нормализацию LF.
- `PhysicsLab_research_report.pdf` - исследовательский отчет и спецификация, из которых выведены правила в `docs/`.

### 1.2 Pages

- `pages/index.html` - лендинг с hero-экраном, фоновой картинкой, CTA и сеткой модулей.
- `pages/mechanics-menu.html` - оглавление раздела "Механика": маршруты, панель прогресса, карточки глав, фильтрация, localStorage-прогресс, заглушка для неготовых глав.
- `pages/mechanics.html` - полноценная учебная глава про равномерное прямолинейное движение: теория, формула, таблица, разобранная задача, p5.js-визуализация, квиз, персонажные реплики, мост к следующей главе.

### 1.3 Styles

- `css/style.css` - глобальные стили лендинга и часть старых переиспользуемых учебных примитивов: hero, module cards, math display, term cards, step blocks, reduced motion.
- `pages/mechanics-menu.html` и `pages/mechanics.html` содержат собственные inline `<style>` блоки.
- `pages/mechanics-menu.html` и `pages/mechanics.html` подключают Tailwind через CDN и задают `tailwind.config` прямо в HTML.

### 1.4 JavaScript

- `js/mechanics.js` - отдельный p5.js sketch для визуализации равномерного движения. Он читает DOM (`canvas-wrapper`, `live-x`, `live-t`, `live-v`) и открывает глобальные функции `window.setScenario` и `window.togglePause`.
- `pages/mechanics-menu.html` содержит inline JS для прогресса, localStorage, фильтров маршрутов и блокировки неготовых глав.
- `pages/mechanics.html` содержит inline JS для квиза, анимации проверки единиц и управления сценариями визуализации.

### 1.5 Assets

- `assets/space-cat.jpg` - фон hero на главной.
- `assets/manga-girl.png` - персонаж главы и реплик.

По `docs/asset-policy.md` эти ассеты требуют отдельного asset audit: источник, автор, лицензия, дата добавления, разрешенное использование.

## 2. Технические наблюдения

1. Проект уже имеет сильную продуктовую идентичность: темный фон, желтый акцент, мемный тон, персонаж, физические графики и интерактив.
2. Код пока работает как статический прототип. Это нормально для текущей стадии, но масштабирование новых глав будет дорогим из-за дублирования HTML, inline CSS и inline JS.
3. Tailwind используется через CDN в двух страницах, а не как build-time pipeline. Это удобно для прототипа, но плохо для типизации, повторного использования и контроля дизайн-токенов.
4. Учебные блоки уже повторяются как паттерны, но не вынесены в компоненты.
5. Контент главы, логика квиза и feedback сейчас живут рядом в одном HTML-файле. При росте курса это станет главным источником ошибок.
6. p5.js-визуализация технически отделена в `js/mechanics.js`, но связана с HTML через глобальные функции и конкретные DOM id.
7. Прогресс работает локально через localStorage. Это можно сохранить на первом этапе миграции.

## 3. Повторяющиеся UI и Learning-Блоки

### 3.1 Карточка главы

Где сейчас:

- `pages/index.html`: module cards `.card` для разделов курса.
- `css/style.css`: `.card`, `.card-num`, hover arrow.
- `pages/mechanics-menu.html`: 15 карточек `.chapter-card` для глав механики.
- `pages/mechanics-menu.html`: data-атрибуты `data-chapter`, `data-level`, `data-routes`, `data-trap`, `data-requires`.
- `pages/mechanics-menu.html`: JS динамически добавляет в карточки бейджи, прогресс и чекбоксы.

Проблема:

- Структура карточки главы дублируется вручную.
- Данные главы смешаны с разметкой.
- Прогресс-виджет вставляется через `innerHTML`.

Будущий компонент:

- `ChapterCard`
- `ModuleCard`
- `ChapterProgressWidget`

Рекомендуемая модель данных:

```ts
type ChapterCardData = {
  id: string;
  title: string;
  href: string;
  module: string;
  outcome: string;
  level: "basic" | "advanced";
  routes: Array<"all" | "exam" | "traps" | "advanced">;
  requires?: string[];
  trap?: {
    title: string;
    text: string;
  };
  status: "available" | "planned" | "draft";
  reviewStatus?: "needs-physics-review" | "approved";
};
```

### 3.2 Контракт главы

Где сейчас:

- `pages/mechanics.html`: `#chapter-contract`
- `pages/mechanics.html`: `.contract-grid`, `.contract-item`

Содержит:

- время;
- prerequisites;
- список конкретных умений после главы;
- связь со следующей главой.

Проблема:

- Контракт захардкожен в HTML.
- Его нужно повторять в каждой главе с одинаковой структурой.

Будущий компонент:

- `ChapterContract`

Рекомендуемые props:

```ts
type ChapterContractProps = {
  estimatedTime: string;
  prerequisites: Array<{ label: string; href?: string }>;
  outcomes: string[];
  usedIn: Array<{ label: string; href?: string; note?: string }>;
};
```

### 3.3 Формульный блок

Где сейчас:

- `pages/mechanics.html`: `#formula-core`
- `pages/mechanics.html`: formula tooltips для `x`, `x0`, `v`, `t`
- `pages/mechanics.html`: `.formula-inline`
- `css/style.css`: `.math-display`

Сильные стороны:

- Формула визуально крупная и запоминающаяся.
- Переменные подсвечены семантическими цветами.
- Есть подсказки по переменным.

Проблемы:

- Подсказки hover-only, на мобильных и клавиатуре это риск.
- Формула не имеет структурированного source-of-truth.
- Условия применимости и "когда нельзя" не встроены в этот блок как обязательные поля.

Будущий компонент:

- `FormulaCard`
- `FormulaToken`

Рекомендуемая модель:

```ts
type FormulaCardData = {
  id: string;
  title: string;
  formula: string;
  meaning: string;
  variables: Array<{
    symbol: string;
    label: string;
    units: string;
    colorToken?: "position" | "velocity" | "time" | "acceleration";
  }>;
  conditions: string[];
  notFor: string[];
  commonMistakes: string[];
  authorReviewRequired: true;
};
```

### 3.4 Таблица переменных и отношений

Где сейчас:

- `pages/mechanics.html`: semantic badges для `x`, `v`, `t`, `a`.
- `pages/mechanics.html`: таблица знаков скорости и поведения графика.
- `pages/mechanics.html`: блок "Дано" в разобранной задаче.

Проблема:

- Таблицы и списки величин каждый раз придется верстать вручную.
- Семантические цвета есть, но нет единого компонента и typed schema.

Будущие компоненты:

- `VariableTable`
- `SemanticBadge`
- `GivenDataCard`

Рекомендуемая модель:

```ts
type VariableInfo = {
  symbol: string;
  name: string;
  units: string;
  meaning: string;
  commonMistake?: string;
};
```

### 3.5 Разобранная задача

Где сейчас:

- `pages/mechanics.html`: `#solved-example`
- `pages/mechanics.html`: `.solution-step`
- `pages/mechanics.html`: `.solution-step-num`
- `pages/mechanics.html`: отдельный answer block
- `pages/mechanics.html`: персонажная подсказка после решения

Сильные стороны:

- Есть условие, "Дано", решение по шагам, ответ и проверка единиц.
- Хорошо совпадает с правилами `docs/content-rules.md`.

Проблема:

- Задача захардкожена и не имеет метаданных: skill, difficulty, source, review status.
- Шаги решения не отделены от верстки.

Будущие компоненты:

- `WorkedExample`
- `SolutionStep`
- `AnswerBox`

Рекомендуемая модель:

```ts
type WorkedExampleData = {
  id: string;
  title: string;
  prompt: string;
  given: Array<{ symbol: string; value: string; units?: string }>;
  steps: Array<{ title: string; body: string; formula?: string }>;
  answer: string;
  unitCheck?: string;
  skills: string[];
  source: "original";
  authorReviewRequired: true;
};
```

### 3.6 Квиз

Где сейчас:

- `pages/mechanics.html`: `#knowledge-check`
- `pages/mechanics.html`: 5 `article` блоков с `data-quiz` и `data-correct`
- `pages/mechanics.html`: `.quiz-option`
- `pages/mechanics.html`: `QUIZ_DATA` в inline script
- `pages/mechanics.html`: `checkQuiz()` и `resetQuiz()`

Сильные стороны:

- Есть feedback для разных вариантов.
- Есть reset.
- Есть визуальная подсветка correct/incorrect.

Проблемы:

- Вопросы заданы дважды: HTML содержит варианты, JS содержит правильность и объяснения.
- Нет единой схемы квиза.
- Нет review status.
- Логика DOM-выбора будет копироваться в каждой главе.

Будущие компоненты:

- `MiniQuiz`
- `QuizQuestion`
- `QuizOption`
- `QuizFeedback`

Рекомендуемая модель:

```ts
type QuizQuestion = {
  id: string;
  type: "recall" | "concept" | "graph" | "misconception" | "unit" | "examA" | "examB";
  prompt: string;
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
  }>;
  skillTags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  authorReviewRequired: true;
};
```

### 3.7 Персонаж и реплика

Где сейчас:

- `pages/mechanics.html`: `.assistant-bubble`
- `pages/mechanics.html`: `assets/manga-girl.png` используется несколько раз.

Роли в текущей главе:

- предупреждение о графике;
- комментарий к проверке единиц;
- подсказка к визуализации;
- финальная навигационная реплика.

Проблема:

- Один и тот же HTML-фрагмент повторяется.
- Роль персонажа не описана как данные.
- Нет централизованного контроля частоты появления, что может привести к визуальному шуму.

Будущий компонент:

- `CharacterBubble`

Рекомендуемые props:

```ts
type CharacterBubbleProps = {
  characterId: "mika" | string;
  role: "mentor" | "skeptic" | "lab" | "examiner" | "comic-relief";
  tone?: "calm" | "warning" | "celebration";
  children: string;
  imageAlt?: string;
  decorativeImage?: boolean;
};
```

### 3.8 Визуализация

Где сейчас:

- `pages/mechanics.html`: `#visualization`
- `pages/mechanics.html`: `.viz-task`
- `pages/mechanics.html`: `.scenario-btn`
- `pages/mechanics.html`: `#canvas-wrapper`
- `pages/mechanics.html`: live fields `#live-x`, `#live-t`, `#live-v`
- `js/mechanics.js`: p5.js sketch, `drawMotionStrip`, `drawGraphs`, `drawSingleGraph`

Сильные стороны:

- Симуляция уже имеет задание перед взаимодействием.
- Есть несколько сценариев: вперед, покой, назад.
- Графики и движение связаны.

Проблемы:

- p5.js подключается с CDN.
- sketch зависит от конкретных DOM id.
- сценарии управляются через глобальную функцию `window.setScenario`.
- физические расчеты встроены в рендер.

Будущие компоненты:

- `SimulationCard`
- `MotionGraphSim`
- `ScenarioButtonGroup`

Будущий слой логики:

- `src/lib/physics/kinematics.ts`

Правило миграции:

Сначала перенести текущую p5.js визуализацию как Astro island без изменения поведения. Только после визуального parity-теста отделять физические функции и улучшать API.

### 3.9 Прогресс

Где сейчас:

- `pages/mechanics-menu.html`: dashboard progress.
- `pages/mechanics-menu.html`: progress bars по разделам.
- `pages/mechanics-menu.html`: progress widget внутри каждой chapter card.
- `pages/mechanics-menu.html`: localStorage prefix `physicslab.mechanics.chapter.`
- `pages/mechanics-menu.html`: шаги `theory`, `tasks`, `recall`.

Сильные стороны:

- Простая локальная модель прогресса без backend.
- Есть мотивационный текст.
- Прогресс разделов считается из DOM.

Проблемы:

- Состояние вычисляется по DOM-карточкам, а не по данным курса.
- Виджеты добавляются через `innerHTML`.
- При миграции легко сломать ключи localStorage.

Будущие компоненты:

- `ProgressDashboard`
- `SectionProgress`
- `ChapterProgressWidget`
- `RecallChecklist`

Важное требование миграции:

Сохранить совместимость с текущими localStorage-ключами или написать явный одноразовый адаптер.

## 4. Что можно временно оставить на HTML/CSS/JS

### Можно оставить до поздних этапов

1. `pages/index.html` и `css/style.css` как эталон текущей визуальной идентичности.
2. `pages/mechanics-menu.html` как reference implementation оглавления, маршрутов и прогресса.
3. `pages/mechanics.html` как reference implementation полной главы.
4. `js/mechanics.js` как p5.js reference sketch.
5. localStorage-прогресс с текущим prefix.
6. `assets/space-cat.jpg` и `assets/manga-girl.png` как временные ассеты до asset audit.

### Почему не нужно переписывать все сразу

- Текущий сайт уже показывает стиль и учебный тон.
- p5.js-визуализация работает как отдельная подсистема, но хрупко связана с DOM.
- Быстрая миграция всего HTML в MDX увеличит риск визуального шума, потери стиля и ошибок в физике.
- Лучше сначала выделить данные, схемы и компоненты, затем переносить по одной странице.

### Что нельзя оставлять надолго

1. Tailwind CDN в production-версии.
2. Inline `tailwind.config` в каждой странице.
3. Inline CSS и JS в больших HTML-файлах.
4. Квизы, где HTML и JS дублируют один и тот же вопрос.
5. Физический контент без `authorReviewRequired` или `needs-physics-review`.
6. Ассеты без лицензионной записи.

## 5. Целевая архитектура Astro + MDX + Tailwind + TypeScript

```text
PhysicsLab/
  docs/
  public/
    assets/
      characters/
      diagrams/
      backgrounds/
      licenses/
  src/
    content/
      chapters/
      quizzes/
      tasks/
      glossary/
    components/
      layout/
      learning/
      simulations/
      ui/
    data/
      curriculum-map.ts
      exam-spec.ts
      mechanics-map.ts
      misconceptions.ts
    lib/
      physics/
      progress/
      validation/
    styles/
      tokens.css
      global.css
      prose.css
```

### 5.1 Astro

Использовать Astro как content-first framework:

- статические страницы глав;
- MDX для учебного текста;
- islands только для интерактивов: квизы, прогресс, p5.js-симуляции.

### 5.2 MDX

MDX нужен для глав:

- текст остается читаемым;
- учебные блоки подключаются как компоненты;
- frontmatter хранит metadata, prerequisites, skills, review status.

### 5.3 Tailwind

Tailwind должен перейти из CDN в build-time config:

- единый `tailwind.config`;
- токены PhysicsLab: dark bg, yellow accent, semantic colors for physics variables;
- запрет случайного расползания цветов.

### 5.4 TypeScript

TypeScript нужен для:

- схем контента;
- задач и квизов;
- props компонентов;
- физической логики;
- localStorage adapters.

### 5.5 Content Collections

Будущие коллекции:

- `chapters`;
- `quizzes`;
- `tasks`;
- `glossary`.

Минимальное правило: все коллекции с физическим смыслом валидируют review status.

## 6. План миграции маленькими этапами

### Этап 0. Зафиксировать baseline

Цель: иметь точку сравнения перед любыми изменениями.

Задачи:

- сделать screenshots текущих страниц на desktop и mobile;
- описать текущие маршруты;
- зафиксировать список существующих страниц и битых ссылок;
- провести asset audit;
- не менять сайт.

Критерий готовности:

- есть baseline screenshots;
- есть список current routes;
- есть список ассетов и их статус лицензии.

### Этап 1. Подготовить Astro рядом с текущим сайтом

Цель: добавить сборку, не ломая текущие страницы.

Задачи:

- добавить `package.json`;
- установить Astro, MDX, Tailwind, TypeScript;
- завести `src/` и `public/`;
- настроить dev/build scripts;
- оставить текущие `pages/`, `css/`, `js/`, `assets/` как reference.

Критерий готовности:

- `npm run dev` поднимает Astro;
- текущий статический сайт не удален;
- новая стартовая Astro-страница может быть черновой и не заменяет production route.

### Этап 2. Перенести дизайн-токены

Цель: сохранить визуальный стиль PhysicsLab до переноса контента.

Задачи:

- создать `src/styles/tokens.css`;
- перенести цвета: фон, accent yellow, semantic colors `position`, `velocity`, `time`, `acceleration`;
- настроить Tailwind theme;
- создать базовые typography/prose стили;
- не менять визуальный язык в сторону corporate EdTech.

Критерий готовности:

- tokens покрывают текущую палитру;
- есть CSS variables для основных цветов;
- документация указывает, какие цвета нельзя менять без design review.

### Этап 3. Описать схемы данных

Цель: отделить учебные данные от разметки.

Задачи:

- определить schemas для chapter frontmatter;
- определить schema для chapter cards;
- определить schema для quiz questions;
- определить schema для worked examples;
- определить schema для formula cards;
- встроить обязательный review status.

Критерий готовности:

- новый физический контент без review status не проходит валидацию;
- есть минимум один typed пример данных для текущей главы 02.

### Этап 4. Собрать UI primitives

Цель: создать маленькие визуальные кирпичи без переноса всей главы.

Компоненты:

- `Panel`
- `Badge`
- `Button`
- `ProgressBar`
- `SemanticSymbol`
- `CharacterBubble`

Критерий готовности:

- компоненты повторяют текущий стиль;
- есть responsive states;
- есть focus states;
- нет добавленного визуального шума.

### Этап 5. Собрать learning components

Цель: вынести повторяющиеся учебные блоки.

Компоненты:

- `ChapterCard`
- `ChapterContract`
- `FormulaCard`
- `VariableTable`
- `WorkedExample`
- `MiniQuiz`
- `SimulationCard`
- `ProgressDashboard`

Критерий готовности:

- компоненты принимают typed props;
- есть examples/stories или demo page;
- компоненты не содержат конкретный текст главы 02 внутри себя.

### Этап 6. Перенести оглавление механики

Цель: мигрировать страницу с меньшим физическим риском, чем полноценная глава.

Задачи:

- создать data file для глав механики;
- собрать Astro-страницу оглавления;
- сохранить routes filter;
- сохранить progress dashboard;
- сохранить localStorage keys или сделать adapter;
- оставить старый `pages/mechanics-menu.html` до визуального parity.

Критерий готовности:

- карточки глав визуально совпадают с текущими;
- прогресс работает;
- недоступные главы показывают заглушку;
- mobile layout не хуже текущего.

### Этап 7. Перенести p5.js визуализацию как island

Цель: не сломать самую хрупкую интерактивную часть.

Задачи:

- создать `MotionGraphSim` island;
- на первом проходе перенести текущий p5 sketch почти без переписывания;
- заменить глобальный `window.setScenario` внутренним state или adapter;
- сохранить `canvas-wrapper` поведение;
- сделать static fallback;
- добавить reduced-motion fallback.

Критерий готовности:

- сценарии forward/still/backward работают;
- графики x(t) и v(t) рисуются;
- live data обновляется;
- canvas не пустой на desktop и mobile;
- p5.js не грузится на страницах без симуляции.

### Этап 8. Перенести главу 02 в MDX

Цель: доказать, что один полный учебный экран переносится без потери стиля.

Задачи:

- создать MDX для главы 02;
- вынести frontmatter;
- заменить контракт, формулу, таблицу, worked example, quiz, character bubbles компонентами;
- сохранить текущую структуру learning route;
- поставить `authorReviewRequired: true` или `reviewStatus: "needs-physics-review"` для физического контента.

Критерий готовности:

- визуальная близость к текущей главе;
- квиз работает;
- симуляция работает;
- физический контент отмечен review status;
- нет ухудшения мобильной версии.

### Этап 9. QA и переключение маршрутов

Цель: безопасно заменить старую страницу новой.

Задачи:

- visual regression screenshots;
- mobile screenshots;
- keyboard smoke test;
- contrast smoke test;
- check broken links;
- проверить localStorage migration;
- провести physics review.

Критерий готовности:

- владелец проекта сравнил старую и новую страницы;
- нет критических визуальных расхождений;
- нет критических physics issues;
- старые файлы можно оставить как archive до следующей итерации.

### Этап 10. Масштабировать на новые главы

Цель: развивать курс без копипасты.

Задачи:

- создавать новые главы только через MDX + components;
- новые задачи хранить как typed data;
- новые квизы хранить как typed data;
- новые ассеты регистрировать в license file;
- новые формулы и задачи маркировать review status.

Критерий готовности:

- новая глава создается быстрее текущей HTML-версии;
- нет ручного дублирования quiz logic;
- нет нового физического контента без проверки.

## 7. Риски и меры защиты

### 7.1 Потеря текущего визуального стиля

Риск:

При переходе на Astro/Tailwind проект может стать слишком чистым, корпоративным и похожим на generic EdTech.

Защита:

- сохранить `pages/index.html`, `pages/mechanics-menu.html`, `pages/mechanics.html` как visual reference до завершения миграции;
- зафиксировать screenshots baseline;
- перенести tokens до переноса контента;
- запретить стерильные белые/серые шаблоны;
- сохранять темный фон, желтый акцент, аниме-персонажа, мемный живой тон;
- проверять каждую новую страницу по `docs/design-and-learning-rules.md`.

### 7.2 Поломка p5.js-визуализации

Риск:

Текущий `js/mechanics.js` зависит от DOM id, p5 global, размеров `canvas-wrapper` и `window.setScenario`. При переносе в island можно сломать canvas, resize, сценарии или live data.

Защита:

- не переписывать sketch и физику одновременно;
- сначала перенести p5 как совместимый island;
- сделать adapter для сценариев;
- добавить визуальный smoke test: canvas не пустой, сценарии меняют график, resize работает;
- p5 подключать только на странице с симуляцией;
- после parity вынести формулы в `src/lib/physics/kinematics.ts`.

### 7.3 Ухудшение мобильной версии

Риск:

Текущие блоки используют responsive Tailwind classes, но некоторые зоны хрупкие: крупная формула, таблица, canvas высотой 500px, сценарные кнопки, quiz grid.

Защита:

- тестировать ширины 360, 390, 768, 1280 px;
- формулы должны переноситься без горизонтального скролла;
- таблицы должны иметь controlled overflow;
- canvas должен иметь mobile-friendly height;
- quiz options должны иметь крупные touch targets;
- не использовать hover-only для обязательных подсказок.

### 7.4 Появление визуального шума

Риск:

Компонентная система может упростить добавление бейджей, персонажей, карточек и анимаций, из-за чего экран станет перегруженным.

Защита:

- правило "один экран - одна главная учебная идея";
- компоненты по умолчанию должны быть спокойными;
- персонажная реплика должна иметь явную роль;
- желтый акцент использовать только для главного смысла;
- для каждой главы делать design pass по cognitive load.

### 7.5 Физические ошибки в новом контенте

Риск:

При переносе в MDX или создании новых typed задач можно случайно изменить формулы, единицы, знаки, ответы или условия применимости.

Защита:

- любой новый физический контент получает `authorReviewRequired: true` или `reviewStatus: "needs-physics-review"`;
- использовать `docs/physics-review-checklist.md`;
- отделить физические функции в `src/lib/physics/`;
- добавить unit tests для вычислительных функций;
- не копировать задания РИКЗ или учебников;
- не считать миграцию physics review.

## 8. Рекомендованный порядок приоритетов

1. Не начинать с миграции всего сайта.
2. Зафиксировать visual baseline и asset audit.
3. Сначала перенести tokens и компоненты.
4. Затем мигрировать оглавление механики.
5. Затем аккуратно перенести p5.js-визуализацию.
6. Затем мигрировать одну главу 02 как вертикальный срез.
7. Только после этого добавлять новые главы через MDX.

## 9. Definition of Done для миграционного этапа

Этап миграции считается завершенным, если:

- текущий сайт не сломан;
- новая часть имеет visual parity или осознанное улучшение;
- mobile не хуже baseline;
- p5.js работает, если этап затрагивает визуализацию;
- нет нового физического контента без review status;
- нет новых ассетов без license record;
- нет визуального ухода в corporate EdTech;
- выполнены smoke checks, описанные в этапе.

## 10. Короткий вывод

PhysicsLab уже содержит структуру будущего Astro/MDX-приложения, только сейчас она зашита в HTML-файлы. Миграцию нужно делать не как "переписать сайт", а как извлечение уже существующих учебных паттернов в typed components и content collections.

Самый безопасный путь: сохранить текущий HTML/CSS/JS как reference, перенести дизайн-токены, собрать компоненты, мигрировать оглавление, затем p5.js island, затем одну главу. Так проект сохранит главное: живой темный желтый аниме/мемный стиль, рабочую визуализацию и физическую проверяемость.
