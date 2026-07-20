// Лента спидометров: та самая картинка, из-за которой единица м/с² перестаёт
// быть магией. Ребёнок видит четыре циферблата подряд и сам замечает, что
// стрелка каждый раз прыгает на одно и то же деление.
//
// Метод взят из практики учителей физики (Hewitt, NSTA): единицу вводят через
// «сколько скорости прибавляется за одну секунду», и только потом показывают
// запись м/с².

type Tick = { second: number; speed: number };

const TICKS: Tick[] = [
  { second: 0, speed: 2 },
  { second: 1, speed: 4 },
  { second: 2, speed: 6 },
  { second: 3, speed: 8 },
];

const MAX_SPEED = 12;

function Dial({ tick }: { tick: Tick }) {
  // Стрелка ходит по полукругу: 0 м/с смотрит влево, MAX_SPEED — вправо.
  const angle = -90 + (tick.speed / MAX_SPEED) * 180;
  const radians = (angle - 90) * (Math.PI / 180);
  const needleX = 50 + 30 * Math.cos(radians);
  const needleY = 52 + 30 * Math.sin(radians);

  return (
    <figure className="flex min-w-0 flex-col items-center gap-2">
      <svg viewBox="0 0 100 66" className="w-full max-w-[128px]" role="img" aria-label={`Через ${tick.second} секунд спидометр показывает ${tick.speed} метров в секунду`}>
        <path
          d="M 12 52 A 38 38 0 0 1 88 52"
          fill="none"
          stroke="rgba(226,232,240,.16)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 12 52 A 38 38 0 0 1 88 52"
          fill="none"
          stroke="#79D9EE"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(tick.speed / MAX_SPEED) * 119} 200`}
          opacity="0.85"
        />
        <line
          x1="50"
          y1="52"
          x2={needleX}
          y2={needleY}
          stroke="#E079C7"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="50" cy="52" r="3.5" fill="#E079C7" />
        <text
          x="50"
          y="40"
          textAnchor="middle"
          className="physics-number"
          fill="#ffffff"
          fontSize="17"
          fontWeight="700"
        >
          {tick.speed}
        </text>
        <text x="50" y="63" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="8">
          м/с
        </text>
      </svg>
      <figcaption className="text-[12px] font-bold text-[#f0c98d]">
        {tick.second === 0 ? "в начале" : `через ${tick.second} с`}
      </figcaption>
    </figure>
  );
}

export function SpeedometerStrip() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {TICKS.map((tick) => (
          <Dial key={tick.second} tick={tick} />
        ))}
      </div>
      {/* Подписи прибавки стоят ровно в стыках между циферблатами: сетка та же,
          что у ряда спидометров, но сдвинута на половину колонки. */}
      <div
        className="-mt-1 grid grid-cols-4 gap-2 text-[13px] font-bold text-nova-cyan sm:gap-4"
        aria-hidden="true"
      >
        <span />
        <span className="-ml-[calc(50%+4px)] text-center sm:-ml-[calc(50%+8px)]">+2</span>
        <span className="-ml-[calc(50%+4px)] text-center sm:-ml-[calc(50%+8px)]">+2</span>
        <span className="-ml-[calc(50%+4px)] text-center sm:-ml-[calc(50%+8px)]">+2</span>
      </div>
    </div>
  );
}
