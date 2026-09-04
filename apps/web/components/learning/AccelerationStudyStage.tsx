"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
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
  const prefersReducedMotion = useReducedMotion();
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

  const chartData = MOMENTS.map((item, index) => ({
    ...item,
    observedVelocity: index <= time ? item.velocity : null,
  }));

  return (
    <section
      className={cn("relative isolate overflow-hidden border-y border-white/[.12] bg-[#11161a]", className)}
      aria-labelledby={`${rangeId}-title`}
    >
      <div className={cn("relative overflow-hidden", compact ? "h-[230px] sm:h-[274px]" : "h-[300px] sm:h-[394px]")}>
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
          style={{ left: `${30 + time * 20}%` }}
          aria-hidden="true"
        />

        <div className="absolute left-4 top-5 max-w-[250px] sm:left-[max(2rem,calc((100%_-_940px)/2))] sm:top-8">
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

        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-[max(2rem,calc((100%_-_940px)/2))] sm:right-auto sm:w-[520px]">
          <label htmlFor={rangeId} className="sr-only">Выбери отметку времени</label>
          <input
            id={rangeId}
            type="range"
            min="0"
            max="3"
            step="1"
            value={time}
            onChange={(event) => selectMoment(Number(event.target.value))}
            className="sr-only"
            aria-valuetext={`${time} секунд, скорость ${moment.velocity} метров в секунду, путь ${moment.distance} метров`}
          />
          <div className="flex items-center justify-between gap-3 text-[12px] font-semibold text-white/74">
            <p>Моменты движения</p>
            <span className="text-[#f6d6a4]">{moment.distance} м · {time} с</span>
          </div>
          <div className="relative mt-3 grid grid-cols-4 gap-2" aria-label="Моменты движения">
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

      <div className="mx-auto grid max-w-[940px] gap-5 px-4 py-5 sm:grid-cols-[1.18fr_.82fr] sm:px-8 sm:py-7">
        <figure className="min-w-0" aria-labelledby={`${rangeId}-chart-caption`}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[15px] font-bold text-white">Скорость во времени</p>
            <p className="text-[13px] text-nova-cyan"><MathText text="$v(t)$" /></p>
          </div>
          <div
            className="mt-2 h-[190px] w-full"
            role="img"
            aria-label={`График скорости от времени: выбран момент ${time} секунд, скорость ${moment.velocity} метров в секунду.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 14, right: 18, bottom: 20, left: 0 }}>
                <CartesianGrid stroke="rgba(229,223,217,.10)" strokeDasharray="2 7" vertical={false} />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={[0, 3]}
                  ticks={[0, 1, 2, 3]}
                  tick={{ fill: "rgba(229,223,217,.68)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(229,223,217,.34)" }}
                  tickLine={false}
                  label={{ value: "t, с", position: "insideBottomRight", offset: -12, fill: "rgba(229,223,217,.7)", fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 8]}
                  ticks={[0, 2, 4, 6, 8]}
                  width={34}
                  tick={{ fill: "rgba(229,223,217,.68)", fontSize: 11 }}
                  axisLine={{ stroke: "rgba(229,223,217,.34)" }}
                  tickLine={false}
                  label={{ value: "v, м/с", angle: -90, position: "insideLeft", fill: "rgba(229,223,217,.7)", fontSize: 11 }}
                />
                <Line
                  type="linear"
                  dataKey="observedVelocity"
                  stroke="#06bad5"
                  strokeWidth={3}
                  connectNulls={false}
                  dot={{ r: 4, fill: "#06bad5", stroke: "#11161a", strokeWidth: 2 }}
                  activeDot={false}
                  isAnimationActive={!prefersReducedMotion}
                  animationDuration={360}
                />
                <ReferenceDot
                  x={moment.time}
                  y={moment.velocity}
                  r={6}
                  fill="#f4d29f"
                  stroke="#e0ad68"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
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
