"use client";

import { useId, useState } from "react";
import { cn } from "../../lib/utils";

const ANGLES = [20, 35, 50] as const;

export function OpticsObservation() {
  const [angle, setAngle] = useState<(typeof ANGLES)[number]>(35);
  const titleId = useId();
  const radians = (angle * Math.PI) / 180;
  const origin = { x: 170, y: 134 };
  const rayLength = 104;
  const rise = Math.cos(radians) * rayLength;
  const shift = Math.sin(radians) * rayLength;
  const incident = { x: origin.x - shift, y: origin.y - rise };
  const reflected = { x: origin.x + shift, y: origin.y - rise };

  return (
    <section
      aria-labelledby={titleId}
      className="relative isolate overflow-hidden border-y border-[#8fe8f5]/18 bg-[radial-gradient(circle_at_74%_28%,rgba(129,222,245,.12),transparent_26%),radial-gradient(circle_at_20%_88%,rgba(237,181,111,.1),transparent_30%),#10152a]"
    >
      <div className="mx-auto grid max-w-[1120px] gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <div className="max-w-[430px]">
          <p className="text-[14px] font-semibold text-[#f3cb8b]">Перед практикой · короткое наблюдение</p>
          <h2 id={titleId} className="mt-1 text-[28px] font-[800] leading-[1.08] tracking-[-.035em] text-white sm:text-[34px]">Луч у зеркала</h2>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/72">
            Сдвинь источник света. Отражённый луч не угадывает направление — он сохраняет тот же угол относительно нормали.
          </p>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Угол падения">
            {ANGLES.map((nextAngle) => (
              <button
                key={nextAngle}
                type="button"
                onClick={() => setAngle(nextAngle)}
                aria-pressed={angle === nextAngle}
                className={cn(
                  "min-h-10 border-b px-1.5 text-[14px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan",
                  angle === nextAngle ? "border-[#f1c47d] text-white" : "border-white/18 text-white/55 hover:border-white/48 hover:text-white",
                )}
              >
                {nextAngle}°
              </button>
            ))}
          </div>
          <p className="mt-4 border-l-2 border-[#9ae8f8]/55 pl-3.5 text-[14px] leading-[1.6] text-white/72">
            Сейчас оба угла равны <span className="font-bold text-[#9ae8f8]">{angle}°</span>. На задачах ниже их тоже отсчитывай от пунктирной нормали, а не от поверхности зеркала.
          </p>
        </div>

        <figure className="relative min-w-0" aria-label={`Падающий и отражённый лучи под углом ${angle} градусов к нормали`}>
          <svg viewBox="0 0 340 228" className="mx-auto block w-full max-w-[560px] overflow-visible">
            <defs>
              <filter id={`${titleId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M 35 134 H 305" stroke="rgba(250,245,235,.56)" strokeWidth="2" />
            {Array.from({ length: 13 }, (_, index) => {
              const x = 46 + index * 20;
              return <path key={x} d={`M ${x} 134 l -8 11`} stroke="rgba(250,245,235,.28)" strokeWidth="1" />;
            })}
            <path d={`M ${origin.x} 28 V ${origin.y}`} stroke="rgba(250,245,235,.42)" strokeWidth="1.4" strokeDasharray="5 6" />
            <text x={origin.x + 7} y="40" fill="rgba(248,250,252,.56)" fontSize="11">нормаль</text>
            <line x1={incident.x} y1={incident.y} x2={origin.x} y2={origin.y} stroke="#8fe8f5" strokeWidth="3" strokeLinecap="round" filter={`url(#${titleId}-glow)`} />
            <line x1={origin.x} y1={origin.y} x2={reflected.x} y2={reflected.y} stroke="#f1c47d" strokeWidth="3" strokeLinecap="round" filter={`url(#${titleId}-glow)`} />
            <circle cx={origin.x} cy={origin.y} r="4" fill="#fff1d0" />
            <text x={(incident.x + origin.x) / 2 - 6} y={(incident.y + origin.y) / 2 - 10} textAnchor="end" fill="#8fe8f5" fontSize="13" fontWeight="700">α = {angle}°</text>
            <text x={(reflected.x + origin.x) / 2 + 8} y={(reflected.y + origin.y) / 2 - 10} fill="#f1c47d" fontSize="13" fontWeight="700">β = {angle}°</text>
            <text x="42" y="165" fill="rgba(248,250,252,.55)" fontSize="11">зеркало</text>
          </svg>
          <figcaption className="mt-1 text-center text-[12px] leading-[1.5] text-white/52">Голубой — падающий луч, тёплый — отражённый.</figcaption>
        </figure>
      </div>
    </section>
  );
}
