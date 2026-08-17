"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { CoachState } from "../../lib/coach-engine";
import { cn } from "../../lib/utils";

interface CoachAvatarProps {
  state: CoachState;
  className?: string;
}

const avatarByState: Record<CoachState, string> = {
  calm: "/mascot/nova-calm.png",
  thinking: "/mascot/nova-thinking.png",
  warning: "/mascot/nova-warning.png",
  encouraging: "/mascot/nova-encouraging.png",
  surprised: "/mascot/nova-surprised.png",
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
            alt="Nova"
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-cover object-top"
            priority={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
