import { ExamDemo } from "../../../components/exam/ExamDemo";
import { TopicPageHeader } from "../../../components/layout/TopicPageHeader";
import { getExamMixInfo } from "../../../lib/learning/exam-mix";

export const metadata = {
  title: "Диагностика: 14 задач по открытым темам | PhysicsLab",
  description:
    "Смешанная тренировка по физике: 14 задач по семи открытым темам ЦЭ/ЦТ с разбором каждого ответа.",
  alternates: { canonical: "/exam" },
};

// Исторический маршрут смешанной тренировки. Каноническая страница
// диагностики — /exam; здесь тот же самый сценарий, чтобы старые ссылки,
// сохранённые сессии и проверки маршрутов продолжали работать.
export default function ExamDemoPage() {
  const mix = getExamMixInfo();

  return (
    <div className="flex min-w-0 flex-col gap-7">
      {/* Та же шапка, что и на остальных страницах тренировок: раньше здесь
          была своя верстка с узкой центрированной колонкой. */}
      <TopicPageHeader
        eyebrow="Диагностика"
        title="Все темы вперемешку"
        description="14 задач: кинематика, динамика, электродинамика, термодинамика, оптика, колебания с волнами и квантовая физика — по две задачи из каждой темы. Это тренировочный набор, а не полный вариант ЦТ/ЦЭ."
      />

      <ExamDemo
        sections={mix.sections}
        missing={mix.missing}
        totalTaskTypes={mix.totalTaskTypes}
      />
    </div>
  );
}
