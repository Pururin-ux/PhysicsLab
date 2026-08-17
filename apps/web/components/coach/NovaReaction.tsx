"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { CoachState } from "../../lib/coach-engine";
import { cn } from "../../lib/utils";
import { MathText } from "../ui/MathText";
import { useTypewriter } from "./useTypewriter";

interface NovaReactionProps {
  state: CoachState;
  text: string;
  visible: boolean;
}

const bustByState: Record<CoachState, string> = {
  calm: "/mascot/nova-calm.png",
  thinking: "/mascot/nova-thinking.png",
  warning: "/mascot/nova-warning.png",
  encouraging: "/mascot/nova-encouraging.png",
  surprised: "/mascot/nova-surprised.png",
};

// Тёплый золотой тон — для предупреждений/ошибок, иначе фирменный cyan.
const isWarm = (state: CoachState) => state === "warning";

const ringByState: Record<CoachState, string> = {
  calm: "ring-nova-cyan/45 shadow-cyan-glow",
  thinking: "ring-nova-blue/50 shadow-cyan-glow",
  warning: "ring-nova-gold/50 shadow-gold-glow",
  encouraging: "ring-nova-cyan/55 shadow-cyan-glow",
  surprised: "ring-nova-cyan/60 shadow-cyan-glow",
};

// Компактная реплика Nova «во весь бюст»: она буквально заглядывает рядом с
// вариантами ответа (эффект присутствия), но занимает мало высоты и остаётся
// на экране, пока ученик не нажмёт «Дальше» — прочитать успевает.
export function NovaReaction({ state, text, visible }: NovaReactionProps) {
  const { output, done } = useTypewriter(text);
  const warm = isWarm(state);

  return (
    <AnimatePresence>
      {visible && text ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.16 } }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className={cn(
            "relative flex items-end gap-3 rounded-card border p-3 backdrop-blur-sm sm:gap-4 sm:p-4",
            warm
              ? "border-nova-gold/30 bg-nova-gold/[.06]"
              : "border-nova-cyan/25 bg-nova-cyan/[.05]",
          )}
        >
          <div
            className={cn(
              "nova-character-float relative h-[72px] w-[72px] shrink-0 self-end overflow-hidden rounded-full bg-space-950/70 ring-2 sm:h-[88px] sm:w-[88px]",
              ringByState[state],
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={state}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={bustByState[state]}
                  alt="Nova"
                  fill
                  sizes="88px"
                  className="object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="nova-bubble-light relative min-w-0 flex-1 self-center rounded-[16px] border border-white/10 bg-gradient-to-b from-white to-[#eaf6fb] px-4 py-3 text-space-950 shadow-[0_14px_36px_rgba(0,0,0,.4)]">
            {/* хвостик бабла указывает на Nova */}
            <span
              aria-hidden="true"
              className="absolute -left-1.5 bottom-4 h-3.5 w-3.5 rotate-45 border-b border-l border-white/10 bg-[#eaf6fb]"
            />
            <div className="mb-1 flex items-center gap-2">
              <span
                className={cn(
                  "text-[11px] font-[800]",
                  warm ? "text-[#a9791b]" : "text-[#0089b3]",
                )}
              >
                Nova
              </span>
              <span className="rounded-[5px] bg-space-950/[.08] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[.12em] text-space-950/45">
                коуч по физике
              </span>
            </div>
            <p className="text-[13px] font-semibold leading-[1.55] text-space-950 sm:text-[14px]">
              <MathText text={output} />
              {!done ? <span className="nova-caret" aria-hidden="true" /> : null}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
