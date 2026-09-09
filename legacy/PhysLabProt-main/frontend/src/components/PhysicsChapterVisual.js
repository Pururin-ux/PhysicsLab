import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  CircuitBoard,
  Flame,
  Gauge,
  MoveUpRight,
  Sparkles,
  Target,
  Waves,
  Zap,
} from 'lucide-react';
import { BlockMath, PhysicsInline } from '@/components/PhysicsText';

const TYPE_META = {
  motion: {
    icon: Gauge,
    accent: '#00E5FF',
    title: 'Движение видно на графике',
    hook: 'Сначала ищем не формулу, а картинку движения: где скорость постоянна, где растет, где площадь под $v(t)$ дает перемещение.',
    steps: ['ось и направление', 'скорость/ускорение', 'график как подсказка'],
    formulas: ['v = v_0 + at', 'x = x_0 + v_0t + \\frac{at^2}{2}'],
  },
  kinematics: {
    icon: Gauge,
    accent: '#00E5FF',
    title: 'Движение видно на графике',
    hook: 'Сначала ищем не формулу, а картинку движения: где скорость постоянна, где растет, где площадь под $v(t)$ дает перемещение.',
    steps: ['ось и направление', 'скорость/ускорение', 'график как подсказка'],
    formulas: ['v = v_0 + at', 'x = x_0 + v_0t + \\frac{at^2}{2}'],
  },
  forces: {
    icon: MoveUpRight,
    accent: '#FFD700',
    title: 'Силы сначала рисуем',
    hook: 'В динамике главный шаг до вычислений: выбрать тело, расставить силы и только потом записывать $\\sum F = ma$ в проекциях.',
    steps: ['выбрать тело', 'расставить силы', 'записать проекции'],
    formulas: ['\\sum F_x = ma_x', 'F_{\\text{тр}} = \\mu N'],
  },
  energy: {
    icon: Sparkles,
    accent: '#39FF14',
    title: 'Энергия переходит, но не исчезает',
    hook: 'Если в задаче есть высота, скорость, пружина или КПД, удобно смотреть на обмен: $E_p \\leftrightarrow E_k$ и потери.',
    steps: ['система', 'потери', 'закон сохранения'],
    formulas: ['E_k = \\frac{mv^2}{2}', 'E_p = mgh'],
  },
  gas: {
    icon: Activity,
    accent: '#00E5FF',
    title: 'Газ читаем через процесс',
    hook: 'Для МКТ важно понять, что держат постоянным: $T$, $p$ или $V$. Тогда формула почти выбирает себя сама.',
    steps: ['изопроцесс', 'постоянная величина', 'пропорция'],
    formulas: ['pV = \\nu RT', '\\frac{V_1}{T_1}=\\frac{V_2}{T_2}'],
  },
  thermo: {
    icon: Flame,
    accent: '#FFB300',
    title: 'Теплота, работа и энергия',
    hook: 'Термодинамика становится проще, когда отделяешь: что пришло как теплота, что ушло в работу, а что изменило внутреннюю энергию.',
    steps: ['знак работы', 'изменение энергии', 'КПД'],
    formulas: ['Q = \\Delta U + A', '\\eta = \\frac{A}{Q_1}'],
  },
  electric: {
    icon: Zap,
    accent: '#FFD700',
    title: 'Поле показывает направление силы',
    hook: 'В электростатике не стартуем с чисел: сначала отмечаем знак зарядов, направление поля и расстояние в законе Кулона.',
    steps: ['знак заряда', 'направление поля', 'расстояние'],
    formulas: ['F = k\\frac{|q_1||q_2|}{r^2}', 'E = k\\frac{Q}{r^2}'],
  },
  circuit: {
    icon: CircuitBoard,
    accent: '#00E5FF',
    title: 'Цепь решается как схема',
    hook: 'Ток, напряжение и сопротивление легче не держать в голове, а видеть на схеме: последовательный и параллельный участки ведут себя по-разному.',
    steps: ['тип соединения', 'общая величина', 'закон Ома'],
    formulas: ['I = \\frac{U}{R}', 'P = UI = I^2R'],
  },
  waves: {
    icon: Waves,
    accent: '#39FF14',
    title: 'Колебания ищем по периоду',
    hook: 'В волнах и колебаниях почти всегда нужно связать период, частоту, длину волны и скорость, а не просто подставить первое число.',
    steps: ['период', 'частота', 'скорость волны'],
    formulas: ['\\nu = \\frac{N}{t}', 'v = \\lambda \\nu'],
  },
  optics: {
    icon: Waves,
    accent: '#FFD700',
    title: 'Луч строит изображение',
    hook: 'В оптике сначала строим ход лучей: где фокус, где предмет и каким получится изображение. Формула линзы идет после схемы.',
    steps: ['главная ось', 'фокус', 'изображение'],
    formulas: ['D = \\frac{1}{F}', 'n = \\frac{c}{v}'],
  },
  quantum: {
    icon: Atom,
    accent: '#C084FC',
    title: 'Квант: энергия порциями',
    hook: 'В атомной и ядерной физике важно понять порог процесса: хватает ли энергии фотона, что сохраняется, как меняется ядро.',
    steps: ['порог', 'сохранения', 'единицы энергии'],
    formulas: ['E = h\\nu', 'A = Z + N'],
  },
  examModel: {
    icon: Target,
    accent: '#FFD700',
    title: 'Формат ЦТ/ЦЭ: распознать модель',
    hook: 'Здесь тренируем не память условий, а действие: прочитать задание, увидеть скрытую физическую модель и отбросить похожие ловушки.',
    steps: ['что спрашивают', 'какая модель', 'какая ловушка'],
    formulas: [],
  },
  examGraph: {
    icon: BookOpen,
    accent: '#00E5FF',
    title: 'Графики и таблицы переводим',
    hook: 'В экзаменационных заданиях часто надо перевести представление: наклон, площадь, пропорция, направление изменения.',
    steps: ['оси и единицы', 'наклон/площадь', 'сравнение'],
    formulas: [],
  },
  examNumeric: {
    icon: Calculator,
    accent: '#39FF14',
    title: 'Числовой ответ без лишних шагов',
    hook: 'Часть B проверяет аккуратность: единицы СИ, короткая цепочка вычислений и ответ без случайной размерности.',
    steps: ['СИ', 'короткий расчет', 'формат ответа'],
    formulas: [],
  },
};

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

export function pickChapterVisualType(chapter) {
  const title = `${chapter?.title || ''}`.toLowerCase();
  const identityText = [
    chapter?.slug,
    chapter?.chapterSlug,
    chapter?.chapter_slug,
    chapter?.path,
    chapter?.url,
    chapter?.href,
  ].filter(Boolean).join(' ').toLowerCase();
  const chapterId = `${chapter?._id || chapter?.id || ''}`.toLowerCase();
  const text = [
    chapter?.title,
    chapter?.description,
    chapter?.theory,
    ...(chapter?.key_concepts || []),
    ...(chapter?.formulas || []).map((item) => `${item.name || ''} ${item.formula || ''}`),
  ].filter(Boolean).join(' ').toLowerCase();

  const isExamChapter = title.startsWith('a:') || title.startsWith('b:') || title.startsWith('часть a') || title.startsWith('часть b');
  if (isExamChapter && includesAny(text, ['числов', 'часть b', 'ответ без единиц', 'расчёт', 'расчет'])) return 'examNumeric';
  if (isExamChapter && includesAny(text, ['график', 'таблиц', 'соответств'])) return 'examGraph';
  if (isExamChapter && includesAny(text, ['часть a', 'модель', 'исключен', 'выбор ответа'])) return 'examModel';
  const titleLooksKinematic = includesAny(title, ['motion', 'движение']) && includesAny(text, ['v(t)', 'x(t)', 'v_0', 'x_0', 'скорост', 'ускор', 'перемещ']);
  if (
    chapterId === '6a2d03171856d6d16274f141' ||
    includesAny(identityText, ['motion', 'движение', 'kinematics', '6a2d03']) ||
    titleLooksKinematic ||
    includesAny(text, ['равномер', 'равноускор', 'кинемат', 'kinematic'])
  ) return 'kinematics';
  if (includesAny(text, ['квант', 'ядер', 'фотоэффект', 'атом'])) return 'quantum';
  if (includesAny(text, ['оптик', 'линз', 'свет', 'прелом'])) return 'optics';
  if (includesAny(text, ['колеб', 'волн', 'звук', 'маятн'])) return 'waves';
  if (includesAny(text, ['постоянный ток', 'электрический ток', 'цеп', 'сопротив', 'джоул'])) return 'circuit';
  if (includesAny(text, ['электростат', 'кулон', 'заряд', 'напряжён', 'напряжен', 'конденсатор'])) return 'electric';
  if (includesAny(text, ['термодинами', 'теплот', 'кпд', 'карно', 'внутренн'])) return 'thermo';
  if (includesAny(text, ['мкт', 'газ', 'изотерм', 'изобар', 'изохор'])) return 'gas';
  if (includesAny(text, ['энерг', 'работа', 'импульс', 'сохранен', 'мощность'])) return 'energy';
  if (includesAny(text, ['ньютон', 'сила', 'динамик', 'трени', 'наклонная'])) return 'forces';
  return 'motion';
}

export function getFriendlyLesson(chapter) {
  return TYPE_META[pickChapterVisualType(chapter)] || TYPE_META.motion;
}

function SceneFrame({ children, accent = '#00E5FF', className = '' }) {
  return (
    <div className={`relative ${className} overflow-hidden rounded-3xl border border-white/[0.07] bg-[#090D10]`}>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 18% 16%, ${accent}26, transparent 30%), radial-gradient(circle at 84% 26%, rgba(255,215,0,.13), transparent 32%)`,
        }}
      />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

const UNIFORM_MOTION_VT = [
  { t: 0, v: 2 },
  { t: 1, v: 2 },
  { t: 2, v: 2 },
  { t: 3, v: 2 },
  { t: 4, v: 2 },
  { t: 5, v: 2 },
];

const ACCELERATED_MOTION_XT = [
  { t: 0, x: 0 },
  { t: 1, x: 1 },
  { t: 2, x: 4 },
  { t: 3, x: 9 },
  { t: 4, x: 16 },
  { t: 5, x: 25 },
];

const KINEMATICS_GRAPHS = [
  {
    title: 'A',
    xLabel: 't, с',
    yLabel: 'v, м/с',
    valueKey: 'v',
    xDomain: [0, 5],
    yDomain: [0, 10],
    data: UNIFORM_MOTION_VT,
  },
  {
    title: 'B',
    xLabel: 't, с',
    yLabel: 'x, м',
    valueKey: 'x',
    xDomain: [0, 5],
    yDomain: [0, 25],
    data: ACCELERATED_MOTION_XT,
  },
];

function mapGraphPoint(point, graph, box) {
  const [xMin, xMax] = graph.xDomain;
  const [yMin, yMax] = graph.yDomain;
  const x = box.x + ((point.t - xMin) / (xMax - xMin)) * box.width;
  const y = box.y + box.height - ((point[graph.valueKey] - yMin) / (yMax - yMin)) * box.height;
  return { x, y };
}

function graphPath(graph, box) {
  return graph.data
    .map((point, index) => {
      const mapped = mapGraphPoint(point, graph, box);
      return `${index === 0 ? 'M' : 'L'}${mapped.x.toFixed(1)} ${mapped.y.toFixed(1)}`;
    })
    .join(' ');
}

function KinematicsMotionDiagram() {
  const graphBoxes = [
    { x: 58, y: 36, width: 92, height: 92 },
    { x: 208, y: 36, width: 92, height: 92 },
  ];

  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      {KINEMATICS_GRAPHS.map((graph, index) => {
        const box = graphBoxes[index];
        const pathD = graphPath(graph, box);

        return (
          <g key={graph.title}>
            <path d={`M${box.x} ${box.y + box.height} H${box.x + box.width} M${box.x} ${box.y + box.height + 12} V${box.y}`} stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" />
            <text x={box.x - 18} y={box.y - 8} fill="rgba(255,255,255,0.62)" fontSize="9" fontWeight="700">
              {graph.yLabel}
            </text>
            <text x={box.x + box.width - 18} y={box.y + box.height + 19} fill="rgba(255,255,255,0.62)" fontSize="9" fontWeight="700">
              {graph.xLabel}
            </text>
            <text x={box.x - 22} y={box.y + 11} fill="#FFD700" fontSize="11" fontWeight="800">
              {graph.title}
            </text>
            <motion.path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
            <circle r="5" fill="#FFD700">
              <animateMotion dur="4.6s" repeatCount="indefinite" path={pathD} />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function MotionDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M42 138 H302 M58 150 V28" stroke="rgba(255,255,255,0.20)" strokeWidth="3" strokeLinecap="round" />
      <motion.path d="M62 126 C98 124 114 99 144 84 C184 63 222 48 288 36" fill="none" stroke="#00E5FF" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
      <motion.g animate={{ x: [0, 194, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}>
        <rect x="54" y="121" width="54" height="26" rx="8" fill="#101C22" stroke="#00E5FF" />
        <circle cx="68" cy="151" r="8" fill="#08080A" stroke="#FFD700" strokeWidth="3" />
        <circle cx="94" cy="151" r="8" fill="#08080A" stroke="#FFD700" strokeWidth="3" />
      </motion.g>
      <motion.path d="M86 112 H160" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.15, 0.85, 0.15], x: [0, 34, 0] }} transition={{ duration: 1.7, repeat: Infinity }} />
    </svg>
  );
}

function ForcesDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M40 144 L298 72" stroke="rgba(255,255,255,0.22)" strokeWidth="8" strokeLinecap="round" />
      <motion.g animate={{ x: [0, 18, 0] }} transition={{ duration: 3.7, repeat: Infinity, ease: 'easeInOut' }}>
        <rect x="148" y="86" width="58" height="38" rx="8" transform="rotate(-16 177 105)" fill="#261E13" stroke="#FFD700" strokeWidth="2" />
        <path d="M177 105 L177 40" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" />
        <path d="M177 105 L225 91" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M177 105 L153 151" stroke="#FFB300" strokeWidth="4" strokeLinecap="round" />
        <path d="M172 48 L177 40 L182 48 M217 84 L225 91 L216 94" fill="none" stroke="white" strokeOpacity=".65" strokeWidth="2.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function EnergyDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M42 132 C98 32 232 32 298 132" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="5" strokeLinecap="round" />
      <motion.circle r="13" fill="#FFD700" animate={{ cx: [56, 170, 286, 170, 56], cy: [124, 46, 124, 46, 124] }} transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M72 132 H268" stroke="#39FF14" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 9" animate={{ strokeDashoffset: [0, -60] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />
      <circle cx="82" cy="132" r="24" fill="rgba(0,229,255,.09)" stroke="#00E5FF" />
      <circle cx="258" cy="132" r="24" fill="rgba(255,215,0,.10)" stroke="#FFD700" />
    </svg>
  );
}

function GasDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <rect x="70" y="42" width="200" height="96" rx="22" fill="rgba(0,229,255,.07)" stroke="rgba(0,229,255,.58)" strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.circle
          key={i}
          r="6"
          fill={i % 2 ? '#FFD700' : '#00E5FF'}
          animate={{ cx: [94 + i * 22, 128 - i * 7, 94 + i * 22], cy: [62 + (i % 3) * 24, 118 - (i % 2) * 36, 62 + (i % 3) * 24] }}
          transition={{ duration: 2.4 + i * 0.22, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <motion.rect x="238" y="47" width="24" height="86" rx="9" fill="rgba(255,215,0,.18)" stroke="#FFD700" animate={{ x: [238, 212, 238] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M82 154 C122 136 160 136 206 154 C242 168 268 164 292 148" fill="none" stroke="#39FF14" strokeWidth="3" strokeLinecap="round" animate={{ pathLength: [0.3, 1, 0.3] }} transition={{ duration: 2.6, repeat: Infinity }} />
    </svg>
  );
}

function ThermoDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <motion.path d="M82 132 C116 80 150 132 184 80 C218 132 252 80 286 132" fill="none" stroke="#FFB300" strokeWidth="5" strokeLinecap="round" animate={{ pathLength: [0.25, 1, 0.25], opacity: [0.45, 1, 0.45] }} transition={{ duration: 3.2, repeat: Infinity }} />
      <rect x="118" y="62" width="104" height="74" rx="18" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.18)" />
      <motion.rect
        x="130"
        y="86"
        width="80"
        height="42"
        rx="9"
        fill="rgba(255,179,0,.24)"
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
        animate={{ scaleY: [0.38, 1, 0.38] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path d="M226 92 H286" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" animate={{ x: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
      <path d="M278 84 L290 92 L278 100" fill="none" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ElectricDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <circle cx="112" cy="90" r="18" fill="#FFD700" />
      <circle cx="230" cy="90" r="18" fill="#00E5FF" />
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={`M132 ${62 + i * 14} C164 ${42 + i * 8} 194 ${42 + i * 8} 210 ${62 + i * 14}`}
          fill="none"
          stroke={i % 2 ? '#FFD700' : '#00E5FF'}
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.25, 0.8, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      <motion.path d="M112 90 H230" stroke="rgba(255,255,255,.26)" strokeWidth="3" strokeDasharray="6 7" animate={{ strokeDashoffset: [0, -42] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
    </svg>
  );
}

function CircuitDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <rect x="58" y="44" width="224" height="94" rx="28" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="4" />
      <path d="M92 138 H134 M150 138 H174 M190 138 H236" stroke="#FFB300" strokeWidth="5" strokeLinecap="round" />
      <circle cx="112" cy="92" r="18" fill="#171717" stroke="#FFD700" strokeWidth="3" />
      <circle cx="226" cy="92" r="18" fill="#071B20" stroke="#00E5FF" strokeWidth="3" />
      <motion.circle r="5" fill="#FFD700" animate={{ cx: [82, 258, 258, 82, 82], cy: [44, 44, 138, 138, 44] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'linear' }} />
      <motion.path d="M132 92 H206" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" animate={{ opacity: [0.2, 0.95, 0.2] }} transition={{ duration: 1.2, repeat: Infinity }} />
    </svg>
  );
}

function WavesDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M34 92 H306" stroke="rgba(255,255,255,.16)" strokeWidth="2" />
      <motion.path d="M34 92 C58 42 82 142 106 92 C130 42 154 142 178 92 C202 42 226 142 250 92 C274 42 298 142 322 92" fill="none" stroke="#39FF14" strokeWidth="5" strokeLinecap="round" animate={{ x: [-18, 18, -18] }} transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle cx="170" r="9" fill="#FFD700" animate={{ cy: [92, 48, 92, 136, 92] }} transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M74 48 V136 M266 48 V136" stroke="#00E5FF" strokeWidth="2" strokeDasharray="5 6" animate={{ opacity: [0.25, 0.8, 0.25] }} transition={{ duration: 1.8, repeat: Infinity }} />
    </svg>
  );
}

function OpticsDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M28 92 H314" stroke="rgba(255,255,255,.14)" strokeWidth="2" strokeDasharray="6 8" />
      <ellipse cx="158" cy="92" rx="20" ry="70" fill="rgba(0,229,255,.16)" stroke="#00E5FF" strokeWidth="3" />
      {[54, 78, 106, 130].map((y, i) => (
        <motion.path key={y} d={`M28 ${y} H158 L276 92`} fill="none" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.2, delay: i * 0.18, repeat: Infinity }} />
      ))}
      <motion.circle cx="276" cy="92" r="6" fill="#FFD700" animate={{ scale: [1, 1.7, 1], opacity: [0.8, 0.25, 0.8] }} transition={{ duration: 1.7, repeat: Infinity }} />
    </svg>
  );
}

function QuantumDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <circle cx="170" cy="92" r="12" fill="#FFD700" />
      {[0, 1, 2].map((i) => (
        <motion.ellipse key={i} cx="170" cy="92" rx="74" ry="28" fill="none" stroke={i === 0 ? '#00E5FF' : i === 1 ? '#C084FC' : '#FFD700'} strokeWidth="2.5" animate={{ rotate: [i * 60, i * 60 + 360] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '170px 92px' }} />
      ))}
      <motion.circle r="6" fill="#00E5FF" animate={{ cx: [96, 170, 244, 170, 96], cy: [92, 64, 92, 120, 92] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }} />
      <motion.path d="M48 48 L92 72 L48 96" fill="none" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ x: [0, 26, 0], opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  );
}

function ExamModelDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <rect x="64" y="38" width="212" height="104" rx="22" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.16)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="88" y={62 + i * 18} width={120 + i * 12} height="6" rx="3" fill={i === 1 ? '#FFD700' : 'rgba(255,255,255,.20)'} />
      ))}
      <motion.rect x="78" y="54" width="184" height="22" rx="9" fill="rgba(255,215,0,.10)" stroke="#FFD700" animate={{ y: [54, 90, 54] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.path d="M245 118 L284 82" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }} />
      <path d="M276 80 L286 80 L286 90" fill="none" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ExamGraphDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <path d="M42 134 H180 M54 146 V42" stroke="rgba(255,255,255,.22)" strokeWidth="3" strokeLinecap="round" />
      <motion.path d="M60 124 L92 104 L126 104 L166 64" fill="none" stroke="#00E5FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ pathLength: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <rect x="204" y="48" width="82" height="88" rx="14" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.16)" />
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M216 ${70 + i * 20} H274`} stroke={i === 1 ? '#FFD700' : 'rgba(255,255,255,.28)'} strokeWidth="5" strokeLinecap="round" animate={{ opacity: [0.35, 1, 0.35] }} transition={{ duration: 2, delay: i * 0.18, repeat: Infinity }} />
      ))}
      <motion.path d="M168 68 C188 54 196 62 216 70" fill="none" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 6" animate={{ strokeDashoffset: [0, -36] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
    </svg>
  );
}

function ExamNumericDiagram() {
  return (
    <svg viewBox="0 0 340 180" className="h-full w-full" aria-hidden="true">
      <rect x="62" y="44" width="216" height="96" rx="22" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.16)" />
      <path d="M92 72 H190 M92 96 H228" stroke="rgba(255,255,255,.24)" strokeWidth="6" strokeLinecap="round" />
      <motion.path d="M92 120 H154 L172 104 L204 120 H248" fill="none" stroke="#39FF14" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ pathLength: [0.25, 1, 0.25] }} transition={{ duration: 2.2, repeat: Infinity }} />
      {[0, 1, 2].map((i) => (
        <motion.rect key={i} x={198 + i * 24} y="62" width="18" height="24" rx="5" fill="rgba(255,215,0,.13)" stroke="#FFD700" animate={{ y: [62, 58, 62] }} transition={{ duration: 1.8, delay: i * 0.16, repeat: Infinity }} />
      ))}
    </svg>
  );
}

const DIAGRAMS = {
  kinematics: KinematicsMotionDiagram,
  motion: MotionDiagram,
  forces: ForcesDiagram,
  energy: EnergyDiagram,
  gas: GasDiagram,
  thermo: ThermoDiagram,
  electric: ElectricDiagram,
  circuit: CircuitDiagram,
  waves: WavesDiagram,
  optics: OpticsDiagram,
  quantum: QuantumDiagram,
  examModel: ExamModelDiagram,
  examGraph: ExamGraphDiagram,
  examNumeric: ExamNumericDiagram,
};

export function AnimatedPhysicsDiagram({ type = 'motion', className = 'h-44' }) {
  const meta = TYPE_META[type] || TYPE_META.motion;
  const Diagram = DIAGRAMS[type] || MotionDiagram;
  return (
    <SceneFrame accent={meta.accent} className={className}>
      <Diagram />
    </SceneFrame>
  );
}

function typeFromRepresentation(item) {
  const visual = item?.visual || '';
  const text = `${item?.title || ''} ${item?.meaning || ''} ${item?.description || ''}`.toLowerCase();
  if (visual.includes('force') || visual.includes('incline') || text.includes('сил')) return 'forces';
  if (visual.includes('energy') || visual.includes('momentum') || text.includes('энерг') || text.includes('импульс')) return 'energy';
  if (visual.includes('area') || visual.includes('line') || text.includes('граф')) return 'motion';
  if (text.includes('газ') || text.includes('изо')) return 'gas';
  if (text.includes('цеп') || text.includes('ток')) return 'circuit';
  if (text.includes('линз') || text.includes('луч')) return 'optics';
  return 'examGraph';
}

export function ChapterVisualHero({ chapter }) {
  const type = pickChapterVisualType(chapter);
  const meta = TYPE_META[type] || TYPE_META.motion;
  const Icon = meta.icon;
  const visibleConcepts = chapter?.key_concepts?.slice(0, 4) || [];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0B0D10] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-5">
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 18% 8%, ${meta.accent}18, transparent 34%), linear-gradient(130deg, rgba(255,255,255,.035), transparent 58%)` }} />
      <div className="relative grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex min-h-[260px] flex-col justify-between rounded-3xl border border-white/[0.06] bg-black/24 p-5 backdrop-blur-md">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${meta.accent}18`, color: meta.accent }}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="font-heading text-2xl font-black leading-tight text-white sm:text-3xl">{meta.title}</h2>
            <p className="mt-3 text-[14px] leading-7 text-white/62">
              <PhysicsInline>{meta.hook}</PhysicsInline>
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {(visibleConcepts.length ? visibleConcepts : meta.steps).map((concept) => (
              <span key={concept} className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/65">
                <PhysicsInline>{concept}</PhysicsInline>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/[0.07] bg-black/30 p-3 backdrop-blur-md">
          <AnimatedPhysicsDiagram type={type} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {meta.steps.map((label, index) => (
              <div key={label} className="rounded-2xl bg-white/[0.04] px-3 py-2">
                <span className="font-mono text-[11px]" style={{ color: meta.accent }}>{index + 1}</span>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-white/45">
                  <PhysicsInline>{label}</PhysicsInline>
                </p>
              </div>
            ))}
          </div>
          {meta.formulas.length > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {meta.formulas.slice(0, 2).map((formula) => (
                <div key={formula} className="rounded-2xl border border-white/[0.06] bg-black/25 px-3 py-2">
                  <BlockMath className="math-sm text-white">{formula}</BlockMath>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AnimatedRepresentationCard({ item, index = 0 }) {
  const type = typeFromRepresentation(item);
  const meta = TYPE_META[type] || TYPE_META.motion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0D0F12]"
    >
      <AnimatedPhysicsDiagram type={type} className="h-36" />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[12px] font-bold text-white">
            <PhysicsInline>{item.title}</PhysicsInline>
          </p>
          <ArrowRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1" style={{ color: `${meta.accent}80` }} />
        </div>
        <p className="text-[12px] leading-snug text-white/48">
          <PhysicsInline>{item.meaning || item.description}</PhysicsInline>
        </p>
      </div>
    </motion.div>
  );
}

export function VisualMethodStrip() {
  const items = [
    {
      icon: Sparkles,
      title: 'Сначала увидеть',
      text: 'График, луч, цепь или схема сил появляются до длинного объяснения.',
      color: '#00E5FF',
    },
    {
      icon: Gauge,
      title: 'Потом связать',
      text: 'Одна тема связывает рисунок, график, формулу и короткий расчет.',
      color: '#FFD700',
    },
    {
      icon: CircuitBoard,
      title: 'После потренировать',
      text: 'Тренажер берет структуру навыка, а не копирует знакомое условие.',
      color: '#39FF14',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.035] p-4">
          <item.icon className="mb-3 h-4 w-4" style={{ color: item.color }} />
          <p className="mb-1 text-[12px] font-bold text-white">{item.title}</p>
          <p className="text-[11px] leading-snug text-white/45">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
