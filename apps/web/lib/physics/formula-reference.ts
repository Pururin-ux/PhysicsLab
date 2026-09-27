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
    id: "measurements",
    title: "Измерения",
    intro: "Единицы длины, показания прибора и косвенное измерение объёма.",
    badgeTone: "cyan",
    status: "active",
    entries: [
      {
        id: "length-unit-conversion",
        relatedSkillIds: ["length-unit-conversion"],
        title: "Перевод длины в метры",
        formula: String.raw`\begin{aligned}
          1\,\text{км}&=1000\,\text{м}\\
          1\,\text{дм}&=0{,}1\,\text{м}\\
          1\,\text{см}&=0{,}01\,\text{м}\\
          1\,\text{мм}&=0{,}001\,\text{м}
        \end{aligned}`,
        caption: "из км в м число растёт, из дм, см и мм — уменьшается; сама длина не меняется",
        symbols: [
          { latex: "l", description: "длина, выраженная в выбранной единице" },
          { latex: "\\text{км}, \\text{дм}, \\text{см}, \\text{мм}", description: "единицы длины, которые переводят в метры" },
        ],
        limitation: "Только перевод длины; для площади и объёма множитель возводят соответственно во вторую или третью степень.",
      },
      {
        id: "graduated-scale-reading",
        relatedSkillIds: ["graduated-scale-reading"],
        title: "Отсчёт объёма по шкале мензурки",
        formula: String.raw`\begin{aligned}
          N_{\text{пр}}&=N_{\text{отм}}-1\\
          c&=\frac{V_2-V_1}{N_{\text{пр}}}\\
          V&=V_1+kc
        \end{aligned}`,
        caption: "сначала определи цену деления, затем отсчитай от подписанной отметки",
        symbols: [
          { latex: "V_1, V_2", description: "значения двух подписанных отметок, мл" },
          { latex: "N_{\\text{отм}}", description: "общее число штрихов, включая две крайние подписанные отметки" },
          { latex: "N_{\\text{пр}}", description: "число равных промежутков; оно на один меньше числа штрихов" },
          { latex: "k", description: "число промежутков от нижней подписанной отметки до мениска" },
          { latex: "c", description: "цена деления, мл на деление" },
        ],
        limitation: "Для воды мениск читают по нижней точке на уровне глаз. Школьная оценка погрешности отсчёта не описывает все ошибки реального измерения.",
      },
      {
        id: "rectangular-block-volume",
        relatedSkillIds: ["rectangular-block-volume"],
        title: "Объём прямоугольного бруска",
        formula: "V=abc",
        caption: "косвенно вычисляется по трём измеренным рёбрам",
        symbols: [
          { latex: "V", description: "объём бруска, см³" },
          { latex: "a,b,c", description: "длины трёх взаимно перпендикулярных рёбер в одинаковых единицах, см" },
        ],
        limitation: "Формула относится к прямоугольному бруску. Перед умножением вырази все рёбра в одной единице; 10 мм = 1 см.",
      },
      {
        id: "irregular-body-volume",
        relatedSkillIds: ["irregular-body-volume"],
        title: "Объём тела по вытеснению воды",
        formula: "V=V_2-V_1",
        caption: "разность показаний мензурки при полном погружении тела; 1 мл = 1 см³",
        symbols: [
          { latex: "V_1", description: "объём воды до погружения, мл" },
          { latex: "V_2", description: "показание после погружения тела, мл" },
          { latex: "V", description: "объём тела, мл или см³" },
        ],
        limitation: "Тело должно быть погружено целиком; вода не должна вылиться, а на теле не должно остаться пузырьков. Разность измеренных показаний не задаёт точность реального опыта.",
      },
    ],
  },
  {
    id: "kinematics",
    title: "Кинематика",
    intro: "Движение по прямой и чтение графиков.",
    badgeTone: "ember",
    status: "active",
    entries: [
      {
        id: "uniform-motion",
        relatedSkillIds: ["uniform-motion-basic", "uniform-coordinate-law", "uniform-motion-graphs"],
        title: "Равномерное движение",
        formula: "s=vt,\\qquad x=x_0+v_xt",
        caption: "путь и координата при постоянной скорости вдоль одной прямой",
        symbols: [
          { latex: "s", description: "путь, м" },
          { latex: "v", description: "постоянная скорость, м/с" },
          { latex: "x", description: "координата тела, м" },
          { latex: "x_0", description: "начальная координата, м" },
          { latex: "v_x", description: "проекция скорости на ось, м/с" },
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
        id: "projectile-components",
        relatedSkillIds: ["projectile-components"],
        title: "Бросок под углом по компонентам",
        formula: "t_{\\text{пол}}=\\frac{2v_{0y}}{g},\\qquad H=\\frac{v_{0y}^2}{2g},\\qquad L=v_{0x}t_{\\text{пол}}",
        caption: "вертикальная компонента задаёт время и высоту, горизонтальная — дальность",
        symbols: [
          { latex: "v_{0x}", description: "горизонтальная компонента начальной скорости, м/с" },
          { latex: "v_{0y}", description: "вертикальная компонента начальной скорости, м/с" },
          { latex: "t_{\\text{пол}}", description: "время возвращения на высоту бросания, с" },
          { latex: "H", description: "максимальная высота над точкой бросания, м" },
          { latex: "L", description: "дальность до возвращения на высоту бросания, м" },
          { latex: "g", description: "ускорение свободного падения, м/с²" },
        ],
        limitation:
          "Только без сопротивления воздуха и при одинаковых высотах старта и приземления. Для другого уровня финиша полное время не равно 2v₀ᵧ/g.",
      },
      {
        id: "average-speed-segments",
        relatedSkillIds: ["average-speed-segments", "average-speed-with-stop"],
        title: "Средняя путевая скорость",
        formula: "v_{\\text{ср}}=\\frac{s_1+s_2+\\ldots}{t_1+t_2+\\ldots}",
        caption: "весь путь делится на всё время от начала до конца, включая остановки",
        symbols: [
          { latex: "v_{\\text{ср}}", description: "средняя путевая скорость, м/с" },
          { latex: "s_1, s_2", description: "пути на отдельных участках, м" },
          { latex: "t_1, t_2", description: "промежутки движения и остановок, с" },
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
      {
        id: "rotation-frequency",
        relatedSkillIds: ["rotation-frequency"],
        title: "Частота и период вращения",
        formula: "\\nu=\\frac{N}{\\Delta t}=\\frac{1}{T}, \\qquad \\omega=2\\pi\\nu",
        caption: "число полных оборотов за время и время одного оборота",
        symbols: [
          { latex: "N", description: "число полных оборотов" },
          { latex: "\\Delta t", description: "время наблюдения, с" },
          { latex: "\\nu", description: "частота вращения, с⁻¹" },
          { latex: "T", description: "период обращения, с" },
          { latex: "\\omega", description: "угловая скорость, рад/с" },
        ],
        limitation: "Для равномерного вращения; углы в формулах угловой скорости выражены в радианах.",
      },
      {
        id: "oscillation-frequency",
        relatedSkillIds: ["oscillation-frequency"],
        title: "Период и частота механических колебаний",
        formula: "T=\\frac{\\Delta t}{N},\\quad \\nu=\\frac{N}{\\Delta t}=\\frac{1}{T}",
        caption: "время одного цикла и число циклов за секунду",
        symbols: [
          { latex: "N", description: "число полных колебаний" },
          { latex: "\\Delta t", description: "время наблюдения, с" },
          { latex: "T", description: "период одного колебания, с" },
          { latex: "\\nu", description: "частота колебаний, Гц" },
        ],
        limitation: "Учитываются полные повторения одного и того же состояния; амплитуду эти формулы не определяют.",
      },
      {
        id: "mathematical-pendulum-period",
        relatedSkillIds: ["mathematical-pendulum-period"],
        title: "Период математического маятника",
        formula: "T=2\\pi\\sqrt{\\frac{l}{g}}",
        caption: "период малых колебаний груза на нити",
        symbols: [
          { latex: "T", description: "период малых колебаний, с" },
          { latex: "l", description: "длина от точки подвеса до центра груза, м" },
          { latex: "g", description: "ускорение свободного падения, м/с²" },
        ],
        limitation: "Математическая модель и малые углы; длина нити намного больше размера груза, сопротивлением можно пренебречь.",
      },
      {
        id: "spring-pendulum-period",
        relatedSkillIds: ["spring-oscillation-period"],
        title: "Период пружинного маятника",
        formula: "T=2\\pi\\sqrt{\\frac{m}{k}}",
        caption: "период зависит от массы груза и жёсткости пружины",
        symbols: [
          { latex: "T", description: "период колебаний, с" },
          { latex: "m", description: "масса груза, кг" },
          { latex: "k", description: "жёсткость пружины, Н/м" },
        ],
        limitation: "Идеальная упругая пружина, малое сопротивление; для вертикального маятника отсчёт ведётся от нового положения равновесия.",
      },
      {
        id: "oscillation-energy",
        relatedSkillIds: ["oscillation-energy"],
        title: "Энергия пружинного маятника",
        formula: "W_k=W-W_p=\\frac{k}{2}(A^2-x^2)",
        caption: "кинетическая энергия зависит от положения груза относительно равновесия",
        symbols: [
          { latex: "W_k", description: "кинетическая энергия груза, Дж" },
          { latex: "W", description: "полная механическая энергия системы, Дж" },
          { latex: "W_p", description: "потенциальная энергия системы относительно равновесия, Дж" },
          { latex: "k", description: "жёсткость пружины, Н/м" },
          { latex: "A", description: "амплитуда колебаний, м" },
          { latex: "x", description: "смещение от положения равновесия, м" },
        ],
        limitation: "Для идеального вертикального пружинного маятника без потерь, пока пружина остаётся натянутой; x и A измеряются от нового положения равновесия.",
      },
      {
        id: "mechanical-wave-speed",
        relatedSkillIds: ["mechanical-wave-speed"],
        title: "Скорость механической волны",
        formula: "v=\\lambda\\nu=\\frac{\\lambda}{T}",
        caption: "за один период волна проходит расстояние, равное длине волны",
        symbols: [
          { latex: "v", description: "скорость распространения волны, м/с" },
          { latex: "\\lambda", description: "длина волны, м" },
          { latex: "\\nu", description: "частота источника, Гц" },
          { latex: "T", description: "период колебаний источника, с" },
        ],
        limitation: "Механическая волна распространяется в упругой среде; связь относится к периодической волне и не означает переноса частиц среды вместе с ней.",
      },
      {
        id: "echo-ranging",
        relatedSkillIds: ["echo-ranging"],
        title: "Расстояние по эхосигналу",
        formula: "l=\\frac{v\\Delta t}{2}",
        caption: "импульс проходит до отражателя и возвращается обратно",
        symbols: [
          { latex: "l", description: "расстояние до отражателя, м" },
          { latex: "v", description: "скорость звука в среде, м/с" },
          { latex: "\\Delta t", description: "время от посылки импульса до возврата эха, с" },
        ],
        limitation: "Скорость должна соответствовать среде, а измеренное время включает путь сигнала в обе стороны.",
      },
      {
        id: "resonance-frequency-match",
        relatedSkillIds: ["resonance-frequency-match"],
        title: "Частоты при резонансе",
        formula: "\\nu_{\\text{внеш}}\\approx\\nu_0",
        caption: "внешнее воздействие близко к собственной частоте системы",
        symbols: [
          { latex: "\\nu_{\\text{внеш}}", description: "частота внешней периодической силы, Гц" },
          { latex: "\\nu_0", description: "собственная частота колебательной системы, Гц" },
        ],
        limitation: "Резонансный отклик зависит от сопротивления и возникает при близости частот; амплитуда не растёт бесконечно.",
      },
      {
        id: "centripetal-acceleration",
        relatedSkillIds: ["centripetal-acceleration"],
        title: "Центростремительное ускорение",
        formula: "a=\\frac{v^2}{R}=\\omega^2R",
        caption: "изменение направления скорости при движении по окружности",
        symbols: [
          { latex: "a", description: "центростремительное ускорение, м/с²" },
          { latex: "v", description: "модуль линейной скорости, м/с" },
          { latex: "R", description: "радиус окружности, м" },
          { latex: "\\omega", description: "угловая скорость, рад/с" },
        ],
        limitation: "Для движения по окружности; вектор ускорения направлен к центру и перпендикулярен мгновенной скорости.",
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
        id: "archimedes-force",
        relatedSkillIds: ["archimedes-force"],
        title: "Сила Архимеда",
        formula: "F_A=\\rho_{\\text{ж}}gV_{\\text{погр}}",
        caption: "выталкивающая сила равна весу вытесненной среды",
        symbols: [
          { latex: "F_A", description: "сила Архимеда, Н" },
          { latex: "\\rho_{\\text{ж}}", description: "плотность жидкости или газа, кг/м³" },
          { latex: "g", description: "коэффициент, Н/кг" },
          { latex: "V_{\\text{погр}}", description: "объём погружённой части тела, м³" },
        ],
        limitation: "Для частично погружённого тела используют только объём части под поверхностью. Тело не должно опираться на дно.",
      },
      {
        id: "ship-payload",
        relatedSkillIds: ["ship-payload"],
        title: "Грузоподъёмность судна",
        formula: "m_{\\text{гр}}=m_{\\text{в}}-m",
        caption: "предельная масса груза — часть водоизмещения без массы самого судна",
        symbols: [
          { latex: "m_{\\text{гр}}", description: "максимально допустимая масса груза, т" },
          { latex: "m_{\\text{в}}", description: "водоизмещение при предельной осадке, т" },
          { latex: "m", description: "масса судна без груза, т" },
        ],
        limitation: "Формула относится к указанной предельной осадке. Фактическая загрузка должна быть не больше найденной грузоподъёмности.",
      },
      {
        id: "gravity-force",
        relatedSkillIds: ["gravity-force"],
        title: "Сила тяжести",
        formula: "F_{\\text{т}}=gm",
        caption: "сила притяжения тела Землёй возле её поверхности",
        symbols: [
          { latex: "F_{\\text{т}}", description: "сила тяжести, Н" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "g", description: "коэффициент 9,8 Н/кг возле поверхности Земли" },
        ],
        limitation:
          "Сила тяжести приложена к телу. Не подменяй её весом: вес приложен к опоре или подвесу.",
      },
      {
        id: "gravitation-distance",
        relatedSkillIds: ["gravitation-distance"],
        title: "Закон всемирного тяготения",
        formula: "F=G\\frac{m_1m_2}{r^2}",
        caption: "модуль взаимного притяжения двух материальных точек или однородных шаров",
        symbols: [
          { latex: "F", description: "модуль силы тяготения, Н" },
          { latex: "G", description: "гравитационная постоянная" },
          { latex: "m_1,m_2", description: "массы тел, кг" },
          { latex: "r", description: "расстояние между центрами, м" },
        ],
        limitation: "Точная запись для материальных точек и однородных шаров; r измеряется между центрами.",
      },
      {id:"hydrostatic-pressure",relatedSkillIds:["hydrostatic-pressure"],title:"Гидростатическое давление",formula:"p=\\rho gh",caption:"давление покоящейся жидкости на глубине h",symbols:[{latex:"p",description:"гидростатическое давление, Па"},{latex:"\\rho",description:"плотность жидкости, кг/м³"},{latex:"g",description:"коэффициент, Н/кг"},{latex:"h",description:"глубина от поверхности, м"}],limitation:"Даёт давление, обусловленное весом жидкости. Атмосферное давление учитывают отдельно, если это требует условие."},
      {
        id: "contact-pressure",
        relatedSkillIds:["contact-pressure"],
        title:"Давление на опору",formula:"p=\\frac{F}{S}",caption:"сила на единицу площади контакта",
        symbols:[{latex:"p",description:"давление, Па"},{latex:"F",description:"перпендикулярная сила, Н"},{latex:"S",description:"общая площадь контакта, м²"}],
        limitation:"При равномерном распределении силы. Для неравномерного распределения отношение полной силы к общей площади даёт среднее давление.",
      },
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
        id: "torque-balance",
        relatedSkillIds: ["torque-balance"],
        title: "Момент силы и равновесие",
        formula: "M=\\pm Fl, \\qquad \\sum M=0",
        caption: "вращение определяется силой, плечом и выбранным знаком направления",
        symbols: [
          { latex: "M", description: "момент силы относительно выбранной оси, Н·м" },
          { latex: "F", description: "модуль силы, Н" },
          { latex: "l", description: "перпендикулярное плечо силы, м" },
        ],
        limitation:
          "Плечо измеряют до линии действия силы, а не до точки приложения. Для равновесия также должна быть равна нулю векторная сумма сил.",
      },
      {
        id: "movable-pulley",
        relatedSkillIds: ["movable-pulley"],
        title: "Идеальный подвижный блок",
        formula: "P \\approx 2F",
        caption: "две ветви одной нити поддерживают движущийся блок вместе с грузом",
        symbols: [
          { latex: "P", description: "вес поднимаемого груза, Н" },
          { latex: "F", description: "сила на свободном конце нити, Н" },
        ],
        limitation:
          "Весом блока и нити и трением пренебрегают. Неподвижный блок выигрыша в силе не даёт: он только меняет направление.",
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
        id: "gravitational-potential-energy",
        relatedSkillIds: ["gravitational-potential-energy"],
        title: "Потенциальная энергия поднятого тела",
        formula: "E_p=mgh",
        caption: "энергия взаимодействия тела с Землёй относительно выбранного уровня",
        symbols: [
          { latex: "E_p", description: "потенциальная энергия, Дж" },
          { latex: "m", description: "масса тела, кг" },
          { latex: "g", description: "ускорение свободного падения, Н/кг" },
          { latex: "h", description: "высота относительно выбранного нулевого уровня, м" },
        ],
        limitation:
          "Значение зависит от выбранного нулевого уровня; при решении нужно явно понимать, откуда отсчитывается h.",
      },
      {
        id: "mechanical-energy-conservation",
        relatedSkillIds: ["mechanical-energy-conservation"],
        title: "Сохранение механической энергии",
        formula: "E_k+E_p=\\text{const}",
        caption: "превращение энергии движения в энергию взаимного положения",
        symbols: [
          { latex: "E_k", description: "кинетическая энергия, Дж" },
          { latex: "E_p", description: "потенциальная энергия, Дж" },
        ],
        limitation:
          "Сумма механических энергий сохраняется, только если силами трения и сопротивления можно пренебречь.",
      },
      {
        id: "work-force-distance",
        relatedSkillIds: ["work-force-distance"],
        title: "Работа силы вдоль движения",
        formula: "A=Fs",
        caption: "для сонаправленной силы; против движения работа имеет знак минус",
        symbols: [
          { latex: "A", description: "работа силы, Дж" },
          { latex: "F", description: "модуль силы, Н" },
          { latex: "s", description: "пройденный путь, м" },
        ],
        limitation:
          "Запись относится к случаям вдоль одной прямой: при силе против движения A = -Fs, а без перемещения A = 0.",
      },
      {
        id: "work-at-angle",
        relatedSkillIds: ["work-at-angle"],
        title: "Работа постоянной силы под углом",
        formula: "A=Fs\\cos\\alpha",
        caption: "работу совершает составляющая силы вдоль перемещения",
        symbols: [
          { latex: "A", description: "работа выбранной силы, Дж" },
          { latex: "F", description: "модуль силы, Н" },
          { latex: "s", description: "модуль перемещения, м" },
          { latex: "\\alpha", description: "угол между силой и перемещением" },
        ],
        limitation: "Формула записана для постоянной силы. При тупом угле косинус отрицателен, при 90° работа равна нулю.",
      },
      {
        id: "mechanical-power",
        relatedSkillIds: ["mechanical-power"],
        title: "Механическая мощность",
        formula: "P=\\frac{A}{t}",
        caption: "работа, совершённая за единицу времени",
        symbols: [
          { latex: "P", description: "мощность, Вт" },
          { latex: "A", description: "работа, Дж" },
          { latex: "t", description: "время, с" },
        ],
        limitation: "Формула даёт среднюю мощность за выбранный промежуток времени.",
      },
      {
        id: "mechanical-efficiency",
        relatedSkillIds: ["mechanical-efficiency"],
        title: "Коэффициент полезного действия",
        formula: "\\eta=\\frac{A_{\\text{пол}}}{A_{\\text{сов}}}\\cdot100\\%",
        caption: "доля полезной работы во всей совершённой работе",
        symbols: [
          { latex: "\\eta", description: "коэффициент полезного действия, %" },
          { latex: "A_{\\text{пол}}", description: "полезная работа, Дж" },
          { latex: "A_{\\text{сов}}", description: "полная совершённая работа, Дж" },
        ],
        limitation: "Для реального механизма полезная работа меньше полной, поэтому КПД меньше 100%.",
      },
    ],
  },
  {
    id: "electrodynamics",
    title: "Электричество",
    intro: "Электрический заряд и постоянный ток.",
    badgeTone: "cyan",
    status: "active",
    entries: [
      {
        id: "elementary-charge-count",
        relatedSkillIds: ["elementary-charge-count"],
        title: "Дискретность электрического заряда",
        formula: "N = \\frac{|q|}{e}, \\qquad e = 1{,}6 \\cdot 10^{-19}\\,\\text{Кл}",
        caption: "заряд тела изменяется целым числом элементарных зарядов",
        symbols: [
          { latex: "N", description: "число элементарных зарядов" },
          { latex: "q", description: "электрический заряд тела, Кл" },
          { latex: "e", description: "модуль элементарного заряда, Кл" },
        ],
        limitation:
          "Формула определяет число элементарных зарядов по модулю q; направление переноса электронов устанавливают по знаку заряда и условию.",
      },
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
        relatedSkillIds: ["conductor-resistance"],
        title: "Сопротивление проводника",
        formula: "R = \\frac{\\rho\\,l}{S}",
        caption: "длинный и тонкий провод сопротивляется сильнее",
        symbols: [
          { latex: "R", description: "сопротивление, Ом" },
          { latex: "\\rho", description: "удельное сопротивление материала, Ом·м или Ом·мм²/м" },
          { latex: "l", description: "длина проводника, м" },
          { latex: "S", description: "площадь поперечного сечения в единицах, согласованных с ρ" },
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
        id: "source-efficiency",
        relatedSkillIds: ["source-efficiency"],
        title: "КПД источника тока",
        formula: "\\eta=\\frac{P_R}{P_{\\text{ист}}}\\cdot100\\%=\\frac{R}{R+r}\\cdot100\\%",
        caption: "доля мощности источника, передаваемая внешней нагрузке",
        symbols: [
          { latex: "\\eta", description: "КПД источника, %" },
          { latex: "P_R", description: "мощность на внешней нагрузке, Вт" },
          { latex: "P_{\\text{ист}}", description: "мощность, развиваемая источником, Вт" },
          { latex: "R", description: "внешнее сопротивление, Ом" },
          { latex: "r", description: "внутреннее сопротивление источника, Ом" },
        ],
        limitation:
          "Отношение R/(R+r) относится к модели источника с внутренним сопротивлением и одной последовательной нагрузкой.",
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
        id: "household-load-current",
        relatedSkillIds: ["household-load-current"],
        title: "Общий ток параллельных приборов",
        formula: "P_{\\Sigma}=P_1+P_2,\\quad I_{\\Sigma}=\\frac{P_{\\Sigma}}{U}",
        caption: "сложи мощности и найди ток в общем проводе",
        symbols: [
          { latex: "P_1, P_2", description: "мощности двух одновременно работающих приборов, Вт" },
          { latex: "P_{\\Sigma}", description: "суммарная мощность, Вт" },
          { latex: "U", description: "общее напряжение на параллельных ветвях, В" },
          { latex: "I_{\\Sigma}", description: "сила тока в общем проводе, А" },
        ],
        limitation:
          "Оба прибора в учебной модели подключены параллельно к одному напряжению. Предел тока из задачи не служит советом по выбору защиты реальной проводки.",
      },
      {
        id: "magnetic-field-direction",
        relatedSkillIds: ["magnetic-field-direction"],
        title: "Направление магнитного поля тока",
        formula: "I\\;\\Longrightarrow\\;\\vec B",
        caption: "направление поля определяется направлением тока",
        symbols: [
          { latex: "I", description: "направление электрического тока" },
          { latex: "\\vec B", description: "направление магнитного поля" },
        ],
        limitation: "Стрелка показывает направление поля северным концом; для проводника и катушки применяют соответствующее правило правой руки.",
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
        id: "coulomb-force",
        relatedSkillIds: ["coulomb-force"],
        title: "Закон Кулона",
        formula: "F=k\\frac{|q_1q_2|}{\\varepsilon r^2}",
        caption: "модуль силы между двумя неподвижными точечными зарядами",
        symbols: [
          { latex: "F", description: "модуль силы взаимодействия, Н" },
          { latex: "q_1,q_2", description: "электрические заряды, Кл" },
          { latex: "r", description: "расстояние между зарядами, м" },
          { latex: "\\varepsilon", description: "относительная диэлектрическая проницаемость среды" },
          { latex: "k", description: "приблизительно 9·10⁹ Н·м²/Кл²" },
        ],
        limitation: "Неподвижные точечные заряды в вакууме или однородном диэлектрике. Для вакуума ε=1; знаки определяют направление сил.",
      },
      {
        id: "electric-field-strength",
        relatedSkillIds: ["electric-field-strength"],
        title: "Напряжённость поля точечного заряда",
        formula: "E=k\\frac{|Q|}{\\varepsilon r^2}",
        caption: "модуль напряжённости в выбранной точке",
        symbols: [
          { latex: "E", description: "модуль напряжённости поля, Н/Кл" },
          { latex: "Q", description: "заряд неподвижного точечного источника, Кл" },
          { latex: "r", description: "расстояние от источника до точки, м" },
          { latex: "\\varepsilon", description: "относительная диэлектрическая проницаемость среды" },
          { latex: "k", description: "приблизительно 9·10⁹ Н·м²/Кл²" },
        ],
        limitation: "Один неподвижный точечный источник в вакууме или однородном диэлектрике. Для вакуума ε=1; направление поля зависит от знака Q.",
      },
      {
        id: "electric-field-superposition",
        relatedSkillIds: ["electric-field-superposition"],
        title: "Принцип суперпозиции электрических полей",
        formula: "\\vec E=\\sum_i\\vec E_i",
        caption: "результирующее поле равно векторной сумме полей источников",
        symbols: [
          { latex: "\\vec E", description: "результирующая напряжённость поля, Н/Кл" },
          { latex: "\\vec E_i", description: "напряжённость поля i-го источника в выбранной точке, Н/Кл" },
        ],
        limitation: "Каждое поле находят отдельно для одной и той же точки; затем складывают векторы. В задачах на одной прямой складывают проекции со знаками.",
      },
      {
        id: "electrostatic-field-work",
        relatedSkillIds: ["electrostatic-field-work"],
        title: "Работа однородного электростатического поля",
        formula: "A=qE\\Delta x,\\quad \\Delta W_{\\text{п}}=-A",
        caption: "проекция перемещения берётся вдоль направления поля",
        symbols: [
          { latex: "A", description: "работа силы электростатического поля, Дж" },
          { latex: "q", description: "перемещаемый заряд со знаком, Кл" },
          { latex: "E", description: "модуль напряжённости однородного поля, Н/Кл" },
          { latex: "\\Delta x", description: "проекция перемещения на направление поля, м" },
          { latex: "\\Delta W_{\\text{п}}", description: "изменение потенциальной энергии заряда, Дж" },
        ],
        limitation: "Однородное электростатическое поле. Работа силы поля не зависит от формы пути; эта формула не является работой внешней силы.",
      },
      {
        id: "point-charge-potential",
        relatedSkillIds: ["point-charge-potential"],
        title: "Потенциал точечного заряда",
        formula: "\\varphi=k\\frac{Q}{r}",
        caption: "потенциал поля одного неподвижного точечного источника",
        symbols: [
          { latex: "\\varphi", description: "потенциал выбранной точки, В" },
          { latex: "Q", description: "заряд источника со знаком, Кл" },
          { latex: "r", description: "расстояние от источника до точки, м" },
          { latex: "k", description: "приблизительно 9·10⁹ Н·м²/Кл²" },
        ],
        limitation: "Один неподвижный точечный заряд в вакууме, ноль потенциала выбран на бесконечности. Для нескольких источников потенциалы складывают алгебраически.",
      },
      {
        id: "multi-source-potential",
        relatedSkillIds: ["multi-source-potential"],
        title: "Суперпозиция потенциалов",
        formula: "\\varphi_P=\\sum_i\\varphi_i=\\sum_i k\\frac{Q_i}{r_i}",
        caption: "потенциал всех источников в точке P при нуле на бесконечности",
        symbols: [
          { latex: "\\varphi_P", description: "потенциал точки P, В" },
          { latex: "Q_i", description: "заряд i-го источника со знаком, Кл" },
          { latex: "r_i", description: "расстояние от i-го источника до P, м" },
          { latex: "k", description: "приблизительно 9·10⁹ Н·м²/Кл²" },
        ],
        limitation: "Для неподвижных точечных источников в вакууме при общем нуле потенциала на бесконечности. Потенциал — скалярная величина; знаки задают заряды источников.",
      },
      {
        id: "uniform-field-voltage",
        relatedSkillIds: ["uniform-field-voltage"],
        title: "Напряжение между точками однородного поля",
        formula: "U_{AB}=\\varphi_A-\\varphi_B=E\\Delta x",
        caption: "ориентированная разность потенциалов от A к B",
        symbols: [
          { latex: "U_{AB}", description: "напряжение от A к B, В" },
          { latex: "\\varphi_A,\\varphi_B", description: "потенциалы точек A и B, В" },
          { latex: "E", description: "модуль напряжённости однородного поля, В/м" },
          { latex: "\\Delta x", description: "проекция перемещения A→B вдоль поля, м" },
        ],
        limitation: "Однородное электростатическое поле. Если B расположена по направлению E на расстоянии d, UAB=Ed>0 и E=UAB/d; при обратном порядке напряжение отрицательно.",
      },
      {
        id: "parallel-plate-capacitance",
        relatedSkillIds: ["parallel-plate-capacitance"],
        title: "Электроёмкость плоского конденсатора",
        formula: "C=\\varepsilon\\varepsilon_0\\frac{S}{d}",
        caption: "ёмкость двух параллельных обкладок с диэлектриком между ними",
        symbols: [
          { latex: "C", description: "электроёмкость, Ф" },
          { latex: "\\varepsilon", description: "относительная диэлектрическая проницаемость среды" },
          { latex: "\\varepsilon_0", description: "электрическая постоянная, Ф/м" },
          { latex: "S", description: "площадь взаимного перекрытия обкладок, м²" },
          { latex: "d", description: "расстояние между обкладками, м" },
        ],
        limitation: "Плоские параллельные обкладки, однородный диэлектрик, расстояние между пластинами мало по сравнению с их размерами; краевыми эффектами пренебрегают.",
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
      {
        id: "ampere-force-magnitude",
        relatedSkillIds: ["ampere-force-magnitude"],
        title: "Модуль силы Ампера",
        formula: "F_{\\text{А}}=BI\\ell\\sin\\alpha",
        caption: "сила на прямолинейный участок с током в однородном магнитном поле",
        symbols: [
          { latex: "F_{\\text{А}}", description: "модуль силы Ампера, Н" },
          { latex: "B", description: "модуль индукции внешнего поля, Тл" },
          { latex: "I", description: "сила тока, А" },
          { latex: "\\ell", description: "длина участка в поле, м" },
          { latex: "\\alpha", description: "угол между направлениями тока и индукции поля" },
        ],
        limitation: "Прямолинейный участок полностью находится в однородном поле. Формула даёт модуль; направление силы определяют отдельно по правилу левой руки.",
      },
      {
        id: "lorentz-force-magnitude",
        relatedSkillIds: ["lorentz-force-magnitude"],
        title: "Модуль магнитной силы Лоренца",
        formula: "F_{\\text{Л}}=|q|vB\\sin\\alpha",
        caption: "магнитная сила на движущийся заряд в однородном поле",
        symbols: [
          { latex: "F_{\\text{Л}}", description: "модуль магнитной силы, Н" },
          { latex: "q", description: "заряд частицы, Кл; знак задаёт направление отклонения" },
          { latex: "v", description: "скорость частицы, м/с" },
          { latex: "B", description: "магнитная индукция, Тл" },
          { latex: "\\alpha", description: "угол между скоростью и индукцией" },
        ],
        limitation: "Задачи семейства используют α = 90° и дают модуль силы. Магнитная сила перпендикулярна скорости и не меняет её модуль; направление учитывают отдельно.",
      },
      {
        id: "metal-temperature-current",
        relatedSkillIds: ["metal-temperature-current"],
        title: "Ток через нагретый металлический проводник",
        formula: "I=\\frac{U}{R}",
        caption: "закон Ома для участка цепи при сравнении двух температур",
        symbols: [
          { latex: "I", description: "сила тока через проводник, А" },
          { latex: "U", description: "напряжение на проводнике, В" },
          { latex: "R", description: "сопротивление проводника в рассматриваемом состоянии, Ом" },
        ],
        limitation: "При нагреве обычного металлического проводника R обычно растёт. Вывод об изменении I требует знать, остаётся ли U постоянным; к сверхпроводящему состоянию эта модель не относится.",
      },
      {
        id: "electrolyte-ion-transport",
        relatedSkillIds: ["electrolyte-ion-transport"],
        title: "Ионы в растворе хлорида меди(II)",
        formula: "\\mathrm{CuCl_2}\\rightarrow\\mathrm{Cu}^{2+}+2\\mathrm{Cl}^{-}",
        caption: "пример распада соли на подвижные ионы при растворении в воде",
        symbols: [
          { latex: "\\mathrm{Cu}^{2+}", description: "положительный ион меди; движется к катоду" },
          { latex: "\\mathrm{Cl}^{-}", description: "отрицательный ион хлора; движется к аноду" },
        ],
        limitation: "Это пример для раствора CuCl₂, а не правило для любого растворённого вещества. Схема не даёт численного тока, количества осадка или состава продуктов другого электролита.",
      },
      {
        id: "gas-discharge-conditions",
        relatedSkillIds: ["gas-discharge-conditions"],
        title: "Образование носителей заряда в газе",
        formula: "\\mathrm{A}+\\text{энергия}\\rightarrow\\mathrm{A}^{+}+e^{-}",
        caption: "условная запись ионизации нейтральной частицы газа",
        symbols: [
          { latex: "\\mathrm{A}", description: "условная нейтральная частица газа" },
          { latex: "\\mathrm{A}^{+}", description: "положительный ион после отрыва электрона" },
          { latex: "e^{-}", description: "свободный электрон" },
        ],
        limitation: "Это схема появления носителей, а не формула для расчёта тока. В реальном газе могут образовываться и отрицательные ионы; сохранение разряда зависит от условий поля и среды.",
      },
      {
        id: "induced-emf-magnitude",
        relatedSkillIds: ["induced-emf-magnitude"],
        title: "Модуль ЭДС электромагнитной индукции",
        formula: "|\\mathcal E_{\\text{инд}}|=N\\frac{|\\Delta\\Phi_1|}{\\Delta t}",
        caption: "для катушки из одинаково ориентированных витков, когда поток через каждый меняется одинаково",
        symbols: [
          { latex: "|\\mathcal E_{\\text{инд}}|", description: "модуль ЭДС индукции катушки, В" },
          { latex: "N", description: "число витков" },
          { latex: "|\\Delta\\Phi_1|", description: "модуль изменения магнитного потока через один виток, Вб" },
          { latex: "\\Delta t", description: "время изменения магнитного потока, с" },
        ],
        limitation: "Формула даёт модуль при одинаковом изменении потока во всех одинаково ориентированных витках. Для направления тока нужны ориентация контура и правило Ленца; при незамкнутой цепи индукционного тока нет.",
      },
      {
        id: "self-induction-emf",
        relatedSkillIds: ["self-induction-emf"],
        title: "Средняя ЭДС самоиндукции",
        formula: "\\mathcal E_{\\text{си, ср}}=-L\\frac{\\Delta I}{\\Delta t}",
        caption: "при заданном изменении тока и постоянной индуктивности катушки",
        symbols: [
          { latex: "\\mathcal E_{\\text{си, ср}}", description: "средняя ЭДС самоиндукции, В" },
          { latex: "L", description: "индуктивность катушки, Гн" },
          { latex: "\\Delta I", description: "изменение силы тока, А" },
          { latex: "\\Delta t", description: "время изменения тока, с" },
        ],
        limitation: "Минус выражает противодействие изменению выбранного положительного тока. Формула не задаёт реальную форму переходного процесса или ток без параметров всей цепи.",
      },
      {
        id: "inductor-magnetic-energy",
        relatedSkillIds: [],
        title: "Энергия магнитного поля катушки",
        formula: "W_{\\text{м}}=\\frac{LI^2}{2}",
        caption: "энергия поля при данном токе в катушке",
        symbols: [
          { latex: "W_{\\text{м}}", description: "энергия магнитного поля, Дж" },
          { latex: "L", description: "индуктивность катушки, Гн" },
          { latex: "I", description: "сила тока через катушку, А" },
        ],
        limitation: "Для линейной катушки при неизменной индуктивности. Время, за которое установился данный ток, в формулу не входит.",
      },
      {
        id: "lc-period",
        relatedSkillIds: ["lc-period"],
        title: "Период свободных колебаний LC-контура",
        formula: "T=2\\pi\\sqrt{LC}",
        caption: "формула Томсона для идеального колебательного контура",
        symbols: [
          { latex: "T", description: "период свободных колебаний, с" },
          { latex: "L", description: "индуктивность катушки, Гн" },
          { latex: "C", description: "электроёмкость конденсатора, Ф" },
        ],
        limitation: "Сопротивлением контура пренебрегают. Перед расчётом переведи мкФ в Ф; для ответа в мс умножь секунды на 1000.",
      },
      {
        id: "ac-oscillogram-frequency",
        relatedSkillIds: ["ac-oscillogram-frequency"],
        title: "Частота переменного тока по двум максимумам",
        formula: "T=(t_2-t_1)\\cdot10^{-3}\\,\\text{с},\\qquad\\nu=\\frac{1}{T}",
        caption: "время между соседними максимумами одного знака задаёт полный период",
        symbols: [
          { latex: "t_1, t_2", description: "время соседних максимумов одного знака, мс" },
          { latex: "T", description: "период переменного тока, с" },
          { latex: "\\nu", description: "частота переменного тока, Гц" },
        ],
        limitation: "Формула с множителем 10⁻³ относится к отсчётам времени в миллисекундах; максимумы должны быть соседними и одного знака.",
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
        id: "molecule-count-from-mass",
        relatedSkillIds: ["molecule-count-from-mass"],
        title: "Число частиц по массе вещества",
        formula: "N=\\frac{m}{M}N_A",
        caption: "масса образца переходит в количество вещества, затем в число частиц",
        symbols: [
          { latex: "N", description: "число частиц вещества" },
          { latex: "m", description: "масса образца, кг или г" },
          { latex: "M", description: "молярная масса в согласованных единицах, кг/моль или г/моль" },
          { latex: "N_A", description: "постоянная Авогадро, 6,022 · 10²³ моль⁻¹" },
        ],
        limitation: "Формула требует согласованных единиц массы и молярной массы; вид частиц задаётся химической формулой и условием.",
      },
      {
        id: "particle-concentration",
        relatedSkillIds: ["particle-concentration"],
        title: "Концентрация частиц",
        formula: "n=\\frac{N}{V}",
        caption: "число частиц в единице объёма",
        symbols: [
          { latex: "n", description: "концентрация частиц, м⁻³" },
          { latex: "N", description: "число частиц в выбранном объёме" },
          { latex: "V", description: "объём, м³" },
        ],
        limitation: "Частицы и объём должны относиться к одной системе; для результата в м⁻³ объём подставляют в кубических метрах.",
      },
      {
        id: "molecular-kinetic-energy",
        relatedSkillIds: ["molecular-kinetic-energy"],
        title: "Средняя кинетическая энергия молекулы",
        formula: "\\overline{E_k}=\\frac{3}{2}kT",
        caption: "энергетический смысл абсолютной температуры",
        symbols: [
          { latex: "\\overline{E_k}", description: "средняя кинетическая энергия поступательного движения молекулы, Дж" },
          { latex: "k", description: "постоянная Больцмана, 1,38 · 10⁻²³ Дж/К" },
          { latex: "T", description: "абсолютная температура, К" },
        ],
        limitation: "Формула относится к поступательному движению частиц идеального газа; температуру подставляют только в кельвинах.",
      },
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
        id: "fuel-combustion-heat",
        relatedSkillIds: ["fuel-combustion-heat"],
        title: "Теплота сгорания топлива",
        formula: "Q=qm",
        caption: "энергия, выделившаяся при полном сгорании топлива",
        symbols: [
          { latex: "Q", description: "количество теплоты, Дж" },
          { latex: "q", description: "удельная теплота сгорания, Дж/кг" },
          { latex: "m", description: "масса топлива, кг" },
        ],
        limitation:
          "Формула относится к полному сгоранию. Нагреваемое тело обычно получает только часть выделившейся энергии.",
      },
      {
        id: "vaporization-heat",
        relatedSkillIds: ["vaporization-heat"],
        title: "Нагревание и парообразование",
        formula: "Q=cm\\Delta T+Lm",
        caption: "полная теплота складывается из нагревания и превращения жидкости в пар",
        symbols: [
          { latex: "Q", description: "полное количество теплоты, Дж" },
          { latex: "c", description: "удельная теплоёмкость жидкости, Дж/(кг·К)" },
          { latex: "L", description: "удельная теплота парообразования, Дж/кг" },
          { latex: "m", description: "масса жидкости, кг" },
          { latex: "\\Delta T", description: "изменение температуры до кипения, К" },
        ],
        limitation:
          "Формула относится к нагреванию до температуры кипения и полному парообразованию; температуру кипения задают для указанного внешнего давления.",
      },
      {
        id: "heat-engine-efficiency",
        relatedSkillIds: ["heat-engine-efficiency"],
        title: "Термический КПД теплового двигателя",
        formula: "\\eta_{\\text{т}}=\\frac{A_{\\text{ц}}}{Q_1}=\\frac{Q_1-|Q_2|}{Q_1}",
        caption: "доля теплоты нагревателя, превращённая в работу рабочего тела за цикл",
        symbols: [
          { latex: "\\eta_{\\text{т}}", description: "термический КПД (доля или проценты)" },
          { latex: "A_{\\text{ц}}", description: "работа рабочего тела за цикл, Дж" },
          { latex: "Q_1", description: "теплота, полученная от нагревателя, Дж" },
          { latex: "|Q_2|", description: "модуль теплоты, отданной холодильнику, Дж" },
        ],
        limitation: "Рабочее тело возвращается в исходное состояние. Q₂ для него отрицательно; термический КПД не равен эффективному КПД всей установки с учётом топлива и потерь.",
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
        id: "ideal-gas-isoprocess",
        relatedSkillIds: ["ideal-gas-isoprocess"],
        title: "Законы изопроцессов",
        formula: "T=\\mathrm{const}:\\ pV=\\mathrm{const};\\quad p=\\mathrm{const}:\\frac VT=\\mathrm{const};\\quad V=\\mathrm{const}:\\frac pT=\\mathrm{const}",
        caption: "связи параметров данной порции газа при одном постоянном параметре",
        symbols: [
          { latex: "p", description: "давление газа" },
          { latex: "V", description: "объём газа" },
          { latex: "T", description: "абсолютная температура, К" },
        ],
        limitation: "Для данной массы газа неизменного состава в области применимости модели идеального газа; температура только в кельвинах.",
      },
      {
        id: "solid-structure-properties",
        relatedSkillIds: ["solid-structure-properties"],
        title: "Строение и свойства твёрдых тел",
        formula: "\\text{строение}\\;\\Longrightarrow\\;\\text{наблюдаемое свойство}",
        caption: "дальний порядок и ориентация кристаллов проявляются в свойствах материала",
        symbols: [
          { latex: "\\text{монокристалл}", description: "единая кристаллическая решётка во всём объёме" },
          { latex: "\\text{поликристалл}", description: "множество сросшихся кристаллических зёрен" },
          { latex: "\\text{аморфное тело}", description: "нет дальнего порядка и одной температуры плавления" },
        ],
        limitation: "Внешний вид отдельного образца не доказывает тип строения; нужны наблюдаемые свойства или данные о процессе плавления.",
      },
      {
        id: "liquid-structure-properties",
        relatedSkillIds: ["liquid-structure-properties"],
        title: "Строение и свойства жидкостей",
        formula: "\\text{временные положения}\\to\\text{текучесть};\\qquad \\sum\\vec F_{\\text{пов}}\\ne0",
        caption: "движение частиц в объёме и нескомпенсированные силы поверхностного слоя",
        symbols: [
          { latex: "\\sum\\vec F_{\\text{пов}}", description: "результирующая сил притяжения для молекулы поверхностного слоя" },
          { latex: "\\text{ближний порядок}", description: "упорядоченность среди ближайших соседей" },
        ],
        limitation: "Качественная молекулярная модель не задаёт траектории отдельных молекул и не отменяет действие тяжести, опоры и смачивания.",
      },
      {
        id: "vapor-dynamic-equilibrium",
        relatedSkillIds: ["vapor-dynamic-equilibrium"],
        title: "Динамическое равновесие жидкости и пара",
        formula: "N_{\\text{исп}}=N_{\\text{конд}}",
        caption: "числа молекул, пересекающих поверхность в противоположных направлениях за одинаковое время",
        symbols: [
          { latex: "N_{\\text{исп}}", description: "число молекул, покинувших жидкость" },
          { latex: "N_{\\text{конд}}", description: "число молекул, вернувшихся из пара в жидкость" },
          { latex: "p_{\\text{н}}", description: "давление насыщенного пара при данной температуре" },
        ],
        limitation: "Постоянство давления при изменении объёма относится к насыщенному пару при постоянной температуре, пока присутствует жидкость.",
      },
      {
        id: "relative-humidity-pressure",
        relatedSkillIds: ["relative-humidity-pressure"],
        title: "Относительная влажность воздуха",
        formula: "\\varphi=\\frac{p_{\\text{п}}}{p_{\\text{н}}}\\cdot100\\%=\\frac{\\rho_{\\text{п}}}{\\rho_{\\text{н}}}\\cdot100\\%",
        caption: "доля фактического водяного пара от насыщения при той же температуре",
        symbols: [
          { latex: "p_{\\text{п}},\\;\\rho_{\\text{п}}", description: "парциальное давление и плотность водяного пара" },
          { latex: "p_{\\text{н}},\\;\\rho_{\\text{н}}", description: "давление и плотность насыщенного пара при той же температуре" },
          { latex: "\\varphi", description: "относительная влажность воздуха" },
        ],
        limitation: "Числитель и знаменатель должны относиться к одной температуре; при охлаждении ниже точки росы часть пара конденсируется.",
      },
      {
        id: "monoatomic-internal-energy",
        relatedSkillIds: ["monoatomic-internal-energy"],
        title: "Внутренняя энергия одноатомного идеального газа",
        formula: "U=\\frac32\\nu RT;\\qquad \\Delta U=\\frac32\\nu R\\Delta T",
        caption: "внутренняя энергия данной порции одноатомного идеального газа зависит только от абсолютной температуры",
        symbols: [
          { latex: "U", description: "внутренняя энергия газа, Дж" },
          { latex: "\\nu", description: "количество вещества, моль" },
          { latex: "R", description: "универсальная газовая постоянная" },
          { latex: "T", description: "абсолютная температура, К" },
        ],
        limitation: "Формула относится к идеальному одноатомному газу. Для многоатомных и реальных систем число степеней свободы и энергия взаимодействия требуют другой модели.",
      },
      {
        id: "isobaric-gas-work",
        relatedSkillIds: ["isobaric-gas-work"],
        title: "Работа газа при постоянном давлении",
        formula: "A=p\\Delta V=p(V_2-V_1)",
        caption: "положительна при расширении газа и отрицательна при сжатии",
        symbols: [
          { latex: "A", description: "работа силы давления газа, Дж" },
          { latex: "p", description: "постоянное давление газа, Па" },
          { latex: "\\Delta V", description: "изменение объёма газа, м³" },
        ],
        limitation: "Формула pΔV относится к изобарному процессу. При переменном давлении работу определяют по площади под графиком p(V); работа внешних сил имеет противоположный знак.",
      },
      {
        id: "first-law-energy-balance",
        relatedSkillIds: ["first-law-energy-balance"],
        title: "Первый закон термодинамики",
        formula: "\\Delta U=Q-A_{\\text{газа}}=Q+A_{\\text{внеш}}",
        caption: "энергия, переданная при теплообмене и работе, изменяет внутреннюю энергию системы",
        symbols: [
          { latex: "\\Delta U", description: "изменение внутренней энергии системы, Дж" },
          { latex: "Q", description: "полученная системой теплота, Дж; при отдаче отрицательна" },
          { latex: "A_{\\text{газа}}", description: "работа газа, Дж; при расширении положительна" },
          { latex: "A_{\\text{внеш}}", description: "работа внешних сил над газом, Дж; противоположна работе газа" },
        ],
        limitation: "Сначала назови систему и того, кто совершает работу. Для изохорного процесса A газа = 0; для данной порции идеального газа при постоянной температуре ΔU = 0.",
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
        id: "shadow-and-penumbra",
        relatedSkillIds: ["shadow-and-penumbra"],
        title: "Лучевая модель тени",
        formula: "\\text{источник}\\;\\to\\;\\text{препятствие}\\;\\to\\;\\text{экран}",
        caption: "граничные лучи связывают размер источника с тенью и полутенью",
        symbols: [
          { latex: "\\text{источник}", description: "точечный или протяжённый источник света" },
          { latex: "\\text{препятствие}", description: "непрозрачное тело, перекрывающее часть лучей" },
          { latex: "\\text{экран}", description: "поверхность, на которой наблюдают освещённые и неосвещённые области" },
        ],
        limitation:
          "Это качественная схема для однородной прозрачной среды, а не формула расчёта размеров тени. Граница строится граничными лучами от краёв источника и препятствия.",
      },
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
        id: "refraction-direction",
        relatedSkillIds: ["refraction-direction"],
        title: "Направление преломлённого луча",
        formula: "\\gamma<\\alpha\\;\\text{(в более плотную среду)},\\qquad \\gamma>\\alpha\\;\\text{(в менее плотную)}",
        caption: "оба угла отсчитываются от нормали к границе сред",
        symbols: [
          { latex: "\\alpha", description: "угол падения, от нормали" },
          { latex: "\\gamma", description: "угол преломления, от нормали" },
        ],
        limitation:
          "Это качественная связь для ненулевого угла. При падении вдоль нормали α = γ = 0°, и направление луча не меняется.",
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
        id: "lens-image-properties",
        relatedSkillIds: ["lens-image-properties"],
        title: "Положение предмета и вид изображения",
        formula: "d>2F;\\quad d=2F;\\quad F<d<2F;\\quad d<F",
        caption: "четыре положения предмета у собирающей линзы",
        symbols: [
          { latex: "d", description: "расстояние от предмета до линзы" },
          { latex: "F", description: "фокусное расстояние" },
        ],
        limitation:
          "Для собирающей линзы при d > F изображение действительное и перевёрнутое; при d < F — мнимое, прямое и увеличенное. Рассеивающая линза при действительном предмете даёт мнимое прямое уменьшенное изображение.",
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
          "F подставляют строго в метрах: дптр = 1/м. У собирающей линзы D положительна, у рассеивающей — отрицательна.",
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
      {
        id: "vision-correction",
        relatedSkillIds: ["vision-correction"],
        title: "Знак корректирующей линзы",
        formula: "D<0\\;\\text{— рассеивающая},\\qquad D>0\\;\\text{— собирающая}",
        caption: "положение фокуса относительно сетчатки задаёт направление коррекции",
        symbols: [
          { latex: "D", description: "оптическая сила линзы очков, дптр" },
        ],
        limitation:
          "В школьной модели рассеивающая линза корректирует близорукость, а собирающая — дальнозоркость. Подбор очков требует обследования специалистом.",
      },
    ],
  },
  {
    id: "quantum",
    title: "Физика атома",
    intro: "Отдельная спектральная линия связана с переходом между двумя энергиями атома.",
    badgeTone: "blue",
    status: "active",
    entries: [
      {
        id: "bohr-transition-radiation",
        relatedSkillIds: ["bohr-transition-radiation"],
        title: "Переходы между уровнями водорода",
        formula: "E_n=-\\frac{13{,}6\\,\\text{эВ}}{n^2},\\quad h\\nu=|E_i-E_f|,\\quad \\lambda=\\frac{c}{\\nu}",
        caption: "разность энергий задаёт энергию фотона, его частоту и длину волны",
        symbols: [
          { latex: "n", description: "главное квантовое число уровня: 1, 2, 3, …" },
          { latex: "E_n", description: "энергия уровня атома водорода, эВ" },
          { latex: "E_i, E_f", description: "энергии начального и конечного уровней, эВ" },
          { latex: "h", description: "постоянная Планка, эВ·с" },
          { latex: "\\nu", description: "частота фотона, Гц" },
          { latex: "\\lambda", description: "длина волны фотона, м" },
          { latex: "c", description: "скорость света в вакууме, м/с" },
        ],
        limitation: "Формула уровней дана для атома водорода в модели Бора. При переходе вниз атом испускает фотон; при переходе вверх — поглощает.",
      },
    ],
  },
];
