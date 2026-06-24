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
        "formula-cyan flex w-full max-w-full flex-col items-center justify-center gap-4 overflow-x-auto border-nova-cyan/30 bg-nova-cyan/[.065] px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.025)] md:px-8 md:py-8",
        className,
      )}
    >
      {label ? (
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-nova-cyan/65">
          {label}
        </p>
      ) : null}
      <div className="max-w-full text-[20px] font-semibold leading-none md:text-[25px]">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          children
        )}
      </div>
      {caption ? (
        <p className="max-w-[520px] text-[12px] font-normal leading-[1.6] text-white/55">
          {caption}
        </p>
      ) : null}
    </Card>
  );
}
