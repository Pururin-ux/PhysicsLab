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
    <section className="flex min-w-0 flex-col gap-2.5">
      <p className="pl-eyebrow">{eyebrow}</p>
      <h1 className="pl-h1 max-w-[22ch]">{title}</h1>
      <p className="pl-body pl-measure text-[15px]">{description}</p>
    </section>
  );
}
