import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type InlinePhysicsProps = {
  children: ReactNode;
  className?: string;
};

export function InlinePhysics({ children, className }: InlinePhysicsProps) {
  return (
    <span className={cn("physics-math whitespace-nowrap text-current", className)}>
      {children}
    </span>
  );
}
