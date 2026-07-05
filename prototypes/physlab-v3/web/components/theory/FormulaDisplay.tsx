import { FormulaBox } from "../ui/FormulaBox";
import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { cn } from "../../lib/utils";

interface FormulaDetailsProps {
  symbols: string[];
  limitation: string;
  className?: string;
}

// Символы всегда записаны как "переменная — описание, единица":
// выделяем саму переменную, чтобы глаз цеплялся за неё, а не за весь абзац.
function SymbolRow({ symbol }: { symbol: string }) {
  const separatorIndex = symbol.indexOf(" — ");

  if (separatorIndex === -1) {
    return <MathText text={symbol} />;
  }

  const variable = symbol.slice(0, separatorIndex);
  const description = symbol.slice(separatorIndex + 3);

  return (
    <>
      <span className="physics-math mr-1.5 font-semibold text-nova-cyan/90">
        {variable}
      </span>
      <span className="text-white/72">
        <MathText text={description} />
      </span>
    </>
  );
}

// Обозначения + область применения без самой формулы — используется и в
// полной карточке (FormulaDisplay), и в свёрнутой строке справочника, где
// формула уже показана компактно в шапке и повторять её крупно незачем.
export function FormulaDetails({ symbols, limitation, className }: FormulaDetailsProps) {
  return (
    <Card
      className={cn(
        "flex flex-col gap-3 border-white/[.07] bg-space-950/40 p-4 shadow-none md:p-5",
        className,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        Обозначения
      </p>
      <ul className="divide-y divide-white/[.06] text-[13px] font-normal leading-[1.6]">
        {symbols.map((symbol) => (
          <li key={symbol} className="py-2 first:pt-0 last:pb-0">
            <SymbolRow symbol={symbol} />
          </li>
        ))}
      </ul>
      <div className="flex gap-2 rounded-option border border-white/[.08] border-l-2 border-l-nova-blue/60 bg-nova-blue/[.05] px-3.5 py-2.5 text-[12px] font-normal leading-[1.6] text-white/62">
        <span className="shrink-0 text-nova-blue/85" aria-hidden="true">
          ℹ
        </span>
        <p>
          <MathText text={limitation} />
        </p>
      </div>
    </Card>
  );
}

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
      <FormulaBox formula={formula} caption={caption} label="Формула" />
      <FormulaDetails symbols={symbols} limitation={limitation} />
    </div>
  );
}
