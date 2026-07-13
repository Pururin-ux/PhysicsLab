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
    <div className="flex min-w-0 flex-col gap-7">
      <section className="flex max-w-[720px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight text-white sm:text-[42px]">
          Типы задач
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Выбери конкретный навык и решай только похожие задачи.
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
