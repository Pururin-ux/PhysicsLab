# PhysicsLab Design Generation Workflow

Дата: 2026-05-16.
Статус: рабочий pipeline для UI-экспериментов, ChatGPT-generated samples, маскота и motion-прототипов.

Этот документ описывает, как использовать визуальные сэмплы и внешние UI-источники без потери стиля PhysicsLab. Сэмпл не является production-кодом. Production-решение принимается только после анализа, изолированного прототипа, адаптации под Dark Anime Lab и screenshot review.

## Основной принцип

PhysicsLab - это учебная лаборатория, а не витрина UI-эффектов. Любой новый визуальный прием должен пройти простой вопрос:

> Ученику стало понятнее, что происходит в физике?

Если ответ "нет", прием остается в референсах или прототипах.

Приоритеты:

1. Понимание физики и снижение тревожности ученика.
2. Dark Anime Lab: темная лабораторная панель, желтый для действия и фокуса, cyan/blue для графиков и данных, зеленый для успеха, красный только для ошибки или ловушки.
3. Astro + TypeScript + локальный CSS/vanilla scripts.
4. Mobile-first, accessibility, reduced motion.
5. Screenshot workflow до и после UI-изменений.

Не делать:

- не добавлять зависимости из-за одного красивого сэмпла;
- не переносить generic SaaS/React/Tailwind вид напрямую;
- не копировать внешний компонент без адаптации под PhysicsLab;
- не превращать учебную лабораторию в набор декоративных карточек;
- не внедрять маскота везде;
- не менять production-компонент до принятого прототипа.

## Источники решений

Порядок доверия:

1. `docs/design-and-learning-rules.md`
2. `docs/content-rules.md`
3. `docs/interactive-labs-vision.md`
4. `docs/design-direction-decision.md`
5. `assets/mascot/production-plan.md`
6. Текущие production-компоненты: `CharacterBubble.astro`, `UniformMotionLab.astro`, UI primitives.
7. ChatGPT-generated samples и внешние UI-источники.

Внешние источники полезны как материал для анализа: композиция, плотность, иерархия, motion timing, формы контролов, состояния feedback. Они не заменяют локальные правила.

## End-to-end workflow

### A. Reference / sample stage

На этом этапе ChatGPT или внешний источник дает изображение, concept sheet, UI board, animation frames или пример компонента.

Правила:

- сэмпл сохраняется в reference-папку;
- сэмпл не считается production-ready кодом;
- у сэмпла должен быть короткий sidecar-файл `.md` с происхождением, датой, задачей и правовым статусом;
- сэмпл используется как направление: композиция, визуальная иерархия, цвет, настроение, плотность, форма карточек, поведение motion;
- если изображение выглядит как PNG с checkerboard-фоном, alpha-канал обязательно проверяется отдельно. Визуальная сетка прозрачности может быть просто пикселями.

Рекомендуемая структура:

```text
design-references/
  README.md
  ui-samples/
  lab-samples/
  mascot-samples/
  motion-samples/
  external-patterns/
```

Почему отдельная папка лучше, чем `src/` или production `assets/`:

- reference-файлы не должны случайно попасть в сборку как production-ассеты;
- проще отделить вдохновение от утвержденных ресурсов;
- можно хранить несколько неудачных вариантов и решения по ним;
- агент не перепутает concept art с готовым asset.

Production-ассеты маскота после ревью живут отдельно, по правилам `assets/mascot/production-plan.md`.

### B. Analysis stage

Перед кодом агент пишет короткий анализ сэмпла. Минимальный шаблон:

```md
## Sample analysis

Source:
Task:
Useful:
- ...

Does not fit PhysicsLab:
- ...

Student overload risks:
- ...

Can transfer to code:
- ...

Keep only as inspiration:
- ...

Accessibility/mobile risks:
- ...

Motion/reduced-motion risks:
- ...

Decision:
- prototype / reject / request new sample
```

Что искать в сэмпле:

- есть ли один главный смысл на экране;
- понятно ли, куда нажать сначала;
- не конкурируют ли декоративные элементы с графиком или формулой;
- есть ли достаточный контраст на темном фоне;
- не используется ли красный как украшение;
- можно ли перенести идею в Astro/CSS без новой зависимости;
- можно ли объяснить ученику результат одной фразой.

### C. Prototype stage

Новый UI сначала делается в изоляции.

Допустимые места:

```text
prototypes/generated-ui/
src/pages/ui-playground.astro
```

Правила прототипа:

- не ломать `/lab-preview/`;
- не менять production-компонент до ревью;
- использовать реальные русские тексты, а не lorem ipsum;
- проверять mobile 390 px и 360 px;
- показывать состояния: default, hover/focus, success, warning/error, reduced motion;
- если прототип связан с физикой, он должен показывать учебный смысл, а не только декоративную оболочку.

Прототип можно удалить или переписать. Он не является частью стабильного API.

### D. Implementation stage

После принятия прототипа идея переносится в reusable components.

Правила переноса:

- адаптировать под локальные компоненты и design tokens PhysicsLab;
- писать Astro/CSS/vanilla TS, если нет отдельного решения о зависимости;
- использовать русский UI без англицизмов;
- сохранять клавиатурную доступность;
- не делать глобальный редизайн из локального компонента;
- не копировать Tailwind/React-архитектуру в проект без необходимости;
- не поднимать визуальный вес вторичного блока выше графика, движения или ключевой формулы.

Если внешний пример использует React hooks, Motion, Radix, Tailwind utilities или shadcn registry, агент извлекает не код, а:

- структуру состояний;
- anatomy компонента;
- порядок слоев;
- spacing rhythm;
- понятную модель interaction;
- motion timing.

### E. Screenshot review stage

Для UI-изменений:

1. До изменений выполнить `npm run screenshots`.
2. После изменений выполнить `npm run screenshots`.
3. Сравнить desktop, tablet, mobile, narrow-mobile.
4. Проверить отсутствие horizontal scroll.
5. Проверить, не появилась ли "стена карточек" на mobile.
6. В отчете написать, стало ли понятнее ученику, а не только красивее.

Screenshots не обязательны для чистых документов, если UI-код не менялся.

## External UI sources

Проверено по официальным страницам 2026-05-16:

- [shadcn/ui docs](https://ui.shadcn.com/docs)
- [shadcn/ui components](https://ui.shadcn.com/docs/components)
- [21st docs](https://help.21st.dev/)
- [21st community](https://21st.dev/community/components/s/21st-dev)
- [Magic UI components](https://magicui.design/docs/components)
- [Animate UI docs](https://animate-ui.com/docs)
- [Cult UI docs](https://www.cult-ui.com/docs)
- [Aceternity UI components](https://ui.aceternity.com/components)
- [Aceternity UI AI catalog](https://ui.aceternity.com/ai-recommendations)

| Source | Полезно для PhysicsLab | Можно перенести без зависимостей | Сейчас нежелательно | Риски | Как использовать с ChatGPT samples |
| --- | --- | --- | --- | --- | --- |
| shadcn/ui | Component anatomy, композиция форм, кнопок, accordion/disclosure, focus states, предсказуемая структура | Идею anatomy: `Header`, `Content`, `Footer`, `Action`; patterns для label, slider, field, card | CLI install, React-компоненты, Radix-зависимости без отдельного решения | Generic SaaS, слишком "админский" вид, лишняя компонентная вложенность | Попросить ChatGPT сделать board в стиле PhysicsLab, затем сверить anatomy с shadcn и перенести вручную в Astro |
| 21st.dev | Галерея современных React/Tailwind patterns, быстрый поиск вариантов, сравнение component sheets | Идеи layout, плотности, variants, microcopy placement | Copy/drop React-кода, Magic Chat как источник production-кода без ревью | Trend chasing, чужой стиль, AI-agent UI вместо учебного прибора | Использовать как источник 3-5 направлений, затем попросить ChatGPT адаптировать под Dark Anime Lab |
| Magic UI | Motion references, animated lists, progress, subtle reveal, rich cards | Timing, последовательность появления, идея progress/feedback | Particles, confetti, shiny text, beams, animated backgrounds, React/Tailwind components | Визуальный шум, motion ради motion, плохое чтение на mobile | Брать один прием на один учебный смысл, например мягкое появление feedback |
| Animate UI | Motion-паттерны для disclosure, tabs, tooltip, progress, notifications | Motion specs: duration, easing, enter/exit states; можно переписать на CSS | Motion dependency, React primitives, shadcn registry | Лишняя анимация вокруг чтения, generic interface | Использовать для prototype stage, затем оставить только спокойные transitions с reduced-motion |
| Cult UI | Niche animated components, registry-подход, совместимость с shadcn-паттернами | Идеи ornamental SVG shapes, panel composition, currentColor-подход для SVG | React/TypeScript/Tailwind v4 components, registry install | Темный trendy SaaS, декоративность, сложный визуальный шум | Использовать только для отдельных shapes/panel ideas, затем упростить под учебный экран |
| Aceternity-like patterns | Hero/motion/landing inspiration, microinteractions, hover states | Некоторые идеи: stateful button, animated tooltip behavior, card spotlight как очень мягкий focus | Framer/Motion, React/Next templates, shaders, 3D, background beams, typewriter text | Максимальный риск generic SaaS, glow/noise, landing-page вместо лаборатории | Использовать как "anti-overload" тест: если прием выглядит как marketing hero, не переносить в лабораторию |

Решение по умолчанию: внешние библиотеки не устанавливать. Для PhysicsLab они являются pattern library, а не dependency roadmap.

## ChatGPT-generated UI samples

ChatGPT-generated sample - это визуальный черновик. Его ценность в том, что он быстро показывает настроение, композицию и набор вариантов. Его опасность в том, что он может выглядеть убедительно, но нарушать accessibility, mobile, cognitive load или production constraints.

### Full UI board

Куда сохранять:

```text
design-references/ui-samples/YYYY-MM-DD-full-board-name.png
design-references/ui-samples/YYYY-MM-DD-full-board-name.md
```

Как анализировать:

- выделить цветовую систему, типографику, формы карточек, плотность;
- отметить, что подходит Dark Anime Lab;
- отметить, что выглядит как generic UI kit;
- проверить, не слишком ли много блоков на первом экране;
- отделить "системные правила" от декоративной презентации.

Можно переносить:

- palette relationships;
- hierarchy;
- states для buttons/cards;
- общую грамматику графиков и feedback.

Нельзя переносить напрямую:

- весь экран как production layout;
- декоративные сетки, orbit lines, glow, если они конкурируют с учебной задачей;
- случайные иконки и бейджи без смысловой роли.

Проверки:

- mobile 390/360;
- contrast;
- focus states;
- один главный смысл на первом экране.

### Component sheet

Куда сохранять:

```text
design-references/ui-samples/component-sheets/
```

Как анализировать:

- сгруппировать компоненты: action, feedback, lab panel, formula, graph, quiz;
- проверить, не используется ли один цвет для всех ролей;
- выбрать 1-2 пригодных элемента, а не весь лист.

Можно переносить:

- button sizes;
- state hierarchy;
- icon placement;
- visual rhythm.

Нельзя переносить напрямую:

- набор всех компонентов сразу;
- Material/Bootstrap-like defaults;
- чрезмерно круглые или декоративные карточки, если они не совпадают с PhysicsLab.

Проверки:

- keyboard focus;
- touch target 44 px или больше;
- отсутствие текста, который не помещается на mobile.

### FormulaCard variations

Куда сохранять:

```text
design-references/ui-samples/formula-card/
```

Как анализировать:

- формула должна помогать после наблюдения, а не давить первой;
- выделение переменных должно совпадать с графиком и контролами;
- численная подстановка не должна создавать "стену чисел".

Можно переносить:

- layout формулы;
- мягкую подсветку переменной;
- короткие объяснения "откуда стартуем", "насколько уехали", "где оказались".

Нельзя переносить напрямую:

- мигающие формулы;
- крупные декоративные математические блоки без действия;
- красный для обычного акцента.

Проверки:

- live updates не только цветом;
- reduced motion;
- чтение на 360 px.

### LabPanel variations

Куда сохранять:

```text
design-references/lab-samples/panels/
```

Как анализировать:

- видно ли главное действие;
- не похоже ли на cockpit;
- не конкурируют ли x(t), v(t), formula и quiz одновременно.

Можно переносить:

- композицию "точка + график + один control";
- compact controls;
- section spacing.

Нельзя переносить напрямую:

- многоколонную панель на mobile;
- сложные value grids на первом экране;
- статичные "demo cards", если лаборатория должна быть real-time.

Проверки:

- сценарий "нажал и понял";
- horizontal scroll;
- Play/Pause/Reset.

### Quiz/Feedback variations

Куда сохранять:

```text
design-references/ui-samples/quiz-feedback/
```

Как анализировать:

- вопрос должен проверять один смысл;
- feedback должен объяснять ошибку без сухого тона;
- correct/wrong нельзя передавать только цветом.

Можно переносить:

- compact answer buttons;
- icon + text feedback;
- мягкое появление feedback.

Нельзя переносить напрямую:

- игровые эффекты победы;
- красный как агрессия;
- длинные объяснения в feedback.

Проверки:

- кнопки работают мышью и клавиатурой;
- `aria-live` у feedback;
- состояние видно без цвета.

### Mobile layout samples

Куда сохранять:

```text
design-references/ui-samples/mobile/
```

Как анализировать:

- что видно без скролла;
- какая первая кнопка;
- где находится результат действия;
- не ушел ли график ниже длинных пояснений.

Можно переносить:

- порядок блоков;
- sticky или near-action result, если не мешает чтению;
- крупные touch targets.

Нельзя переносить напрямую:

- декоративные hero sections;
- плотные desktop grids;
- скрытие ключевого графика под длинными карточками.

Проверки:

- 390 px и 360 px;
- нет horizontal scroll;
- результат после нажатия виден без прокрутки в конец страницы.

### Animation frame samples

Куда сохранять:

```text
design-references/motion-samples/
```

Как анализировать:

- какой учебный смысл объясняет motion;
- сколько кадров реально нужно;
- можно ли заменить CSS transition;
- что происходит при reduced motion.

Можно переносить:

- 3-6 frame sequence для маленькой реакции;
- sprite timing;
- start/end pose.

Нельзя переносить напрямую:

- бесконечные эффекты рядом с длинным чтением;
- кадры без единого crop;
- тяжелые full-screen animation sheets.

Проверки:

- reduced motion;
- CPU/paint cost;
- не мешает ли формуле или графику.

### Mascot expression sheet

Куда сохранять:

```text
design-references/mascot-samples/expression-sheets/
```

Как анализировать:

- совпадает ли персонаж с утвержденным mascot guide;
- одинаковы ли пропорции, одежда, палитра, силуэт;
- есть ли настоящая прозрачность;
- не слишком ли сильная эмоция для учебного контекста.

Можно переносить:

- направление эмоций: calm, encouraging, surprised, thinking, warning;
- pose language;
- цветовые акценты.

Нельзя переносить напрямую:

- ассет с baked checkerboard;
- разные персонажи под видом состояний одного маскота;
- выражения, которые давят на ученика или отвлекают от задачи.

Проверки:

- alpha channel;
- единый crop;
- readable at avatar/bubble size;
- license/source note.

### Mascot bubble usage samples

Куда сохранять:

```text
design-references/mascot-samples/bubble-usage/
```

Как анализировать:

- нужна ли реплика в этом месте;
- снижает ли она тревожность;
- не конкурирует ли маскот с графиком;
- короткий ли текст.

Можно переносить:

- placement near feedback;
- tone states;
- bubble density.

Нельзя переносить напрямую:

- маскота рядом с каждой формулой;
- большие иллюстрации внутри лаборатории;
- повторяющиеся реплики без учебной функции.

Проверки:

- mobile first;
- alt/aria strategy;
- не закрывает основной результат действия.

## Mascot production workflow

### A. Concept stage

Место:

```text
assets/mascot/concepts/
design-references/mascot-samples/
```

Concept art нужен для направления: силуэт, одежда, настроение, выражения, палитра. Concept art не является production asset.

Текущий важный риск: многие ChatGPT PNG выглядят как изображения на прозрачном фоне, но на деле могут содержать checkerboard как пиксели. Такие файлы нельзя вставлять в UI без очистки и проверки alpha-канала.

### B. Production asset stage

Production-ассеты должны иметь:

- PNG/WebP с настоящим alpha-каналом;
- единый crop и anchor point;
- стабильную визуальную массу;
- проверку на темном фоне и внутри bubble;
- documented source/license;
- версии:
  - `full`;
  - `bubble`;
  - `avatar`;
- состояния:
  - `calm`;
  - `encouraging`;
  - `surprised`;
  - `thinking`;
  - `warning`.

Рекомендуемая production-структура остается по mascot plan:

```text
assets/mascot/ui/
  calm/
    full.png
    bubble.png
    avatar.png
  encouraging/
  surprised/
  thinking/
  warning/
```

### C. Integration stage

Маскот используется только там, где он делает учебный опыт спокойнее или понятнее:

- подсказывает первый шаг;
- объясняет ловушку;
- поддерживает после ошибки;
- подводит итог;
- снижает тревожность перед проверкой.

Не использовать:

- рядом с каждой формулой;
- как декоративный filler;
- в блоке, где он конкурирует с графиком или точкой;
- в местах, где ученик должен сосредоточиться на чтении длинного текста.

Для `CharacterBubble.astro` production-внедрение должно сохранить:

- состояния `calm`, `encouraging`, `surprised`, `thinking`, `warning`;
- короткие русские реплики;
- mobile layout без horizontal scroll;
- aria label или корректное `aria-hidden`, если изображение декоративно.

### D. Animation stage

#### Level 1: CSS micro-animation

Подходит сейчас.

Разрешено:

- легкое дыхание;
- мягкое появление;
- наклон или поворот на 1-2 градуса;
- blink через CSS, если есть отдельные слои или подходящий asset;
- feedback появление без резкого мигания.

Требования:

- `prefers-reduced-motion: reduce`;
- малая амплитуда;
- не рядом с длинным чтением;
- не конкурировать с графиком.

#### Level 2: frame-based animation

Подходит для прототипов маленьких реакций.

Правила:

- 3-6 кадров;
- единый crop;
- одинаковый anchor point;
- sprite или controlled frame switching;
- запуск только по событию;
- reduced motion показывает статичный кадр;
- не внедрять глобально без review.

#### Level 3: Rive/Lottie/spine-like animation

Возможность на будущее.

Не внедрять сейчас без отдельного решения, потому что потребуется:

- новая зависимость;
- runtime cost review;
- production pipeline;
- reduced-motion strategy;
- asset ownership/license review.

## Motion rules for PhysicsLab

Принцип:

> Анимация должна объяснять физику, а не украшать страницу.

Разрешено:

- движение точки;
- подсветка текущего участка графика;
- плавное изменение формулы;
- раскрытие подробностей;
- мягкий feedback после ответа;
- спокойное появление подсказки;
- короткая реакция маскота, если она помогает понять ошибку или следующий шаг.

Запрещено:

- постоянные частицы вокруг текста;
- мигающие формулы;
- лишние glow-эффекты;
- анимация рядом с длинным чтением;
- движение, которое нельзя отключить;
- typewriter/reveal effects для учебного текста, который нужно спокойно прочитать;
- fireworks/confetti как feedback в базовой лаборатории.

Обязательно:

- `prefers-reduced-motion`;
- screenshots на mobile;
- проверка, не мешает ли чтению;
- manual check: Play/Pause/Reset, sliders, quiz feedback;
- fallback, в котором смысл лаборатории сохраняется без autoplay.

Motion budget:

- один главный moving object на первом экране лаборатории;
- один текущий графический highlight;
- feedback animation не дольше 200-300 ms;
- looping animation только если она является симуляцией или микродвижением с reduced-motion fallback.

## Prototype to production checklist

Перед переносом прототипа в production:

- есть sample analysis;
- исходный sample сохранен в `design-references/`;
- прототип изолирован от `/lab-preview/`;
- не добавлены зависимости;
- русский UI-текст переписан под ученика;
- главный смысл можно сформулировать одной фразой;
- кнопки и поля доступны с клавиатуры;
- sliders имеют label или `aria-label`;
- feedback не передается только цветом;
- reduced motion проверен;
- mobile 390 px и 360 px проверены;
- нет horizontal scroll;
- screenshots до/после сохранены, если менялся UI;
- отчет говорит, стало ли понятнее ученику.

## Concrete cycles for the next iteration

### Cycle 1: FormulaCard

1. ChatGPT генерирует 3 варианта FormulaCard.
2. Файлы сохраняются в `design-references/ui-samples/formula-card/`.
3. Агент пишет analysis для каждого варианта.
4. Агент создает прототип:

```text
prototypes/generated-ui/formula-card/
```

5. Проверяются states: default, changed x0, changed v, changed t, reduced motion, mobile.
6. После выбора вариант переносится в:

```text
src/components/learning/FormulaCard.astro
```

7. Перед production merge: `npm run check`, `npm run build`, `npm run screenshots`.

### Cycle 2: MascotBubble

1. ChatGPT генерирует 3 варианта MascotBubble usage samples.
2. Отдельно проверяются alpha, crop, visual weight.
3. Агент делает прототип без внедрения в основной поток:

```text
prototypes/generated-ui/mascot-bubble/
```

4. Проверяются состояния `calm`, `warning`, `thinking`.
5. Если принято, обновляется `CharacterBubble.astro` или создается новый production component.
6. Встраивание только в один demo-блок, не глобально.
7. Screenshots: desktop, tablet, mobile, narrow-mobile.

### Cycle 3: Motion frame sheet for trap reaction

1. ChatGPT генерирует 3-6 кадров реакции на ловушку.
2. Файлы сохраняются в `design-references/motion-samples/trap-reaction/`.
3. Агент проверяет crop, weight, frame consistency, alpha.
4. Делается CSS/frame prototype.
5. Проверяется `prefers-reduced-motion`.
6. Не внедрять глобально без design/learning review.

## What to do first

1. Создать `src/pages/ui-playground.astro` или `prototypes/generated-ui/` для безопасных UI-экспериментов.
2. Сделать один generated FormulaCard prototype и сравнить его с текущим языком лабораторий.
3. Сделать один MascotBubble prototype без внедрения в основной поток и проверить, не конкурирует ли маскот с графиком.

## Agent rules

Когда агент получает новый UI sample:

1. Сначала читает локальные design/content/vision rules.
2. Сохраняет sample в reference-структуру или указывает, где он уже лежит.
3. Пишет analysis до кода.
4. Делает isolated prototype.
5. Не добавляет зависимости без отдельного решения.
6. Не меняет production UI, пока прототип не принят.
7. Для production переносит только смысл и пригодные паттерны, а не внешний стиль целиком.
8. Проверяет mobile, accessibility, reduced motion и screenshots.
9. В отчете объясняет, как изменение помогает ученику.

## Known risks

- Внешние UI-паттерны легко превращают PhysicsLab в generic SaaS dashboard.
- Motion-библиотеки дают быстрый wow-effect, но могут мешать чтению и слабым устройствам.
- ChatGPT samples могут иметь неправильный alpha, inconsistent crop и случайную вариативность персонажа.
- Красивый UI board может скрывать плохой learning flow.
- Маскот может снизить тревожность, но при частом использовании станет шумом.
- На mobile перегруз проявляется раньше, чем на desktop.

Контрольный критерий для любого нового UI:

> Ученик нажал, увидел результат рядом, понял одну физическую связь и не утонул в панелях.
