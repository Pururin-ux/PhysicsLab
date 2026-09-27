import {
  getMisconceptionMetadata,
  getTaskLearningMetadata,
  taskLearningMetadataByTemplateId,
  type TaskLearningMetadata,
} from "./task-metadata.ts";
import { skillMetadata, type TopicId } from "./taxonomy.ts";

export type HelpSectionId =
  | "archimedes-force"
  | "ship-payload"
  | "contact-pressure"
  | "uniform-motion"
  | "uniform-motion-graphs"
  | "accelerated-motion"
  | "circular-motion"
  | "oscillations"
  | "motion-graphs"
  | "average-speed"
  | "units-conversion"
  | "graduated-scale"
  | "rectangular-block-volume"
  | "irregular-body-volume"
  | "vectors-relative-motion"
  | "gravity-force"
  | "gravitation-distance"
  | "hydrostatic-pressure"
  | "newton-second-law"
  | "resultant-force"
  | "friction"
  | "incline"
  | "weight-lift"
  | "torque-balance"
  | "movable-pulley"
  | "impulse-force"
  | "momentum"
  | "density-volume"
  | "kinetic-energy"
  | "potential-energy"
  | "energy-conservation"
  | "work-energy"
  | "ohms-law"
  | "conductor-resistance"
  | "elementary-charge"
  | "full-circuit"
  | "charge-sharing"
  | "coulomb-force"
  | "electric-field-strength"
  | "electric-field-superposition"
  | "electrostatic-field-work"
  | "point-charge-potential"
  | "multi-source-potential"
  | "uniform-field-voltage"
  | "parallel-plate-capacitance"
  | "capacitor-energy"
  | "lc-period"
  | "ac-oscillogram-frequency"
  | "transformer-voltage-ratio"
  | "transmission-line-loss"
  | "induced-emf-magnitude"
  | "ampere-force-magnitude"
  | "lorentz-force-magnitude"
  | "metal-temperature-current"
  | "electrolyte-ion-transport"
  | "gas-discharge-conditions"
  | "semiconductor-carriers"
  | "self-induction-emf"
  | "electric-power"
  | "household-load-current"
  | "magnetic-field"
  | "ideal-gas"
  | "amount-of-substance"
  | "particle-concentration"
  | "molecular-kinetic-energy"
  | "gas-equation"
  | "gas-isoprocesses"
  | "solid-structure"
  | "liquid-structure"
  | "vapor-equilibrium"
  | "air-humidity"
  | "internal-energy-gas"
  | "gas-work"
  | "first-law"
  | "heat-engine"
  | "heat-amount"
  | "heat-balance"
  | "fuel-combustion"
  | "heating-melting"
  | "vaporization"
  | "shadow-and-penumbra"
  | "reflection"
  | "plane-mirror"
  | "refraction-direction"
  | "refraction"
  | "refractive-index"
  | "thin-lens"
  | "lens-image-properties"
  | "vision-correction"
  | "optical-power"
  | "magnification"
  | "atomic-transitions";

export type HelpReason = "task" | "mistake" | "fallback";

export type TopicHelpSection = {
  id: HelpSectionId;
  label: string;
  shortHint: string;
  formula?: string;
  mistake?: string;
};

export type HelpTarget = {
  topicId: TopicId;
  sectionId: HelpSectionId;
  reason: HelpReason;
  label: string;
  shortHint: string;
};

export type HelpableQuizTask = {
  blueprint: string;
  skill?: string;
  text?: string;
  formula?: string;
  trap?: string;
  graph?: { type?: string } | null;
  diagram?: { kind?: string } | null;
  explanation?: string;
  explanation_latex?: string;
};

export const topicHelpSections: Record<TopicId, TopicHelpSection[]> = {
  measurements: [
    {
      id: "units-conversion",
      label: "Перевод единиц длины",
      shortHint: "Из км в м число увеличивается; из дм, см и мм в м — уменьшается. Длина остаётся прежней.",
      formula: "1\\ \\text{км}=1000\\ \\text{м},\\quad 1\\ \\text{дм}=0{,}1\\ \\text{м},\\quad 1\\ \\text{см}=0{,}01\\ \\text{м}",
      mistake: "Сначала определи, какая единица крупнее, затем проверь направление изменения числа.",
    },
    {
      id: "graduated-scale",
      label: "Чтение шкалы мензурки",
      shortHint: "Отними один от числа штрихов, чтобы получить число промежутков. Мениск отсчитывай от подписанной отметки.",
      formula: "N_{\\text{пр}}=N_{\\text{отм}}-1,\\quad c=\\frac{V_2-V_1}{N_{\\text{пр}}},\\quad V=V_1+kc",
      mistake: "Считай промежутки между штрихами. Для воды отсчёт веди по нижней точке мениска на уровне глаз.",
    },
    {
      id: "rectangular-block-volume",
      label: "Объём прямоугольного бруска",
      shortHint: "Измеренные рёбра вырази в сантиметрах и перемножь; объём получится в см³.",
      formula: "V=abc,\\quad 10\\,\\text{мм}=1\\,\\text{см}",
      mistake: "Произведение двух рёбер даёт площадь в см². Для объёма нужно третье ребро; складывать длины нельзя.",
    },
    {
      id: "irregular-body-volume",
      label: "Объём по вытеснению воды",
      shortHint: "При полном погружении без потери воды разность двух показаний равна объёму тела.",
      formula: "V=V_2-V_1,\\quad 1\\,\\text{мл}=1\\,\\text{см}^3",
      mistake: "Второе показание включает воду и тело. Не принимай его за объём одного тела.",
    },
  ],
  kinematics: [
    {
      id: "uniform-motion",
      label: "Равномерное движение",
      shortHint: "Постоянная скорость: путь равен скорости, умноженной на время.",
      formula: "s=vt",
      mistake: "Не путай путь за всё время с одной координатой или одной отметкой на графике.",
    },
    {
      id: "uniform-motion-graphs",
      label: "Графики равномерного движения",
      shortHint: "На s(t) скорость задаёт наклон прямой; на v(t) постоянная скорость — горизонтальная линия.",
      formula: "v=\\frac{s}{t},\\quad s=vt",
      mistake: "Сначала прочитай подписи осей: одна и та же высота означает разные величины на s(t) и v(t).",
    },
    {
      id: "accelerated-motion",
      label: "Равноускоренное движение",
      shortHint: "При постоянном ускорении координата содержит начальное положение, скорость и член at²/2.",
      formula: "x=x_0+v_0t+\\frac{at^2}{2}",
      mistake: "Не забудь член at²/2: он даёт добавку пути из-за ускорения.",
    },
    {
      id: "motion-graphs",
      label: "Графики v(t), x(t)",
      shortHint: "Наклон v(t) даёт ускорение, а знаковая площадь между графиком и осью времени — перемещение.",
      formula: "a=\\frac{\\Delta v}{\\Delta t},\\quad \\Delta x=\\frac{v_0+v}{2}\\,t",
      mistake: "Площадь ниже оси времени берётся со знаком минус. Путь получают, складывая модули площадей.",
    },
    {
      id: "average-speed",
      label: "Средняя путевая скорость",
      shortHint: "Средняя путевая скорость равна всему пройденному пути, делённому на всё время движения.",
      formula: "v_{\\text{ср}}=\\frac{s}{t}",
      mistake: "Не путай её со средней векторной скоростью: та считается через перемещение, а не путь.",
    },
    {
      id: "units-conversion",
      label: "Перевод единиц",
      shortHint: "Сравни, во сколько раз отличаются единицы. Например, 1 км = 1000 м, а 1 см = 0,01 м.",
      formula: "1\\ \\text{км}=1000\\ \\text{м},\\quad 1\\ \\text{см}=0{,}01\\ \\text{м},\\quad 1\\ \\text{км/ч}=\\frac{1}{3{,}6}\\ \\text{м/с}",
      mistake: "Число меняется в направлении, обратном изменению единицы. Для скорости переведи и расстояние, и время до подстановки в формулу.",
    },
    {
      id: "vectors-relative-motion",
      label: "Векторы и относительное движение",
      shortHint: "У каждой скорости укажи тело и систему отсчёта; затем складывай векторы с согласованными индексами.",
      formula: "\\vec v_{A/C}=\\vec v_{A/B}+\\vec v_{B/C}",
      mistake: "Нельзя складывать скорости с неясными системами отсчёта. Для взаимно перпендикулярных векторов модуль находят по Пифагору.",
    },
    {
      id: "circular-motion",
      label: "Движение по окружности",
      shortHint: "Период — время одного оборота; частота — число оборотов за секунду; ускорение направлено к центру.",
      formula: "\\nu=\\frac{N}{\\Delta t}=\\frac{1}{T},\\quad a=\\frac{v^2}{R}",
      mistake: "Не называй постоянный модуль скорости постоянным вектором: направление скорости непрерывно меняется.",
    },
  ],
  dynamics: [
    {
      id: "oscillations",
      label: "Механические колебания",
      shortHint: "Период — время полного цикла. У идеального пружинного маятника энергия движения и энергия пружины меняются при постоянной сумме.",
      formula: "T=\\frac{\\Delta t}{N},\\quad \\nu=\\frac{N}{\\Delta t}=\\frac{1}{T},\\quad W_k+W_p=const",
      mistake: "Учитывай полный цикл, а при расчёте энергии сначала найди полную энергию системы.",
    },
    {
      id: "archimedes-force",
      label: "Сила Архимеда",
      shortHint: "Выталкивающая сила равна весу вытесненной среды и зависит от погружённого объёма.",
      formula: "F_A=\\rho_{\\text{ж}}gV_{\\text{погр}}",
      mistake: "В формулу входит объём погружённой части в м³, а не обязательно весь объём тела.",
    },
    {
      id: "ship-payload",
      label: "Грузоподъёмность судна",
      shortHint: "Водоизмещение включает и судно, и максимально допустимый груз.",
      formula: "m_{\\text{гр}}=m_{\\text{в}}-m",
      mistake: "Не принимай всё водоизмещение за груз: сначала вычти массу самого судна.",
    },
    {id:"hydrostatic-pressure",label:"Давление жидкости",shortHint:"На глубине h давление покоящейся жидкости равно ρgh.",formula:"p=\\rho gh",mistake:"Глубину отсчитывают от свободной поверхности; форму и площадь сосуда в формулу не подставляют."},
    {
      id: "gravity-force",
      label: "Сила тяжести",
      shortHint: "Земля действует на тело силой, прямо пропорциональной его массе.",
      formula: "F_{\\text{т}}=gm",
      mistake: "Сила тяжести приложена к телу и измеряется в ньютонах. Массу подставляй в килограммах.",
    },
    {
      id: "gravitation-distance",
      label: "Закон тяготения и расстояние",
      shortHint: "При неизменных массах сила обратно пропорциональна квадрату расстояния между центрами.",
      formula: "F\\sim\\frac{1}{r^2}",
      mistake: "Если расстояние изменилось в k раз, сила меняется в k² раз, а не в k раз.",
    },
    {
      id: "newton-second-law",
      label: "Второй закон Ньютона",
      shortHint: "Итоговая сила и масса вместе задают ускорение: сначала сравни все силы, потом используй F_рез = ma.",
      formula: "F_{\\text{рез}}=ma",
      mistake: "Не бери одну силу наугад: силы в одну сторону складываются, а встречная сила гасит такую же часть тяги. Оси и знаки понадобятся позже.",
    },
    {
      id: "resultant-force",
      label: "Равнодействующая",
      shortHint: "Равнодействующая — сила, которая остаётся после сложения и взаимного погашения всех сил.",
      formula: "F_{\\text{рез}}=F_{\\rightarrow}-F_{\\leftarrow}",
      mistake: "Встречные силы не складывай модулями: сначала отметь направление, затем вычти меньшую из большей. Для сил под углом нужна отдельная схема.",
    },
    {
      id: "friction",
      label: "Трение",
      shortHint: "Сила трения равна μN и направлена против относительного движения.",
      formula: "F_{fr}=\\mu N",
      mistake: "Не подставляй mg вместо N автоматически: на наклонной или в лифте N меняется.",
    },
    {
      id: "incline",
      label: "Наклонная плоскость",
      shortHint: "Разложи mg вдоль плоскости и перпендикулярно ей.",
      formula: "F_{\\parallel}=mg\\sin\\alpha",
      mistake: "Не меняй sin и cos местами: вдоль плоскости работает mg sin α.",
    },
    {
      id: "weight-lift",
      label: "Вес тела / лифт",
      shortHint: "Вес P действует на опору, а реакция N — на тело; при контакте их модули равны.",
      formula: "P=N=m(g\\pm a)",
      mistake: "P и N приложены к разным телам. Формула предполагает, что по вертикали действуют только тяжесть и опора; знак задаёт ускорение.",
    },
    {
      id: "torque-balance",
      label: "Момент силы и равновесие",
      shortHint: "Плечо — перпендикуляр от оси до линии действия силы; для равновесия сумма моментов равна нулю.",
      formula: "M=\\pm Fl,\\quad \\sum M=0",
      mistake: "Не подставляй расстояние до точки приложения автоматически: нужно кратчайшее расстояние до линии действия силы.",
    },
    {
      id: "movable-pulley",
      label: "Подвижный блок",
      shortHint: "Сосчитай ветви одной нити, которые поддерживают движущийся блок вместе с грузом.",
      formula: "P\\approx 2F",
      mistake: "Неподвижный блок только меняет направление силы; выигрыш в два раза даёт подвижный блок с двумя несущими ветвями.",
    },
    {
      id: "impulse-force",
      label: "Импульс силы",
      shortHint: "Изменение импульса тела задаёт импульс равнодействующей всех сил.",
      formula: "\\Delta\\vec p=\\vec F_{\\text{рез}}\\,\\Delta t",
      mistake: "В формулу входит равнодействующая, а не одна произвольно выбранная сила.",
    },
    {
      id: "momentum",
      label: "Импульс",
      shortHint: "Для столкновения смотри импульс всей системы до и после.",
      formula: "m_1v_1+m_2v_2=(m_1+m_2)v",
      mistake: "Сохраняется импульс системы, а не скорости отдельных тел.",
    },
    {
      id: "kinetic-energy",
      label: "Кинетическая энергия",
      shortHint: "Энергия движения равна mv²/2 и зависит от квадрата скорости.",
      formula: "E_k=\\frac{mv^2}{2}",
      mistake: "Если скорость выросла в два раза, энергия выросла в четыре раза.",
    },
    {
      id: "potential-energy",
      label: "Потенциальная энергия",
      shortHint: "Высоту поднятого тела отсчитывают от явно выбранного нулевого уровня.",
      formula: "E_p=mgh",
      mistake: "Одинаковое положение может иметь разные значения Eₚ при разных нулевых уровнях; физический смысл имеет изменение энергии.",
    },
    {
      id: "energy-conservation",
      label: "Сохранение механической энергии",
      shortHint: "Без сопротивления уменьшение Eₖ равно увеличению Eₚ.",
      formula: "E_k+E_p=\\text{const}",
      mistake: "Сначала проверь условие: при заметном сопротивлении механическая энергия сама по себе не сохраняется.",
    },
    {
      id:"contact-pressure",label:"Давление на опору",shortHint:"Давление — перпендикулярная сила на единицу площади контакта. Для нескольких опор сложи их площади.",formula:"p=F/S",mistake:"1 см² = 0,0001 м²; 1 кПа = 1000 Па. Не дели полную силу только на площадь одной опоры.",
    },
    {
      id: "work-energy",
      label: "Работа силы",
      shortHint: "Вдоль движения A = Fs; мощность показывает работу за единицу времени.",
      formula: "A=Fs,\\quad P=\\frac{A}{t}",
      mistake: "Без перемещения работа равна нулю; ватт — единица мощности, а джоуль — работы.",
    },
  ],
  electrodynamics: [
    {
      id: "elementary-charge",
      label: "Элементарный заряд",
      shortHint: "Модуль заряда тела равен целому числу элементарных зарядов.",
      formula: "N=\\frac{|q|}{e},\\quad e=1{,}6\\cdot10^{-19}\\,\\text{Кл}",
      mistake: "Одинаковая степень 10⁻¹⁹ сокращается; результат N должен быть целым числом.",
    },
    {
      id: "ohms-law",
      label: "Закон Ома",
      shortHint: "Сначала определи, что дано: напряжение U и сопротивление R. Потом подставь в I = U/R.",
      formula: "I=\\frac{U}{R}",
      mistake: "Не умножай U на R: при большем сопротивлении ток меньше.",
    },
    {
      id: "conductor-resistance",
      label: "Сопротивление проводника",
      shortHint: "Сопротивление растёт с длиной и удельным сопротивлением, но уменьшается при увеличении площади сечения.",
      formula: "R=\\rho\\frac{l}{S}",
      mistake: "Площадь поперечного сечения стоит в знаменателе: более толстый провод при прочих равных имеет меньшее сопротивление.",
    },
    {
      id: "full-circuit",
      label: "Полная цепь",
      shortHint: "Во всей цепи учитывай внешнее и внутреннее сопротивление.",
      formula: "I=\\frac{\\mathcal{E}}{R+r}",
      mistake: "Не забывай внутреннее сопротивление r: оно тоже ограничивает ток.",
    },
    {
      id: "charge-sharing",
      label: "Деление заряда",
      shortHint: "Сначала сложи заряды с учётом знаков, потом раздели поровну.",
      formula: "q'=\\frac{q_1+q_2}{2}",
      mistake: "Заряды разных знаков частично компенсируют друг друга до деления.",
    },
    {
      id: "coulomb-force",
      label: "Закон Кулона",
      shortHint: "Модуль силы зависит от модулей зарядов и квадрата расстояния. Знаки задают притяжение или отталкивание.",
      formula: "F=k\\frac{|q_1q_2|}{\\varepsilon r^2}",
      mistake: "При удвоении расстояния сила уменьшается в четыре раза. Для вакуума ε=1.",
    },
    {
      id: "electric-field-strength",
      label: "Напряжённость поля",
      shortHint: "Источник создаёт поле; для точечного заряда его модуль в выбранной точке зависит от Q и расстояния.",
      formula: "E=k\\frac{|Q|}{\\varepsilon r^2}",
      mistake: "Не подставляй заряд пробного тела вместо Q. При удвоении r напряжённость уменьшается в четыре раза.",
    },
    {
      id: "electric-field-superposition",
      label: "Суперпозиция электрических полей",
      shortHint: "Поле каждого неподвижного источника найди отдельно, затем сложи векторы в выбранной точке.",
      formula: "\\vec E=\\vec E_1+\\vec E_2+\\cdots+\\vec E_n",
      mistake: "Не складывай модули автоматически: сначала установи направление каждого поля в точке, затем сложи проекции.",
    },
    {
      id: "electrostatic-field-work",
      label: "Работа электростатического поля",
      shortHint: "В однородном поле работу определяет проекция всего смещения на E, а не длина пути.",
      formula: "A=qE\\Delta x,\\quad \\Delta W_{\\text{п}}=-A",
      mistake: "Для отрицательного заряда сила противоположна E. Изменение потенциальной энергии имеет знак, противоположный работе поля.",
    },
    {
      id: "point-charge-potential",
      label: "Потенциал точечного заряда",
      shortHint: "При нуле на бесконечности потенциал одного точечного источника в вакууме равен kQ/r.",
      formula: "\\varphi=k\\frac{Q}{r}",
      mistake: "Потенциал убывает как 1/r, не как 1/r². В формулу подставляют Q вместе со знаком.",
    },
    {
      id: "multi-source-potential",
      label: "Потенциал нескольких источников",
      shortHint: "Потенциалы источников в одной точке складываются алгебраически.",
      formula: "\\varphi=\\varphi_1+\\varphi_2+\\cdots+\\varphi_n",
      mistake: "Потенциал — скалярная величина: положение заряда не задаёт знак слагаемого, его задаёт знак источника.",
    },
    {
      id: "uniform-field-voltage",
      label: "Напряжение между точками поля",
      shortHint: "В однородном поле напряжение от A к B определяется проекцией A→B вдоль E.",
      formula: "U_{AB}=\\varphi_A-\\varphi_B=E\\Delta x",
      mistake: "При перестановке A и B знак меняется. Формула E=U/d без модуля относится к порядку точек по направлению поля.",
    },
    {
      id: "parallel-plate-capacitance",
      label: "Ёмкость плоского конденсатора",
      shortHint: "C=εε₀S/d: большее перекрытие и диэлектрик увеличивают C, больший зазор уменьшает её.",
      formula: "C=\\varepsilon\\varepsilon_0\\frac{S}{d}",
      mistake: "Ёмкость определяется геометрией обкладок и средой. При неизменной конструкции заряд и напряжение меняются вместе, а C остаётся постоянной.",
    },
    {
      id: "capacitor-energy",
      label: "Конденсатор",
      shortHint: "Выбирай форму W=qU/2=CU²/2=q²/(2C) по известным величинам.",
      formula: "W=\\frac{qU}{2}=\\frac{CU^2}{2}=\\frac{q^2}{2C}",
      mistake: "Проверь, что используешь модуль заряда одной обкладки, квадрат U и коэффициент 1/2.",
    },
    {
      id: "lc-period",
      label: "Период колебаний в LC-контуре",
      shortHint: "Для идеального контура T = 2π√(LC). Подставляй L в Гн, C в Ф, а секунды переводи в мс.",
      formula: "T=2\\pi\\sqrt{LC}",
      mistake: "1 мкФ = 10⁻⁶ Ф; сопротивлением в идеальной модели пренебрегают.",
    },
    {
      id: "ac-oscillogram-frequency",
      label: "Частота тока по двум максимумам",
      shortHint: "Два соседних максимума одного знака разделены периодом T. Вычти их времена, затем переведи мс в с.",
      formula: "T=(t_2-t_1)\\cdot10^{-3}\\,\\text{с},\\quad\\nu=\\frac{1}{T}",
      mistake: "Соседние максимумы одного знака разделены целым периодом, а не половиной; частота выражается в герцах.",
    },
    {
      id: "transformer-voltage-ratio",
      label: "Напряжение вторичной обмотки",
      shortHint: "Для идеального трансформатора отношение напряжений равно отношению числа витков.",
      formula: "U_2=U_1\\frac{N_2}{N_1}",
      mistake: "Проверь порядок обмоток: первичная получает заданное U₁, вторичная даёт искомое U₂.",
    },
    {
      id: "transmission-line-loss",
      label: "Нагрев линии передачи",
      shortHint: "При той же мощности на входе большему напряжению соответствует меньший ток.",
      formula: "I=\\frac{P_{\\text{вх}}}{U_{\\text{вх}}},\\quad P_{\\text{наг}}=I^2R_{\\text{л}}",
      mistake: "Потеря в ваттах — это часть мощности источника, ушедшая в нагрев; ток в формуле нужно возвести в квадрат.",
    },
    {
      id: "induced-emf-magnitude",
      label: "Модуль ЭДС индукции катушки",
      shortHint: "При одинаковом изменении потока через каждый виток умножь изменение одного витка на N и раздели на время.",
      formula: "|\\mathcal E_{\\text{инд}}|=N\\frac{|\\Delta\\Phi_1|}{\\Delta t}",
      mistake: "Для мВб и мс множители 10⁻³ сокращаются. Само наличие потока не создаёт ЭДС, если он не меняется.",
    },
    {
      id: "ampere-force-magnitude",
      label: "Сила Ампера в однородном поле",
      shortHint: "Умножь B, I, длину участка в поле и синус угла между током и полем.",
      formula: "F_{\\text{А}}=BI\\ell\\sin\\alpha",
      mistake: "Переведи мТл в Тл и см в м. При 30° синус равен 0,5; при 90° — единице.",
    },
    {
      id: "lorentz-force-magnitude",
      label: "Сила Лоренца для движения поперёк поля",
      shortHint: "Умножь модуль заряда, скорость и индукцию в теслах.",
      formula: "F_{\\text{Л}}=|q|vB",
      mistake: "Модуль силы не зависит от знака заряда. Миллитеслы переводи в теслы.",
    },
    {
      id: "metal-temperature-current",
      label: "Нагрев металла и условие об источнике",
      shortHint: "У обычного металла при нагреве сопротивление растёт. Уточни, что удерживает источник.",
      formula: "I=\\frac{U}{R}",
      mistake: "При постоянном U ток уменьшается. При постоянном I для той же спирали требуется большее U.",
    },
    {
      id: "electrolyte-ion-transport",
      label: "Носители заряда в электролите",
      shortHint: "Раствор соли может содержать подвижные ионы. Проверь знак иона и знак электрода.",
      formula: "\\mathrm{CuCl_2}\\rightarrow\\mathrm{Cu}^{2+}+2\\mathrm{Cl}^{-}",
      mistake: "Положительный Cu²⁺ движется к отрицательному катоду, отрицательный Cl⁻ — к положительному аноду. В металлическом проводе носители другие.",
    },
    {
      id: "gas-discharge-conditions",
      label: "Условия газового разряда",
      shortHint: "Найди внешний ионизатор и проверь, сохраняется ли разряд после его удаления.",
      formula: "\\mathrm{A}+\\text{энергия}\\rightarrow\\mathrm{A}^{+}+e^{-}",
      mistake: "Нагревание создаёт свободные носители в газе. В слабом поле разряд без него прекращается; при других условиях поле может поддерживать самостоятельный разряд.",
    },
    {
      id: "semiconductor-carriers",
      label: "Свет и носители в полупроводнике",
      shortHint: "Уточни, что осталось постоянным. В чистом кристалле различи электрон и дырку; примесь меняет основных носителей.",
      formula: "I=\\frac{U}{R}",
      mistake: "При том же U освещение фоторезистора уменьшает R и увеличивает I. Дырка не является подвижным ионом; n/p не означает заряд всего кристалла.",
    },
    {
      id: "self-induction-emf",
      label: "Модуль ЭДС самоиндукции",
      shortHint: "Умножь индуктивность катушки на модуль изменения тока и раздели на время изменения.",
      formula: "|\\mathcal E_{\\text{си}}|=L\\frac{|\\Delta I|}{\\Delta t}",
      mistake: "Миллигенри и миллисекунды переводят вместе: множители 10⁻³ сокращаются. ЭДС противодействует изменению тока.",
    },
    {
      id: "electric-power",
      label: "Мощность тока",
      shortHint: "Мощность участка цепи можно считать как P=UI или P=I²R.",
      formula: "P=UI=I^2R",
      mistake: "Не останавливайся на напряжении U=IR: для мощности нужен еще множитель I.",
    },
    {
      id: "household-load-current",
      label: "Общий ток приборов",
      shortHint: "Для параллельных приборов сложи мощности и раздели сумму на одно и то же напряжение сети из условия.",
      formula: "I_{\\Sigma}=\\frac{P_1+P_2}{U}",
      mistake: "Не сравнивай с пределом мощность в ваттах: сначала вычисли ток в амперах.",
    },
    {
      id: "magnetic-field",
      label: "Направление магнитного поля",
      shortHint: "Северный конец стрелки показывает направление поля. Для катушки пальцы правой руки идут по току, большой палец показывает северный торец.",
      formula: "I\\;\\Longrightarrow\\;\\vec B",
      mistake: "Не путай направление тока с направлением линии поля и не отделяй один магнитный полюс от другого.",
    },
  ],
  thermodynamics: [
    {
      id: "density-volume",
      label: "Плотность и объём",
      shortHint: "Масса зависит от плотности и объёма: m = ρV.",
      formula: "m=\\rho V",
      mistake: "Следи за единицами объёма: см³ и м³ дают разные масштабы.",
    },
    {
      id: "amount-of-substance",
      label: "Количество вещества и число частиц",
      shortHint: "Сначала переведи массу образца в количество вещества, затем количество вещества — в число частиц.",
      formula: "N=\\frac{m}{M}N_A",
      mistake: "Постоянная Авогадро показывает число частиц в одном моле, поэтому массу нельзя умножать на Nₐ напрямую.",
    },
    {
      id: "particle-concentration",
      label: "Концентрация частиц",
      shortHint: "Концентрация показывает, сколько частиц приходится на один кубический метр объёма.",
      formula: "n=\\frac{N}{V}",
      mistake: "Литры нужно перевести в кубические метры до деления: 1 л = 10⁻³ м³.",
    },
    {
      id: "molecular-kinetic-energy",
      label: "Температура и энергия молекул",
      shortHint: "Абсолютная температура задаёт среднюю кинетическую энергию поступательного движения молекулы.",
      formula: "\\overline{E_k}=\\frac32kT",
      mistake: "В формулу подставляют температуру в кельвинах и сохраняют множитель 3/2.",
    },
    {
      id: "ideal-gas",
      label: "Идеальный газ",
      shortHint: "Давление, объём и температура связаны состоянием газа.",
      formula: "pV=\\nu RT",
      mistake: "Температуру газа подставляй в кельвинах, а не в градусах Цельсия.",
    },
    {
      id: "gas-equation",
      label: "Уравнение состояния",
      shortHint: "T — абсолютная температура в кельвинах, t — температура по шкале Цельсия.",
      formula: "pV=\\nu RT",
      mistake: "Переводи численное значение температуры: T[К] = t[°C] + 273.",
    },
    {
      id: "heat-amount",
      label: "Количество теплоты",
      shortHint: "Q=cmΔT даёт теплоту, полученную телом, если c постоянно и агрегатное состояние не меняется.",
      formula: "Q=cm\\Delta T",
      mistake: "В формулу входит изменение температуры. Энергия нагревателя равна Q только при отсутствии потерь и нагрева посуды.",
    },
    {
      id: "heat-balance",
      label: "Тепловой баланс",
      shortHint: "Сколько теплоты отдала горячая вода, столько получила холодная.",
      formula: "m_1c(T_1-T)=m_2c(T-T_2)",
      mistake: "Не усредняй температуры без учета масс.",
    },
    {
      id: "gas-isoprocesses",
      label: "Изопроцессы идеального газа",
      shortHint: "Название процесса указывает, какой параметр остаётся постоянным.",
      formula: "T=\\mathrm{const}:\\ pV=\\mathrm{const};\\quad p=\\mathrm{const}:\\ \\frac VT=\\mathrm{const};\\quad V=\\mathrm{const}:\\ \\frac pT=\\mathrm{const}",
      mistake: "Не выбирай закон по двум изменяющимся величинам: сначала найди параметр, который зафиксирован.",
    },
    {
      id: "solid-structure",
      label: "Строение твёрдых тел",
      shortHint: "Связывай дальний порядок и ориентацию кристаллов с наблюдаемыми свойствами.",
      formula: "\\text{строение}\\;\\Longrightarrow\\;\\text{свойство}",
      mistake: "Внешний вид образца даёт гипотезу, но тип строения подтверждают анизотропия и характер плавления.",
    },
    {
      id: "liquid-structure",
      label: "Строение жидкостей",
      shortHint: "Ближний порядок допускает перестройку соседей, а у поверхности силы притяжения не компенсируются.",
      formula: "\\text{временные положения}\\to\\text{текучесть};\\quad \\sum\\vec F_{\\text{пов}}\\ne0",
      mistake: "Не объясняй текучесть отсутствием взаимодействия: частицы жидкости близки и взаимодействуют, но меняют временные положения.",
    },
    {
      id: "vapor-equilibrium",
      label: "Испарение и насыщенный пар",
      shortHint: "Сравни встречные потоки молекул и проверь температуру и границу системы.",
      formula: "N_{\\text{исп}}=N_{\\text{конд}}\\;\\Longleftrightarrow\\;\\text{динамическое равновесие}",
      mistake: "Не принимай постоянный уровень за остановку молекул и не применяй закон Бойля — Мариотта к насыщенному пару с жидкостью.",
    },
    {
      id: "air-humidity",
      label: "Влажность воздуха",
      shortHint: "Относительная влажность показывает, какую долю от насыщения составляет водяной пар при данной температуре.",
      formula: "\\varphi=\\frac{p_{\\text{п}}}{p_{\\text{н}}}\\cdot100\\%=\\frac{\\rho_{\\text{п}}}{\\rho_{\\text{н}}}\\cdot100\\%",
      mistake: "Не сравнивай значения, относящиеся к разным температурам: предел насыщения меняется при нагревании и охлаждении.",
    },
    {
      id: "internal-energy-gas",
      label: "Внутренняя энергия одноатомного газа",
      shortHint: "Для данной порции одноатомного идеального газа внутренняя энергия определяется абсолютной температурой.",
      formula: "U=\\frac32\\nu RT;\\qquad \\Delta U=\\frac32\\nu R\\Delta T",
      mistake: "Не смешивай путь процесса с изменением внутренней энергии: ΔU задают только начальное и конечное состояния.",
    },
    {
      id: "gas-work",
      label: "Работа газа при постоянном давлении",
      shortHint: "Работа газа при изобарном расширении определяется давлением и изменением объёма.",
      formula: "A=p\\Delta V=p(V_2-V_1)",
      mistake: "Не подставляй конечный объём вместо его изменения. Вертикальный участок графика p(V) работы не даёт.",
    },
    {
      id: "first-law",
      label: "Первый закон термодинамики",
      shortHint: "Теплота, полученная газом, идёт на изменение его внутренней энергии и работу газа.",
      formula: "\\Delta U=Q-A_{\\text{газа}};\\qquad Q=\\Delta U+A_{\\text{газа}}",
      mistake: "Работа внешних сил имеет знак, противоположный работе газа. При отдаче теплоты Q отрицательно.",
    },
    {
      id: "heat-engine",
      label: "Термический КПД теплового двигателя",
      shortHint: "За полный цикл рабочее тело возвращается в исходное состояние: полученная теплота делится на работу и теплоту холодильника.",
      formula: "\\eta_{\\text{т}}=\\frac{Q_1-|Q_2|}{Q_1}\\cdot100\\%",
      mistake: "Не считай теплоту холодильника работой. Термический КПД относится к теплоте, полученной рабочим телом от нагревателя, а не ко всей энергии топлива.",
    },
    {
      id: "fuel-combustion",
      label: "Горение топлива",
      shortHint: "Удельная теплота сгорания относится к одному килограмму; при полном сгорании Q=qm.",
      formula: "Q=qm",
      mistake: "Не приравнивай всю энергию топлива к теплоте нагреваемого тела, если передаётся только её часть.",
    },
    {
      id: "heating-melting",
      label: "Плавление / нагревание",
      shortHint: "Нагрев и плавление считаются отдельными стадиями: посчитай каждую и сложи.",
      formula: "Q=cm\\Delta T+\\lambda m",
      mistake: "Во время плавления температура не растёт: теплота идёт на изменение состояния.",
    },
    {
      id: "vaporization",
      label: "Испарение и кипение",
      shortHint: "Испарение идёт с поверхности при любой температуре; кипение — во всём объёме при температуре кипения.",
      formula: "Q=cm\\Delta T+Lm",
      mistake: "Если вода начинает ниже температуры кипения, не пропускай стадию нагревания.",
    },
  ],
  optics: [
    {
      id: "shadow-and-penumbra",
      label: "Тень и полутень",
      shortHint: "Точечный источник даёт резкую границу тени; протяжённый источник создаёт ещё и полутень.",
      formula: "\\text{источник}\\;\\to\\;\\text{препятствие}\\;\\to\\;\\text{экран}",
      mistake: "Сначала определи размер источника в условиях задачи: полутень связана с тем, что разные его части видны с экрана по-разному.",
    },
    {
      id: "reflection",
      label: "Отражение",
      shortHint: "Угол отражения равен углу падения; оба отсчитываются от нормали.",
      formula: "\\beta=\\alpha",
      mistake: "Не отсчитывай углы от поверхности зеркала: в законе отражения углы берутся от нормали.",
    },
    {
      id: "plane-mirror",
      label: "Плоское зеркало",
      shortHint: "Мнимое изображение находится за зеркалом на том же расстоянии, что предмет перед ним.",
      formula: "L=2d",
      mistake: "Расстояние между предметом и изображением — это 2d, а не расстояние до зеркала.",
    },
    {
      id: "refraction-direction",
      label: "Куда поворачивает луч",
      shortHint: "В оптически более плотную среду луч отклоняется к нормали; в менее плотную — от нормали.",
      mistake: "Сначала определи направление перехода и отсчитывай оба угла от нормали. При падении по нормали поворота нет.",
    },
    {
      id: "refraction",
      label: "Преломление",
      shortHint: "Отношение показателей преломления равно отношению синусов углов от нормали.",
      formula: "\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}",
      mistake: "Дели синусы углов, а не сами углы: закон преломления связывает именно синусы.",
    },
    {
      id: "refractive-index",
      label: "Показатель преломления",
      shortHint: "Абсолютный показатель n=c/v связывает c с фазовой скоростью света в среде.",
      formula: "n=\\frac{c}{v}",
      mistake: "Не переворачивай отношение. В этих задачах речь об обычных прозрачных средах для видимого света, где n>1.",
    },
    {
      id: "thin-lens",
      label: "Тонкая линза",
      shortHint: "Формула линзы связывает фокусное расстояние с расстояниями до предмета и изображения.",
      formula: "\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}",
      mistake: "Выражая f, следи за знаменателем: там разность d − F, а не сумма.",
    },
    {
      id: "lens-image-properties",
      label: "Изображение в линзе",
      shortHint: "Положение предмета относительно F и 2F определяет место, размер и вид изображения.",
      formula: "d>2F;\\quad d=2F;\\quad F<d<2F;\\quad d<F",
      mistake: "Экран показывает только действительное изображение, где пересекаются сами лучи. Для мнимого пересекаются их продолжения.",
    },
    {
      id: "vision-correction",
      label: "Коррекция зрения",
      shortHint: "Положение фокуса относительно сетчатки определяет, нужно ослабить или усилить сходимость лучей.",
      formula: "D<0\\;\\text{— рассеивающая};\\quad D>0\\;\\text{— собирающая}",
      mistake: "Перед сетчаткой — рассеивающая линза с D < 0; за сетчаткой — собирающая с D > 0.",
    },
    {
      id: "optical-power",
      label: "Оптическая сила",
      shortHint: "Оптическая сила — обратная величина фокусного расстояния в метрах.",
      formula: "D=\\frac{1}{F}",
      mistake: "Сначала переведи фокусное расстояние в метры: диоптрия — это 1/м.",
    },
    {
      id: "magnification",
      label: "Увеличение",
      shortHint: "Модуль увеличения равен расстоянию линза—изображение, делённому на расстояние предмет—линза.",
      formula: "|\\Gamma|=\\frac{d_i}{d_o}=\\frac{H}{h}",
      mistake: "Не путай высоту предмета h с высотой изображения H и не переворачивай отношение dᵢ/dₒ.",
    },
  ],
  quantum: [
    {
      id: "atomic-transitions",
      label: "Энергия перехода атома",
      shortHint: "Частота и длина волны фотона определяются разностью энергий двух уровней водорода.",
      formula: "\\Delta E=|E_i-E_f|=h\\nu=\\frac{hc}{\\lambda}",
      mistake: "Не складывай модули энергий и не бери энергию только одного уровня: нужен модуль разности начального и конечного уровней.",
    },
  ],
};

const blueprintTargets: Partial<
  Record<string, { topicId: TopicId; sectionId: HelpSectionId }>
> = {
  "formula-substitution": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "free-fall": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "projectile-components": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "average-speed-segments": { topicId: "kinematics", sectionId: "average-speed" },
  "average-speed-with-stop": { topicId: "kinematics", sectionId: "average-speed" },
  "uniform-motion-basic": { topicId: "kinematics", sectionId: "uniform-motion" },
  "uniform-coordinate-law": { topicId: "kinematics", sectionId: "uniform-motion-graphs" },
  "uniform-motion-graphs": { topicId: "kinematics", sectionId: "uniform-motion-graphs" },
  "unit-conversion-speed": { topicId: "kinematics", sectionId: "units-conversion" },
  "length-unit-conversion": { topicId: "measurements", sectionId: "units-conversion" },
  "graduated-scale-reading": { topicId: "measurements", sectionId: "graduated-scale" },
  "rectangular-block-volume": { topicId: "measurements", sectionId: "rectangular-block-volume" },
  "irregular-body-volume": { topicId: "measurements", sectionId: "irregular-body-volume" },
  "rotation-frequency": { topicId: "kinematics", sectionId: "circular-motion" },
  "oscillation-frequency": { topicId: "dynamics", sectionId: "oscillations" },
  "spring-oscillation-period": { topicId: "dynamics", sectionId: "oscillations" },
  "mathematical-pendulum-period": { topicId: "dynamics", sectionId: "oscillations" },
  "oscillation-energy": { topicId: "dynamics", sectionId: "oscillations" },
  "mechanical-wave-speed": { topicId: "dynamics", sectionId: "oscillations" },
  "echo-ranging": { topicId: "dynamics", sectionId: "oscillations" },
  "resonance-frequency-match": { topicId: "dynamics", sectionId: "oscillations" },
  "centripetal-acceleration": { topicId: "kinematics", sectionId: "circular-motion" },
  "nth-second-displacement": { topicId: "kinematics", sectionId: "accelerated-motion" },
  "graph-area": { topicId: "kinematics", sectionId: "motion-graphs" },
  "graph-recognition": { topicId: "kinematics", sectionId: "motion-graphs" },
  "acceleration-from-speed-change": { topicId: "kinematics", sectionId: "motion-graphs" },
  "signed-coordinate": { topicId: "kinematics", sectionId: "uniform-motion" },
  "relative-motion-meeting": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "relative-motion-overtake": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "relative-velocity-vectors": { topicId: "kinematics", sectionId: "vectors-relative-motion" },
  "gravity-force": { topicId: "dynamics", sectionId: "gravity-force" },
  "gravitation-distance": { topicId: "dynamics", sectionId: "gravitation-distance" },
  "archimedes-force": { topicId: "dynamics", sectionId: "archimedes-force" },
  "ship-payload": { topicId: "dynamics", sectionId: "ship-payload" },
  "hydrostatic-pressure": { topicId: "dynamics", sectionId: "hydrostatic-pressure" },
  "newton-second": { topicId: "dynamics", sectionId: "newton-second-law" },
  "resultant-force": { topicId: "dynamics", sectionId: "resultant-force" },
  "resultant-force-2d": { topicId: "dynamics", sectionId: "resultant-force" },
  "friction-force": { topicId: "dynamics", sectionId: "friction" },
  "incline-force": { topicId: "dynamics", sectionId: "incline" },
  "weight-lift": { topicId: "dynamics", sectionId: "weight-lift" },
  "torque-balance": { topicId: "dynamics", sectionId: "torque-balance" },
  "movable-pulley": { topicId: "dynamics", sectionId: "movable-pulley" },
  "impulse-momentum": { topicId: "dynamics", sectionId: "impulse-force" },
  "inelastic-collision-speed": { topicId: "dynamics", sectionId: "momentum" },
  "kinetic-energy": { topicId: "dynamics", sectionId: "kinetic-energy" },
  "gravitational-potential-energy": { topicId: "dynamics", sectionId: "potential-energy" },
  "mechanical-energy-conservation": { topicId: "dynamics", sectionId: "energy-conservation" },
  "work-force-distance": { topicId: "dynamics", sectionId: "work-energy" },
  "work-at-angle": { topicId: "dynamics", sectionId: "work-energy" },
  "ohm-law": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "conductor-resistance": { topicId: "electrodynamics", sectionId: "conductor-resistance" },
  "elementary-charge-count": { topicId: "electrodynamics", sectionId: "elementary-charge" },
  "magnetic-field-direction": { topicId: "electrodynamics", sectionId: "magnetic-field" },
  "resistor-network": { topicId: "electrodynamics", sectionId: "ohms-law" },
  "source-internal-resistance": { topicId: "electrodynamics", sectionId: "full-circuit" },
  "source-efficiency": { topicId: "electrodynamics", sectionId: "full-circuit" },
  "charge-sharing": { topicId: "electrodynamics", sectionId: "charge-sharing" },
  "coulomb-force": { topicId: "electrodynamics", sectionId: "coulomb-force" },
  "electric-field-strength": { topicId: "electrodynamics", sectionId: "electric-field-strength" },
  "electric-field-superposition": { topicId: "electrodynamics", sectionId: "electric-field-superposition" },
  "electrostatic-field-work": { topicId: "electrodynamics", sectionId: "electrostatic-field-work" },
  "point-charge-potential": { topicId: "electrodynamics", sectionId: "point-charge-potential" },
  "multi-source-potential": { topicId: "electrodynamics", sectionId: "multi-source-potential" },
  "uniform-field-voltage": { topicId: "electrodynamics", sectionId: "uniform-field-voltage" },
  "parallel-plate-capacitance": { topicId: "electrodynamics", sectionId: "parallel-plate-capacitance" },
  "capacitor-energy": { topicId: "electrodynamics", sectionId: "capacitor-energy" },
  "lc-period": { topicId: "electrodynamics", sectionId: "lc-period" },
  "ac-oscillogram-frequency": { topicId: "electrodynamics", sectionId: "ac-oscillogram-frequency" },
  "transformer-voltage-ratio": { topicId: "electrodynamics", sectionId: "transformer-voltage-ratio" },
  "transmission-line-loss": { topicId: "electrodynamics", sectionId: "transmission-line-loss" },
  "induced-emf-magnitude": { topicId: "electrodynamics", sectionId: "induced-emf-magnitude" },
  "ampere-force-magnitude": { topicId: "electrodynamics", sectionId: "ampere-force-magnitude" },
  "lorentz-force-magnitude": { topicId: "electrodynamics", sectionId: "lorentz-force-magnitude" },
  "metal-temperature-current": { topicId: "electrodynamics", sectionId: "metal-temperature-current" },
  "electrolyte-ion-transport": { topicId: "electrodynamics", sectionId: "electrolyte-ion-transport" },
  "gas-discharge-conditions": { topicId: "electrodynamics", sectionId: "gas-discharge-conditions" },
  "semiconductor-carriers": { topicId: "electrodynamics", sectionId: "semiconductor-carriers" },
  "self-induction-emf": { topicId: "electrodynamics", sectionId: "self-induction-emf" },
  "electric-power": { topicId: "electrodynamics", sectionId: "electric-power" },
  "household-load-current": { topicId: "electrodynamics", sectionId: "household-load-current" },
  "ideal-gas-state": { topicId: "thermodynamics", sectionId: "gas-equation" },
  "ideal-gas-isoprocess": { topicId: "thermodynamics", sectionId: "gas-isoprocesses" },
  "solid-structure-properties": { topicId: "thermodynamics", sectionId: "solid-structure" },
  "liquid-structure-properties": { topicId: "thermodynamics", sectionId: "liquid-structure" },
  "vapor-dynamic-equilibrium": { topicId: "thermodynamics", sectionId: "vapor-equilibrium" },
  "relative-humidity-pressure": { topicId: "thermodynamics", sectionId: "air-humidity" },
  "monoatomic-internal-energy": { topicId: "thermodynamics", sectionId: "internal-energy-gas" },
  "isobaric-gas-work": { topicId: "thermodynamics", sectionId: "gas-work" },
  "first-law-energy-balance": { topicId: "thermodynamics", sectionId: "first-law" },
  "heat-engine-efficiency": { topicId: "thermodynamics", sectionId: "heat-engine" },
  "molecule-count-from-mass": { topicId: "thermodynamics", sectionId: "amount-of-substance" },
  "particle-concentration": { topicId: "thermodynamics", sectionId: "particle-concentration" },
  "molecular-kinetic-energy": { topicId: "thermodynamics", sectionId: "molecular-kinetic-energy" },
  "gas-state-ratio": { topicId: "thermodynamics", sectionId: "gas-equation" },
  "heat-amount": { topicId: "thermodynamics", sectionId: "heat-amount" },
  "heat-balance-simple": { topicId: "thermodynamics", sectionId: "heat-balance" },
  "fuel-combustion-heat": { topicId: "thermodynamics", sectionId: "fuel-combustion" },
  "phase-change-heat": { topicId: "thermodynamics", sectionId: "heating-melting" },
  "vaporization-heat": { topicId: "thermodynamics", sectionId: "vaporization" },
  "shadow-and-penumbra": { topicId: "optics", sectionId: "shadow-and-penumbra" },
  "reflection-angle": { topicId: "optics", sectionId: "reflection" },
  "plane-mirror-separation": { topicId: "optics", sectionId: "plane-mirror" },
  "refraction-direction": { topicId: "optics", sectionId: "refraction-direction" },
  "refractive-index-speed": { topicId: "optics", sectionId: "refractive-index" },
  "snell-index-ratio": { topicId: "optics", sectionId: "refraction" },
  "thin-lens-image-distance": { topicId: "optics", sectionId: "thin-lens" },
  "lens-optical-power": { topicId: "optics", sectionId: "optical-power" },
  "lens-image-height": { topicId: "optics", sectionId: "magnification" },
  "lens-image-properties": { topicId: "optics", sectionId: "lens-image-properties" },
  "vision-correction": { topicId: "optics", sectionId: "vision-correction" },
  "bohr-transition-radiation": { topicId: "quantum", sectionId: "atomic-transitions" },
};

function normalize(value: string | undefined) {
  return (value ?? "").toLowerCase().replaceAll("ё", "е");
}

function combinedTaskText(task: HelpableQuizTask) {
  return normalize(
    [
      task.blueprint,
      task.skill,
      task.text,
      task.formula,
      task.trap,
      task.explanation,
      task.explanation_latex,
      task.graph?.type,
      task.diagram?.kind,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function sectionFor(topicId: TopicId, sectionId: HelpSectionId) {
  return (
    topicHelpSections[topicId].find((section) => section.id === sectionId) ??
    topicHelpSections[topicId][0]
  );
}

function createTarget(
  topicId: TopicId,
  sectionId: HelpSectionId,
  reason: HelpReason,
): HelpTarget {
  const section = sectionFor(topicId, sectionId);

  return {
    topicId,
    sectionId: section.id,
    reason,
    label: section.label,
    shortHint: section.shortHint,
  };
}

function createTargetFromMetadata(
  metadata: TaskLearningMetadata,
  reason: HelpReason,
): HelpTarget {
  const section = sectionFor(metadata.topicId, metadata.helpSectionId);

  return {
    topicId: metadata.topicId,
    sectionId: section.id,
    reason,
    label: section.label,
    shortHint: metadata.shortHint || section.shortHint,
  };
}

function topicFromBlueprint(blueprint: string): TopicId | null {
  const metadata = getTaskLearningMetadata(blueprint);
  if (metadata) {
    return metadata.topicId;
  }

  if (blueprint in skillMetadata) {
    return skillMetadata[blueprint as keyof typeof skillMetadata].topicId;
  }

  return blueprintTargets[blueprint]?.topicId ?? null;
}

function inferTopic(task: HelpableQuizTask, topicHint?: TopicId): TopicId {
  const blueprintTopic = topicFromBlueprint(task.blueprint);
  if (blueprintTopic) return blueprintTopic;
  if (topicHint) return topicHint;

  const text = combinedTaskText(task);
  if (/(ом|напряж|сопротив|заряд|конденс|цеп)/.test(text)) return "electrodynamics";
  if (/(газ|давлен|температур|теплот|плавлен|кельвин|pv|nrt)/.test(text)) {
    return "thermodynamics";
  }
  if (/(сила|ньютон|трени|наклон|импульс|лифт|масса)/.test(text)) return "dynamics";

  return "kinematics";
}

function inferSection(task: HelpableQuizTask, topicId: TopicId): HelpSectionId {
  const metadata = getTaskLearningMetadata(task.blueprint);
  if (metadata?.topicId === topicId) {
    return metadata.helpSectionId;
  }

  const blueprintTarget = blueprintTargets[task.blueprint];
  const text = combinedTaskText(task);

  if (topicId === "kinematics") {
    if (task.graph || /\bv\(t\)|\bx\(t\)|график|наклон|площад/.test(text)) {
      return "motion-graphs";
    }
    if (blueprintTarget?.topicId === topicId) return blueprintTarget.sectionId;
    if (/ускор|at\^?2|gt\^?2|frac\{a|frac\{g|свободн/.test(text)) {
      return "accelerated-motion";
    }
    if (/средн/.test(text)) return "average-speed";
    if (/навстреч|догон|относительн|перпендикулярн/.test(text)) {
      return "vectors-relative-motion";
    }
    return "uniform-motion";
  }

  if (blueprintTarget?.topicId === topicId) return blueprintTarget.sectionId;

  if (topicId === "dynamics") {
    if (/трени|\\mu|μ/.test(text)) return "friction";
    if (/наклон|sin|cos|плоскост/.test(text)) return "incline";
    if (/лифт|вес|реакци/.test(text)) return "weight-lift";
    if (/импульс сил|равнодейств.*времен|delta p|\\delta p/.test(text)) return "impulse-force";
    if (/импульс|столкнов|тележ/.test(text)) return "momentum";
    if (/равнодейств|перпендикуляр|пифагор|направлен|проекци/.test(text)) {
      return "resultant-force";
    }
    return "newton-second-law";
  }

  if (topicId === "electrodynamics") {
    if (/элементар|10⁻¹⁹|10\^?-?19|электрон|\|q\|\/?e/.test(text)) return "elementary-charge";
    if (/заряд|поровну|дели|усредн/.test(text)) return "charge-sharing";
    if (/электро[её]мк|площад.{0,12}обклад|зазор|диэлектр/.test(text)) return "parallel-plate-capacitance";
    if (/конденс|cu\^?2|u\^?2|микрофарад/.test(text)) return "capacitor-energy";
    if (/эдс|внутрен|полная цеп|r \+ r|r\+r/.test(text)) return "full-circuit";
    return "ohms-law";
  }

  if (/сгоран|топлив|\bqm\b/.test(text)) return "fuel-combustion";
  if (/испар|кипен|парообраз|\blm\b/.test(text)) return "vaporization";
  if (/плавл|лед|λ|lambda/.test(text)) return "heating-melting";
  if (/теплот|cm|дельта|\\delta|нагрев/.test(text)) return "heat-amount";
  if (/pv|nrt|кельвин|уравнен/.test(text)) return "gas-equation";
  if (/газ|давлен|изотерм|изобар|изохор|моль/.test(text)) return "ideal-gas";
  if (/плотност|\\rho|ρ|объем/.test(text)) return "density-volume";

  return topicHelpSections[topicId][0].id;
}

function hasKnownHelpSignal(task: HelpableQuizTask) {
  if (task.blueprint in taskLearningMetadataByTemplateId) {
    return true;
  }

  if (task.blueprint in skillMetadata || blueprintTargets[task.blueprint]) {
    return true;
  }
  if (task.graph || task.diagram) {
    return true;
  }

  const text = combinedTaskText(task);
  return /(v\(t\)|x\(t\)|график|ускор|сила|ньютон|трени|наклон|импульс|ом|напряж|сопротив|заряд|конденс|газ|давлен|теплот|плавлен|pv|nrt|cm\\delta)/.test(
    text,
  );
}

export function getDefaultHelpTarget(topicId: TopicId): HelpTarget {
  return createTarget(topicId, topicHelpSections[topicId][0].id, "fallback");
}

export function getHelpTargetForTask(
  task: HelpableQuizTask,
  topicHint?: TopicId,
): HelpTarget {
  const metadata = getTaskLearningMetadata(task.blueprint);
  if (metadata) {
    return createTargetFromMetadata(metadata, "task");
  }

  const topicId = inferTopic(task, topicHint);
  const sectionId = inferSection(task, topicId);

  return createTarget(topicId, sectionId, hasKnownHelpSignal(task) ? "task" : "fallback");
}

export function getHelpTargetForMistake(
  task: HelpableQuizTask,
  trap?: string,
  topicHint?: TopicId,
): HelpTarget {
  const stableMisconception = getMisconceptionMetadata(trap);
  const taskMetadata = getTaskLearningMetadata(task.blueprint);
  if (stableMisconception && taskMetadata) {
    return createTarget(
      taskMetadata.topicId,
      stableMisconception.helpSectionId,
      "mistake",
    );
  }

  const topicId = inferTopic(task, topicHint);
  const mistakeText = normalize(trap);

  if (topicId === "kinematics") {
    if (/площад|наклон|график|ось|v\(t\)|x\(t\)/.test(mistakeText)) {
      return createTarget(topicId, "motion-graphs", "mistake");
    }
    if (/знак|направлен/.test(mistakeText)) {
      return createTarget(topicId, "accelerated-motion", "mistake");
    }
  }

  if (topicId === "dynamics") {
    if (/знак|направлен|проекци|складывать силы|сложил/.test(mistakeText)) {
      return createTarget(topicId, "resultant-force", "mistake");
    }
    if (/трени|\\mu|μ/.test(mistakeText)) return createTarget(topicId, "friction", "mistake");
    if (/наклон|sin|cos/.test(mistakeText)) return createTarget(topicId, "incline", "mistake");
  }

  if (topicId === "electrodynamics") {
    if (/элементар|10⁻¹⁹|10\^?-?19|электрон|целое число/.test(mistakeText)) {
      return createTarget(topicId, "elementary-charge", "mistake");
    }
    if (/заряд|поровну|дели|усредн/.test(mistakeText)) {
      return createTarget(topicId, "charge-sharing", "mistake");
    }
    if (/конденс|u\^?2|коэффициент|1\/2|половин|микрофарад/.test(mistakeText)) {
      return createTarget(topicId, "capacitor-energy", "mistake");
    }
    if (/ом|напряж|сопротив|ток|u\/r/.test(mistakeText)) {
      return createTarget(topicId, "ohms-law", "mistake");
    }
  }

  if (topicId === "thermodynamics") {
    // «Масса», «объём» и «температура» встречаются в разных разделах.
    // Известная задача важнее этих общих слов в описании ошибки.
    // Стабильная misconception с более точной целью уже обработана выше.
    if (taskMetadata) return createTargetFromMetadata(taskMetadata, "mistake");
    if (/плавл|лед|стади/.test(mistakeText)) {
      return createTarget(topicId, "heating-melting", "mistake");
    }
    if (/теплот|масса|температур|delta|изменен/.test(mistakeText)) {
      return createTarget(topicId, "heat-amount", "mistake");
    }
    if (/кельвин|давлен|объем|pv|nrt/.test(mistakeText)) {
      return createTarget(topicId, "gas-equation", "mistake");
    }
  }

  if (/подстав|формул|вырази|выразил/.test(mistakeText)) {
    const target = getHelpTargetForTask(task, topicHint);
    return { ...target, reason: "mistake" };
  }

  const target = getHelpTargetForTask(task, topicHint);
  return { ...target, reason: trap ? "mistake" : target.reason };
}
