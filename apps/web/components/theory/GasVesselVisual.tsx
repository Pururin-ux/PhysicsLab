import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";

// Координаты и фазы шести молекул внутри сосуда — несинхронный, но
// зацикленный дрейф создаёт ощущение хаотичного теплового движения.
const particles = [
  { cx: 95, cy: 62, delay: "0s" },
  { cx: 160, cy: 92, delay: "-0.6s" },
  { cx: 222, cy: 58, delay: "-1.2s" },
  { cx: 125, cy: 122, delay: "-1.8s" },
  { cx: 200, cy: 128, delay: "-0.3s" },
  { cx: 245, cy: 100, delay: "-2.1s" },
] as const;

interface GasVesselVisualProps {
  title: string;
  caption: string;
}

export function GasVesselVisual({ title, caption }: GasVesselVisualProps) {
  return (
    <Card className="flex flex-col gap-3 border-white/[.08] !p-5">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        Модель
      </p>
      <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>

      <svg
        viewBox="0 0 320 180"
        role="img"
        aria-label="Молекулы газа хаотично движутся внутри закрытого сосуда и сталкиваются со стенками"
        className="mx-auto w-full max-w-[360px]"
      >
        <rect
          x="50"
          y="30"
          width="220"
          height="120"
          rx="10"
          fill="rgba(255,122,69,0.05)"
          stroke="rgba(226,232,240,0.35)"
          strokeWidth="2"
          pathLength={1}
          className="graph-path-draw"
        />
        {particles.map((particle, index) => (
          <circle
            key={index}
            cx={particle.cx}
            cy={particle.cy}
            r="4.5"
            fill="#FF7A45"
            className="gas-particle"
            style={{ animationDelay: particle.delay }}
          />
        ))}
      </svg>

      <p className="text-[13px] font-normal leading-[1.7] text-white/70">
        <MathText text={caption} />
      </p>
    </Card>
  );
}
