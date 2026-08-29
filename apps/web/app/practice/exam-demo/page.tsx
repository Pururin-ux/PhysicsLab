import { ExamDemo } from "../../../components/exam/ExamDemo";
import { getExamMixInfo } from "../../../lib/learning/exam-mix";

export const metadata = {
  title: "Диагностика: 10 задач по открытым темам | PhysicsLab",
  description:
    "Смешанная тренировка по физике: 10 задач по пяти открытым темам ЦЭ/ЦТ с разбором каждого ответа.",
  alternates: { canonical: "/exam" },
};

// Исторический маршрут смешанной тренировки. Каноническая страница
// диагностики — /exam; здесь тот же самый сценарий, чтобы старые ссылки,
// сохранённые сессии и проверки маршрутов продолжали работать.
export default function ExamDemoPage() {
  const mix = getExamMixInfo();

  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="mx-auto flex w-full max-w-[620px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Диагностика по открытым темам
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          10 задач: кинематика, динамика, электродинамика, термодинамика и оптика — по две
          задачи из каждой темы, вперемешку.
        </p>
        <p className="text-[13px] leading-[1.65] text-white/45">
          Это тренировочный набор, а не полный вариант ЦТ/ЦЭ: квантовая и атомно-ядерная физика
          пока не включены.
        </p>
      </section>

      <ExamDemo
        sections={mix.sections}
        missing={mix.missing}
        totalTaskTypes={mix.totalTaskTypes}
      />
    </div>
  );
}
