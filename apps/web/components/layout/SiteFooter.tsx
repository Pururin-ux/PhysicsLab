import Link from "next/link";

const footerLinks = [
  { href: "/topics", label: "Учиться" },
  { href: "/tasks", label: "Задачи" },
  { href: "/exam", label: "Диагностика" },
  { href: "/mistakes", label: "Ошибки" },
  { href: "/formulas", label: "Формулы" },
  { href: "/profile", label: "Прогресс" },
  { href: "/about", label: "О проекте" },
];

export function SiteFooter() {
  return (
    <footer className="mt-4 flex flex-col gap-4 border-t border-white/[.08] pt-6 pb-2 lg:col-start-2">
      <nav aria-label="Разделы сайта" className="flex flex-wrap gap-x-5 gap-y-2">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-option text-[13px] font-semibold text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55 focus-visible:ring-offset-2 focus-visible:ring-offset-space-950"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="max-w-[680px] text-[12px] leading-[1.65] text-white/40">
        Тренажёр по физике для подготовки к ЦЭ/ЦТ. Прогресс, ошибки и XP хранятся только в этом
        браузере. Проект не связан с организаторами экзамена и не предсказывает балл: цифры
        показывают только то, что реально решено в тренажёре.
      </p>
    </footer>
  );
}
