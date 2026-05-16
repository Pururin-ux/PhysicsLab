/**
 * Живая демонстрация FormulaCard: цикл v > 0 → v = 0 → v < 0.
 * Без ползунков и без паузы при наведении.
 */

export type FormulaMotionState = "forward" | "still" | "backward";

type StateCopy = {
  title: string;
  sub: string;
  hint: string;
  insight: string;
  plotPoints: string;
  dotX: number;
  dotY: number;
  vReadout: string;
  activeChip: FormulaMotionState;
};

const STATE_ORDER: FormulaMotionState[] = ["forward", "still", "backward"];

const STATE_COPY: Record<FormulaMotionState, StateCopy> = {
  forward: {
    title: "Скорость v > 0",
    sub: "Координата растёт — линия x(t) идёт вверх",
    hint: "Положительная v добавляет путь vt к старту x₀.",
    insight: "Наклон прямой на x(t) равен скорости v.",
    plotPoints: "10,46 110,16",
    dotX: 10,
    dotY: 46,
    vReadout: "v = +5 м/с",
    activeChip: "forward"
  },
  still: {
    title: "Скорость v = 0",
    sub: "Координата не меняется — линия горизонтальна",
    hint: "При v = 0 остаётся только x = x₀.",
    insight: "Горизонталь на x(t) — нулевая скорость.",
    plotPoints: "10,30 110,30",
    dotX: 10,
    dotY: 30,
    vReadout: "v = 0 м/с",
    activeChip: "still"
  },
  backward: {
    title: "Скорость v < 0",
    sub: "Координата убывает — линия x(t) идёт вниз",
    hint: "Отрицательная v уменьшает координату со временем.",
    insight: "Наклон вниз — скорость с минусом.",
    plotPoints: "10,16 110,46",
    dotX: 10,
    dotY: 16,
    vReadout: "v = −5 м/с",
    activeChip: "backward"
  }
};

const STEP_HIGHLIGHT_ORDER = ["x0", "vt", "x"] as const;

export function initFormulaCardExperiment(
  root: HTMLElement | null
): (() => void) | undefined {
  if (!root) return undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const statusTitle = root.querySelector<HTMLElement>("[data-fce-status-title]");
  const statusSub = root.querySelector<HTMLElement>("[data-fce-status-sub]");
  const hint = root.querySelector<HTMLElement>("[data-fce-hint]");
  const insight = root.querySelector<HTMLElement>("[data-fce-insight]");
  const vToken = root.querySelector<HTMLElement>("[data-fce-v-token]");
  const plot = root.querySelector<SVGPolylineElement>("[data-fce-plot]");
  const plotDot = root.querySelector<SVGCircleElement>("[data-fce-plot-dot]");
  const chips = root.querySelectorAll<HTMLElement>("[data-fce-chip]");

  let stateIndex = 0;
  let stepIndex = 0;
  let motionTimer = 0;
  let stepTimer = 0;

  const applyState = (state: FormulaMotionState) => {
    const copy = STATE_COPY[state];
    root.dataset.motionState = state;

    if (statusTitle) statusTitle.textContent = copy.title;
    if (statusSub) statusSub.textContent = copy.sub;
    if (hint) hint.textContent = copy.hint;
    if (insight) insight.textContent = copy.insight;
    if (vToken) vToken.textContent = copy.vReadout;

    if (plot) plot.setAttribute("points", copy.plotPoints);
    if (plotDot) {
      plotDot.setAttribute("cx", String(copy.dotX));
      plotDot.setAttribute("cy", String(copy.dotY));
    }

    chips.forEach((chip) => {
      const active = chip.dataset.fceChip === copy.activeChip;
      chip.classList.toggle("formula-card-experiment__chip--live", active);
      if (active) chip.setAttribute("aria-current", "true");
      else chip.removeAttribute("aria-current");
    });
  };

  const clearStepHighlight = () => {
    root.querySelectorAll<HTMLElement>("[data-fce-part]").forEach((part) => {
      part.classList.remove("formula-card-experiment__part--pulse");
    });
  };

  const runStepHighlight = () => {
    if (reducedMotion.matches) return;

    clearStepHighlight();
    const partName = STEP_HIGHLIGHT_ORDER[stepIndex];
    root
      .querySelector<HTMLElement>(`[data-fce-part="${partName}"]`)
      ?.classList.add("formula-card-experiment__part--pulse");
    stepIndex = (stepIndex + 1) % STEP_HIGHLIGHT_ORDER.length;
  };

  const advanceState = () => {
    stateIndex = (stateIndex + 1) % STATE_ORDER.length;
    applyState(STATE_ORDER[stateIndex]);
  };

  const scheduleMotion = () => {
    window.clearInterval(motionTimer);
    applyState(STATE_ORDER[stateIndex]);

    if (reducedMotion.matches) return;

    motionTimer = window.setInterval(advanceState, 4500);
  };

  const scheduleSteps = () => {
    window.clearInterval(stepTimer);
    if (reducedMotion.matches) return;

    stepTimer = window.setInterval(runStepHighlight, 1500);
  };

  const onReducedMotionChange = () => {
    stateIndex = 0;
    stepIndex = 0;
    clearStepHighlight();
    scheduleMotion();
    scheduleSteps();
  };

  root.addEventListener("click", () => {
    if (!reducedMotion.matches) return;
    advanceState();
  });

  const boot = () => {
    scheduleMotion();
    scheduleSteps();
  };

  boot();
  reducedMotion.addEventListener("change", onReducedMotionChange);
  document.addEventListener("astro:page-load", boot);

  return () => {
    window.clearInterval(motionTimer);
    window.clearInterval(stepTimer);
    reducedMotion.removeEventListener("change", onReducedMotionChange);
    document.removeEventListener("astro:page-load", boot);
  };
}
