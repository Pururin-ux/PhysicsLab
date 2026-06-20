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
      <FormulaBox formula={formula} caption={caption} />
      <Card variant="elevated" className="flex flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          Обозначения
        </p>
        <ul className="space-y-2 text-[13px] font-normal leading-[1.6] text-white/75">
          {symbols.map((symbol) => (
            <li key={symbol}>{symbol}</li>
          ))}
        </ul>
        <p className="border-t border-white/[.08] pt-3 text-[12px] font-normal leading-[1.6] text-white/50">
          {limitation}
        </p>
      </Card>
    </div>
  );
}
