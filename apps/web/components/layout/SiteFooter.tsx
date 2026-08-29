import Link from "next/link";

const columns = [
  {
    title: "Учёба",
    links: [
      { href: "/", label: "Сегодня" },
      { href: "/topics", label: "Уроки по темам" },
      { href: "/tasks", label: "Каталог задач" },
    ],
  },
  {
    title: "Контроль",
    links: [
      { href: "/exam", label: "Диагностика" },
      { href: "/mistakes", label: "Ошибки и повторение" },
      { href: "/formulas", label: "Справочник формул" },
    ],
  },
  {
    title: "Профиль",
    links: [
      { href: "/profile", label: "Прогресс и данные" },
      { href: "/about", label: "О проекте" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-6 flex flex-col gap-6 border-t border-line-subtle pt-7 pb-2 lg:col-start-2">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-[800] leading-none tracking-tight text-white">
            Physics<span className="text-nova-cyan">Lab</span>
          </p>
          <p className="text-caption leading-[1.6] text-ink-faint">
            Тренажёр по физике для подготовки к ЦЭ/ЦТ. Уроки, короткие тренировки и честный
            разбор ошибок.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="flex flex-col gap-2.5">
            <p className="pl-eyebrow">{column.title}</p>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="pl-focus text-[13px] font-semibold text-ink-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <p className="max-w-[760px] text-[12px] leading-[1.65] text-white/40">
        Прогресс, ошибки и XP хранятся только в этом браузере. Проект не связан с организаторами
        экзамена и не предсказывает балл: цифры показывают только то, что реально решено в
        тренажёре.
      </p>
    </footer>
  );
}
