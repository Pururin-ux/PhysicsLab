import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
}

// Один компонент на все «шапки» секций: одинаковый ритм, одинаковый отступ
// между надзаголовком, заголовком, описанием и действиями справа.
export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  id,
  as: Tag = "h2",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        {eyebrow ? <p className="pl-eyebrow">{eyebrow}</p> : null}
        <Tag
          id={id}
          className={cn(
            Tag === "h1" ? "pl-h1" : "pl-h2",
            titleClassName,
          )}
        >
          {title}
        </Tag>
        {description ? (
          <p className="pl-body pl-measure mt-0.5 text-[14px]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
