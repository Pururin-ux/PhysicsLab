interface TopicPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  // Приходит со страниц глав; шапка сейчас без акцентной кнопки, но проп
  // оставлен, чтобы не править все страницы и вернуть акцент при желании.
  accent?: "cyan" | "gold" | "blue" | "ember";
}

export function TopicPageHeader({
  eyebrow,
  title,
  description,
}: TopicPageHeaderProps) {
  return (
    <section className="flex min-w-0 flex-col gap-2">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
        {eyebrow}
      </p>
      <h1 className="text-[32px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
        {title}
      </h1>
      <p className="max-w-[680px] text-[15px] leading-[1.7] text-white/68">
        {description}
      </p>
    </section>
  );
}
