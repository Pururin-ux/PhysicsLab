"use client";

import { motion } from "framer-motion";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { Card } from "../ui/Card";

interface ExplanationSectionProps {
  explanation: string;
  explanationLatex?: string;
  trap: string;
  isCorrect: boolean;
}

export function ExplanationSection({
  explanation,
  explanationLatex,
  trap,
  isCorrect,
}: ExplanationSectionProps) {
  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;
  const statusLabel = isCorrect ? "Верно" : "Не совсем";
  const trapLabel = isCorrect ? "На что обратить внимание" : "Частая ошибка";
  const trapText = trap.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="elevated" className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <p
            className={`text-[14px] font-semibold leading-none ${
              isCorrect ? "text-nova-cyan" : "text-nova-gold"
            }`}
          >
            {statusLabel}
          </p>
        </div>

        <p className="text-[14px] font-normal leading-[1.75] text-white/80">
          {explanation}
        </p>

        {formulaHtml ? (
          <div
            data-testid="solution-formula"
            className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-4 py-3 text-center text-[15px] font-medium leading-[1.7] shadow-[inset_0_1px_0_rgba(255,255,255,.025)]"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
        ) : null}

        {trapText ? (
          <div className="border-t border-white/[.08] pt-3 text-[13px] font-normal leading-[1.65] text-white/72">
            <p
              className={`mb-1 text-[12px] font-semibold leading-none ${
                isCorrect ? "text-white/58" : "text-nova-gold/85"
              }`}
            >
              {trapLabel}
            </p>
            <p>{trapText}</p>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}
