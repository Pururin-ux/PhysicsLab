import { Suspense } from "react";
import { TaskCatalogBrowser } from "../../components/tasks/TaskCatalogBrowser";
import { buildCoverageSections } from "../../lib/learning/coverage";
import { getTaskCatalog } from "../../lib/server/task-catalog";

export const metadata = {
  title: "Типы задач | PhysicsLab",
};

export default function TasksPage() {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));

  return (
    <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-8">
      <section className="flex max-w-[700px] flex-col gap-2.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-nova-pink">Практика по навыкам</p>
        <h1 className="text-[34px] font-[800] leading-tight tracking-[-0.035em] text-white sm:text-[44px]">
          Задачи
        </h1>
        <p className="max-w-[620px] text-[15px] leading-[1.7] text-white/72">
          Найди навык, реши несколько похожих задач и сразу разбери ошибку.
        </p>
      </section>

      <Suspense
        fallback={
          <p className="text-[13px] font-semibold text-white/50">
            Загружаем каталог из {entries.length} типов…
          </p>
        }
      >
        <TaskCatalogBrowser entries={entries} coverage={coverage} />
      </Suspense>
    </div>
  );
}
