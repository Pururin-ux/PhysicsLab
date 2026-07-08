import { Button } from "../ui/Button";

interface PracticeQuickBarProps {
  onOpenHelp?: () => void;
  helpOpen?: boolean;
}

export function PracticeQuickBar({ onOpenHelp, helpOpen = false }: PracticeQuickBarProps) {
  return (
    <div
      className="mx-auto grid w-full max-w-[580px] grid-cols-2 gap-2 rounded-card border border-white/[.08] bg-white/[.025] p-1"
      aria-label="Быстрые действия по теме"
    >
      <Button
        type="button"
        size="sm"
        data-testid="practice-tab-tasks"
        className="h-10 w-full px-2 text-[12px] sm:text-[13px]"
        aria-current="true"
      >
        Задачи
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        data-testid="practice-open-help"
        onClick={onOpenHelp}
        aria-controls="theory"
        aria-expanded={helpOpen}
        className="h-10 w-full px-2 text-[12px] sm:text-[13px]"
      >
        Справка
      </Button>
    </div>
  );
}
