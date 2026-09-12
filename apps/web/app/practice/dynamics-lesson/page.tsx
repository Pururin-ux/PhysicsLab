import { DynamicsLesson } from "../../../components/learning/DynamicsLesson";

export const metadata = {
  title: "Второй закон Ньютона | PhysicsLab",
  description: "Интерактивный урок о связи силы, массы и ускорения: опыт, рисунок сил, пример и самостоятельные задачи.",
};

export default function DynamicsLessonPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] min-w-0">
      <h1 className="sr-only">Второй закон Ньютона</h1>
      <DynamicsLesson />
    </div>
  );
}
