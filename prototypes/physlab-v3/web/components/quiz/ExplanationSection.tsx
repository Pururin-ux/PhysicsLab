"use client";

import { motion } from "framer-motion";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { Card } from "../ui/Card";

interface ExplanationSectionProps {
  explanation: string;
  explanationLatex?: string;
  trap: string;
}

export function ExplanationSection({
  explanation,
  explanationLatex,
  trap,
}: ExplanationSectionProps) {
  const formulaHtml = explanationLatex
    ? renderFormulaToHtml(explanationLatex, { displayMode: false })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card variant="elevated" className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          Разбор
        </p>
        {formulaHtml ? (
          <div
            className="formula-white text-[14px] font-normal leading-[1.7] text-white/80"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
        ) : (
          <p className="text-[14px] font-normal leading-[1.7] text-white/80">
            {explanation}
          </p>
        )}
        <div className="rounded-option border border-nova-gold/40 bg-nova-gold-10 px-4 py-3 text-[13px] font-normal leading-[1.6] text-white/75">
          <span className="mr-2 text-[11px] font-bold uppercase tracking-[.12em] text-nova-gold">
            Ловушка ЦТ
          </span>
          <span>{trap}</span>
        </div>
      </Card>
    </motion.div>
  );
}
