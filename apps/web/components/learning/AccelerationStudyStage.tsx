"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

const MOMENTS = [
  { time: 0, velocity: 2, distance: 0 },
  { time: 1, velocity: 4, distance: 3 },
  { time: 2, velocity: 6, distance: 8 },
  { time: 3, velocity: 8, distance: 15 },
] as const;

type AccelerationStudyStageProps = {
  compact?: boolean;
  className?: string;
  onObservedChange?: (hasObserved: boolean) => void;
};

export function AccelerationStudyStage({
  compact = false,
  className,
  onObservedChange,
}: AccelerationStudyStageProps) {
  const [time, setTime] = useState(0);
  const rangeId = useId();
  const moment = MOMENTS[time];
  const hasMoved = time > 0;
  const hasReachedEnd = time === MOMENTS.length - 1;

  function selectMoment(nextTime: number) {
    setTime(nextTime);
    onObservedChange?.(nextTime === MOMENTS.length - 1);
  }

  const chartCaption = hasReachedEnd
    ? "Теперь видны все четыре точки: за каждую секунду скорость поднимается на 2 м/с."
    : hasMoved
      ? `От ${time - 1} до ${time} с скорость выросла с ${MOMENTS[time - 1].velocity} до ${moment.velocity} м/с.`
      : "Нажимай отметки 0, 1, 2 и 3 с: точки графика будут появляться вместе с моментами движения.";

  const plotPoint = (item: (typeof MOMENTS)[number]) => ({
    x: 48 + (item.time / 3) * 468,
    y: 178 - (item.velocity / 8) * 144,
  });
  const observedPoints = MOMENTS.slice(0, time + 1).map(plotPoint);
  const observedPath = observedPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section
      className={cn("relative isolate overflow-hidden border-y border-white/[.12] bg-[#11161a]", className)}
      aria-labelledby={`${rangeId}-title`}
    >
      <div className={cn("relative flex flex-col justify-between gap-8 overflow-hidden p-4 sm:p-8", compact ? "min-h-[300px] sm:min-h-[340px]" : "min-h-[340px] sm:min-h-[394px]")}>
        <Image
          src="/art/production/lesson-acceleration-trolleybus-cozy.webp"
          alt="Ночной троллейбус у остановки на мокрой городской улице"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[55%_50%] transition-transform duration-700 motion-reduce:transition-none"
          style={{ transform: `translateX(-${time * 1.1}%) scale(1.035)` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,17,21,.9)_0%,rgba(15,17,21,.42)_42%,rgba(15,17,21,.08)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-[linear-gradient(0deg,rgba(15,17,21,.96),transparent)]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-[35%] left-[30%] right-[9%] h-px bg-[#f1c47d]/30" aria-hidden="true" />
        <div
          className="pointer-events-none absolute bottom-[calc(35%_-_4px)] size-2 rounded-full bg-[#f4d29f] transition-[left] duration-500 motion-reduce:transition-none"
          style={{ left: `${30 + (moment.distance / MOMENTS[3].distance) * 60}%` }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-[940px] self-center">
          <div className="max-w-[300px]">
          <p className="text-[13px] font-semibold text-[#f4cd91]">Ускорение в движении</p>
          <h2 id={`${rangeId}-title`} className="mt-1 text-[24px] font-[800] leading-[1.08] tracking-[-.035em] text-white sm:text-[34px]">
            Смотри, как он набирает ход
          </h2>
          <p className="mt-2 text-[14px] leading-[1.55] text-white/76 sm:text-[15px]">
            {time === 0
              ? "Троллейбус уже едет со скоростью 2 м/с и начинает разгоняться. Нажимай отметки времени."
              : `Через ${time} с: ${moment.velocity} м/с и ${moment.distance} м от начальной отметки.`}
          </p>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-[940px] self-center">
          <div className="max-w-[520px]">
          <div className="flex items-center justify-between gap-3 text-[12px] font-semibold text-white/74">
            <p>Моменты движения</p>
            <span className="text-[#f6d6a4]">{moment.distance} м · {time} с</span>
          </div>
          <div className="relative mt-3 grid grid-cols-4 gap-2" role="group" aria-label="Моменты движения">
            <span className="absolute left-[6%] right-[6%] top-[9px] h-px bg-white/28" aria-hidden="true" />
            {MOMENTS.map((item) => {
              const active = item.time === time;
              return (
                <button
                  key={item.time}
                  type="button"
                  onClick={() => selectMoment(item.time)}
                  aria-pressed={active}
                  className={cn(
                    "relative z-10 min-h-11 pt-5 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/80",
                    "before:absolute before:left-0 before:top-0 before:size-[18px] before:rounded-full before:border before:transition-colors",
                    active ? "text-white before:border-[#f1c47d] before:bg-[#fff0d2]" : "text-white/58 hover:text-white before:border-white/40 before:bg-[#11161a]",
                  )}
                >
                  {item.time} с <span className="ml-1 text-white/55">{item.velocity} м/с</span>
                </button>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[940px] gap-5 px-4 py-5 sm:grid-cols-[1.18fr_.82fr] sm:px-8 sm:py-7">
        <figure className="min-w-0" aria-labelledby={`${rangeId}-chart-caption`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-white">Скорость во времени</p>
            <p className="text-[13px] text-nova-cyan"><MathText text="$v(t)$" /></p>
          </div>
          <div
            className="mt-2 w-full overflow-hidden border-y border-white/[.1] py-2"
            role="img"
            aria-label={`График скорости от времени: выбран момент ${time} секунд, скорость ${moment.velocity} метров в секунду.`}
          >
            <svg viewBox="0 0 560 210" className="block h-auto w-full" aria-hidden="true">
              <g stroke="rgba(229,223,217,.11)" strokeDasharray="2 8">
                {[2, 4, 6, 8].map((velocity) => {
                  const y = 178 - (velocity / 8) * 144;
                  return <line key={velocity} x1="48" y1={y} x2="516" y2={y} />;
                })}
              </g>
              <g stroke="rgba(229,223,217,.42)" strokeWidth="1.5">
                <path d="M48 18 V178 H532" fill="none" />
                {[0, 1, 2, 3].map((tick) => {
                  const x = 48 + (tick / 3) * 468;
                  return <line key={tick} x1={x} y1="178" x2={x} y2="184" />;
                })}
                {[0, 2, 4, 6, 8].map((tick) => {
                  const y = 178 - (tick / 8) * 144;
                  return <line key={tick} x1="42" y1={y} x2="48" y2={y} />;
                })}
              </g>
              <g fill="rgba(229,223,217,.68)" fontSize="11" fontFamily="inherit">
                {[0, 1, 2, 3].map((tick) => {
                  const x = 48 + (tick / 3) * 468;
                  return <text key={tick} x={x} y="201" textAnchor="middle">{tick}</text>;
                })}
                {[0, 2, 4, 6, 8].map((tick) => {
                  const y = 178 - (tick / 8) * 144;
                  return <text key={tick} x="34" y={y + 4} textAnchor="end">{tick}</text>;
                })}
                <text x="526" y="201">t, с</text>
                <text x="14" y="18">v, м/с</text>
              </g>
              {observedPoints.length > 1 ? (
                <polyline points={observedPath} fill="none" stroke="#06bad5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="motion-safe:transition-[stroke-dashoffset]" />
              ) : null}
              {observedPoints.map((point, index) => (
                <circle key={MOMENTS[index].time} cx={point.x} cy={point.y} r={index === time ? 7 : 5} fill={index === time ? "#f4d29f" : "#06bad5"} stroke={index === time ? "#e0ad68" : "#11161a"} strokeWidth="2" />
              ))}
              <g transform={`translate(${plotPoint(moment).x} ${plotPoint(moment).y})`}>
                <line y1="12" y2="31" stroke="rgba(244,210,159,.72)" />
                <text y="46" textAnchor="middle" fill="#f4d29f" fontSize="12" fontWeight="700">{moment.velocity} м/с</text>
              </g>
            </svg>
          </div>
          <figcaption id={`${rangeId}-chart-caption`} className="mt-2 text-[13px] leading-[1.55] text-white/62">
            {chartCaption}
          </figcaption>
        </figure>

        <aside className="border-t border-white/[.1] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0" aria-live="polite">
          {!hasReachedEnd ? (
            <>
              <p className="text-[16px] font-bold leading-[1.4] text-white">Не спеши с ответом.</p>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/68">
                Сначала сравни соседние остановки маркера. Важно не значение скорости само по себе, а одинаковая прибавка между моментами.
              </p>
            </>
          ) : (
            <>
              <p className="text-[16px] font-bold leading-[1.4] text-white">Вот что повторяется.</p>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/70">
                От 2 до 8 м/с прибавилось <span className="font-bold text-[#9ae8f8]">6 м/с</span> за <span className="font-bold text-[#f4cd91]">3 с</span>. Но сначала скажи сам: какая прибавка приходится на каждую секунду?
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
