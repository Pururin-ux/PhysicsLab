import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";
import { renderFormulaToHtml } from "../../lib/formula-rendering";

interface FormulaBoxProps {
  children?: ReactNode;
  formula?: string;
  caption?: string;
  className?: string;
}

export function FormulaBox({
  children,
  formula,
  caption,
  className,
}: FormulaBoxProps) {
  const html = formula
    ? renderFormulaToHtml(formula, { displayMode: true })
    : null;

  return (
    <Card
      variant="formula"
      className={cn(
        "formula-cyan flex w-full max-w-full flex-col items-center justify-center gap-3 overflow-x-auto px-3 py-4 text-center md:px-4 md:py-5",
        className,
      )}
    >
      <div className="max-w-full text-[16px] font-semibold leading-none md:text-[18px]">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          children
        )}
      </div>
      {caption ? (
        <p className="text-[12px] font-normal leading-[1.6] text-white/50">
          {caption}
        </p>
      ) : null}
    </Card>
  );
}
