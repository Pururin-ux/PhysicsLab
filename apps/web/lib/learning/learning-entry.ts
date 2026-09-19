import { textbookChapters, type SchoolGrade } from "./textbook.ts";

export const learningGroupDefinitions = [
  { id: "grade-7", label: "7 класс" },
  { id: "grade-8", label: "8 класс" },
  { id: "grade-9", label: "9 класс" },
  { id: "grade-10", label: "10 класс" },
  { id: "additional-practice", label: "Дополнительная практика" },
] as const;

export type LearningGroupId = (typeof learningGroupDefinitions)[number]["id"];

function learningGroupForGrade(grade: SchoolGrade): LearningGroupId {
  return `grade-${grade}`;
}

export type LearningResource = { label: string; href: string };
export type LearningEntry = {
  id: string; title: string; question: string; grade?: SchoolGrade; group: LearningGroupId;
  unit?: string; prerequisite: string; resources: LearningResource[];
  connection?: LearningResource; coverage?: string; keywords?: string;
};

// Available material, not an official course sequence.
const chapterEntries: Record<string, Pick<LearningEntry, "question" | "resources" | "connection" | "keywords">> = {
  "physical-body-phenomenon-quantity": {question:"Чем тело отличается от явления и физической величины?",keywords:"физическое тело явление величина вещество измерить вычислить",resources:[],connection:{label:"Как проверить объяснение наблюдаемого явления?",href:"/learn/scientific-method"}},
  "scientific-method": {question:"Как отличить гипотезу от уже проверенного результата?",keywords:"наблюдение факт гипотеза опыт эксперимент проверка условие",resources:[],connection:{label:"Из чего складывается запись физической величины?",href:"/learn/si-units-and-operations"}},
  "si-units-and-operations": {question:"Почему при смене единицы меняется число, но не сама величина?",keywords:"си единица метр килограмм секунда перевод однородные величины",resources:[],connection:{label:"Как физическую величину измеряют или вычисляют?",href:"/learn/measuring-volume"}},
  "measuring-volume": {
    question: "Как найти объём, если прибор показывает только длину?", keywords: "измерение объем объём брусок линейка мензурка прямое косвенное", resources: [],
    connection: { label: "Прибор показывает значение между отметками. Разберись, как прочитать его по шкале.", href: "/learn/reading-scales" },
  },
  "reading-scales": {
    question: "Как узнать значение между цифрами на шкале?", keywords: "мензурка измерение деление объем", resources: [],
    connection: { label: "Почему растворённое вещество остаётся в воде, хотя его частиц не видно?", href: "/learn/particle-model-and-diffusion" },
  },
  "particle-model-and-diffusion": {
    question: "Чернила расходятся по воде — мы уже видим движение молекул?", keywords: "вещество частица молекула атом диффузия тепловое броуновское движение взаимодействие", resources: [],
    connection: { label: "Как те же частицы дают твёрдое тело, жидкость или газ?", href: "/learn/states-temperature-expansion" },
  },
  "states-temperature-expansion": {
    question: "Почему нагретый шар перестаёт проходить через то же кольцо?", keywords: "агрегатное состояние твердое жидкое газ температура термометр тепловое расширение", resources: [],
    connection: { label: "Состояние и температура влияют на плотность. Сравним массу одинаковых объёмов.", href: "/learn/density" },
  },
  "uniform-motion": {
    question: "Как узнать, сколько метров тело проходит за секунду?", keywords: "движение путь скорость время равномерное",
    resources: [{ label: "Задачи на путь, скорость и время", href: "/practice/family/uniform-motion-basic" }],
    connection: { label: "Запиши то же движение не формулой, а графиком пути и скорости.", href: "/learn/uniform-motion-graphs" },
  },
  "uniform-motion-graphs": {
    question: "Почему один график растёт, а другой остаётся горизонтальным?", keywords: "график путь скорость время равномерное s(t) v(t)",
    resources: [{ label: "Задачи по графикам равномерного движения", href: "/practice/family/uniform-motion-graphs" }],
    connection: { label: "А если скорость меняется или автобус остановился? Перейди к средней скорости.", href: "/learn/uneven-motion" },
  },
  "uneven-motion": {
    question: "Почему остановка уменьшает среднюю скорость, хотя путь не меняется?", keywords: "неравномерное движение средняя скорость остановка путь время",
    resources: [{ label: "Задачи на весь путь и всё время", href: "/practice/family/average-speed-with-stop" }],
    connection: { label: "Скорость может измениться. Теперь разберём, что вызывает это изменение.", href: "/learn/inertia" },
  },
  inertia: {
    question: "Почему тело продолжает двигаться, когда его перестали толкать?", resources: [],
    connection: { label: "Движение сохраняется. А что может его изменить? Разберём действие силы.", href: "/learn/force-and-dynamometer" },
  },
  density: {
    question: "Большое тело обязательно тяжелее маленького?", keywords: "вещество масса объем",
    resources: [{ label: "Опыт с массой и объёмом", href: "/practice/density-lesson" }, { label: "Задачи на плотность", href: "/practice/family/density-volume-ratio" }],
    connection: { label: "Нужен объём образца? Вспомни, как читать шкалу прибора.", href: "/learn/reading-scales" },
  },
  "force-and-dynamometer": {
    question: "Что показывает растянувшаяся пружина?", keywords: "сила ньютон измерение", resources: [],
    connection: { label: "К чему приложены тяжесть, упругость и вес? Разберём на том же грузе.", href: "/learn/gravity-elasticity-weight" },
  },
  "gravity-elasticity-weight": {
    question: "Почему тяжесть и вес — не одна и та же сила?", keywords: "сила тяжести упругость вес опора подвес",
    resources: [{ label: "Задачи на силу тяжести", href: "/practice/family/gravity-force" }],
    connection: { label: "На тело действует несколько сил. Как найти их общий результат?", href: "/learn/resultant-force-and-friction" },
  },
  "resultant-force-and-friction": {
    question: "Почему тележка может двигаться, когда равнодействующая равна нулю?", keywords: "равнодействующая сложение сил трение сопротивление",
    resources: [{ label: "Задачи на равнодействующую", href: "/practice/family/resultant-force" }],
    connection: { label: "Та же сила приходится на разную площадь. Что изменится?", href: "/learn/pressure" },
  },
  pressure: {
    question: "Почему узкая опора оставляет более глубокую вмятину?",
    resources: [{ label: "Задачи на давление", href: "/practice/family/contact-pressure" }],
    connection: { label: "Почему запертый воздух мешает вдвигать поршень?", href: "/learn/gas-pressure-and-pascal" },
  },
  "gas-pressure-and-pascal": {question:"Почему маленький поршень может поднять тяжёлую машину?",keywords:"газ давление сжатие температура закон Паскаля жидкость поршень гидравлический домкрат",resources:[],connection:{label:"А как давление меняется под поверхностью воды?",href:"/learn/hydrostatic-pressure"}},
  "hydrostatic-pressure": {question:"Почему глубже под водой давление больше?",keywords:"жидкость глубина гидростатическое давление сообщающиеся сосуды",resources:[{label:"Задачи на давление жидкости",href:"/practice/family/hydrostatic-pressure"}],connection:{label:"Давит и вода, и воздух. Откуда берётся атмосферное давление?",href:"/learn/atmospheric-pressure"}},
  "atmospheric-pressure": {question:"Почему барометр показывает меньше при подъёме?",keywords:"атмосфера воздух давление барометр манометр Торричелли высота",resources:[],connection:{label:"Давление создаёт силу. Когда эта сила совершает работу?",href:"/learn/mechanical-work"}},
  "mechanical-work": {question:"Сила действует — значит, работа всегда совершается?",keywords:"механическая работа джоуль сила путь знак",resources:[{label:"Задачи на работу силы",href:"/practice/family/work-force-distance"}],connection:{label:"Какая часть затраченной работы даёт нужный результат?",href:"/learn/mechanical-efficiency"}},
  "mechanical-efficiency": {question:"Почему механизм не отдаёт всю затраченную работу?",keywords:"кпд коэффициент полезного действия полная совершенная работа потери трение",resources:[{label:"Задачи на КПД",href:"/practice/family/mechanical-efficiency"}],connection:{label:"Та же работа за разное время — что изменится?",href:"/learn/mechanical-power"}},
  "mechanical-power": {question:"Почему одинаковую работу можно выполнить с разной мощностью?",keywords:"механическая мощность ватт работа время",resources:[{label:"Задачи на мощность",href:"/practice/family/mechanical-power"}],connection:{label:"Как движущееся тело может само совершить работу?",href:"/learn/kinetic-energy"}},
  "kinetic-energy": {question:"Почему двойная скорость даёт в четыре раза больше энергии?",keywords:"кинетическая энергия масса скорость квадрат джоуль",resources:[{label:"Задачи на кинетическую энергию",href:"/practice/family/kinetic-energy"}],connection:{label:"Может ли неподвижное тело обладать энергией?",href:"/learn/potential-energy"}},
  "potential-energy": {question:"Почему энергия зависит от выбранного нулевого уровня?",keywords:"потенциальная энергия высота нулевой уровень деформация",resources:[{label:"Задачи на потенциальную энергию",href:"/practice/family/gravitational-potential-energy"}],connection:{label:"Что происходит, когда энергия движения превращается в энергию высоты?",href:"/learn/mechanical-energy-conservation"}},
  "mechanical-energy-conservation": {question:"Куда исчезает энергия движения подброшенного тела?",keywords:"сохранение механической энергии кинетическая потенциальная высота сопротивление",resources:[{label:"Задачи на сохранение энергии",href:"/practice/family/mechanical-energy-conservation"}],connection:{label:"Вернуться к оглавлению 7 класса",href:"/learn?grade=7"}},
  "internal-energy-and-heat-transfer": {question:"Как тепло проходит через металл, воду и пустое пространство?",keywords:"внутренняя энергия теплообмен теплопроводность конвекция излучение вакуум",resources:[],connection:{label:"Теперь рассчитай, сколько энергии получает тело при нагревании",href:"/learn/heat-amount-and-balance"}},
  "heat-amount-and-balance": {question:"Почему воде и металлу для одинакового нагревания нужна разная энергия?",keywords:"теплота нагревание охлаждение удельная теплоемкость теплоёмкость масса температура тепловой баланс",resources:[{label:"Задачи на нагревание",href:"/practice/family/heat-amount"},{label:"Задачи на тепловой баланс",href:"/practice/family/heat-balance-simple"}],connection:{label:"Сколько энергии можно получить из топлива?",href:"/learn/fuel-combustion"}},
  "fuel-combustion": {question:"Почему килограмм бензина и килограмм дров дают разное количество теплоты?",keywords:"горение топливо удельная теплота сгорания масса энергия q",resources:[{label:"Задачи на теплоту сгорания",href:"/practice/family/fuel-combustion-heat"}],connection:{label:"Что происходит, когда энергия поступает, а температура не растёт?",href:"/learn/melting-and-crystallization"}},
  "melting-and-crystallization": {question:"Почему лёд плавится при постоянной температуре?",keywords:"плавление кристаллизация лёд удельная теплота плавления лямбда агрегатное состояние",resources:[{label:"Задачи на нагревание и плавление льда",href:"/practice/family/phase-change-heat"}],connection:{label:"Чем испарение отличается от кипения?",href:"/learn/evaporation-and-boiling"}},
  "evaporation-and-boiling": {question:"Почему лужа исчезает без кипения?",keywords:"испарение кипение конденсация пар парообразование температура кипения давление удельная теплота L",resources:[{label:"Задачи на нагревание и парообразование",href:"/practice/family/vaporization-heat"}],connection:{label:"После тепловых явлений разберись, откуда у тела появляется электрический заряд",href:"/learn/electric-charge-and-atom"}},
  "electric-charge-and-atom": {question:"Почему заряженная линейка притягивает даже нейтральную фольгу?",keywords:"электризация заряд электрон протон атом ион проводник диэлектрик электроскоп влияние индукция",resources:[{label:"Задачи на элементарный заряд",href:"/practice/family/elementary-charge-count"}],connection:{label:"Заряд может двигаться по проводнику. Собери из проводников замкнутую цепь",href:"/learn/electric-current-and-ohms-law"}},
  "electric-current-and-ohms-law": {question:"Сопротивление выросло. Что станет с током?",keywords:"электричество цепь ток напряжение сопротивление амперметр вольтметр закон Ома",resources:[{label:"Опыт с цепью",href:"/practice/electro-lesson"},{label:"Задачи на закон Ома",href:"/practice/family/ohm-law"}],connection:{label:"Откуда у самого проводника берётся сопротивление?",href:"/learn/conductor-resistance"}},
  "conductor-resistance": {question:"Почему длинный тонкий провод сопротивляется сильнее?",keywords:"электричество сопротивление проводник удельное сопротивление длина площадь поперечного сечения медь нихром",resources:[{label:"Рассчитать сопротивление провода",href:"/practice/family/conductor-resistance"}],connection:{label:"Что изменится, если соединить несколько сопротивлений одним путём или ветвями?",href:"/learn/series-and-parallel-circuits"}},
  "series-and-parallel-circuits": {question:"Почему один прибор выключается, а соседний продолжает работать?",keywords:"электричество цепь последовательное параллельное соединение ветвь резистор реостат сопротивление",resources:[{label:"Задачи на соединения резисторов",href:"/practice/family/resistor-network"}],connection:{label:"Схема собрана. Теперь разберись, сколько энергии передаёт ток",href:"/learn/electric-work-and-power"}},
  "electric-work-and-power": {question:"Чем 24 ватта отличаются от 240 джоулей?",keywords:"электричество работа мощность энергия теплота джоуль ватт киловатт-час закон Джоуля Ленца",resources:[{label:"Задачи на мощность тока",href:"/practice/family/electric-power"}],connection:{label:"Как мощности нескольких приборов превращаются в нагрузку общей проводки?",href:"/learn/electricity-use-and-safety"}},
  "electricity-use-and-safety": {question:"Почему несколько исправных приборов могут перегрузить одну проводку?",keywords:"электричество безопасность экономия перегрузка короткое замыкание предохранитель автомат мощность ток проводка",resources:[{label:"Закрепить связь мощности и тока",href:"/practice/family/electric-power"}],connection:{label:"Ток нагревает провод. А может ли он повернуть стрелку компаса?",href:"/learn/magnetic-field-and-electromagnet"}},
  "magnetic-field-and-electromagnet": {question:"Как обнаружить невидимое магнитное поле?",keywords:"магнит магнитное поле полюс компас стрелка линии поле тока Эрстед катушка соленоид электромагнит правило правой руки",resources:[{label:"Задачи на направление поля",href:"/practice/family/magnetic-field-direction"}],connection:{label:"Следующая глава начинается с источника света и прямого луча",href:"/learn/light-sources-and-shadows"}},
  "light-sources-and-shadows": {question:"Почему край тени бывает резким или мягким?",keywords:"оптика источник света световой луч прямолинейное распространение точечный протяжённый источник тень полутень экран",resources:[{label:"Различить тень и полутень",href:"/practice/family/shadow-and-penumbra"}],connection:{label:"Луч дошёл до поверхности. Куда он пойдёт после отражения?",href:"/learn/reflection-of-light"}},
  "reflection-of-light": {question:"От зеркала или от нормали — откуда считать угол?",keywords:"оптика свет луч отражение зеркало нормаль угол зеркальное диффузное",resources:[{label:"Опыт с зеркалом",href:"/practice/optics-lesson"},{label:"Задачи на отражение",href:"/practice/family/reflection-angle"}],connection:{label:"Луч отразился и попал в глаз. Почему изображение видно за зеркалом?",href:"/learn/plane-mirror-image"}},
  "plane-mirror-image": {question:"Почему изображение видно за зеркалом, если свет туда не проходит?",keywords:"оптика зеркало мнимое изображение симметрия расстояние предмет экран",resources:[{label:"Задачи на положение изображения",href:"/practice/family/plane-mirror-separation"}],connection:{label:"Зеркало возвращает свет. А что происходит, когда свет входит в воду?",href:"/learn/refraction-of-light"}},
  "refraction-of-light": {question:"Почему ложка в воде кажется переломанной?",keywords:"оптика преломление свет луч вода воздух нормаль угол плотная среда",resources:[{label:"Задачи на направление луча",href:"/practice/family/refraction-direction"}],connection:{label:"Кривые поверхности преломляют целый пучок. Куда направит его линза?",href:"/learn/lenses-and-optical-power"}},
  "lenses-and-optical-power": {question:"Почему одна линза собирает лучи, а другая рассеивает?",keywords:"оптика линза собирающая рассеивающая фокус фокусное расстояние оптическая сила диоптрия",resources:[{label:"Задачи на оптическую силу",href:"/practice/family/lens-optical-power"}],connection:{label:"Фокус найден. Как положение предмета определяет изображение?",href:"/learn/images-in-thin-lenses"}},
  "images-in-thin-lenses": {question:"Когда изображение можно поймать экраном?",keywords:"оптика линза изображение действительное мнимое перевернутое увеличенное уменьшенное фокус экран лупа",resources:[{label:"Определить свойства изображения",href:"/practice/family/lens-image-properties"}],connection:{label:"Линза строит изображение. Как ту же задачу решает глаз?",href:"/learn/eye-optical-system"}},
  "eye-optical-system": {question:"Как глаз сохраняет резкость, когда взгляд переходит вдаль?",keywords:"оптика глаз роговица зрачок хрусталик сетчатка аккомодация зрение фокус",resources:[],connection:{label:"Что происходит, если фокус оказывается перед сетчаткой или за ней?",href:"/learn/vision-defects-and-correction"}},
  "vision-defects-and-correction": {question:"Почему при разных дефектах зрения нужны линзы с разным знаком?",keywords:"оптика зрение близорукость дальнозоркость миопия гиперметропия очки линза коррекция сетчатка фокус диоптрия",resources:[{label:"Подобрать корректирующую линзу",href:"/practice/family/vision-correction"}],connection:{label:"Вернуться к оглавлению 8 класса",href:"/learn?grade=8"}},
  "mechanical-motion-model": {question:"Когда реальное тело можно заменить материальной точкой?",keywords:"кинематика механическое движение материальная точка абсолютно твёрдое тело поступательное вращение модель размеры",resources:[],connection:{label:"Модель выбрана. Относительно чего описывать её движение?",href:"/learn/reference-frames-and-vectors"}},
  "reference-frames-and-vectors": {question:"Почему координата и направление ничего не значат без выбранной системы отсчёта?",keywords:"система отсчёта тело отсчёта часы координаты оси скаляр вектор проекция знак",resources:[],connection:{label:"Система выбрана. Теперь сравни путь и вектор перемещения.",href:"/learn/path-and-displacement"}},
  "path-and-displacement": {
    question: "Вернулся на старт — значит, никуда не ходил?", resources: [],
    connection: { label: "Положение изменилось. Теперь запишем координату через время.", href: "/learn/uniform-rectilinear-motion" },
  },
  "uniform-rectilinear-motion": {
    question: "Почему отрицательная скорость может привести тело точно в начало координат?",
    keywords: "равномерное прямолинейное движение координата начальная координата проекция скорости знак x=x0+vxt",
    resources: [{ label: "Задачи на координатный закон", href: "/practice/family/uniform-coordinate-law" }],
    connection: { label: "Запишем тот же закон линией и найдём встречу двух тел.", href: "/learn/uniform-motion-coordinate-graphs" },
  },
  "uniform-motion-coordinate-graphs": {
    question: "Почему пересечение графиков координаты означает встречу?",
    keywords: "график координаты скорость перемещение путь площадь наклон встреча x(t) vx(t)",
    resources: [{ label: "Задачи на координату и знак скорости", href: "/practice/family/uniform-coordinate-law" }],
    connection: { label: "Постоянная скорость разобрана. Что меняется при неравномерном движении?", href: "/learn/average-speed" },
  },
  "average-speed": {
    question: "Можно ли просто взять среднее двух скоростей?",
    resources: [{ label: "Расследование с Мио", href: "/practice/average-speed-lesson" }, { label: "Задачи на два участка", href: "/practice/family/average-speed-segments" }],
    connection: { label: "Скорость пути и скорость перемещения различаются. Сначала сравни путь и перемещение.", href: "/learn/path-and-displacement" },
  },
  acceleration: {
    question: "Как по изменению скорости понять ускорение?", keywords: "график торможение разгон",
    resources: [{ label: "Опыт с графиком скорости", href: "/practice/kinematics-lesson" }, { label: "Задачи по графику", href: "/practice/family/vt-slope" }],
    connection: { label: "Ускорение известно. Как по нему найти скорость и перемещение?", href: "/learn/uniformly-accelerated-motion" },
  },
  "uniformly-accelerated-motion": {question:"Как один график показывает ускорение и перемещение?",keywords:"равнопеременное движение постоянное ускорение график скорости площадь наклон перемещение координата",resources:[{label:"Найти ускорение по наклону",href:"/practice/family/vt-slope"},{label:"Найти перемещение по площади",href:"/practice/family/vt-area"}],connection:{label:"Может ли ускорение быть при постоянном модуле скорости?",href:"/learn/circular-motion-kinematics"}},
  "circular-motion-kinematics": {question:"Почему точки одного диска имеют одну угловую, но разные линейные скорости?",keywords:"движение по окружности радиус вектор радиан угловая линейная скорость период частота вращение",resources:[{label:"Задачи на частоту вращения",href:"/practice/family/rotation-frequency"}],connection:{label:"Почему при постоянном модуле скорости всё равно есть ускорение?",href:"/learn/centripetal-acceleration"}},
  "centripetal-acceleration": {question:"Почему ускорение направлено к центру, если скорость направлена по касательной?",keywords:"центростремительное нормальное ускорение окружность направление скорости радиус квадрат скорости",resources:[{label:"Задачи на ускорение к центру",href:"/practice/family/centripetal-acceleration"}],connection:{label:"Что сохраняет скорость, а что заставляет её меняться?",href:"/learn/interaction-inertia-and-mass"}},
  "interaction-inertia-and-mass": {question:"Почему тело может двигаться без постоянного толчка?",keywords:"взаимодействие сила первый закон Ньютона инерция инертность масса инерциальная система",resources:[],connection:{label:"Результирующая изменилась. Как сила и масса определят ускорение?",href:"/learn/newton-second-law"}},
  "newton-second-law": {question:"Почему одинаковая сила сильнее разгоняет лёгкую тележку?",keywords:"второй закон Ньютона сила масса ускорение равнодействующая результирующая",resources:[{label:"Опыт с тележками",href:"/practice/dynamics-lesson"},{label:"Задачи на второй закон Ньютона",href:"/practice/family/newton-second"}],connection:{label:"Одно тело действует на другое. Где находится ответная сила?",href:"/learn/newton-third-law"}},
  "newton-third-law": {question:"Почему равные противоположные силы не сокращаются?",keywords:"третий закон Ньютона действие противодействие пара сил разные тела Галилей инерциальные системы",resources:[],connection:{label:"Как взаимное действие проявляется при деформации?",href:"/learn/elastic-deformation-and-hooke-law"}},
  "elastic-deformation-and-hooke-law": {question:"Почему пружина сильнее тянет при большем растяжении?",keywords:"деформация упругая пластическая сила упругости закон Гука жесткость жёсткость пружина",resources:[],connection:{label:"Пружина сопротивляется деформации. Что сопротивляется движению по поверхности?",href:"/learn/friction-and-medium-resistance"}},
  "friction-and-medium-resistance": {question:"От чего действительно зависит сила трения?",keywords:"трение скольжения покоя сопротивление среды коэффициент нормальная реакция площадь контакт",resources:[{label:"Задачи на силу трения",href:"/practice/family/friction-force"}],connection:{label:"Как сила тяжести задаёт падение и полёт?",href:"/learn/motion-under-gravity"}},
  "motion-under-gravity": {question:"Почему брошенный горизонтально шарик падает столько же времени, сколько отпущенный?",keywords:"свободное падение горизонтальный бросок вертикальный бросок вверх ускорение свободного падения парабола дальность",resources:[{label:"Задачи на свободное падение",href:"/practice/family/free-fall"}],connection:{label:"А если начальная скорость направлена и вверх, и вперёд?",href:"/learn/projectile-motion-components"}},
  "projectile-motion-components": {question:"Почему две разные траектории могут закончиться на одинаковом расстоянии?",keywords:"бросок под углом парабола компоненты скорости дальность высота время полёта водяная струя",resources:[{label:"Задачи по компонентам скорости",href:"/practice/family/projectile-components"}],connection:{label:"Полёт разобран вблизи Земли. Почему сама сила тяжести меняется с расстоянием?",href:"/learn/universal-gravitation"}},
  "universal-gravitation": {question:"Почему на высоте притяжение становится слабее?",keywords:"закон всемирного тяготения гравитационная постоянная расстояние центры планета спутник орбита первая космическая скорость",resources:[{label:"Задачи на квадрат расстояния",href:"/practice/family/gravitation-distance"}],connection:{label:"Притяжение осталось тем же. Почему весы в лифте показывают другое?",href:"/learn/weight-weightlessness-overload"}},
  "weight-weightlessness-overload": {question:"Почему весы в лифте показывают больше или меньше обычного?",keywords:"вес сила тяжести реакция опоры лифт ускорение невесомость перегрузка",resources:[{label:"Задачи на вес в лифте",href:"/practice/family/weight-lift"}],connection:{label:"Силы уравновесились. Почему тело всё ещё может повернуться?",href:"/learn/force-moment-and-equilibrium"}},
  "force-moment-and-equilibrium": {question:"Почему равные противоположные силы могут повернуть тело?",keywords:"статика равновесие ось момент силы плечо линия действия правило моментов пара сил",resources:[{label:"Задачи на равновесие моментов",href:"/practice/family/torque-balance"}],connection:{label:"Как рычаг и блоки помогают поднять тяжёлый груз?",href:"/learn/simple-machines-levers-pulleys"}},
  "simple-machines-levers-pulleys": {question:"Почему подвижный блок уменьшает силу, а неподвижный — нет?",keywords:"статика простые механизмы рычаг блок неподвижный подвижный выигрыш в силе натяжение нити",resources:[{label:"Задачи на подвижный блок",href:"/practice/family/movable-pulley"},{label:"Задачи на рычаг",href:"/practice/family/torque-balance"}],connection:{label:"Можно выиграть в силе. А можно ли выиграть в работе?",href:"/learn/inclined-plane-work-efficiency"}},
  "inclined-plane-work-efficiency": {question:"Почему меньшая сила на наклонной плоскости не означает меньшую работу?",keywords:"статика наклонная плоскость золотое правило механики работа полезная совершенная КПД трение",resources:[{label:"Задачи на силу вдоль плоскости",href:"/practice/family/incline-force"},{label:"Задачи на КПД",href:"/practice/family/mechanical-efficiency"}],connection:{label:"Почему одно тело легко опрокинуть, а другое трудно?",href:"/learn/center-of-gravity-and-stability"}},
  "center-of-gravity-and-stability": {question:"Почему широкое низкое тело труднее опрокинуть?",keywords:"статика центр тяжести равновесие устойчивое неустойчивое безразличное опорная площадка опрокидывание",resources:[],connection:{label:"Как жидкость меняет условия равновесия тела?",href:"/learn/archimedes-force"}},
  "archimedes-force": {question:"Почему динамометр показывает меньше, когда тело опускают в воду?",keywords:"выталкивающая сила Архимеда жидкость газ плотность погруженный объем плавание",resources:[{label:"Задачи на силу Архимеда",href:"/practice/family/archimedes-force"}],connection:{label:"Как этой силой пользуются корабли и аэростаты?",href:"/learn/ships-and-ballooning"}},
  "ships-and-ballooning": {question:"Почему загруженное судно погружается глубже, но продолжает плавать?",keywords:"статика плавание судов корабль ватерлиния осадка водоизмещение грузоподъемность подводная лодка балласт аэростат воздушный шар",resources:[{label:"Задачи на грузоподъёмность",href:"/practice/family/ship-payload"},{label:"Повторить силу Архимеда",href:"/practice/family/archimedes-force"}],connection:{label:"Что сохраняется, когда тела действуют друг на друга?",href:"/learn/momentum-and-systems"}},
  "momentum-and-systems": {question:"Почему внутренние силы меняют импульсы тел, но не общий импульс системы?",keywords:"импульс тела системы сила время изменение импульса внутренние внешние силы граница системы",resources:[{label:"Задачи на импульс силы",href:"/practice/family/impulse-momentum"}],connection:{label:"Когда общий импульс можно считать постоянным?",href:"/learn/momentum-conservation-and-reactive-motion"}},
  "momentum-conservation-and-reactive-motion": {question:"Почему после сцепления тележек сохраняется импульс, но не скорость каждой тележки?",keywords:"закон сохранения импульса столкновение неупругий удар сцепление отдача реактивное движение ракета",resources:[{label:"Задачи на сцепление тележек",href:"/practice/family/inelastic-collision-speed"},{label:"Задачи на изменение импульса",href:"/practice/family/impulse-momentum"}],connection:{label:"Как направление силы определяет её работу?",href:"/learn/work-and-power-vectors"}},
  "work-and-power-vectors": {question:"Какая часть силы действительно меняет энергию вдоль пути?",keywords:"работа сила перемещение угол косинус проекция переменная сила график мощность",resources:[{label:"Задачи на работу силы под углом",href:"/practice/family/work-at-angle"},{label:"Задачи на мощность",href:"/practice/family/mechanical-power"}],connection:{label:"Где система хранит энергию взаимодействия?",href:"/learn/potential-energy-of-system"}},
  "potential-energy-of-system": {question:"Почему потенциальная энергия принадлежит системе, а её изменение не зависит от нулевого уровня?",keywords:"потенциальная энергия система тело Земля пружина нулевой уровень изменение",resources:[{label:"Задачи на потенциальную энергию",href:"/practice/family/gravitational-potential-energy"}],connection:{label:"Как работа равнодействующей меняет энергию движения?",href:"/learn/kinetic-and-total-energy"}},
  "kinetic-and-total-energy": {question:"Почему уменьшение механической энергии не означает исчезновения энергии?",keywords:"кинетическая механическая полная внутренняя энергия работа равнодействующей система отсчета",resources:[{label:"Задачи на кинетическую энергию",href:"/practice/family/kinetic-energy"}],connection:{label:"Когда механическая энергия сохраняется, а когда нужен полный баланс?",href:"/learn/energy-conservation-boundaries"}},
  "energy-conservation-boundaries": {question:"Что именно сохраняется после выбора границы системы?",keywords:"закон сохранения энергии граница системы внешняя работа трение внутренняя механическая энергия",resources:[{label:"Задачи на сохранение механической энергии",href:"/practice/family/mechanical-energy-conservation"}],connection:{label:"Вернуться к темам 9 класса",href:"/learn?grade=9"}},
  "molecular-kinetic-theory-evidence": {question:"Если молекулы не видны в капле, какие наблюдения подтверждают МКТ?",keywords:"10 класс молекулярно-кинетическая теория МКТ броуновское движение диффузия дискретность взаимодействие частицы доказательство",resources:[{label:"Повторить модель частиц 7 класса",href:"/learn/particle-model-and-diffusion"}],connection:{label:"Как массу видимого образца пересчитать в число невидимых молекул?",href:"/learn/molecular-mass-and-amount"}},
  "molecular-mass-and-amount": {question:"Как по массе образца узнать, сколько в нём молекул?",keywords:"10 класс масса молекулы размер молекулы количество вещества моль молярная масса постоянная Авогадро число частиц",resources:[{label:"Задачи на число молекул",href:"/practice/family/molecule-count-from-mass"}],connection:{label:"Как движение этих молекул создаёт давление газа?",href:"/learn/macro-micro-parameters-ideal-gas"}},
  "macro-micro-parameters-ideal-gas": {question:"Как невидимые удары молекул превращаются в показание манометра?",keywords:"10 класс идеальный газ макропараметры микропараметры давление концентрация средняя кинетическая энергия основное уравнение МКТ",resources:[{label:"Задачи на концентрацию частиц",href:"/practice/family/particle-concentration"}],connection:{label:"Почему температура измеряет среднюю энергию движения частиц?",href:"/learn/thermal-equilibrium-and-temperature"}},
  "thermal-equilibrium-and-temperature": {question:"Почему термометру нужно время, прежде чем его показание станет результатом?",keywords:"10 класс тепловое равновесие температура термометр шкала Кельвина абсолютный нуль постоянная Больцмана средняя кинетическая энергия",resources:[{label:"Задачи на энергию молекул",href:"/practice/family/molecular-kinetic-energy"}],connection:{label:"Как связаны давление, объём и температура одной порции газа?",href:"/learn/ideal-gas-state-equation"}},
  "ideal-gas-state-equation": {question:"Что остаётся неизменным, когда одна порция газа меняет давление, объём и температуру?",keywords:"10 класс уравнение состояния идеального газа Клапейрон Менделеев давление объём температура количество вещества газовая постоянная парциальное давление",resources:[{label:"Рассчитать одно состояние",href:"/practice/family/ideal-gas-state"},{label:"Сравнить два состояния",href:"/practice/family/gas-state-ratio"}],connection:{label:"Что произойдёт, если один из трёх параметров оставить постоянным?",href:"/learn/isoprocesses-ideal-gas"}},
  "isoprocesses-ideal-gas": {question:"Как один постоянный параметр меняет связь между двумя остальными?",keywords:"10 класс изопроцессы изотермический изобарный изохорный Бойль Мариотт Гей Люссак Шарль графики идеального газа",resources:[{label:"Задачи на три изопроцесса",href:"/practice/family/ideal-gas-isoprocess"},{label:"Общее сравнение состояний",href:"/practice/family/gas-state-ratio"}],connection:{label:"Почему твёрдые тела по-разному плавятся и проводят тепло по направлениям?",href:"/learn/solid-structure-and-properties"}},
  "solid-structure-and-properties": {question:"Как внутренний порядок частиц проявляется в свойствах твёрдого тела?",keywords:"10 класс кристалл решётка элементарная ячейка монокристалл поликристалл анизотропия изотропия аморфное тело плавление кварц обсидиан",resources:[{label:"Определить строение по свойствам",href:"/practice/family/solid-structure-properties"}],connection:{label:"Как близкое расположение частиц сочетается с текучестью жидкости?",href:"/learn/liquid-structure-and-properties"}},
  "liquid-structure-and-properties": {question:"Почему жидкость хранит объём, но меняет форму и собирается в капли?",keywords:"10 класс жидкость ближний порядок текучесть временное равновесие поверхностный слой поверхностное натяжение капля",resources:[{label:"Объяснить свойства жидкости",href:"/practice/family/liquid-structure-properties"}],connection:{label:"Почему в закрытом сосуде уровень жидкости перестаёт меняться?",href:"/learn/evaporation-condensation-saturated-vapor"}},
  "evaporation-condensation-saturated-vapor": {question:"Почему жидкость продолжает испаряться, хотя её уровень уже не меняется?",keywords:"10 класс испарение конденсация насыщенный ненасыщенный пар динамическое равновесие давление охлаждение",resources:[{label:"Разобрать баланс двух потоков",href:"/practice/family/vapor-dynamic-equilibrium"}],connection:{label:"Как температура меняет влажность воздуха, даже если количество пара то же?",href:"/learn/air-humidity-and-dew-point"}},
  "air-humidity-and-dew-point": {question:"Почему один и тот же водяной пар может ощущаться сухим или влажным?",keywords:"10 класс абсолютная относительная влажность насыщенный пар температура точка росы психрометр сухой влажный термометр",resources:[{label:"Рассчитать относительную влажность",href:"/practice/family/relative-humidity-pressure"}],connection:{label:"Вернуться к вопросам 10 класса",href:"/learn?grade=10"}},
  "relative-motion": {
    question: "Лодка идёт по воде. Почему берег не приближается?", keywords: "сложение скоростей система отсчета векторы река",
    resources: [{ label: "Задачи на сложение скоростей", href: "/practice/family/relative-velocity-vectors" }],
    connection: { label: "Сравниваем движение относительно разных тел. Вспомни направление перемещения.", href: "/learn/path-and-displacement" },
  },
};

export const learningEntries: LearningEntry[] = [
  ...textbookChapters.map(chapter => ({
    id: chapter.id, title: chapter.title, grade: chapter.grade,
    group: learningGroupForGrade(chapter.grade),
    prerequisite: chapter.prerequisite,
    ...chapterEntries[chapter.id],
    resources: [{ label: "Объяснение и опыт", href: `/learn/${chapter.id}` }, ...chapterEntries[chapter.id].resources],
  })),
  {
    id: "heat", title: "Состояние газа", group: "additional-practice" as const, question: "Как связаны давление, объём и температура газа?", keywords: "газ давление объем объём температура уравнение состояния",
    prerequisite: "Температура, энергия, масса и чтение графиков процессов.",
    resources: [{ label: "Выбрать тип задачи", href: "/tasks?topic=thermodynamics" }],
    coverage: "Доступны задачи и разборы по отдельным процессам. Связные главы добавляются последовательно.",
  },
];
