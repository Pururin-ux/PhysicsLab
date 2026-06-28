import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";
import { renderFormulaToHtml } from "../../lib/formula-rendering";

interface FormulaBoxProps {
  children?: ReactNode;
  formula?: string;
  caption?: string;
  label?: string;
  className?: string;
}

export function FormulaBox({
  children,
  formula,
  caption,
  label,
  className,
}: FormulaBoxProps) {
  const html = formula
    ? renderFormulaToHtml(formula, { displayMode: true })
    : null;

  return (
    <Card
      variant="formula"
      className={cn(
        "formula-white flex w-full max-w-full flex-col items-center justify-center gap-3 overflow-x-auto border-white/[.09] bg-white/[.035] px-5 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.03)] md:px-7 md:py-6",
        className,
      )}
    >
      {label ? (
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/52">
          {label}
        </p>
      ) : null}
      <div className="max-w-full text-[19px] font-medium leading-none md:text-[23px]">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          children
        )}
      </div>
      {caption ? (
        <p className="max-w-[520px] text-[12px] font-normal leading-[1.6] text-white/58">
          {caption}
        </p>
      ) : null}
    </Card>
  );
}
