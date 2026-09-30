import Link from "next/link";
import { cn } from "../../lib/utils";
import styles from "./LessonCrumbs.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Компактная навигационная строка урока: путь по курсу одной строкой вместо
 * отдельной плашки со ссылкой. Последний пункт — текущая тема.
 */
export function LessonCrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Путь по курсу" className={cn(styles.crumbs, className)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className={styles.item}>
          {index > 0 ? (
            <span aria-hidden="true" className={styles.sep}>
              ›
            </span>
          ) : null}
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className={styles.current}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
