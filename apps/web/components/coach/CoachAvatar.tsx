"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { CoachState } from "../../lib/coach-engine";
import { cn } from "../../lib/utils";

interface CoachAvatarProps {
  state: CoachState;
  className?: string;
}

const avatarByState: Record<CoachState, string> = {
  calm: "/art/production/tutor-calm.webp",
  thinking: "/art/production/tutor-thinking.webp",
  warning: "/art/production/tutor-warning.webp",
  encouraging: "/art/production/tutor-encouraging.webp",
  surprised: "/art/production/tutor-surprised.webp",
};

export function CoachAvatar({ state, className }: CoachAvatarProps) {
  return (
    <div
      className={cn(
        "relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full border border-white/[.10] bg-space-950/70",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={avatarByState[state]}
            alt="Помощник"
            fill
            sizes="52px"
            className="object-cover object-top"
            priority={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
