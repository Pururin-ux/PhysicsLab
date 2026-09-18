import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "md" | "sm" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Основное действие выделяется цветом и контрастом, а не большой неоновой
  // подушкой: тень маленькая и направленная. Детали (градиент, блик) —
  // в globals.css, класс physics-btn-primary.
  primary:
    "physics-btn-primary border-transparent text-[var(--action-ink)] hover:bg-[var(--action-hover)] disabled:hover:bg-[var(--action-primary)]",
  ghost:
    "physics-btn-ghost text-[var(--text-primary)]/82 hover:text-[var(--text-primary)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[14px]",
  sm: "h-9 px-3.5 text-[13px]",
  lg: "min-h-12 w-full px-6 py-3 text-center text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-option border font-bold transition-colors",
        "transition-all duration-150 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-blue/65 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
