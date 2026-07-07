import Link from "next/link";
import { Button } from "../ui/Button";

export function PracticeQuickBar() {
  return (
    <div
      className="mx-auto grid w-full max-w-[580px] grid-cols-2 gap-2 rounded-card border border-white/[.08] bg-white/[.025] p-1"
      aria-label="Быстрые действия по теме"
    >
      <Button
        type="button"
        size="sm"
        className="h-10 w-full px-2 text-[12px] sm:text-[13px]"
        aria-current="true"
      >
        Задачи
      </Button>
      <Button
        asChild
        size="sm"
        variant="ghost"
        className="h-10 w-full px-2 text-[12px] sm:text-[13px]"
      >
        <Link href="#theory">Справка</Link>
      </Button>
    </div>
  );
}
