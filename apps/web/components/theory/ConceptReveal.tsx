"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ModelVisual } from "./ModelVisual";
import { FormulaDisplay } from "./FormulaDisplay";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";
import type { GraphConfig } from "../../lib/physics/graph-data";
import type { FormulaSymbol } from "../../lib/physics/formula-symbol";

interface ConceptRevealProps {
  graph: GraphConfig;
  title: string;
  modelText: string;
  meaningText: string;
  trap: string;
  formula: string;
  formulaCaption: string;
  symbols: FormulaSymbol[];
  limitation: string;
  // Левая полоса карточки "Главное" — совпадает с акцентным цветом главы,
  // чтобы темы визуально не сливались друг с другом.
  accentClass?: string;
}

export function ConceptReveal({
  graph,
  title,
  modelText,
  meaningText,
  trap,
  formula,
  formulaCaption,
  symbols,
  limitation,
  accentClass = "border-l-nova-cyan/55",
}: ConceptRevealProps) {
  const [step, setStep] = useState(0);
  const cta =
    step === 0
      ? "Дальше"
      : step === 1
        ? "Показать формулу"
        : null;

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <ModelVisual config={graph} title={title} caption={modelText} />

      <AnimatePresence initial={false}>
        {step >= 1 ? (
          <motion.div
            key="meaning"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24 }}
          >
            <Card variant="elevated" className={cn("flex flex-col gap-3 border-l-2", accentClass)}>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
                Главное
              </p>
              <p className="text-[14px] font-normal leading-[1.7] text-white/80">
                <MathText text={meaningText} />
              </p>
              <div className="rounded-option border border-nova-gold/25 bg-nova-gold-10 px-4 py-3 text-[13px] font-normal leading-[1.6] text-white/75">
                <span className="mr-1.5 text-nova-gold" aria-hidden="true">
                  ⚠
                </span>
                <MathText text={trap} />
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {step >= 2 ? (
          <motion.div
            key="formula"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24 }}
          >
            <FormulaDisplay
              formula={formula}
              caption={formulaCaption}
              symbols={symbols}
              limitation={limitation}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {cta ? (
        <Button
          type="button"
          variant="ghost"
          className="self-start"
          onClick={() => setStep((current) => Math.min(current + 1, 2))}
        >
          {cta}
        </Button>
      ) : null}
    </article>
  );
}
