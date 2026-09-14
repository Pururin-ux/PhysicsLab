import { textbookChapters, type SchoolGrade } from "./textbook.ts";

export const learningGroupDefinitions = [
  { id: "grade-7", label: "7 класс" },
  { id: "grade-8", label: "8 класс" },
  { id: "grade-9", label: "9 класс" },
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
  "evaporation-and-boiling": {question:"Почему лужа исчезает без кипения?",keywords:"испарение кипение конденсация пар парообразование температура кипения давление удельная теплота L",resources:[{label:"Задачи на нагревание и парообразование",href:"/practice/family/vaporization-heat"}],connection:{label:"После тепловых явлений перейти к электрической цепи",href:"/learn/electric-current-and-ohms-law"}},
  "electric-current-and-ohms-law": {question:"Сопротивление выросло. Что станет с током?",keywords:"электричество цепь ток напряжение сопротивление амперметр вольтметр закон Ома",resources:[{label:"Опыт с цепью",href:"/practice/electro-lesson"},{label:"Задачи на закон Ома",href:"/practice/family/ohm-law"}],connection:{label:"Свет от лампы встречает поверхность. Разберись, куда он пойдёт дальше",href:"/learn/reflection-of-light"}},
  "reflection-of-light": {question:"От зеркала или от нормали — откуда считать угол?",keywords:"оптика свет луч отражение зеркало нормаль угол зеркальное диффузное",resources:[{label:"Опыт с зеркалом",href:"/practice/optics-lesson"},{label:"Задачи на отражение",href:"/practice/family/reflection-angle"}]},
  "path-and-displacement": {
    question: "Вернулся на старт — значит, никуда не ходил?", resources: [],
    connection: { label: "Путь уже известен. Добавим время той же прогулки и найдём среднюю скорость.", href: "/learn/average-speed" },
  },
  "average-speed": {
    question: "Можно ли просто взять среднее двух скоростей?",
    resources: [{ label: "Расследование с Мио", href: "/practice/average-speed-lesson" }, { label: "Задачи на два участка", href: "/practice/family/average-speed-segments" }],
    connection: { label: "Скорость пути и скорость перемещения различаются. Сначала сравни путь и перемещение.", href: "/learn/path-and-displacement" },
  },
  acceleration: {
    question: "Как по изменению скорости понять ускорение?", keywords: "график торможение разгон",
    resources: [{ label: "Опыт с графиком скорости", href: "/practice/kinematics-lesson" }, { label: "Задачи по графику", href: "/practice/family/vt-slope" }],
    connection: { label: "Что создаёт ускорение? Свяжи его с силой и массой.", href: "/learn/newton-second-law" },
  },
  "newton-second-law": {question:"Почему одинаковая сила сильнее разгоняет лёгкую тележку?",keywords:"второй закон Ньютона сила масса ускорение равнодействующая результирующая",resources:[{label:"Опыт с тележками",href:"/practice/dynamics-lesson"},{label:"Задачи на второй закон Ньютона",href:"/practice/family/newton-second"}],connection:{label:"Когда силы уравновешены, ускорение исчезает. Сравни тяжесть и выталкивающую силу",href:"/learn/archimedes-force"}},
  "archimedes-force": {question:"Почему динамометр показывает меньше, когда тело опускают в воду?",keywords:"выталкивающая сила Архимеда жидкость газ плотность погруженный объем плавание",resources:[{label:"Задачи на силу Архимеда",href:"/practice/family/archimedes-force"}],connection:{label:"Пока это отдельный фрагмент статики. Вернуться к материалам 9 класса",href:"/topics?grade=9"}},
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
