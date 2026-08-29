import type { ReactNode } from "react";
import { Card } from "./Card";

interface EmptyStateProps {
  title: string;
  body: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, body, action, icon }: EmptyStateProps) {
  return (
    <Card padding="lg" className="flex flex-col items-start gap-3 text-left">
      {icon ? (
        <span className="grid h-11 w-11 place-items-center rounded-option border border-nova-cyan/25 bg-nova-cyan/[.08] text-nova-cyan">
          {icon}
        </span>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <h3 className="pl-h3">{title}</h3>
        <p className="text-[14px] leading-[1.7] text-ink-muted max-w-[54ch]">{body}</p>
      </div>
      {action}
    </Card>
  );
}
