"use client";

import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Flask,
  Gauge,
  Lightbulb,
  ListChecks,
  PencilSimpleLine,
  X,
} from "@phosphor-icons/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { PhysicsGraph } from "../physics-graph/PhysicsGraph";
import { FormulaBox } from "../ui/FormulaBox";
import { NumericAnswerInput } from "../quiz/NumericAnswerInput";
import { AnswerFeedback } from "../quiz/AnswerFeedback";
import { OptionItem, type OptionState } from "../quiz/OptionItem";
import type { PhysicsGraphSpec } from "../../lib/physics/physics-graph-spec";
import styles from "./design-lab.module.css";

type ScreenId = "hub" | "theory" | "practice" | "results";
type PracticeMode = "numeric" | "choice";

const screens: Array<{ id: ScreenId; label: string; shortLabel: string; number: string }> = [
  { id: "hub", label: "Маршрут", shortLabel: "Маршрут", number: "01" },
  { id: "theory", label: "Теория", shortLabel: "Теория", number: "02" },
  { id: "practice", label: "Практика", shortLabel: "Задача", number: "03" },
  { id: "results", label: "Результат", shortLabel: "Итог", number: "04" },
];

const velocityGraph: PhysicsGraphSpec = {
  id: "design-lab-uniform-acceleration",
  kind: "cartesian-line",
  axes: {
    x: {
      label: "t",
      unit: "с",
      range: [0, 4],
      ticks: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
      ],
    },
    y: {
      label: "v",
      unit: "м/с",
      range: [0, 14],
      ticks: [
        { value: 0 },
        { value: 4 },
        { value: 8 },
        { value: 12 },
      ],
    },
  },
  series: [
    {
      id: "velocity",
      type: "line",
      points: [
        { x: 0, y: 4, label: "A" },
        { x: 4, y: 12, label: "B" },
      ],
    },
  ],
  annotations: [
    { type: "dashed-guide", from: { x: 4, y: 0 }, to: { x: 4, y: 12 } },
    { type: "dashed-guide", from: { x: 0, y: 12 }, to: { x: 4, y: 12 } },
    { type: "segment-arrow", from: { x: 0.8, y: 5.6 }, to: { x: 2.4, y: 8.8 } },
  ],
  style: { variant: "app", accent: "cyan" },
};

function LabMark() {
  return (
    <div className={styles.brand} aria-label="PhysicsLab, лаборатория движения">
      <span className={styles.brandGlyph} aria-hidden="true">
        <svg viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="18" />
          <path d="M10 29c8-2 13-9 17-18M16 35c5-7 9-12 18-15" />
          <circle cx="29" cy="14" r="2.5" />
        </svg>
      </span>
      <span>
        <strong>PhysicsLab</strong>
        <small>станция измерений</small>
      </span>
    </div>
  );
}

function NotebookRule({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.notebookRule}>
      <span aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function GraphPlate({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={styles.graphPlate}>
      <figcaption>
        <span>опыт 04—А</span>
        <strong>Линейный рост скорости</strong>
      </figcaption>
      <PhysicsGraph
        spec={velocityGraph}
        compact={compact}
        ariaLabel="График скорости: от 4 метров в секунду в начальный момент до 12 метров в секунду через 4 секунды"
        className={styles.physicsGraph}
      />
      <p className={styles.graphNote}>
        <span aria-hidden="true">↗</span> За каждую секунду скорость увеличивается на 2 м/с.
      </p>
    </figure>
  );
}

function ScreenHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
}) {
  return (
    <header className={styles.screenHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.intro}>{intro}</p>
    </header>
  );
}

function HubScreen({ goTo }: { goTo: (screen: ScreenId) => void }) {
  const route = [
    {
      number: "01",
      title: "Замечаем изменение скорости",
      text: "Отличаем движение с постоянной скоростью от движения, где скорость меняется.",
      action: "Открыть теорию",
      screen: "theory" as const,
    },
    {
      number: "02",
      title: "Читаем график v(t)",
      text: "Связываем наклон прямой с ускорением и находим скорость в выбранный момент.",
      action: "К задаче",
      screen: "practice" as const,
    },
    {
      number: "03",
      title: "Находим путь",
      text: "Читаем площадь под графиком как перемещение за промежуток времени.",
      action: "Следом по маршруту",
    },
    {
      number: "04",
      title: "Сверяем понимание",
      text: "Разбираем серию и выбираем точку, к которой стоит вернуться.",
      action: "Посмотреть итог",
      screen: "results" as const,
    },
  ];

  return (
    <section className={`${styles.screen} ${styles.hubScreen}`} aria-labelledby="hub-title">
      <div className={styles.hubLead}>
        <ScreenHeading
          eyebrow="Учебный маршрут · кинематика"
          title={<><span id="hub-title">Скорость при</span><br />равнопеременном<br />движении</>}
          intro="Одна линия на графике связывает наблюдение, формулу и расчёт. В нашем опыте движение равноускоренное: скорость и ускорение направлены одинаково."
        />
        <NotebookRule>Начинай не с формулы, а с вопроса: что именно меняется каждую секунду?</NotebookRule>
        <button className={styles.primaryAction} type="button" onClick={() => goTo("theory")}>
          Начать с наблюдения <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div className={styles.route} aria-label="Содержание темы">
        <div className={styles.routeAxis} aria-hidden="true"><span /></div>
        {route.map((item, index) => (
          <article className={styles.routeStep} key={item.number}>
            <span className={styles.routeNumber}>{item.number}</span>
            <div>
              <p className={styles.routeKicker}>{index === 0 ? "точка входа" : index === 3 ? "после серии" : "следующий опыт"}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              {item.screen ? (
                <button type="button" onClick={() => goTo(item.screen)}>
                  {item.action} <ArrowRight size={15} weight="bold" aria-hidden="true" />
                </button>
              ) : (
                <span className={styles.futureStep}>{item.action}</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TheoryScreen({ goTo }: { goTo: (screen: ScreenId) => void }) {
  return (
    <section className={`${styles.screen} ${styles.theoryScreen}`} aria-labelledby="theory-title">
      <div className={styles.theoryCopy}>
        <ScreenHeading
          eyebrow="Лист 02 · скорость при равнопеременном движении"
          title={<><span id="theory-title">Ускорение видно</span><br />по наклону</>}
          intro="Если за равные промежутки времени скорость меняется одинаково, ускорение постоянно. В нашем опыте движение равноускоренное: скорость и ускорение сонаправлены."
        />

        <div className={styles.observation}>
          <span className={styles.handCircle}>1</span>
          <div>
            <p>Наблюдение</p>
            <strong>Линия идёт вверх — скорость растёт. При одинаковом масштабе осей большему наклону соответствует больший модуль ускорения.</strong>
          </div>
        </div>

        <div className={styles.formulaWrap}>
          <FormulaBox
            formula="v = v_0 + at"
            label="закон скорости"
            caption="Скорость v в момент t при постоянном ускорении a и начальной скорости v₀."
            className={styles.formulaBox}
          />
          <div className={styles.formulaMargin} aria-label="Пояснение к формуле">
            <span>v₀</span><p>с чего начали</p>
            <span>a·t</span><p>что прибавилось</p>
          </div>
        </div>
      </div>

      <div className={styles.theoryVisual}>
        <GraphPlate />
        <div className={styles.calculationStrip}>
          <span>Считываем наклон</span>
          <div>
            <strong>a = Δv / Δt</strong>
            <strong>a = (12 − 4) / 4 = 2 м/с²</strong>
          </div>
        </div>
      </div>

      <footer className={styles.screenFooter}>
        <button className={styles.textAction} type="button" onClick={() => goTo("hub")}>
          <ArrowLeft size={16} weight="bold" aria-hidden="true" /> К маршруту
        </button>
        <button className={styles.primaryAction} type="button" onClick={() => goTo("practice")}>
          Проверить на задаче <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}

function PracticeScreen({ goTo }: { goTo: (screen: ScreenId) => void }) {
  const [mode, setMode] = useState<PracticeMode>("numeric");
  const [submitted, setSubmitted] = useState<{ raw: string; isCorrect: boolean } | undefined>();
  const [choice, setChoice] = useState<string | null>(null);
  const [hintOpen, setHintOpen] = useState(false);

  function submitNumeric(raw: string) {
    const numeric = Number(raw.trim().replace(",", "."));
    setSubmitted({ raw, isCorrect: Math.abs(numeric - 12) < 0.01 });
  }

  function choiceState(id: string): OptionState {
    if (!choice) return "idle";
    if (id === "Б") return "correct";
    if (id === choice) return "wrong";
    return "dimmed";
  }

  function resetPractice() {
    setSubmitted(undefined);
    setChoice(null);
    setHintOpen(false);
  }

  function selectMode(nextMode: PracticeMode) {
    setMode(nextMode);
    resetPractice();
  }

  function handleModeKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const nextMode: PracticeMode = mode === "numeric" ? "choice" : "numeric";
    selectMode(nextMode);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-practice-mode="${nextMode}"]`)?.focus();
    });
  }

  const answered = mode === "numeric" ? Boolean(submitted) : Boolean(choice);

  return (
    <section className={`${styles.screen} ${styles.practiceScreen}`} aria-labelledby="practice-title">
      <div className={styles.practiceHeader}>
        <div>
          <p className={styles.eyebrow}>Лист 03 · практическая сессия</p>
          <h1 id="practice-title">Прочитай движение</h1>
        </div>
        <div className={styles.taskCounter} aria-label="Задача 2 из 4"><span>02</span><small>/ 04</small></div>
      </div>

      <div className={styles.practiceLayout}>
        <div className={styles.problemColumn}>
          <p className={styles.taskLabel}>Дано по графику</p>
          <p className={styles.problemText}>
            Скорость тела изменяется по закону <strong>v = 4 + 2t</strong>, где все величины выражены в СИ. Какова скорость тела через <strong>4 с</strong> после начала наблюдения?
          </p>

          <div className={styles.modeTabs} role="tablist" aria-label="Формат ответа">
            <button
              type="button"
              role="tab"
              id="practice-mode-numeric"
              data-practice-mode="numeric"
              aria-controls="practice-answer-panel"
              aria-selected={mode === "numeric"}
              tabIndex={mode === "numeric" ? 0 : -1}
              onClick={() => selectMode("numeric")}
              onKeyDown={handleModeKeyDown}
            >
              Числом
            </button>
            <button
              type="button"
              role="tab"
              id="practice-mode-choice"
              data-practice-mode="choice"
              aria-controls="practice-answer-panel"
              aria-selected={mode === "choice"}
              tabIndex={mode === "choice" ? 0 : -1}
              onClick={() => selectMode("choice")}
              onKeyDown={handleModeKeyDown}
            >
              Проверить идею
            </button>
          </div>

          <div
            id="practice-answer-panel"
            className={styles.answerArea}
            role="tabpanel"
            aria-labelledby={mode === "numeric" ? "practice-mode-numeric" : "practice-mode-choice"}
          >
            {mode === "numeric" ? (
              <>
                <NumericAnswerInput
                  key={submitted ? "submitted" : "empty"}
                  unit="м/с"
                  decimals={0}
                  sign="positive"
                  disabled={Boolean(submitted)}
                  submitted={submitted}
                  onSubmit={submitNumeric}
                />
                {!submitted ? <p className={styles.answerHelper}>Введите целое число без единицы измерения.</p> : null}
              </>
            ) : (
              <div className={styles.options}>
                {[
                  ["А", "8 м/с — прибавить ускорение один раз"],
                  ["Б", "12 м/с — прибавить 2 м/с четыре раза"],
                  ["В", "16 м/с — умножить начальную скорость на время"],
                ].map(([id, text]) => (
                  <OptionItem
                    key={id}
                    id={id}
                    text={text}
                    state={choiceState(id)}
                    disabled={Boolean(choice)}
                    onClick={() => setChoice(id)}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            className={styles.hintButton}
            type="button"
            aria-expanded={hintOpen}
            aria-controls="design-lab-hint"
            onClick={() => setHintOpen((current) => !current)}
          >
            <Lightbulb size={17} weight="duotone" aria-hidden="true" />
            {hintOpen ? "Скрыть подсказку" : "Нужна подсказка?"}
          </button>
          {hintOpen ? (
            <div id="design-lab-hint" className={styles.hint}>
              Подставь t = 4 с в закон скорости. Единицу измерения в поле вводить не нужно.
            </div>
          ) : null}

          {mode === "numeric" && submitted ? (
            <div className={styles.feedbackWrap}>
              <AnswerFeedback
                isCorrect={submitted.isCorrect}
                feedbackText={submitted.isCorrect
                  ? "Ты верно связал момент времени с точкой B на графике: v = 4 + 2 · 4 = 12 м/с."
                  : "Подставь в закон скорости именно t = 4 с: начальная скорость 4 м/с не исчезает."}
                correctAnswer={submitted.isCorrect ? undefined : "12 м/с"}
              />
            </div>
          ) : null}
          {mode === "choice" && choice ? (
            <div className={styles.feedbackWrap}>
              <AnswerFeedback
                isCorrect={choice === "Б"}
                feedbackText={choice === "Б"
                  ? "Верно: ускорение 2 м/с² означает прибавку 2 м/с за каждую из четырёх секунд."
                  : "Ускорение показывает изменение скорости за одну секунду. За 4 с прибавка равна 8 м/с."}
                correctAnswer={choice === "Б" ? undefined : "Б — 12 м/с"}
              />
            </div>
          ) : null}

          {answered ? (
            <button className={styles.resetButton} type="button" onClick={resetPractice}>
              <ArrowCounterClockwise size={15} weight="bold" aria-hidden="true" /> Попробовать ещё раз
            </button>
          ) : null}
        </div>

        <div className={styles.practiceVisual}>
          <GraphPlate compact />
          <div className={styles.marginPrompt}>
            <PencilSimpleLine size={23} weight="duotone" aria-hidden="true" />
            <p><span>Проверь себя</span>Точка B на графике должна совпасть с числом в ответе.</p>
          </div>
        </div>
      </div>

      <footer className={styles.screenFooter}>
        <button className={styles.textAction} type="button" onClick={() => goTo("theory")}>
          <ArrowLeft size={16} weight="bold" aria-hidden="true" /> К теории
        </button>
        <button
          className={styles.primaryAction}
          type="button"
          disabled={!answered}
          onClick={() => goTo("results")}
        >
          Перейти к разбору <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}

function ResultMark() {
  return (
    <div className={styles.resultMark} aria-label="Три верных ответа из четырёх">
      <svg viewBox="0 0 210 210" aria-hidden="true">
        <circle className={styles.resultTrack} cx="105" cy="105" r="82" />
        <circle className={styles.resultArc} cx="105" cy="105" r="82" />
        <path d="M50 155 C86 126 108 98 154 48" />
        <circle cx="154" cy="48" r="7" />
      </svg>
      <div><strong>3</strong><span>из 4</span></div>
    </div>
  );
}

function ResultsScreen({ goTo }: { goTo: (screen: ScreenId) => void }) {
  const rows = [
    { title: "Узнать равнопеременное движение", state: "correct" as const },
    { title: "Найти ускорение по наклону v(t)", state: "correct" as const },
    { title: "Вычислить скорость в момент времени", state: "correct" as const },
    { title: "Найти путь по площади под графиком", state: "wrong" as const },
  ];

  return (
    <section className={`${styles.screen} ${styles.resultsScreen}`} aria-labelledby="results-title">
      <div className={styles.resultsLead}>
        <p className={styles.eyebrow}>Лист 04 · разбор серии</p>
        <ResultMark />
        <h1 id="results-title">Линию скорости<br />ты читаешь уверенно</h1>
        <p className={styles.intro}>В демонстрационной серии верно решены три задачи. Осталась одна связка: перейти от скорости к пути.</p>
      </div>

      <div className={styles.resultNotebook}>
        <div className={styles.resultNotebookHead}>
          <span>Протокол наблюдений</span>
          <small>демонстрационная серия</small>
        </div>
        <ol>
          {rows.map((row, index) => (
            <li key={row.title} data-state={row.state}>
              <span className={styles.resultRowNumber}>{String(index + 1).padStart(2, "0")}</span>
              <p>{row.title}</p>
              <span className={styles.resultState}>
                {row.state === "correct" ? <Check size={17} weight="bold" /> : <X size={17} weight="bold" />}
                {row.state === "correct" ? "верно" : "вернуться"}
              </span>
            </li>
          ))}
        </ol>
        <div className={styles.nextNote}>
          <span>Следующий опыт</span>
          <h2>Путь — это площадь под графиком v(t)</h2>
          <p>Разложи фигуру под линией на прямоугольник и треугольник: 4 · 4 + (8 · 4) / 2 = 32 м.</p>
        </div>
      </div>

      <footer className={styles.screenFooter}>
        <button className={styles.textAction} type="button" onClick={() => goTo("practice")}>
          <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" /> Повторить задачу
        </button>
        <button className={styles.primaryAction} type="button" onClick={() => goTo("hub")}>
          Вернуться к маршруту <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </footer>
    </section>
  );
}

const screenIcons = {
  hub: ListChecks,
  theory: BookOpen,
  practice: Gauge,
  results: Flask,
};

export function DesignLab() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("hub");
  const tabsRef = useRef<HTMLDivElement>(null);

  function goTo(screen: ScreenId, focusMain = true) {
    setActiveScreen(screen);
    window.requestAnimationFrame(() => {
      if (focusMain) {
        document.querySelector<HTMLElement>("[data-design-screen]")?.focus({ preventScroll: true });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function handleTabsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = screens.findIndex((screen) => screen.id === activeScreen);
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? screens.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + screens.length) % screens.length;
    goTo(screens[next].id, false);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }

  return (
    <div className={styles.lab} data-theme-preserve="dark">
      <a className={styles.skipLink} href="#design-lab-main">К содержанию</a>
      <div className={styles.ambient} aria-hidden="true"><span /><span /><span /></div>

      <header className={styles.shellHeader}>
        <LabMark />
        <div
          className={styles.screenTabs}
          role="tablist"
          aria-label="Экраны прототипа"
          ref={tabsRef}
          onKeyDown={handleTabsKeyDown}
        >
          {screens.map((screen) => {
            const Icon = screenIcons[screen.id];
            return (
              <button
                key={screen.id}
                type="button"
                role="tab"
                aria-selected={activeScreen === screen.id}
                aria-controls="design-lab-main"
                tabIndex={activeScreen === screen.id ? 0 : -1}
                onClick={() => goTo(screen.id, false)}
              >
                <span>{screen.number}</span>
                <Icon size={16} weight="duotone" aria-hidden="true" />
                <strong>{screen.shortLabel}</strong>
              </button>
            );
          })}
        </div>
        <p className={styles.headerTopic}><span>Тема 04</span>Кинематика</p>
      </header>

      <main
        id="design-lab-main"
        className={styles.main}
        data-design-screen={activeScreen}
        tabIndex={-1}
      >
        <div key={activeScreen} className={styles.screenTransition}>
          {activeScreen === "hub" ? <HubScreen goTo={goTo} /> : null}
          {activeScreen === "theory" ? <TheoryScreen goTo={goTo} /> : null}
          {activeScreen === "practice" ? <PracticeScreen goTo={goTo} /> : null}
          {activeScreen === "results" ? <ResultsScreen goTo={goTo} /> : null}
        </div>
      </main>

      <footer className={styles.shellFooter}>
        <span>PhysicsLab · интерактивный эскиз</span>
        <span>Скорость при равнопеременном движении · СИ</span>
      </footer>
    </div>
  );
}
