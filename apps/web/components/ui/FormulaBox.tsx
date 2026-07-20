import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { MathText } from "./MathText";

interface FormulaBoxProps {
  children?: ReactNode;
  formula?: string;
  caption?: string;
  label?: string;
  className?: string;
  surface?: "dark" | "paper" | "lesson";
}

export function FormulaBox({
  children,
  formula,
  caption,
  label,
  className,
  surface = "dark",
}: FormulaBoxProps) {
  const html = formula
    ? renderFormulaToHtml(formula, { displayMode: true })
    : null;

  if (surface === "paper") {
    return (
      <div
        className={cn(
          "formula-paper flex w-full max-w-full flex-col items-start justify-center gap-3 overflow-x-auto rounded-[3px] px-5 py-5 text-left md:px-7 md:py-6",
          className,
        )}
      >
        {label ? (
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#665875]">
            {label}
          </p>
        ) : null}
        <div className="max-w-full text-[20px] font-medium leading-none text-[#2b2438] md:text-[25px]">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            children
          )}
        </div>
        {caption ? (
          <p className="max-w-[560px] text-[12px] font-normal leading-[1.6] text-[#5b5068]">
            <MathText text={caption} />
          </p>
        ) : null}
      </div>
    );
  }

  if (surface === "lesson") {
    return (
      <div
        className={cn(
          "formula-white relative isolate flex w-full max-w-full flex-col items-start justify-center gap-3 overflow-x-auto rounded-[10px] border border-[#c482b8]/28 bg-[linear-gradient(138deg,#2a193f_0%,#191733_52%,#10142d_100%)] px-5 py-5 text-left shadow-[0_18px_42px_rgba(3,4,22,.24)] md:px-7 md:py-6",
          className,
        )}
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/art/production/paper-texture.webp')] bg-[length:520px_auto] opacity-[.055] mix-blend-screen" aria-hidden="true" />
        {label ? (
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#e6b8d8]">
            {label}
          </p>
        ) : null}
        <div className="max-w-full text-[20px] font-medium leading-none text-white md:text-[25px]">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            children
          )}
        </div>
        {caption ? (
          <p className="max-w-[560px] text-[12px] font-normal leading-[1.6] text-white/58">
            <MathText text={caption} />
          </p>
        ) : null}
      </div>
    );
  }

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
          <MathText text={caption} />
        </p>
      ) : null}
    </Card>
  );
}
