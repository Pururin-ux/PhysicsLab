import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface QuizLoadingCardProps {
  title: string;
}

// Загрузка набора задач: спокойная карточка, по высоте близкая к карточке
// задачи (уменьшает скачок layout), без тяжёлой анимации.
export function QuizLoadingCard({ title }: QuizLoadingCardProps) {
  return (
    <section className="relative mx-auto flex w-full max-w-[580px] flex-col gap-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8">
      <Card
        data-testid="quiz-loading-card"
        aria-live="polite"
        aria-busy="true"
        className="flex min-h-[320px] flex-col gap-4"
      >
        <Badge tone="cyan">{title}</Badge>
        <p className="text-[14px] font-normal leading-[1.7] text-white/70">
          Готовлю новый набор задач…
        </p>
        {/* Скелет условия: намекает форму карточки, motion-safe. */}
        <div aria-hidden="true" className="mt-2 flex flex-col gap-3">
          <div className="h-3.5 w-3/4 rounded-full bg-white/[.06] motion-safe:animate-pulse" />
          <div className="h-3.5 w-2/3 rounded-full bg-white/[.05] motion-safe:animate-pulse" />
          <div className="h-3.5 w-1/2 rounded-full bg-white/[.04] motion-safe:animate-pulse" />
          <div className="mt-4 h-12 rounded-option border border-white/[.06] bg-white/[.02]" />
          <div className="h-12 rounded-option border border-white/[.06] bg-white/[.02]" />
          <div className="h-12 rounded-option border border-white/[.06] bg-white/[.02]" />
        </div>
      </Card>
    </section>
  );
}
