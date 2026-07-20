import { ExamDemo } from "../../../components/exam/ExamDemo";

export const metadata = {
  title: "Подготовиться к ЦТ/ЦЭ | PhysicsLab",
  description: "Спокойный тренировочный режим по физике без обязательного таймера.",
};

export default function ExamDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1080px] min-w-0 flex-col gap-6">
      <header className="max-w-[760px] border-l-2 border-nova-cyan/45 pl-4">
        <h1 className="text-[30px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[42px]">
          <span className="sm:hidden">Подготовка к ЦТ/ЦЭ</span><span className="hidden sm:inline">Подготовиться к ЦТ/ЦЭ</span>
        </h1>
        <p className="mt-2 max-w-[64ch] text-[14px] leading-[1.65] text-white/62">
          <span className="sm:hidden">Спокойный режим: узнай тип задачи, реши своим способом и разбери конкретную ошибку.</span>
          <span className="hidden sm:inline">Здесь не объясняем тему с нуля. Это отдельный режим, чтобы спокойно узнать тип задачи, решить её своим способом и разобрать конкретную ошибку.</span>
        </p>
      </header>

      <ExamDemo />
    </div>
  );
}
