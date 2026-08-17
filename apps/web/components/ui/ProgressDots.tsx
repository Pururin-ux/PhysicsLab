import { cn } from "../../lib/utils";

interface ProgressDotsProps {
  total?: number;
  currentStep?: number;
  completed?: number;
  className?: string;
}

export function ProgressDots({
  total = 10,
  currentStep = 0,
  completed = 0,
  className,
}: ProgressDotsProps) {
  const dots = Array.from({ length: total }, (_, index) => {
    const step = index + 1;
    const isCompleted = step <= completed;
    const isCurrent = currentStep === step;

    return (
      <span
        key={step}
        role="listitem"
        aria-label={`Задача ${step}`}
        title={`Задача ${step}`}
        className={cn(
          "h-2.5 w-2.5 rounded-full border transition-colors",
          isCompleted
            ? "border-nova-cyan bg-nova-cyan shadow-cyan-glow"
            : "border-white/25 bg-white/[.03]",
          isCurrent && !isCompleted
            ? "border-nova-blue bg-nova-blue/20"
            : null,
        )}
      />
    );
  });

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="list"
      aria-label={`Прогресс: ${completed} из ${total}`}
      title={`Прогресс задач: ${completed} из ${total}`}
    >
      {dots}
    </div>
  );
}
