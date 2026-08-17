import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

// Контур цепи в координатах viewBox 0 0 320 180.
// Замкнутый путь — трасса для зарядов (offset-path).
const WIRE_PATH = "M 60 40 H 250 V 140 H 60 Z";
// Видимый провод рисуем с настоящим разрывом под пластинами источника,
// а не маскирующей линией: цвет фона карточки может меняться.
const WIRE_DRAW_PATH = "M 60 66 V 40 H 250 V 140 H 60 V 98";

// Сдвинуты на +0.9s: заряды трогаются в путь только после того, как
// провод дорисовался (иначе видно движение по ещё не появившейся линии).
const dotDelays = ["0.9s", "-0.4s", "-1.7s", "-3s"];

interface CircuitVisualProps {
  title: string;
  caption: string;
}

export function CircuitVisual({ title, caption }: CircuitVisualProps) {
  return (
    <Card className="flex flex-col gap-3 border-white/[.08] !p-5">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        Модель
      </p>
      <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>

      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-label="Замкнутая цепь: источник, резистор и упорядоченное движение зарядов по проводам"
        className="mx-auto w-full max-w-[360px]"
      >
        {/* провода */}
        <path
          d={WIRE_DRAW_PATH}
          fill="none"
          stroke="rgba(226,232,240,0.45)"
          strokeWidth="2"
          pathLength={1}
          className="graph-path-draw"
        />

        {/* источник слева: длинная и короткая пластины */}
        <g stroke="rgba(226,232,240,0.85)" strokeWidth="3" strokeLinecap="round">
          <line x1="48" y1="74" x2="72" y2="74" />
          <line x1="54" y1="90" x2="66" y2="90" />
        </g>
        <text
          x="34"
          y="86"
          fill="rgba(226,232,240,0.55)"
          fontSize="12"
          textAnchor="middle"
          className="physics-math"
        >
          U
        </text>

        {/* резистор справа */}
        <rect
          x="238"
          y="70"
          width="24"
          height="44"
          rx="4"
          fill="rgba(212,175,55,0.12)"
          stroke="rgba(212,175,55,0.7)"
          strokeWidth="2"
        />
        <text
          x="284"
          y="96"
          fill="rgba(226,232,240,0.55)"
          fontSize="12"
          textAnchor="middle"
          className="physics-math"
        >
          R
        </text>

        {/* заряды, бегущие по контуру */}
        {dotDelays.map((delay) => (
          <circle
            key={delay}
            r="4.5"
            fill="#00E0FF"
            className="circuit-dot"
            style={{
              offsetPath: `path("${WIRE_PATH}")`,
              animationDelay: delay,
            }}
          />
        ))}

        <text
          x="155"
          y="30"
          fill="rgba(0,224,255,0.75)"
          fontSize="11"
          textAnchor="middle"
        >
          направление тока →
        </text>
      </svg>

      <p className="text-[13px] font-normal leading-[1.7] text-white/70">
        <MathText text={caption} />
      </p>
    </Card>
  );
}
