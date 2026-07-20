"use client";

import {
  ArrowCounterClockwise,
  ArrowsDownUp,
  Basketball,
  Gauge,
  Play,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import { cn } from "../../lib/utils";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { MathText } from "../ui/MathText";

type Prediction = "faster" | "same" | "slower";

const predictions: { id: Prediction; label: string }[] = [
  { id: "faster", label: "Скорость вырастет" },
  { id: "same", label: "Не изменится" },
  { id: "slower", label: "Станет меньше" },
];

function rounded(value: number, digits = 1) {
  return value.toFixed(digits).replace(".", ",");
}

export function InteractivePreview() {
  const [height, setHeight] = useState(20);
  const [gravity, setGravity] = useState(9.8);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [checked, setChecked] = useState(false);
  const [runId, setRunId] = useState(0);

  const fallTime = Math.sqrt((2 * height) / gravity);
  const impactSpeed = Math.sqrt(2 * gravity * height);
  const correct = prediction === "faster";

  const graph = useMemo<PhysicsGraphSpec>(() => {
    const xMax = Math.max(2, Math.ceil(fallTime * 1.18));
    const yMax = Math.max(10, Math.ceil(impactSpeed * 1.16 / 5) * 5);

    return {
      id: `free-fall-${height}-${gravity}`,
      kind: "cartesian-line",
      axes: {
        x: { label: "t", unit: "с", range: [0, xMax] },
        y: { label: "v", unit: "м/с", range: [0, yMax] },
      },
      series: [
        {
          id: "speed",
          type: "line",
          points: [
            { x: 0, y: 0, label: "старт" },
            { x: fallTime, y: impactSpeed, label: `${rounded(impactSpeed)} м/с` },
          ],
        },
      ],
      annotations: [
        { type: "dashed-guide", x: fallTime },
        { type: "dashed-guide", y: impactSpeed },
      ],
      style: { variant: "app", accent: "cyan" },
    };
  }, [fallTime, gravity, height, impactSpeed]);

  function runExperiment() {
    setChecked(true);
    setRunId((value) => value + 1);
  }

  function updateHeight(value: number) {
    setHeight(value);
    setRunId((current) => current + 1);
  }

  function updateGravity(value: number) {
    setGravity(value);
    setRunId((current) => current + 1);
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[.12] bg-space-900 shadow-[0_30px_90px_rgba(0,0,0,.42)]">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col border-b border-white/[.1] p-5 sm:p-7 xl:border-b-0 xl:border-r">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone="blue">Свободное падение</Badge>
            <span className="text-[11px] font-bold uppercase tracking-[.13em] text-white/48">
              мини-эксперимент
            </span>
          </div>

          <h3 className="mt-5 text-[25px] font-[800] leading-[1.18] tracking-[-.03em] text-white sm:text-[31px]">
            Что будет со скоростью, если поднять шар выше?
          </h3>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-white/66">
            Сначала выбери прогноз. После проверки сможешь менять высоту и ускорение свободного падения.
          </p>

          <div className="mt-6 grid gap-2" role="group" aria-label="Прогноз результата">
            {predictions.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={prediction === item.id}
                onClick={() => {
                  setPrediction(item.id);
                  setChecked(false);
                }}
                className={cn(
                  "min-h-12 rounded-option border px-4 text-left text-[14px] font-bold transition-[border-color,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70",
                  prediction === item.id
                    ? "border-nova-blue/75 bg-nova-indigo/22 text-white"
                    : "border-white/[.11] bg-space-850/72 text-white/72 hover:-translate-y-px hover:border-nova-blue/48 hover:text-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button
            type="button"
            className="mt-4 w-full gap-2"
            disabled={!prediction}
            onClick={runExperiment}
          >
            <Play size={17} weight="fill" aria-hidden="true" />
            Проверить прогноз
          </Button>

          <AnimatePresence mode="wait">
            {checked ? (
              <motion.div
                key={prediction}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                className={cn(
                  "mt-4 rounded-option border p-4 text-[13px] leading-[1.65]",
                  correct
                    ? "border-nova-cyan/30 bg-nova-cyan/[.07] text-white/78"
                    : "border-nova-pink/30 bg-nova-pink/[.07] text-white/78",
                )}
              >
                <strong className={correct ? "text-nova-cyan" : "text-nova-pink"}>
                  {correct ? "Верно." : "Проверь ещё раз."}
                </strong>{" "}
                Чем больше высота, тем дольше шар разгоняется. Поэтому скорость у земли растёт как корень из высоты.
              </motion.div>
            ) : null}
          </AnimatePresence>

          <fieldset className="mt-6 grid gap-5 border-t border-white/[.1] pt-5 disabled:opacity-45" disabled={!checked}>
            <legend className="sr-only">Параметры эксперимента</legend>
            <label className="grid gap-2">
              <span className="flex items-center justify-between gap-3 text-[13px] font-bold text-white/72">
                <span className="inline-flex items-center gap-2"><ArrowsDownUp size={17} className="text-nova-blue" />Высота</span>
                <span className="tabular-nums text-white">{height} м</span>
              </span>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={height}
                onChange={(event) => updateHeight(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-[#6558D8]"
              />
            </label>

            <label className="grid gap-2">
              <span className="flex items-center justify-between gap-3 text-[13px] font-bold text-white/72">
                <span className="inline-flex items-center gap-2"><Gauge size={17} className="text-nova-blue" />Ускорение g</span>
                <span className="tabular-nums text-white">{rounded(gravity)} м/с²</span>
              </span>
              <input
                type="range"
                min="1.6"
                max="12"
                step="0.2"
                value={gravity}
                onChange={(event) => updateGravity(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-[#6558D8]"
              />
            </label>
          </fieldset>
        </div>

        <div className="grid gap-4 bg-space-950/55 p-4 sm:p-6 lg:grid-cols-[minmax(190px,.72fr)_minmax(0,1.28fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(210px,.72fr)_minmax(0,1.28fr)]">
          <div className="relative min-h-[330px] overflow-hidden rounded-card border border-white/[.1] bg-[radial-gradient(circle_at_50%_10%,rgba(141,131,244,.17),transparent_48%),linear-gradient(180deg,#111333_0%,#090A22_100%)]">
            <div className="absolute inset-x-5 top-8 h-px bg-white/20" aria-hidden="true" />
            {/* «Старт» — у линии сброса сверху: падение вертикальное, и подписи
                должны стоять там, где физически находятся старт и земля. */}
            <span className="absolute right-5 top-10 text-[10px] font-bold uppercase tracking-[.12em] text-white/64" aria-hidden="true">
              старт
            </span>
            <div className="absolute inset-x-0 bottom-8 h-2 bg-nova-pink/24 shadow-[0_0_20px_rgba(224,121,199,.24)]" aria-hidden="true" />
            <div className="absolute left-4 top-10 flex h-[245px] flex-col items-center justify-between text-nova-blue/82" aria-hidden="true">
              <ArrowsDownUp size={21} />
              <span className="rounded-full border border-white/[.12] bg-space-950/80 px-2 py-1 text-[11px] font-bold text-white/65">{height} м</span>
            </div>
            {checked ? (
              <motion.div
                key={runId}
                initial={{ top: "12%" }}
                animate={{ top: "76%" }}
                transition={{ duration: Math.min(2.6, Math.max(0.9, fallTime / 1.8)), ease: [0.33, 0.01, 0.68, 1] }}
                className="absolute left-[56%] -translate-x-1/2 text-nova-gold drop-shadow-[0_0_16px_rgba(232,182,109,.35)]"
                aria-hidden="true"
              >
                <Basketball size={42} weight="duotone" />
              </motion.div>
            ) : (
              <div className="absolute left-[56%] top-[12%] -translate-x-1/2 text-nova-gold/75" aria-hidden="true">
                <Basketball size={42} weight="duotone" />
              </div>
            )}
            <div className="absolute inset-x-5 bottom-3 flex items-center justify-end text-[10px] font-bold uppercase tracking-[.12em] text-white/64">
              <span>земля</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <PhysicsGraph
              spec={graph}
              compact
              ariaLabel={`Скорость свободного падения растёт от нуля до ${rounded(impactSpeed)} метра в секунду за ${rounded(fallTime)} секунды`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-option border border-white/[.1] bg-space-900 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/64">формула</p>
                <p className="formula-white mt-2 text-[20px] text-white"><MathText text={"$v = \\sqrt{2gh}$"} /></p>
              </div>
              <div className="rounded-option border border-white/[.1] bg-space-900 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-white/64">результат</p>
                <p className="mt-2 text-[20px] font-[800] tabular-nums text-white">{rounded(impactSpeed)} м/с</p>
                <p className="mt-1 text-[12px] text-white/52">через {rounded(fallTime)} с</p>
              </div>
            </div>

            {checked ? (
              <button
                type="button"
                onClick={() => setRunId((value) => value + 1)}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-option border border-white/[.12] px-4 text-[13px] font-bold text-white/68 transition-colors hover:border-nova-blue/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/70"
              >
                <ArrowCounterClockwise size={16} weight="bold" />
                Повторить падение
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
