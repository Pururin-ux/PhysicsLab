// design-sync: тёмная подложка превью. Сайт — тёмная тема (space-950), а
// карточка превью в Claude Design рендерит стори на белом body; без этой
// обёртки полупрозрачные поверхности DS нечитаемы. Подключается через
// cfg.provider + extraEntries (см. .design-sync/NOTES.md).
import type { ReactNode } from "react";

export function DsDarkSurface({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-block",
        background: "#07081E",
        padding: 24,
        borderRadius: 16,
        maxWidth: "100%",
      }}
    >
      {children}
    </div>
  );
}
