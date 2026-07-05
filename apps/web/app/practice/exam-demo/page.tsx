import { ExamDemo } from "../../../components/exam/ExamDemo";

export const metadata = {
  title: "Пробный вариант | PhysicsLab",
};

export default function ExamDemoPage() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <section className="mx-auto flex w-full max-w-[580px] flex-col gap-2">
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Пробный вариант
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Смешанный набор задач по механике в формате одиночного выбора.
        </p>
        <p className="text-[13px] leading-[1.65] text-white/45">
          Настоящий ЦЭ/ЦТ шире: в нём есть электродинамика, термодинамика и
          другие разделы. Здесь — только то, что уже открыто в тренажёре.
        </p>
      </section>

      <ExamDemo />
    </div>
  );
}
