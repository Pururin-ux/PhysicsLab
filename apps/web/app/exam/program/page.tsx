import { ExamProgramCoverage } from "../../../components/exam/ExamProgramCoverage";
import { buildCoverageSections } from "../../../lib/learning/coverage";
import { getTaskCatalog } from "../../../lib/server/task-catalog";

export const metadata = {
  title: "Карта программы ЦТ/ЦЭ по физике | PhysicsLab",
  description:
    "Все шесть разделов программы и честная граница доступных тренировок PhysicsLab.",
};

export default function ExamProgramPage() {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));

  return <ExamProgramCoverage coverage={coverage} />;
}
