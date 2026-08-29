import { cn } from "../../lib/utils";

type ProgressTone = "cyan" | "gold" | "blue" | "ember" | "neutral";

interface ProgressBarProps {
  value: number;
  tone?: ProgressTone;
  label?: string;
  className?: string;
  // Тонкая полоска для списков, обычная — для карточек.
  size?: "sm" | "md";
}

const barTone: Record<ProgressTone, string> = {
  cyan: "bg-nova-cyan",
  gold: "bg-nova-gold",
  blue: "bg-nova-blue",
  ember: "bg-nova-ember",
  neutral: "bg-white/45",
};

export function ProgressBar({
  value,
  tone = "cyan",
  label,
  className,
  size = "md",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-white/[.07]",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Прогресс"}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", barTone[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
