import { ExamDemo } from "../../../components/exam/ExamDemo";

export const metadata = {
  title: "Смешанная тренировка | PhysicsLab",
};

export default function ExamDemoPage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Смешанная тренировка
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          10 задач по открытым темам: кинематика, динамика, электродинамика,
          термодинамика и оптика вперемешку — по две задачи из каждой.
        </p>
        <p className="text-[13px] leading-[1.65] text-white/45">
          Это тренировочный набор, а не полный вариант ЦТ/ЦЭ: квантовая и атомно-ядерная
          физика пока не включены.
        </p>
      </section>

      <ExamDemo />
    </div>
  );
}
