import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TheoryBlockProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  layout?: "grid" | "stack";
  className?: string;
}

export function TheoryBlock({
  eyebrow,
  title,
  description,
  children,
  layout = "grid",
  className,
}: TheoryBlockProps) {
  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <div className="flex max-w-[580px] flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-white/50">
          {eyebrow}
        </p>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-[800] leading-tight tracking-tight text-white">
            {title}
          </h1>
          <p className="text-[14px] font-normal leading-[1.7] text-white/70">
            {description}
          </p>
        </div>
      </div>

      <div
        className={cn(
          layout === "stack"
            ? "mx-auto flex w-full max-w-[820px] flex-col gap-6 md:gap-8"
            : "grid gap-5 lg:grid-cols-2",
        )}
      >
        {children}
      </div>
    </section>
  );
}
