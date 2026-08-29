import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const destinations = [
  { href: "/topics", label: "Уроки по темам" },
  { href: "/tasks", label: "Каталог задач" },
  { href: "/exam", label: "Диагностика" },
  { href: "/formulas", label: "Формулы" },
];

// Настоящий Next.js not-found (честный 404, без клиентского redirect).
export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col gap-6 py-8">
      <Card
        padding="lg"
        data-testid="not-found-card"
        className="flex flex-col items-start gap-5"
      >
        <div className="flex items-center gap-3">
          <span className="physics-number grid h-12 w-12 place-items-center rounded-card border border-nova-cyan/30 bg-nova-cyan-10 text-[20px] font-bold text-nova-cyan">
            404
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="pl-h2">Страница не найдена</h1>
            <p className="text-[13px] leading-[1.6] text-ink-soft">
              Такой страницы нет — возможно, ссылка устарела.
            </p>
          </div>
        </div>

        <p className="text-[14px] leading-[1.7] text-ink-muted">
          Уроки, тренировки и справочник на месте: вот куда можно пойти дальше.
        </p>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Button asChild>
            <Link href="/topics">К темам</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Card>

      <nav aria-label="Разделы сайта" className="flex flex-wrap gap-2">
        {destinations.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="pl-focus rounded-option border border-line bg-surface-1 px-3.5 py-2 text-[13px] font-semibold text-ink-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
