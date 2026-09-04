import type { SkillId } from "../learning/taxonomy";
import type { FormulaSymbol } from "./formula-symbol.ts";
import { FORMULAS } from "./formulas.ts";

export type FormulaReferenceEntry = {
  id: string;
  // A formula can support several task families. Empty means it is reference-only.
  relatedSkillIds: readonly SkillId[];
  title: string;
  formula: string;
  caption: string;
  symbols: FormulaSymbol[];
  limitation: string;
};

export type FormulaReferenceGroup = {
  id: string;
  title: string;
  intro: string;
  badgeTone: "cyan" | "gold" | "blue" | "pink" | "ember" | "neutral";
  // "soon": задач по разделу ещё нет, формулы уже доступны в справочнике.
  status: "active" | "soon";
  entries: FormulaReferenceEntry[];
};

export const formulaReference: FormulaReferenceGroup[] = [
  {
    id: "kinematics",
    title: "Кинематика",
    intro: "Движение по прямой и чтение графиков.",
    badgeTone: "ember",
    status: "active",
    entries: [
      {
        id: "uniform-motion",
        relatedSkillIds: [],
        title: "Равномерное движение",
        formula: FORMULAS.uniform_motion,
        caption: "путь при постоянной скорости вдоль одной прямой",
        symbols: [
          { latex: "s", description: "путь, м" },
          { latex: "v", description: "постоянная скорость, м/с" },
          { latex: "t", description: "время движения, с" },
        ],
        limitation:
          "Работает, только если скорость не меняется ни по величине, ни по направлению.",
      },
      {
        id: "velocity",
        relatedSkillIds: [],
        title: "Скорость при постоянном ускорении",
        formula: FORMULAS.velocity,
        caption: "как скорость меняется со временем",
        symbols: [
          { latex: "v", description: "скорость в момент времени t, м/с" },
          { latex: "v_0", description: "начальная скорость, м/с" },
          { latex: "a", description: "постоянное ускорение, м/с²" },
          { latex: "t", description: "время движения, с" },
        ],
        limitation:
          "Для прямолинейного движения с постоянным ускорением; знаки проекций учитывай по выбранной оси.",
      },
      {
        id: "coordinate",
        relatedSkillIds: [],
        title: "Координата при постоянном ускорении",
        formula: FORMULAS.accelerated_motion,
        caption: "положение тела в любой момент времени",
        symbols: [
          { latex: "x", description: "координата тела, м" },
          { latex: "x_0", description: "начальная координата, м" },
          { latex: "v_0", description: "начальная скорость, м/с" },
          { latex: "a", description: "постоянное ускорение, м/с²" },
          { latex: "t", description: "время движения, с" },
        ],
        limitation:
          "Для прямолинейного движения с постоянным ускорением.",
      },
      {
        id: "vt-slope",
        relatedSkillIds: ["vt-slope"],
        title: "Ускорение по графику v(t)",
        formula: "a = \\frac{\\Delta v}{\\Delta t}",
        caption: "наклон графика скорости",
        symbols: [
          { latex: "a", description: "ускорение, м/с²" },
          { latex: "\\Delta v", description: "изменение скорости, м/с" },
          { latex: "\\Delta t", description: "интервал времени, с" },
        ],
        limitation:
          "На линейном участке графика v(t); интервал можно брать любой удобный.",
      },
      {
        id: "vt-area",
        relatedSkillIds: ["vt-area"],
        title: "Перемещение по графику v(t)",
        formula: "\\Delta x = \\frac{v_0 + v}{2}\\,t",
        caption: "перемещение равно знаковой площади между v(t) и осью времени",
        symbols: [
          { latex: "\\Delta x", description: "проекция перемещения, м" },
          { latex: "v_0", description: "скорость в начале интервала, м/с" },
          { latex: "v", description: "скорость в конце интервала, м/с" },
          { latex: "t", description: "длительность интервала, с" },
        ],
        limitation:
          "Формула — для равноускоренного движения. Площадь ниже оси времени отрицательна; путь равен сумме модулей площадей.",
      },
      {
        id: "free-fall",
        relatedSkillIds: ["free-fall"],
        title: "Свободное падение из покоя",
        formula: `${FORMULAS.free_fall_h}, \\qquad ${FORMULAS.free_fall_v}`,
        caption: "путь и скорость при падении без начальной скорости",
        symbols: [
          { latex: "h", description: "путь падения, м" },
          { latex: "v", description: "скорость в момент времени t, м/с" },
          { latex: "g", description: "ускорение свободного падения, ≈ 10 м/с²" },
          { latex: "t", description: "время падения, с" },
        ],
        limitation:
          "Без сопротивления воздуха и с нулевой начальной скоростью.",
      },
      {
        id: "average-speed-segments",
        relatedSkillIds: ["average-speed-segments"],
        title: "Средняя путевая скорость",
        formula: "v_{\\text{ср}}=\\frac{s_1+s_2+\\ldots}{t_1+t_2+\\ldots}",
        caption: "весь путь делится на всё время движения",
        symbols: [
          { latex: "v_{\\text{ср}}", description: "средняя путевая скорость, м/с" },
          { latex: "s_1, s_2", description: "пути на отдельных участках, м" },
          { latex: "t_1, t_2", description: "время на отдельных участках, с" },
        ],
        limitation:
          "Это скалярная средняя скорость по пути. Средняя векторная скорость определяется через перемещение.",
      },
      {
        id: "unit-conversion-speed",
        relatedSkillIds: ["unit-conversion-speed"],
        title: "Перевод скорости",
        formula: "1\\ \\text{км/ч}=\\frac{1}{3{,}6}\\ \\text{м/с}",
        caption: "перед расчетом пути скорость и время должны быть в согласованных единицах",
        symbols: [
          { latex: "\\text{км/ч}", description: "километры в час" },
          { latex: "\\text{м/с}", description: "метры в секунду" },
          { latex: "\\text{мин}", description: "минуты, которые при расчете пути переводятся в секунды" },
        ],
        limitation:
          "Перевод выполняется до подстановки в s = vt.",
      },
      {
        id: "relative-velocity-vectors",
        relatedSkillIds: ["relative-velocity-vectors"],
        title: "Сложение относительных скоростей",
        formula: "\\vec v_{A/C}=\\vec v_{A/B}+\\vec v_{B/C}",
        caption: "индексы показывают тело и систему отсчёта",
        symbols: [
          { latex: "\\vec v_{A/C}", description: "скорость тела A относительно системы C" },
          { latex: "\\vec v_{A/B}", description: "скорость тела A относительно системы B" },
          { latex: "\\vec v_{B/C}", description: "скорость системы B относительно системы C" },
        ],
        limitation:
          "Складываются именно векторы. Если два слагаемых перпендикулярны, модуль результата равен √(v₁²+v₂²).",
      },
    ],
  },
  {
    id: "dynamics",
    title: "Динамика",
    intro: "Силы и их связь с движением.",
    badgeTone: "blue",
    status: "active",
    entries: [
      {
        id: "newton-second",
        relatedSkillIds: ["newton-second"],
        title: "Второй закон Ньютона",
        formula: "F = ma",
        caption: "связь равнодействующей силы, массы и ускорения",
        symbols: [
          { latex: "F", description: "равнодействующая всех сил, Н" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "a", description: "ускорение тела, м/с²" },
        ],
        limitation:
          "F — сумма всех сил, а не одна из них. Записана для инерциальной системы отсчёта.",
      },
      {
        id: "resultant-force",
        relatedSkillIds: ["resultant-force"],
        title: "Равнодействующая сил",
        formula: "\\vec{F} = \\vec{F}_1 + \\vec{F}_2 + \\ldots",
        caption: "векторная сумма всех сил, действующих на тело",
        symbols: [
          { latex: "F", description: "равнодействующая, Н" },
          { latex: "F_1, F_2", description: "отдельные силы, Н" },
        ],
        limitation:
          "В задачах на одну ось выбери положительное направление и складывай проекции со знаками.",
      },
      {
        id: "resultant-force-2d",
        relatedSkillIds: ["resultant-force-2d"],
        title: "Перпендикулярные силы",
        formula: "F=\\sqrt{F_1^2+F_2^2}",
        caption: "модуль равнодействующей двух взаимно перпендикулярных сил",
        symbols: [
          { latex: "F", description: "модуль равнодействующей, Н" },
          { latex: "F_1, F_2", description: "взаимно перпендикулярные силы, Н" },
        ],
        limitation:
          "Модули сил нельзя просто сложить: формула работает при угле 90° между ними.",
      },
      {
        id: "friction-force",
        relatedSkillIds: ["friction-force"],
        title: "Сила трения скольжения",
        formula: "F_{\\text{тр}} = \\mu N",
        caption: "пропорциональна прижатию тела к опоре",
        symbols: [
          { latex: "F_{\\text{тр}}", description: "сила трения скольжения, Н" },
          { latex: "\\mu", description: "коэффициент трения" },
          { latex: "N", description: "сила реакции опоры, Н" },
        ],
        limitation:
          "Сначала найди N: на горизонтальной опоре без прижимающих сил N = mg, на наклонной — меньше.",
      },
      {
        id: "incline-force",
        relatedSkillIds: ["incline-force"],
        title: "Наклонная плоскость",
        formula: "F_x = mg\\sin\\alpha, \\qquad N = mg\\cos\\alpha",
        caption: "проекции силы тяжести вдоль и поперёк плоскости",
        symbols: [
          { latex: "F_x", description: "скатывающая составляющая силы тяжести, Н" },
          { latex: "N", description: "сила реакции опоры, Н" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "g", description: "ускорение свободного падения, м/с²" },
          { latex: "\\alpha", description: "угол наклона плоскости" },
        ],
        limitation:
          "Ось x направлена вдоль плоскости, N перпендикулярна поверхности.",
      },
      {
        id: "weight-lift",
        relatedSkillIds: ["weight-lift"],
        title: "Вес тела в лифте",
        formula: "P=N=m(g \\pm a)",
        caption: "при контакте вес P и реакция опоры N равны по модулю",
        symbols: [
          { latex: "P", description: "вес: сила давления тела на опору, Н" },
          { latex: "N", description: "реакция опоры: сила, действующая на тело, Н" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "g", description: "ускорение свободного падения, м/с²" },
          { latex: "a", description: "модуль ускорения лифта, м/с²" },
        ],
        limitation:
          "P и N приложены к разным телам; по вертикали учтены только тяжесть и опора. Плюс — ускорение вверх, минус — вниз; при ускорении g вниз P=0.",
      },
      {
        id: "impulse-momentum",
        relatedSkillIds: ["impulse-momentum"],
        title: "Импульс силы",
        formula: "\\Delta\\vec p = \\vec F_{\\text{рез}}\\,\\Delta t",
        caption: "изменение импульса задаёт импульс равнодействующей всех сил",
        symbols: [
          { latex: "\\Delta\\vec p", description: "изменение импульса тела, кг·м/с" },
          { latex: "\\vec F_{\\text{рез}}", description: "постоянная равнодействующая всех сил, Н" },
          { latex: "\\Delta t", description: "интервал времени действия силы, с" },
        ],
        limitation:
          "Для постоянной равнодействующей. В общем случае импульс равен интегралу равнодействующей по времени.",
      },
      {
        id: "inelastic-collision-speed",
        relatedSkillIds: ["inelastic-collision-speed"],
        title: "Неупругое столкновение",
        formula: "m_1v_1+m_2v_2=(m_1+m_2)v",
        caption: "закон сохранения импульса для тел, которые после удара движутся вместе",
        symbols: [
          { latex: "m_1, m_2", description: "массы тел, кг" },
          { latex: "v_1, v_2", description: "скорости тел до столкновения, м/с" },
          { latex: "v", description: "общая скорость после столкновения, м/с" },
        ],
        limitation:
          "Направления скоростей учитываются знаками; внешним импульсом за время удара пренебрегают.",
      },
      {
        id: "kinetic-energy",
        relatedSkillIds: ["kinetic-energy"],
        title: "Кинетическая энергия",
        formula: "E_k=\\frac{mv^2}{2}",
        caption: "энергия движения тела",
        symbols: [
          { latex: "E_k", description: "кинетическая энергия, Дж" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "v", description: "скорость тела, м/с" },
        ],
        limitation:
          "Скорость входит в квадрате, поэтому при удвоении скорости энергия возрастает в четыре раза.",
      },
      {
        id: "work-force-distance",
        relatedSkillIds: ["work-force-distance"],
        title: "Работа постоянной силы",
        formula: "A=Fs\\cos\\alpha",
        caption: "работа зависит от направления силы относительно перемещения",
        symbols: [
          { latex: "A", description: "работа силы, Дж" },
          { latex: "F", description: "модуль силы, Н" },
          { latex: "s", description: "перемещение, м" },
          { latex: "\\alpha", description: "угол между силой и перемещением" },
        ],
        limitation:
          "Если сила направлена против перемещения, работа отрицательна.",
      },
    ],
  },
  {
    id: "electrodynamics",
    title: "Электричество",
    intro: "Постоянный ток в участке цепи.",
    badgeTone: "cyan",
    status: "active",
    entries: [
      {
        id: "ohm-law",
        relatedSkillIds: ["ohm-law"],
        title: "Закон Ома для участка цепи",
        formula: "I = \\frac{U}{R}",
        caption: "ток растёт с напряжением и падает с сопротивлением",
        symbols: [
          { latex: "I", description: "сила тока, А" },
          { latex: "U", description: "напряжение на участке, В" },
          { latex: "R", description: "сопротивление участка, Ом" },
        ],
        limitation:
          "Для участка без источника внутри; сопротивление считаем постоянным.",
      },
      {
        id: "resistance-wire",
        relatedSkillIds: [],
        title: "Сопротивление проводника",
        formula: "R = \\frac{\\rho\\,l}{S}",
        caption: "длинный и тонкий провод сопротивляется сильнее",
        symbols: [
          { latex: "R", description: "сопротивление, Ом" },
          { latex: "\\rho", description: "удельное сопротивление материала, Ом·м" },
          { latex: "l", description: "длина проводника, м" },
          { latex: "S", description: "площадь поперечного сечения, м²" },
        ],
        limitation: "Для однородного проводника постоянного сечения.",
      },
      {
        id: "series-parallel",
        relatedSkillIds: ["resistor-network"],
        title: "Соединения проводников",
        formula:
          "R_{\\text{посл}} = R_1 + R_2, \\qquad R_{\\text{пар}} = \\frac{R_1 R_2}{R_1 + R_2}",
        caption: "последовательно сопротивления складываются, параллельно — уменьшаются",
        symbols: [
          { latex: "R_1, R_2", description: "сопротивления участков, Ом" },
          { latex: "R_{\\text{посл}}", description: "общее при последовательном соединении, Ом" },
          { latex: "R_{\\text{пар}}", description: "общее при параллельном соединении двух проводников, Ом" },
        ],
        limitation:
          "Формула для параллельного соединения записана для двух проводников.",
      },
      {
        id: "source-internal-resistance",
        relatedSkillIds: ["source-internal-resistance"],
        title: "Закон Ома для полной цепи",
        formula: "I=\\frac{\\mathcal{E}}{R+r}",
        caption: "ток ограничивают внешнее и внутреннее сопротивления",
        symbols: [
          { latex: "I", description: "сила тока в цепи, А" },
          { latex: "\\mathcal{E}", description: "ЭДС источника, В" },
          { latex: "R", description: "внешнее сопротивление, Ом" },
          { latex: "r", description: "внутреннее сопротивление источника, Ом" },
        ],
        limitation:
          "В знаменателе стоит сумма сопротивлений: внутреннее сопротивление нельзя отбрасывать.",
      },
      {
        id: "electric-power",
        relatedSkillIds: ["electric-power"],
        title: "Мощность тока",
        formula: "P = UI = I^2 R",
        caption: "сколько энергии участок цепи потребляет за секунду",
        symbols: [
          { latex: "P", description: "мощность, Вт" },
          { latex: "U", description: "напряжение, В" },
          { latex: "I", description: "сила тока, А" },
          { latex: "R", description: "сопротивление, Ом" },
        ],
        limitation:
          "Вторая запись получается подстановкой U = IR и удобна, когда известен ток.",
      },
      {
        id: "charge-sharing",
        relatedSkillIds: ["charge-sharing"],
        title: "Деление заряда при контакте",
        formula: "q' = \\frac{q_1 + q_2}{2}",
        caption: "одинаковые проводники после контакта получают равный заряд",
        symbols: [
          { latex: "q'", description: "заряд каждого шарика после контакта, Кл" },
          { latex: "q_1, q_2", description: "заряды шариков до контакта, Кл" },
        ],
        limitation:
          "Только для двух одинаковых по размеру и материалу проводников.",
      },
      {
        id: "capacitor-energy",
        relatedSkillIds: ["capacitor-energy"],
        title: "Энергия конденсатора",
        formula: "W=\\frac{CU^2}{2}",
        caption: "энергия электрического поля заряженного конденсатора",
        symbols: [
          { latex: "W", description: "энергия электрического поля, Дж" },
          { latex: "C", description: "электроёмкость, Ф" },
          { latex: "U", description: "напряжение на конденсаторе, В" },
        ],
        limitation:
          "Перед расчётом переведи микрофарады в фарады; напряжение входит в квадрате.",
      },
    ],
  },
  {
    id: "thermodynamics",
    title: "Молекулярная физика и термодинамика",
    intro: "Плотность, состояние газа и тепловые процессы.",
    badgeTone: "gold",
    status: "active",
    entries: [
      {
        id: "density-volume-ratio",
        relatedSkillIds: ["density-volume-ratio"],
        title: "Масса через плотность и объём",
        formula: "m = \\rho V",
        caption: "масса растёт с объёмом, а не с линейным размером",
        symbols: [
          { latex: "m", description: "масса тела, кг" },
          { latex: "\\rho", description: "плотность вещества, кг/м³" },
          { latex: "V", description: "объём тела, м³" },
        ],
        limitation:
          "Для однородного тела. При сравнении фигур одинаковой формы объём растёт как куб линейного размера.",
      },
      {
        id: "mendeleev-clapeyron",
        relatedSkillIds: ["ideal-gas-state"],
        title: "Уравнение Менделеева — Клапейрона",
        formula: "pV = \\frac{m}{M}RT",
        caption: "связь давления, объёма и температуры идеального газа",
        symbols: [
          { latex: "p", description: "давление газа, Па" },
          { latex: "V", description: "объём газа, м³" },
          { latex: "m", description: "масса газа, кг" },
          { latex: "M", description: "молярная масса, кг/моль" },
          { latex: "R", description: "универсальная газовая постоянная, 8,31 Дж/(моль·К)" },
          { latex: "T", description: "абсолютная температура, К" },
        ],
        limitation:
          "Для идеального газа; T — абсолютная температура в кельвинах, а t обычно обозначает температуру по Цельсию.",
      },
      {
        id: "heat-amount",
        relatedSkillIds: ["heat-amount"],
        title: "Количество теплоты при нагревании",
        formula: "Q = cm\\,\\Delta T",
        caption: "сколько энергии нужно, чтобы изменить температуру тела",
        symbols: [
          { latex: "Q", description: "количество теплоты, Дж" },
          { latex: "c", description: "удельная теплоёмкость вещества, Дж/(кг·К)" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "\\Delta T", description: "изменение температуры, К" },
        ],
        limitation:
          "Удельную теплоёмкость c считаем постоянной, агрегатное состояние не меняется. Энергия нагревателя равна Q лишь без потерь и нагрева посуды.",
      },
      {
        id: "phase-change-heat",
        relatedSkillIds: ["phase-change-heat"],
        title: "Нагревание и плавление",
        formula: "Q=cm\\Delta T+\\lambda m",
        caption: "полная теплота складывается из отдельных стадий процесса",
        symbols: [
          { latex: "Q", description: "полное количество теплоты, Дж" },
          { latex: "c", description: "удельная теплоёмкость, Дж/(кг·К)" },
          { latex: "\\lambda", description: "удельная теплота плавления, Дж/кг" },
          { latex: "m", description: "масса вещества, кг" },
          { latex: "\\Delta T", description: "изменение температуры до плавления, К" },
        ],
        limitation:
          "Нагревание и плавление считают отдельно; во время плавления температура не меняется.",
      },
      {
        id: "heat-engine-efficiency",
        relatedSkillIds: [],
        title: "КПД теплового двигателя",
        formula: "\\eta = \\frac{A}{Q_1}",
        caption: "какая доля полученной теплоты стала полезной работой",
        symbols: [
          { latex: "\\eta", description: "КПД (доля или проценты)" },
          { latex: "A", description: "полезная работа за цикл, Дж" },
          { latex: "Q_1", description: "теплота, полученная от нагревателя, Дж" },
        ],
        limitation: "Всегда меньше единицы: часть теплоты уходит холодильнику.",
      },
      {
        id: "gas-state-ratio",
        relatedSkillIds: ["gas-state-ratio"],
        title: "Связь параметров газа",
        formula: "\\frac{p_1V_1}{T_1}=\\frac{p_2V_2}{T_2}",
        caption: "для одной и той же массы идеального газа",
        symbols: [
          { latex: "p_1, p_2", description: "давление газа" },
          { latex: "V_1, V_2", description: "объем газа" },
          { latex: "T_1, T_2", description: "абсолютная температура, К" },
        ],
        limitation:
          "Температуру обязательно переводят в кельвины.",
      },
      {
        id: "heat-balance-simple",
        relatedSkillIds: ["heat-balance-simple"],
        title: "Тепловой баланс",
        formula: "m_1c(t_1-t)=m_2c(t-t_2)",
        caption: "теплота, отданная горячей водой, равна теплоте, полученной холодной",
        symbols: [
          { latex: "m_1, m_2", description: "массы порций воды" },
          { latex: "t_1, t_2", description: "начальные температуры по Цельсию" },
          { latex: "t", description: "итоговая температура смеси по Цельсию" },
        ],
        limitation:
          "Формула записана для одного вещества без потерь теплоты.",
      },
    ],
  },
  {
    id: "optics",
    title: "Оптика",
    intro: "Отражение, преломление, плоское зеркало и собирающая тонкая линза.",
    badgeTone: "pink",
    status: "active",
    entries: [
      {
        id: "reflection-angle",
        relatedSkillIds: ["reflection-angle"],
        title: "Закон отражения света",
        formula: "\\beta=\\alpha",
        caption: "угол отражения равен углу падения",
        symbols: [
          { latex: "\\alpha", description: "угол падения, от нормали" },
          { latex: "\\beta", description: "угол отражения, от нормали" },
        ],
        limitation:
          "Оба угла отсчитываются от нормали — перпендикуляра к зеркалу, а не от его поверхности.",
      },
      {
        id: "plane-mirror-separation",
        relatedSkillIds: ["plane-mirror-separation"],
        title: "Изображение в плоском зеркале",
        formula: "L=2d",
        caption: "предмет и мнимое изображение симметричны относительно зеркала",
        symbols: [
          { latex: "L", description: "расстояние между предметом и изображением" },
          { latex: "d", description: "расстояние от предмета до зеркала" },
        ],
        limitation:
          "Изображение в плоском зеркале мнимое и равно предмету по размеру; L — именно расстояние предмет—изображение.",
      },
      {
        id: "refractive-index-speed",
        relatedSkillIds: ["refractive-index-speed"],
        title: "Показатель преломления",
        formula: "n=\\frac{c}{v}",
        caption: "отношение c к фазовой скорости света в среде",
        symbols: [
          { latex: "n", description: "абсолютный показатель преломления" },
          { latex: "c", description: "скорость света в вакууме, 3·10⁸ м/с" },
          { latex: "v", description: "фазовая скорость света в среде, м/с" },
        ],
        limitation:
          "В школьных задачах рассматривают обычные прозрачные среды для видимого света, где n > 1; это не универсальная граница для всех частот и сред.",
      },
      {
        id: "snell-index-ratio",
        relatedSkillIds: ["snell-index-ratio"],
        title: "Закон преломления света",
        formula: "\\frac{\\sin\\alpha}{\\sin\\gamma}=\\frac{n_2}{n_1}",
        caption: "на границе двух сред луч меняет направление",
        symbols: [
          { latex: "n_1, n_2", description: "показатели преломления сред" },
          { latex: "\\alpha", description: "угол падения, от нормали" },
          { latex: "\\gamma", description: "угол преломления, от нормали" },
        ],
        limitation:
          "Углы отсчитываются от нормали к границе; при переходе в оптически более плотную среду γ < α.",
      },
      {
        id: "thin-lens-image-distance",
        relatedSkillIds: ["thin-lens-image-distance"],
        title: "Формула тонкой линзы",
        formula: "\\frac{1}{F}=\\frac{1}{d}+\\frac{1}{f}",
        caption: "связь фокусного расстояния с положением предмета и изображения",
        symbols: [
          { latex: "F", description: "фокусное расстояние линзы" },
          { latex: "d", description: "расстояние от предмета до линзы" },
          { latex: "f", description: "расстояние от линзы до изображения" },
        ],
        limitation:
          "В таком виде — для собирающей линзы и действительного изображения (d > F); иначе слагаемые берут со знаками.",
      },
      {
        id: "lens-optical-power",
        relatedSkillIds: ["lens-optical-power"],
        title: "Оптическая сила линзы",
        formula: "D=\\frac{1}{F}",
        caption: "чем короче фокус, тем сильнее линза",
        symbols: [
          { latex: "D", description: "оптическая сила, дптр" },
          { latex: "F", description: "фокусное расстояние, м" },
        ],
        limitation:
          "F подставляют строго в метрах: дптр = 1/м. У собирающей линзы D положительна.",
      },
      {
        id: "lens-image-height",
        relatedSkillIds: ["lens-image-height"],
        title: "Линейное увеличение линзы",
        formula: "|\\Gamma|=\\frac{d_i}{d_o}=\\frac{H}{h}",
        caption: "во сколько раз изображение больше или меньше предмета",
        symbols: [
          { latex: "\\Gamma", description: "линейное увеличение (по модулю)" },
          { latex: "d_o", description: "расстояние от предмета до линзы" },
          { latex: "d_i", description: "расстояние от линзы до изображения" },
          { latex: "h, H", description: "высота предмета и модуль высоты изображения" },
        ],
        limitation:
          "Формула записана по модулю: у действительного изображения собирающей линзы оно перевёрнуто.",
      },
    ],
  },
];
