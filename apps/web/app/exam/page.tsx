import Link from "next/link";
import { ExamDemo } from "../../components/exam/ExamDemo";
import { EXAM_QUESTION_COUNT, getExamMixInfo } from "../../lib/learning/exam-mix";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";

export const metadata = {
  title: "Диагностика | PhysicsLab",
  description:
    "Диагностика по физике: 14 задач по семи открытым темам ЦЭ/ЦТ вперемешку, разбор каждого ответа и план повторения.",
};

const interpretation = [
  {
    range: "11–14",
    body: "Тема держится без подсказок. Стоит взять задачи посложнее и следить за единицами и знаками.",
  },
  {
    range: "7–10",
    body: "Нормальная рабочая зона: ошибки приходят из конкретных ловушек, а не из незнания темы целиком.",
  },
  {
    range: "до 7",
    body: "Не повод паниковать: открой уроки тем, где ошибки повторились, и реши по пять задач на каждый навык.",
  },
];

const rules = [
  {
    title: "Без подсказок темы",
    body: "Задачи идут вперемешку, поэтому тренируется именно узнавание типа, а не повтор пройденного.",
  },
  {
    title: "Разбор сразу",
    body: "После каждого ответа открывается решение и ловушка — не нужно дожидаться конца варианта.",
  },
  {
    title: "Пауза разрешена",
    body: "Закрыл вкладку — вернёшься к тому же заданию: ответы и счёт хранятся локально.",
  },
  {
    title: "Ошибки в работу",
    body: "Каждая ошибка привязывается к навыку и уходит в план повторения со своим приоритетом.",
  },
];

export default function ExamPage() {
  const mix = getExamMixInfo();

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <section className="flex flex-col gap-5">
        <Badge tone="gold" size="sm" dot className="w-fit">
          ЦЭ/ЦТ · проверка
        </Badge>
        <h1 className="pl-h1 max-w-[26ch]">
          Диагностика: {EXAM_QUESTION_COUNT} задач по {mix.sections.length} открытым темам
        </h1>
        <p className="pl-body pl-measure">
          Задачи идут вперемешку, как на экзамене: нельзя заранее знать, какой раздел сейчас
          попадётся. Считаем не балл ЦТ/ЦЭ, а то, какие навыки держатся в смешанном порядке.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <ExamDemo
          sections={mix.sections}
          missing={mix.missing}
          totalTaskTypes={mix.totalTaskTypes}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <Card padding="md" className="flex flex-col gap-3">
            <p className="pl-eyebrow">Как читать результат</p>
            <ul className="flex flex-col gap-3.5">
              {interpretation.map((item) => (
                <li key={item.range} className="flex flex-col gap-1">
                  <p className="physics-number text-[15px] font-bold text-nova-gold">
                    {item.range} из 10
                  </p>
                  <p className="text-[13px] leading-[1.6] text-ink-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="md" className="flex flex-col gap-2.5">
            <p className="pl-eyebrow">После диагностики</p>
            <p className="text-[13px] leading-[1.65] text-ink-muted">
              Ошибки попадают в{" "}
              <Link href="/mistakes" className="pl-link">
                план повторения
              </Link>{" "}
              с конкретными темами и ловушками. История попыток и лучший результат — в{" "}
              <Link href="/profile" className="pl-link">
                прогрессе
              </Link>
              .
            </p>
          </Card>
        </div>
      </div>

      <section
        aria-labelledby="exam-rules-title"
        className="flex flex-col gap-5 border-t border-line-subtle pt-7"
      >
        <SectionHeading
          id="exam-rules-title"
          eyebrow="Правила"
          title="Как проходит попытка"
          description="Можно прерваться и вернуться: ответы и прогресс сохраняются в этой вкладке."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((rule) => (
            <Card key={rule.title} padding="sm" className="flex flex-col gap-2">
              <h3 className="pl-h3">{rule.title}</h3>
              <p className="text-[13px] leading-[1.6] text-ink-muted">{rule.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
