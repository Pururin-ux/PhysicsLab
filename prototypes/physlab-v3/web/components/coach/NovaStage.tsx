"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { CoachState } from "../../lib/coach-engine";
import { cn } from "../../lib/utils";
import { MathText } from "../ui/MathText";
import { useTypewriter } from "./useTypewriter";

interface NovaStageProps {
  state: CoachState;
  text?: string;
  size?: number;
  showBubble?: boolean;
  showOrbit?: boolean;
  priority?: boolean;
  className?: string;
}

const mascotByState: Record<CoachState, string> = {
  calm: "/mascot-anime/calm.png",
  thinking: "/mascot-anime/thinking.png",
  warning: "/mascot-anime/warning.png",
  encouraging: "/mascot-anime/encouraging.png",
  surprised: "/mascot-anime/surprised.png",
};

const auraByState: Record<CoachState, string> = {
  calm: "rgba(0,224,255,0.24)",
  thinking: "rgba(45,156,255,0.26)",
  warning: "rgba(212,175,55,0.28)",
  encouraging: "rgba(0,224,255,0.3)",
  surprised: "rgba(0,224,255,0.36)",
};

const orbitByState: Record<CoachState, string> = {
  calm: "rgba(0,224,255,0.42)",
  thinking: "rgba(45,156,255,0.44)",
  warning: "rgba(212,175,55,0.44)",
  encouraging: "rgba(0,224,255,0.5)",
  surprised: "rgba(0,224,255,0.55)",
};

const orbitLayers = [
  { size: 1.08, tilt: -18, duration: "7s", y: "45%" },
  { size: 1.0, tilt: 28, duration: "9.5s", y: "45%" },
  { size: 0.94, tilt: 112, duration: "12s", y: "43%" },
] as const;

export function NovaStage({
  state,
  text = "",
  size = 280,
  showBubble = true,
  showOrbit = true,
  priority = false,
  className,
}: NovaStageProps) {
  const { output, done } = useTypewriter(text);
  const hasBubble = showBubble && text.length > 0;

  return (
    <div className={cn("flex w-full flex-col items-center gap-3", className)}>
      {hasBubble ? (
        <div
          role="status"
          aria-live="polite"
          className="nova-bubble-light relative z-20 w-full max-w-[340px] rounded-[18px] border border-nova-cyan/20 bg-gradient-to-b from-white to-[#eaf6fb] px-4 py-3 text-space-950 shadow-[0_18px_44px_rgba(0,0,0,.42)]"
        >
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-12 h-4 w-4 rotate-45 bg-[#eaf6fb]"
          />
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[11px] font-[800] text-[#0089b3]">Nova</span>
            <span className="rounded-[5px] bg-[#0089b3]/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[.12em] text-space-950/45">
              коуч по физике
            </span>
          </div>
          <p className="min-h-[22px] text-[13px] font-semibold leading-[1.55] text-space-950 sm:text-[14px]">
            <MathText text={output} />
            {!done ? <span className="nova-caret" aria-hidden="true" /> : null}
          </p>
        </div>
      ) : null}

      <div
        className="nova-stage relative isolate max-w-full overflow-visible"
        style={{ width: size, maxWidth: "100%", aspectRatio: "0.82 / 1" }}
        aria-hidden="true"
      >
        {showOrbit ? (
          <div
            className="nova-aura"
            style={{
              background: `radial-gradient(circle, ${auraByState[state]} 0%, rgba(45,156,255,0.08) 42%, transparent 70%)`,
            }}
          />
        ) : null}

        {showOrbit
          ? orbitLayers.map((orbit, index) => (
              <div
                key={index}
                className="nova-orbit"
                style={{
                  top: orbit.y,
                  height: "56%",
                  transform: `translateY(-50%) rotate(${orbit.tilt}deg) scaleY(.34)`,
                }}
              >
                <div
                  className="nova-orbit-spin"
                  style={{
                    width: `${orbit.size * 100}%`,
                    height: `${orbit.size * 100}%`,
                    animationDuration: orbit.duration,
                  }}
                >
                  <span
                    className="nova-orbit-ring"
                    style={{ borderColor: orbitByState[state] }}
                  />
                  <span
                    className="nova-electron"
                    style={{
                      background: index === 2 ? "rgba(212,175,55,.9)" : orbitByState[state],
                      boxShadow: `0 0 10px ${index === 2 ? "rgba(212,175,55,.85)" : orbitByState[state]}`,
                    }}
                  />
                </div>
              </div>
            ))
          : null}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={state}
            className="nova-character-float absolute inset-0 z-10"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.28 }}
          >
            <Image
              src={mascotByState[state]}
              alt=""
              fill
              sizes={`${size}px`}
              className="object-contain object-bottom drop-shadow-[0_20px_32px_rgba(0,0,0,.55)]"
              priority={priority}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <span
        aria-hidden="true"
        className="nova-shadow h-5 w-[44%] max-w-[170px] rounded-full bg-[radial-gradient(ellipse,rgba(0,150,190,.48),transparent_70%)]"
      />
    </div>
  );
}
