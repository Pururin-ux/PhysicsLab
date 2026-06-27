"use client";

import { motion } from "framer-motion";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { Card } from "../ui/Card";

interface ExplanationSectionProps {
  explanation: string;
  explanationLatex?: string;
  trap: string;
  pedagogyMode?: "learn" | "practice" | "exam";
  isCorrect: boolean;
}

export function ExplanationSection({
  explanation,
  explanationLatex,
  trap,
  pedagogyMode = "practice",
  isCorrect,
}: ExplanationSectionProps) {
  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;
  const heading = "Разбор";
  const lead =
    pedagogyMode === "learn" && !isCorrect
      ? "Посмотри, где сбился. Обычно ошибка в первом шаге."
      : pedagogyMode === "exam"
        ? "Сравни с коротким решением."
        : isCorrect
          ? "Проверь решение и запомни короткий ход."
          : "Проверь первый шаг и вычисление.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="elevated" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
            {heading}
          </p>
          <p className="text-[12px] leading-[1.6] text-white/55">{lead}</p>
        </div>

        <p className="text-[14px] font-normal leading-[1.75] text-white/80">
          {explanation}
        </p>

        {formulaHtml ? (
          <div
            data-testid="solution-formula"
            className="formula-cyan rounded-option border border-nova-cyan/20 bg-nova-cyan-05 px-4 py-4 text-center text-[15px] font-semibold leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
        ) : null}

        <div className="rounded-option border border-white/[.09] border-l-2 border-l-nova-gold/70 bg-nova-gold/[.04] px-4 py-3 text-[13px] font-normal leading-[1.6] text-white/75">
          <span className="mr-2 text-[11px] font-bold uppercase tracking-[.12em] text-nova-gold">
            {isCorrect ? "Частая ошибка" : "Проверь вот это"}
          </span>
          <span>{trap}</span>
        </div>
      </Card>
    </motion.div>
  );
}
