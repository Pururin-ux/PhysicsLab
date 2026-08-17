import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

// Настоящий Next.js not-found (честный 404, без клиентского redirect).
export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-[560px] flex-col gap-4 py-10">
      <Card data-testid="not-found-card" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[22px] font-[800] leading-tight text-white">
            Страница не найдена
          </h1>
          <p className="text-[14px] leading-[1.7] text-white/70">
            Такой страницы нет — возможно, ссылка устарела. Темы и тренировки
            на месте.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/topics">К темам</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
