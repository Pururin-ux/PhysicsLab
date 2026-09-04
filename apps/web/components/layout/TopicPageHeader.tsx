import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface TopicPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  learnHref?: string;
  learnLabel?: string;
  // Приходит со страниц глав; шапка сейчас без акцентной кнопки, но проп
  // оставлен, чтобы не править все страницы и вернуть акцент при желании.
  accent?: "cyan" | "gold" | "blue" | "ember";
}

export function TopicPageHeader({
  eyebrow,
  title,
  description,
  learnHref,
  learnLabel = "Сначала разобраться в теме",
}: TopicPageHeaderProps) {
  return (
    <section className="flex min-w-0 flex-col gap-1.5">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">
        {eyebrow}
      </p>
      <h1 className="text-[30px] font-[800] leading-tight tracking-tight text-white sm:text-[36px]">
        {title}
      </h1>
      <p className="max-w-[620px] text-[14px] leading-[1.65] text-white/68 sm:text-[15px]">
        {description}
      </p>
      {learnHref ? (
        <Link
          href={learnHref}
          className="mt-1 inline-flex min-h-9 w-fit items-center gap-2 text-[13px] font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/55"
        >
          {learnLabel}
          <ArrowRight size={15} weight="bold" aria-hidden="true" />
        </Link>
      ) : null}
    </section>
  );
}
