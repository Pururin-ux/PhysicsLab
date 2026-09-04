import { AccelerationLesson } from "../../../components/learning/AccelerationLesson";

export const metadata = {
  title: "Что такое ускорение | PhysicsLab",
  description: "Урок об ускорении на примере троллейбуса: как меняется скорость, что показывает график и как это записать формулой.",
};

export default function KinematicsLessonPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] min-w-0 flex-col gap-3">
      <header className="max-w-[760px]">
        <h1 className="text-[28px] font-[800] leading-tight tracking-[-.035em] text-white sm:text-[36px]">
          Что такое ускорение
        </h1>
        <p className="sr-only">
          Троллейбус отходит от остановки и набирает скорость.
        </p>
      </header>
      <AccelerationLesson />
    </div>
  );
}
