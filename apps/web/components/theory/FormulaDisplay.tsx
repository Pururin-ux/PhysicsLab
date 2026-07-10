import { FormulaBox } from "../ui/FormulaBox";
import { MathText } from "../ui/MathText";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import type { FormulaSymbol } from "../../lib/physics/formula-symbol";
import { cn } from "../../lib/utils";

interface FormulaDetailsProps {
  symbols: FormulaSymbol[];
  limitation: string;
  className?: string;
}

function SymbolRow({ symbol }: { symbol: FormulaSymbol }) {
  return (
    <div className="grid grid-cols-[minmax(64px,max-content)_1fr] items-baseline gap-3">
      <span
        className="formula-cyan min-w-0 text-[15px] font-semibold"
        dangerouslySetInnerHTML={{ __html: renderFormulaToHtml(symbol.latex) }}
      />
      <span className="min-w-0 text-white/72">
        <MathText text={symbol.description} />
      </span>
    </div>
  );
}

// Обозначения + область применения без самой формулы — используется и в
// полной карточке (FormulaDisplay), и в свёрнутой строке справочника, где
// формула уже показана компактно в шапке и повторять её крупно незачем.
export function FormulaDetails({
  symbols,
  limitation,
  className,
}: FormulaDetailsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-white/[.07] pt-4",
        className,
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        Обозначения
      </p>
      <ul className="divide-y divide-white/[.06] text-[13px] font-normal leading-[1.6]">
        {symbols.map((symbol) => (
          <li
            key={`${symbol.latex}-${symbol.description}`}
            className="py-2 first:pt-0 last:pb-0"
          >
            <SymbolRow symbol={symbol} />
          </li>
        ))}
      </ul>
      <div className="flex gap-2 rounded-option border border-white/[.08] border-l-2 border-l-nova-blue/60 bg-nova-blue/[.05] px-3.5 py-2.5 text-[12px] font-normal leading-[1.6] text-white/62">
        <p className="shrink-0 font-bold uppercase tracking-[.08em] text-nova-blue/85">
          Условие
        </p>
        <p className="min-w-0">
          <MathText text={limitation} />
        </p>
      </div>
    </div>
  );
}

interface FormulaDisplayProps {
  formula: string;
  caption: string;
  symbols: FormulaSymbol[];
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
