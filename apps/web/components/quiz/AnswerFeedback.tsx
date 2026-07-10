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
import type { HelpTarget } from "../../lib/learning/topic-help";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  // Один голос: реплика Nova — заголовок карточки, а не отдельный бабл.
  novaState: CoachState;
  novaText: string;
  explanation: string;
  explanationLatex?: string;
  helpTarget?: HelpTarget;
  onOpenHelp?: () => void;
  // Для numeric-задач: правильный ответ с единицей показываем сразу, не пряча
  // за разворотом решения (для single_choice верный вариант виден в списке).
  correctAnswer?: string;
}

// После ответа — compact-first поверхность:
// 1) статус + короткая реплика Nova остаются видимыми сразу;
// 2) полный разбор и формула открываются только по запросу.
export function AnswerFeedback({
  isCorrect,
  novaState,
  novaText,
  explanation,
  explanationLatex,
  helpTarget,
  onOpenHelp,
  correctAnswer,
}: AnswerFeedbackProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { output, done } = useTypewriter(novaText);

  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;

  const statusLabel = isCorrect ? "Верно" : "Не совсем";
  const normalizedNovaText = novaText.trim();
  const accessibleStatusText = normalizedNovaText
    .toLocaleLowerCase("ru")
    .startsWith(statusLabel.toLocaleLowerCase("ru"))
    ? normalizedNovaText
    : `${statusLabel}. ${normalizedNovaText}`;
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
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {accessibleStatusText}
            </p>
            <p
              aria-hidden="true"
              className={cn("text-[13px] font-bold leading-none", accentText)}
            >
              {statusLabel}
            </p>
            <p
              aria-hidden="true"
              className="mt-1.5 text-[14px] font-medium leading-[1.6] text-white/85"
            >
              <MathText text={output} />
              {!done ? <span className="nova-caret" aria-hidden="true" /> : null}
            </p>
          </div>
        </div>

        {correctAnswer ? (
          <div
            data-testid="numeric-correct-answer"
            className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-2 text-[13px] text-white/72"
          >
            Правильный ответ:{" "}
            <span className="physics-number font-semibold text-white">{correctAnswer}</span>
          </div>
        ) : null}

        <div className="border-t border-white/[.08] pt-0.5">
          {!isCorrect && helpTarget && onOpenHelp ? (
            <button
              type="button"
              data-testid="help-target-button"
              onClick={onOpenHelp}
              className="mb-1 flex w-full items-center justify-between gap-3 rounded-option border border-white/[.08] bg-white/[.025] px-3 py-2 text-left text-[13px] font-semibold text-white/70 transition-colors hover:border-nova-cyan/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/50"
            >
              <span>
                Открыть справку: <span className="text-nova-cyan">{helpTarget.label}</span>
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-white/42"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </button>
          ) : null}

          <button
            type="button"
            data-testid="solution-toggle"
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
