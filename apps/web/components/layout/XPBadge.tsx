"use client";

import { useStore } from "@nanostores/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { $xp, $xpAward, type XPAward } from "../../lib/stores/session-store";

export function XPBadge() {
  const xp = useStore($xp);
  const award = useStore($xpAward);
  const [visibleAward, setVisibleAward] = useState<XPAward | null>(null);

  useEffect(() => {
    if (!award) {
      setVisibleAward(null);
      return;
    }

    setVisibleAward(award);
    const timeout = setTimeout(() => {
      setVisibleAward(null);
    }, 620);

    return () => clearTimeout(timeout);
  }, [award]);

  return (
    <div className="relative shrink-0">
      {visibleAward ? (
        <motion.span
          key={visibleAward.id}
          className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold text-nova-cyan"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -20, -34] }}
          transition={{ duration: 0.6, times: [0, 0.25, 1] }}
        >
          +{visibleAward.amount}
        </motion.span>
      ) : null}

      <div className="flex items-center gap-1.5 rounded-full border border-nova-gold/30 bg-nova-gold-10 px-3 py-1 text-[12px] font-semibold leading-none text-nova-gold">
        <span className="text-[10px] font-bold uppercase text-white/55">XP</span>
        <span>{xp}</span>
      </div>
    </div>
  );
}
