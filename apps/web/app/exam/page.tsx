import Link from "next/link";
import { ExamDemo } from "../../components/exam/ExamDemo";
import { getExamMixInfo } from "../../lib/learning/exam-mix";
import { Card } from "../../components/ui/Card";

export const metadata = {
  title: "Диагностика | PhysicsLab",
  description:
    "Диагностика по физике: 10 задач по пяти открытым темам ЦЭ/ЦТ вперемешку, разбор каждого ответа и план повторения.",
};

const interpretation = [
  {
    title: "8–10 из 10",
    body: "Тема держится без подсказок. Стоит взять задачи посложнее и следить за единицами и знаками.",
  },
  {
    title: "5–7 из 10",
    body: "Нормальная рабочая зона: ошибки приходят из конкретных ловушек, а не из незнания темы целиком.",
  },
  {
    title: "до 5 из 10",
    body: "Не повод паниковать: открой уроки тем, где ошибки повторились, и реши по пять задач на каждый навык.",
  },
];

export default function ExamPage() {
  const mix = getExamMixInfo();

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section className="flex max-w-[680px] flex-col gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-nova-gold/80">
          ЦЭ/ЦТ · проверка
        </p>
        <h1 className="text-[34px] font-[800] leading-tight tracking-tight text-white sm:text-[42px]">
          Диагностика: 10 задач по 5 открытым темам
        </h1>
        <p className="text-[15px] leading-[1.7] text-white/68">
          Задачи идут вперемешку, как на экзамене: нельзя заранее знать, какой раздел сейчас
          попадётся. Считаем не балл ЦТ/ЦЭ, а то, какие навыки держатся в смешанном порядке.
        </p>
      </section>

      <ExamDemo
        sections={mix.sections}
        missing={mix.missing}
        totalTaskTypes={mix.totalTaskTypes}
      />

      <section aria-labelledby="how-to-read-title" className="flex flex-col gap-3">
        <h2 id="how-to-read-title" className="text-[13px] font-bold uppercase tracking-[.14em] text-white/45">
          Как читать результат
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {interpretation.map((item) => (
            <Card key={item.title} className="flex flex-col gap-2 border-white/[.08] !p-4">
              <p className="physics-number text-[15px] font-bold text-nova-gold">{item.title}</p>
              <p className="text-[13px] leading-[1.6] text-white/62">{item.body}</p>
            </Card>
          ))}
        </div>
        <p className="text-[13px] leading-[1.7] text-white/55">
          После диагностики ошибки попадают в{" "}
          <Link
            href="/mistakes"
            className="rounded-option font-semibold text-nova-cyan/85 transition-colors hover:text-nova-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-cyan/55"
          >
            план повторения
          </Link>{" "}
          — с конкретными темами и ловушками.
        </p>
      </section>
    </div>
  );
}
