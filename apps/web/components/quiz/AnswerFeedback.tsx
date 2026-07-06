"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import type { CoachState } from "../../lib/coach-engine";
import { CoachAvatar } from "../coach/CoachAvatar";
import { useTypewriter } from "../coach/useTypewriter";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  // Один голос: реплика Nova — заголовок карточки, а не отдельный бабл.
  novaState: CoachState;
  novaText: string;
  explanation: string;
  explanationLatex?: string;
}

// После ответа — одна поверхность, без мета-советов и рефлексивной воды:
// 1) якорь: статус + реплика Nova (единственная фокусная точка);
// 2) разбор — это сама подстановка в формулу, ничего лишнего. На ошибке
//    открыт сразу (он короткий), на верном ответе свёрнут.
export function AnswerFeedback({
  isCorrect,
  novaState,
  novaText,
  explanation,
  explanationLatex,
}: AnswerFeedbackProps) {
  const [open, setOpen] = useState(!isCorrect);
  const panelId = useId();
  const { output, done } = useTypewriter(novaText);

  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;

  const statusLabel = isCorrect ? "Верно" : "Не совсем";
  const accentText = isCorrect ? "text-nova-cyan" : "text-nova-gold";
  const accentBorder = isCorrect ? "border-l-nova-cyan/60" : "border-l-nova-gold/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="elevated" className={cn("flex flex-col gap-3 border-l-2", accentBorder)}>
        {/* Якорь: одна реплика Nova с её лицом */}
        <div className="flex items-start gap-3">
          <CoachAvatar state={novaState} className="h-11 w-11" />
          <div className="min-w-0 flex-1">
            <p className={cn("text-[13px] font-bold leading-none", accentText)}>{statusLabel}</p>
            <p
              role="status"
              aria-live="polite"
              className="mt-1.5 text-[14px] font-medium leading-[1.6] text-white/85"
            >
              <MathText text={output} />
              {!done ? <span className="nova-caret" aria-hidden="true" /> : null}
            </p>
          </div>
        </div>

        <div className="border-t border-white/[.08] pt-0.5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 py-2 text-left transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50"
          >
            <span className="text-[13px] font-semibold text-white/78">
              {open ? "Свернуть решение" : "Показать решение"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "h-4 w-4 shrink-0 text-white/40 transition-transform",
                open ? "rotate-90" : "",
              )}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {open ? (
            <div id={panelId} className="flex flex-col gap-3 pb-1 pt-1">
              <p className="text-[14px] leading-[1.75] text-white/82">
                <MathText text={explanation} />
              </p>

              {formulaHtml ? (
                <div
                  data-testid="solution-formula"
                  className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-4 py-3 text-center text-[15px] font-medium leading-[1.7]"
                  dangerouslySetInnerHTML={{ __html: formulaHtml }}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
