"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CoachAvatar } from "./CoachAvatar";
import type { CoachState } from "../../lib/coach-engine";
import { cn } from "../../lib/utils";

interface CoachBubbleProps {
  state: CoachState;
  text: string;
  visible: boolean;
}

const iconByState: Record<CoachState, string> = {
  calm: "🔭",
  thinking: "○",
  warning: "⚠",
  encouraging: "✦",
  surprised: "★",
};

const shellByState: Record<CoachState, string> = {
  calm: "border-white/[.10] bg-space-800/95",
  thinking: "border-white/[.10] bg-space-800/95",
  warning: "border-nova-gold/35 bg-space-800/95 shadow-gold-glow",
  encouraging: "border-nova-cyan/35 bg-space-800/95",
  surprised: "border-nova-cyan/50 bg-space-800/95 shadow-cyan-glow",
};

const iconByTone: Record<CoachState, string> = {
  calm: "border-white/[.08] bg-white/[.03] text-white/70",
  thinking: "border-white/[.08] bg-white/[.03] text-white/70",
  warning: "border-nova-gold/35 bg-nova-gold-10 text-white",
  encouraging: "border-nova-cyan/35 bg-nova-cyan-10 text-white",
  surprised: "border-nova-cyan/45 bg-nova-cyan-10 text-white",
};

const bubbleMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 18, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.2 },
  },
} as const;

export function CoachBubble({ state, text, visible }: CoachBubbleProps) {
  return (
    <AnimatePresence>
      {visible && text ? (
        <motion.aside
          role="status"
          aria-live="polite"
          className={cn(
            "pointer-events-none fixed bottom-4 left-3 right-3 z-50 max-w-[calc(100vw-24px)] rounded-card border p-3 shadow-card backdrop-blur-md",
            "sm:bottom-6 sm:left-6 sm:right-auto sm:w-[360px] sm:max-w-none",
            shellByState[state],
          )}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={bubbleMotion}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <CoachAvatar state={state} />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-badge border text-[13px] font-bold leading-none",
                    iconByTone[state],
                  )}
                >
                  {iconByState[state]}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
                  Nova
                </span>
              </div>
              <p className="text-[13px] font-normal leading-[1.7] text-white/80 sm:text-[14px]">
                {text}
              </p>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
