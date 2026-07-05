import { notFound } from "next/navigation";
import type { ReactNode } from "react";

// Витрины /dev — рабочий инструмент разработки. В production-сборке весь
// сегмент отвечает 404, чтобы внутренние страницы не индексировались и не
// попадали к ученикам. Гард на layout закрывает и будущие /dev-страницы.
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return children;
}
