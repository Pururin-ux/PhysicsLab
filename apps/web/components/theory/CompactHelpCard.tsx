import { Card } from "../ui/Card";
import { MathText } from "../ui/MathText";
import { renderFormulaToHtml } from "../../lib/formula-rendering";
import { cn } from "../../lib/utils";

interface CompactHelpCardProps {
  title: string;
  body: string;
  formula?: string;
  trap?: string;
  accent?: "cyan" | "gold" | "blue" | "ember";
}

const accentClasses: Record<NonNullable<CompactHelpCardProps["accent"]>, string> = {
  cyan: "border-l-nova-cyan/55 text-nova-cyan",
  gold: "border-l-nova-gold/55 text-nova-gold",
  blue: "border-l-nova-blue/55 text-nova-blue",
  ember: "border-l-nova-ember/55 text-nova-ember",
};

export function CompactHelpCard({
  title,
  body,
  formula,
  trap,
  accent = "cyan",
}: CompactHelpCardProps) {
  const formulaHtml = formula
    ? renderFormulaToHtml(formula, { displayMode: false })
    : null;

  return (
    <Card
      variant="elevated"
      className={cn("flex flex-col gap-3 border-l-2", accentClasses[accent])}
    >
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        Справка
      </p>
      <h3 className="text-[19px] font-[800] leading-tight text-white">{title}</h3>
      <p className="text-[14px] leading-[1.7] text-white/78">
        <MathText text={body} />
      </p>
      {formulaHtml ? (
        <div
          className="formula-white rounded-option border border-white/[.09] bg-white/[.035] px-4 py-3 text-center text-[15px] font-medium leading-[1.7]"
          dangerouslySetInnerHTML={{ __html: formulaHtml }}
        />
      ) : null}
      {trap ? (
        <p className="rounded-option border border-white/[.08] bg-white/[.025] px-3 py-2 text-[13px] leading-[1.6] text-white/62">
          <MathText text={trap} />
        </p>
      ) : null}
    </Card>
  );
}
