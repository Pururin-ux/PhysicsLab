# PhysicsLab Master Plan v2

Дата: 2026-05-18  
Статус: продуктовый master plan для следующего цикла PhysicsLab.  
Основа: deep research, Claude/Gemini review themes, текущие документы PhysicsLab, design-board decisions и состояние `/chapters/uniform-motion/`.

Этот документ не фиксирует текущую реализацию как финальную. Текущая глава про равномерное движение - полезный prototype v0/v1, но не эталон production-архитектуры. Часть текущих решений нужно сохранить, часть переписать, часть оставить временно до появления более полной модели глав, задач и интерактивных сцен.

## 1. Product Thesis

PhysicsLab - это интерактивный тренажёр физического мышления, а не сайт с формулами.

Главная ценность продукта: ученик не просто читает закон, а учится думать физически:

- предсказывать, что изменится;
- менять один параметр;
- видеть результат в движении, графике, числах и формуле;
- связывать наблюдение с физической моделью;
- распознавать типичную ошибку;
- переносить идею в задачу формата ЦТ/ЦЭ;
- проверять единицы, знаки, округление и правдоподобность ответа.

Формула в PhysicsLab не является началом объяснения. Формула - это сжатая запись модели, которую ученик уже увидел в сцене, графике или задаче.

Продуктовая формула:

```text
misconception -> prediction -> experiment -> model -> formula -> exam-style transfer
```

PhysicsLab должен ощущаться как Dark Anime Lab: визуально живой, но методически строгий. Если красивый экран не помогает ученику объяснить, что изменилось и почему, экран нужно упрощать.

## 2. Method Principle

Каждая глава строится вокруг одной центральной неправильной модели ученика. Не вокруг параграфа учебника и не вокруг набора формул.

Обязательный учебный маршрут главы:

| Шаг | Что делает ученик | Что делает интерфейс | Что проверяется |
| --- | --- | --- | --- |
| Misconception | Видит типичную ловушку | Показывает, почему ошибка кажется логичной | Ученик узнаёт свою неверную модель без стыда |
| Prediction | Делает короткое предсказание | Фиксирует ожидание перед действием | Ученик не просто двигает слайдер случайно |
| Interactive experiment | Меняет 1-3 параметра | Одновременно обновляет сцену, график, числа и подсветку | Видна причинно-следственная связь |
| Model explanation | Формулирует наблюдение словами | Даёт короткую модель без канцелярита | Ученик может объяснить, что произошло |
| Formula as compressed model | Видит формулу после опыта | Подсвечивает переменные, единицы и условия применимости | Формула не висит отдельно от смысла |
| CT/CE-style check | Решает короткий exam-style вопрос | Даёт объясняющий feedback | Перенос из лаборатории в задачу |
| Unit/rounding check | Проверяет единицы, знак и округление | Показывает размерности и типичные ошибки | Ответ пригоден для экзаменационного формата |

Правило одного экрана: один главный учебный смысл. Маскот, glow, график, quiz и formula card не должны конкурировать за внимание.

## 3. Key Chapter Map

Ниже - карта 15 ключевых глав. Это не финальный syllabus, а product map: какие интерактивные сцены стоит строить первыми, потому что они исправляют частые неправильные модели и хорошо тренируют экзаменационные навыки.

### Mechanics

| Глава | Неправильная модель ученика | Главный интерактивный опыт | Что крутит ученик | Что меняется на экране | Формула после опыта | ЦТ/ЦЭ-навык | Визуальная метафора | Reusable primitives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Равномерное движение | График `x(t)` - это дорога; отрицательная скорость значит "замедляется" | Точка едет по оси, а график строит историю координаты | `v`, `t`, позже `x₀` | Точка, стрелка скорости, наклон `x(t)`, текущая точка графика | `x = x₀ + vt`, `Δx = vt` | Читать наклон `x(t)`, различать координату и путь, работать со знаком | Координатная рейка + самописец координаты | `MotionTrack`, `InstrumentGraph`, `ControlDock`, `FormulaCard`, `MisconceptionPanel` |
| Равноускоренное движение | Ускорение - это просто большая скорость; если `v < 0`, тело обязательно тормозит | Тележка меняет скорость, графики `v(t)` и `x(t)` перестраиваются | `a`, `v₀`, `t`, направление оси | Точка движется с изменяющейся скоростью, `v(t)` меняет наклон, площадь под `v(t)` подсвечивается | `v = v₀ + at`, `x = x₀ + v₀t + at²/2` | Выбор формулы, чтение `v(t)`, знаки проекций, единицы `м/с²` | Разгонная дорожка + лента скорости | `AccelerationScene`, `AreaUnderGraph`, `SignConventionPanel`, `UnitCheck` |
| Второй закон Ньютона через тележки | Сила нужна, чтобы тело двигалось; тяжёлое всегда "сильнее едет" | Тележки с разной массой разгоняются под действием силы | `F`, `m`, трение on/off | Ускорение тележки, график `v(t)`, вектор силы, readout `a` | `F = ma`, `a = F/m` | Выражать неизвестную, сравнивать зависимости, переводить г/кг | Лабораторная тележка на рельсе | `ForceVector`, `CartScene`, `ComparisonSplit`, `ProportionalityGraph` |
| Наклонная плоскость | Сила тяжести всегда "вниз по картинке"; нормальная сила равна весу всегда | Брусок на наклонной плоскости с разложением сил | угол `α`, масса, трение | Проекции `mg sin α`, `mg cos α`, направление ускорения, сила трения | `F∥ = mg sin α`, `N = mg cos α`, `Fтр = μN` | Разложение сил, выбор оси, условия равновесия/движения | Световая проекция вектора на оси | `VectorDecomposition`, `InclineScene`, `FreeBodyDiagram`, `FrictionToggle` |
| Импульс и столкновения | При столкновении "побеждает" более быстрая тележка; импульс исчезает | Две тележки сталкиваются: упругое/неупругое | `m₁`, `m₂`, `v₁`, `v₂`, тип столкновения | Скорости до/после, суммарный импульс, energy loss indicator | `p = mv`, `m₁v₁ + m₂v₂ = ...` | Закон сохранения, знаки скоростей, сравнение до/после | Столкновительный трек с импульсными полосами | `CollisionScene`, `BeforeAfterTable`, `ConservationMeter`, `MomentumBars` |
| Энергия, работа, мощность | Энергия "тратится" без следа; работа всегда равна силе на путь | Груз/тележка переходит между высотой, скоростью и работой силы | высота, масса, сила, путь, угол | Energy bars, скорость, работа, потери | `A = Fs cos α`, `Eₖ = mv²/2`, `Eₚ = mgh`, `P = A/t` | Выбор закона сохранения/работы, единицы Дж/Вт, проверка масштаба | Энергетический бюджет с перетеканием уровней | `EnergyBars`, `WorkAngleWidget`, `LossToggle`, `UnitRoundingCheck` |
| Графики движения как навык | Площадь под графиком - это всегда скорость; наклон и площадь путаются | Один и тот же случай показывается в `x(t)`, `v(t)`, `a(t)` | выбрать график, изменить участок, включить подсветку наклона/площади | Подсветка slope/area, связанные графики, текстовый вывод | `s = area under v(t)`, `a = slope of v(t)`, `v = slope of x(t)` | Читать графики, выбирать смысл наклона/площади | Три синхронных осциллографа | `LinkedGraphs`, `SlopeProbe`, `AreaProbe`, `GraphMisreadQuiz` |

### Electricity and Magnetism

| Глава | Неправильная модель ученика | Главный интерактивный опыт | Что крутит ученик | Что меняется на экране | Формула после опыта | ЦТ/ЦЭ-навык | Визуальная метафора | Reusable primitives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Закон Ома | Напряжение "расходуется" в проводе; ток сам по себе не зависит от сопротивления | Виртуальный участок цепи с прибором и графиком `I(U)` | `U`, `R` | Яркость потока, амперметр, наклон `I(U)` | `I = U/R`, `U = IR` | Выражать неизвестную, читать график, переводить мА/А | Электрический канал с регулируемым сопротивлением | `CircuitSegment`, `MeterReadout`, `OhmGraph`, `UnitConversionCard` |
| Последовательные и параллельные цепи | Ток "делится всегда"; сопротивления складываются одинаково | Собрать цепь и переключать соединение | тип соединения, `R₁`, `R₂`, источник | Токи по ветвям, напряжения на элементах, эквивалентное сопротивление | `R = R₁ + R₂`, `1/R = 1/R₁ + 1/R₂` | Анализ схем, выбор закона для участка, приборные показания | Разветвлённый электрический маршрут | `CircuitBuilder`, `NodeHighlight`, `EquivalentResistancePanel`, `AmmeterVoltmeter` |
| Электромагнитная индукция | Ток появляется просто потому, что рядом есть магнит | Катушка и магнит: ток возникает только при изменении потока | скорость магнита, направление, число витков, площадь | Стрелка гальванометра, направление тока, изменение магнитного потока | `ε = -ΔΦ/Δt`, качественно закон Ленца | Направление индукционного тока, условия возникновения ЭДС | Катушка как датчик изменения поля | `CoilScene`, `FluxMeter`, `NeedleGauge`, `DirectionRuleOverlay` |

### Thermal Physics

| Глава | Неправильная модель ученика | Главный интерактивный опыт | Что крутит ученик | Что меняется на экране | Формула после опыта | ЦТ/ЦЭ-навык | Визуальная метафора | Reusable primitives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Температура и теплота | Температура и количество теплоты - одно и то же | Нагревание тел разной массы и теплоёмкости | `m`, `c`, `ΔT`, источник тепла | Температура растёт по-разному, energy input, comparison | `Q = cmΔT` | Отличать `Q` от `T`, перевод единиц, тепловой баланс | Тепловой бак с уровнем энергии и термометром | `ThermalTank`, `Thermometer`, `HeatEnergyBars`, `MaterialSelector` |
| pV-диаграммы и газовые процессы | pV-график - это картинка сосуда; площадь не имеет смысла | Газ в цилиндре с поршнем связан с pV-графиком | объём, температура, процесс: изобарный/изохорный/изотерма | Поршень, давление, траектория на pV, площадь работы | `pV = νRT`, `A = pΔV` для изобарного | Читать pV, определять процесс, знак работы газа | Поршень + карта состояния газа | `PistonScene`, `PVGraph`, `ProcessSelector`, `AreaWorkProbe` |

### Optics and Waves

| Глава | Неправильная модель ученика | Главный интерактивный опыт | Что крутит ученик | Что меняется на экране | Формула после опыта | ЦТ/ЦЭ-навык | Визуальная метафора | Reusable primitives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Линзы | Изображение всегда "на экране справа"; фокус - это просто точка на линзе | Лучи через собирающую/рассеивающую линзу строят изображение | положение предмета, фокусное расстояние, тип линзы | Лучи, изображение, увеличение, реальность/мнимость | `1/F = 1/d + 1/f`, `Γ = H/h` | Построение изображения, знаки, увеличение | Оптическая скамья | `RayDiagram`, `LensBench`, `ImageClassifier`, `ScaleRuler` |
| Волны и звук | Частота - это громкость; амплитуда - это скорость волны | Волна на струне/осциллограмма звука | частота, амплитуда, скорость среды | Длина волны, осциллограмма, слуховой/визуальный feedback без autoplay sound | `v = λν`, `T = 1/ν` | Читать график колебаний, единицы Гц/с, период/частота | Волновой трек + осциллограф | `WaveCanvas`, `OscilloscopeGraph`, `PeriodProbe`, `FrequencyControl` |

### Exam and Measurement Core

| Глава | Неправильная модель ученика | Главный интерактивный опыт | Что крутит ученик | Что меняется на экране | Формула после опыта | ЦТ/ЦЭ-навык | Визуальная метафора | Reusable primitives |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Единицы, округление и порядок величин | Главное - подставить числа; единицы можно дописать потом | Одна задача ломается при неверных единицах и чинится при переводе | единицы ввода, округление, значащие цифры | Подстановка, размерности, ответ до/после перевода | no single law; dimension checks | СИ, округление, sanity check, формат части B | Диагностический сканер ответа | `UnitConverter`, `DimensionalCheck`, `RoundingPanel`, `AnswerFormatCard` |

## 4. Visual Philosophy

Каждая ключевая глава может быть уникальной сценой, но она обязана говорить на общем языке PhysicsLab.

Общие визуальные правила:

| Элемент | Роль | Правило |
| --- | --- | --- |
| Dark lab | Общая атмосфера | Тёмная лабораторная среда, не generic dashboard и не белый EdTech |
| Cyan | Данные, графики, оси, связи | Использовать для измеряемых величин и instrument UI, не для всех рамок подряд |
| Yellow | Действие, текущий фокус, активная переменная | Play, текущая точка, `v` в velocity-главах, главный readout |
| Formula glow | Формула как сжатая модель | Формула появляется после наблюдения или рядом с ним; glow помогает фокусу, не превращает блок в постер |
| Instrument graph | График как прибор | Оси, единицы, ticks, current point, projection lines; график не должен выглядеть как декоративный SVG |
| Safe-to-fail feedback | Ошибка без стыда | Неверный ответ объясняет модель, не просто краснеет |
| Mascot | Педагогическая поддержка | Только там, где снижает тревожность, объясняет ловушку или подводит итог |

Уникальность главы разрешена через физическую сцену: тележка, поршень, катушка, линза, цепь, pV-график. Но общие controls, graph skin, feedback, formula card и content rhythm должны быть узнаваемыми.

## 5. Architecture Implications

PhysicsLab нельзя масштабировать как набор вручную сверстанных страниц. Нужны отдельные слои.

### 5.1 Reusable primitives

| Primitive | Назначение | Что должно быть общим |
| --- | --- | --- |
| `LabConsole` | Главный контейнер интерактивной сцены | glass shell, visual hierarchy, responsive spacing |
| `MotionTrack` | Одномерное движение, ось, ticks, точка, стрелка | scale mapping, readouts, reduced-motion behavior |
| `InstrumentGraph` | Графики `x(t)`, `v(t)`, `pV`, `I(U)` | axes, units, grid, current point, slope/area probes |
| `ControlDock` | Play/reset/presets/sliders | единый dock, keyboard access, touch targets |
| `FormulaCard` | Формула как compressed model | переменные, единицы, условия применимости, active highlight |
| `MisconceptionPanel` | Ловушка и замена модели | почему ошибка логична, что заменить |
| `PredictionPrompt` | Короткое предсказание перед действием | один вопрос, не тест на оценку |
| `MiniQuiz` | Concept/graph/exam check | feedback, `aria-live`, no color-only status |
| `UnitCheck` | СИ, размерности, округление | reusable checks for exam tasks |
| `ExamTaskCard` | Original CT/CE-style practice | metadata, answer format, review status |
| `CharacterBubble` | Маскот как учебный гид | role-based states, sparse usage |

### 5.2 Chapter-specific scenes

Сцены остаются специфичными для физики:

- `UniformMotionScene`;
- `AccelerationScene`;
- `CartForceScene`;
- `InclineForcesScene`;
- `CollisionScene`;
- `CircuitScene`;
- `PistonPVScene`;
- `LensBenchScene`.

Общее правило: сцена может быть уникальной, но controls, graph, feedback и content metadata не должны каждый раз изобретаться заново.

### 5.3 Physics engines

Физика должна жить в `src/lib/physics/*` как чистые функции:

- kinematics;
- dynamics;
- energy;
- momentum;
- circuits;
- thermodynamics;
- optics;
- units and rounding.

DOM, CSS, requestAnimationFrame и canvas/SVG не должны попадать в physics engine. Если вычисление можно проверить без браузера, оно должно иметь unit test.

### 5.4 Content model

Текущая minimal collection для `chapters` - правильное начало, но она пока покрывает только базовые тексты. Master plan v2 требует расширения:

```text
chapter metadata
learning contract
misconceptions
prerequisite checks
interactive lab config
formula blocks
worked examples
faded examples
quiz items
exam tasks
unit checks
review status
asset references
```

Не нужно сразу делать универсальный renderer всех глав. Но новая глава не должна начинаться как монолитный Astro-файл без content metadata.

### 5.5 Exam task model

Нужна отдельная модель задач:

- `id`;
- `topic`;
- `skills`;
- `format: A | B`;
- `answerType`;
- `units`;
- `requiresRounding`;
- `misconceptions`;
- `source: original`;
- `authorReviewRequired`;
- solution steps;
- feedback for common wrong answers.

Задачи нельзя копировать из РИКЗ, учебников или сборников. Можно тренировать тот же навык, но с оригинальной формулировкой, числами и контекстом.

### 5.6 Visual assets

Ассеты делятся на:

- reference samples in `design-references/`;
- production visual assets with license notes;
- mascot concept art;
- mascot production states;
- generated motion frames;
- chapter-specific diagrams.

Reference PNG не является production asset. Маскот-концепты с checkerboard-фоном или без проверенного alpha не должны попадать в учебный UI.

## 6. Current Implementation Audit: `/chapters/uniform-motion/`

Текущая глава - полезный prototype v1, но не production template.

### Preserve

| Что сохранить | Почему |
| --- | --- |
| Сначала лаборатория, потом FormulaScene | Соответствует student-first маршруту: действие -> наблюдение -> формула |
| `UniformMotionLab` как real-time lab | Есть requestAnimationFrame, play/pause/reset, текущая точка, график и синхронизация |
| Чистые функции в `src/lib/physics/kinematics.ts` | Это правильное разделение physics engine и UI |
| `visualTarget="v1"` для production-главы | Даёт тестируемый marker, что глава использует текущий visual target |
| Content collection для базовых текстов | Правильный первый шаг к chapter content model |
| Screenshot workflow | Обязателен для visual regression и mobile checks |
| Student-first wording pass | Важный сдвиг от учебникового тона к маршруту "нажал -> понял" |

### Rewrite later

| Что переписать | Причина |
| --- | --- |
| `FormulaScene` как standalone интерактив без параметров | Она должна стать reusable `FormulaCard/FormulaScene` с данными главы, переменными, units и active variable mapping |
| Внутренние стили лаборатории | Сейчас много визуального языка живёт локально; нужно вынести primitives: `LabConsole`, `InstrumentGraph`, `MotionTrack`, `ControlDock` |
| Quiz внутри главы | Нужна единая quiz/task model, feedback schema и статусы review |
| Content collection schema | Сейчас она минимальная и не покрывает misconceptions, examples, unit checks, tasks |
| Графики и motion rendering | Для некоторых будущих глав может понадобиться shared SVG/canvas layer вместо локального SVG |

### Temporarily acceptable

| Что оставить временно | Почему допустимо |
| --- | --- |
| Конкретная страница `/chapters/uniform-motion.astro` вместо `[slug].astro` | Одна глава ещё не оправдывает generic renderer |
| `authorReviewRequired` как видимый статус | Полезно для команды, но позже нужно отделить student UI от author/review UI |
| Design-board как visual target v1 | Можно использовать как reference, но не считать production-design-system |
| One-off script для нижней проверки | Допустимо для prototype v1, но должно уйти в `MiniQuiz` |

### Contradictions with master plan v2

| Противоречие | Почему важно |
| --- | --- |
| Глава ещё не имеет полного цикла prediction -> transfer | Есть действие и check, но нет полноценного prediction, worked/faded example и exam task |
| Нет unit/rounding layer | Для равномерного движения уже нужны `м`, `м/с`, `с`, `Δx`, но проверка единиц пока не системная |
| FormulaScene не связана statefully с лабораторией | Ученик видит две связанные идеи, но компоненты не являются одной управляемой моделью |
| Нет structured misconception model | Ошибка "график не дорога" есть в тексте, но не как reusable schema |
| Нет exam task model | Нижняя проверка концептуальная, но не ЦТ/ЦЭ-style задача с answer format |

### Not final

Не считать финальными:

- текущий визуальный код `UniformMotionLab`;
- локальные CSS-примеси chapter page;
- текущую content schema;
- текущую FormulaScene API;
- design-board как production implementation;
- mascot concept assets;
- отсутствие `[slug].astro`;
- отсутствие task/quiz collections;
- текущий набор тестов как полный QA.

## 7. MVP Recommendation

Первый публичный MVP должен показать, что PhysicsLab умеет не просто красиво объяснять, а строить физическое мышление через разные типы сцен.

Рекомендуемый порядок 6 глав:

| Порядок | Глава | Почему в MVP | Главный reusable payoff |
| --- | --- | --- | --- |
| 1 | Равномерное движение | Уже есть prototype v1; закрепляет стандарт "график не дорога" | `MotionTrack`, `InstrumentGraph`, `ControlDock`, content collection |
| 2 | Равноускоренное движение | Продолжает механику и сразу тренирует `x(t)`, `v(t)`, `a(t)` | `LinkedGraphs`, `AreaUnderGraph`, sign convention |
| 3 | Второй закон Ньютона через тележки | Исправляет ключевую ошибку "сила нужна для движения" | `ForceVector`, `CartScene`, proportionality graph |
| 4 | Энергия | Даёт альтернативную модель решения задач без постоянного поиска ускорения | `EnergyBars`, work/energy transfer |
| 5 | Закон Ома + базовый участок цепи | Показывает, что PhysicsLab не только механика | `CircuitSegment`, meters, graph `I(U)` |
| 6 | Линзы | Сильный визуальный proof: лучи, изображение, реальные/мнимые случаи | `RayDiagram`, `LensBench`, image classifier |

Что не включать в первый публичный MVP:

- pV-диаграммы: важны, но требуют аккуратного graph/area layer и высокой physics review точности.
- Электромагнитная индукция: визуально мощная, но сложнее для первого release из-за направлений, Ленца и motion.
- Полный курс с десятками глав: риск scope creep выше пользы.

## 8. Risks

| Риск | Как проявится | Контроль |
| --- | --- | --- |
| Стоимость уникальных интерактивов | Каждая глава превращается в отдельную мини-игру | Общие primitives + chapter-specific scenes только там, где физика требует |
| Оригинальность задач | Соблазн быстро взять задачи из сборников | `source: original`, review status, task metadata, запрет на копирование |
| Мобильная производительность | Canvas/starfield/glow тормозят на телефонах | motion budget, reduced motion, mobile screenshots, no endless decoration |
| Визуальная дисциплина | Dark Anime Lab превращается в неоновый шум | Один главный смысл на экран, cyan/yellow semantics, review against reference |
| Физическая корректность | Красивый интерактив даёт неверную модель | physics engine tests + physics review, explicit assumptions and units |
| Scope creep | Вместо MVP строится весь учебник сразу | 6 MVP chapters, hard Definition of Done, no universal renderer before repeated need |
| Generic SaaS drift | Внешние UI refs превращают проект в dashboard | Все UI refs проходят adaptation under PhysicsLab visual language |
| Маскот как шум | Персонаж начинает конкурировать с графиком | Use only for anxiety, trap, hint, summary; never beside every formula |
| Exam relevance drift | Глава понятная, но не тренирует формат | Every chapter needs CT/CE-style check and unit/rounding where relevant |

## 9. Decision Rules

### Когда глава может быть "арт-объектом"

Можно делать уникальную сцену с сильным visual identity, если выполняются все условия:

- физическая ситуация сама визуальна: линза, катушка, pV-поршень, столкновение, тележка;
- интерактив исправляет конкретную неправильную модель;
- главный результат виден рядом с действием;
- mobile layout не превращается в уменьшенный desktop;
- reduced-motion fallback сохраняет смысл;
- reusable primitives не ломаются ради одного эффекта;
- команда готова поддерживать эту сцену.

### Когда нужно проще

Делать проще, если:

- глава проверяет в основном выбор формулы, units или округление;
- сцена не добавляет понимания;
- на mobile появляется стена панелей;
- график/формула становятся меньше декора;
- для эффекта нужна новая тяжёлая зависимость;
- физика ещё не прошла review.

### Когда переписывать текущий код

Переписывать, если:

- один паттерн повторился в 2-3 главах и стал локальным copy-paste;
- компонент смешивает physics engine, DOM, анимацию и content strings;
- интерактив не может получить данные из content model;
- mobile fixes требуют всё больше локальных исключений;
- тесты проверяют случайные DOM-детали вместо учебного поведения;
- visual layer мешает accessibility или reduced motion.

### Когда продолжать текущий код

Продолжать, если:

- прототип уже доказывает learning flow;
- изменения улучшают конкретную главу без расширения API;
- ещё нет второго похожего кейса для abstraction;
- rewrite задержит MVP без явной учебной пользы;
- physics engine уже отделён и тестируется.

## 10. Near-Term Practical Plan

| Следующий шаг | Результат |
| --- | --- |
| Stabilize `UniformMotionLab` as prototype v1 | Зафиксировать поведение, screenshots, known limitations |
| Expand content schema only one layer at a time | Добавить misconceptions, formulas, checks без universal renderer |
| Build `FormulaCard` production primitive | Заменить standalone formula blocks на data-driven component |
| Prototype `AccelerationScene` | Проверить, переносится ли `MotionTrack`/`InstrumentGraph` на новую физику |
| Create `ExamTaskCard` schema + one original task | Связать лабораторию с ЦТ/ЦЭ transfer |
| Do physics review checklist before public claim | Не публиковать как финальное без проверки автора |

## 11. Bottom Line

PhysicsLab v2 должен масштабироваться не как набор красивых страниц, а как система учебных сцен.

Текущая реализация равномерного движения ценна как proof of direction:

- у неё есть живое время;
- график и движение синхронизированы;
- visual target уже ближе к Dark Anime Lab;
- тексты начали переезжать в content collection.

Но она не является финальной архитектурой. Следующий качественный скачок - не ещё один polish pass, а переход к reusable learning primitives, physics engines, structured content, original exam tasks and review workflow.
