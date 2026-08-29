import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

// Пять ролей вместо «primary + всё остальное руками»: раньше золотые и
// ember-кнопки собирались из строк className на каждом вызове.
type ButtonVariant = "primary" | "secondary" | "ghost" | "gold" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-nova-cyan bg-nova-cyan text-space-950 shadow-cyan-glow hover:brightness-110",
  secondary:
    "border-line-strong bg-surface-2 text-white hover:border-white/30 hover:bg-surface-3",
  ghost:
    "border-transparent bg-transparent text-ink-base hover:bg-surface-2 hover:text-white",
  gold:
    "border-nova-gold bg-nova-gold text-space-950 shadow-gold-glow hover:brightness-110",
  danger:
    "border-nova-ember/60 bg-nova-ember-10 text-nova-ember hover:border-nova-ember hover:bg-nova-ember-20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-[13px]",
  md: "min-h-11 px-5 text-[14px]",
  // lg больше не растягивается во всю ширину: полноэкранность задаётся
  // свойством fullWidth, а не размером (раньше везде приходилось писать
  // sm:w-auto поверх).
  lg: "min-h-12 px-6 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "pl-focus inline-flex items-center justify-center gap-2 rounded-option border font-semibold",
        "transition-all duration-150 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : null,
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
