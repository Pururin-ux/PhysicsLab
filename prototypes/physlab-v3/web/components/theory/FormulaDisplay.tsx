import { FormulaBox } from "../ui/FormulaBox";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

interface FormulaDisplayProps {
  formula: string;
  caption: string;
  symbols: string[];
  limitation: string;
  className?: string;
}

export function FormulaDisplay({
  formula,
  caption,
  symbols,
  limitation,
  className,
}: FormulaDisplayProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <FormulaBox
        formula={formula}
        caption={caption}
        label="Ключевое уравнение"
      />
      <Card
        className="flex flex-col gap-3 border-white/[.07] bg-space-950/40 p-4 shadow-none md:p-5"
      >
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          Справочник
        </p>
        <ul className="divide-y divide-white/[.06] text-[13px] font-normal leading-[1.6] text-white/72">
          {symbols.map((symbol) => (
            <li key={symbol} className="py-2 first:pt-0 last:pb-0">
              {symbol}
            </li>
          ))}
        </ul>
        <p className="border-t border-white/[.08] pt-3 text-[12px] font-normal leading-[1.6] text-white/50">
          {limitation}
        </p>
      </Card>
    </div>
  );
}
