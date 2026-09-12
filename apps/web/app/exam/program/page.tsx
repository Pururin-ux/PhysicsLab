import { ExamProgramCoverage } from "../../../components/exam/ExamProgramCoverage";
import { buildCoverageSections } from "../../../lib/learning/coverage";
import { getTaskCatalog } from "../../../lib/server/task-catalog";

export const metadata = {
  title: "Темы для подготовки к ЦТ/ЦЭ | PhysicsLab",
  description:
    "Доступные разделы каталога PhysicsLab и темы, для которых пока нет тренировок.",
};

export default function ExamProgramPage() {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));

  return <ExamProgramCoverage coverage={coverage} />;
}

