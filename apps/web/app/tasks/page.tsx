import { Suspense } from "react";
import { TaskCatalogBrowser } from "../../components/tasks/TaskCatalogBrowser";
import { getTaskCatalog } from "../../lib/server/task-catalog";

export const metadata = {
  title: "Практика | PhysicsLab",
  description: "Тренировки по знакомой теме, формуле или типу задачи.",
};

export default function TasksPage() {
  const entries = getTaskCatalog();

  return (
    <div className="mx-auto flex w-full max-w-[1120px] min-w-0 flex-col gap-8">
      <header className="flex max-w-[700px] flex-col gap-2.5 pt-1">
        <h1 className="text-[34px] font-[800] leading-tight tracking-[-0.035em] text-white sm:text-[44px]">
          Что потренируем?
        </h1>
        <p className="max-w-[620px] text-[15px] leading-[1.7] text-white/72">
          Найди знакомую тему или формулу. Внутри — короткая серия из пяти
          задач и разбор, если ответ не сойдётся.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            className="border-l-2 border-nova-cyan/55 py-2 pl-4"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <p className="text-[14px] font-semibold text-white/72">
              Раскладываем задачи по темам…
            </p>
            <p className="mt-1 text-[12px] leading-[1.55] text-white/50">
              Скоро появится поиск и список тренировок.
            </p>
          </div>
        }
      >
        <TaskCatalogBrowser entries={entries} />
      </Suspense>
    </div>
  );
}
