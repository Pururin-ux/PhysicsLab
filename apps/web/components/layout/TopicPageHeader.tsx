import Link from "next/link";
import { cn } from "../../lib/utils";

interface TopicPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  accent?: "cyan" | "gold" | "blue" | "ember";
}

const accentClasses: Record<NonNullable<TopicPageHeaderProps["accent"]>, string> = {
  cyan: "border-nova-cyan/35 bg-nova-cyan/[.07] text-nova-cyan hover:border-nova-cyan/55 hover:bg-nova-cyan/[.11]",
  gold: "border-nova-gold/35 bg-nova-gold/[.07] text-nova-gold hover:border-nova-gold/55 hover:bg-nova-gold/[.11]",
  blue: "border-nova-blue/35 bg-nova-blue/[.07] text-nova-blue hover:border-nova-blue/55 hover:bg-nova-blue/[.11]",
  ember: "border-nova-ember/35 bg-nova-ember/[.07] text-nova-ember hover:border-nova-ember/55 hover:bg-nova-ember/[.11]",
};

export function TopicPageHeader({
  eyebrow,
  title,
  description,
  accent = "cyan",
}: TopicPageHeaderProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex max-w-[760px] flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          {eyebrow}
        </p>
        <h1 className="text-[32px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          {title}
        </h1>
        <p className="max-w-[680px] text-[15px] leading-[1.7] text-white/68">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="#practice"
          className={cn(
            "inline-flex min-h-10 items-center justify-center rounded-option border px-4 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
            accentClasses[accent],
          )}
        >
          К задачам
        </Link>
        <Link
          href="#theory"
          className="inline-flex min-h-10 items-center justify-center rounded-option border border-white/[.10] bg-white/[.025] px-4 text-[13px] font-semibold text-white/68 transition-colors hover:border-white/[.18] hover:bg-white/[.045] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
        >
          Разбор темы
        </Link>
      </div>
    </section>
  );
}
