import { DynamicsLesson } from "../../../components/learning/DynamicsLesson";

export const metadata = {
  title: "Второй закон Ньютона | PhysicsLab",
  description: "Урок про силу, массу и ускорение: от тележки в магазине до формулы F = ma. Наглядные сравнения и первая своя задача.",
};

export default function DynamicsLessonPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] min-w-0 flex-col gap-3">
      <header className="max-w-[760px]">
        <h1 className="text-[28px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[36px]">
          Что такое сила и ускорение
        </h1>
        <p className="sr-only">
          Урок начинается с тележки в магазине. Потом сравнение толчков, запись значками и первая своя задача по формуле F = ma.
        </p>
      </header>
      <DynamicsLesson />
    </div>
  );
}
