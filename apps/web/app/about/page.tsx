import Link from "next/link";
import { buildCoverageSections } from "../../lib/learning/coverage";
import { getTaskCatalog } from "../../lib/server/task-catalog";
import { topics } from "../../lib/topics";
import { XP_RULES } from "../../lib/xp";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { SectionHeading } from "../../components/ui/SectionHeading";

export const metadata = {
  title: "О проекте | PhysicsLab",
  description:
    "Как устроен PhysicsLab: методика, честные ограничения, покрытие программы ЦЭ/ЦТ по физике, как считается прогресс и где хранятся данные.",
};

const principles = [
  {
    title: "Понимание вместо зубрёжки",
    body: "Урок темы объясняет модель и ловушку, а не даёт набор формул наизусть. Задачи генерируются с новыми числами, поэтому запоминать ответ бесполезно.",
  },
  {
    title: "Короткие серии",
    body: "Пять задач на один навык или десять задач по теме — это то, что реально доделать до конца за один подход.",
  },
  {
    title: "Ошибка — это план",
    body: "Каждая ошибка привязана к конкретной ловушке. Повторяющиеся ловушки превращаются в очередь повторения с приоритетом.",
  },
  {
    title: "Честные цифры",
    body: "Мы показываем решённые задачи, точность и серию дней. Никаких «готовность 73%» и прогнозов балла — их нельзя честно посчитать по тренажёру.",
  },
];

const limits = [
  "Это не официальный тренажёр ЦТ/ЦЭ: проект не связан с организаторами экзамена.",
  "Диагностика из 14 задач — это срез по открытым темам, а не полный вариант экзамена.",
  "Не покрыты задачами: квантовая и атомно-ядерная физика, колебания и волны, магнитное поле и электромагнитная индукция.",
  "Прогресс и XP не конвертируются в балл ЦТ/ЦЭ и не предсказывают его.",
];

const constants = [
  { value: "g \\approx 10\\ \\text{м/с}^2", note: "ускорение свободного падения в задачах" },
  { value: "c = 3{,}0 \\cdot 10^8\\ \\text{м/с}", note: "скорость света в вакууме" },
  { value: "R = 8{,}31\\ \\text{Дж/(моль·К)}", note: "универсальная газовая постоянная" },
  { value: "N_A = 6{,}02 \\cdot 10^{23}\\ \\text{моль}^{-1}", note: "число Авогадро" },
  { value: "k = 9 \\cdot 10^9\\ \\text{Н·м}^2/\\text{Кл}^2", note: "коэффициент в законе Кулона" },
  { value: "e = 1{,}6 \\cdot 10^{-19}\\ \\text{Кл}", note: "элементарный заряд" },
];

const roadmap = [
  "Задачи по магнитному полю и электромагнитной индукции.",
  "Квантовая и атомно-ядерная физика: фотоэффект, спектры, ядерные превращения.",
  "Колебания и волны: графики, период, длина волны.",
  "Более длинные варианты и настраиваемая сложность.",
];

export default function AboutPage() {
  const entries = getTaskCatalog();
  const coverage = buildCoverageSections(entries.map((entry) => entry.id));
  const covered = coverage.filter((section) => section.familyCount > 0);
  const uncovered = coverage.filter((section) => section.familyCount === 0);

  return (
    <div className="flex min-w-0 flex-col gap-10">
      <section className="flex max-w-[720px] flex-col gap-4">
        <p className="pl-eyebrow text-nova-cyan/80">О проекте</p>
        <h1 className="pl-h1 max-w-[24ch]">
          Тренажёр, который честно говорит, чего в нём нет
        </h1>
        <p className="pl-body pl-measure">
          PhysicsLab — тренажёр по физике для подготовки к ЦЭ/ЦТ в Беларуси. Он не имитирует
          экзамен целиком: он закрывает те разделы, где задачи уже разобраны и проверены, и прямо
          показывает остальные.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge tone="cyan" size="sm" dot>
            {entries.length} типов задач
          </Badge>
          <Badge tone="cyan" size="sm" dot>
            {topics.length} тем
          </Badge>
          <Badge size="sm">без регистрации</Badge>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="flex flex-col gap-5">
        <SectionHeading
          id="principles-title"
          eyebrow="Методика"
          title="Как здесь учат"
          description="Четыре принципа, из которых следует всё остальное: от структуры урока до формулировок в разборе ошибок."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {principles.map((item) => (
            <Card key={item.title} padding="md" interactive className="flex flex-col gap-2.5">
              <h3 className="pl-h3">{item.title}</h3>
              <p className="text-[13px] leading-[1.7] text-ink-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="limits-title" className="flex flex-col gap-5">
        <SectionHeading
          id="limits-title"
          eyebrow="Границы"
          title="Честные ограничения"
          description="Лучше сразу сказать, где тренажёр не поможет, чем создать ощущение полной готовности."
        />
        <Card
          padding="lg"
          className="border-nova-gold/25 bg-nova-gold/[.045]"
        >
          <ul className="flex flex-col gap-3">
            {limits.map((item) => (
              <li
                key={item}
                className="grid grid-cols-[auto_1fr] gap-3 text-[14px] leading-[1.7] text-ink-muted"
              >
                <span aria-hidden="true" className="text-nova-gold">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section aria-labelledby="coverage-title" className="flex flex-col gap-5">
        <SectionHeading
          id="coverage-title"
          eyebrow="Программа"
          title="Покрытие программы"
          description={`Цифра — сколько типов задач каталога приходится на раздел. Открытых разделов: ${covered.length}, без задач: ${uncovered.length}.`}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {covered.map((section) => (
            <Card key={section.id} padding="sm" className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="pl-h3">{section.title}</h3>
                <Badge tone="cyan" size="sm">
                  {section.familyCount} типов
                </Badge>
              </div>
              <p className="text-[13px] leading-[1.65] text-ink-muted">{section.summary}</p>
              <ul className="flex flex-col gap-1.5">
                {section.knownGaps.map((gap) => (
                  <li key={gap} className="text-[12px] leading-[1.55] text-ink-faint">
                    • {gap}
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          {uncovered.map((section) => (
            <Card key={section.id} padding="sm" className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="pl-h3 text-white/85">{section.title}</h3>
                <Badge size="sm">скоро</Badge>
              </div>
              <p className="text-[13px] leading-[1.65] text-ink-soft">{section.summary}</p>
              <ul className="flex flex-col gap-1.5">
                {section.knownGaps.map((gap) => (
                  <li key={gap} className="text-[12px] leading-[1.55] text-ink-faint">
                    • {gap}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="progress-title" className="flex flex-col gap-5">
        <SectionHeading
          id="progress-title"
          eyebrow="Цифры"
          title="Как считается прогресс"
          description="Никаких скрытых коэффициентов: правила ниже полностью описывают каждый балл XP и каждый приоритет повторения."
        />
        <div className="grid gap-3 md:grid-cols-2">
          <Card padding="md" className="flex flex-col gap-2.5">
            <h3 className="pl-h3">XP и серии</h3>
            <ul className="flex flex-col gap-2 text-[13px] leading-[1.65] text-ink-muted">
              <li>
                Верный ответ с первой попытки —{" "}
                <span className="physics-number text-white/85">
                  {XP_RULES.correct_first_attempt}
                </span>{" "}
                XP, со второй —{" "}
                <span className="physics-number text-white/85">
                  {XP_RULES.correct_second_attempt}
                </span>{" "}
                XP.
              </li>
              <li>
                Серия из 3 и 5 верных ответов подряд даёт бонусы{" "}
                <span className="physics-number text-white/85">+{XP_RULES.streak_bonus_3}</span> и{" "}
                <span className="physics-number text-white/85">+{XP_RULES.streak_bonus_5}</span> XP.
              </li>
              <li>Отдельный счётчик дней: серия идёт, пока каждый день есть тренировка.</li>
            </ul>
          </Card>

          <Card padding="md" className="flex flex-col gap-2.5">
            <h3 className="pl-h3">Слабые места</h3>
            <ul className="flex flex-col gap-2 text-[13px] leading-[1.65] text-ink-muted">
              <li>У каждой ошибки есть причина — конкретная ловушка, а не просто «неверно».</li>
              <li>
                Ловушка считается по паре «навык + причина»: повторы и давность растят приоритет.
              </li>
              <li>Всё это собирается в план повторения на странице «Ошибки».</li>
            </ul>
          </Card>
        </div>
      </section>

      <section aria-labelledby="data-title" className="flex flex-col gap-5">
        <SectionHeading
          id="data-title"
          eyebrow="Приватность"
          title="Где лежат данные"
          description="Никаких аккаунтов и серверов: прогресс существует только в браузере на этом устройстве."
        />
        <Card padding="lg" className="flex flex-col gap-3">
          <p className="text-[14px] leading-[1.7] text-ink-muted">
            Весь прогресс — в браузере на этом устройстве: без аккаунта, сервера и передачи
            куда-либо. Очистка истории браузера удаляет прогресс, поэтому на странице «Прогресс»
            есть экспорт в файл и импорт обратно.
          </p>
          <p className="text-[13px] leading-[1.7] text-ink-soft">
            Тренировки, диагностика, ошибки и XP хранятся отдельными ключами, каждый со своей
            версией формата: старые данные читаются и дополняются, а не стираются.
          </p>
          <Link href="/profile" className="pl-link w-fit pt-1 text-[13px]">
            Открыть прогресс и экспорт данных
          </Link>
        </Card>
      </section>

      <section aria-labelledby="constants-title" className="flex flex-col gap-5">
        <SectionHeading
          id="constants-title"
          eyebrow="Справка"
          title="Справочные значения"
          description="Константы, которые используются в задачах тренажёра. На экзамене ориентируйся на значения из официального справочного материала."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {constants.map((item) => (
            <div
              key={item.value}
              className="flex flex-col gap-1.5 rounded-card border border-line bg-surface-1 px-4 py-3.5"
            >
              <p className="formula-white text-[15px] leading-[1.5]">${item.value}$</p>
              <p className="text-[12px] leading-[1.5] text-ink-faint">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="roadmap-title" className="flex flex-col gap-5">
        <SectionHeading
          id="roadmap-title"
          eyebrow="Планы"
          title="Что дальше"
          description="Порядок определяется покрытием программы: сначала разделы, которых нет совсем."
        />
        <ul className="flex flex-col gap-3">
          {roadmap.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[auto_1fr] gap-3 text-[14px] leading-[1.7] text-ink-muted"
            >
              <span aria-hidden="true" className="text-nova-cyan">
                →
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-[13px] leading-[1.7] text-ink-soft">
          Хочешь начать сейчас — открой{" "}
          <Link href="/topics" className="pl-link">
            уроки по темам
          </Link>{" "}
          или{" "}
          <Link href="/exam" className="pl-link">
            пройди диагностику
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
